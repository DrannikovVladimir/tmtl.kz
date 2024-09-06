const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const bookingMailer = require("./booking.js");
const subMailer = require("./sub.js");
const phoneMailer = require("./phone.js");
const sendFileMailer = require('./sendFileMailer.js'); 
const robots = require('express-robots-txt');

const PORT = process.env.PORT ?? 3000;
const app = express();

app.use(express.static(path.resolve(__dirname, 'static')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(robots({
  UserAgent: '*',
  Sitemap: 'https://tmtl.kz/css/sitemap.xml',
  Host: 'https://tmtl.kz'
}));

// Роут для бронирования тура
app.post('/api/booking', async (req, res) => {
  try {
    await bookingMailer(req.body);
    res.status(200).json({ message: 'Ваша заявка принята, мы свяжемся с вами в течение часа' });
  } catch (error) {
    res.status(400).json({ message: 'Ошибка отправки. Вы можете связаться с нами по телефону: +7 (707) 886-36-33' });
  }
});

// Роут для подписки на рассылку
app.post('/api/sub', async (req, res) => {
  try {
    await subMailer(req.body);
    res.status(200).json({ message: 'Спасибо, что подписались на нашу рассылку. Бонусный файл отправлен вам на почту.' });
  } catch (error) {
    res.status(400).json({ message: 'Ошибка отправки. Мы уже устраняем эту проблему.' });
  }
});

// Новый роут для отправки файла
app.post('/api/sendFile', async (req, res) => {
  const { email, filePath } = req.body;  // Получаем email и путь к файлу из тела запроса

  try {
    await sendFileMailer({ email, filePath });
    res.status(200).json({ message: `Файл успешно отправлен на ${email}` });
  } catch (error) {
    console.error('Ошибка при отправке файла:', error.message);
    res.status(400).json({ message: 'Ошибка при отправке файла. Пожалуйста, попробуйте снова позже.' });
  }
});

app.post('/api/phone', (req, res) => {
  phoneMailer(req.body)
    .then(() => res.status(200).json({ message: 'Спасибо что подписались на нашу рассылку.' }))
    .catch(() => res.status(400).json({ message: 'Ошибка отправки. Мы уже устраняем эту проблему.'}));  
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});