const https = require('https');
const http = require('http');
const fs = require('fs').promises;
const path = require('path');

class ProxyManager {
  constructor() {
    this.proxies = [];
    this.currentIndex = 0;
    this.blacklist = new Set();
    this.dataPath = path.join(__dirname, '..', 'data', 'proxies.json');
    this.testUrl = 'http://httpbin.org/ip'; // Простой сервис для проверки IP
  }

  /**
   * Загружает прокси из API и файла
   */
  async loadProxies() {
    try {
      // Пытаемся загрузить из файла
      await this.loadFromFile();
      
      // Если прокси мало или файла нет, загружаем новые
      if (this.proxies.length < 10) {
        await this.fetchNewProxies();
        await this.saveToFile();
      }
      
      // Проверяем работоспособность
      await this.testAllProxies();
      
      console.log(`✅ Загружено ${this.proxies.length} рабочих прокси`);
      return this.proxies.length > 0;
    } catch (error) {
      console.error('❌ Ошибка загрузки прокси:', error.message);
      return false;
    }
  }

  /**
   * Загружает прокси из файла
   */
  async loadFromFile() {
    try {
      const data = await fs.readFile(this.dataPath, 'utf8');
      const savedData = JSON.parse(data);
      
      // Проверяем, не устарели ли данные (обновляем каждые 6 часов)
      const sixHoursAgo = Date.now() - (6 * 60 * 60 * 1000);
      if (savedData.timestamp && savedData.timestamp > sixHoursAgo) {
        this.proxies = savedData.proxies || [];
        console.log(`📂 Загружено ${this.proxies.length} прокси из файла`);
      }
    } catch (error) {
      console.log('📂 Файл с прокси не найден, будем загружать новые');
    }
  }

  /**
   * Получает новые прокси из API
   */
  async fetchNewProxies() {
    console.log('🔄 Загружаем новые прокси...');
    
    const sources = [
      'https://api.proxyscrape.com/v2/?request=get&protocol=http&timeout=5000&country=all&ssl=all&anonymity=all',
      'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
      'https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt'
    ];

    for (const source of sources) {
      try {
        const proxyList = await this.fetchFromUrl(source);
        if (proxyList.length > 0) {
          this.proxies = [...this.proxies, ...proxyList];
          console.log(`✅ Получено ${proxyList.length} прокси из ${source}`);
          break; // Используем первый рабочий источник
        }
      } catch (error) {
        console.log(`⚠️ Не удалось загрузить из ${source}`);
      }
    }

    // Удаляем дубликаты
    this.proxies = [...new Set(this.proxies)];
  }

  /**
   * Загружает данные по URL
   */
  fetchFromUrl(url) {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;
      
      const req = client.get(url, { timeout: 10000 }, (res) => {
        let data = '';
        
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const proxies = data
              .split('\n')
              .map(line => line.trim())
              .filter(line => line && line.includes(':'))
              .map(line => {
                const [host, port] = line.split(':');
                return { host: host.trim(), port: parseInt(port.trim()) };
              })
              .filter(proxy => proxy.host && proxy.port > 0 && proxy.port < 65536);
            
            resolve(proxies);
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Timeout'));
      });
    });
  }

  /**
   * Проверяет все прокси на работоспособность
   */
  async testAllProxies() {
    console.log('🧪 Тестируем прокси...');
    const workingProxies = [];
    
    // Тестируем по 10 прокси одновременно
    for (let i = 0; i < this.proxies.length; i += 10) {
      const batch = this.proxies.slice(i, i + 10);
      const results = await Promise.allSettled(
        batch.map(proxy => this.testProxy(proxy))
      );
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          workingProxies.push(batch[index]);
        }
      });
      
      // Небольшая пауза между батчами
      await this.delay(500);
    }
    
    this.proxies = workingProxies;
    console.log(`✅ Найдено ${this.proxies.length} рабочих прокси`);
  }

  /**
   * Тестирует отдельный прокси
   */
  async testProxy(proxy) {
    return new Promise((resolve) => {
      const timeout = 5000;
      const startTime = Date.now();
      
      const req = http.get({
        hostname: 'httpbin.org',
        path: '/ip',
        timeout: timeout,
        agent: new http.Agent({
          host: proxy.host,
          port: proxy.port
        })
      }, (res) => {
        if (res.statusCode === 200) {
          const responseTime = Date.now() - startTime;
          proxy.responseTime = responseTime;
          resolve(true);
        } else {
          resolve(false);
        }
      });

      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
    });
  }

  /**
   * Получает следующий рабочий прокси
   */
  getNextProxy() {
    if (this.proxies.length === 0) {
      return null;
    }

    // Пропускаем прокси из чёрного списка
    let attempts = 0;
    while (attempts < this.proxies.length) {
      const proxy = this.proxies[this.currentIndex];
      const proxyString = `${proxy.host}:${proxy.port}`;
      
      this.currentIndex = (this.currentIndex + 1) % this.proxies.length;
      
      if (!this.blacklist.has(proxyString)) {
        return proxy;
      }
      
      attempts++;
    }
    
    // Если все прокси в чёрном списке, очищаем его
    this.blacklist.clear();
    return this.proxies[0] || null;
  }

  /**
   * Добавляет прокси в чёрный список
   */
  markBadProxy(proxy) {
    const proxyString = `${proxy.host}:${proxy.port}`;
    this.blacklist.add(proxyString);
    console.log(`❌ Прокси ${proxyString} добавлен в чёрный список`);
  }

  /**
   * Получает статистику прокси
   */
  getStats() {
    return {
      total: this.proxies.length,
      blacklisted: this.blacklist.size,
      available: this.proxies.length - this.blacklist.size,
      current: this.currentIndex
    };
  }

  /**
   * Сохраняет прокси в файл
   */
  async saveToFile() {
    try {
      const data = {
        timestamp: Date.now(),
        proxies: this.proxies
      };
      
      await fs.writeFile(this.dataPath, JSON.stringify(data, null, 2));
      console.log('💾 Прокси сохранены в файл');
    } catch (error) {
      console.error('❌ Ошибка сохранения прокси:', error.message);
    }
  }

  /**
   * Задержка
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Очистка всех данных
   */
  clear() {
    this.proxies = [];
    this.blacklist.clear();
    this.currentIndex = 0;
  }
}

module.exports = ProxyManager;