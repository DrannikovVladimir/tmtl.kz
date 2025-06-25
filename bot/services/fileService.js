// bot/services/fileService.js

const fs = require('fs');
const path = require('path');
const analytics = require('../utils/analytics');
const { loadingMessage } = require('../templates/messages');
const { loadingKeyboard } = require('../templates/keyboards');

/**
 * Сервис для работы с файлами и отправкой контента
 */
class FileService {
  constructor() {
    this.leadMagnetPath = path.join(__dirname, '..', '..', 'files', 'putevoditel.pdf');
  }

  /**
   * Отправляет лид-магнит файл пользователю
   * @param {Object} bot - экземпляр Telegram бота
   * @param {Number} chatId - ID чата
   * @param {Number} userId - ID пользователя
   * @param {String} userName - Имя пользователя
   * @returns {Boolean} - Успешность отправки
   */
  async sendLeadMagnetFile(bot, chatId, userId, userName) {
    try {
      // Проверяем, существует ли файл
      if (!fs.existsSync(this.leadMagnetPath)) {
        console.error('❌ Файл не найден:', this.leadMagnetPath);
        await bot.sendMessage(chatId, 
          '😕 Извините, файл временно недоступен. Обратитесь к менеджеру: +7 (707) 886 36 33'
        );
        return false;
      }
      
      // ИСПРАВЛЕНИЕ: Используем правильный формат для отправки документа
      const document = fs.createReadStream(this.leadMagnetPath);
      
      await bot.sendDocument(chatId, document, {
        caption: '📖 Путеводитель по горящим турам\n\n🔥 Сохраните и пользуйтесь на здоровье!\n\n📲 Вопросы? Пишите: +7 (707) 886 36 33'
      }, {
        filename: 'putevoditel.pdf',
        contentType: 'application/pdf'
      });
      
      // Записываем аналитику
      analytics.recordDownload({
        userId,
        userName,
        downloadedAt: new Date().toISOString(),
        source: 'telegram_bot'
      });
      
      console.log(`✅ Файл успешно отправлен пользователю ${userName}`);
      return true;
      
    } catch (error) {
      console.error('❌ Ошибка при отправке файла:', error);
      
      // Попытка альтернативного способа отправки
      try {
        console.log('🔄 Попытка альтернативного способа отправки...');
        
        await bot.sendDocument(chatId, this.leadMagnetPath, {
          caption: '📖 Путеводитель по горящим турам\n\n🔥 Сохраните и пользуйтесь на здоровье!\n\n📲 Вопросы? Пишите: +7 (707) 886 36 33'
        });
        
        // Записываем аналитику
        analytics.recordDownload({
          userId,
          userName,
          downloadedAt: new Date().toISOString(),
          source: 'telegram_bot'
        });
        
        console.log(`✅ Файл отправлен альтернативным способом пользователю ${userName}`);
        return true;
        
      } catch (alternativeError) {
        console.error('❌ Альтернативный способ тоже не сработал:', alternativeError);
        
        await bot.sendMessage(chatId, 
          '😕 Ошибка при отправке файла. Попробуйте позже или обратитесь к менеджеру: +7 (707) 886 36 33'
        );
        return false;
      }
    }
  }

  /**
   * Отправляет сообщение с полезными ссылками во время загрузки файла
   * @param {Object} bot - экземпляр Telegram бота
   * @param {Number} chatId - ID чата
   */
  async sendLoadingMessage(bot, chatId) {
    try {
      await bot.sendMessage(chatId, loadingMessage, {
        parse_mode: 'HTML',
        reply_markup: loadingKeyboard,
        disable_web_page_preview: true
      });
      
      console.log('📤 Отправлено сообщение с полезными ссылками');
    } catch (error) {
      console.error('❌ Ошибка при отправке сообщения загрузки:', error);
    }
  }

  /**
   * Проверяет доступность файла лид-магнита
   * @returns {Boolean} - Доступность файла
   */
  isFileAvailable() {
    return fs.existsSync(this.leadMagnetPath);
  }

  /**
   * Получает информацию о файле
   * @returns {Object} - Информация о файле
   */
  getFileInfo() {
    try {
      if (!this.isFileAvailable()) {
        return {
          exists: false,
          error: 'Файл не найден'
        };
      }

      const stats = fs.statSync(this.leadMagnetPath);
      return {
        exists: true,
        size: stats.size,
        sizeInMB: (stats.size / (1024 * 1024)).toFixed(2),
        modified: stats.mtime,
        path: this.leadMagnetPath
      };
    } catch (error) {
      return {
        exists: false,
        error: error.message
      };
    }
  }
}

module.exports = FileService;