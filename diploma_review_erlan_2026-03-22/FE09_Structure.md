# FE09: Структура Frontend

## Оценка: 6/10

## Чеклист

- [x] Логичная структура папок (components/, pages/, store/, services/)
- [ ] Компоненты в отдельных папках с CSS
- [x] Разделение на pages и components
- [x] Store в отдельной папке с slices
- [x] API-вызовы вынесены в отдельный модуль (services/api)
- [ ] Нет бизнес-логики в компонентах представления
- [ ] Консистентное именование файлов

## Что реализовано хорошо

- Корневая структура `src/` логична и содержит правильное разделение на ключевые директории: `components/`, `pages/`, `store/`, `services/`, `images/`
- Store организован по паттерну Redux Toolkit с отдельной папкой `slices/` и четырьмя слайсами (`cartSlice.ts`, `userSlice.ts`, `modalSlice.ts`, `searchSlice.ts`), корневой `store.ts` экспортирует типы `RootState` и `AppDispatch`
- API-слой полностью вынесен в единый файл `services/api.ts` с централизованной функцией `fetchAPI` и группировкой по доменам (`usersAPI`, `productsAPI`, `faqAPI`, `blogAPI`, `heroAPI`, `catalogAPI`)
- Страница `home` имеет собственную папку `components/` с подкомпонентами (`hero/`, `benefits/`, `bean-to-cup/`, `catalog-home-page/`, `discount-section/`, `news/`) — хороший пример композиции на уровне страницы
- Общие UI-компоненты (`header/`, `footer/`, `modal/`, `logo/`, `product-card/`) вынесены в `components/` и содержат CSS-модули рядом с компонентами
- Компонент `header/` имеет вложенную структуру с подкомпонентами `control-panel/` и `menu/`

## Что нужно улучшить

- **Неконсистентное именование файлов и папок:** смешаны стили — `ProductsDetail/` (PascalCase папка) vs `products-page/` (kebab-case), `AccountPage.tsx` (PascalCase файл) vs `cart.tsx` (lowercase), `AdminRoute.tsx` vs `privateRoute.tsx` (camelCase), `Header.tsx` vs `footer.tsx`. Нужно выбрать единый стиль и придерживаться его
- **Не все компоненты имеют CSS-модули рядом с собой:** папки `admin-route/`, `content/`, `logo/`, `product-card/` не содержат собственных CSS-файлов. Компонент `product-card` импортирует стили из `pages/products-page/products.module.css`, что нарушает инкапсуляцию
- **Бизнес-логика в компонентах-страницах:** `AdminPage.tsx` (~570 строк) содержит всю CRUD-логику для товаров и пользователей прямо внутри компонента. `cart.tsx` (~350 строк) содержит расчёты стоимости, логику доставки и оформления заказа. `products.tsx` содержит функцию `generateProducts` (генерация 40 товаров) прямо в файле страницы — это утилитарная логика, которую следует вынести
- **Дублирование кода:** функция `generateProducts` дублируется полностью в `products.tsx` и `productDetail.tsx`. Интерфейсы `Product`, `CategoryData`, `ProductsData` определены заново в нескольких файлах вместо вынесения в общий файл типов
- **Нет папки `types/` или `interfaces/`:** одни и те же интерфейсы (`Product`, `CategoryData`, `ProductsData`, `User`) переобъявляются в `AdminPage.tsx`, `products.tsx`, `productDetail.tsx`
- **Нет папки `hooks/`:** пользовательские хуки не выделены (типизированные `useDispatch`/`useSelector` могли бы быть в `hooks/useAppDispatch.ts`)
- **Нет папки `utils/` или `helpers/`:** утилитарные функции (генерация товаров, расчёт скидок, склонение слов) размещены внутри компонентов
- **Компонент `Content` по сути является маршрутизатором** (`content.tsx`), но не несёт в имени этой роли и размещён в `components/`, хотя не является переиспользуемым UI-компонентом
