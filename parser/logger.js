
const fs = require('fs').promises;
const path = require('path');

class Logger {
  constructor() {
    this.logsPath = path.join(__dirname, '..', 'data', 'parser-logs.json');
    this.maxLogs = 1000; // Максимальное количество записей в файле
    this.logs = [];
    this.sessionId = this.generateSessionId();
  }

  /**
   * Генерирует уникальный ID сессии
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Загружает существующие логи из файла
   */
  async loadLogs() {
    try {
      const data = await fs.readFile(this.logsPath, 'utf8');
      this.logs = JSON.parse(data);
      console.log(`📂 Загружено ${this.logs.length} записей логов`);
    } catch (error) {
      console.log('📂 Файл логов не найден, создаём новый');
      this.logs = [];
    }
  }

  /**
   * Основной метод логирования
   */
  async log(level, message, data = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      level: level.toUpperCase(),
      message,
      data,
      datetime: new Date().toLocaleString('ru-RU', {
        timeZone: 'Asia/Almaty'
      })
    };

    // Добавляем в массив
    this.logs.push(logEntry);

    // Выводим в консоль с цветами
    this.consoleLog(logEntry);

    // Сохраняем в файл (асинхронно)
    this.saveToFile().catch(err => 
      console.error('❌ Ошибка сохранения лога:', err.message)
    );

    return logEntry;
  }

  /**
   * Вывод в консоль с цветами
   */
  consoleLog(entry) {
    const colors = {
      INFO: '\x1b[36m',    // Cyan
      SUCCESS: '\x1b[32m', // Green
      WARNING: '\x1b[33m', // Yellow
      ERROR: '\x1b[31m',   // Red
      DEBUG: '\x1b[35m',   // Magenta
      RESET: '\x1b[0m'     // Reset
    };

    const color = colors[entry.level] || colors.INFO;
    const time = entry.datetime.split(', ')[1]; // Только время
    
    console.log(
      `${color}[${entry.level}]${colors.RESET} ` +
      `${time} - ${entry.message}` +
      (entry.data ? ` | ${JSON.stringify(entry.data)}` : '')
    );
  }

  /**
   * Информационное сообщение
   */
  async info(message, data = null) {
    return this.log('info', message, data);
  }

  /**
   * Сообщение об успехе
   */
  async success(message, data = null) {
    return this.log('success', message, data);
  }

  /**
   * Предупреждение
   */
  async warning(message, data = null) {
    return this.log('warning', message, data);
  }

  /**
   * Ошибка
   */
  async error(message, data = null) {
    return this.log('error', message, data);
  }

  /**
   * Отладочная информация
   */
  async debug(message, data = null) {
    return this.log('debug', message, data);
  }

  /**
   * Логирование начала парсинга
   */
  async startParsing(channelUrl, options = {}) {
    return this.info('🚀 Начало парсинга канала', {
      channelUrl,
      options,
      sessionId: this.sessionId
    });
  }

  /**
   * Логирование завершения парсинга
   */
  async finishParsing(stats) {
    return this.success('✅ Парсинг завершён', {
      ...stats,
      sessionId: this.sessionId
    });
  }

  /**
   * Логирование смены прокси
   */
  async proxyChange(oldProxy, newProxy, reason = null) {
    return this.info('🔄 Смена прокси', {
      oldProxy: oldProxy ? `${oldProxy.host}:${oldProxy.port}` : null,
      newProxy: newProxy ? `${newProxy.host}:${newProxy.port}` : null,
      reason
    });
  }

  /**
   * Логирование ошибки прокси
   */
  async proxyError(proxy, error) {
    return this.warning('⚠️ Ошибка прокси', {
      proxy: `${proxy.host}:${proxy.port}`,
      error: error.message
    });
  }

  /**
   * Логирование найденного подписчика
   */
  async subscriberFound(subscriber, index, total) {
    return this.debug('👤 Найден подписчик', {
      subscriber: {
        id: subscriber.id,
        username: subscriber.username,
        firstName: subscriber.firstName,
        lastName: subscriber.lastName
      },
      progress: `${index}/${total}`
    });
  }

  /**
   * Логирование отфильтрованного подписчика
   */
  async subscriberFiltered(subscriber, reason) {
    return this.debug('🚫 Подписчик отфильтрован', {
      subscriber: {
        id: subscriber.id,
        username: subscriber.username
      },
      reason
    });
  }

  /**
   * Получение логов с фильтрацией
   */
  getLogs(options = {}) {
    let filteredLogs = [...this.logs];

    // Фильтр по уровню
    if (options.level) {
      filteredLogs = filteredLogs.filter(log => 
        log.level === options.level.toUpperCase()
      );
    }

    // Фильтр по сессии
    if (options.sessionId) {
      filteredLogs = filteredLogs.filter(log => 
        log.sessionId === options.sessionId
      );
    }

    // Фильтр по времени (последние N минут)
    if (options.lastMinutes) {
      const cutoff = new Date(Date.now() - options.lastMinutes * 60 * 1000);
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) > cutoff
      );
    }

    // Лимит количества
    if (options.limit) {
      filteredLogs = filteredLogs.slice(-options.limit);
    }

    return filteredLogs;
  }

  /**
   * Получение статистики логов
   */
  getStats() {
    const stats = {
      total: this.logs.length,
      byLevel: {},
      sessions: new Set(),
      lastHour: 0,
      currentSession: this.sessionId
    };

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    this.logs.forEach(log => {
      // Статистика по уровням
      stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;
      
      // Уникальные сессии
      stats.sessions.add(log.sessionId);
      
      // Логи за последний час
      if (new Date(log.timestamp) > oneHourAgo) {
        stats.lastHour++;
      }
    });

    stats.sessions = stats.sessions.size;
    return stats;
  }

  /**
   * Очистка старых логов
   */
  async cleanOldLogs() {
    if (this.logs.length > this.maxLogs) {
      const toRemove = this.logs.length - this.maxLogs;
      this.logs = this.logs.slice(toRemove);
      
      await this.saveToFile();
      await this.info('🧹 Очищены старые логи', { removed: toRemove });
    }
  }

  /**
   * Сохранение логов в файл
   */
  async saveToFile() {
    try {
      // Сначала очищаем старые логи
      await this.cleanOldLogs();
      
      // Сохраняем в файл
      await fs.writeFile(this.logsPath, JSON.stringify(this.logs, null, 2));
    } catch (error) {
      console.error('❌ Ошибка сохранения логов:', error.message);
    }
  }

  /**
   * Экспорт логов в читаемом формате
   */
  async exportLogs(sessionId = null) {
    const logsToExport = sessionId 
      ? this.getLogs({ sessionId })
      : this.logs;

    let output = '=== PARSER LOGS ===\n\n';
    
    logsToExport.forEach(log => {
      output += `[${log.level}] ${log.datetime}\n`;
      output += `${log.message}\n`;
      if (log.data) {
        output += `Data: ${JSON.stringify(log.data, null, 2)}\n`;
      }
      output += '---\n\n';
    });

    return output;
  }

  /**
   * Очистка всех логов
   */
  async clearLogs() {
    this.logs = [];
    await this.saveToFile();
    await this.info('🗑️ Все логи очищены');
  }
}

module.exports = Logger;