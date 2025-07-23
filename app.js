const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const robots = require('express-robots-txt');
const cors = require('cors');
const routes = require('./routes');
const { PORT } = require('./config');
const scheduler = require('./services/scheduler');
// const { bot } = require('./bot');
// const { leadMagnetBot } = require('./bot/leadMagnetBot');

/**
 * Создает и настраивает экземпляр Express-приложения
 * @returns {express.Application} Настроенное Express-приложение
 */
function createApp() {
  const app = express();

  // Настройка middleware
  app.use(express.static(path.resolve(__dirname, 'static')));
  app.use('/libs', express.static(path.resolve(__dirname, 'libs'), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.js')) {
        res.set('Content-Type', 'application/javascript');
      }
    }
  }));
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors());

  // Настройка robots.txt
  app.use(robots({
    UserAgent: '*',
    Sitemap: 'https://tmtl.kz/sitemap.xml',
    Host: 'tmtl.kz',
    CrawlDelay: '5',
    CleanParam: 'utm_source&utm_medium&utm_campaign&sessionid',
  }));

  // Подключение маршрутов
  app.use('/api', routes);

  return app;
}

// Создание и запуск сервера
const app = createApp();

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);

  scheduler.start();
});