
const fs = require('fs').promises;
const path = require('path');
const ProxyManager = require('./proxy-manager');
const Logger = require('./logger');
const TelegramClient = require('./telegram-client');

class TelegramParser {
  constructor(config) {
    this.config = {
      apiId: config.apiId,
      apiHash: config.apiHash,
      phoneNumber: config.phoneNumber,
      maxParticipants: config.maxParticipants || 10000,
      batchSize: config.batchSize || 200,
      delay: config.delay || 2000,
      filterInactiveUsers: config.filterInactiveUsers !== false, // По умолчанию включено
      ...config
    };

    // Инициализируем компоненты
    this.logger = new Logger();
    this.proxyManager = new ProxyManager();
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
      await this.logger.info('🚀 Инициализация парсера...');
      
      // Загружаем логи
      await this.logger.loadLogs();
      
      // Загружаем прокси
      const proxySuccess = await this.proxyManager.loadProxies();
      if (!proxySuccess) {
        throw new Error('Не удалось загрузить прокси');
      }

      // Создаём Telegram клиент
      this.telegramClient = new TelegramClient(
        this.config.apiId,
        this.config.apiHash,
        this.config.phoneNumber,
        this.logger,
        this.proxyManager
      );

      await this.logger.success('✅ Парсер инициализирован');
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

      // Проверяем тип канала
      if (!info.isChannel) {
        await this.logger.warning('⚠️ Это не канал, а группа. Парсинг может работать по-другому');
      }

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
          if (i % 10 === 0) {
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

    // Можно добавить дополнительные фильтры
    // Например, по наличию username
    if (options.requireUsername && !userInfo.username) {
      return { include: false, reason: 'Нет username' };
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
   * Загрузка сохранённых результатов
   */
  async loadResults() {
    try {
      const data = await fs.readFile(this.resultsPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return null;
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
      proxyStats: this.proxyManager.getStats(),
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
   * Экспорт результатов в разных форматах
   */
  async exportResults(format = 'json') {
    const results = await this.loadResults();
    if (!results) {
      throw new Error('Нет сохранённых результатов');
    }

    switch (format.toLowerCase()) {
      case 'json':
        return results;

      case 'csv':
        return this.exportToCSV(results.participants);

      case 'txt':
        return this.exportToTXT(results.participants);

      default:
        throw new Error('Неподдерживаемый формат экспорта');
    }
  }

  /**
   * Экспорт в CSV формат
   */
  exportToCSV(participants) {
    const headers = ['ID', 'Username', 'First Name', 'Last Name', 'Phone', 'Last Seen Status', 'Added At'];
    const rows = participants.map(p => [
      p.id,
      p.username || '',
      p.firstName || '',
      p.lastName || '',
      p.phone || '',
      p.lastSeenStatus || '',
      p.addedAt || ''
    ]);

    return [headers, ...rows].map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  }

  /**
   * Экспорт в TXT формат
   */
  exportToTXT(participants) {
    let output = 'TELEGRAM CHANNEL SUBSCRIBERS\n';
    output += '============================\n\n';

    participants.forEach((p, index) => {
      output += `${index + 1}. ${p.firstName} ${p.lastName}`.trim() + '\n';
      output += `   ID: ${p.id}\n`;
      if (p.username) output += `   Username: @${p.username}\n`;
      if (p.phone) output += `   Phone: ${p.phone}\n`;
      output += `   Last seen: ${p.lastSeenStatus}\n`;
      output += `   Added: ${p.addedAt}\n\n`;
    });

    return output;
  }

  /**
   * Очистка всех данных
   */
  async clearData() {
    try {
      // Очищаем результаты
      this.results = {
        total: 0,
        active: 0,
        filtered: 0,
        errors: 0,
        startTime: null,
        endTime: null,
        participants: []
      };

      // Удаляем файл результатов
      try {
        await fs.unlink(this.resultsPath);
      } catch (error) {
        // Файл может не существовать
      }

      // Очищаем логи
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

  /**
   * Задержка
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = TelegramParser;