const createTransporter = require('./transporter');
const path = require('path');

const sendFileMailer = async ({ email, filePath }) => {
  const transporter = createTransporter();
  
  const message = {
    from: 'Бонус <tmtl.kz@bk.ru>',
    to: email,
    subject: 'Ваш бонусный файл',
    text: 'Спасибо за подписку! Вот ваш бонусный файл.',
    attachments: [
      {
        filename: path.basename(filePath),
        path: filePath,
      }
    ]
  };

  try {
    await transporter.sendMail(message);
    console.log('Файл успешно отправлен:', email);
  } catch (error) {
    console.error('Ошибка при отправке файла:', error.message);
    throw error;
  } finally {
    transporter.close();
  }
};

module.exports = sendFileMailer;