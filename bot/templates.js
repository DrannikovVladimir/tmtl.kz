/**
 * Форматирует пост о туре для публикации в канал
 * @param {Object} tour - Объект с данными о туре
 * @returns {String} - Отформатированный текст сообщения
 */
const formatTourPost = (tour) => {
  // Форматирование цены
  const price = tour.currentPrice ? new Intl.NumberFormat('ru-RU').format(tour.currentPrice) : 'По запросу';
  
  // Заголовок (заглушка, которую вы можете заменить позже)
  const title = tour.title || '🔥 Горящий тур в Турцию!';
  
  // Рейтинг (заглушка, если его нет в данных)
  const rating = tour.rating ? `💯 Рейтинг: ${tour.rating}/10\n` : '';
  
  // Данные о перелете (заглушка, если нет в данных)
  const fromCity = tour.fromCity || 'Астаны';
  
  // Формирование основного текста поста
  let postText = `🔥 ${title}\n\n` +
         `🏨 *${tour.name}*\n` +
         `📍 ${tour.location}\n\n` +
         `${tour.description}\n\n` +
         `${rating}` +
         `📆 ${tour.date}\n` +
         `🌔 ${tour.nights} ночей\n`;
  
  // Добавляем питание, если оно есть
  if (tour.meal) {
    postText += `🍽 ${tour.meal}\n`;
  }
  
  // Добавляем информацию о гостях и перелете
  postText += `✈️ из ${fromCity} - ${price} ₽ на ${tour.guests || '2-х'}\n\n`;
  
  // Добавляем информацию о включенных услугах
  postText += `✅ В цену включено:\n` +
         `- Перелет\n` +
         `- Проживание в отеле ${tour.stars ? tour.stars + '*' : ''}⭐️\n` +
         `- Питание ${tour.meal || 'по программе'}\n` +
         `- Трансфер аэропорт-отель-аэропорт\n` +
         `- Медицинская страховка\n` +
         `- Туркод\n\n`;
  
  // Добавляем контактную информацию
  postText += `📲 Наши контакты:\n` +
         `✔️ [whatsApp](https://wa.me/77078863633)\n` +
         `✔️ +7 (707) 886 36 33\n` +
         `👉 [Туры в Турцию из ${fromCity}](https://tmtl.kz)\n\n` +
         `❗️ Стоимость актуальна на день публикации\n` +
         `🖌 Подписывайтесь на наш [Инстаграм](https://www.instagram.com/_timetotravel_krg)`;
  
  return postText;
};

/**
 * Создает клавиатуру с кнопкой для перехода на страницу отеля
 * @param {String} url - Ссылка на страницу отеля
 * @returns {Object} - Объект клавиатуры для Telegram
 */
const createHotelKeyboard = (url) => {
  return {
    inline_keyboard: [
      [
        {
          text: '👉 Подробнее об отеле',
          url: url
        }
      ],
      [
        {
          text: '🌐 Наш сайт',
          url: 'https://tmtl.kz'
        }
      ]
    ]
  };
};

module.exports = {
  formatTourPost,
  createHotelKeyboard
};