const createTransporter = require('./transporter');
const sendFileMailer = require('./sendFileMailer');
const path = require('path');

const subMailer = async ({ email }) => {
  const transporter = createTransporter();
  
  const message = {
    from: 'Заявка на рассылку <tmtl.kz@bk.ru>',
    to: 'info@tmtl.kz',
    subject: 'Заявка на рассылку',
    html: `<h2>Новая заявка на рассылку:</h2>
      <p><strong>Email клиента:</strong> ${email}</p>
    `
  };

  try {
    await transporter.sendMail(message);
    console.log('Заявка на рассылку успешно отправлена:', email);

    // Отправляем бонусный файл пользователю
    const filePath = path.resolve(__dirname, 'Putevoditel.pdf');
    await sendFileMailer({ email, filePath });
  } catch (error) {
    console.error('Ошибка при отправке заявки или файла:', error.message);
    throw error;
  } finally {
    transporter.close();
  }
};

module.exports = subMailer;