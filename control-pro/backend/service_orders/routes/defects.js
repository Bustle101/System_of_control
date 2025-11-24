import express from "express";
import { upload } from "../middleware/upload.js";
import {
  getAllDefects,
  createDefect,
  updateDefect,
  deleteDefect,
  getDefectById,
} from "../controllers/defectsController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth);

// получить все дефекты
router.get("/", getAllDefects);

// создать дефект (С ФАЙЛОМ!)
router.post("/", upload.single("file"), createDefect);

// получить один дефект по ID
router.get("/:id", getDefectById);

// обновить дефект (С ФАЙЛОМ!)
router.put("/:id", upload.single("file"), updateDefect);

// удалить дефект
router.delete("/:id", deleteDefect);

export default router;
