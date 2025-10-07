import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import projectRoutes from "./routes/projects.js";
import defectRoutes from "./routes/defects.js";
import reportRoutes from "./routes/reports.js";
import userRoutes from "./routes/users.js";
import chartRoutes from "./routes/charts.js";
import passwordRoutes from "./routes/password.js";

dotenv.config({ path: "./server/.env" });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Подключаем маршруты
app.use("/api/projects", projectRoutes);
app.use("/api/defects", defectRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);
app.use("/api/charts", chartRoutes);
app.use("/api/password", passwordRoutes);
// Проверочный маршрут
app.get("/", (req, res) => {
  res.send(" Сервер работает");
});

app.listen(PORT, () => {
  console.log(` Сервер запущен на порту ${PORT}`);
});
