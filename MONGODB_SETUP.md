# Инструкция по подключению MongoDB и Backend

## ✅ Шаг 1: Запуск MongoDB в Docker

```bash
docker-compose up -d
```

Проверьте статус:
```bash
docker ps | grep mongodb
```

Подождите 5-10 секунд для полной инициализации MongoDB.

## ✅ Шаг 2: Подключение через MongoDB Compass

1. Откройте **MongoDB Compass**
2. В строке подключения введите (БЕЗ аутентификации):
   ```
   mongodb://localhost:27017
   ```
3. Нажмите **Connect**

**Или используйте параметры:**
- Host: `localhost`
- Port: `27017`
- Authentication: `None` (без аутентификации)

## ✅ Шаг 3: Создание базы данных в Compass

После подключения:
1. Нажмите **"Create Database"**
2. Database Name: `coffee-app`
3. Collection Name: `users` (или любое другое)
4. Нажмите **Create**

База данных будет создана автоматически при импорте данных.

## ✅ Шаг 4: Запуск Backend сервера

В первом терминале:
```bash
cd server
npm run dev
```

Вы должны увидеть: `MongoDB Connected: localhost` и `Server is running on port 5001`

## ✅ Шаг 5: Импорт данных

В **новом терминале** (оставьте backend запущенным):
```bash
cd server
npm run import
```

Вы должны увидеть сообщения о импорте:
- Users imported successfully
- Products imported successfully
- FAQ imported successfully
- и т.д.

## ✅ Шаг 6: Проверка подключения

Проверьте, что backend работает:
```bash
curl http://localhost:5001/api/health
```

Должен вернуться: `{"status":"OK","message":"Server is running"}`

Проверьте данные:
```bash
curl http://localhost:5001/api/catalog
curl http://localhost:5001/api/hero
```

## ✅ Шаг 7: Запуск Frontend

В **третьем терминале** (из корня проекта):
```bash
npm run dev
```

Откройте браузер: **http://localhost:5173**

Теперь все данные должны загружаться!

## 🔧 Решение проблем

### Если backend не подключается к MongoDB:

1. Проверьте, что MongoDB запущен:
   ```bash
   docker ps | grep mongodb
   ```

2. Проверьте логи MongoDB:
   ```bash
   docker logs coffee-app-mongodb
   ```

3. Перезапустите MongoDB:
   ```bash
   docker-compose restart
   ```

### Если импорт не работает:

1. Убедитесь, что backend НЕ запущен во время импорта (или используйте другой терминал)
2. Проверьте, что JSON файлы существуют в корне проекта:
   - `users.json`
   - `products.json`
   - `faq.json`
   - `BlogCoffeeData.json`
   - `hero-content.json`
   - `catalog-products-list.json`

### Проверка данных в MongoDB Compass:

После импорта вы должны увидеть коллекции:
- `users`
- `products`
- `faqs`
- `blogs`
- `heroes`
- `catalogs`

