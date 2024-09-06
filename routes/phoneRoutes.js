const express = require('express');
const phoneMailer = require("../services/phoneMailer");

const router = express.Router();

/**
 * POST /api/phone
 * Обрабатывает запрос на обратный звонок
 * @body {Object} данные для обратного звонка
 * @returns {Object} сообщение о статусе запроса
 */
router.post('/', async (req, res) => {
  try {
    await phoneMailer(req.body);
    res.status(200).json({ message: 'Спасибо, что оставили заявку на обратный звонок. Мы свяжемся с вами в ближайшее время.' });
  } catch (error) {
    console.error('Ошибка при обработке запроса на обратный звонок:', error);
    res.status(400).json({ message: 'Ошибка отправки. Мы уже устраняем эту проблему.' });
  }
});

module.exports = router;