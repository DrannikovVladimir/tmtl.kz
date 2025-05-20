/**
 * Форматирует пост о туре для публикации в канал
 * @param {Object} tour - Объект с данными о туре
 * @returns {String} - Отформатированный текст сообщения в HTML-разметке
 */
const formatTourPost = (tour) => {
  // Обработка цен и скидок
  let currentPriceFormatted, oldPriceFormatted, discountPercent, priceText;

  // Проверяем наличие текущей цены
  if (tour.currentPrice) {
    // Форматируем текущую цену
    currentPriceFormatted = new Intl.NumberFormat('ru-RU').format(tour.currentPrice);
    
    // Проверяем, есть ли старая цена и процент скидки
    if (tour.oldPrice && tour.discountPercentage) {
      // Вариант 1: Есть все параметры - используем как есть
      oldPriceFormatted = new Intl.NumberFormat('ru-RU').format(tour.oldPrice);
      discountPercent = tour.discountPercentage;
    } else {
      // Вариант 2: Только текущая цена - генерируем "скидку"
      
      // Генерируем случайную скидку от 15% до 25%
      discountPercent = Math.floor(Math.random() * (25 - 15 + 1)) + 15;
      
      // Рассчитываем "старую" цену
      const coefficient = 1 / (1 - discountPercent / 100);
      const calculatedOldPrice = Math.round(tour.currentPrice * coefficient);
      
      // Форматируем "старую" цену
      oldPriceFormatted = new Intl.NumberFormat('ru-RU').format(calculatedOldPrice);
    }
    
    // Формируем строки с информацией о цене на разных строках с форматированием HTML
    priceText = `💥<s>${oldPriceFormatted} ₸</s>, скидка: <b>${discountPercent}%</b>\n` +
                `Цена: <b>${currentPriceFormatted} ₸</b>`;
  } else {
    // Если цена вообще не указана
    priceText = 'По запросу';
  }
  
  // Формируем заголовок с учетом страны
  const country = tour.country || 'Турцию';
  const title = tour.title || `Горящий тур! ${country}`;
  
  // Рейтинг (если есть в данных)
  const rating = tour.rating ? `💯 Рейтинг: ${tour.rating}/10\n` : '';
  
  // Данные о перелете (заглушка, если нет в данных)
  const fromCity = tour.fromCity || 'Астаны';
  
  // Формирование основного текста поста с HTML-разметкой
  let postText = `🔥 <b>${title}</b>\n\n` +
         `🏨 <b>${tour.name}</b>, ${tour.location}\n` +
         `${tour.description}\n` +
         `${rating}\n` +
         `📆 ${tour.date}\n` +
         `🌔 ${parseInt(tour.nights) + 1} дней\n`;
  
  // Добавляем питание, если оно есть
  if (tour.meal) {
    postText += `🍽 ${tour.meal}\n`;
  }
  
  // Добавляем информацию о гостях и перелете
  postText += `✈️ из ${fromCity}\n${priceText} на ${tour.guests || '<b>2-х</b>'}\n\n`;
  
  // Добавляем информацию о включенных услугах
  postText += `✅ В цену включено:\n` +
         `- Перелет\n` +
         `- Проживание в отеле ${tour.stars ? tour.stars + '*' : ''}\n` +
         `- Питание ${tour.meal || 'по программе'}\n` +
         `- Трансфер аэропорт-отель-аэропорт\n` +
         `- Медицинская страховка\n` +
         `- Туркод\n\n`;
  
  // URL для страницы туров (используем tourPageUrl, если есть, иначе общий URL)
  const tourUrl = tour.tourPageUrl || 'https://tmtl.kz';
  
  // Добавляем контактную информацию с кликабельными ссылками в HTML-формате
  postText += `📲 Наши контакты:\n` +
         `✔️ <a href="https://wa.me/77078863633">whatsApp</a>\n` +
         `✔️ +7 (707) 886 36 33\n` +
         `👉 <a href="${tourUrl}">Туры в ${country} из ${fromCity}</a>\n\n` +
         `❗️ Стоимость актуальна на день публикации\n` +
         `🖌 Подписывайтесь на наш <a href="https://www.instagram.com/_timetotravel_krg">Инстаграм</a>`;
  
  return postText;
}

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