const express = require('express');
const sendFileMailer = require('../services/sendFileMailer');

const router = express.Router();

/**
 * POST /api/sendFile
 * Обрабатывает запрос на отправку файла по электронной почте
 * @body {Object} email - адрес электронной почты получателя
 * @body {Object} filePath - путь к файлу для отправки
 * @returns {Object} сообщение о статусе отправки файла
 */
router.post('/', async (req, res) => {
  const { email, filePath } = req.body;

  try {
    await sendFileMailer({ email, filePath });
    res.status(200).json({ message: `Файл успешно отправлен на ${email}` });
  } catch (error) {
    console.error('Ошибка при отправке файла:', error);
    res.status(400).json({ message: 'Ошибка при отправке файла. Пожалуйста, попробуйте снова позже.' });
  }
});

module.exports = router;