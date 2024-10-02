const createTransporter = require('./transporter');
const path = require('path');
const emailTemplate = require('./emailTemplate');
const fs = require('fs').promises;

const subMailer = async ({ email }) => {
  const subscriberTransporter = createTransporter(true);  // Используем subscribe@tmtl.kz
  const adminTransporter = createTransporter(false);  // Используем обычный email для админа
  
  const filePath = path.resolve(__dirname, 'Putevoditel.pdf');
  
  try {
    const fileContent = await fs.readFile(filePath);

    const message = {
      from: 'Турагентство "Time to Travel" Караганда | <subscription@tmtl.kz>',
      to: email,
      subject: 'Добро пожаловать в мир путешествий с Time to Travel!',
      html: emailTemplate(email),
      attachments: [
        {
          filename: 'Путеводитель.pdf',
          content: fileContent
        }
      ]
    };

    // Отправляем приветственное письмо пользователю с прикрепленным файлом
    await subscriberTransporter.sendMail(message);
    console.log('Приветственное письмо с путеводителем успешно отправлено:', email);

    // Отправляем уведомление администратору
    const adminMessage = {
      from: 'Система рассылки <tmtl.kz@bk.ru>',
      to: 'info@tmtl.kz',
      subject: 'Новая подписка на рассылку',
      html: `<h2>Новая заявка на рассылку:</h2>
        <p><strong>Email клиента:</strong> ${email}</p>
      `
    };
    await adminTransporter.sendMail(adminMessage);
    console.log('Уведомление администратору отправлено');

  } catch (error) {
    console.error('Ошибка при отправке письма или чтении файла:', error.message);
    throw error;
  } finally {
    subscriberTransporter.close();
    adminTransporter.close();
  }
};

module.exports = subMailer;