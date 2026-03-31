# CQ01: Качество кода

## Оценка: 5/10

## Чеклист

- [x] Осмысленные имена переменных и функций
- [ ] Нет магических чисел/строк (вынесены в константы)
- [ ] DRY — нет дублирования кода
- [ ] Функции не превышают 30-40 строк
- [ ] Нет закомментированного кода
- [x] Нет console.log в production-коде — частично, есть отладочные console.log
- [ ] Единый стиль кода (отступы, кавычки, точки с запятой)
- [ ] Чистый, читаемый код

## Что реализовано хорошо

- Имена переменных и функций в целом осмысленные и понятные: `handleAddProduct`, `calculateSubtotal`, `handleRemoveItem`, `fetchProducts`, `calculateOrdersTotal` — по названию понятно назначение
- API-сервис (`services/api.ts`) хорошо структурирован — единая функция `fetchAPI` с централизованной обработкой ошибок, группировка по доменам (`usersAPI`, `productsAPI`, `catalogAPI`)
- Redux-слайсы (`cartSlice.ts`, `userSlice.ts`) написаны аккуратно, с корректным использованием `createAsyncThunk` и `PayloadAction`
- Бэкенд-контроллеры следуют единому паттерну: try/catch, проверка входных данных, корректные HTTP-коды ответов
- Mongoose-модели (`User.ts`, `Product.ts`) хорошо типизированы с интерфейсами
- CSS Modules используются повсеместно, что предотвращает конфликты стилей

## Что нужно улучшить

- **Грубое нарушение DRY — дублирование интерфейсов:** интерфейсы `Product`, `CategoryData`, `ProductsData` определены идентично в трёх файлах (`AdminPage.tsx`, `products.tsx`, `productDetail.tsx`). Их необходимо вынести в общий файл типов
- **Грубое нарушение DRY — дублирование функции `generateProducts`:** функция на ~65 строк полностью скопирована из `products.tsx` в `productDetail.tsx` без изменений. Должна быть вынесена в общий модуль
- **Монструозные компоненты:** `AdminPage.tsx` — 569 строк, `AccountPage.tsx` — 416 строк, `products.tsx` — 367 строк, `cart.tsx` — 348 строк. Каждый из них совмещает логику, состояние и рендеринг. Необходимо декомпозировать на более мелкие компоненты
- **Магические числа и строки:** `0.1` (скидка 10%) жёстко прописана в `cart.tsx` строки 29, 40, 193; значение `7 * 1024 * 1024` (лимит 7MB) в `AccountPage.tsx`; `"src/images/discount-1.png"` как fallback-изображение повторяется в 5+ файлах; пороги скидок `10000`, `20000` в `AccountPage.tsx`; число `40` (количество генерируемых продуктов) в `products.tsx` и `productDetail.tsx`
- **Отладочные console.log в production-коде:** `console.log("Товар сохранен в базу данных:", result)` в `AdminPage.tsx:188`; `console.log('✅ Изображение загружено:', buttonImagePath)` в `products.tsx:329`; отладочные `console.error` для изображений кнопок в `products.tsx:323-326`
- **Использование `any`:** обнаружено ~20 случаев использования типа `any` — в `api.ts` (`userData: any`, `data: any`), `userSlice.ts` (`orders: any[]`), `discount-section.tsx` (`productsDb: any`), `control-panel.tsx` (`product: any`), ошибки типизированы как `error: any` вместо `unknown`
- **Inline-стили вместо CSS:** в `cart.tsx` (строки 157-159) и `discount-section.tsx` (строка 71), `faq.tsx`, `catalog-home-page.tsx` используются inline-стили с захардкоженными значениями `padding`, `fontSize`, `color`
- **Непоследовательный нейминг файлов:** `AdminPage.tsx` и `AccountPage.tsx` в PascalCase, но `cart.tsx`, `contacts.tsx`, `blog.tsx` в kebab-case; папка `ProductsDetail` в PascalCase, остальные в kebab-case; `privateRoute.tsx` начинается со строчной буквы
- **Дублирование логики восстановления сессии из localStorage:** одинаковая логика `JSON.parse(localStorage.getItem("currentUser"))` присутствует в `App.tsx`, `cart.tsx`, `privateRoute.tsx`, `AdminRoute.tsx`, `userSlice.ts`
- **Опечатка в названии функции:** `ativeBtnFunc` в `contacts.tsx` (должно быть `activeBtnFunc`)
- **Дублирование паттерна image fallback:** одинаковый `onError` обработчик с `'/src/images/discount-1.png'` повторяется в 5+ компонентах
