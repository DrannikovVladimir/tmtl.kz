const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { TourismParser } = require('../services/tourismParser');

const router = express.Router();

// Путь к JSON файлу с данными
const getDataPath = () => path.join(__dirname, '..', 'data', 'tourism_data.json');

// Получить все данные
router.get('/data', async (req, res) => {
  try {
    const dataPath = getDataPath();
    const data = await fs.readFile(dataPath, 'utf8');
    const parsedData = JSON.parse(data);
    
    res.json({
      success: true,
      ...parsedData
    });
  } catch (error) {
    console.error('Ошибка при чтении данных:', error);
    res.status(500).json({
      success: false,
      error: 'Не удалось загрузить данные'
    });
  }
});

// Получить данные для конкретного города
router.get('/data/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const dataPath = getDataPath();
    const data = await fs.readFile(dataPath, 'utf8');
    const parsedData = JSON.parse(data);
    
    if (!parsedData.data[city]) {
      return res.status(404).json({
        success: false,
        error: `Данные для города ${city} не найдены`
      });
    }
    
    res.json({
      success: true,
      city: city,
      updatedAt: parsedData.updatedAt,
      tours: parsedData.data[city]
    });
  } catch (error) {
    console.error('Ошибка при чтении данных:', error);
    res.status(500).json({
      success: false,
      error: 'Не удалось загрузить данные'
    });
  }
});

// Запустить парсинг вручную
router.post('/parse', async (req, res) => {
  try {
    console.log('🔄 Запуск парсинга по API запросу...');
    
    const parser = new TourismParser();
    const data = await parser.run();
    
    res.json({
      success: true,
      message: 'Парсинг завершен успешно',
      data: data,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Ошибка при парсинге:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при парсинге данных',
      details: error.message
    });
  }
});

// Получить статус данных (когда последний раз обновлялись)
router.get('/status', async (req, res) => {
  try {
    const dataPath = getDataPath();
    const stats = await fs.stat(dataPath);
    const data = await fs.readFile(dataPath, 'utf8');
    const parsedData = JSON.parse(data);
    
    const totalTours = Object.values(parsedData.data).reduce((sum, tours) => sum + tours.length, 0);
    
    res.json({
      success: true,
      fileExists: true,
      lastModified: stats.mtime,
      updatedAt: parsedData.updatedAt,
      totalTours: totalTours,
      citiesCount: Object.keys(parsedData.data).length,
      cities: Object.keys(parsedData.data)
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.json({
        success: true,
        fileExists: false,
        message: 'Файл данных не найден. Запустите парсинг.'
      });
    } else {
      console.error('Ошибка при получении статуса:', error);
      res.status(500).json({
        success: false,
        error: 'Ошибка при получении статуса'
      });
    }
  }
});

// Поиск туров по параметрам
router.get('/search', async (req, res) => {
  try {
    const { city, country, maxPrice, minPrice } = req.query;
    
    const dataPath = getDataPath();
    const data = await fs.readFile(dataPath, 'utf8');
    const parsedData = JSON.parse(data);
    
    let results = [];
    
    // Собираем данные из нужных городов
    const citiesToSearch = city ? [city] : Object.keys(parsedData.data);
    
    citiesToSearch.forEach(cityName => {
      if (parsedData.data[cityName]) {
        const cityTours = parsedData.data[cityName].map(tour => ({
          ...tour,
          fromCity: cityName
        }));
        results = results.concat(cityTours);
      }
    });
    
    // Фильтрация
    if (country) {
      results = results.filter(tour => 
        tour.country.toLowerCase().includes(country.toLowerCase())
      );
    }
    
    if (maxPrice) {
      results = results.filter(tour => tour.priceNumeric <= parseInt(maxPrice));
    }
    
    if (minPrice) {
      results = results.filter(tour => tour.priceNumeric >= parseInt(minPrice));
    }
    
    // Сортировка по цене
    results.sort((a, b) => a.priceNumeric - b.priceNumeric);
    
    res.json({
      success: true,
      results: results,
      count: results.length,
      filters: { city, country, maxPrice, minPrice }
    });
  } catch (error) {
    console.error('Ошибка при поиске:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при поиске'
    });
  }
});

module.exports = router;