# [Social-App] (https://social-app-cyan-zeta.vercel.app) [![Открыть проект](https://img.shields.io/badge/View%20Live-Online-brightgreen?style=for-the-badge&logo=vercel)](https://social-app-cyan-zeta.vercel.app)

---

## Описание проекта

**SocialApp** — это социальное приложение, реализованное на стеке React (фронтенд) и Node.js/Express + MySQL (бэкенд). Проект поддерживает регистрацию и авторизацию пользователей, публикации, поиск по описанию или автору, комментарии, лайки, профили пользователей и возможность отслеживания автора.

---

### Основной стек

- **Фронтенд:** React, Vite, Axios, CSS Modules
- **Бэкенд:** Node.js, Express.js, MySQL

---

### Основная функциональность

- **Аутентификация:** Регистрация, вход, сессии на основе JWT
- **Посты:** Создание, редактирование, удаление, поиск и просмотр постов
- **Комментарии:** Добавление и просмотр комментариев к постам
- **Лайки:** Лайки постов
- **Профили пользователей:** Просмотр, редактирование и отслеживание профилей
- **Адаптивный интерфейс:** Современный, адаптивный дизайн

---

## Структура проекта

- `socailapp-react-mySQL-frontend/` — фронтенд на React (Vite)
- `socailapp-react-mySQL-backend/` — бэкенд на Node.js/Express (MySQL)

---

## Деплой

Приложение развернуто на Vercel по адресу [social-app-cyan-zeta.vercel.app] (https://social-app-cyan-zeta.vercel.app)

---

## Инструкции по локальному запуску

### Фронтенд

```bash
cd socailapp-react-mySQL-frontend
npm install
npm run dev
```

### Бэкенд

```bash
cd socailapp-react-mySQL-backend
npm install
npm start
```

---

## Переменные окружения

### Фронтенд (.env)

```
VITE_API_URL=
VITE_CLOUDINARY_PRESET=
VITE_CLOUDINARY_CLOUD_NAME=
```

### Бэкенд (.env)

```
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
PORT=
```
