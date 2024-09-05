const nodemailer = require('nodemailer');
const dotEnv = require('dotenv');

// Подгружаем переменные окружения
dotEnv.config({ path: '.env' });

const createTransporter = () => {
  if (!process.env.API_EMAIL || !process.env.API_PASS || !process.env.API_HOST) {
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