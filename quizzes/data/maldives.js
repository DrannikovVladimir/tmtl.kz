module.exports = {
  title: 'Насколько хорошо вы знаете Мальдивы?',
  description: "Мечтаете об отдыхе на райских островах? Пройдите тест и проверьте свои знания о Мальдивах! Ответьте правильно на 10 из 10 вопросов",
  questions: [
    {
      id: 1,
      question: "Сколько островов входит в состав Мальдивской Республики?",
      answers: [
        { id: 1, text: "Около 200", isCorrect: false },
        { id: 2, text: "Около 1200", isCorrect: true },
        { id: 3, text: "Около 500", isCorrect: false },
        { id: 4, text: "Около 3000", isCorrect: false }
      ],
      feedback: {
        correct: "Верно! Мальдивы состоят примерно из 1200 коралловых островов, сгруппированных в 26 атоллов. Однако лишь около 200 из них обитаемы, а туристические курорты расположены примерно на 150 островах.",
        incorrect: "На самом деле, Мальдивы состоят примерно из 1200 коралловых островов. Из них только около 200 обитаемы местным населением, а туристическая инфраструктура развита примерно на 150 островах."
      }
    },
    {
      id: 2,
      question: "В каком океане расположены Мальдивы?",
      answers: [
        { id: 1, text: "Тихий океан", isCorrect: false },
        { id: 2, text: "Атлантический океан", isCorrect: false },
        { id: 3, text: "Индийский океан", isCorrect: true },
        { id: 4, text: "Южный океан", isCorrect: false }
      ],
      feedback: {
        correct: "Верно! Мальдивы расположены в Индийском океане, к юго-западу от Индии и Шри-Ланки. Благодаря своему расположению в экваториальных водах, Мальдивы обладают теплым климатом круглый год и кристально чистой водой.",
        incorrect: "Мальдивы расположены в Индийском океане, примерно в 700 км к юго-западу от Шри-Ланки. Это одно из самых низко расположенных государств в мире, что делает его особенно уязвимым к повышению уровня моря."
      }
    },
    {
      id: 3,
      question: "Какое уникальное природное явление можно наблюдать на некоторых пляжах Мальдив ночью?",
      answers: [
        { id: 1, text: "Светящийся планктон", isCorrect: true },
        { id: 2, text: "Северное сияние", isCorrect: false },
        { id: 3, text: "Извержение вулкана", isCorrect: false },
        { id: 4, text: "Миграцию черепах", isCorrect: false }
      ],
      feedback: {
        correct: "Верно! На некоторых пляжах Мальдив можно наблюдать биолюминесцентный планктон, который светится в темноте при движении воды. Это создает волшебное зрелище: песок и волны начинают сиять голубоватым светом, словно звезды упали в океан.",
        incorrect: "На некоторых пляжах Мальдив можно наблюдать светящийся планктон. Это явление биолюминесценции создает эффект мерцающих волн и светящегося песка при прикосновении. Северное сияние на экваторе наблюдать невозможно, а вулканов на Мальдивах нет."
      }
    },
    {
      id: 4,
      question: "На какой высоте над уровнем моря находится самая высокая естественная точка Мальдив?",
      answers: [
        { id: 1, text: "2.4 метра", isCorrect: true },
        { id: 2, text: "24 метра", isCorrect: false },
        { id: 3, text: "124 метра", isCorrect: false },
        { id: 4, text: "1024 метра", isCorrect: false }
      ],
      feedback: {
        correct: "Верно! Самая высокая естественная точка Мальдив находится всего на 2.4 метра над уровнем моря, что делает эту страну самым низко расположенным государством в мире. Именно поэтому Мальдивы особенно уязвимы к повышению уровня Мирового океана из-за глобального потепления.",
        incorrect: "Самая высокая естественная точка Мальдив находится всего на 2.4 метра над уровнем моря. Мальдивы считаются самым плоским государством в мире, что делает их особенно уязвимыми перед изменением климата и повышением уровня моря."
      }
    },
    {
      id: 5,
      question: "Какой тип проживания является традиционным для туристов на Мальдивах?",
      answers: [
        { id: 1, text: "Горные шале", isCorrect: false },
        { id: 2, text: "Виллы на воде (бунгало)", isCorrect: true },
        { id: 3, text: "Квартиры в небоскребах", isCorrect: false },
        { id: 4, text: "Палатки на пляже", isCorrect: false }
      ],
      feedback: {
        correct: "Верно! Виллы на воде или водные бунгало — визитная карточка Мальдив. Эти постройки стоят на сваях прямо над лагуной, с собственным выходом в море и часто с прозрачным полом для наблюдения за морской жизнью. Это один из самых романтичных и уникальных видов размещения в мире.",
        incorrect: "Традиционным типом размещения для туристов на Мальдивах являются виллы на воде (водные бунгало). Эти уникальные строения возведены на сваях прямо над лагуной и стали одним из символов мальдивского люксового отдыха."
      }
    },
    {
      id: 6,
      question: "Что такое 'дони' на Мальдивах?",
      answers: [
        { id: 1, text: "Традиционная мальдивская лодка", isCorrect: true },
        { id: 2, text: "Местная валюта", isCorrect: false },
        { id: 3, text: "Национальное блюдо", isCorrect: false },
        { id: 4, text: "Ритуальный танец", isCorrect: false }
      ],
      feedback: {
        correct: "Верно! Дони — это традиционная мальдивская лодка с парусом, которая веками использовалась местными жителями для рыбалки и перемещения между островами. Сегодня модернизированные версии дони с моторами все еще широко используются для транспортировки туристов.",
        incorrect: "Дони — это традиционная мальдивская лодка. Эти деревянные суда с характерным приподнятым носом веками использовались для перемещения между островами и рыбной ловли. Сегодня они остаются важным транспортным средством, хотя многие уже оснащены моторами."
      }
    },
    {
      id: 7,
      question: "Какой вид транспорта является основным для перемещения между островами на Мальдивах?",
      answers: [
        { id: 1, text: "Автобусы", isCorrect: false },
        { id: 2, text: "Лодки и гидросамолеты", isCorrect: true },
        { id: 3, text: "Поезда", isCorrect: false },
        { id: 4, text: "Верблюды", isCorrect: false }
      ],
      feedback: {
        correct: "Верно! Из-за отсутствия сухопутных дорог между островами на Мальдивах используются водный и воздушный транспорт. Лодки, скоростные катера и традиционные дони перевозят людей между близлежащими островами, а гидросамолеты обслуживают более отдаленные курорты.",
        incorrect: "Основными видами транспорта для перемещения между островами на Мальдивах являются лодки и гидросамолеты. Поскольку острова разделены океаном, сухопутного транспорта между ними не существует. Скоростные катера используются для близких расстояний, а гидросамолеты — для дальних перелетов."
      }
    },
    {
      id: 8,
      question: "Каково официальное название местной валюты на Мальдивах?",
      answers: [
        { id: 1, text: "Мальдивская рупия", isCorrect: false },
        { id: 2, text: "Мальдивский динар", isCorrect: false },
        { id: 3, text: "Мальдивская руфия", isCorrect: true },
        { id: 4, text: "Мальдивский доллар", isCorrect: false }
      ],
      feedback: {
        correct: "Верно! Официальная валюта Мальдив — мальдивская руфия (MVR). Однако туристам не обязательно менять деньги, так как большинство курортов, ресторанов и магазинов принимают доллары США и основные кредитные карты.",
        incorrect: "Официальная валюта Мальдив называется руфия (MVR). На курортах часто принимают доллары США и евро, а также кредитные карты. Руфия делится на 100 лари, а банкноты украшены изображениями местной природы и культурного наследия."
      }
    },
    {
      id: 9,
      question: "Какое растение является национальным символом Мальдив?",
      answers: [
        { id: 1, text: "Кокосовая пальма", isCorrect: true },
        { id: 2, text: "Банановое дерево", isCorrect: false },
        { id: 3, text: "Сакура", isCorrect: false },
        { id: 4, text: "Дуб", isCorrect: false }
      ],
      feedback: {
        correct: "Верно! Кокосовая пальма является национальным символом Мальдив и изображена на гербе страны. Это дерево имеет огромное значение для местных жителей — его используют для строительства, изготовления предметов быта, а кокосы являются важным ингредиентом в мальдивской кухне.",
        incorrect: "Национальным символом Мальдив является кокосовая пальма, которая также изображена на гербе страны. Эти деревья растут на большинстве островов и имеют огромное значение в местной культуре и экономике — мальдивцы используют все части пальмы, от древесины до плодов."
      }
    },
    {
      id: 10,
      question: "Из-за чего Мальдивы считаются одним из мест, находящихся под угрозой исчезновения?",
      answers: [
        { id: 1, text: "Из-за активных вулканов", isCorrect: false },
        { id: 2, text: "Из-за глобального потепления и повышения уровня моря", isCorrect: true },
        { id: 3, text: "Из-за пиратства", isCorrect: false },
        { id: 4, text: "Из-за перенаселения", isCorrect: false }
      ],
      feedback: {
        correct: "Верно! Мальдивы — самое низко расположенное государство в мире со средней высотой всего 1.5 метра над уровнем моря. Из-за глобального потепления и связанного с ним повышения уровня океана существует реальная угроза того, что большая часть Мальдивских островов может оказаться под водой к концу этого века.",
        incorrect: "Мальдивы находятся под угрозой из-за глобального потепления и повышения уровня моря. Поскольку это самая низкая страна в мире (средняя высота — 1.5 метра над уровнем моря), даже небольшое повышение уровня океана может привести к затоплению значительной части территории."
      }
    }
  ],
  results: {
    low: {
      range: [0, 3],
      title: "Начинающий исследователь райских островов",
      description: "Ваше знакомство с Мальдивами только начинается! Эти удивительные острова готовы раскрыть перед вами все свои секреты и красоты. Самое интересное — это процесс открытия нового, а на Мальдивах вас ждет множество чудесных открытий.",
      recommendations: [
        {
          type: 'text',
          content: "Начните знакомство с Мальдивами с острова Мале — столицы и самого оживленного места архипелага"
        },
        {
          type: 'text',
          content: "Обязательно попробуйте традиционные блюда из свежих морепродуктов — местную рыбу тунец и кокосовые десерты"
        },
        {
          type: 'link',
          content: "Искать туры на Мальдивы",
          href: "/tours/maldives/",
          className: "article__link article__link--quiz"
        }
      ],
      otherQuizzes: [
        {
          type: 'link',
          content: "Квиз на знание Бали",
          href: "/country/indonesia/bali#quiz",
          className: "article__link article__link--quiz"
        },
        {
          type: 'link',
          content: "Квиз на знание Турции",
          href: "/country/turkey#quiz",
          className: "article__link article__link--quiz"
        },
        {
          type: 'link',
          content: "Квиз на знание Пхукета",
          href: "/country/thailand/phuket#quiz",
          className: "article__link article__link--quiz"
        }
      ]
    },
    medium: {
      range: [4, 7],
      title: "Поклонник бирюзовых лагун",
      description: "Неплохой результат! Вы уже знаете немало интересного о Мальдивах и их уникальной природе. Продолжайте изучать этот удивительный архипелаг, и он раскроет перед вами еще больше своих тайн и прекрасных мест.",
      recommendations: [
        {
          type: 'text',
          content: "Остановитесь в вилле на воде, чтобы в полной мере ощутить атмосферу Мальдив"
        },
        {
          type: 'text',
          content: "Отправьтесь на экскурсию по необитаемым островам, чтобы увидеть нетронутую природу"
        },
        {
          type: 'link',
          content: "Искать туры на Мальдивы",
          href: "/tours/maldives/",
          className: "article__link article__link--quiz"
        }
      ],
      otherQuizzes: [
        {
          type: 'link',
          content: "Квиз на знание Бали",
          href: "/country/indonesia/bali#quiz",
          className: "article__link article__link--quiz"
        },
        {
          type: 'link',
          content: "Квиз на знание Турции",
          href: "/country/turkey#quiz",
          className: "article__link article__link--quiz"
        },
        {
          type: 'link',
          content: "Квиз на знание Пхукета",
          href: "/country/thailand/phuket#quiz",
          className: "article__link article__link--quiz"
        }
      ]
    },
    high: {
      range: [8, 9],
      title: "Знаток коралловых атоллов",
      description: "Впечатляюще! Ваши знания о Мальдивах достойны уважения. Вы хорошо подготовлены к путешествию и сможете получить от него максимум удовольствия, зная особенности и традиции этого райского уголка Земли.",
      recommendations: [
        {
          type: 'text',
          content: "Исследуйте подводный мир Мальдив — коралловые рифы и богатая морская фауна не оставят вас равнодушными"
        },
        {
          type: 'text',
          content: "Совершите круиз на традиционной мальдивской лодке дони от острова к острову"
        },
        {
          type: 'link',
          content: "Искать туры на Мальдивы",
          href: "/tours/maldives/",
          className: "article__link article__link--quiz"
        }
      ],
      otherQuizzes: [
        {
          type: 'link',
          content: "Квиз на знание Бали",
          href: "/country/indonesia/bali#quiz",
          className: "article__link article__link--quiz"
        },
        {
          type: 'link',
          content: "Квиз на знание Турции",
          href: "/country/turkey#quiz",
          className: "article__link article__link--quiz"
        },
        {
          type: 'link',
          content: "Квиз на знание Пхукета",
          href: "/country/thailand/phuket#quiz",
          className: "article__link article__link--quiz"
        }
      ]
    },
    expert: {
      range: [10, 10],
      title: "Гуру мальдивского рая",
      description: "Великолепно! Вы настоящий эксперт по Мальдивам! Ваши знания об этом чудесном архипелаге настолько глубоки, что вы могли бы даже проводить экскурсии. Отдых на Мальдивах станет для вас незабываемым опытом.",
      recommendations: [
        {
          type: 'text',
          content: "Попробуйте необычные виды отдыха, например, ночной дайвинг для наблюдения за светящимся планктоном"
        },
        {
          type: 'text',
          content: "Посетите местные деревни, чтобы познакомиться с подлинной культурой и бытом мальдивцев"
        },
        {
          type: 'link',
          content: "Искать туры на Мальдивы",
          href: "/tours/maldives/",
          className: "article__link article__link--quiz"
        }
      ],
      otherQuizzes: [
        {
          type: 'link',
          content: "Квиз на знание Бали",
          href: "/country/indonesia/bali#quiz",
          className: "article__link article__link--quiz"
        },
        {
          type: 'link',
          content: "Квиз на знание Турции",
          href: "/country/turkey#quiz",
          className: "article__link article__link--quiz"
        },
        {
          type: 'link',
          content: "Квиз на знание Пхукета",
          href: "/country/thailand/phuket#quiz",
          className: "article__link article__link--quiz"
        }
      ]
    }
  }
};