# BE01: REST API

## Оценка: 5/10

## Чеклист

- [x] RESTful маршруты (GET, POST, PUT/PATCH, DELETE)
- [ ] Правильные HTTP-методы для операций
- [x] Правильные статус-коды (200, 201, 400, 401, 404, 500)
- [x] JSON-ответы в едином формате
- [x] Роутер Express (express.Router())
- [ ] CRUD-эндпоинты для основных сущностей
- [x] Параметры маршрутов (:id)
- [ ] Query-параметры (фильтрация, пагинация) — если есть

## Что реализовано хорошо

- Используется `express.Router()` во всех 6 файлах маршрутов: `userRoutes`, `productRoutes`, `faqRoutes`, `blogRoutes`, `heroRoutes`, `catalogRoutes`
- Префикс `/api/` для всех маршрутов — правильная структура URL
- 6 групп ресурсов с логичным именованием: `/api/users`, `/api/products`, `/api/faq`, `/api/blog`, `/api/hero`, `/api/catalog`
- Параметры маршрутов `:id` и `:category` используются корректно
- Ответы возвращаются в формате JSON последовательно через `res.json()`
- Для `users` реализован наиболее полный набор операций: GET (один/все), POST (register/login/order), PUT (update/role), DELETE (clearOrders) — задействованы 4 HTTP-метода
- Catalog имеет фильтрацию по категории через параметр маршрута: `GET /api/catalog/category/:category`
- Есть health-check эндпоинт `GET /api/health`

## Что нужно улучшить

- **Неполный CRUD для большинства сущностей:** Blog, FAQ, Hero, Product, Catalog — имеют только GET и POST, полностью отсутствуют PUT/PATCH и DELETE. Нельзя обновить или удалить отдельную запись FAQ, Hero, Catalog
- **Неправильные HTTP-методы для мутирующих операций:**
  - `POST /api/users/:id/change-password` — изменение существующего ресурса должно быть PUT/PATCH, а не POST
  - `POST /api/users/:id/reset-password` — аналогично, модификация ресурса, не создание
  - `POST /api/blog` выполняет `findOneAndUpdate` с upsert — семантически это PUT (создание или полная замена), а не POST
  - `POST /api/products` выполняет `findOneAndUpdate` с upsert — та же проблема
- **Отсутствует пагинация:** ни один GET-эндпоинт не поддерживает query-параметры `page`, `limit`, `offset`. Списковые эндпоинты возвращают все записи без ограничений
- **Отсутствует фильтрация через query-параметры:** фильтрация по категории реализована через path-параметр (`/category/:category`), но нет поддержки query-строки (`?category=X&sort=Y`)
- **Неоднозначные маршруты:** в `productRoutes` маршрут `GET /:category` может конфликтовать с потенциальным `GET /:id`, так как Express не может различить их
- **`createOrUpdateBlog` и `createOrUpdateProducts` нарушают принцип единственной ответственности эндпоинта** — один POST-маршрут выполняет и создание, и обновление, что не соответствует REST-семантике (POST — создание, PUT — полная замена, PATCH — частичное обновление)
- **Нет валидации входных данных на уровне маршрутов** (middleware валидации): данные из `req.body` передаются напрямую в Mongoose без предварительной проверки в большинстве контроллеров (кроме `userController`, где есть базовые проверки)
