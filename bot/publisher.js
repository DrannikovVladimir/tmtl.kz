// bot/publisher.js

const fs = require('fs');
const path = require('path');
const templates = require('./templates');

// Хранилище активных интервалов публикации
const publishingIntervals = {};

/**
 * Читает туры из JSON-файла
 * @param {String} filePath - Путь к JSON-файлу с турами
 * @returns {Array} - Массив объектов с турами
 */
const readToursFromFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Ошибка при чтении файла с турами:', error);
    return [];
  }
};

/**
 * Публикует пост о туре в канал
 * @param {Object} bot - Экземпляр Telegram бота
 * @param {String} channelId - ID канала для публикации
 * @param {Object} tour - Объект с данными о туре
 * @returns {Promise<Boolean>} - Результат публикации
 */
const publishTourPost = async (bot, channelId, tour) => {
  try {
    // Форматируем текст поста
    const postText = templates.formatTourPost(tour);
    
    // Получаем URL первой фотографии тура
    const photoUrl = tour.photos[0];
    
    // Создаем клавиатуру с кнопкой
    const keyboard = templates.createHotelKeyboard(tour.hotelUrl);
    
    // Публикуем пост с фото, текстом и кнопкой
    await bot.sendPhoto(channelId, photoUrl, {
      caption: postText,
      parse_mode: 'Markdown',
      reply_markup: JSON.stringify(keyboard)
    });
    
    console.log(`Опубликован пост о туре: ${tour.name}`);
    return true;
  } catch (error) {
    console.error('Ошибка при публикации поста:', error);
    return false;
  }
};

/**
 * Запускает регулярную публикацию туров
 * @param {Object} bot - Экземпляр Telegram бота
 * @param {String} channelId - ID канала для публикации
 * @param {String} toursFilePath - Путь к JSON-файлу с турами
 * @param {Array} tourIds - Массив ID туров для публикации (опционально)
 * @param {Number} intervalMinutes - Интервал между публикациями в минутах
 * @param {String} publishId - Уникальный идентификатор публикации
 * @returns {Boolean} - Результат запуска публикации
 */
const startPublishing = (bot, channelId, toursFilePath, tourIds, intervalMinutes, publishId) => {
  // Останавливаем предыдущую публикацию с этим ID, если она существует
  if (publishingIntervals[publishId]) {
    clearInterval(publishingIntervals[publishId].interval);
    delete publishingIntervals[publishId];
  }
  
  // Считываем туры из файла
  const tours = readToursFromFile(toursFilePath);
  
  if (tours.length === 0) {
    console.error('Нет туров для публикации');
    return false;
  }
  
  // Выбираем туры для публикации
  let selectedTours = tourIds && tourIds.length > 0
    ? tours.filter((_, index) => tourIds.includes(index))
    : tours;
  
  if (selectedTours.length === 0) {
    console.error('Нет выбранных туров для публикации');
    return false;
  }
  
  console.log(`Запуск публикации ${selectedTours.length} туров с интервалом ${intervalMinutes} минут`);
  
  // Индекс текущего тура
  let currentIndex = 0;
  
  // Публикуем первый тур сразу
  publishTourPost(bot, channelId, selectedTours[currentIndex]);
  
  // Создаем интервал для публикации следующих туров
  const interval = setInterval(() => {
    // Увеличиваем индекс для следующего тура
    currentIndex++;
    
    // Проверяем, не вышли ли мы за пределы массива
    if (currentIndex >= selectedTours.length) {
      console.log('Все туры опубликованы. Публикация завершена.');
      clearInterval(interval);
      delete publishingIntervals[publishId];
      return;
    }
    
    // Публикуем следующий тур
    publishTourPost(bot, channelId, selectedTours[currentIndex]);
  }, intervalMinutes * 60 * 1000);
  
  // Сохраняем информацию об интервале
  publishingIntervals[publishId] = {
    interval,
    tours: selectedTours,
    intervalMinutes,
    channelId,
    currentIndex
  };
  
  return true;
};

/**
 * Останавливает публикацию
 * @param {String} publishId - Уникальный идентификатор публикации
 * @returns {Boolean} - Результат остановки публикации
 */
const stopPublishing = (publishId) => {
  if (publishingIntervals[publishId]) {
    clearInterval(publishingIntervals[publishId].interval);
    delete publishingIntervals[publishId];
    return true;
  }
  return false;
};

/**
 * Возвращает информацию о всех активных публикациях
 * @returns {Object} - Объект с информацией о публикациях
 */
const getActivePublishings = () => {
  const result = {};
  
  for (const [id, info] of Object.entries(publishingIntervals)) {
    result[id] = {
      channelId: info.channelId,
      toursCount: info.tours.length,
      intervalMinutes: info.intervalMinutes
    };
  }
  
  return result;
};

module.exports = {
  readToursFromFile,
  publishTourPost,
  startPublishing,
  stopPublishing,
  getActivePublishings
};