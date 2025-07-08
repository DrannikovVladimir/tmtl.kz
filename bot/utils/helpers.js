// bot/utils/helpers.js

/**
 * Вспомогательные утилиты для бота
 */

/**
 * Форматирует дату в читаемый вид
 * @param {Date|String} date - дата для форматирования
 * @param {String} timezone - часовой пояс (по умолчанию Asia/Almaty)
 * @returns {String} - отформатированная дата
 */
const formatDate = (date, timezone = 'Asia/Almaty') => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('ru-RU', {
      timeZone: timezone,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('❌ Ошибка форматирования даты:', error);
    return 'Неизвестно';
  }
};

/**
 * Извлекает имя пользователя из объекта сообщения
 * @param {Object} user - объект пользователя из Telegram
 * @returns {String} - имя пользователя
 */
const getUserName = (user) => {
  if (!user) return 'Неизвестный пользователь';
  
  if (user.username) {
    return `@${user.username}`;
  }
  
  const firstName = user.first_name || '';
  const lastName = user.last_name || '';
  
  return `${firstName} ${lastName}`.trim() || `ID: ${user.id}`;
};

/**
 * Создает задержку
 * @param {Number} ms - миллисекунды
 * @returns {Promise} - промис с задержкой
 */
const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Валидирует номер телефона
 * @param {String} phone - номер телефона
 * @returns {Boolean} - валидность номера
 */
const isValidPhone = (phone) => {
  if (!phone) return false;
  
  // Удаляем все символы кроме цифр и +
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // Проверяем на казахстанские номера
  const kazakhPatterns = [
    /^\+77\d{9}$/, // +77xxxxxxxxx
    /^77\d{9}$/,   // 77xxxxxxxxx
    /^87\d{9}$/    // 87xxxxxxxxx
  ];
  
  return kazakhPatterns.some(pattern => pattern.test(cleanPhone));
};

/**
 * Форматирует номер телефона в стандартный вид
 * @param {String} phone - номер телефона
 * @returns {String} - отформатированный номер
 */
const formatPhone = (phone) => {
  if (!phone) return '';
  
  const cleanPhone = phone.replace(/[^\d]/g, '');
  
  // Если номер начинается с 8, заменяем на +7
  if (cleanPhone.startsWith('8') && cleanPhone.length === 11) {
    return '+7' + cleanPhone.slice(1);
  }
  
  // Если номер начинается с 7, добавляем +
  if (cleanPhone.startsWith('7') && cleanPhone.length === 11) {
    return '+' + cleanPhone;
  }
  
  return phone;
};

/**
 * Создает безопасную ссылку для WhatsApp
 * @param {String} phone - номер телефона
 * @param {String} message - сообщение (опционально)
 * @returns {String} - ссылка на WhatsApp
 */
const createWhatsAppLink = (phone, message = '') => {
  const formattedPhone = formatPhone(phone).replace('+', '');
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${formattedPhone}${message ? `?text=${encodedMessage}` : ''}`;
};

/**
 * Обрезает текст до указанной длины
 * @param {String} text - исходный текст
 * @param {Number} maxLength - максимальная длина
 * @param {String} suffix - суффикс (по умолчанию ...)
 * @returns {String} - обрезанный текст
 */
const truncateText = (text, maxLength, suffix = '...') => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Экранирует специальные символы Markdown
 * @param {String} text - текст для экранирования
 * @returns {String} - экранированный текст
 */
const escapeMarkdown = (text) => {
  if (!text) return '';
  
  const specialChars = ['*', '_', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!'];
  
  return text.replace(new RegExp(`[${specialChars.map(char => `\\${char}`).join('')}]`, 'g'), '\\$&');
};

/**
 * НОВОЕ: Экранирует специальные символы HTML
 * @param {String} text - текст для экранирования
 * @returns {String} - экранированный текст
 */
const escapeHtml = (text) => {
  if (!text) return '';
  
  return text.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

/**
 * НОВОЕ: Безопасная отправка сообщения с обработкой ошибок разметки
 * @param {Object} bot - экземпляр Telegram бота
 * @param {Number} chatId - ID чата
 * @param {String} text - текст сообщения
 * @param {Object} options - опции сообщения
 * @returns {Promise} - результат отправки
 */
const safeSendMessage = async (bot, chatId, text, options = {}) => {
  try {
    // Сначала пробуем отправить с указанной разметкой
    return await bot.sendMessage(chatId, text, options);
  } catch (error) {
    console.error('❌ Ошибка отправки сообщения с разметкой:', error.message);
    
    // Если ошибка связана с разметкой, отправляем без parse_mode
    if (error.message.includes("can't parse entities") || 
        error.message.includes("Bad Request")) {
      console.log('🔄 Повторная отправка без разметки...');
      
      const fallbackOptions = { ...options };
      delete fallbackOptions.parse_mode;
      
      try {
        return await bot.sendMessage(chatId, text, fallbackOptions);
      } catch (fallbackError) {
        console.error('❌ Ошибка при повторной отправке:', fallbackError.message);
        
        // В крайнем случае отправляем простое сообщение об ошибке
        return await bot.sendMessage(chatId, 
          '😕 Произошла ошибка при отправке сообщения. Попробуйте позже или свяжитесь с нами: +7 (707) 886 36 33'
        );
      }
    }
    
    throw error;
  }
};

/**
 * НОВОЕ: Безопасная отправка сообщения с экранированием HTML
 * @param {Object} bot - экземпляр Telegram бота
 * @param {Number} chatId - ID чата
 * @param {String} text - текст сообщения (будет экранирован)
 * @param {Object} options - опции сообщения
 * @returns {Promise} - результат отправки
 */
const safeSendHtmlMessage = async (bot, chatId, text, options = {}) => {
  const escapedText = escapeHtml(text);
  const htmlOptions = { ...options, parse_mode: 'HTML' };
  
  return await safeSendMessage(bot, chatId, escapedText, htmlOptions);
};

/**
 * Проверяет, является ли строка валидным URL
 * @param {String} string - строка для проверки
 * @returns {Boolean} - является ли URL валидным
 */
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Генерирует случайную строку
 * @param {Number} length - длина строки
 * @returns {String} - случайная строка
 */
const generateRandomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Получает информацию о размере файла в читаемом виде
 * @param {Number} bytes - размер в байтах
 * @returns {String} - размер в читаемом виде
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Логирует сообщение с временной меткой
 * @param {String} level - уровень логирования (info, warn, error)
 * @param {String} message - сообщение
 * @param {Object} data - дополнительные данные (опционально)
 */
const log = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  switch (level) {
    case 'error':
      console.error(logMessage, data || '');
      break;
    case 'warn':
      console.warn(logMessage, data || '');
      break;
    default:
      console.log(logMessage, data || '');
  }
};

/**
 * Проверяет, прошло ли определенное время с последнего действия
 * @param {Date|String} lastAction - время последнего действия
 * @param {Number} minutes - количество минут
 * @returns {Boolean} - прошло ли время
 */
const isTimeElapsed = (lastAction, minutes) => {
  if (!lastAction) return true;
  
  const lastActionDate = typeof lastAction === 'string' ? new Date(lastAction) : lastAction;
  const now = new Date();
  const diffMinutes = (now - lastActionDate) / (1000 * 60);
  
  return diffMinutes >= minutes;
};

module.exports = {
  formatDate,
  getUserName,
  delay,
  isValidPhone,
  formatPhone,
  createWhatsAppLink,
  truncateText,
  escapeMarkdown,
  escapeHtml, // НОВОЕ
  isValidUrl,
  generateRandomString,
  formatFileSize,
  log,
  isTimeElapsed,
  safeSendMessage, // НОВОЕ
  safeSendHtmlMessage // НОВОЕ
};