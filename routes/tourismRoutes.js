const express = require('express');
const { getWeather, getCountryInfo } = require('../services/tourismService');

const router = express.Router();

/**
 * GET /api/tourism/weather
 * Получает информацию о погоде для указанного города
 * @query {string} city - Название города
 * @returns {Object} Данные о погоде для указанного города
 */
router.get('/weather', async (req, res) => {
  const { city } = req.query;
  
  if (!city) {
    return res.status(400).json({ error: 'Необходимо указать параметр city' });
  }
  
  try {
    const weatherData = await getWeather(city);
    res.json(weatherData);
  } catch (error) {
    console.error('Ошибка при получении данных о погоде:', error);
    res.status(500).json({ error: 'Не удалось получить данные о погоде' });
  }
});

/**
 * GET /api/tourism/country
 * Получает информацию о стране по указанному коду страны
 * @query {string} code - Код страны (например, 'US', 'FR')
 * @returns {Object} Данные о стране для указанного кода
 */
router.get('/country', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: 'Необходимо указать параметр code' });
  }
  
  try {
    const countryData = await getCountryInfo(code);
    res.json(countryData);
  } catch (error) {
    console.error('Ошибка при получении данных о стране:', error);
    res.status(500).json({ error: 'Не удалось получить данные о стране' });
  }
});

module.exports = router;