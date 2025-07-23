const nodemailer = require('nodemailer');
const { NOTIFICATIONS_EMAIL, NOTIFICATIONS_PASS, NOTIFICATIONS_HOST, ADMIN_EMAIL } = require('../config');

class EmailNotifications {
  constructor() {
    this.transporter = nodemailer.createTransport({ // ИСПРАВЛЕНО: было createTransporter
      host: NOTIFICATIONS_HOST,
      port: 465,
      secure: true, // SSL
      auth: {
        user: NOTIFICATIONS_EMAIL,
        pass: NOTIFICATIONS_PASS
      }
    });
  }

  // Остальные методы остаются без изменений...
  async sendParsingSuccess(data) {
    const totalTours = Object.values(data).reduce((sum, tours) => sum + tours.length, 0);
    const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' });
    
    // Топ 5 самых дешевых туров
    const allTours = [];
    Object.entries(data).forEach(([city, tours]) => {
      tours.forEach(tour => {
        allTours.push({ ...tour, city });
      });
    });
    
    const topTours = allTours
      .sort((a, b) => a.priceNumeric - b.priceNumeric)
      .slice(0, 5);

    const subject = `✅ Туры обновлены - ${totalTours} туров (${timestamp})`;
    
    const html = `
      <h2>🎉 Парсинг завершен успешно!</h2>
      <p><strong>Время обновления:</strong> ${timestamp}</p>
      
      <h3>📊 Результаты по городам:</h3>
      <ul>
        ${Object.entries(data).map(([city, tours]) => 
          `<li><strong>${city}:</strong> ${tours.length} туров</li>`
        ).join('')}
      </ul>
      
      <h3>🏆 Топ-5 самых дешевых туров:</h3>
      <ol>
        ${topTours.map(tour => 
          `<li><strong>${tour.country}</strong> из ${tour.city}: от ${tour.price} ${tour.currency}</li>`
        ).join('')}
      </ol>
      
      <hr>
      <p><small>Автоматическое уведомление от парсера туров</small></p>
    `;

    return await this.sendEmail(subject, html);
  }

  async sendParsingError(error) {
    const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' });
    
    const subject = `❌ Ошибка парсинга туров (${timestamp})`;
    
    const html = `
      <h2>🚨 Ошибка при парсинге туров!</h2>
      <p><strong>Время ошибки:</strong> ${timestamp}</p>
      
      <h3>📋 Детали ошибки:</h3>
      <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px;">
${error.message}

Stack trace:
${error.stack}
      </pre>
      
      <p><strong>Рекомендация:</strong> Проверьте доступность сайта и запустите парсер вручную.</p>
      
      <hr>
      <p><small>Автоматическое уведомление от парсера туров</small></p>
    `;

    return await this.sendEmail(subject, html);
  }

  async sendLowDataWarning(data) {
    const totalTours = Object.values(data).reduce((sum, tours) => sum + tours.length, 0);
    const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' });
    
    const subject = `⚠️ Подозрительно мало туров найдено - ${totalTours} (${timestamp})`;
    
    const html = `
      <h2>⚠️ Возможная проблема с парсингом</h2>
      <p><strong>Время:</strong> ${timestamp}</p>
      <p><strong>Найдено туров:</strong> ${totalTours} (обычно 25-35)</p>
      
      <h3>📊 Детали по городам:</h3>
      <ul>
        ${Object.entries(data).map(([city, tours]) => 
          `<li><strong>${city}:</strong> ${tours.length} туров</li>`
        ).join('')}
      </ul>
      
      <p><strong>Рекомендация:</strong> Проверьте сайт вручную и перезапустите парсер.</p>
      
      <hr>
      <p><small>Автоматическое уведомление от парсера туров</small></p>
    `;

    return await this.sendEmail(subject, html);
  }

  async sendEmail(subject, html) {
    try {
      const info = await this.transporter.sendMail({
        from: `"Parser Notifications" <${NOTIFICATIONS_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject: subject,
        html: html
      });

      console.log('📧 Email отправлен:', info.messageId);
      return info;
    } catch (error) {
      console.error('❌ Ошибка отправки email:', error);
      throw error;
    }
  }
}

module.exports = new EmailNotifications();