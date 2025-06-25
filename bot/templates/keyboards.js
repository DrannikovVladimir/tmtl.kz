// bot/templates/keyboards.js

/**
 * Шаблоны клавиатур и кнопок для бота
 */

// Inline клавиатура для неподписанных пользователей
const subscribeKeyboard = {
  inline_keyboard: [
    [
      {
        text: '📢 Подписаться на канал',
        url: 'https://t.me/hottours_krg'
      }
    ],
    [
      {
        text: '✅ Я подписался!',
        callback_data: 'check_subscription'
      }
    ]
  ]
};

// Inline клавиатура с полезными ссылками (показывается во время загрузки файла)
const loadingKeyboard = {
  inline_keyboard: [
    [
      {
        text: '📞 Связаться с менеджером',
        url: 'https://wa.me/77078863633?text=Здравствуйте! Нужна консультация по турам'
      }
    ],
    [
      {
        text: '☎️ Заказать обратный звонок',
        callback_data: 'request_callback'
      }
    ],
    [
      {
        text: '🌐 Перейти на сайт',
        url: 'https://tmtl.kz'
      }
    ]
  ]
};

// Reply клавиатура для запроса контакта
const callbackKeyboard = {
  keyboard: [
    [
      {
        text: '📱 Поделиться номером',
        request_contact: true
      }
    ],
    [
      {
        text: '❌ Отмена'
      }
    ]
  ],
  resize_keyboard: true,
  one_time_keyboard: true
};

// НОВОЕ: Главное меню с популярными направлениями
const mainMenuKeyboard = {
  keyboard: [
    [
      {
        text: '🇦🇪 ОАЭ'
      },
      {
        text: '🇪🇬 Египет'
      }
    ],
    [
      {
        text: '🇹🇭 Таиланд'
      },
      {
        text: '🇹🇷 Турция'
      }
    ],
    [
      {
        text: '🇻🇳 Вьетнам'
      },
      {
        text: '🇲🇻 Мальдивы'
      }
    ],
    [
      {
        text: '📞 Связаться'
      },
      {
        text: '🌍 Все туры'
      }
    ]
  ],
  resize_keyboard: true,
  persistent: true
};

// Inline клавиатура с основными действиями (для будущего меню)
const actionMenuKeyboard = {
  inline_keyboard: [
    [
      {
        text: '📖 Получить гайд',
        callback_data: 'get_guide'
      }
    ],
    [
      {
        text: '🔍 Искать туры онлайн',
        url: 'https://tmtl.kz'
      }
    ],
    [
      {
        text: '📞 Связаться с менеджером',
        url: 'https://wa.me/77078863633'
      }
    ]
  ]
};

// Reply клавиатура с быстрыми командами (для будущего использования)
const quickActionsKeyboard = {
  keyboard: [
    [
      {
        text: '📖 Получить гайд'
      },
      {
        text: '🔍 Искать туры'
      }
    ],
    [
      {
        text: '📞 Связаться'
      },
      {
        text: '❓ Помощь'
      }
    ]
  ],
  resize_keyboard: true,
  persistent: true
};

// Клавиатура для удаления (очистки) всех кнопок
const removeKeyboard = {
  remove_keyboard: true
};

// Inline клавиатура с каналами и соц. сетями
const socialKeyboard = {
  inline_keyboard: [
    [
      {
        text: '📢 Наш канал',
        url: 'https://t.me/hottours_krg'
      },
      {
        text: '📱 Instagram',
        url: 'https://www.instagram.com/timetotravel_krg'
      }
    ],
    [
      {
        text: '🌐 Сайт',
        url: 'https://tmtl.kz'
      },
      {
        text: '💬 WhatsApp',
        url: 'https://wa.me/77078863633'
      }
    ]
  ]
};

// Inline клавиатура для админских команд (для будущего использования)
const adminKeyboard = {
  inline_keyboard: [
    [
      {
        text: '📊 Статистика',
        callback_data: 'admin_stats'
      },
      {
        text: '📋 Заявки',
        callback_data: 'admin_requests'
      }
    ],
    [
      {
        text: '📤 Рассылка',
        callback_data: 'admin_broadcast'
      },
      {
        text: '⚙️ Настройки',
        callback_data: 'admin_settings'
      }
    ]
  ]
};

module.exports = {
  subscribeKeyboard,
  loadingKeyboard,
  callbackKeyboard,
  mainMenuKeyboard,
  actionMenuKeyboard,
  quickActionsKeyboard,
  removeKeyboard,
  socialKeyboard,
  adminKeyboard
};