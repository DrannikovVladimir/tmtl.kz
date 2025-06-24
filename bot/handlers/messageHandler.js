// bot/handlers/messageHandler.js

const analytics = require('../utils/analytics');

/**
 * Обработчик всех сообщений (контакты, текст)
 * @param {Object} bot - экземпляр Telegram бота
 * @param {Object} msg - объект сообщения
 * @param {Object} services - объект с сервисами
 */
const handleMessage = async (bot, msg, services) => {
  const { notificationService } = services;
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const userName = msg.from.username || msg.from.first_name;

  // Обработка контакта (номер телефона)
  if (msg.contact) {
    await handleContact(bot, msg, notificationService);
    return;
  }

  // Обработка текстовых сообщений
  if (msg.text && !msg.text.startsWith('/')) {
    await handleTextMessage(bot, msg);
    return;
  }
};

/**
 * Обработчик контактов (номеров телефона)
 * @param {Object} bot - экземпляр Telegram бота
 * @param {Object} msg - объект сообщения
 * @param {Object} notificationService - сервис уведомлений
 */
const handleContact = async (bot, msg, notificationService) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const userName = msg.from.username || msg.from.first_name;

  console.log(`📞 Получен контакт от пользователя ${userName}: ${msg.contact.phone_number}`);
  
  try {
    const callbackData = {
      userId,
      userName,
      firstName: msg.contact.first_name,
      lastName: msg.contact.last_name,
      phoneNumber: msg.contact.phone_number,
      requestedAt: new Date().toISOString()
    };

    // Записываем заявку
    analytics.recordCallbackRequest(callbackData);
    
    // Отправляем уведомление администратору
    await notificationService.sendCallbackNotification(bot, callbackData);
    
    // Подтверждение пользователю
    const confirmationMessage = `
✅ Спасибо! Ваша заявка принята.

📞 Номер: ${msg.contact.phone_number}
⏰ Менеджер свяжется с вами в течение часа в рабочее время (9:00-18:00).

📲 Если срочно: +7 (707) 886 36 33
    `;
    
    await bot.sendMessage(chatId, confirmationMessage, {
      reply_markup: { remove_keyboard: true }
    });
    
    console.log(`✅ Заявка на обратный звонок обработана для ${userName}`);
    
  } catch (error) {
    console.error('❌ Ошибка при обработке заявки на звонок:', error);
    
    await bot.sendMessage(chatId, 
      `😕 Ошибка при обработке заявки. Пожалуйста, свяжитесь напрямую: +7 (707) 886 36 33`,
      {
        reply_markup: { remove_keyboard: true }
      }
    );
  }
};

/**
 * Обработчик текстовых сообщений
 * @param {Object} bot - экземпляр Telegram бота
 * @param {Object} msg - объект сообщения
 */
const handleTextMessage = async (bot, msg) => {
  const chatId = msg.chat.id;

  if (msg.text === '❌ Отмена') {
    await bot.sendMessage(chatId, 
      'Заявка отменена. Если понадобится помощь - обращайтесь!',
      {
        reply_markup: { remove_keyboard: true }
      }
    );
  } else {
    await bot.sendMessage(chatId, 
      'Используйте команды для управления ботом. Отправьте /help для получения списка команд.'
    );
  }
};

module.exports = {
  handleMessage,
  handleContact,
  handleTextMessage
};