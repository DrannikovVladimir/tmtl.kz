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
    
    // Проверяем, есть ли у тура массив фотографий
    if (!tour.photos || tour.photos.length === 0) {
      console.error('У тура нет фотографий:', tour.name);
      return false;
    }
    
    // Создаем массив доступных фотографий
    // Используем Set для хранения уникальных URL фотографий
    const uniquePhotos = [...new Set(tour.photos)];
    
    // Если уникальных фотографий слишком мало, просто отправляем одну фотографию
    if (uniquePhotos.length <= 1) {
      await bot.sendPhoto(channelId, uniquePhotos[0], {
        caption: postText,
        parse_mode: 'HTML'
      });
      console.log(`Опубликован пост о туре с одной фотографией: ${tour.name}`);
      return true;
    }
    
    // Функция для перемешивания массива (алгоритм Фишера-Йейтса)
    const shuffleArray = (array) => {
      const result = [...array]; // Создаем копию массива
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    };
    
    // Перемешиваем уникальные фотографии
    const shuffledPhotos = shuffleArray(uniquePhotos);
    
    // Выбираем до 5 уникальных фотографий (первая будет использоваться для текста)
    const photosToSend = shuffledPhotos.slice(0, Math.min(5, shuffledPhotos.length));
    
    // Готовим массив медиа для отправки группой
    const mediaGroup = photosToSend.map((photoUrl, index) => {
      // Первое фото в группе содержит текст
      if (index === 0) {
        return {
          type: 'photo',
          media: photoUrl,
          caption: postText,
          parse_mode: 'HTML'
        };
      }
      // Остальные фото без текста
      return {
        type: 'photo',
        media: photoUrl
      };
    });
    
    // Отправляем группу фотографий
    await bot.sendMediaGroup(channelId, mediaGroup);
    
    console.log(`Опубликован пост о туре с ${photosToSend.length} уникальными фотографиями: ${tour.name}`);
    return true;
  } catch (error) {
    console.error('Ошибка при публикации поста:', error);
    console.error(error.stack);
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