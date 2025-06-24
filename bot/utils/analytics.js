// bot/utils/analytics.js

const fs = require('fs');
const path = require('path');

/**
 * Утилиты для работы с аналитикой и сохранением данных
 */
class Analytics {
  constructor() {
    this.dataDir = path.join(__dirname, '..', '..', 'data');
    this.downloadsFile = path.join(this.dataDir, 'downloads.json');
    this.callbackRequestsFile = path.join(this.dataDir, 'callback-requests.json');
    this.userInteractionsFile = path.join(this.dataDir, 'user-interactions.json');
    
    // Создаем папку data если её нет
    this.ensureDataDir();
  }

  /**
   * Создает папку data если её нет
   */
  ensureDataDir() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
      console.log('📁 Создана папка для аналитики:', this.dataDir);
    }
  }

  /**
   * Записывает информацию о скачивании лид-магнита
   * @param {Object} data - данные о скачивании
   */
  recordDownload(data) {
    try {
      const downloads = this.readJsonFile(this.downloadsFile) || [];
      
      const downloadRecord = {
        id: this.generateId(),
        ...data,
        timestamp: new Date().toISOString()
      };
      
      downloads.push(downloadRecord);
      this.writeJsonFile(this.downloadsFile, downloads);
      
      console.log('📊 Аналитика скачивания записана');
    } catch (error) {
      console.error('❌ Ошибка записи аналитики скачивания:', error);
    }
  }

  /**
   * Записывает заявку на обратный звонок
   * @param {Object} data - данные заявки
   */
  recordCallbackRequest(data) {
    try {
      const requests = this.readJsonFile(this.callbackRequestsFile) || [];
      
      const requestRecord = {
        id: this.generateId(),
        ...data,
        status: 'new',
        timestamp: new Date().toISOString()
      };
      
      requests.push(requestRecord);
      this.writeJsonFile(this.callbackRequestsFile, requests);
      
      console.log('📞 Заявка на обратный звонок записана');
    } catch (error) {
      console.error('❌ Ошибка записи заявки на звонок:', error);
    }
  }

  /**
   * Записывает взаимодействие пользователя с ботом
   * @param {Object} data - данные взаимодействия
   */
  recordUserInteraction(data) {
    try {
      const interactions = this.readJsonFile(this.userInteractionsFile) || [];
      
      const interactionRecord = {
        id: this.generateId(),
        ...data,
        timestamp: new Date().toISOString()
      };
      
      interactions.push(interactionRecord);
      this.writeJsonFile(this.userInteractionsFile, interactions);
      
      console.log('👤 Взаимодействие пользователя записано');
    } catch (error) {
      console.error('❌ Ошибка записи взаимодействия:', error);
    }
  }

  /**
   * Получает статистику скачиваний
   * @param {Number} days - количество дней для анализа (по умолчанию 30)
   * @returns {Object} - статистика скачиваний
   */
  getDownloadStats(days = 30) {
    try {
      const downloads = this.readJsonFile(this.downloadsFile) || [];
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const recentDownloads = downloads.filter(download => 
        new Date(download.timestamp) > cutoffDate
      );

      return {
        totalDownloads: downloads.length,
        recentDownloads: recentDownloads.length,
        downloads: downloads,
        period: `${days} дней`,
        averagePerDay: (recentDownloads.length / days).toFixed(2)
      };
    } catch (error) {
      console.error('❌ Ошибка при получении статистики скачиваний:', error);
      return {
        totalDownloads: 0,
        recentDownloads: 0,
        downloads: [],
        error: error.message
      };
    }
  }

  /**
   * Получает статистику заявок на обратный звонок
   * @param {Number} days - количество дней для анализа
   * @returns {Object} - статистика заявок
   */
  getCallbackStats(days = 30) {
    try {
      const requests = this.readJsonFile(this.callbackRequestsFile) || [];
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const recentRequests = requests.filter(request => 
        new Date(request.timestamp) > cutoffDate
      );

      const byStatus = requests.reduce((acc, request) => {
        acc[request.status] = (acc[request.status] || 0) + 1;
        return acc;
      }, {});

      return {
        totalRequests: requests.length,
        recentRequests: recentRequests.length,
        byStatus,
        requests: requests,
        period: `${days} дней`
      };
    } catch (error) {
      console.error('❌ Ошибка при получении статистики заявок:', error);
      return {
        totalRequests: 0,
        recentRequests: 0,
        byStatus: {},
        requests: [],
        error: error.message
      };
    }
  }

  /**
   * Получает общую статистику
   * @returns {Object} - общая статистика
   */
  getGeneralStats() {
    try {
      const downloads = this.getDownloadStats();
      const callbacks = this.getCallbackStats();
      const interactions = this.readJsonFile(this.userInteractionsFile) || [];

      // Уникальные пользователи
      const allUsers = new Set();
      downloads.downloads.forEach(d => allUsers.add(d.userId));
      callbacks.requests.forEach(r => allUsers.add(r.userId));
      interactions.forEach(i => allUsers.add(i.userId));

      return {
        totalUsers: allUsers.size,
        totalDownloads: downloads.totalDownloads,
        totalCallbacks: callbacks.totalRequests,
        totalInteractions: interactions.length,
        conversionRate: allUsers.size > 0 ? 
          ((callbacks.totalRequests / allUsers.size) * 100).toFixed(2) + '%' : '0%',
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Ошибка при получении общей статистики:', error);
      return {
        error: error.message
      };
    }
  }

  /**
   * Обновляет статус заявки на обратный звонок
   * @param {String} requestId - ID заявки
   * @param {String} newStatus - новый статус
   */
  updateCallbackStatus(requestId, newStatus) {
    try {
      const requests = this.readJsonFile(this.callbackRequestsFile) || [];
      const requestIndex = requests.findIndex(r => r.id === requestId);
      
      if (requestIndex !== -1) {
        requests[requestIndex].status = newStatus;
        requests[requestIndex].updatedAt = new Date().toISOString();
        
        this.writeJsonFile(this.callbackRequestsFile, requests);
        console.log(`📞 Статус заявки ${requestId} обновлен на: ${newStatus}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Ошибка при обновлении статуса заявки:', error);
      return false;
    }
  }

  /**
   * Читает JSON файл
   * @param {String} filePath - путь к файлу
   * @returns {Array|Object|null} - содержимое файла
   */
  readJsonFile(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        return null;
      }
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`❌ Ошибка чтения файла ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Записывает данные в JSON файл
   * @param {String} filePath - путь к файлу
   * @param {Array|Object} data - данные для записи
   */
  writeJsonFile(filePath, data) {
    try {
      this.ensureDataDir();
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`❌ Ошибка записи файла ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Генерирует уникальный ID
   * @returns {String} - уникальный ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Экспортирует все данные для резервного копирования
   * @returns {Object} - все данные
   */
  exportAllData() {
    try {
      return {
        downloads: this.readJsonFile(this.downloadsFile) || [],
        callbackRequests: this.readJsonFile(this.callbackRequestsFile) || [],
        userInteractions: this.readJsonFile(this.userInteractionsFile) || [],
        exportedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Ошибка при экспорте данных:', error);
      return { error: error.message };
    }
  }
}

// Создаем экземпляр и экспортируем
const analytics = new Analytics();

module.exports = analytics;