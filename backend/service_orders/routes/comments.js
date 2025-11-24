import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { getComments, addComment } from "../controllers/commentsController.js";

const router = express.Router();

router.use(requireAuth);

router.get("/:defect_id", getComments);
router.post("/:defect_id", addComment);

export default router;
