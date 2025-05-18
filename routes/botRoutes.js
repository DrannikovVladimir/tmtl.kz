const express = require('express');
const path = require('path');
const { bot } = require('../bot');
const publisher = require('../bot/publisher');

const router = express.Router();

// Путь к JSON-файлу с турами
const toursFilePath = path.join(__dirname, '..', 'data', 'tours.json');

// Запуск публикации туров
router.post('/publish', (req, res) => {
  try {
    const { channelId, tourIds, intervalMinutes = 60, publishId = 'default' } = req.body;
    
    // Используем ID канала из запроса или из переменных окружения
    const targetChannelId = channelId || process.env.CHANNEL_ID;
    
    if (!targetChannelId) {
      return res.status(400).json({
        success: false,
        message: 'ID канала не указан'
      });
    }
    
    const success = publisher.startPublishing(
      bot,
      targetChannelId,
      toursFilePath,
      tourIds,
      intervalMinutes,
      publishId
    );
    
    if (success) {
      res.json({
        success: true,
        message: `Публикация туров запущена с интервалом ${intervalMinutes} минут`
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Не удалось запустить публикацию'
      });
    }
  } catch (error) {
    console.error('Ошибка при запуске публикации:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    });
  }
});

// Остановка публикации туров
router.post('/stop', (req, res) => {
  try {
    const { publishId = 'default' } = req.body;
    
    const success = publisher.stopPublishing(publishId);
    
    if (success) {
      res.json({
        success: true,
        message: 'Публикация туров остановлена'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Публикация с указанным ID не найдена'
      });
    }
  } catch (error) {
    console.error('Ошибка при остановке публикации:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    });
  }
});

// Получение статуса публикаций
router.get('/status', (req, res) => {
  try {
    const activePublishings = publisher.getActivePublishings();
    
    res.json({
      success: true,
      data: activePublishings
    });
  } catch (error) {
    console.error('Ошибка при получении статуса публикаций:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    });
  }
});

// Публикация одного конкретного тура
router.post('/publish-one', (req, res) => {
  try {
    const { channelId, tourIndex } = req.body;
    
    // Используем ID канала из запроса или из переменных окружения
    const targetChannelId = channelId || process.env.CHANNEL_ID;
    
    if (!targetChannelId) {
      return res.status(400).json({
        success: false,
        message: 'ID канала не указан'
      });
    }
    
    if (tourIndex === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Индекс тура не указан'
      });
    }
    
    // Читаем туры из файла
    const tours = publisher.readToursFromFile(toursFilePath);
    
    if (tours.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Нет доступных туров'
      });
    }
    
    if (tourIndex < 0 || tourIndex >= tours.length) {
      return res.status(400).json({
        success: false,
        message: `Индекс тура должен быть от 0 до ${tours.length - 1}`
      });
    }
    
    // Публикуем выбранный тур
    publisher.publishTourPost(bot, targetChannelId, tours[tourIndex])
      .then(success => {
        if (success) {
          res.json({
            success: true,
            message: `Тур "${tours[tourIndex].name}" опубликован`
          });
        } else {
          res.status(500).json({
            success: false,
            message: 'Не удалось опубликовать тур'
          });
        }
      })
      .catch(error => {
        console.error('Ошибка при публикации тура:', error);
        res.status(500).json({
          success: false,
          message: 'Внутренняя ошибка сервера'
        });
      });
  } catch (error) {
    console.error('Ошибка при публикации тура:', error);
    res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    });
  }
});

module.exports = router;