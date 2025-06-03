const express = require('express');
const SimpleTelegramParser = require('../parser/simple-parser');
const { TELEGRAM_API_ID, TELEGRAM_API_HASH, TELEGRAM_PHONE, TELEGRAM_SESSION } = require('../config');

const router = express.Router();

// Глобальный экземпляр парсера
let parser = null;

/**
 * Инициализация парсера
 */
async function initializeParser() {
  if (!parser) {
    parser = new SimpleTelegramParser({
    apiId: parseInt(TELEGRAM_API_ID),
    apiHash: TELEGRAM_API_HASH,
    phoneNumber: TELEGRAM_PHONE,
    sessionString: TELEGRAM_SESSION,  // Добавьте эту строку
    maxParticipants: 5000,
    batchSize: 100,
    delay: 3000,
    filterInactiveUsers: true
  });

    await parser.initialize();
  }
  return parser;
}

/**
 * POST /api/parser/start
 * Запуск парсинга канала
 */
router.post('/start', async (req, res) => {
  try {
    const { channelUrl, options = {} } = req.body;

    if (!channelUrl) {
      return res.status(400).json({
        success: false,
        error: 'Не указан URL канала'
      });
    }

    // Инициализируем парсер
    const parserInstance = await initializeParser();

    // Проверяем, не запущен ли уже парсинг
    if (parserInstance.isRunning) {
      return res.status(409).json({
        success: false,
        error: 'Парсинг уже запущен',
        currentChannel: parserInstance.currentChannel
      });
    }

    // Запускаем парсинг асинхронно
    parserInstance.parseChannel(channelUrl, options)
      .then(results => {
        console.log('✅ Парсинг завершён:', results);
      })
      .catch(error => {
        console.error('❌ Ошибка парсинга:', error.message);
      });

    res.json({
      success: true,
      message: 'Парсинг запущен',
      channelUrl,
      options
    });

  } catch (error) {
    console.error('Ошибка запуска парсинга:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/parser/status
 * Получение статуса парсинга
 */
router.get('/status', async (req, res) => {
  try {
    if (!parser) {
      return res.json({
        success: true,
        isRunning: false,
        message: 'Парсер не инициализирован'
      });
    }

    const status = parser.getStatus();
    
    res.json({
      success: true,
      ...status
    });

  } catch (error) {
    console.error('Ошибка получения статуса:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/parser/stop
 * Остановка парсинга
 */
router.post('/stop', async (req, res) => {
  try {
    if (!parser) {
      return res.status(400).json({
        success: false,
        error: 'Парсер не инициализирован'
      });
    }

    const stopped = await parser.stopParsing();
    
    res.json({
      success: true,
      stopped,
      message: stopped ? 'Парсинг остановлен' : 'Парсинг не был запущен'
    });

  } catch (error) {
    console.error('Ошибка остановки парсинга:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/parser/results
 * Получение результатов парсинга
 */
router.get('/results', async (req, res) => {
  try {
    const { format = 'json' } = req.query;

    if (!parser) {
      return res.status(400).json({
        success: false,
        error: 'Парсер не инициализирован'
      });
    }

    const results = await parser.exportResults(format);
    
    if (!results) {
      return res.status(404).json({
        success: false,
        error: 'Результаты не найдены'
      });
    }

    // Устанавливаем правильные заголовки для разных форматов
    switch (format.toLowerCase()) {
      case 'csv':
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="subscribers.csv"');
        return res.send(results);
        
      case 'txt':
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', 'attachment; filename="subscribers.txt"');
        return res.send(results);
        
      default:
        return res.json({
          success: true,
          data: results
        });
    }

  } catch (error) {
    console.error('Ошибка получения результатов:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/parser/subscribers
 * Получение списка подписчиков (только JSON)
 */
router.get('/subscribers', async (req, res) => {
  try {
    const { 
      limit = 100, 
      offset = 0, 
      search = '', 
      activeOnly = false 
    } = req.query;

    if (!parser) {
      return res.status(400).json({
        success: false,
        error: 'Парсер не инициализирован'
      });
    }

    const results = await parser.loadResults();
    
    if (!results || !results.participants) {
      return res.status(404).json({
        success: false,
        error: 'Подписчики не найдены'
      });
    }

    let participants = results.participants;

    // Фильтрация по поиску
    if (search) {
      const searchLower = search.toLowerCase();
      participants = participants.filter(p => 
        (p.username && p.username.toLowerCase().includes(searchLower)) ||
        (p.firstName && p.firstName.toLowerCase().includes(searchLower)) ||
        (p.lastName && p.lastName.toLowerCase().includes(searchLower))
      );
    }

    // Фильтрация только активных
    if (activeOnly === 'true') {
      participants = participants.filter(p => 
        p.lastSeenStatus === 'online' || 
        p.lastSeenStatus === 'recently'
      );
    }

    // Пагинация
    const total = participants.length;
    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    const paginatedParticipants = participants.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        participants: paginatedParticipants,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: endIndex < total
        },
        parseInfo: results.parseInfo
      }
    });

  } catch (error) {
    console.error('Ошибка получения подписчиков:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/parser/logs
 * Получение логов парсинга
 */
router.get('/logs', async (req, res) => {
  try {
    const { 
      level = null, 
      sessionId = null, 
      lastMinutes = 60, 
      limit = 100 
    } = req.query;

    if (!parser) {
      return res.status(400).json({
        success: false,
        error: 'Парсер не инициализирован'
      });
    }

    const logs = parser.logger.getLogs({
      level,
      sessionId,
      lastMinutes: parseInt(lastMinutes),
      limit: parseInt(limit)
    });

    const stats = parser.logger.getStats();

    res.json({
      success: true,
      data: {
        logs,
        stats
      }
    });

  } catch (error) {
    console.error('Ошибка получения логов:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/parser/clear
 * Очистка всех данных парсера
 */
router.delete('/clear', async (req, res) => {
  try {
    if (!parser) {
      return res.status(400).json({
        success: false,
        error: 'Парсер не инициализирован'
      });
    }

    const cleared = await parser.clearData();
    
    res.json({
      success: true,
      cleared,
      message: cleared ? 'Все данные очищены' : 'Ошибка очистки данных'
    });

  } catch (error) {
    console.error('Ошибка очистки данных:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/parser/stats
 * Общая статистика парсера
 */
router.get('/stats', async (req, res) => {
  try {
    if (!parser) {
      return res.json({
        success: true,
        stats: {
          parserInitialized: false,
          message: 'Парсер не инициализирован'
        }
      });
    }

    const results = await parser.loadResults();
    const logStats = parser.logger.getStats();
    const proxyStats = parser.proxyManager.getStats();
    const connectionStats = parser.telegramClient ? 
      parser.telegramClient.getConnectionStats() : null;

    res.json({
      success: true,
      stats: {
        parserInitialized: true,
        lastParse: results ? results.parseInfo : null,
        logs: logStats,
        proxies: proxyStats,
        connection: connectionStats,
        isRunning: parser.isRunning
      }
    });

  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;