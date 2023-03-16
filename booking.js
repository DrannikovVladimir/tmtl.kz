const nodemailer = require('nodemailer');
const dotEnv = require('dotenv');
dotEnv.config({ path: '.env'});

const getTransporter = async () => {
  const transporter = await nodemailer.createTransport({
    host: process.env.API_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.API_EMAIL,
      pass: process.env.API_PASS,
    }
  });

  return transporter;
};

const bookingMailer = async ({ name, phone, comment }) => {
  const style = "color: gray; margin-right: 20px; font-size: 12px;";
  const message = {
    from: 'Заявка на бронирование тура <tmtl.kz@bk.ru>',
    to: 'info@tmtl.kz',
    subject: 'Заявка на бронирование тура',
    html: `<h2>Данные клиента:</h2>
      <p><span style=${style}>Адрес:</span> <strong>${name}</strong></p>
      <p><span style=${style}>Контактный телефон:</span> <strong>${phone}</strong></p>
      <p><span style=${style}>Комментарий:</span> <strong>${comment}</strong></p>
    `
  }

  const transporter = await getTransporter();
  
  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.log('Error', error.message);
      return process.exit(1);
    }
    console.log('INfo', info);
    transporter.close();
  });
};

module.exports = bookingMailer;