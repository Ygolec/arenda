# Разработка веб-приложения для аренды и сдачи внаём жилья
В данной работе представлено приложение для аренды и сдачи внаём жилья. Приложение представляет собой веб-сайт, который позволяет пользователям размещать объявления о сдаче или аренде жилья. Пользователи могут просматривать объявления, оставлять комментарии и связываться с авторами объявлений. Приложение предоставляет возможность регистрации и авторизации пользователей, а также администрирования объявлений. Приложение построено на CMS(Directus) и языка программирования TypeScript с использованием фреймфорков Vue 3 и Nuxt 3.

## Содержание

## Технологии
- [Directus](https://github.com/directus/directus) - CMS система
- [TypeScript](https://www.typescriptlang.org/)
- [Vue 3](https://v3.vuejs.org/)
- [Nuxt 3](https://v3.nuxtjs.org/)
- [Vuetify](https://vuetifyjs.com/) - Библиотека с визуальными компонентами
- [nuxt-directus](https://github.com/Intevel/nuxt-directus) - Плагин для работы с Directus
- [vcalendar](https://vcalendar.io/) - Календарь сторонний
- [vue-yandex-maps](https://github.com/yandex-maps-unofficial/vue-yandex-maps) - Оболочка для работы с Яндекс картами

## Использование
В данной работе отсутвуют данные базы данных. 

Для установки зависимостей, выполните команду:
```sh
$ npm i 
```

И добавьте в свой проект .env файл с переменными окружения:
```sh
DIRECTUS_TOKEN="secret"
API_YANDEX_GEOCODER="secret"
EMAIL_SMTP_PASSWORD="secret" *Опционально
```

## Разработка

### Требования
Для установки и запуска проекта, необходим 
- [NodeJS](https://nodejs.org/) v20+
- [Docker](https://www.docker.com/)


### Установка зависимостей
Для установки зависимостей, выполните команду:
```sh
$ npm i
```

### Запуск Development сервера
Запустить docker контейнер с Directus и PostgreSQL, выполните команду:
```sh
docker-compose up
```
Чтобы запустить сервер для разработки, выполните команду:
```sh
npm run dev
```

### Создание билда
Чтобы выполнить production сборку, выполните команду:
```sh
npm run build
```

## FAQ

### Зачем вы разработали этот проект?
В качестве учебных целей

## Команда проекта

- Чистобаев Даниил thekevindit@gmail.com
