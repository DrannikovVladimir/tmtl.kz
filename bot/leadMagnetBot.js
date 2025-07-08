// bot/leadMagnetBot.js

const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// Импортируем сервисы
const SubscriptionService = require('./services/subscriptionService');
const FileService = require('./services/fileService');
const NotificationService = require('./services/notificationService');

// Импортируем обработчики
const { handleStart } = require('./handlers/startHandler');
const { handleCallbackQuery } = require('./handlers/callbackHandler');
const { handleMessage } = require('./handlers/messageHandler');

// Импортируем утилиты
const analytics = require('./utils/analytics');
const { log, getUserName, safeSendMessage  } = require('./utils/helpers');

// Импортируем шаблоны
const { helpMessage, unknownCommandMessage } = require('./templates/messages');

/**
 * Главный класс лид-магнит бота
 */
class LeadMagnetBot {
  constructor() {
    this.token = process.env.LEAD_MAGNET_BOT_TOKEN;
    this.channelId = process.env.LEAD_MAGNET_CHANNEL_ID;
    
    this.validateConfig();
    this.initializeBot();
    this.initializeServices();
    this.setupHandlers();
    
    log('info', '🤖 Лид-магнит бот инициализирован');
  }

  /**
   * Валидация конфигурации
   */
  validateConfig() {
    if (!this.token) {
      throw new Error('LEAD_MAGNET_BOT_TOKEN не найден в переменных окружения');
    }

    if (!this.channelId) {
      throw new Error('LEAD_MAGNET_CHANNEL_ID не найден в переменных окружения');
    }

    log('info', '📡 Токен найден:', this.token.substring(0, 10) + '...');
    log('info', '📢 Канал:', this.channelId);
  }

  /**
   * Инициализация бота
   */
  initializeBot() {
    this.bot = new TelegramBot(this.token, { polling: true });
    
    // Обработчики ошибок
    this.bot.on('error', (error) => {
      log('error', 'Ошибка бота:', error);
    });

    this.bot.on('polling_error', (error) => {
      log('error', 'Ошибка polling:', error);
    });
  }

  /**
   * Инициализация сервисов
   */
  initializeServices() {
    this.subscriptionService = new SubscriptionService(this.bot);
    this.fileService = new FileService();
    this.notificationService = new NotificationService();
    
    log('info', '⚙️ Сервисы инициализированы');
  }

  /**
   * Настройка обработчиков событий
   */
  setupHandlers() {
    // Команда /start
    this.bot.onText(/\/start/, async (msg) => {
      this.recordInteraction(msg, 'start_command');
      await handleStart(this.bot, msg, {
        subscriptionService: this.subscriptionService,
        fileService: this.fileService
      });
    });

    // Команда /help
    this.bot.onText(/\/help/, async (msg) => {
      this.recordInteraction(msg, 'help_command');
      await safeSendMessage(this.bot, msg.chat.id, helpMessage, {
        parse_mode: 'HTML'  // ИСПРАВЛЕНО: изменено с Markdown на HTML
      });
    });

    // Команда /check для тестирования
    this.bot.onText(/\/check/, async (msg) => {
      this.recordInteraction(msg, 'check_command');
      await this.handleCheckCommand(msg);
    });

    // Обработка callback кнопок
    this.bot.on('callback_query', async (query) => {
      this.recordInteraction(query.message, 'callback_query', { data: query.data });
      await handleCallbackQuery(this.bot, query, {
        subscriptionService: this.subscriptionService,
        fileService: this.fileService
      });
    });

    // Обработка всех сообщений
    this.bot.on('message', async (msg) => {
      // Пропускаем команды (они обрабатываются отдельно)
      if (msg.text && msg.text.startsWith('/')) {
        // Проверяем неизвестные команды
        if (!this.isKnownCommand(msg.text)) {
          await safeSendMessage(this.bot, msg.chat.id, unknownCommandMessage);
        }
        return;
      }
      
      this.recordInteraction(msg, 'message');
      await handleMessage(this.bot, msg, {
        notificationService: this.notificationService
      });
    });

    log('info', '🎯 Обработчики событий настроены');
  }

  /**
   * Обработка команды /check
   */
  async handleCheckCommand(msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const userName = getUserName(msg.from);
    
    log('info', `🔍 Команда /check от пользователя ${userName} (ID: ${userId})`);
    
    try {
      const result = await this.subscriptionService.checkSubscription(userId);
      
      if (result.isSubscribed) {
        await safeSendMessage(this.bot, chatId, 
          '✅ Отлично! Вы подписаны на канал. Можете получить лид-магнит командой /start'
        );
        log('info', `✅ Пользователь ${userName} подписан`);
      } else {
        await safeSendMessage(this.bot, chatId, 
          `❌ Вы не подписаны на канал ${this.channelId}. Сначала подпишитесь, а затем повторите проверку.`
        );
        log('info', `❌ Пользователь ${userName} не подписан`);
      }
    } catch (error) {
      log('error', 'Ошибка при команде /check:', error);
      await safeSendMessage(this.bot, chatId, 
        '❌ Произошла ошибка при проверке подписки. Попробуйте позже.'
      );
    }
  }

  /**
   * Проверяет, является ли команда известной
   */
  isKnownCommand(command) {
    const knownCommands = ['/start', '/help', '/check'];
    const commandName = command.split(' ')[0].toLowerCase();
    return knownCommands.includes(commandName);
  }

  /**
   * Записывает взаимодействие пользователя для аналитики
   */
  recordInteraction(msg, type, additionalData = {}) {
    try {
      const interactionData = {
        userId: msg.from.id,
        userName: getUserName(msg.from),
        chatId: msg.chat.id,
        type,
        messageId: msg.message_id,
        ...additionalData
      };

      analytics.recordUserInteraction(interactionData);
    } catch (error) {
      log('error', 'Ошибка записи взаимодействия:', error);
    }
  }

  /**
   * Получает статистику бота
   */
  async getStats() {
    try {
      const stats = analytics.getGeneralStats();
      const downloadStats = analytics.getDownloadStats();
      const callbackStats = analytics.getCallbackStats();
      
      return {
        general: stats,
        downloads: downloadStats,
        callbacks: callbackStats,
        fileInfo: this.fileService.getFileInfo()
      };
    } catch (error) {
      log('error', 'Ошибка получения статистики:', error);
      return { error: error.message };
    }
  }

  /**
   * Отправляет статистику администратору
   */
  async sendStatsToAdmin() {
    try {
      const stats = await this.getStats();
      
      const statsMessage = `
📊 **Статистика лид-магнит бота**

👥 **Общее:**
• Всего пользователей: ${stats.general.totalUsers}
• Скачиваний: ${stats.general.totalDownloads}
• Заявок на звонки: ${stats.general.totalCallbacks}
• Конверсия: ${stats.general.conversionRate}

📥 **За 30 дней:**
• Скачиваний: ${stats.downloads.recentDownloads}
• Заявок: ${stats.callbacks.recentRequests}
• Среднее в день: ${stats.downloads.averagePerDay}

📁 **Файл:**
• Размер: ${stats.fileInfo.sizeInMB} MB
• Доступен: ${stats.fileInfo.exists ? '✅' : '❌'}

🕐 Обновлено: ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' })}
      `;

      await this.notificationService.sendGeneralNotification(
        this.bot, 
        statsMessage
      );
      
      log('info', 'Статистика отправлена администратору');
    } catch (error) {
      log('error', 'Ошибка отправки статистики:', error);
    }
  }

  /**
   * Останавливает бота
   */
  stop() {
    if (this.bot) {
      this.bot.stopPolling();
      log('info', '🛑 Бот остановлен');
    }
  }
}

// Создаем и экспортируем экземпляр бота
const leadMagnetBotInstance = new LeadMagnetBot();

// Экспортируем для использования в других модулях
module.exports = {
  leadMagnetBot: leadMagnetBotInstance.bot,
  LeadMagnetBot,
  instance: leadMagnetBotInstance
};

// Если файл запущен напрямую
if (require.main === module) {
  log('info', '🚀 Лид-магнит бот запущен напрямую');
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    log('info', '🛑 Получен сигнал остановки');
    leadMagnetBotInstance.stop();
    process.exit(0);
  });
}