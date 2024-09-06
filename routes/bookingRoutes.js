const express = require('express');
const bookingMailer = require("../services/bookingMailer");

const router = express.Router();

/**
 * POST /api/booking
 * Обрабатывает запрос на бронирование тура
 * @body {Object} данные для бронирования
 * @returns {Object} сообщение о статусе бронирования
 */
router.post('/', async (req, res) => {
  try {
    await bookingMailer(req.body);
    res.status(200).json({ message: 'Ваша заявка принята, мы свяжемся с вами в течение часа' });
  } catch (error) {
    console.error('Ошибка при бронировании:', error);
    res.status(400).json({ message: 'Ошибка отправки. Вы можете связаться с нами по телефону: +7 (707) 886-36-33' });
  }
});

module.exports = router;