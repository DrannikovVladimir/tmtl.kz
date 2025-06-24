// bot/services/subscriptionService.js

const { LEAD_MAGNET_CHANNEL_ID } = require('../../config');

/**
 * Сервис для работы с подписками на канал
 */
class SubscriptionService {
  constructor(bot) {
    this.bot = bot;
    this.channelId = LEAD_MAGNET_CHANNEL_ID;
  }

  /**
   * Проверяет подписку пользователя на канал
   * @param {Number} userId - ID пользователя в Telegram
   * @returns {Object} - Результат проверки подписки
   */
  async checkSubscription(userId) {
    try {
      console.log(`🔍 Проверяем подписку пользователя ${userId} на канал ${this.channelId}`);
      
      const chatMember = await this.bot.getChatMember(this.channelId, userId);
      console.log(`📊 Статус пользователя: ${chatMember.status}`);
      
      // Статусы подписки: 'creator', 'administrator', 'member', 'restricted', 'left', 'kicked'
      const isSubscribed = ['creator', 'administrator', 'member'].includes(chatMember.status);
      
      return {
        isSubscribed,
        status: chatMember.status,
        userInfo: isSubscribed ? {
          id: chatMember.user.id,
          username: chatMember.user.username,
          firstName: chatMember.user.first_name,
          lastName: chatMember.user.last_name,
          status: chatMember.status
        } : null
      };
      
    } catch (error) {
      console.error('❌ Ошибка при проверке подписки:', error);
      
      // В случае ошибки считаем, что пользователь не подписан
      return {
        isSubscribed: false,
        status: 'error',
        error: error.message,
        userInfo: null
      };
    }
  }

  /**
   * Проверяет подписку по username (для веб-интерфейса)
   * @param {String} username - Username пользователя (без @)
   * @returns {Object} - Результат проверки подписки
   */
  async checkSubscriptionByUsername(username) {
    try {
      // Убираем @ если он есть в начале
      const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
      
      if (!cleanUsername) {
        return {
          isSubscribed: false,
          error: 'Username не может быть пустым'
        };
      }

      console.log(`🔍 Попытка проверки подписки для @${cleanUsername} на канал ${this.channelId}`);
      
      // Сначала пытаемся найти пользователя через поиск
      let userId;
      try {
        const chat = await this.bot.getChat(`@${cleanUsername}`);
        userId = chat.id;
        console.log(`✅ Найден пользователь: ${chat.first_name} ${chat.last_name || ''} (ID: ${userId})`);
      } catch (error) {
        console.log(`❌ Не удалось найти пользователя @${cleanUsername}:`, error.message);
        
        return {
          isSubscribed: false,
          error: 'Пользователь не найден или настройки приватности закрыты'
        };
      }

      // Теперь проверяем подписку по user_id
      return await this.checkSubscription(userId);
      
    } catch (error) {
      console.error('❌ Общая ошибка при проверке подписки по username:', error);
      return {
        isSubscribed: false,
        error: 'Произошла ошибка при проверке подписки'
      };
    }
  }
}

module.exports = SubscriptionService;