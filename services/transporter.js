const nodemailer = require('nodemailer');
const { API_EMAIL, API_PASS, API_HOST, SUBSCRIBE_EMAIL, SUBSCRIBE_PASS, SUBSCRIBE_HOST } = require('../config');

const createTransporter = (useSubscribeEmail = false) => {
  if (!API_EMAIL || !API_PASS || !API_HOST || !SUBSCRIBE_EMAIL || !SUBSCRIBE_PASS || !SUBSCRIBE_HOST) {
    throw new Error('Отсутствуют необходимые переменные окружения');
  }

  return nodemailer.createTransport({
    host: useSubscribeEmail ? SUBSCRIBE_HOST : API_HOST,
    port: 465,
    secure: true,
    auth: {
      user: useSubscribeEmail ? SUBSCRIBE_EMAIL : API_EMAIL,
      pass: useSubscribeEmail ? SUBSCRIBE_PASS : API_PASS,
    },
  });
};

module.exports = createTransporter;