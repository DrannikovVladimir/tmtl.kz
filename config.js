require('dotenv').config();

module.exports = {
  API_HOST: process.env.API_HOST,
  API_PASS: process.env.API_PASS,
  API_EMAIL: process.env.API_EMAIL,
  PORT: process.env.PORT || 3000,
  OPENWEATHERMAP_API_KEY: process.env.OPENWEATHERMAP_API_KEY,
  SUBSCRIBE_EMAIL: process.env.SUBSCRIBE_EMAIL,
  SUBSCRIBE_PASS: process.env.SUBSCRIBE_PASS,
  SUBSCRIBE_HOST: process.env.SUBSCRIBE_HOST,
  BOT_TOKEN: process.env.BOT_TOKEN,
  CHANNEL_ID: process.env.CHANNEL_ID,
  TELEGRAM_SESSION: process.env.TELEGRAM_SESSION,
  TELEGRAM_API_ID: process.env.TELEGRAM_API_ID,
  TELEGRAM_API_HASH: process.env.TELEGRAM_API_HASH,
  TELEGRAM_PHONE: process.env.TELEGRAM_PHONE
};