// bot/services/notificationService.js

/**
 * Сервис для отправки уведомлений администратору
 */
class NotificationService {
  constructor() {
    this.adminChatId = process.env.ADMIN_TELEGRAM_ID || '6027098142';
  }

  /**
   * Отправляет уведомление о новой заявке на обратный звонок
   * @param {Object} bot - экземпляр Telegram бота
   * @param {Object} data - данные заявки
   */
  async sendCallbackNotification(bot, data) {
    try {
      const date = new Date(data.requestedAt);
      const timeString = date.toLocaleString('ru-RU', {
        timeZone: 'Asia/Almaty',
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Экранируем HTML символы
      const escapeHtml = (text) => {
        if (!text) return '';
        return text.toString()
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      };

      // Простое сообщение без HTML разметки
      const notificationMessage = `
🔔 Новая заявка на обратный звонок!

👤 Клиент: ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName || '')}
📞 Телефон: ${data.phoneNumber}
👤 Username: ${data.userName ? '@' + data.userName : 'не указан'}
🆔 ID: ${data.userId}
🕐 Время: ${timeString}

💡 Действия:
• Позвонить клиенту
• Уточнить потребности
• Предложить подходящие туры
      `;

      await bot.sendMessage(this.adminChatId, notificationMessage);
      
      console.log(`🔔 Уведомление отправлено администратору`);
      
    } catch (error) {
      console.error('❌ Ошибка при отправке уведомления администратору:', error);
      console.log('📝 Данные заявки для ручной обработки:', JSON.stringify(data, null, 2));
    }
  }

  /**
   * Отправляет уведомление о скачивании лид-магнита
   * @param {Object} bot - экземпляр Telegram бота
   * @param {Object} data - данные о скачивании
   */
  async sendDownloadNotification(bot, data) {
    try {
      const date = new Date(data.downloadedAt);
      const timeString = date.toLocaleString('ru-RU', {
        timeZone: 'Asia/Almaty',
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const notificationMessage = `
📖 <b>Скачан лид-магнит!</b>

👤 <b>Пользователь:</b> ${data.userName}
🆔 <b>ID:</b> <code>${data.userId}</code>
🕐 <b>Время:</b> ${timeString}
📱 <b>Источник:</b> ${data.source}

📊 <b>Новый лид в воронке продаж!</b>
      `;

      await bot.sendMessage(this.adminChatId, notificationMessage, {
        parse_mode: 'HTML'
      });
      
      console.log(`📊 Уведомление о скачивании отправлено администратору`);
      
    } catch (error) {
      console.error('❌ Ошибка при отправке уведомления о скачивании:', error);
    }
  }

  /**
   * Отправляет общее уведомление администратору
   * @param {Object} bot - экземпляр Telegram бота
   * @param {String} message - текст сообщения
   * @param {Object} options - дополнительные опции
   */
  async sendGeneralNotification(bot, message, options = {}) {
    try {
      await bot.sendMessage(this.adminChatId, message, {
        parse_mode: 'HTML',
        ...options
      });
      
      console.log(`📢 Общее уведомление отправлено администратору`);
      
    } catch (error) {
      console.error('❌ Ошибка при отправке общего уведомления:', error);
    }
  }

  /**
   * Проверяет доступность админ чата
   * @param {Object} bot - экземпляр Telegram бота
   * @returns {Boolean} - доступность
   */
  async checkAdminAvailability(bot) {
    try {
      await bot.sendChatAction(this.adminChatId, 'typing');
      return true;
    } catch (error) {
      console.error('❌ Админ чат недоступен:', error);
      return false;
    }
  }
}

module.exports = NotificationService;