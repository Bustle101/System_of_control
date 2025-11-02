import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import orderRoutes from "./routes/projects.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Подключаем маршруты
app.use("/api/orders", orderRoutes);

// Тестовый маршрут
app.get("/", (req, res) => res.send("Service Orders работает"));

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Service Orders запущен на порту ${PORT}`);
  console.log(`http://localhost:${PORT}/`);
});
