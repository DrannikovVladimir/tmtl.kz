const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const emailNotifications = require('./emailNotifications');

class TourismParser {
  constructor() {
    this.cities = {
      almaty: 'https://tmtl.kz/calendars/almaty/',
      astana: 'https://tmtl.kz/calendars/astana/',
      karaganda: 'https://tmtl.kz/calendars/karaganda/'
    };
  }

  async createStealthBrowser() {
    return await puppeteer.launch({
      headless: true, // Можно поставить false для отладки
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-features=VizDisplayCompositor',
        '--disable-dev-shm-usage',
        '--no-first-run',
        '--disable-default-apps',
        '--disable-infobars',
        '--window-size=1920,1080'
      ]
    });
  }

  async setupStealthPage(browser) {
    const page = await browser.newPage();
    
    // Реальный User-Agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Реальный viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Убираем признаки автоматизации
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
      
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });
      
      Object.defineProperty(navigator, 'languages', {
        get: () => ['ru-RU', 'ru', 'en-US', 'en'],
      });
      
      if (navigator.chrome) {
        Object.defineProperty(navigator.chrome, 'runtime', {
          get: () => undefined,
        });
      }
      
      // Очищаем storage
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Отключаем кэш
    await page.setCacheEnabled(false);
    
    // Блокируем изображения для ускорения
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (req.resourceType() === 'image') {
        req.abort();
      } else {
        req.continue();
      }
    });
    
    return page;
  }

  async parsePage(url, cityName) {
    console.log(`\n🏙️ Парсинг ${cityName}: ${url}`);
    
    let browser = null;
    
    try {
      browser = await this.createStealthBrowser();
      const page = await this.setupStealthPage(browser);
      
      console.log('🌐 Переходим на главную страницу...');
      await page.goto('https://tmtl.kz/', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      // Пауза как у реального пользователя
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log(`📍 Переходим на страницу ${cityName}...`);
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      console.log('⏳ Ждем загрузки контейнера...');
      await page.waitForSelector('.TVCalendarCountyList', { timeout: 20000 });
      
      // Эмулируем действия пользователя
      await page.evaluate(() => {
        window.scrollTo(0, 500);
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });
      
      console.log('🔄 Ожидание полной загрузки данных...');
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Извлекаем данные
      const tours = await page.evaluate(() => {
        const container = document.querySelector('.TVCalendarCountyList');
        if (!container) {
          console.log('❌ Контейнер .TVCalendarCountyList не найден');
          return [];
        }

        const allRows = container.querySelectorAll('.TVCalendarRow');
        const dataRows = [];
        
        for (let i = 0; i < allRows.length; i++) {
          const row = allRows[i];
          if (row.classList.contains('TVCalendarList') && !row.classList.contains('TVCalendarListHeader')) {
            dataRows.push(row);
          }
        }
        
        console.log(`✅ Найдено ${dataRows.length} строк с данными`);
        
        const results = [];

        for (let index = 0; index < dataRows.length; index++) {
          const row = dataRows[index];
          
          try {
            // Название страны
            const countryElement = row.querySelector('.TVCalendarCountryValue');
            const country = countryElement ? countryElement.textContent.trim() : '';

            // Дата
            const dateElement = row.querySelector('.TVCalendarDate');
            const date = dateElement ? dateElement.textContent.trim() : '';

            // Цена
            const priceElement = row.querySelector('.TVCalendarPriceValue');
            const price = priceElement ? priceElement.textContent.trim() : '';

            // Валюта
            const currencyElement = row.querySelector('.TVCalendarPriceCurrency');
            const currency = currencyElement ? currencyElement.textContent.trim() : '';

            // Температура воздуха
            const airTempElement = row.querySelector('.TVCalendarAir');
            const airTemp = airTempElement ? {
              value: airTempElement.textContent.trim(),
              title: airTempElement.getAttribute('title') || ''
            } : null;

            // Температура воды
            const waterTempElement = row.querySelector('.TVCalendarWater');
            const waterTemp = waterTempElement ? {
              value: waterTempElement.textContent.trim(),
              title: waterTempElement.getAttribute('title') || ''
            } : null;

            // Проверяем, что основные данные есть
            if (country && date && price) {
              const tourData = {
                country: country,
                date: date,
                price: price,
                currency: currency,
                priceNumeric: parseInt(price.replace(/[^\d]/g, '')) || 0,
                temperature: {
                  air: airTemp,
                  water: waterTemp
                }
              };

              results.push(tourData);
              console.log(`📝 ${index + 1}. ${country} - ${price} ${currency}`);
            } else {
              console.log(`⚠️ Строка ${index + 1}: неполные данные`);
            }
          } catch (error) {
            console.error(`❌ Ошибка при парсинге строки ${index + 1}:`, error);
          }
        }

        return results;
      });

      console.log(`✅ ${cityName}: извлечено ${tours.length} туров`);
      return tours;

    } catch (error) {
      console.error(`❌ Ошибка при парсинге ${cityName}:`, error);
      return [];
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  async parseAllCities() {
    console.log('🚀 Запуск stealth-парсера туристических данных...');
    const results = {};
    
    for (const [cityName, url] of Object.entries(this.cities)) {
      try {
        const tours = await this.parsePage(url, cityName);
        results[cityName] = tours;
        
        // Пауза между городами
        if (Object.keys(results).length < Object.keys(this.cities).length) {
          console.log('⏸️ Пауза 3 секунды перед следующим городом...');
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
        
      } catch (error) {
        console.error(`💥 Критическая ошибка для ${cityName}:`, error);
        results[cityName] = [];
      }
    }
    
    return results;
  }

  async saveToJson(data, filename = 'tourism_data.json') {
    const dataDir = path.join(__dirname, '..', 'data');
    
    try {
      await fs.mkdir(dataDir, { recursive: true });
      const filePath = path.join(dataDir, filename);
      
      const jsonData = {
        updatedAt: new Date().toISOString(),
        totalTours: Object.values(data).reduce((sum, tours) => sum + tours.length, 0),
        cities: Object.keys(data),
        data: data
      };
      
      await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
      console.log(`💾 Данные сохранены в ${filePath}`);
      
      return filePath;
    } catch (error) {
      console.error('❌ Ошибка при сохранении JSON:', error);
      throw error;
    }
  }

  async run() {
    try {
      const data = await this.parseAllCities();
      
      console.log('\n📊 ИТОГОВЫЕ РЕЗУЛЬТАТЫ:');
      console.log('='.repeat(40));
      Object.entries(data).forEach(([city, tours]) => {
        console.log(`🏙️ ${city}: ${tours.length} туров`);
        if (tours.length > 0) {
          console.log(`   📍 Первые страны: ${tours.slice(0, 3).map(t => t.country).join(', ')}...`);
        }
      });
      
      const filePath = await this.saveToJson(data);
      
      console.log('\n🎉 Парсинг завершен успешно!');
      console.log(`📁 Файл: ${filePath}`);
      console.log(`📈 Всего туров: ${Object.values(data).reduce((sum, tours) => sum + tours.length, 0)}`);
      
      try {
        const totalTours = Object.values(data).reduce((sum, tours) => sum + tours.length, 0);
        
        console.log('📧 Отправляем email уведомление...');
        
        if (totalTours < 15) {
          await emailNotifications.sendLowDataWarning(data);
        } else {
          await emailNotifications.sendParsingSuccess(data);
        }
        
        console.log('✅ Email отправлен успешно');
      } catch (emailError) {
        console.error('❌ ДЕТАЛЬНАЯ ОШИБКА EMAIL:', emailError.message); // ДОБАВЛЕНО
        console.error('❌ STACK TRACE:', emailError.stack); // ДОБАВЛЕНО
        console.error('❌ EMAIL CONFIG:', { // ДОБАВЛЕНО
          host: process.env.NOTIFICATIONS_HOST,
          user: process.env.NOTIFICATIONS_EMAIL,
          adminEmail: process.env.ADMIN_EMAIL
        });
      }

      return data;
      
    } catch (error) {
      console.error('💥 Фатальная ошибка:', error);

      try {
        console.log('📧 Отправляем уведомление об ошибке...');
        await emailNotifications.sendParsingError(error);
      } catch (emailError) {
        console.error('❌ Ошибка отправки email об ошибке:', emailError);
        // Игнорируем, не усугубляем проблему
      }

      throw error;
    }
  }
}

// Функция для запуска парсера
async function startParsing() {
  const parser = new TourismParser();
  
  try {
    return await parser.run();
  } catch (error) {
    console.error('💀 Критическая ошибка:', error);
    process.exit(1);
  }
}

// Экспорт для использования в других модулях
module.exports = {
  TourismParser,
  startParsing
};

// Запуск, если файл вызван напрямую
if (require.main === module) {
  startParsing();
}