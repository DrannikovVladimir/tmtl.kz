const { TelegramApi } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { Api } = require('telegram/tl');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');

class TelegramClient {
  constructor(apiId, apiHash, phoneNumber, logger, proxyManager) {
    this.apiId = apiId;
    this.apiHash = apiHash;
    this.phoneNumber = phoneNumber;
    this.logger = logger;
    this.proxyManager = proxyManager;
    this.client = null;
    this.isConnected = false;
    this.currentProxy = null;
    this.session = new StringSession(''); // Пустая сессия для начала
  }

  /**
   * Инициализация и подключение клиента
   */
  async connect() {
    try {
      await this.logger.info('🔌 Подключение к Telegram API...');

      // Получаем прокси
      this.currentProxy = this.proxyManager.getNextProxy();
      if (!this.currentProxy) {
        throw new Error('Нет доступных прокси');
      }

      await this.logger.proxyChange(null, this.currentProxy, 'Первое подключение');

      // Настраиваем прокси для клиента
      const proxyConfig = this.getProxyConfig(this.currentProxy);

      // Создаём клиента
      this.client = new TelegramApi(this.apiId, this.apiHash, {
        session: this.session,
        proxy: proxyConfig,
        connectionRetries: 3,
        retryDelay: 1000,
        timeout: 30000,
        useWSS: false
      });

      // Подключаемся
      await this.client.start({
        phoneNumber: this.phoneNumber,
        password: async () => {
          // Если нужен пароль двухфакторной аутентификации
          throw new Error('Двухфакторная аутентификация не поддерживается в автоматическом режиме');
        },
        phoneCode: async () => {
          throw new Error('Требуется код подтверждения. Авторизуйтесь вручную');
        },
        onError: (err) => console.log(err),
      });

      this.isConnected = true;
      await this.logger.success('✅ Подключение к Telegram API успешно');
      
      return true;
    } catch (error) {
      await this.logger.error('❌ Ошибка подключения к Telegram API', {
        error: error.message,
        proxy: this.currentProxy ? `${this.currentProxy.host}:${this.currentProxy.port}` : null
      });
      
      // Помечаем прокси как плохой
      if (this.currentProxy) {
        this.proxyManager.markBadProxy(this.currentProxy);
      }
      
      throw error;
    }
  }

  /**
   * Получение конфигурации прокси для Telegram клиента
   */
  getProxyConfig(proxy) {
    return {
      socksType: 5, // Используем SOCKS5 для лучшей совместимости
      addr: proxy.host,
      port: proxy.port,
      username: '', // Для бесплатных прокси обычно не нужны
      password: ''
    };
  }

  /**
   * Получение информации о канале
   */
  async getChannelInfo(channelUrl) {
    try {
      await this.logger.info('📋 Получение информации о канале', { channelUrl });

      // Извлекаем username канала из URL
      const username = this.extractChannelUsername(channelUrl);
      
      // Получаем сущность канала
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
      
      return {
        entity,
        info: channelInfo
      };
    } catch (error) {
      await this.logger.error('❌ Ошибка получения информации о канале', {
        channelUrl,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Извлечение username канала из URL
   */
  extractChannelUsername(channelUrl) {
    // Поддерживаем разные форматы:
    // @channel_name
    // t.me/channel_name
    // https://t.me/channel_name
    
    if (channelUrl.startsWith('@')) {
      return channelUrl;
    }
    
    if (channelUrl.includes('t.me/')) {
      const match = channelUrl.match(/t\.me\/([^/?]+)/);
      return match ? `@${match[1]}` : channelUrl;
    }
    
    return `@${channelUrl}`;
  }

  /**
   * Получение участников канала с пагинацией
   */
  async getChannelParticipants(entity, options = {}) {
    const {
      limit = 200,        // Участников за один запрос
      maxTotal = 10000,   // Максимальное общее количество
      delay = 2000        // Задержка между запросами в мс
    } = options;

    try {
      await this.logger.info('👥 Начало получения участников канала', {
        limit,
        maxTotal,
        delay
      });

      const allParticipants = [];
      let offset = 0;
      let totalFetched = 0;

      while (totalFetched < maxTotal) {
        try {
          // Получаем порцию участников
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

          // Добавляем пользователей
          const users = result.users || [];
          const usersMap = {};
          users.forEach(user => {
            usersMap[user.id.toString()] = user;
          });

          // Обрабатываем участников
          for (const participant of participants) {
            const userId = participant.userId || participant.peerId?.userId;
            if (userId && usersMap[userId.toString()]) {
              allParticipants.push(usersMap[userId.toString()]);
              totalFetched++;
            }
          }

          await this.logger.info(`📥 Получено ${participants.length} участников (всего: ${totalFetched})`, {
            offset,
            totalFetched
          });

          offset += participants.length;

          // Задержка между запросами
          await this.delay(delay);

        } catch (error) {
          await this.logger.warning('⚠️ Ошибка при получении порции участников', {
            offset,
            error: error.message
          });

          // Если ошибка связана с прокси, пробуем сменить
          if (this.isProxyError(error)) {
            const success = await this.switchProxy();
            if (!success) {
              throw new Error('Нет доступных прокси');
            }
            continue;
          }

          // Для других ошибок ждём и пробуем снова
          await this.delay(delay * 2);
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

  /**
   * Проверка является ли ошибка связанной с прокси
   */
  isProxyError(error) {
    const proxyErrors = [
      'ECONNREFUSED',
      'ENOTFOUND',
      'ETIMEDOUT',
      'PROXY_CONNECTION_FAILED',
      'CONNECTION_DEVICE_REQ'
    ];

    return proxyErrors.some(errType => 
      error.message.includes(errType) || error.code === errType
    );
  }

  /**
   * Смена прокси
   */
  async switchProxy() {
    try {
      // Помечаем текущий прокси как плохой
      if (this.currentProxy) {
        this.proxyManager.markBadProxy(this.currentProxy);
      }

      // Получаем новый прокси
      const newProxy = this.proxyManager.getNextProxy();
      if (!newProxy) {
        await this.logger.error('❌ Нет доступных прокси для смены');
        return false;
      }

      await this.logger.proxyChange(this.currentProxy, newProxy, 'Ошибка текущего прокси');

      // Отключаем текущего клиента
      if (this.client && this.isConnected) {
        await this.client.disconnect();
      }

      // Создаём нового клиента с новым прокси
      this.currentProxy = newProxy;
      const proxyConfig = this.getProxyConfig(newProxy);

      this.client = new TelegramApi(this.apiId, this.apiHash, {
        session: this.session,
        proxy: proxyConfig,
        connectionRetries: 3,
        retryDelay: 1000,
        timeout: 30000,
        useWSS: false
      });

      // Переподключаемся
      await this.client.connect();
      this.isConnected = true;

      await this.logger.success('✅ Прокси успешно сменён');
      return true;

    } catch (error) {
      await this.logger.error('❌ Ошибка смены прокси', {
        error: error.message
      });
      return false;
    }
  }

  /**
   * Получение информации о пользователе (включая последнюю активность)
   */
  async getUserInfo(user) {
    try {
      // Базовая информация
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

      // Статус активности
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

  /**
   * Проверка активности пользователя (был ли онлайн за последний год)
   */
  isUserActiveLastYear(userInfo) {
    if (!userInfo.lastSeenTimestamp) {
      // Если нет информации о последней активности, считаем неактивным
      // Исключение: если статус "recently" - считаем активным
      return userInfo.lastSeenStatus === 'recently' || userInfo.lastSeenStatus === 'online';
    }

    const oneYearAgo = Date.now() - (365 * 24 * 60 * 60 * 1000);
    return userInfo.lastSeenTimestamp > oneYearAgo;
  }

  /**
   * Задержка
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Получение статистики подключения
   */
  getConnectionStats() {
    return {
      isConnected: this.isConnected,
      currentProxy: this.currentProxy ? `${this.currentProxy.host}:${this.currentProxy.port}` : null,
      proxyStats: this.proxyManager.getStats()
    };
  }

  /**
   * Отключение клиента
   */
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

module.exports = TelegramClient;