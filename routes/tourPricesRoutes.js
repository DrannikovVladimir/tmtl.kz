const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Кеш для данных
let cachedData = null;
let lastFileModified = null;

/**
 * Обрабатывает сырые данные туров и возвращает минимальные цены по странам
 * @param {Object} rawData - Сырые данные из tourism_data.json
 * @returns {Array} Массив объектов {country, minPrice}
 */
function processTopurData(rawData) {
  const result = [];
  const countries = {};
  
  // Собираем все цены по странам из всех городов
  Object.values(rawData.data).forEach(cityData => {
    cityData.forEach(tour => {
      const country = tour.country;
      const price = tour.priceNumeric;
      
      if (!countries[country] || countries[country] > price) {
        countries[country] = price;
      }
    });
  });
  
  // Преобразуем в нужный формат
  Object.entries(countries).forEach(([country, minPrice]) => {
    result.push({
      country,
      minPrice
    });
  });
  
  return result;
}

/**
 * GET /api/tour-prices
 * Возвращает минимальные цены туров по странам
 */
router.get('/tour-prices', (req, res) => {
  try {
    const filePath = path.join(__dirname, '../data/tourism_data.json');
    
    // Проверяем существование файла
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'Tourism data file not found'
      });
    }
    
    const currentModified = fs.statSync(filePath).mtime.getTime();
    
    // Если файл изменился или кеша нет - перечитываем
    if (!cachedData || currentModified !== lastFileModified) {
      console.log('Reloading tourism data from file...');
      
      const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      cachedData = {
        success: true,
        data: processTopurData(rawData)
      };
      lastFileModified = currentModified;
    }
    
    res.json(cachedData);
    
  } catch (error) {
    console.error('Error processing tour prices:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;