import express from "express";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  updateProjectStatus,
  cancelProject,
} from "../controllers/projectController.js";
import { requireAuth } from "../middleware/auth.js"; // при необходимости скорректируй путь

const router = express.Router();


router.use(requireAuth);

// список проектов
router.get("/", getProjects);

// получить один проект по ID
router.get("/:id", getProjectById);

// создать новый проект
router.post("/", createProject);

// обновить данные проекта (без статуса)
router.put("/:id", updateProject);

// изменить статус проекта (создан / в работе / выполнен / отменён)
router.put("/:id/status", updateProjectStatus);

// отменить проект (ставит статус 'отменён')
router.delete("/:id", cancelProject);

export default router;
