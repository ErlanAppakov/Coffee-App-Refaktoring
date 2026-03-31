# Информация о проекте

## Студент
- **ФИО:** Аппаков Эрлан
- **Дата проверки:** 2026-03-22

## Проект
- **Название:** Coffee App — интернет-магазин кофе и чая
- **Репозиторий:** https://github.com/ErlanAppakov/coffee-app.git
- **Тип:** монорепо (frontend и backend в одном репозитории)

## Стек технологий

### Frontend
- React ^19.1.1
- React DOM ^19.1.1
- TypeScript ^5.9.3
- Redux Toolkit ^2.8.0 (react-redux ^9.2.0)
- React Router DOM ^7.9.1
- Vite ^7.1.2 (с плагином @vitejs/plugin-react-swc ^4.0.0)
- Swiper ^12.0.1
- ESLint ^9.33.0 (eslint-plugin-react-hooks, eslint-plugin-react-refresh)

### Backend
- Node.js + Express ^4.18.2
- TypeScript ^5.9.3
- Mongoose ^8.0.3 (MongoDB)
- bcryptjs ^2.4.3
- cors ^2.8.5
- dotenv ^16.3.1
- tsx ^4.7.0 (запуск TypeScript без компиляции)
- nodemon ^3.0.2

### Инфраструктура
- Docker Compose (MongoDB 7.0)
- Vite dev proxy (`/api` -> `localhost:5001`)

## Структура проекта

```
coffee-app/
├── package.json                    # Frontend зависимости
├── tsconfig.json                   # TypeScript конфиг (frontend)
├── tsconfig.node.json              # TypeScript конфиг (Vite/Node)
├── vite.config.ts                  # Конфигурация Vite (proxy на backend)
├── index.html                      # Точка входа HTML
├── docker-compose.yml              # MongoDB 7.0 в Docker
├── README.md                       # Документация проекта
├── MONGODB_SETUP.md                # Инструкция по настройке MongoDB
├── data/                           # JSON-данные для импорта в MongoDB
│   ├── BlogCoffeeData.json
│   ├── catalog-products-list.json
│   ├── faq.json
│   ├── hero-content.json
│   ├── products.json
│   └── users.json
├── src/                            # Frontend (React)
│   ├── main.tsx                    # Точка входа приложения
│   ├── App.tsx                     # Корневой компонент
│   ├── App.css / index.css         # Глобальные стили
│   ├── components/                 # Переиспользуемые компоненты
│   │   ├── admin-route/
│   │   ├── content/
│   │   ├── footer/
│   │   ├── header/
│   │   ├── logo/
│   │   ├── modal/
│   │   ├── private-route/
│   │   └── product-card/
│   ├── pages/                      # Страницы
│   │   ├── home/
│   │   ├── products-page/
│   │   ├── ProductsDetail/
│   │   ├── cart/
│   │   ├── account/
│   │   ├── admin/
│   │   ├── blog/
│   │   └── contacts/
│   ├── services/                   # API-сервис
│   │   └── api.ts
│   ├── store/                      # Redux store
│   │   ├── store.ts
│   │   └── slices/
│   │       ├── cartSlice.ts
│   │       ├── modalSlice.ts
│   │       ├── searchSlice.ts
│   │       └── userSlice.ts
│   └── images/                     # Статические изображения
└── server/                         # Backend (Express)
    ├── package.json                # Backend зависимости
    ├── tsconfig.json               # TypeScript конфиг (backend)
    ├── index.ts                    # Точка входа сервера
    ├── .env.example                # Шаблон переменных окружения
    ├── config/
    │   └── database.ts             # Конфигурация подключения к MongoDB
    ├── models/                     # Mongoose-модели
    │   ├── Product.ts
    │   ├── User.ts
    │   ├── Catalog.ts
    │   ├── Blog.ts
    │   ├── FAQ.ts
    │   └── Hero.ts
    ├── controllers/                # Контроллеры
    │   ├── productController.ts
    │   ├── userController.ts
    │   ├── catalogController.ts
    │   ├── blogController.ts
    │   ├── faqController.ts
    │   └── heroController.ts
    ├── routes/                     # Маршруты API
    │   ├── productRoutes.ts
    │   ├── userRoutes.ts
    │   ├── catalogRoutes.ts
    │   ├── blogRoutes.ts
    │   ├── faqRoutes.ts
    │   └── heroRoutes.ts
    └── scripts/                    # Утилиты
        ├── importData.ts           # Импорт данных из JSON в MongoDB
        └── updatePassword.ts       # Обновление пароля пользователя
```

## Дополнительно
- **Docker:** есть (docker-compose.yml — MongoDB 7.0 с healthcheck, volume, отдельной сетью)
- **CI/CD:** нет (отсутствует .github/workflows)
- **README:** подробный, хорошо структурированный. Содержит описание стека, инструкции по установке и запуску, структуру проекта, описание функционала (каталог, корзина, заказы, админ-панель), скрипты, решение проблем. Написан на русском языке.
- **.env.example:** есть (в папке server/)
- **JWT:** не обнаружен в зависимостях (отсутствует jsonwebtoken). Авторизация реализована через bcryptjs, но без токенов JWT.
- **Дополнительная документация:** MONGODB_SETUP.md — отдельная инструкция по настройке MongoDB
