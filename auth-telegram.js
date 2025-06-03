const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const readline = require('readline');

// Ваши данные из .env
const API_ID = 25674662;
const API_HASH = '14c3c3bf6cac3317faf389e4329fab4e';
const PHONE = '+77028883633';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function input(text) {
  return new Promise((resolve) => {
    rl.question(text, resolve);
  });
}

async function authorize() {
  console.log('🔐 Начинаем авторизацию в Telegram...');
  
  const session = new StringSession(''); // Пустая сессия
  const client = new TelegramClient(session, API_ID, API_HASH, {
    connectionRetries: 5,
  });

  try {
    await client.start({
      phoneNumber: PHONE,
      password: async () => await input('Введите пароль 2FA (если есть): '),
      phoneCode: async () => await input('Введите код из SMS: '),
      onError: (err) => console.log('Ошибка:', err),
    });

    console.log('✅ Авторизация успешна!');
    
    // Сохраняем сессию
    const sessionString = client.session.save();
    console.log('\n📋 Сохраните эту строку сессии:');
    console.log('SESSION_STRING=' + sessionString);
    
    // Тестируем подключение
    const me = await client.getMe();
    console.log('\n👤 Авторизован как:', me.firstName, me.lastName);
    
    await client.disconnect();
    rl.close();
    
  } catch (error) {
    console.error('❌ Ошибка авторизации:', error.message);
    rl.close();
  }
}

authorize();