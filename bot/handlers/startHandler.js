// bot/handlers/startHandler.js

const { welcomeMessage, subscribeMessage } = require('../templates/messages');
const { subscribeKeyboard, mainMenuKeyboard } = require('../templates/keyboards');

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
      await bot.sendMessage(chatId, welcomeMessage);
      
      // ИСПРАВЛЕНО: Последовательные таймауты
      // Отправляем сообщение с полезными ссылками через 5 секунд
      setTimeout(async () => {
        await fileService.sendLoadingMessage(bot, chatId);
        
        // Показываем главное меню через 2 секунды после промежуточного сообщения
        setTimeout(async () => {
          await bot.sendMessage(chatId, 
            '🌍 Выберите интересующее направление или воспользуйтесь меню:',
            {
              reply_markup: mainMenuKeyboard
            }
          );
          console.log(`📋 Главное меню отправлено пользователю ${userName}`);
        }, 2000);
        
      }, 5000);
      
      // Отправляем файл
      console.log(`📤 Отправляем файл пользователю ${userName}`);
      await fileService.sendLeadMagnetFile(bot, chatId, userId, userName);
      
    } else {
      // Пользователь не подписан - показываем сообщение с кнопками подписки
      await bot.sendMessage(chatId, subscribeMessage, {
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
    
    await bot.sendMessage(chatId, errorMessage);
  }
};

module.exports = {
  handleStart
};