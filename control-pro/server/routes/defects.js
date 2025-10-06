import express from "express";
import {
  getDefects,
  getDefectById,
  createDefect,
  updateDefect,
  deleteDefect
} from "../controllers/defectController.js";

const router = express.Router();

// Получить все дефекты
router.get("/", getDefects);

// Получить один дефект по ID
router.get("/:id", getDefectById);

// Создать новый дефект
router.post("/", createDefect);

// Обновить дефект по ID
router.put("/:id", updateDefect);

// Удалить дефект
router.delete("/:id", deleteDefect);

export default router;
