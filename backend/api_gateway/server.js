import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const IS_TEST = process.env.NODE_ENV === "test";

const swaggerDocument = yaml.load("./docs/openapi.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(morgan("dev"));


if (!IS_TEST) {
  app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));
}

app.get("/", (req, res) => {
  res.send(`API Gateway работает (${IS_TEST ? "TEST MODE" : "NORMAL MODE"})`);
});


const verifyToken = (req, res, next) => {
  const publicPaths = [
    "/docs",
    "/api/auth/login",
    "/api/auth/register",
    "/api/password/forgot",
    "/api/password/reset",
    "/uploads",
  ];

  
  if (publicPaths.some((p) => req.path.startsWith(p))) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Нет токена авторизации" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch {
    return res.status(403).json({ message: "Неверный или истёкший токен" });
  }
};

app.use(verifyToken);

const maybeProxy = (path, config) => {
  if (!IS_TEST) {
    app.use(path, createProxyMiddleware(config));
  } else {

    app.use(path, (req, res) => {
      res.status(200).json({
        test: true,
        path: req.path,
        method: req.method,
      });
    });
  }
};


maybeProxy("/api/auth", {
  target: process.env.USERS_SERVICE_URL,
  changeOrigin: true,
  onProxyReq: (proxyReq, req) => {
    if (req.headers.authorization) {
      proxyReq.setHeader("authorization", req.headers.authorization);
    }
  },
});

maybeProxy("/api/users", {
  target: process.env.USERS_SERVICE_URL,
  changeOrigin: true,
  logLevel: "debug",
});

maybeProxy("/api/orders", {
  target: process.env.ORDERS_SERVICE_URL,
  changeOrigin: true,
  logLevel: "debug",
});

maybeProxy("/uploads", {
  target: "http://service_orders:3002",
  changeOrigin: true,
});


if (!IS_TEST) {
  app.listen(PORT, () => {
    console.log(`API Gateway запущен на порту ${PORT}`);
    console.log(`http://localhost:${PORT}/`);
  });
}

export default app;
