СистемаКонтроля

Архитектура

api_gateway - шлюз. (отправляет запросы по сервисам)
service_users - сервис для работы с данными пользователя.
service_orders - сервис для работы с проектами.

##1) Склонируйте репозиторий:
git clone https://github.com/Bustle101/System_of_control.git
Далее в терминале выполните:
```
cd System_of_control
```
```
cd control-pro
```
##2) Условия

Установить Docker и Docker Compose.

Создать файл .env во всех сервисах и в шлюзе.

backend/.env
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=systemcontrol
```
api_gateway/.env
```
PORT=3000
JWT_SECRET=вставьте строчку

USERS_SERVICE_URL=http://service_users:3001
ORDERS_SERVICE_URL=http://service_orders:3002

```
service_users/.env
```
PORT=3001

DATABASE_URL=postgres://postgres:postgres@db:5432/systemcontrol
JWT_SECRET=вставьте строчку
```

service_orders/.env
```
PORT=3002
DATABASE_URL=postgres://postgres:postgres@db:5432/systemcontrol
JWT_SECRET=вставьте строчку
```
##3) Запуск

В терминале №1 выполните:
```
docker compose up --build
```
В терминале №2 выполните:
```
npm run dev
```
