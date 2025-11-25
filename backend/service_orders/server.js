import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import orderRoutes from "./routes/projects.js";
import defectsRoutes from "./routes/defects.js";
import commentsRoutes from "./routes/comments.js";
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3002;
const __dirname = path.resolve();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(express.json());

// Подключаем маршруты

app.use("/api/orders/defects", defectsRoutes);
app.use("/api/orders/defects/comments", commentsRoutes);
app.use("/api/orders", orderRoutes);


// Тестовый маршрут
app.get("/", (req, res) => res.send("Service Orders работает"));

// Запуск сервера


if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Service Orders запущен на порту ${PORT}`);
    console.log(`http://localhost:${PORT}/`);
  });
}
export default app;