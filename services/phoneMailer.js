const createTransporter = require('./transporter');

/**
 * Отправляет email с информацией о запросе на обратный звонок
 * @param {Object} data - Данные для отправки
 * @param {string} data.phone - Номер телефона клиента
 * @returns {Promise<void>}
 */
const phoneMailer = async ({ phone }) => {
  console.log('Получен запрос на обратный звонок:', phone);

  const style = "color: gray; margin-right: 20px; font-size: 12px;";
  const message = {
    from: 'Заявка на обратный звонок <tmtl.kz@bk.ru>',
    to: 'info@tmtl.kz',
    subject: 'Заявка на обратный звонок',
    html: `<h2>Данные клиента:</h2>
      <p><span style="${style}">Телефон:</span> <strong>${phone}</strong></p>
    `
  };

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail(message);
    console.log('Письмо успешно отправлено:', info.messageId);
    return info;
  } catch (error) {
    console.error('Ошибка при отправке письма:', error);
    throw error; // Перебрасываем ошибку для обработки на уровне маршрута
  }
};

module.exports = phoneMailer;