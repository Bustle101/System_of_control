import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Миддлвары
app.use(cors());
app.use(express.json());

// Лимитер запросов
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 минута
  max: 100,            // максимум 100 запросов в минуту
});
app.use(limiter);

// Проверка токена JWT (для защищённых маршрутов)
const verifyToken = (req, res, next) => {
  if (req.path.includes("/auth") || req.method === "OPTIONS") return next();

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Нет токена" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: "Неверный токен" });
  }
};
app.use(verifyToken);

// Проксирование запросов
app.use(
  "/api/users",
  createProxyMiddleware({
    target: process.env.USERS_SERVICE_URL,
    changeOrigin: true,
  })
);

app.use(
  "/api/orders",
  createProxyMiddleware({
    target: process.env.ORDERS_SERVICE_URL,
    changeOrigin: true,
  })
);

// Тестовый маршрут
app.get("/", (req, res) =>
  res.send(" Все сервисы подключены.")
);

// Запуск
app.listen(PORT, () => {
  console.log(`API Gateway запущен на порту ${PORT}`);
  console.log(`http://localhost:${PORT}/`);
});
