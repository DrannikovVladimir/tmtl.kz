const createTransporter = require('./transporter');

const bookingMailer = async ({ name, phone, comment }) => {
  const transporter = createTransporter();

  const message = {
    from: 'Заявка на бронирование тура <tmtl.kz@bk.ru>',
    to: 'info@tmtl.kz',
    subject: 'Заявка на бронирование тура',
    html: `<h2>Данные клиента:</h2>
      <p><strong>Имя:</strong> ${name}</p>
      <p><strong>Телефон:</strong> ${phone}</p>
      <p><strong>Комментарий:</strong> ${comment}</p>
    `
  };

  try {
    await transporter.sendMail(message);
    console.log('Заявка на бронирование успешно отправлена:', name);
  } catch (error) {
    console.error('Ошибка при отправке заявки:', error.message);
    throw error;
  } finally {
    transporter.close();
  }
};

module.exports = bookingMailer;