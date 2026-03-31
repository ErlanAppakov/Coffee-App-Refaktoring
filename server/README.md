# Coffee App Backend Server

## Установка зависимостей

Если возникают проблемы с правами доступа к npm кэшу, выполните:

```bash
sudo chown -R $(whoami) ~/.npm
```

Затем установите зависимости:

```bash
npm install
```

## Настройка

1. Создайте файл `.env` в папке `server/` со следующим содержимым:

```
PORT=5000
MONGODB_URI=mongodb://user:mongopass@localhost:27017/coffee-app?authSource=admin
NODE_ENV=development
```

## Запуск

### Импорт данных из JSON в MongoDB

```bash
npm run import
```

### Запуск сервера в режиме разработки

```bash
npm run dev
```

Сервер будет доступен на `http://localhost:5000`

### Запуск сервера в продакшене

```bash
npm start
```

## API Endpoints

- `GET /api/health` - Проверка здоровья сервера
- `GET /api/products` - Все продукты
- `GET /api/products/:category` - Продукты по категории
- `GET /api/faq` - Все FAQ
- `GET /api/blog` - Все методы приготовления кофе
- `GET /api/blog/:id` - Метод по ID
- `GET /api/hero` - Hero контент
- `GET /api/catalog` - Каталог категорий
- `POST /api/users/register` - Регистрация пользователя
- `POST /api/users/login` - Вход пользователя

## Зависимости

- express - веб-фреймворк
- mongoose - ODM для MongoDB
- cors - middleware для CORS
- dotenv - загрузка переменных окружения
- bcryptjs - хеширование паролей
- nodemon - автоматическая перезагрузка сервера (dev)

