// bot/handlers/callbackHandler.js

const { successMessage, callbackRequestMessage } = require('../templates/messages');
const { callbackKeyboard, mainMenuKeyboard } = require('../templates/keyboards');
const { safeSendMessage } = require('../utils/helpers'); // НОВОЕ: импорт

/**
 * Обработчик inline кнопок
 * @param {Object} bot - экземпляр Telegram бота
 * @param {Object} query - объект callback query
 * @param {Object} services - объект с сервисами
 */
const handleCallbackQuery = async (bot, query, services) => {
  const { subscriptionService, fileService } = services;
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const userName = query.from.username || query.from.first_name;
  
  // Обработка кнопки "Я подписался!"
  if (query.data === 'check_subscription') {
    console.log(`🔄 Повторная проверка подписки для пользователя ${userName} (ID: ${userId})`);
    
    try {
      const subscriptionResult = await subscriptionService.checkSubscription(userId);
      
      if (subscriptionResult.isSubscribed) {
        // Убираем кнопки и отправляем файл
        await bot.editMessageReplyMarkup(
          { inline_keyboard: [] },
          { chat_id: chatId, message_id: query.message.message_id }
        );
        
        await safeSendMessage(bot, chatId, successMessage); // БЕЗОПАСНАЯ отправка
        
        // Отправляем сообщение с полезными ссылками через 5 секунд
        setTimeout(async () => {
          await fileService.sendLoadingMessage(bot, chatId);
        }, 5000);
        
        await fileService.sendLeadMagnetFile(bot, chatId, userId, userName);
        
        // НОВОЕ: Показываем главное меню после подписки и получения файла
        setTimeout(async () => {
          await safeSendMessage(bot, chatId, // БЕЗОПАСНАЯ отправка
            '🌍 Теперь выберите интересующее направление:',
            {
              reply_markup: mainMenuKeyboard
            }
          );
          console.log(`📋 Главное меню отправлено пользователю ${userName} после подписки`);
        }, 8000);
        
        console.log(`✅ Пользователь ${userName} получил файл после повторной проверки`);
        
      } else {
        // Все еще не подписан
        await bot.answerCallbackQuery(query.id, {
          text: '❌ Вы еще не подписаны на канал. Сначала подпишитесь!',
          show_alert: true
        });
        
        console.log(`❌ Пользователь ${userName} все еще не подписан`);
      }
      
    } catch (error) {
      console.error('❌ Ошибка при повторной проверке подписки:', error);
      
      await bot.answerCallbackQuery(query.id, {
        text: '😕 Ошибка проверки. Попробуйте позже.',
        show_alert: true
      });
    }
  }
  
  // Обработка кнопки "Заказать обратный звонок"
  if (query.data === 'request_callback') {
    console.log(`📞 Запрос обратного звонка от пользователя ${userName} (ID: ${userId})`);
    
    try {
      await safeSendMessage(bot, chatId, callbackRequestMessage, { // БЕЗОПАСНАЯ отправка
        reply_markup: callbackKeyboard
      });
      
      await bot.answerCallbackQuery(query.id);
      
    } catch (error) {
      console.error('❌ Ошибка при запросе обратного звонка:', error);
      
      await bot.answerCallbackQuery(query.id, {
        text: '😕 Ошибка. Попробуйте позже или напишите напрямую: +7 (707) 886 36 33',
        show_alert: true
      });
    }
  }
};

module.exports = {
  handleCallbackQuery
};