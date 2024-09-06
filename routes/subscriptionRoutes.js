const express = require('express');
const subMailer = require("../services/subMailer");

const router = express.Router();

/**
 * POST /api/sub
 * Обрабатывает запрос на подписку на рассылку
 * @body {Object} данные для подписки
 * @returns {Object} сообщение о статусе подписки
 */
router.post('/', async (req, res) => {
  try {
    await subMailer(req.body);
    res.status(200).json({ message: 'Спасибо, что подписались на нашу рассылку. Бонусный файл отправлен вам на почту.' });
  } catch (error) {
    console.error('Ошибка при подписке:', error);
    res.status(400).json({ message: 'Ошибка отправки. Мы уже устраняем эту проблему.' });
  }
});

module.exports = router;