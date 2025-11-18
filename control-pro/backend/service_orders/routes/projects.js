import express from "express";
import { upload } from "../middleware/upload.js";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  cancelProject,
} from "../controllers/projectController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Включаем auth перед всеми маршрутами
router.use(requireAuth);

// список проектов
router.get("/", getProjects);

// получить один проект по ID
router.get("/:id", getProjectById);

// создать новый проект 
router.post("/", upload.single("file"), createProject);

// обновить данные проекта 
router.put("/:id", upload.single("file"), updateProject);


// отменить проект
router.delete("/:id", cancelProject);

export default router;
