// bot/index.js

const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const publisher = require('./publisher');
require('dotenv').config();

// Получаем токен бота из переменных окружения
const token = process.env.BOT_TOKEN || '7762871421:AAFzxKf5Io1UKiQ5ZmdqkeVXxM5x8qp26MU';
const channelId = process.env.CHANNEL_ID || '@test_hot_tours';

// Путь к JSON-файлу с турами
const toursFilePath = path.join(__dirname, '..', 'data', 'tours.json');

// Создаем экземпляр бота
const bot = new TelegramBot(token, { polling: true });

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Привет! Я бот для публикации туров в канал. Используйте /help для получения списка команд.');
});

// Обработчик команды /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 
    'Доступные команды:\n' +
    '/start - Начать работу с ботом\n' +
    '/help - Показать список команд\n' +
    '/publish <minutes> - Начать публикацию туров с интервалом в минутах\n' +
    '/stop - Остановить публикацию туров\n' +
    '/status - Показать статус публикации'
  );
});

// Обработчик команды /publish
bot.onText(/\/publish(?:\s+(\d+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const intervalMinutes = parseInt(match[1]) || 60; // По умолчанию 60 минут
  
  const success = publisher.startPublishing(
    bot,
    channelId,
    toursFilePath,
    null, // Публикуем все туры
    intervalMinutes,
    'default' // Используем 'default' как ID публикации
  );
  
  if (success) {
    bot.sendMessage(chatId, `Публикация туров запущена с интервалом ${intervalMinutes} минут.`);
  } else {
    bot.sendMessage(chatId, 'Не удалось запустить публикацию туров. Проверьте наличие файла с турами.');
  }
});

// Обработчик команды /stop
bot.onText(/\/stop/, (msg) => {
  const chatId = msg.chat.id;
  
  const success = publisher.stopPublishing('default');
  
  if (success) {
    bot.sendMessage(chatId, 'Публикация туров остановлена.');
  } else {
    bot.sendMessage(chatId, 'Нет активных публикаций для остановки.');
  }
});

// Обработчик команды /status
bot.onText(/\/status/, (msg) => {
  const chatId = msg.chat.id;
  
  const activePublishings = publisher.getActivePublishings();
  
  if (Object.keys(activePublishings).length === 0) {
    bot.sendMessage(chatId, 'Нет активных публикаций.');
  } else {
    let statusMessage = 'Активные публикации:\n';
    
    for (const [id, info] of Object.entries(activePublishings)) {
      statusMessage += `- ID: ${id}\n`;
      statusMessage += `  Канал: ${info.channelId}\n`;
      statusMessage += `  Количество туров: ${info.toursCount}\n`;
      statusMessage += `  Интервал: ${info.intervalMinutes} минут\n\n`;
    }
    
    bot.sendMessage(chatId, statusMessage);
  }
});

// Обработчик для всех текстовых сообщений
bot.on('message', (msg) => {
  // Обрабатываем только текстовые сообщения, которые не являются командами
  if (msg.text && !msg.text.startsWith('/')) {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Используйте команды для управления ботом. Отправьте /help для получения списка команд.');
  }
});

// Функция для экспорта бота (чтобы использовать его в других частях приложения)
const getBot = () => bot;

module.exports = {
  bot,
  getBot
};

// Если файл запущен напрямую (не импортирован), запускаем бота
if (require.main === module) {
  console.log('Бот запущен. Используйте команду /help для получения списка доступных команд.');
}