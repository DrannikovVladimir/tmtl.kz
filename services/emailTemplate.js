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
            font-size: 22px;
        }
        h2 {
            margin: 0;
            padding: 0;
            margin-bottom: 5px;
            color: #0066cc;
            font-size: 16px;
        }
        p {
            margin: 0;
            padding: 0;
        }
        .contacts {
            margin-bottom: 3px;
        }
        .margin-bottom {
            margin-bottom: 20px;
        }
        .highlight {
            background-color: #f0f0f0;
            padding: 15px 20px 10px 20px;
            margin-bottom: 20px;
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
          <h1>Уважаемый путешественник!</h1>
          
          <p class="margin-bottom">Добро пожаловать в мир незабываемых приключений с турагентством "Time to Travel"!</p>
          
          <div class="highlight">
            <p>🌴 Специально для вас мы подготовили эксклюзивный гид по популярным направлениям из Казахстана. В нём вы найдете:</p>
            <ul>
                <li>Секретные места, о которых знают только местные</li>
                <li>Лайфхаки для экономии на путешествиях</li>
                <li>Календарь лучших событий и фестивалей</li>
                <li>И много других полезных советов!</li>
            </ul>
          </div>
          
          <p class="margin-bottom">Готовы к приключениям? Взгляните на наши топовые направления этого сезона:</p>
          
          <div class="destination">
              <h2>🏖️ <a href="https://tmtl.kz/tours/thailand/">Таиланд: Рай для искателей приключений</a></h2>
              <p>В Таиланде каждый день - новое приключение!</p>
          </div>
          
          <div class="destination">
              <h2>🏙️ <a href="https://tmtl.kz/tours/uae/">ОАЭ: Будущее уже здесь</a></h2>
              <p>Здесь возможно все!</p>
          </div>
          
          <div class="destination">
              <h2>🍜 <a href="https://tmtl.kz/tours/vietnam/">Вьетнам: Вкус настоящей Азии</a></h2>
              <p>Это путешествие, которое останется с вами навсегда.</p>
          </div>
          
          <div class="destination">
              <h2>🏛️ <a href="https://tmtl.kz/tours/egypt/">Египет: Прикоснитесь к истории</a></h2>
              <p>Путешествие сквозь тысячелетия!</p>
          </div>
          
          <div class="destination">
              <h2>🌊 <a href="https://tmtl.kz/tours/turkey/">Турция: Мост между мирами</a></h2>
              <p>Всё включено каждый день!</p>
          </div>
          
          <div class="destination">
              <h2>🐼 <a href="https://tmtl.kz/tours/china/">Китай: Откройте для себя новый мир</a></h2>
              <p>Страна, где каждый найдет что-то особенное для себя!</p>
          </div>

          <div class="destination">
              <h2>✈️ <a href="https://tmtl.kz/country/">Все направления: Откройте для себя новый мир</a></h2>
              <p>Более 35 направлений с вылетами из Казахстана</p>
          </div>
          
          <div class="destination">
            <p>Эти страны не просто популярны - они изменят вашу жизнь! Каждое путешествие - это новая глава вашей личной истории. Какую страницу вы хотите написать следующей?</p>
          </div>

          <div class="destination">
            <p class="contacts">Любите путешествовать экономно? Тогда загляните в наш телеграм-канал с горящими турами. Обновления каждый день!</p>
            👉<a href="https://t.me/hottours_krg">Наш телеграм</a>
          </div>

          <div class="destination">
            <p>Остались вопросы? Мы всегда на связи:</p>
            <p class="contacts">☎️ <a href="tel:+77078863633">+7 (707) 886-36-33</a><br>
            <p class="contacts">✉️ <a href="mailto:info@tmtl.kz">info@tmtl.kz</a></p>
            <p class="contacts">📸 <a href="https://www.instagram.com/timetotravel_krg/">Instagram</a><br>
          </div>

          <div class="destination">
              <p>Ваше следующее великое приключение начинается с турагентством "Time to Travel"!</p>
          </div>          
          
          <div class="destination">
            <p>До встречи в аэропорту,<br>
            Команда турагентства "Time to Travel"<br>
            Мустафина 81/3, офис 206, Караганда</p>
          </div>          
      </div>
  </body>
  </html>
`;

module.exports = emailTemplate;