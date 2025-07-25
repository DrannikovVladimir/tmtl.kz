// bot/handlers/messageHandler.js

const analytics = require('../utils/analytics');
const { callbackRequestMessage } = require('../templates/messages');
const { callbackKeyboard, mainMenuKeyboard } = require('../templates/keyboards');
const { safeSendMessage, escapeHtml } = require('../utils/helpers'); // НОВОЕ: импорт функций

/**
 * Обработчик всех сообщений (контакты, текст, меню)
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
    
    // Подтверждение пользователю - БЕЗОПАСНАЯ отправка
    const confirmationMessage = `
✅ Спасибо! Ваша заявка принята.

📞 Номер: ${escapeHtml(msg.contact.phone_number)}
⏰ Менеджер свяжется с вами в течение часа в рабочее время (9:00-18:00).

📲 Если срочно: +7 (707) 886 36 33
    `;
    
    await safeSendMessage(bot, chatId, confirmationMessage, {
      reply_markup: mainMenuKeyboard
    });
    
    console.log(`✅ Заявка на обратный звонок обработана для ${userName}`);
    
  } catch (error) {
    console.error('❌ Ошибка при обработке заявки на звонок:', error);
    
    await safeSendMessage(bot, chatId, 
      `😕 Ошибка при обработке заявки. Пожалуйста, свяжитесь напрямую: +7 (707) 886 36 33`,
      {
        reply_markup: { remove_keyboard: true }
      }
    );
  }
};

/**
 * Обработчик текстовых сообщений и меню
 * @param {Object} bot - экземпляр Telegram бота
 * @param {Object} msg - объект сообщения
 */
const handleTextMessage = async (bot, msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // ИСПРАВЛЕНО: Обработка главного меню с HTML разметкой и безопасной отправкой
  switch (text) {
    case '🇦🇪 ОАЭ':
      await safeSendMessage(bot, chatId, 
        '🇦🇪 <b>ОАЭ - роскошь и комфорт!</b>\n\n' +
        '🏖️ Дубай и Абу-Даби ждут вас!\n' +
        '🏨 Лучшие отели и пляжи\n' +
        '🛍️ Шопинг и развлечения\n\n' +
        '👆 Смотрите актуальные предложения:', 
        {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [[
              { text: '🔥 Туры в ОАЭ', url: 'https://tmtl.kz/tours/uae/' }
            ]]
          }
        }
      );
      break;

    case '🇪🇬 Египет':
      await safeSendMessage(bot, chatId, 
        '🇪🇬 <b>Египет - пирамиды и Красное море!</b>\n\n' +
        '🏺 Хургада и Шарм-эль-Шейх\n' +
        '🤿 Дайвинг и снорклинг\n' +
        '☀️ Круглогодичный пляжный отдых\n\n' +
        '👆 Смотрите актуальные предложения:', 
        {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [[
              { text: '🔥 Туры в Египет', url: 'https://tmtl.kz/tours/egypt/' }
            ]]
          }
        }
      );
      break;

    case '🇹🇭 Таиланд':
      await safeSendMessage(bot, chatId, 
        '🇹🇭 <b>Таиланд - улыбки и экзотика!</b>\n\n' +
        '🏝️ Пхукет, Паттайя, Самуи\n' +
        '🍜 Удивительная кухня и культура\n' +
        '💆‍♀️ SPA и массаж\n\n' +
        '👆 Смотрите актуальные предложения:', 
        {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [[
              { text: '🔥 Туры в Таиланд', url: 'https://tmtl.kz/tours/thailand/' }
            ]]
          }
        }
      );
      break;

    case '🇹🇷 Турция':
      await safeSendMessage(bot, chatId, 
        '🇹🇷 <b>Турция - all inclusive и история!</b>\n\n' +
        '🏖️ Анталья, Кемер, Сиде\n' +
        '🏰 Стамбул и Каппадокия\n' +
        '🍽️ Системы "всё включено"\n\n' +
        '👆 Смотрите актуальные предложения:', 
        {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [[
              { text: '🔥 Туры в Турцию', url: 'https://tmtl.kz/tours/turkey/' }
            ]]
          }
        }
      );
      break;

    case '🇻🇳 Вьетнам':
      await safeSendMessage(bot, chatId, 
        '🇻🇳 <b>Вьетнам - приключения и природа!</b>\n\n' +
        '🌊 Нячанг, Фукуок, Хошимин\n' +
        '🍲 Аутентичная кухня\n' +
        '🏞️ Удивительные пейзажи\n\n' +
        '👆 Смотрите актуальные предложения:', 
        {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [[
              { text: '🔥 Туры во Вьетнам', url: 'https://tmtl.kz/tours/vietnam/' }
            ]]
          }
        }
      );
      break;

    case '🇲🇻 Мальдивы':
      await safeSendMessage(bot, chatId, 
        '🇲🇻 <b>Мальдивы - райские острова!</b>\n\n' +
        '🏝️ Роскошные бунгало над водой\n' +
        '🐠 Кристально чистые лагуны\n' +
        '💑 Идеально для романтики\n\n' +
        '👆 Смотрите актуальные предложения:', 
        {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [[
              { text: '🔥 Туры на Мальдивы', url: 'https://tmtl.kz/tours/maldives/' }
            ]]
          }
        }
      );
      break;

    case '📞 Связаться':
      await safeSendMessage(bot, chatId, callbackRequestMessage, {
        reply_markup: callbackKeyboard
      });
      break;

    case '🌍 Все туры':
      await safeSendMessage(bot, chatId, 
        '🌍 <b>Все наши туристические направления:</b>\n\n' +
        '✈️ Выбирайте из более чем 50 стран мира!\n' +
        '🔥 Горящие туры со скидками до 50%\n' +
        '📋 Индивидуальные программы\n\n' +
        '👆 Смотрите полный каталог:', 
        {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [[
              { text: '🌐 Все направления', url: 'https://tmtl.kz/country/' }
            ]]
          }
        }
      );
      break;

    case '❌ Отмена':
      await safeSendMessage(bot, chatId, 
        'Заявка отменена. Если понадобится помощь - обращайтесь!',
        {
          reply_markup: mainMenuKeyboard
        }
      );
      break;

    default:
      await safeSendMessage(bot, chatId, 
        'Используйте меню для навигации или отправьте /help для получения справки.'
      );
  }
};

module.exports = {
  handleMessage,
  handleContact,
  handleTextMessage
};