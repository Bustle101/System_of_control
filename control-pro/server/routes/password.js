import express from "express";
import { requestPasswordReset, resetPassword } from "../controllers/passwordController.js";

const router = express.Router();

router.post("/request", requestPasswordReset); // отправка письма
router.post("/reset", resetPassword);           // установка нового пароля

export default router;
