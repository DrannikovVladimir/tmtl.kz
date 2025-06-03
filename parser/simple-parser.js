const fs = require('fs').promises;
const path = require('path');
const Logger = require('./logger');
const SimpleTelegramClient = require('./simple-telegram-client');

class SimpleTelegramParser {
  constructor(config) {
    this.config = {
      apiId: config.apiId,
      apiHash: config.apiHash,
      phoneNumber: config.phoneNumber,
      sessionString: config.sessionString,
      maxParticipants: config.maxParticipants || 5000, // Уменьшили лимит
      batchSize: config.batchSize || 100, // Уменьшили размер батча
      delay: config.delay || 3000, // Увеличили задержку
      filterInactiveUsers: config.filterInactiveUsers !== false,
      ...config
    };

    // Инициализируем компоненты
    this.logger = new Logger();
    this.telegramClient = null;
    
    // Состояние парсинга
    this.isRunning = false;
    this.currentChannel = null;
    this.results = {
      total: 0,
      active: 0,
      filtered: 0,
      errors: 0,
      startTime: null,
      endTime: null,
      participants: []
    };

    // Путь для сохранения результатов
    this.resultsPath = path.join(__dirname, '..', 'data', 'subscribers.json');
  }

  /**
   * Инициализация парсера
   */
  async initialize() {
    try {
      await this.logger.info('🚀 Инициализация простого парсера (без прокси)...');
      
      // Загружаем логи
      await this.logger.loadLogs();

      // Создаём Telegram клиент БЕЗ прокси
      this.telegramClient = new SimpleTelegramClient(
        this.config.apiId,
        this.config.apiHash,
        this.config.phoneNumber,
        this.config.sessionString,
        this.logger
      );

      await this.logger.success('✅ Простой парсер инициализирован');
      return true;

    } catch (error) {
      await this.logger.error('❌ Ошибка инициализации парсера', {
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Основной метод парсинга канала
   */
  async parseChannel(channelUrl, options = {}) {
    if (this.isRunning) {
      throw new Error('Парсинг уже запущен');
    }

    try {
      this.isRunning = true;
      this.currentChannel = channelUrl;
      this.results = {
        total: 0,
        active: 0,
        filtered: 0,
        errors: 0,
        startTime: new Date(),
        endTime: null,
        participants: []
      };

      // Объединяем опции с конфигом
      const parseOptions = { ...this.config, ...options };

      await this.logger.startParsing(channelUrl, parseOptions);

      // Подключаемся к Telegram
      await this.telegramClient.connect();

      // Получаем информацию о канале
      const { entity, info } = await this.telegramClient.getChannelInfo(channelUrl);
      
      await this.logger.info('📊 Информация о канале', info);

      // Получаем участников
      const rawParticipants = await this.telegramClient.getChannelParticipants(entity, {
        limit: parseOptions.batchSize,
        maxTotal: parseOptions.maxParticipants,
        delay: parseOptions.delay
      });

      this.results.total = rawParticipants.length;

      // Обрабатываем каждого участника
      await this.logger.info('🔍 Начинаем обработку участников...');

      for (let i = 0; i < rawParticipants.length; i++) {
        const rawUser = rawParticipants[i];
        
        try {
          // Получаем подробную информацию о пользователе
          const userInfo = await this.telegramClient.getUserInfo(rawUser);
          
          if (!userInfo) {
            this.results.errors++;
            continue;
          }

          await this.logger.subscriberFound(userInfo, i + 1, rawParticipants.length);

          // Применяем фильтры
          const shouldInclude = this.shouldIncludeUser(userInfo, parseOptions);
          
          if (shouldInclude.include) {
            this.results.active++;
            this.results.participants.push({
              ...userInfo,
              addedAt: new Date().toISOString(),
              channel: channelUrl
            });
          } else {
            this.results.filtered++;
            await this.logger.subscriberFiltered(userInfo, shouldInclude.reason);
          }

          // Небольшая пауза между обработкой пользователей
          if (i % 10 === 0 && i > 0) {
            await this.delay(500);
          }

        } catch (error) {
          this.results.errors++;
          await this.logger.error('❌ Ошибка обработки пользователя', {
            userId: rawUser.id,
            error: error.message
          });
        }
      }

      // Сохраняем результаты
      await this.saveResults();

      // Завершаем парсинг
      this.results.endTime = new Date();
      const duration = this.results.endTime - this.results.startTime;

      const finalStats = {
        ...this.results,
        duration: Math.round(duration / 1000),
        channelInfo: info
      };

      await this.logger.finishParsing(finalStats);

      return finalStats;

    } catch (error) {
      await this.logger.error('❌ Критическая ошибка парсинга', {
        channelUrl,
        error: error.message
      });
      throw error;

    } finally {
      this.isRunning = false;
      
      // Отключаемся от Telegram
      if (this.telegramClient) {
        await this.telegramClient.disconnect();
      }
    }
  }

  /**
   * Проверяет, нужно ли включать пользователя в результаты
   */
  shouldIncludeUser(userInfo, options) {
    // Пропускаем ботов
    if (userInfo.isBot) {
      return { include: false, reason: 'Это бот' };
    }

    // Пропускаем удалённые аккаунты
    if (userInfo.isDeleted) {
      return { include: false, reason: 'Удалённый аккаунт' };
    }

    // Фильтр по активности за последний год
    if (options.filterInactiveUsers) {
      const isActive = this.telegramClient.isUserActiveLastYear(userInfo);
      if (!isActive) {
        return { include: false, reason: 'Неактивен более года' };
      }
    }

    return { include: true, reason: 'Прошёл все фильтры' };
  }

  /**
   * Сохранение результатов в файл
   */
  async saveResults() {
    try {
      const data = {
        parseInfo: {
          channel: this.currentChannel,
          timestamp: new Date().toISOString(),
          stats: {
            total: this.results.total,
            active: this.results.active,
            filtered: this.results.filtered,
            errors: this.results.errors
          }
        },
        participants: this.results.participants
      };

      await fs.writeFile(this.resultsPath, JSON.stringify(data, null, 2));
      
      await this.logger.success('💾 Результаты сохранены', {
        file: this.resultsPath,
        count: this.results.participants.length
      });

    } catch (error) {
      await this.logger.error('❌ Ошибка сохранения результатов', {
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Получение текущего статуса парсинга
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      currentChannel: this.currentChannel,
      results: this.results,
      connectionStats: this.telegramClient ? this.telegramClient.getConnectionStats() : null,
      config: {
        maxParticipants: this.config.maxParticipants,
        batchSize: this.config.batchSize,
        delay: this.config.delay,
        filterInactiveUsers: this.config.filterInactiveUsers
      }
    };
  }

  /**
   * Остановка парсинга
   */
  async stopParsing() {
    if (!this.isRunning) {
      return false;
    }

    await this.logger.warning('⏹️ Принудительная остановка парсинга');
    this.isRunning = false;

    if (this.telegramClient) {
      await this.telegramClient.disconnect();
    }

    return true;
  }

  /**
   * Задержка
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Остальные методы остаются те же (loadResults, exportResults, clearData и т.д.)
  async loadResults() {
    try {
      const data = await fs.readFile(this.resultsPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }

  async clearData() {
    try {
      this.results = {
        total: 0,
        active: 0,
        filtered: 0,
        errors: 0,
        startTime: null,
        endTime: null,
        participants: []
      };

      try {
        await fs.unlink(this.resultsPath);
      } catch (error) {
        // Файл может не существовать
      }

      await this.logger.clearLogs();
      await this.logger.success('🗑️ Все данные очищены');
      return true;

    } catch (error) {
      await this.logger.error('❌ Ошибка очистки данных', {
        error: error.message
      });
      return false;
    }
  }
}

module.exports = SimpleTelegramParser;