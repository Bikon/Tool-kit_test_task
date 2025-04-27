# Tool-kit Test Task

## 📋 Описание проекта

Фронтенд-приложение для поиска репозиториев на GitHub с использованием GraphQL API.

- Поиск репозиториев по названию
- Пагинация результатов
- Карточка репозитория с деталями (языки, описание, владелец, дата последнего коммита)
- Хранение состояния через Effector
- Поддержка SSR-архитектуры

---

## 🚀 Технологии

- Vite + React + TypeScript
- GraphQL (Apollo Client)
- Effector
- React Router
- ESLint + Prettier + Husky + Lint-staged
- Vitest + Playwright (тесты)

---

## 🔥 Установка и запуск

1. Клонировать репозиторий:

```bash
git clone https://github.com/your-username/Tool-kit_test_task.git
cd Tool-kit_test_task
```

2. Установить зависимости:

```bash
npm install
```

3. Создать `.env` файл:

```bash
cp .env.example .env
```

И вставить туда ваш GitHub Personal Access Token:

```bash
VITE_GITHUB_TOKEN=your_personal_token
```

4. Запустить проект в режиме разработки:

```bash
npm run dev
```

Откройте в браузере [http://localhost:5173](http://localhost:5173)

---

## ✅ Скрипты проекта

- `npm run dev` — запуск проекта
- `npm run build` — сборка проекта
- `npm run preview` — предпросмотр сборки
- `npm run lint` — линтинг кода
- `npm run format` — автоформатирование prettier
- `npm run test` — юнит-тесты
- `npm run test:e2e` — e2e-тесты через Playwright

---

## 🤝 Контакты

Разработчик: Ivan Safronov
Email: bikon4ik60@gmail.com