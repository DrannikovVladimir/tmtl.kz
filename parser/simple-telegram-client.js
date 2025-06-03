const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { Api } = require('telegram/tl');

class SimpleTelegramClient {
  constructor(apiId, apiHash, phoneNumber, sessionString, logger) {
    this.apiId = apiId;
    this.apiHash = apiHash;
    this.phoneNumber = phoneNumber;
    this.logger = logger;
    this.client = null;
    this.isConnected = false;
    this.session = new StringSession(sessionString || '');
  }

  async connect() {
    try {
      await this.logger.info('🔌 Подключение к Telegram API (без прокси)...');

      // Используем TelegramClient вместо TelegramApi
      this.client = new TelegramClient(this.session, this.apiId, this.apiHash, {
        connectionRetries: 5,
        retryDelay: 2000,
        timeout: 30000,
      });

      await this.client.start({
        phoneNumber: this.phoneNumber,
        password: async () => {
          throw new Error('Двухфакторная аутентификация не поддерживается');
        },
        phoneCode: async () => {
          throw new Error('Требуется код подтверждения');
        },
        onError: (err) => console.log(err),
      });

      this.isConnected = true;
      await this.logger.success('✅ Подключение к Telegram API успешно');
      
      return true;
    } catch (error) {
      await this.logger.error('❌ Ошибка подключения к Telegram API', {
        error: error.message
      });
      throw error;
    }
  }

  async getChannelInfo(channelUrl) {
    try {
      await this.logger.info('📋 Получение информации о канале', { channelUrl });

      const username = this.extractChannelUsername(channelUrl);
      const entity = await this.client.getEntity(username);
      
      const channelInfo = {
        id: entity.id.toString(),
        title: entity.title,
        username: entity.username,
        participantsCount: entity.participantsCount || 0,
        about: entity.about || '',
        isChannel: entity.className === 'Channel',
        isGroup: entity.className === 'Chat' || entity.className === 'ChatForbidden'
      };

      await this.logger.success('✅ Информация о канале получена', channelInfo);
      
      return { entity, info: channelInfo };
    } catch (error) {
      await this.logger.error('❌ Ошибка получения информации о канале', {
        channelUrl,
        error: error.message
      });
      throw error;
    }
  }

  extractChannelUsername(channelUrl) {
    if (channelUrl.startsWith('@')) {
      return channelUrl;
    }
    
    if (channelUrl.includes('t.me/')) {
      const match = channelUrl.match(/t\.me\/([^/?]+)/);
      return match ? `@${match[1]}` : channelUrl;
    }
    
    return `@${channelUrl}`;
  }

  async getChannelParticipants(entity, options = {}) {
    const { limit = 100, maxTotal = 1000, delay = 3000 } = options;

    try {
      await this.logger.info('👥 Начало получения участников канала', { limit, maxTotal, delay });

      const allParticipants = [];
      let offset = 0;
      let totalFetched = 0;

      while (totalFetched < maxTotal) {
        try {
          await this.logger.info(`📥 Запрос участников: offset=${offset}, limit=${limit}`);

          const result = await this.client.invoke(
            new Api.channels.GetParticipants({
              channel: entity,
              filter: new Api.ChannelParticipantsRecent(),
              offset,
              limit: Math.min(limit, maxTotal - totalFetched),
              hash: 0
            })
          );

          const participants = result.participants || [];
          
          if (participants.length === 0) {
            await this.logger.info('📭 Больше участников не найдено');
            break;
          }

          const users = result.users || [];
          const usersMap = {};
          users.forEach(user => {
            usersMap[user.id.toString()] = user;
          });

          for (const participant of participants) {
            const userId = participant.userId || participant.peerId?.userId;
            if (userId && usersMap[userId.toString()]) {
              allParticipants.push(usersMap[userId.toString()]);
              totalFetched++;
            }
          }

          await this.logger.success(`✅ Получено ${participants.length} участников (всего: ${totalFetched})`);

          offset += participants.length;

          if (totalFetched < maxTotal) {
            await this.logger.info(`⏳ Ожидание ${delay}ms...`);
            await this.delay(delay);
          }

        } catch (error) {
          await this.logger.warning('⚠️ Ошибка при получении порции участников', {
            offset,
            error: error.message
          });
          
          if (error.message.includes('FLOOD_WAIT')) {
            const waitTime = this.extractFloodWaitTime(error.message) || 60;
            await this.logger.warning(`⏳ FLOOD_WAIT: ожидание ${waitTime} секунд...`);
            await this.delay(waitTime * 1000);
            continue;
          }

          await this.delay(delay * 2);
          throw error;
        }
      }

      await this.logger.success('✅ Получение участников завершено', {
        totalParticipants: allParticipants.length
      });

      return allParticipants;

    } catch (error) {
      await this.logger.error('❌ Ошибка получения участников', {
        error: error.message
      });
      throw error;
    }
  }

  extractFloodWaitTime(errorMessage) {
    const match = errorMessage.match(/FLOOD_WAIT_(\d+)/);
    return match ? parseInt(match[1]) : null;
  }

  async getUserInfo(user) {
    try {
      const userInfo = {
        id: user.id.toString(),
        username: user.username || null,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || null,
        isBot: user.bot || false,
        isDeleted: user.deleted || false,
        isPremium: user.premium || false,
        lastSeenTimestamp: null,
        lastSeenStatus: 'unknown'
      };

      if (user.status) {
        switch (user.status.className) {
          case 'UserStatusOnline':
            userInfo.lastSeenStatus = 'online';
            userInfo.lastSeenTimestamp = Date.now();
            break;
          case 'UserStatusOffline':
            userInfo.lastSeenStatus = 'offline';
            userInfo.lastSeenTimestamp = user.status.wasOnline * 1000;
            break;
          case 'UserStatusRecently':
            userInfo.lastSeenStatus = 'recently';
            break;
          case 'UserStatusLastWeek':
            userInfo.lastSeenStatus = 'last_week';
            break;
          case 'UserStatusLastMonth':
            userInfo.lastSeenStatus = 'last_month';
            break;
          default:
            userInfo.lastSeenStatus = 'unknown';
        }
      }

      return userInfo;

    } catch (error) {
      await this.logger.error('❌ Ошибка получения информации о пользователе', {
        userId: user.id,
        error: error.message
      });
      return null;
    }
  }

  isUserActiveLastYear(userInfo) {
    if (!userInfo.lastSeenTimestamp) {
      return userInfo.lastSeenStatus === 'recently' || userInfo.lastSeenStatus === 'online';
    }

    const oneYearAgo = Date.now() - (365 * 24 * 60 * 60 * 1000);
    return userInfo.lastSeenTimestamp > oneYearAgo;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getConnectionStats() {
    return {
      isConnected: this.isConnected,
      currentProxy: null,
      proxyStats: { message: 'Прокси не используются' }
    };
  }

  async disconnect() {
    try {
      if (this.client && this.isConnected) {
        await this.client.disconnect();
        this.isConnected = false;
        await this.logger.info('🔌 Отключение от Telegram API');
      }
    } catch (error) {
      await this.logger.error('❌ Ошибка отключения', {
        error: error.message
      });
    }
  }
}

module.exports = SimpleTelegramClient;