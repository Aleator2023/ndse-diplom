# Используем базовый образ Node.js версии 18
FROM node:18

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файлы package.json и package-lock.json для установки зависимостей
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все остальные файлы проекта в контейнер
COPY . .

# Указываем команду для запуска приложения
CMD ["npm", "start"]