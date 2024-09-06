const nodemailer = require('nodemailer');
const dotEnv = require('dotenv');
const { API_EMAIL, API_PASS, API_HOST  } = require('../config');

const createTransporter = () => {
  if (!API_EMAIL || !API_PASS || !API_HOST) {
    throw new Error('Отсутствуют необходимые переменные окружения');
  }

  return nodemailer.createTransport({
    host: process.env.API_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.API_EMAIL,
      pass: process.env.API_PASS,
    },
  });
};

module.exports = createTransporter;