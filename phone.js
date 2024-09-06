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

const phoneMiler = async ({ phone }) => {
  console.log(phone);
  const style = "color: gray; margin-right: 20px; font-size: 12px;";
  const message = {
    from: 'Заявка на обратный звонок <tmtl.kz@bk.ru>',
    to: 'info@tmtl.kz',
    subject: 'Заявка на обратный звонок',
    html: `<h2>Данные клиента:</h2>
      <p><span style=${style}>Телефон:</span> <strong>${phone}</strong></p>
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

module.exports = phoneMiler;