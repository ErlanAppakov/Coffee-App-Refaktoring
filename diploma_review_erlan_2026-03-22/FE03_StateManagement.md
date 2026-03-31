# FE03: State Management

## Оценка: 6/10

## Чеклист

- [x] Redux/RTK установлен и настроен (`@reduxjs/toolkit` 2.8.0, `react-redux` 9.2.0)
- [x] Store создан и подключён к приложению (Provider в `main.tsx`)
- [x] Есть слайсы (createSlice) — 4 штуки: `cartSlice`, `userSlice`, `modalSlice`, `searchSlice`
- [x] Используются reducers для синхронных действий (addToCart, removeFromCart, updateQuantity, clearCart, logout, openModal, closeModal и др.)
- [x] Используются async thunks (createAsyncThunk) для API-вызовов — `loginUser`, `registerUser` в `userSlice`
- [ ] Селекторы для доступа к state — нет выделенных селекторов, везде инлайновые `(state: RootState) => state.xxx`
- [x] useSelector/useDispatch используются в компонентах (App, ControlPanel, Modal, CartPage, AccountPage, ProductDetail и др.)
- [ ] Нормализация данных — не реализована

## Что реализовано хорошо

- Store грамотно сконфигурирован через `configureStore` с 4 редьюсерами, экспортированы типы `RootState` и `AppDispatch`
- `userSlice` — наиболее проработанный слайс: содержит `createAsyncThunk` для login и register, полноценную обработку `extraReducers` с тремя состояниями (pending/fulfilled/rejected), хранит `loading` и `error` в state
- `cartSlice` — содержит осмысленную бизнес-логику: добавление с учётом дублей (по id + weight), обновление количества, очистка; типизирован через интерфейсы `CartItem` и `CartState`
- useSelector/useDispatch активно используются в компонентах: авторизация, корзина, модальное окно, поиск — все управляются через Redux
- Часть компонентов корректно типизирует dispatch через `useDispatch<AppDispatch>()`

## Что нужно улучшить

- **Побочные эффекты в редьюсерах**: и `cartSlice`, и `userSlice` вызывают `localStorage.setItem`/`removeItem` прямо внутри reducers и extraReducers — это нарушает принцип чистоты редьюсеров. Следует вынести persistence в middleware (redux-persist или кастомный middleware)
- **Отсутствие слайсов для основных данных**: продукты, каталог, FAQ, блог, hero — всё загружается напрямую через `useState` + API-вызовы в компонентах, минуя Redux. AdminPage полностью управляет товарами и пользователями через локальный state. Это обесценивает использование Redux — глобальный store хранит лишь малую часть данных приложения
- **Нет типизированных хуков**: не созданы `useAppSelector` и `useAppDispatch` — часть компонентов использует `useDispatch()` без типа `AppDispatch`, что приводит к потере типизации при dispatch async thunks
- **Нет выделенных селекторов**: все обращения к state — инлайновые стрелочные функции `(state: RootState) => state.user`, без `createSelector` или хотя бы экспортированных функций-селекторов. Это делает невозможной мемоизацию и усложняет рефакторинг
- **Тривиальные слайсы**: `searchSlice` (boolean `isOpen`) и `modalSlice` (boolean + string) хранят UI-состояние, которое не нужно глобально — могло бы управляться через `useState` или контекст
- **Нет async thunks для CRUD**: операции с продуктами (создание, редактирование, удаление), заказами, профилем пользователя выполняются через прямые API-вызовы в компонентах без использования thunks, что приводит к дублированию логики загрузки/ошибок
- **Дублирование логики восстановления сессии**: загрузка пользователя из localStorage дублируется в `App.tsx`, `PrivateRoute`, `AdminRoute` и `CartPage` — вместо единой точки инициализации
