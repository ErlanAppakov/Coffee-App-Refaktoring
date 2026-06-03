# 🚀 Руководство по деплою Coffee App

## 📋 Содержание

1. [Обзор проекта](#обзор-проекта)
2. [Технологический стек](#технологический-стек)
3. [Архитектура приложения](#архитектура-приложения)
4. [Подготовка к деплою](#подготовка-к-деплою)
5. [Деплой на VPS/сервер](#деплой-на-vpsсервер)
6. [Деплой с Docker Compose](#деплой-с-docker-compose)
7. [Настройка переменных окружения](#настройка-переменных-окружения)
8. [Миграция данных](#миграция-данных)
9. [Настройка SSL/HTTPS](#настройка-sslhttps)
10. [Мониторинг и логирование](#мониторинг-и-логирование)
11. [Решение проблем](#решение-проблем)

---

## Обзор проекта

**Coffee App** — это интернет-магазин кофе и чая с полным функционалом:

- ✅ Каталог товаров с категориями
- ✅ Поиск и фильтрация товаров
- ✅ Корзина покупок
- ✅ Оформление заказов
- ✅ Личный кабинет пользователя
- ✅ История заказов
- ✅ Система скидок
- ✅ Админ-панель для управления
- ✅ Блог и FAQ
- ✅ Система аутентификации и авторизации

---

## Технологический стек

### Frontend
| Технология | Версия | Назначение |
|------------|--------|------------|
| React | 19.1.1 | UI библиотека |
| TypeScript | 5.9.3 | Типизация |
| Redux Toolkit | 2.8.0 | Управление состоянием |
| React Router | 7.9.1 | Маршрутизация |
| React Toastify | 11.0.5 | Уведомления |
| Swiper | 12.0.1 | Слайдеры |
| Vite | 7.1.2 | Сборщик |

### Backend
| Технология | Версия | Назначение |
|------------|--------|------------|
| Node.js | 20+ | Runtime environment |
| Express | 4.18.2 | Web framework |
| TypeScript | 5.9.3 | Типизация |
| MongoDB | 7.0 | База данных |
| Mongoose | 8.0.3 | ODM |
| bcryptjs | 2.4.3 | Хеширование паролей |
| jsonwebtoken | 9.0.3 | Аутентификация |

### DevOps
| Технология | Версия | Назначение |
|------------|--------|------------|
| Docker | latest | Контейнеризация |
| Docker Compose | latest | Оркестрация |
| Nginx | latest | Reverse proxy |

---

## Архитектура приложения

```
┌─────────────────────────────────────────────────────────────────┐
│                        Nginx (Port 80)                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Frontend (React) - Static files                         │   │
│  │  Backend API (/api) - Proxy to backend:5001             │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    Docker Network (coffee-app-network)          │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │   Frontend   │──────│   Backend    │──────│   MongoDB    │  │
│  │  (Port 80)   │      │ (Port 5001)  │      │ (Port 27017) │  │
│  └──────────────┘      └──────────────┘      └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Структура API

| Метод | Эндпоинт | Описание | Auth |
|-------|----------|----------|------|
| POST | `/api/users/register` | Регистрация | Нет |
| POST | `/api/users/login` | Вход | Нет |
| GET | `/api/users/:id` | Профиль | Да |
| PATCH | `/api/users/:id` | Обновить профиль | Да |
| PATCH | `/api/users/:id/change-password` | Сменить пароль | Да |
| POST | `/api/users/:id/orders` | Создать заказ | Да |
| GET | `/api/products` | Список товаров | Нет |
| GET | `/api/products/:category` | Товары категории | Нет |
| POST | `/api/products` | Обновить товары | Admin |
| GET | `/api/faq` | Вопросы и ответы | Нет |
| GET | `/api/blog` | Статьи блога | Нет |
| GET | `/api/hero` | Hero секция | Нет |
| GET | `/api/catalog` | Каталог | Нет |

---

## Подготовка к деплою

### 1. Проверка зависимостей

Убедитесь, что все зависимости установлены:

```bash
# В корне проекта
npm install

# В папке server
cd server && npm install && cd ..
```

### 2. Сборка frontend

```bash
npm run build
```

После сборки в корне появится папка `dist/` с production версией.

### 3. Сборка backend

```bash
cd server
npm run build
cd ..
```

После сборки в папке `server/` появится папка `dist/`.

---

## Деплой на VPS/сервер

### Вариант A: Docker Compose (Рекомендуется)

#### 1. Подготовка сервера

Установите Docker и Docker Compose:

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Перезагрузите терминал или выполните
newgrp docker
```

#### 2. Копирование проекта

```bash
# Скопируйте проект на сервер
scp -r /path/to/Coffee-App-Refaktoring user@server:/opt/coffee-app
```

#### 3. Настройка переменных окружения

Создайте файл `.env` в папке `server/`:

```bash
cd server
touch .env
```

Содержимое `.env`:

```env
# MongoDB
MONGODB_URI=mongodb://mongodb:27017/coffee-app

# Server
PORT=5001
NODE_ENV=production

# JWT
JWT_SECRET=ваш_супер_секретный_ключ_здесь_минимум_32_символа
```

#### 4. Запуск

```bash
# Запустить все сервисы
docker-compose up -d

# Проверить статус
docker-compose ps

# Посмотреть логи
docker-compose logs -f
```

#### 5. Импорт данных

```bash
# Войти в контейнер backend
docker-compose exec backend sh

# Импортировать данные
npm run import

# Выйти
exit
```

---

### Вариант B: Ручной деплой (без Docker)

#### 1. Установка Node.js

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверка
node -v
npm -v
```

#### 2. Установка MongoDB

```bash
# Ubuntu/Debian
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Запуск MongoDB
sudo systemctl enable mongod
sudo systemctl start mongod
```

#### 3. Настройка проекта

```bash
# Клонировать проект
git clone <your-repo-url> /opt/coffee-app
cd /opt/coffee-app

# Установить зависимости
npm install
cd server && npm install && cd ..

# Настроить переменные окружения
cd server
touch .env
# Добавить содержимое .env (см. выше)
cd ..
```

#### 4. Запуск backend

```bash
cd server
npm run build
nohup npm run start > ../backend.log 2>&1 &
echo $! > ../backend.pid
cd ..
```

#### 5. Запуск frontend

```bash
npm run build
nohup npx vite preview --host 0.0.0.0 --port 5173 > ../frontend.log 2>&1 &
echo $! > ../frontend.pid
```

---

## Деплой с Docker Compose

### docker-compose.yml

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    container_name: coffee-app-mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: coffee-app
    volumes:
      - mongodb_data:/data/db
    networks:
      - coffee-app-network
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./server
    container_name: coffee-app-backend
    restart: unless-stopped
    ports:
      - "5001:5001"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/coffee-app
      - PORT=5001
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      mongodb:
        condition: service_healthy
    networks:
      - coffee-app-network

  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: coffee-app-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - coffee-app-network

volumes:
  mongodb_data:

networks:
  coffee-app-network:
    driver: bridge
```

### Dockerfile (Frontend)

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
```

### Dockerfile (Backend)

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5001

CMD ["npm", "run", "start"]
```

---

## Настройка переменных окружения

### server/.env

```env
# ============================================
# MongoDB Configuration
# ============================================
MONGODB_URI=mongodb://mongodb:27017/coffee-app

# ============================================
# Server Configuration
# ============================================
PORT=5001
NODE_ENV=production

# ============================================
# JWT Configuration
# ============================================
JWT_SECRET=ваш_супер_секретный_ключ_здесь_минимум_32_символа

# ============================================
# CORS Configuration (опционально)
# ============================================
# CORS_ORIGIN=https://your-domain.com
```

### .env.example (для репозитория)

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/coffee-app

# Server
PORT=5001
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

---

## Миграция данных

### Импорт начальных данных

```bash
cd server
npm run import
```

Скрипт импортирует данные из папки `data/`:
- `products.json` - товары
- `faq.json` - вопросы и ответы
- `blog.json` - статьи блога
- `hero-content.json` - контент hero секции
- `catalog-products-list.json` - каталог
- `users.json` - пользователи

### Ручной импорт через MongoDB Compass

1. Откройте MongoDB Compass
2. Подключитесь к `mongodb://localhost:27017`
3. Выберите базу данных `coffee-app`
4. Импортируйте JSON файлы в соответствующие коллекции

---

## Настройка SSL/HTTPS

### Вариант 1: Nginx с Let's Encrypt

#### 1. Установка Nginx

```bash
sudo apt-get update
sudo apt-get install nginx
```

#### 2. Настройка Nginx

Создайте конфиг `/etc/nginx/sites-available/coffee-app`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Certificate
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # SSL Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 1000;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5001/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 3. Получение сертификата Let's Encrypt

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

#### 4. Автоматическое обновление сертификата

```bash
sudo systemctl enable certbot.timer
```

### Вариант 2: Docker Compose с Nginx и SSL

```yaml
version: '3.8'

services:
  # ... existing services ...

  nginx:
    image: nginx:alpine
    container_name: coffee-app-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    networks:
      - coffee-app-network

networks:
  coffee-app-network:
    driver: bridge
```

---

## Мониторинг и логирование

### Логирование

#### Backend логи

```bash
# Docker
docker-compose logs -f backend

# Ручной деплой
tail -f backend.log
```

#### Frontend логи

```bash
# Docker
docker-compose logs -f frontend

# Ручной деплой
tail -f frontend.log
```

### Мониторинг состояния

```bash
# Проверить статус контейнеров
docker-compose ps

# Проверить использование ресурсов
docker stats

# Проверить свободное место
df -h

# Проверить использование памяти
free -h
```

### Мониторинг MongoDB

```bash
# Подключиться к MongoDB
docker-compose exec mongodb mongosh

# Проверить статус
db.serverStatus()
db.stats()

# Посмотреть коллекции
show collections
```

---

## Решение проблем

### Проблема: Backend не подключается к MongoDB

**Решение:**
```bash
# Проверить статус контейнеров
docker-compose ps

# Перезапустить MongoDB
docker-compose restart mongodb

# Проверить логи MongoDB
docker-compose logs mongodb

# Проверить подключение
docker-compose exec backend sh
# Внутри контейнера
ping mongodb
```

### Проблема: Port already in use

**Решение:**
```bash
# Найти процесс, занимающий порт
lsof -i :5001
# или
netstat -tulpn | grep :5001

# Остановить процесс
kill -9 <PID>
```

### Проблема: Docker контейнеры не запускаются

**Решение:**
```bash
# Остановить все контейнеры
docker-compose down

# Удалить старые контейнеры
docker rm -f $(docker ps -aq)

# Пересоздать контейнеры
docker-compose up -d --build
```

### Проблема: Ошибки CORS

**Решение:**
Проверьте настройки CORS в `server/index.ts`:

```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
```

### Проблема: Слишком много подключений к MongoDB

**Решение:**
Оптимизируйте подключения в `server/config/database.ts`:

```typescript
const conn = await mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10, // Ограничить пул соединений
});
```

---

## Чеклист перед деплоем

- [ ] Все зависимости установлены (`npm install`)
- [ ] Frontend собран (`npm run build`)
- [ ] Backend собран (`cd server && npm run build`)
- [ ] Переменные окружения настроены (`.env`)
- [ ] MongoDB запущена и доступна
- [ ] Данные импортированы (`npm run import`)
- [ ] Проверен health check (`curl http://localhost:5001/api/health`)
- [ ] Проверена админ-панель
- [ ] Настроен SSL/HTTPS (для production)
- [ ] Настроен мониторинг и логирование
- [ ] Создан резервный копия данных
- [ ] Проверены права доступа к файлам

---

## Полезные команды

```bash
# Остановить все сервисы
docker-compose down

# Запустить все сервисы
docker-compose up -d

# Перезапустить сервис
docker-compose restart backend

# Посмотреть логи
docker-compose logs -f

# Войти в контейнер
docker-compose exec backend sh

# Очистить volume (внимание: удалит данные!)
docker-compose down -v

# Обновить контейнеры
docker-compose pull
docker-compose up -d --build
```

---

## Контакты и поддержка

Если у вас возникли проблемы с деплоем:

1. Проверьте логи (`docker-compose logs`)
2. Убедитесь, что все переменные окружения настроены
3. Проверьте подключение к MongoDB
4. Убедитесь, что порты не заняты

---

**Удачи с деплоем! 🎉**
