const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const bookingMailer = require("./booking.js");
const subMailer = require("./sub.js");

const PORT = process.env.PORT ?? 3000;
const app = express();

app.use(express.static(path.resolve(__dirname, 'static')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/booking', (req, res) => {
  bookingMailer(req.body)
    .then(() => res.status(200).json({ message: 'Ваша заявка принята, мы свяжемся с вами в течении часа' }))
    .catch(() => res.status(400).json({ message: 'Ошибка отправки. Вы можете связаться с нами по телефону: +7 (707) 886-36-33'}));  
});

app.post('/api/sub', (req, res) => {
  subMailer(req.body)
    .then(() => res.status(200).json({ message: 'Спасибо что подписались на нашу рассылку.' }))
    .catch(() => res.status(400).json({ message: 'Ошибка отправки. Мы уже устраняем эту проблему.'}));  
});

app.listen(PORT, () => {
  console.log('Server is ok!');
});