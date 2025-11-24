# Базовый образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --production

# Копируем остальной исходный код
COPY . .

# Указываем порт, который будет слушать сервис
EXPOSE 3001

# Запускаем сервер
CMD ["node", "server.js"]
