
import express from "express";
import {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport
} from "../controllers/reportController.js";

const router = express.Router();

// Получить все отчёты
router.get("/", getReports);

// Получить один отчёт по ID
router.get("/:id", getReportById);

// Создать новый отчёт
router.post("/", createReport);

// Обновить отчёт по ID
router.put("/:id", updateReport);

// Удалить отчёт
router.delete("/:id", deleteReport);

export default router;
