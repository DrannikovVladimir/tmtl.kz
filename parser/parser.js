/**
* Парсер туров с сайтов tourvisor.ru и tmtl.kz
* Версия: 5.0
* Дата: 17.05.2025
* Улучшения: увеличенные задержки, строгая последовательность обработки, надежное закрытие вкладок
*/

// Функция для логирования в консоль с временной меткой
function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = `[${timestamp}] [${type.toUpperCase()}]`;
  
  switch (type) {
    case 'error':
      console.error(`${prefix} ${message}`);
      break;
    case 'warn':
      console.warn(`${prefix} ${message}`);
      break;
    case 'info':
    default:
      console.log(`${prefix} ${message}`);
  }
 }
 
 // Функция для задержки выполнения (промис, ожидающий указанное время)
 function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
 }
 
 // Имитация клика на элемент
 function simulateClick(element) {
  if (!element) return false;
  
  try {
    // Создаем и диспатчим событие клика
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    
    element.dispatchEvent(clickEvent);
    return true;
  } catch (error) {
    log(`Ошибка при имитации клика: ${error.message}`, 'error');
    return false;
  }
 }
 
 // Функция для ожидания появления элемента с таймаутом
 async function waitForElement(parent, selector, maxWaitTime = 1000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    const element = parent.querySelector(selector);
    if (element) {
      return element;
    }
    await delay(100); // Проверяем каждые 100 мс
  }
  
  return null; // Элемент не найден в течение указанного времени
 }
 
 // Функция для закрытия всех открытых вкладок в элементе
 async function closeAllTabs(element) {
  try {
    // Ищем все возможные кнопки закрытия
    const closeButtons = element.querySelectorAll('.TVResultNavButtonClose, [class*="Close"], [class*="ButtonClose"]');
    
    for (const button of closeButtons) {
      simulateClick(button);
      await delay(300); // Ждем между закрытиями
    }
    
    return true;
  } catch (error) {
    log(`Ошибка при закрытии вкладок: ${error.message}`, 'warn');
    return false;
  }
 }
 
 // Главная функция парсера с асинхронной обработкой
 async function parseTours() {
  log('Начинаем парсинг туров...');
  
  try {
    // Находим все элементы туров на странице
    const tourElements = document.querySelectorAll('.TVResultListViewItem');
    
    if (!tourElements || tourElements.length === 0) {
      throw new Error('Не найдены элементы туров на странице. Проверьте селекторы или загрузку страницы.');
    }
    
    log(`Найдено туров: ${tourElements.length}`);
    
    // Массив для хранения собранных данных
    const tours = [];
    
    // Обработка каждого элемента тура строго последовательно
    for (let index = 0; index < tourElements.length; index++) {
      const tourElement = tourElements[index];
      
      try {
        log(`Обработка тура #${index + 1}`);
        
        // Закрываем все возможно открытые вкладки перед началом обработки
        await closeAllTabs(tourElement);
        await delay(500);
        
        // Извлекаем базовую информацию о туре (доступна без клика)
        const tour = {
          name: getHotelName(tourElement),
          stars: getHotelStars(tourElement),
          location: getHotelLocation(tourElement),
          description: getHotelDescription(tourElement),
          hotelUrl: getHotelUrl(tourElement),
          rating: getHotelRating(tourElement),
          currentPrice: getCurrentPrice(tourElement),
          oldPrice: getOldPrice(tourElement),
          discountPercentage: getDiscountPercentage(tourElement),
          photos: [], // Будет заполнено позже
          date: '',
          nights: 0,
          roomType: '',
          meal: '',
          guests: ''
        };
        
        log(`Базовая информация о туре #${index + 1} получена, получаем фотографии...`);
        
        // Шаг 1: Получаем фотографии отеля
        tour.photos = await getHotelPhotos(tourElement);
        
        // Небольшая задержка между операциями
        await delay(500);
        
        log(`Получаем детальную информацию о туре #${index + 1}...`);
        
        // Шаг 2: Получаем детальную информацию о туре (даты, ночи и т.д.)
        const tourDetails = await getTourDetails(tourElement);
        
        // Объединяем детальную информацию с основной
        Object.assign(tour, tourDetails);
        
        // Добавляем тур в массив результатов
        tours.push(tour);
        log(`Тур #${index + 1} успешно обработан и добавлен в результаты`);
        
        // Задержка перед обработкой следующего тура
        await delay(800);
      } catch (tourError) {
        log(`Ошибка при обработке тура #${index + 1}: ${tourError.message}`, 'error');
        
        // Пытаемся закрыть все открытые вкладки перед переходом к следующему туру
        await closeAllTabs(tourElement);
        await delay(800);
      }
    }
    
    log(`Всего обработано туров: ${tours.length}`);
    
    // Формирование результатов в формате JSON
    const jsonResult = JSON.stringify(tours, null, 2);
    
    // Вывод результатов в консоль
    log('Результаты парсинга:');
    console.log(jsonResult);
    
    // Копирование результатов в буфер обмена
    copyToClipboard(jsonResult);
    
    // Сохранение в файл
    saveToFile(tours, 'tours_' + new Date().toISOString().slice(0, 10) + '.json');
    
    return tours;
  } catch (error) {
    log(`Ошибка при парсинге: ${error.message}`, 'error');
    return [];
  }
 }

// Функция для получения фотографий отеля - исправленная версия
async function getHotelPhotos(tourElement) {
  try {
    // Ищем кнопку "Об отеле" с правильным селектором
    const aboutHotelButton = tourElement.querySelector('.TVResultNavButton');
    
    // Проверяем, нашли ли мы кнопку
    if (!aboutHotelButton) {
      log('Кнопка "Об отеле" не найдена с основным селектором, пробуем альтернативные...', 'warn');
      // Пробуем другие селекторы
      const altButton = tourElement.querySelector('button[class*="TVResult"]');
      
      if (!altButton) {
        log('Не удалось найти кнопку "Об отеле"', 'error');
        return [];
      }
      
      log('Найдена альтернативная кнопка "Об отеле"');
      // Имитируем клик на найденную кнопку
      simulateClick(altButton);
    } else {
      log('Найдена кнопка "Об отеле", кликаем...');
      simulateClick(aboutHotelButton);
    }
    
    // Увеличиваем задержку для гарантированной загрузки данных
    await delay(1500);
    
    // Более гибкий подход к поиску фотографий - не ищем конкретный контейнер,
    // а сразу ищем все элементы с фоновыми изображениями в рамках tourElement
    const elements = tourElement.querySelectorAll('[style*="background-image"]');
    log(`Найдено ${elements.length} элементов с фоновыми изображениями`);
    
    // Массив для хранения URL фотографий
    const photoUrls = [];
    
    // Извлекаем URL фотографий из элементов
    for (const element of elements) {
      try {
        const style = element.getAttribute('style');
        if (style) {
          const matches = style.match(/background-image:\s*url\(['"](.*?)['"]\)/i);
          if (matches && matches[1]) {
            const photoUrl = matches[1];
            // Фильтруем изображения с большей вероятностью относящиеся к отелю
            // Ищем URL, содержащие hotel_pics или static.tourvisor.ru
            if (photoUrl && (photoUrl.includes('hotel_pics') || photoUrl.includes('tourvisor.ru')) && !photoUrls.includes(photoUrl)) {
              // Добавляем протокол https:, если URL начинается с //
              const fullUrl = photoUrl.startsWith('//') ? 'https:' + photoUrl : photoUrl;
              photoUrls.push(fullUrl);
              
              // Выводим в консоль для отладки
              log(`Найдено фото: ${fullUrl}`);
              
              // Ограничиваем количество фотографий до 10
              if (photoUrls.length >= 10) {
                break;
              }
            }
          }
        }
      } catch (err) {
        log(`Ошибка при обработке элемента с фото: ${err.message}`, 'warn');
        continue; // Продолжаем с следующим элементом
      }
    }
    
    // Если не нашли фотографии в фоновых изображениях, ищем теги img
    if (photoUrls.length === 0) {
      log('Не найдены фото в фоновых изображениях, ищем теги img...');
      const imgElements = tourElement.querySelectorAll('img');
      
      for (const img of imgElements) {
        try {
          const src = img.getAttribute('src');
          if (src && (src.includes('hotel_pics') || src.includes('tourvisor.ru')) && !photoUrls.includes(src)) {
            // Добавляем протокол https:, если URL начинается с //
            const fullUrl = src.startsWith('//') ? 'https:' + src : src;
            photoUrls.push(fullUrl);
            
            log(`Найдено фото (img): ${fullUrl}`);
            
            if (photoUrls.length >= 10) {
              break;
            }
          }
        } catch (err) {
          log(`Ошибка при обработке тега img: ${err.message}`, 'warn');
          continue;
        }
      }
    }
    
    // Если все еще нет фотографий, пробуем найти основное изображение отеля
    if (photoUrls.length === 0) {
      log('Не удалось найти фотографии, ищем основное изображение отеля...');
      const mainImageElement = tourElement.querySelector('[class*="Gallery"], [class*="Photo"]');
      
      if (mainImageElement) {
        const style = mainImageElement.getAttribute('style');
        if (style) {
          const matches = style.match(/background-image:\s*url\(['"](.*?)['"]\)/i);
          if (matches && matches[1]) {
            const photoUrl = matches[1];
            const fullUrl = photoUrl.startsWith('//') ? 'https:' + photoUrl : photoUrl;
            photoUrls.push(fullUrl);
            log(`Найдено основное изображение отеля: ${fullUrl}`);
          }
        }
      }
    }
    
    log(`Всего найдено ${photoUrls.length} фотографий отеля`);
    
    // Важно: закрываем вкладку "Об отеле" перед возвратом результата
    // const closeButtons = tourElement.querySelectorAll('[class*="Close"], [class*="ButtonClose"]');
    // let closeSuccess = false;
    
    // for (const button of closeButtons) {
    //   try {
    //     log('Пытаемся закрыть вкладку "Об отеле"');
    //     simulateClick(button);
    //     closeSuccess = true;
    //     break;
    //   } catch (err) {
    //     continue;
    //   }
    // }
    
    // if (!closeSuccess) {
    //   log('Не удалось найти кнопку закрытия вкладки "Об отеле"', 'warn');
    // }

    const closeButton = tourElement.querySelector('.TVResultNavButton.TVActive');
    if (closeButton) {
        log('Закрываем вкладку "Об отеле"');
        simulateClick(closeButton);
        await delay(800);
    } else {
        log('Кнопка закрытия не найдена', 'warn');
    }
    
    // Ждем, пока вкладка закроется
    await delay(800);
    
    return photoUrls;
  } catch (error) {
    log(`Ошибка при получении фотографий отеля: ${error.message}`, 'error');
    return [];
  }
}
 
 // Функция для получения детальной информации о туре
 async function getTourDetails(tourElement) {
  try {
    // Результаты по умолчанию
    const details = {
      date: '',
      nights: 0,
      roomType: '',
      meal: '',
      guests: ''
    };
    
    // Ищем кликабельный элемент с ценой
    const priceElement = tourElement.querySelector('.TVResultItemPrice');
    
    if (!priceElement) {
      log('Элемент с ценой не найден, невозможно получить детальную информацию', 'warn');
      return details;
    }
    
    // Имитируем клик для отображения деталей тура
    log('Кликаем на элемент с ценой для получения деталей тура...');
    simulateClick(priceElement);
    
    // Ждем загрузки деталей (увеличенная задержка)
    await delay(1000);
    
    // Проверяем, что детали тура отобразились
    const tourDetailsElement = await waitForElement(tourElement, '.TVResultToursContent', 2000);
    
    if (tourDetailsElement) {
      // Извлекаем детальную информацию о туре
      log('Детали тура загружены, извлекаем информацию...');
      
      // Дата
      const dateElement = tourDetailsElement.querySelector('.TVTourResultItemDate');
      if (dateElement) {
        details.date = dateElement.textContent.trim();
      }
      
      // Ночи
      const nightsElement = tourDetailsElement.querySelector('.TVTourResultItemNights');
      if (nightsElement) {
        const nightsText = nightsElement.textContent.trim();
        const nightsMatch = nightsText.match(/(\d+)/);
        if (nightsMatch && nightsMatch[1]) {
          details.nights = parseInt(nightsMatch[1]);
        }
      }
      
      // Тип номера
      const roomElement = tourDetailsElement.querySelector('.TVTourResultItemRoom');
      if (roomElement) {
        details.roomType = roomElement.textContent.trim();
      }
      
      // Питание
      const mealElement = tourDetailsElement.querySelector('.TVTourResultItemMeal');
      if (mealElement) {
        details.meal = mealElement.textContent.trim();
      }
      
      // Информация о гостях
      const guestsElement = tourDetailsElement.querySelector('[class*="Tourists"]');
      if (guestsElement) {
        details.guests = guestsElement.textContent.trim();
      }
      
      log('Детальная информация успешно извлечена');
    } else {
      log('Не удалось дождаться загрузки деталей тура', 'warn');
    }
    
    // Важно: закрываем вкладку с деталями перед возвратом результата
    const closeButton = tourElement.querySelector('.TVResultItemPriceValueArrow.TVActive');
    if (closeButton) {
      log('Закрываем вкладку с деталями тура');
      simulateClick(closeButton);
      // Ждем, пока вкладка закроется
      await delay(800);
    } else {
      log('Кнопка закрытия вкладки с деталями не найдена', 'warn');
    }
    
    return details;
  } catch (error) {
    log(`Ошибка при получении детальной информации о туре: ${error.message}`, 'error');
    return {
      date: '',
      nights: 0,
      roomType: '',
      meal: '',
      guests: ''
    };
  }
 }
 
 // Функция для получения названия отеля
 function getHotelName(tourElement) {
  try {
    const nameElement = tourElement.querySelector('.TVHotelInfoTitleLink');
    if (!nameElement) {
      throw new Error('Элемент с названием отеля не найден');
    }
    return nameElement.textContent.trim();
  } catch (error) {
    log(`Ошибка при получении названия отеля: ${error.message}`, 'warn');
    return 'Н/Д';
  }
 }
 
 // Функция для получения количества звезд отеля
 function getHotelStars(tourElement) {
  try {
    // Обычно звезды отображаются в заголовке и в названии отеля (например, "3*")
    const nameElement = tourElement.querySelector('.TVHotelInfoTitleLink');
    if (!nameElement) {
      throw new Error('Элемент с названием отеля не найден');
    }
    
    const text = nameElement.textContent;
    const starsMatch = text.match(/(\d)[*★]/);
    
    if (starsMatch) {
      return parseInt(starsMatch[1]);
    }
    
    // Альтернативный вариант - подсчет количества звездочек в разделе рейтинга
    const starsElements = tourElement.querySelectorAll('.TVHotelInfoStar');
    if (starsElements && starsElements.length > 0) {
      return starsElements.length;
    }
    
    return 0;
  } catch (error) {
    log(`Ошибка при получении количества звезд отеля: ${error.message}`, 'warn');
    return 0;
  }
 }
 
 // Функция для получения местоположения отеля
 function getHotelLocation(tourElement) {
  try {
    // Сначала проверяем селектор из скриншота
    const locationElement = tourElement.querySelector('.TVResultItemSubTitle');
    if (locationElement) {
      return locationElement.textContent.trim();
    }
    
    // Запасной вариант - ищем по старому селектору
    const altLocationElement = tourElement.querySelector('.TVHotelInfoSubTitle');
    if (altLocationElement) {
      return altLocationElement.textContent.trim();
    }
    
    return 'Н/Д';
  } catch (error) {
    log(`Ошибка при получении местоположения отеля: ${error.message}`, 'warn');
    return 'Н/Д';
  }
 }

 // Функция для получения рейтинга отеля
function getHotelRating(tourElement) {
  try {
    // Ищем элемент с рейтингом по селектору
    const ratingElement = tourElement.querySelector('.TVHotelInfoRating');
    
    if (!ratingElement) {
      // Если элемент не найден, возвращаем 0
      return 0;
    }
    
    // Получаем текст элемента и преобразуем в число
    const ratingText = ratingElement.textContent.trim();
    const rating = parseFloat(ratingText);
    
    if (!isNaN(rating)) {
      // Умножаем рейтинг на 2, чтобы привести к шкале от 0 до 10
      return rating * 2;
    }
    
    return 0;
  } catch (error) {
    log(`Ошибка при получении рейтинга отеля: ${error.message}`, 'warn');
    return 0;
  }
}
 
 // Функция для получения описания отеля
 function getHotelDescription(tourElement) {
  try {
    const descriptionElement = tourElement.querySelector('.TVResultItemDescription');
    if (!descriptionElement) {
      return ''; // Описание может отсутствовать
    }
    return descriptionElement.textContent.trim();
  } catch (error) {
    log(`Ошибка при получении описания отеля: ${error.message}`, 'warn');
    return '';
  }
 }
 
 // Функция для получения URL страницы отеля
 function getHotelUrl(tourElement) {
  try {
    const linkElement = tourElement.querySelector('.TVHotelInfoTitleLink');
    if (!linkElement) {
      throw new Error('Элемент со ссылкой на отель не найден');
    }
    return linkElement.getAttribute('href') || '';
  } catch (error) {
    log(`Ошибка при получении URL страницы отеля: ${error.message}`, 'warn');
    return '';
  }
 }
 
 // Функция для получения текущей цены тура
 function getCurrentPrice(tourElement) {
  try {
    // Попытка найти точный селектор для текущей цены
    const priceValueElement = tourElement.querySelector('.TVResultItemPriceValue');
    if (priceValueElement) {
      const priceText = priceValueElement.textContent.trim();
      // Извлекаем только числовые значения из цены
      const priceDigits = priceText.replace(/[^\d]/g, '');
      if (priceDigits) {
        return parseInt(priceDigits);
      }
    }
    
    // Альтернативный вариант - поиск по селекторам из скриншотов
    const alternativePriceElement = tourElement.querySelector('.TVResultItemPrice .TVResultItemPriceValue');
    if (alternativePriceElement) {
      const priceText = alternativePriceElement.textContent.trim();
      const priceDigits = priceText.replace(/[^\d]/g, '');
      if (priceDigits) {
        return parseInt(priceDigits);
      }
    }
    
    // Еще один вариант поиска цены
    const anyPriceElement = tourElement.querySelector('[class*="PriceValue"]');
    if (anyPriceElement) {
      const priceText = anyPriceElement.textContent.trim();
      const priceDigits = priceText.replace(/[^\d]/g, '');
      if (priceDigits) {
        return parseInt(priceDigits);
      }
    }
    
    // Поиск по формату "цена ТНГ"
    const priceElements = tourElement.querySelectorAll('div, span');
    for (const element of priceElements) {
      const text = element.textContent.trim();
      const priceMatch = text.match(/(\d[\d\s]+)(?:\s*(?:ТНГ|тг|тнг|₸))/i);
      if (priceMatch && priceMatch[1]) {
        const priceDigits = priceMatch[1].replace(/\s/g, '');
        if (priceDigits) {
          const price = parseInt(priceDigits);
          if (price > 0 && price < 10000000) { // Проверка на разумность цены
            return price;
          }
        }
      }
    }
    
    return 0;
  } catch (error) {
    log(`Ошибка при получении текущей цены тура: ${error.message}`, 'warn');
    return 0;
  }
 }
 
 // Функция для получения старой цены тура (если есть скидка)
 function getOldPrice(tourElement) {
  try {
    // Поиск элемента со старой ценой (часто бывает зачеркнутым)
    const oldPriceElement = tourElement.querySelector('.TVResultItemOldPrice');
    if (oldPriceElement) {
      const priceText = oldPriceElement.textContent.trim();
      const priceDigits = priceText.replace(/[^\d]/g, '');
      if (priceDigits) {
        return parseInt(priceDigits);
      }
    }
    
    // Поиск по другим возможным селекторам для старой цены
    const alternativeOldPriceElement = tourElement.querySelector('[class*="OldPrice"]');
    if (alternativeOldPriceElement) {
      const priceText = alternativeOldPriceElement.textContent.trim();
      const priceDigits = priceText.replace(/[^\d]/g, '');
      if (priceDigits) {
        return parseInt(priceDigits);
      }
    }
    
    return 0; // Если старой цены нет (нет скидки)
  } catch (error) {
    log(`Ошибка при получении старой цены тура: ${error.message}`, 'warn');
    return 0;
  }
 }
 
 // Функция для получения процента скидки
 function getDiscountPercentage(tourElement) {
  try {
    // Поиск элемента с процентом скидки
    const discountElements = tourElement.querySelectorAll('div, span');
    for (const element of discountElements) {
      const text = element.textContent.trim();
      // Ищем формат "-X%" или скидка X%
      const discountMatch = text.match(/[-−](\d+)%/);
      if (discountMatch && discountMatch[1]) {
        return parseInt(discountMatch[1]);
      }
    }
    
    return 0; // Если скидки нет
  } catch (error) {
    log(`Ошибка при получении процента скидки: ${error.message}`, 'warn');
    return 0;
  }
 }
 
 // Функция для копирования текста в буфер обмена
 function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          log('Результаты успешно скопированы в буфер обмена');
        })
        .catch(error => {
          log(`Не удалось скопировать результаты в буфер обмена: ${error.message}`, 'warn');
          showCopyFallback(text);
        });
    } else {
      showCopyFallback(text);
    }
  } catch (error) {
    log(`Ошибка при копировании в буфер обмена: ${error.message}`, 'warn');
    showCopyFallback(text);
  }
 }
 
 // Резервный вариант копирования для браузеров, не поддерживающих Clipboard API
 function showCopyFallback(text) {
  log('Используем резервный метод копирования');
  
  // Создаем временный текстовый элемент
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      log('Результаты успешно скопированы в буфер обмена (резервный метод)');
    } else {
      log('Не удалось скопировать результаты в буфер обмена (резервный метод)', 'warn');
      log('Пожалуйста, выделите и скопируйте текст вручную из консоли', 'warn');
    }
  } catch (err) {
    log('Не удалось скопировать результаты в буфер обмена (резервный метод)', 'warn');
    log('Пожалуйста, выделите и скопируйте текст вручную из консоли', 'warn');
  }
  
  document.body.removeChild(textarea);
 }
 
 // Функция для сохранения результатов в файл
 function saveToFile(data, filename = 'tours.json') {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
    log(`Результаты сохранены в файл ${filename}`);
  } catch (error) {
    log(`Ошибка при сохранении файла: ${error.message}`, 'error');
  }
 }
 
 // Запуск парсера (с использованием async/await)
 log('Парсер туров загружен. Запускаем парсинг...');
 parseTours().then(results => {
  log(`Парсинг завершен. Обработано ${results.length} туров.`);
 }).catch(error => {
  log(`Критическая ошибка при парсинге: ${error.message}`, 'error');
 });