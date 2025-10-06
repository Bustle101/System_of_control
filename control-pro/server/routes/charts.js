import express from "express";
import {
  getProjectStats,
  getDefectStatusStats,
  getDefectPriorityStats,
  getDefectsByProject
} from "../controllers/chartController.js";

const router = express.Router();

// Кол-во проектов
router.get("/projects", getProjectStats);

// Кол-во дефектов по статусу
router.get("/defects/status", getDefectStatusStats);

// Кол-во дефектов по приоритету
router.get("/defects/priority", getDefectPriorityStats);

// Кол-во дефектов по проектам
router.get("/defects/by-project", getDefectsByProject);

export default router;
