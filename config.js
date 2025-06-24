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
  LEAD_MAGNET_BOT_TOKEN: process.env.LEAD_MAGNET_BOT_TOKEN,
  LEAD_MAGNET_CHANNEL_ID: process.env.LEAD_MAGNET_CHANNEL_ID
};