// bot/handlers/startHandler.js

const { welcomeMessage, subscribeMessage } = require('../templates/messages');
const { subscribeKeyboard, mainMenuKeyboard } = require('../templates/keyboards');
const { safeSendMessage } = require('../utils/helpers'); // НОВОЕ: импорт

/**
 * Обработчик команды /start
 * @param {Object} bot - экземпляр Telegram бота
 * @param {Object} msg - объект сообщения
 * @param {Object} services - объект с сервисами
 */
const handleStart = async (bot, msg, services) => {
  const { subscriptionService, fileService } = services;
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const userName = msg.from.username || msg.from.first_name;
  
  console.log(`📥 Получена команда /start от пользователя ${userName} (ID: ${userId})`);
  
  try {
    // Проверяем подписку пользователя на канал
    const subscriptionResult = await subscriptionService.checkSubscription(userId);
    
    if (subscriptionResult.isSubscribed) {
      // Пользователь подписан - отправляем приветствие и файл
      await safeSendMessage(bot, chatId, welcomeMessage); // БЕЗОПАСНАЯ отправка
      
      // ИСПРАВЛЕНО: Последовательные таймауты
      // Отправляем сообщение с полезными ссылками через 5 секунд
      setTimeout(async () => {
        await fileService.sendLoadingMessage(bot, chatId);
        
        // Показываем главное меню через 2 секунды после промежуточного сообщения
        setTimeout(async () => {
          await safeSendMessage(bot, chatId, // БЕЗОПАСНАЯ отправка
            '🌍 Выберите интересующее направление или воспользуйтесь меню которые находится ниже',
            {
              reply_markup: mainMenuKeyboard
            }
          );
          console.log(`📋 Главное меню отправлено пользователю ${userName}`);
        }, 3000);
        
      }, 2000);
      
      // Отправляем файл
      console.log(`📤 Отправляем файл пользователю ${userName}`);
      await fileService.sendLeadMagnetFile(bot, chatId, userId, userName);
      
    } else {
      // Пользователь не подписан - показываем сообщение с кнопками подписки
      await safeSendMessage(bot, chatId, subscribeMessage, { // БЕЗОПАСНАЯ отправка
        reply_markup: subscribeKeyboard
      });
      
      console.log(`❌ Пользователь ${userName} не подписан. Статус: ${subscriptionResult.status}`);
    }
    
  } catch (error) {
    console.error('❌ Ошибка при обработке /start:', error);
    
    const errorMessage = `
😕 Произошла ошибка при проверке подписки.

Убедитесь, что вы подписаны на наш канал и попробуйте еще раз.

📲 Если проблема повторяется, пишите: +7 (707) 886 36 33
    `;
    
    await safeSendMessage(bot, chatId, errorMessage); // БЕЗОПАСНАЯ отправка
  }
};

module.exports = {
  handleStart
};