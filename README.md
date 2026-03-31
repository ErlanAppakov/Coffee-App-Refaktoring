# Coffee App

Интернет-магазин кофе и чая с полным функционалом корзины, заказов и админ-панелью.

## 🚀 Технологии

### Frontend
- React 19
- TypeScript
- Redux Toolkit
- React Router
- Vite

### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- bcryptjs

## 📋 Требования

- Node.js 18+ 
- Docker и Docker Compose (для MongoDB)
- npm или yarn

## 🛠️ Установка и запуск

### 1. Клонирование репозитория

```bash
git clone <url-вашего-репозитория>
cd coffee-app
```

### 2. Установка зависимостей

```bash
npm install
cd server
npm install
cd ..
```

### 3. Настройка MongoDB

Запустите MongoDB через Docker:

```bash
docker-compose up -d
```

Проверьте, что контейнер запущен:

```bash
docker ps
```

### 4. Настройка переменных окружения

Скопируйте файл `.env.example` в `.env`:

```bash
cd server
cp .env.example .env
```

Файл `.env.example` уже содержит необходимые переменные. При необходимости отредактируйте `.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/coffee-app
PORT=5001
NODE_ENV=development
```

**Важно:** Файл `.env` не коммитится в репозиторий для безопасности. Используйте `.env.example` как шаблон.

### 5. Импорт данных в MongoDB

```bash
cd server
npm run import
```

Это импортирует все данные из папки `data/` в MongoDB.

### 6. Запуск проекта

#### Запуск backend сервера:

```bash
cd server
npm run dev
```

Сервер запустится на `http://localhost:5001`

#### Запуск frontend (в новом терминале):

```bash
npm run dev
```

Приложение откроется на `http://localhost:5173`

## 📁 Структура проекта

```
coffee-app/
├── data/                    # JSON файлы с данными для импорта
├── server/                  # Backend приложение
│   ├── config/             # Конфигурация (база данных)
│   ├── controllers/        # Контроллеры API
│   ├── models/             # Mongoose модели
│   ├── routes/             # API маршруты
│   ├── scripts/            # Скрипты (импорт данных, обновление паролей)
│   └── index.ts            # Точка входа сервера
├── src/                     # Frontend приложение
│   ├── components/         # React компоненты
│   ├── pages/              # Страницы приложения
│   ├── services/           # API сервисы
│   ├── store/              # Redux store и slices
│   └── main.tsx            # Точка входа приложения
└── docker-compose.yml       # Конфигурация MongoDB
```

## 🔑 Админ-панель

Для доступа к админ-панели нужен пользователь с ролью `admin`.

### Создание админа через скрипт:

```bash
cd server
npm run update-password admin@millor.ru ваш_пароль
```

Затем в MongoDB Compass измените роль пользователя на `admin`:
- Откройте коллекцию `users`
- Найдите пользователя по email
- Измените поле `role` на `"admin"`

### Функционал админ-панели:

- Управление товарами (добавление, редактирование, удаление)
- Управление пользователями (сброс паролей, изменение ролей)
- Все изменения видны всем пользователям сразу

## 🛒 Основной функционал

- ✅ Каталог товаров с категориями
- ✅ Поиск товаров
- ✅ Корзина покупок
- ✅ Оформление заказов
- ✅ Личный кабинет
- ✅ История заказов
- ✅ Система скидок
- ✅ Админ-панель

## 📝 Скрипты

### Frontend:
- `npm run dev` - запуск dev сервера
- `npm run build` - сборка для production
- `npm run preview` - предпросмотр production сборки

### Backend:
- `npm run dev` - запуск dev сервера с hot reload
- `npm run build` - компиляция TypeScript
- `npm run start` - запуск production сервера
- `npm run import` - импорт данных в MongoDB
- `npm run update-password <email> <password>` - обновление пароля пользователя

## 🔧 Настройка MongoDB

Если MongoDB не запускается через Docker:

1. Убедитесь, что Docker Desktop запущен
2. Проверьте порт 27017 (должен быть свободен)
3. Проверьте логи: `docker-compose logs`

Альтернативно, можно использовать локальный MongoDB:
- Установите MongoDB локально
- Измените `MONGODB_URI` в `.env` файле

## 🐛 Решение проблем

### Backend не подключается к MongoDB:
- Проверьте, что Docker контейнер запущен: `docker ps`
- Проверьте порт в `.env` файле (должен быть 27017)
- Перезапустите контейнер: `docker-compose restart`

### Ошибки при импорте данных:
- Убедитесь, что MongoDB запущен
- Проверьте формат JSON файлов в папке `data/`
- Попробуйте удалить старые данные и импортировать заново

### Проблемы с зависимостями:
- Удалите `node_modules` и `package-lock.json`
- Выполните `npm install` заново

## 📄 Лицензия

ISC

## 📚 Дополнительная документация

- [MONGODB_SETUP.md](./MONGODB_SETUP.md) - Подробная инструкция по настройке MongoDB
- [server/README.md](./server/README.md) - Документация по backend API

## ⚠️ Важные замечания

- Убедитесь, что Docker Desktop запущен перед запуском `docker-compose up -d`
- Файл `.env` должен быть создан вручную в папке `server/`
- После клонирования проекта обязательно выполните `npm install` в корне и в папке `server/`
- Импорт данных (`npm run import`) нужно выполнить после первого запуска MongoDB

## 🎯 Быстрый старт

```bash
# 1. Клонировать репозиторий
git clone <ваш-репозиторий>
cd coffee-app

# 2. Установить зависимости
npm install
cd server && npm install && cd ..

# 3. Запустить MongoDB
docker-compose up -d

# 4. Создать .env файл
cd server
cp .env.example .env
cd ..

# 5. Импортировать данные
cd server && npm run import && cd ..

# 6. Запустить backend (в одном терминале)
cd server && npm run dev

# 7. Запустить frontend (в другом терминале)
npm run dev
```

## 👤 Автор

Coffee App Team

