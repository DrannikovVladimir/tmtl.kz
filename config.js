require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  OPENWEATHERMAP_API_KEY: process.env.OPENWEATHERMAP_API_KEY
};