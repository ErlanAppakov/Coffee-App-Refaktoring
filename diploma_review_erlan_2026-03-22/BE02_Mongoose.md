# BE02: Mongoose модели

## Оценка: 6/10

## Чеклист

- [x] Модели определены через mongoose.Schema
- [x] Типы полей указаны (String, Number, Schema.Types.Mixed)
- [x] Обязательные поля (required: true) — в User, Catalog, FAQ, Hero
- [ ] Валидация полей — только enum и lowercase, нет minlength/maxlength/match
- [x] Значения по умолчанию (default) — в User (role, phone, avatar, discount) и Product (Mixed-поля)
- [ ] Связи между моделями (ref/ObjectId) — отсутствуют, все данные встроены
- [x] Timestamps (createdAt, updatedAt) — во всех 6 моделях
- [x] Индексы — unique на User.email
- [x] Виртуальные поля или методы — метод comparePassword и pre('save') хук в User

## Что реализовано хорошо

- Все 6 моделей (User, Product, Blog, Catalog, FAQ, Hero) определены через `mongoose.Schema` с TypeScript-интерфейсами (`Document`-расширение), что обеспечивает типобезопасность
- Модель User проработана лучше остальных: `required` на ключевых полях, `enum` для role, `unique`+`lowercase` на email, значения по умолчанию, `pre('save')` хук для хеширования пароля через bcrypt, метод `comparePassword`
- Активно используются вложенные под-схемы (orderItemSchema, orderSchema, categorySchema, contentItemSchema, methodSchema) — структура данных хорошо декомпозирована
- `timestamps: true` включён во всех основных схемах
- В Catalog модели используется `enum` для категории с чётким набором допустимых значений

## Что нужно улучшить

- **Отсутствует валидация полей:** нигде не используются `minlength`, `maxlength`, `match` (regex). Например, email не валидируется regex-паттерном, password не имеет минимальной длины, name не ограничен по длине
- **Нет связей между моделями (ref/ObjectId):** заказы встроены прямо в User как вложенный массив, хотя вынесение Order в отдельную модель со связью `ref: 'Order'` было бы правильнее для масштабируемости и возможности независимого запроса заказов
- **Вложенные схемы без required:** orderItemSchema и orderSchema не имеют `required` ни на одном поле — title, price, status, total могут быть пропущены
- **Product использует Schema.Types.Mixed:** это фактически отключает всю валидацию для products и buttonImages — Mongoose не контролирует структуру данных
- **Blog и её под-схемы без required:** ни methods, ни content не помечены как обязательные; поля title, icon, data в под-схемах также без required
- **Нет индексов помимо unique на email:** для Catalog стоило бы добавить индекс на category, для FAQ — на id
- **Нет виртуальных полей:** например, fullName для User или computed-поля для подсчёта количества заказов
