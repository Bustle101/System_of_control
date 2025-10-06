import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import projectRoutes from "./routes/projects.js";

dotenv.config({ path: "./server/.env" });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Подключаем маршруты
app.use("/api/projects", projectRoutes);

// Проверочный маршрут
app.get("/", (req, res) => {
  res.send(" Сервер работает");
});

app.listen(PORT, () => {
  console.log(` Сервер запущен на порту ${PORT}`);
});
