const emailTemplate = (email) => `
  <!DOCTYPE html>
  <html lang="ru">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Добро пожаловать в турагентство "Time to Travel"!</title>
      <style type="text/css">
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            font-size: 16px;
            line-height: 1.5;
            color: #333333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #0066cc;
            font-size: 24px;
        }
        h2 {
            color: #0066cc;
            font-size: 20px;
        }
        .highlight {
            background-color: #f0f0f0;
            padding: 15px;
            border-radius: 5px;
        }
        .cta-button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #0066cc;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 5px;
        }
        .destination {
            margin-bottom: 20px;
        }
        @media only screen and (max-width: 480px) {
            .container {
                padding: 10px;
            }
            h1 {
                font-size: 20px;
            }
            h2 {
                font-size: 18px;
            }
        }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>Уважаемый путешественник,</h1>
          
          <p>Добро пожаловать в мир незабываемых приключений с Time to Travel!</p>
          
          <div class="highlight">
            <p>🌴 Специально для вас мы подготовили эксклюзивный гид по популярным направлениям из Казахстана. В нём вы найдете:</p>
            <ul>
                <li>Секретные места, о которых знают только местные</li>
                <li>Лайфхаки для экономии на путешествиях</li>
                <li>Календарь лучших событий и фестивалей</li>
                <li>И много других полезных советов!</li>
            </ul>
          </div>
          
          <p>Готовы к приключениям? Взгляните на наши топовые направления этого сезона:</p>
          
          <div class="destination">
              <h2>🏖️ <a href="https://tmtl.kz/tours/thailand/index.html">Таиланд</a>: Рай для искателей приключений</h2>
              <p>Представьте: вы просыпаетесь под шум волн, завтракаете экзотическими фруктами и отправляетесь исследовать древние храмы. А вечером вас ждет незабываемый массаж и ужин под звездами на пляже. В Таиланде каждый день - новое приключение!</p>
          </div>
          
          <div class="destination">
              <h2>🏙️ <a href="https://tmtl.kz/tours/uae/index.html">ОАЭ</a>: Будущее уже здесь</h2>
              <p>Хотите почувствовать себя в завтрашнем дне? ОАЭ - это место, где мечты становятся реальностью. Поднимитесь на самое высокое здание в мире, покатайтесь на горных лыжах посреди пустыни и поужинайте в ресторане под водой. Здесь возможно все!</p>
          </div>
          
          <div class="destination">
              <h2>🍜 <a href="https://tmtl.kz/tours/vietnam/index.html">Вьетнам</a>: Вкус настоящей Азии</h2>
              <p>Погрузитесь в атмосферу настоящей Азии! Проснитесь на рассвете под пение птиц в бухте Халонг, прокатитесь на мотобайке по рисовым террасам и насладитесь лучшим в мире кофе. Вьетнам - это путешествие, которое останется с вами навсегда.</p>
          </div>
          
          <div class="destination">
              <h2>🏛️ <a href="https://tmtl.kz/tours/egypt/index.html">Египет</a>: Прикоснитесь к истории</h2>
              <p>Мечтали ли вы когда-нибудь оказаться в машине времени? В Египте это возможно! Исследуйте величественные пирамиды, погрузитесь в подводный мир Красного моря и прокатитесь на верблюде по пустыне под звездным небом. Египет - это путешествие сквозь тысячелетия!</p>
          </div>
          
          <div class="destination">
              <h2>🌊 <a href="https://tmtl.kz/tours/turkey/index.html">Турция</a>: Мост между мирами</h2>
              <p>Где еще вы сможете позавтракать в Европе, а поужинать в Азии? Только в Турции! Насладитесь великолепной кухней, расслабьтесь на прекрасных пляжах и окунитесь в атмосферу восточных базаров. А полет на воздушном шаре над Каппадокией станет вишенкой на торте вашего путешествия!</p>
          </div>
          
          <div class="destination">
              <h2>🐼 <a href="https://tmtl.kz/tours/china/index.html">Китай</a>: Откройте для себя новый мир</h2>
              <p>Хотите удивить себя? Отправляйтесь в Китай! Пройдитесь по Великой Китайской стене, посетите дворец Далай-ламы в Тибете и попробуйте настоящую пекинскую утку. А на острове Хайнань вас ждут лучшие пляжи и спа-курорты. Китай - это страна, где каждый найдет что-то особенное для себя!</p>
          </div>
          
          <p>Эти направления не просто популярны - они изменят вашу жизнь! Каждое путешествие - это новая глава вашей личной истории. Какую страницу вы хотите написать следующей?</p>
          
          <p>Остались вопросы? Мы всегда на связи:</p>
          <p>☎️ <a href="tel:+77078863633">+7 (707) 886-36-33</a><br>
          ✉️ <a href="mailto:info@tmtl.kz">info@tmtl.kz</a></p>
          
          <p>Следите за нашими новостями и горящими предложениями:</p>
          <p>📸 Instagram: <a href="https://www.instagram.com/timetotravel_krg/">timetotravel_krg</a><br>
          💬 Telegram: <a href="https://t.me/hottours_krg">hottours_krg</a></p>
          
          <p>Ваше следующее великое приключение начинается с Time to Travel!</p>
          
          <p>До встречи в аэропорту,<br>
          Команда Time to Travel<br>
          Мустафина 81/3, офис 206, Караганда</p>
          
          <p><a href="https://tmtl.kz" class="cta-button">Исследовать все направления</a></p>
      </div>
  </body>
  </html>
`;

module.exports = emailTemplate;