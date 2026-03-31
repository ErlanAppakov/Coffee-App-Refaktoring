# FE08: Кастомные хуки

## Оценка: 2/10

## Чеклист

- [ ] Есть кастомные хуки (useXxx)
- [ ] Хуки извлекают повторяющуюся логику
- [ ] Хуки используют стандартные хуки (useState, useEffect, etc.)
- [ ] Хуки используются в нескольких компонентах
- [ ] Хуки имеют чистый API (параметры → возвращаемое значение)
- [ ] Типизированные хуки useAppSelector/useAppDispatch (для Redux)

## Что реализовано хорошо

- Стандартные хуки React (useState, useEffect, useRef, useNavigate, useParams) используются корректно и повсеместно
- В компоненте control-panel.tsx реализован паттерн debounce-поиска и клик вне области через useEffect — логика рабочая, но не вынесена в хук

## Что нужно улучшить

- В проекте полностью отсутствуют кастомные хуки — нет ни одного файла или функции вида `useXxx`
- Нет типизированных Redux-хуков `useAppSelector`/`useAppDispatch`: во всех компонентах (~12 файлов) используются сырые `useSelector` и `useDispatch` с повторяющимся inline-приведением типов `useDispatch<AppDispatch>()` и `(state: RootState) => state.user`
- Паттерн загрузки данных (useState + useEffect + loading + try/catch + setLoading(false)) дублируется минимум в 7 компонентах (hero.tsx, catalog-home-page.tsx, blog.tsx, faq.tsx, products.tsx, productDetail.tsx, AdminPage.tsx) — идеальный кандидат для хука `useFetch` или `useAsync`
- Логика обнаружения клика вне области в control-panel.tsx (addEventListener/removeEventListener на mousedown) — классический кандидат для хука `useClickOutside`
- Debounce-логика поиска в control-panel.tsx (setTimeout/clearTimeout) — классический кандидат для хука `useDebounce`
- Повторяющийся селектор `useSelector((state: RootState) => state.user)` в 6+ компонентах — стоит вынести в `useAuth` или аналогичный хук
- Функция `generateProducts` дублируется целиком в products.tsx и productDetail.tsx (~70 строк копипасты) — можно вынести в утилиту или хук
