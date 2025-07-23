const cron = require('node-cron');
const { startParsing } = require('./tourismParser');

class ParserScheduler {
  constructor() {
    this.isRunning = false;
  }

  async runScheduledParsing() {
    if (this.isRunning) {
      console.log('⏸️ Парсер уже запущен, пропускаем...');
      return;
    }

    this.isRunning = true;
    const startTime = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' });
    
    try {
      console.log(`🚀 Запуск автоматического парсинга: ${startTime}`);
      await startParsing();
      console.log('✅ Автоматический парсинг завершен успешно');
    } catch (error) {
      console.error('❌ Ошибка автоматического парсинга:', error);
    } finally {
      this.isRunning = false;
    }
  }

  start() {
    console.log('⏰ Запуск планировщика парсера...');
    console.log('📅 Расписание: каждый день в 7:00 и 18:00 (время Алматы)');

    // Каждый день в 7:00 и 18:00 (время сервера) 0 7,18 * * *
    cron.schedule('30 18 * * *', () => {
      this.runScheduledParsing();
    }, {
      scheduled: true,
      timezone: "Asia/Almaty"
    });

    // Логирование следующего запуска
    console.log('✅ Планировщик активен');
    this.logNextRun();
  }

  logNextRun() {
    const now = new Date();
    const today7 = new Date();
    today7.setHours(7, 0, 0, 0);
    
    const today18 = new Date();
    today18.setHours(18, 0, 0, 0);
    
    const tomorrow7 = new Date(today7);
    tomorrow7.setDate(tomorrow7.getDate() + 1);

    let nextRun;
    
    if (now < today7) {
      nextRun = today7;
    } else if (now < today18) {
      nextRun = today18;
    } else {
      nextRun = tomorrow7;
    }

    console.log(`⏭️ Следующий запуск: ${nextRun.toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' })}`);
  }

  // Для тестирования - запуск каждую минуту
  startTestMode() {
    console.log('🧪 ТЕСТОВЫЙ РЕЖИМ: запуск каждую минуту');
    
    cron.schedule('* * * * *', () => {
      this.runScheduledParsing();
    }, {
      scheduled: true,
      timezone: "Asia/Almaty"
    });
  }

  // Ручной запуск
  async runNow() {
    console.log('🎯 Ручной запуск парсера...');
    await this.runScheduledParsing();
  }
}

module.exports = new ParserScheduler();