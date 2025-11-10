import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import morgan from "morgan";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173", credentials: true }));
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

const verifyToken = (req, res, next) => {
  const publicPaths = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/password/forgot",
    "/api/password/reset",
  ];

  if (publicPaths.some((p) => req.path.startsWith(p))) return next();

  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Нет токена авторизации" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: "Неверный или истёкший токен" });
  }
};

app.use(verifyToken);

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: process.env.USERS_SERVICE_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
      if (req.headers.authorization) {
        proxyReq.setHeader("authorization", req.headers.authorization);
      }
    },
  })
);

app.use(
  "/api/users",
  createProxyMiddleware({
    target: process.env.USERS_SERVICE_URL,
    changeOrigin: true,
    logLevel: "debug",
    selfHandleResponse: false,
    onProxyReq: (proxyReq, req) => {
      if (req.headers.authorization) {
        proxyReq.setHeader("authorization", req.headers.authorization);
      }
    },
  })
);

app.use(
  "/api/orders",
  createProxyMiddleware({
    target: process.env.ORDERS_SERVICE_URL,
    changeOrigin: true,
    logLevel: "debug",
    selfHandleResponse: false,
    onProxyReq: (proxyReq, req) => {
      if (req.headers.authorization) {
        proxyReq.setHeader("authorization", req.headers.authorization);
      }
    },
  })
);

app.get("/", (req, res) => {
  res.send("API Gateway работает. Все сервисы подключены.");
});

app.listen(PORT, () => {
  console.log(`API Gateway запущен на порту ${PORT}`);
  console.log(`http://localhost:${PORT}/`);
});
