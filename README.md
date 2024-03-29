# Brl Edu

Интерактивная система проверки знаний [BrdEdu](https://brl-edu.netlify.app/)

## Ссылки

- Сайт: [https://brl-edu.netlify.app/](https://brl-edu.netlify.app/), пароль для тестового аккаунта: `a9c6cd185cb2d539`
- Презентация: [https://disk.yandex.ru/i/82uFiU8Zl7M6PA](https://disk.yandex.ru/i/82uFiU8Zl7M6PA)



## Запуск приложения

### Скачайте и установите [Python](https://www.python.org/downloads/)
### Скачайте и установите [Node.js](https://nodejs.org/en/download/)

Задайте переменные окружения:
- ADMIN_CREATE_PASSWORD - пароль для создания администратора
- DATABASE_URL - ссылка для подключения к базе данных
- REACT_APP_SERVER_URL в `.env` в `client` каталоге

## Клиент

Перейдите в `client`

запустите команду:

```powershell
npm install
npm start
```

Клиент будет открываться по `localhost:3000`

## Сервер

Перейдите в `server`

запустите команду:

```powershell
pip install -r requirements.txt
uvicorn main:app --reload
```

Сервер будет открываться по `localhost:8000`