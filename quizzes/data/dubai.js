module.exports = {
    title: 'Насколько хорошо вы знаете Дубай?',
    description: "Набери 10 из 10 и получи ссылку на подборку лучших отелей города!",
    questions: [
        {
          id: 1,
          question: "Какой район Дубая считается самым популярным у туристов?",
          answers: [
            { id: 1, text: "Дубай Марина", isCorrect: false },
            { id: 2, text: "Даунтаун", isCorrect: true },
            { id: 3, text: "Джумейра", isCorrect: false },
            { id: 4, text: "Дейра", isCorrect: false }
          ],
          feedback: {
            correct: "Верно! Даунтаун - это сердце современного Дубая, где находятся самые известные достопримечательности: небоскреб Бурдж-Халифа, Dubai Mall и поющие фонтаны.",
            incorrect: "На самом деле это Даунтаун - центральный район Дубая, где расположены главные достопримечательности города: самый высокий небоскреб в мире Бурдж-Халифа, один из крупнейших торговых центров Dubai Mall и знаменитые поющие фонтаны."
          }
        },
        {
          id: 2,
          question: "В какое время года в Дубае самый комфортный климат для отдыха?",
          answers: [
            { id: 1, text: "Лето", isCorrect: false },
            { id: 2, text: "Осень", isCorrect: false },
            { id: 3, text: "Зима", isCorrect: true },
            { id: 4, text: "Весна", isCorrect: false }
          ],
          feedback: {
            correct: "Верно! Зима (с ноября по март) - идеальное время для посещения Дубая. Температура держится около 25-27 градусов, нет изнуряющей жары и можно комфортно гулять целый день.",
            incorrect: "Лучшее время для поездки в Дубай - это зима (с ноября по март). В это время температура наиболее комфортная - около 25-27 градусов, можно спокойно гулять и осматривать достопримечательности."
          }
        },
        {
          id: 3,
          question: "Какой самый большой торговый центр в Дубае?",
          answers: [
            { id: 1, text: "Dubai Mall", isCorrect: true },
            { id: 2, text: "Mall of Emirates", isCorrect: false },
            { id: 3, text: "Ibn Battuta Mall", isCorrect: false },
            { id: 4, text: "Dubai Marina Mall", isCorrect: false }
          ],
          feedback: {
            correct: "Верно! Dubai Mall - крупнейший торговый центр в мире по общей площади. Здесь более 1200 магазинов, огромный аквариум, каток и множество развлечений.",
            incorrect: "Это Dubai Mall - самый большой торговый центр в мире, где есть не только магазины, но и аквариум, каток и множество других развлечений."
          }
        },
        {
          id: 4,
          question: "Какой знаменитый отель находится на искусственном острове в Дубае?",
          answers: [
            { id: 1, text: "Атлантис", isCorrect: true },
            { id: 2, text: "Бурдж-аль-Араб", isCorrect: false },
            { id: 3, text: "Армани", isCorrect: false },
            { id: 4, text: "Джумейра Бич", isCorrect: false }
          ],
          feedback: {
            correct: "Верно! Отель Атлантис расположен на искусственном острове Пальма Джумейра. Это целый комплекс с аквапарком, дельфинарием и потрясающими видами на Дубай.",
            incorrect: "Это отель Атлантис на острове Пальма Джумейра - огромный комплекс с собственным аквапарком, дельфинарием и другими развлечениями."
          }
        },
        {
          id: 5,
          question: "Что из этого можно посмотреть бесплатно в Дубае?",
          answers: [
            { id: 1, text: "Аквариум в Dubai Mall", isCorrect: false },
            { id: 2, text: "Поющие фонтаны", isCorrect: true },
            { id: 3, text: "Аквапарк Wild Wadi", isCorrect: false },
            { id: 4, text: "Смотровую площадку Бурдж-Халифа", isCorrect: false }
          ],
          feedback: {
            correct: "Верно! Шоу поющих фонтанов у Бурдж-Халифа абсолютно бесплатное. Представления проходят каждый вечер каждые 30 минут, и это одно из самых впечатляющих зрелищ в городе.",
            incorrect: "Поющие фонтаны у Бурдж-Халифа - это бесплатное шоу, которое проходит каждый вечер каждые 30 минут. Это одна из самых популярных достопримечательностей города."
          }
        },
        {
          id: 6,
          question: "Какой вид транспорта считается самым удобным для туристов в Дубае?",
          answers: [
            { id: 1, text: "Автобус", isCorrect: false },
            { id: 2, text: "Метро", isCorrect: true },
            { id: 3, text: "Такси", isCorrect: false },
            { id: 4, text: "Водное такси", isCorrect: false }
          ],
          feedback: {
            correct: "Верно! Метро в Дубае - современное, чистое, с кондиционерами и соединяет все основные туристические районы. Это самый удобный и недорогой способ передвижения по городу.",
            incorrect: "Метро - самый удобный транспорт для туристов в Дубае. Оно современное, с кондиционерами и соединяет все основные достопримечательности города."
          }
        },
        {
          id: 7,
          question: "Какое уникальное развлечение есть в торговом центре Mall of Emirates?",
          answers: [
            { id: 1, text: "Аквариум", isCorrect: false },
            { id: 2, text: "Американские горки", isCorrect: false },
            { id: 3, text: "Крытый горнолыжный курорт", isCorrect: true },
            { id: 4, text: "Колесо обозрения", isCorrect: false }
          ],
          feedback: {
            correct: "Верно! Ski Dubai - это настоящий горнолыжный курорт внутри торгового центра, где можно кататься на лыжах и сноуборде в любое время года, даже когда на улице +40 градусов.",
            incorrect: "В Mall of Emirates находится Ski Dubai - крытый горнолыжный курорт, где можно кататься на лыжах и сноуборде круглый год, несмотря на жаркий климат Дубая."
          }
        },
        {
          id: 8,
          question: "Какое популярное развлечение можно найти в пустыне рядом с Дубаем?",
          answers: [
            { id: 1, text: "Катание на водных лыжах", isCorrect: false },
            { id: 2, text: "Сафари на джипах", isCorrect: true },
            { id: 3, text: "Прыжки с парашютом", isCorrect: false },
            { id: 4, text: "Полеты на воздушном шаре", isCorrect: false }
          ],
          feedback: {
            correct: "Верно! Сафари в пустыне - одно из самых популярных развлечений в Дубае. Программа обычно включает катание на джипах по дюнам, ужин в бедуинском лагере и шоу танца живота.",
            incorrect: "Самое популярное развлечение в пустыне - это сафари на джипах. Туристы могут прокатиться по дюнам, поужинать в бедуинском лагере и посмотреть традиционные представления."
          }
        },
        {
          id: 9,
          question: "Какой известный небоскреб Дубая называют 'парусом' из-за его формы?",
          answers: [
            { id: 1, text: "Бурдж-Халифа", isCorrect: false },
            { id: 2, text: "Бурдж-аль-Араб", isCorrect: true },
            { id: 3, text: "Марина Тауэр", isCorrect: false },
            { id: 4, text: "Принцесс Тауэр", isCorrect: false }
          ],
          feedback: {
            correct: "Верно! Бурдж-аль-Араб построен в форме паруса доу - традиционного арабского судна. Это один из самых роскошных отелей мира, ставший символом Дубая.",
            incorrect: "Это Бурдж-аль-Араб - знаменитый отель в форме паруса традиционного арабского судна. Он считается одним из самых роскошных отелей в мире."
          }
        },
        {
          id: 10,
          question: "Какой знаменитый рынок Дубая также называют 'Золотым суком'?",
          answers: [
            { id: 1, text: "Рынок специй", isCorrect: false },
            { id: 2, text: "Рынок тканей", isCorrect: false },
            { id: 3, text: "Золотой рынок в Дейре", isCorrect: true },
            { id: 4, text: "Рыбный рынок", isCorrect: false }
          ],
          feedback: {
            correct: "Верно! Золотой рынок в районе Дейра - одно из самых популярных мест для покупки ювелирных украшений в Дубае. Здесь сотни магазинов с золотом по самым выгодным ценам.",
            incorrect: "Это Золотой рынок в районе Дейра - знаменитое место, где можно купить золотые украшения по лучшим ценам. Здесь находятся сотни ювелирных магазинов."
          }
        }
    ],
    results: {
        low: {
          range: [0, 5],
          title: "Начинающий путешественник",
          description: "Похоже, Дубай для вас - пока неизведанная территория! Это отличный повод открыть для себя этот удивительный город. Попробуйте пройти тест еще раз, чтобы получить доступ к эксклюзивной подборке отелей.",
          recommendations: [
            {
              type: 'text',
              content: "Посетите смотровую площадку Бурдж-Халифа"
            },
            {
              type: 'text',
              content: "Прогуляйтесь у поющих фонтанов в Даунтауне"
            },
            {
              type: 'text',
              content: "Проведите день в Dubai Mall"
            },
            {
              type: 'link',
              content: "Искать туры в Дубай",
              href: "/tours/uae-dubai/",
              className: "article__link article__link--quiz",
              target: "_blanc"
            },
            {
              type: 'text',
              content: "Попробуйте свои силы в наших квизах"
            },
            {
              type: 'link',
              content: "Квиз на знание Пхукета",
              href: "/country/thailand/phuket#quiz",
              className: "article__link article__link--quiz",
              target: "_blanc"
            },
            {
              type: 'link',
              content: "Квиз на знание Бали",
              href: "/country/indonesia/bali#quiz",
              className: "article__link article__link--quiz",
              target: "_blanc"
            },
            {
              type: 'link',
              content: "Квиз на знание Вьетнама",
              href: "/country/vietnam#quiz",
              className: "article__link article__link--quiz",
              target: "_blanc"
            }
          ]
        },
        medium: {
          range: [6, 7],
          title: "Бывалый турист",
          description: "У вас уже неплохие знания о Дубае! Вы почти у цели. Попробуйте пройти тест еще раз, чтобы получить доступ к эксклюзивной подборке отелей.",
          recommendations: [
            {
              type: 'text',
              content: "Исследуйте старый район Дейра"
            },
            {
              type: 'text',
              content: "Отправьтесь на сафари в пустыню"
            },
            {
              type: 'text',
              content: "Посетите искусственный остров Пальма Джумейра"
            },
            {
              type: 'link',
              content: "Искать туры в Дубай",
              href: "/tours/uae-dubai/",
              className: "article__link article__link--quiz",
              target: "_blanc"
            },
            {
              type: 'text',
              content: "Попробуйте свои силы в наших квизах"
            },
            {
              type: 'link',
              content: "Квиз на знание Пхукета",
              href: "/country/thailand/phuket#quiz",
              className: "article__link article__link--quiz",
              target: "_blanc"
            },
            {
              type: 'link',
              content: "Квиз на знание Бали",
              href: "/country/indonesia/bali#quiz",
              className: "article__link article__link--quiz",
              target: "_blanc"
            },
            {
              type: 'link',
              content: "Квиз на знание Вьетнама",
              href: "/country/vietnam#quiz",
              className: "article__link article__link--quiz",
              target: "_blanc"
            }
          ]
        },
        high: {
          range: [8, 9],
          title: "Опытный путешественник",
          description: "Впечатляюще! Вы отлично разбираетесь в особенностях Дубая. Еще немного и вы получите доступ к эксклюзивной подборке отелей!",
          recommendations: [
            {
              type: 'text',
              content: "Посетите новые районы Dubai Marina и JBR"
            },
            {
              type: 'text',
              content: "Прокатитесь на монорельсе по Пальме Джумейра"
            },
            {
              type: 'text',
              content: "Исследуйте современный район Dubai Design District"
            },
            {
              type: 'link',
              content: "Искать туры в Дубай",
              href: "/tours/uae-dubai/",
              className: "article__link article__link--quiz",
              target: "_blanc"
            },
            {
              type: 'text',
              content: "Попробуйте свои силы в наших квизах"
            },
            {
              type: 'link',
              content: "Квиз на знание Пхукета",
              href: "/country/thailand/phuket#quiz",
              className: "article__link article__link--quiz",
              target: "_blanc"
            },
            {
              type: 'link',
              content: "Квиз на знание Бали",
              href: "/country/indonesia/bali#quiz",
              className: "article__link article__link--quiz",
              target: "_blanc"
            },
            {
              type: 'link',
              content: "Квиз на знание Вьетнама",
              href: "/country/vietnam#quiz",
              className: "article__link article__link--quiz",
              target: "_blanc"
            }
          ]
        },
        expert: {
          range: [10, 10],
          title: "Эксперт по Дубаю",
          description: "Поздравляем! Вы ответили правильно на все вопросы и получаете доступ к эксклюзивной подборке лучших отелей Дубая!",
          recommendations: [
            {
              type: 'text',
              content: "Вы действительно эксперт по Дубаю!"
            },
            {
              type: 'text',
              content: "Воспользуйтесь нашей подборкой лучших отелей с высоким рейтингом для планирования идеального отдыха"
            },
            {
              type: 'link',
              content: "Лучшие отели в Дубае",
              href: "/tours/uae/?tvsearch=nadus2",
              className: "article__link article__link--quiz",
              target: "_blanc"
            },
            {
              type: 'text',
              content: "Попробуйте свои силы в наших квизах"
            },
            {
              type: 'link',
              content: "Квиз на знание Пхукета",
              href: "/country/thailand/phuket#quiz",
              className: "article__link article__link--quiz",
              target: "_blanc"
            },
            {
              type: 'link',
              content: "Квиз на знание Бали",
              href: "/country/indonesia/bali#quiz",
              className: "article__link article__link--quiz",
              target: "_blanc"
            },
            {
              type: 'link',
              content: "Квиз на знание Вьетнама",
              href: "/country/vietnam#quiz",
              className: "article__link article__link--quiz",
              target: "_blanc"
            }
          ]
        }
    }
}