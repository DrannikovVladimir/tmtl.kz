const axios = require('axios');
const { OPENWEATHERMAP_API_KEY } = require('../config');

/**
 * Получает данные о погоде для указанного города
 * @param {string} city - Название города
 * @returns {Promise<Object>} Данные о погоде для указанного города
 */
async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather`;
  const params = {
    q: city,
    appid: OPENWEATHERMAP_API_KEY,
    units: 'metric'
  };
  
  const response = await axios.get(url, { params });
  return response.data;
}

/**
 * Получает информацию о стране по указанному коду страны
 * @param {string} countryCode - Код страны (например, 'US', 'FR')
 * @returns {Promise<Object>} Данные о стране для указанного кода
 */
async function getCountryInfo(countryCode) {
  const url = `https://restcountries.com/v3.1/alpha/${countryCode}`;
  
  const response = await axios.get(url);
  return response.data[0];
}

module.exports = {
  getWeather,
  getCountryInfo
};