module.exports = {
  title: 'Насколько хорошо вы знаете Пхукет?',
  description: "Набери 10 из 10 и получи ссылку на подборку лучших отелей острова!",
  questions: [
    {
      id: 1,
      question: "Какая гора на Пхукете считается самой священной?",      
      answers: [
        { id: 1, text: "Большой Будда", isCorrect: false },
        { id: 2, text: "Гора Нака", isCorrect: false },
        { id: 3, text: "Холм обезьян", isCorrect: false },
        { id: 4, text: "Гора Као Ранг", isCorrect: true }
      ],
      feedback: {
        correct: "Верно! Као Ранг - самая высокая точка острова (около 500м) и священное место для тайцев. На её вершине находится храм с отпечатком стопы Будды и открывается потрясающий вид на весь остров.",
        incorrect: "На самом деле это Као Ранг - священная гора и самая высокая точка острова, откуда открывается панорамный вид на Пхукет."
      }
    },
    {
      id: 2,
      question: "В каком месяце на Пхукете начинается высокий сезон?",
      answers: [
        { id: 1, text: "Июль", isCorrect: false },
        { id: 2, text: "Ноябрь", isCorrect: true },
        { id: 3, text: "Январь", isCorrect: false },
        { id: 4, text: "Март", isCorrect: false }
      ],
      feedback: {
        correct: "Верно! Высокий сезон на Пхукете длится с ноября по апрель. В это время минимум осадков и идеальные условия для пляжного отдыха.",
        incorrect: "Высокий сезон начинается в ноябре, когда заканчиваются дожди и устанавливается сухая солнечная погода, идеальная для отдыха."
      }
    },
    {
      id: 3,
      question: "Какой пляж Пхукета называют 'Пляжем Миллионеров'?",
      answers: [
        { id: 1, text: "Патонг", isCorrect: false },
        { id: 2, text: "Сурин", isCorrect: true },
        { id: 3, text: "Ката", isCorrect: false },
        { id: 4, text: "Карон", isCorrect: false }
      ],
      feedback: {
        correct: "Верно! Сурин известен как 'Пляж Миллионеров' из-за роскошных вилл на холмах и высоких цен на недвижимость в этом районе. Это один из самых престижных пляжей острова.",
        incorrect: "Это пляж Сурин - самый элитный пляж Пхукета, окруженный роскошными виллами и пятизвездочными отелями."
      }
    },
    {
      id: 4,
      question: "Какое блюдо считается визитной карточкой уличной еды Пхукета?",
      answers: [
        { id: 1, text: "Пад Тай", isCorrect: false },
        { id: 2, text: "Том Ям", isCorrect: false },
        { id: 3, text: "Миг Сапам", isCorrect: true },
        { id: 4, text: "Сом Там", isCorrect: false }
      ],
      feedback: {
        correct: "Верно! Миг Сапам - это уникальная лапша с морепродуктами, которая появилась именно на Пхукете и стала символом местной уличной кухни.",
        incorrect: "Это Миг Сапам - особое блюдо, придуманное на Пхукете. Это жареная лапша с морепродуктами, которую готовят только здесь."
      }
    },
    {
      id: 5,
      question: "Какой район Пхукета называют 'Старым городом'?",
      answers: [
        { id: 1, text: "Патонг", isCorrect: false },
        { id: 2, text: "Пхукет-таун", isCorrect: true },
        { id: 3, text: "Ката", isCorrect: false },
        { id: 4, text: "Равай", isCorrect: false }
      ],
      feedback: {
        correct: "Верно! Пхукет-таун - исторический центр острова с сино-португальской архитектурой, где можно увидеть настоящий колониальный стиль и познакомиться с историей острова.",
        incorrect: "Старый город находится в Пхукет-тауне - это исторический центр острова с уникальной сино-португальской архитектурой и богатой историей."
      }
    },
    {
      id: 6,
      question: "Какой фрукт называют 'Королем фруктов' и он очень популярен на Пхукете?",
      answers: [
        { id: 1, text: "Манго", isCorrect: false },
        { id: 2, text: "Дуриан", isCorrect: true },
        { id: 3, text: "Мангостин", isCorrect: false },
        { id: 4, text: "Рамбутан", isCorrect: false }
      ],
      feedback: {
        correct: "Верно! Дуриан известен как 'Король фруктов' в Юго-Восточной Азии. Несмотря на специфический запах, он очень ценится за свой уникальный вкус и полезные свойства.",
        incorrect: "Это Дуриан - знаменитый 'Король фруктов', который, несмотря на свой специфический запах, является деликатесом в Таиланде."
      }
    },
    {
      id: 7,
      question: "Какое природное явление можно наблюдать на пляже Найхарн в период с мая по октябрь?",
      answers: [
        { id: 1, text: "Красные приливы", isCorrect: false },
        { id: 2, text: "Миграцию китов", isCorrect: false },
        { id: 3, text: "Большие волны для сёрфинга", isCorrect: true },
        { id: 4, text: "Свечение планктона", isCorrect: false }
      ],
      feedback: {
        correct: "Верно! В сезон дождей (май-октябрь) пляж Найхарн становится популярным местом для сёрфинга благодаря высоким волнам. Это лучшее время для занятий этим видом спорта на Пхукете.",
        incorrect: "В этот период на пляже Найхарн образуются идеальные волны для сёрфинга, и он становится одним из популярнейших мест для этого вида спорта на острове."
      }
    },
    {
      id: 8,
      question: "Какое ежегодное событие на Пхукете привлекает тысячи вегетарианцев со всего мира?",
      answers: [
        { id: 1, text: "Сонгкран", isCorrect: false },
        { id: 2, text: "Лой Кратонг", isCorrect: false },
        { id: 3, text: "Вегетарианский фестиваль", isCorrect: true },
        { id: 4, text: "Фестиваль фонариков", isCorrect: false }
      ],
      feedback: {
        correct: "Верно! Вегетарианский фестиваль (или Фестиваль девяти императорских богов) проходит в сентябре-октябре. Во время фестиваля люди соблюдают строгую вегетарианскую диету и проводят уникальные ритуалы.",
        incorrect: "Это Вегетарианский фестиваль - одно из самых ярких событий на Пхукете, когда люди соблюдают строгую вегетарианскую диету и участвуют в уникальных ритуалах."
      }
    },
    {
      id: 9,
      question: "Какой вид транспорта на Пхукете называют 'тук-тук'?",
      answers: [
        { id: 1, text: "Мотобайк с коляской", isCorrect: false },
        { id: 2, text: "Маленький автобус", isCorrect: false },
        { id: 3, text: "Модифицированный пикап", isCorrect: true },
        { id: 4, text: "Велорикша", isCorrect: false }
      ],
      feedback: {
        correct: "Верно! На Пхукете тук-туками называют модифицированные пикапы с пассажирским отсеком - это отличается от классических тук-туков в Бангкоке и других частях Таиланда.",
        incorrect: "На Пхукете тук-тук - это модифицированный пикап с пассажирским отсеком, что отличает его от классических тук-туков в других частях Таиланда."
      }
    },
    {
      id: 10,
      question: "Что находится на вершине холма Као Кад и привлекает множество туристов?",
      answers: [
        { id: 1, text: "Парк бабочек", isCorrect: false },
        { id: 2, text: "Обсерватория Пхукета", isCorrect: false },
        { id: 3, text: "Смотровая площадка", isCorrect: false },
        { id: 4, text: "Белая мраморная статуя Будды", isCorrect: true }
      ],
      feedback: {
        correct: "Верно! Большой Будда - одна из самых известных достопримечательностей Пхукета. Это 45-метровая статуя из белого мрамора, откуда открывается потрясающий вид на остров.",
        incorrect: "На вершине холма находится знаменитая статуя Большого Будды - 45-метровый монумент из белого мрамора, ставший символом острова."
      }
    }
  ],
  results: {
    low: {
      range: [0, 5],
      title: "Начинающий путешественник",
      description: "Похоже, Пхукет для вас - пока неизведанная территория! Это отличная возможность открыть для себя этот удивительный остров. Попробуйте пройти тест еще раз, чтобы получить доступ к эксклюзивной подборке отелей.",
      recommendations: [
        {
          type: 'text',
          content: "Посетите смотровую площадку на мысе Промтеп"
        },
        {
          type: 'text',
          content: "Отправьтесь на экскурсию к Большому Будде"
        },
        {
          type: 'text',
          content: "Проведите день на пляже Ката или Карон"
        },
        {
          type: 'link',
          content: "Искать туры на Пхукет",
          href: "/tours/thailand-phuket/",
          className: "article__link article__link--quiz"
        }
      ],
      otherQuizzes: [
        {
          type: 'link',
          content: "Квиз на знание Страны Фараонов",
          href: "/country/egypt#quiz",
          className: "article__link article__link--quiz"
        },
        {
          type: 'link',
          content: "Квиз на знание Бали",
          href: "/country/indonesia/bali#quiz",
          className: "article__link article__link--quiz"
        },
        {
          type: 'link',
          content: "Квиз на знание Вьетнама",
          href: "/country/vietnam#quiz",
          className: "article__link article__link--quiz"
        }
      ]
    },
    medium: {
      range: [6, 7],
      title: "Бывалый турист",
      description: "У вас уже неплохие знания о Пхукете! Вы почти у цели. Попробуйте пройти тест еще раз, чтобы получить доступ к эксклюзивной подборке отелей.",
      recommendations: [
        {
          type: 'text',
          content: "Исследуйте старый город Пхукет-таун"
        },
        {
          type: 'text',
          content: "Попробуйте местную кухню в уличных кафе"
        },
        {
          type: 'text',
          content: "Посетите менее известные пляжи острова"
        },
        {
          type: 'link',
          content: "Искать туры на Пхукет",
          href: "/tours/thailand-phuket/",
          className: "article__link article__link--quiz"
        }
      ],
      otherQuizzes: [
        {
          type: 'link',
          content: "Квиз на знание Страны Фараонов",
          href: "/country/egypt#quiz",
          className: "article__link article__link--quiz"
        },
        {
          type: 'link',
          content: "Квиз на знание Бали",
          href: "/country/indonesia/bali#quiz",
          className: "article__link article__link--quiz"
        },
        {
          type: 'link',
          content: "Квиз на знание Вьетнама",
          href: "/country/vietnam#quiz",
          className: "article__link article__link--quiz"
        }
      ]
    },
    high: {
      range: [8, 9],
      title: "Опытный путешественник",
      description: "Впечатляюще! Вы отлично разбираетесь в особенностях Пхукета. Еще немного и вы получите доступ к эксклюзивной подборке отелей!",
      recommendations: [
        {
          type: 'text',
          content: "Исследуйте секретные места острова"
        },
        {
          type: 'text',
          content: "Посетите местные фестивали"
        },
        {
          type: 'text',
          content: "Попробуйте аутентичные блюда в местных ресторанчиках"
        },
        {
          type: 'link',
          content: "Искать лучшие туры на Пхукет",
          href: "/tours/thailand-phuket/",
          className: "article__link article__link--quiz"
        }
      ],
      otherQuizzes: [
        {
          type: 'link',
          content: "Квиз на знание Страны Фараонов",
          href: "/country/egypt#quiz",
          className: "article__link article__link--quiz"
        },
        {
          type: 'link',
          content: "Квиз на знание Бали",
          href: "/country/indonesia/bali#quiz",
          className: "article__link article__link--quiz"
        },
        {
          type: 'link',
          content: "Квиз на знание Вьетнама",
          href: "/country/vietnam#quiz",
          className: "article__link article__link--quiz"
        }
      ]
    },
    expert: {
      range: [10, 10],
      title: "Эксперт по Пхукету",
      description: "Поздравляем! Вы ответили правильно на все вопросы и получаете доступ к эксклюзивной подборке лучших отелей Пхукета!",
      recommendations: [
        {
          type: 'text',
          content: "Вы действительно эксперт по Пхукету!"
        },
        {
          type: 'text',
          content: "Воспользуйтесь нашей подборкой отелей для планирования идеального отдыха"
        },
        {
          type: 'link',
          content: "Искать лучшие отеле на Пхукете",
          href: "/tours/thailand/?tvsearch=q5fn2r",
          className: "article__link article__link--quiz"
        }
      ],
      otherQuizzes: [
        {
          type: 'link',
          content: "Квиз на знание Страны Фараонов",
          href: "/country/egypt#quiz",
          className: "article__link article__link--quiz"
        },
        {
          type: 'link',
          content: "Квиз на знание Бали",
          href: "/country/indonesia/bali#quiz",
          className: "article__link article__link--quiz"
        },
        {
          type: 'link',
          content: "Квиз на знание Вьетнама",
          href: "/country/vietnam#quiz",
          className: "article__link article__link--quiz"
        }
      ]
    }
  }
};