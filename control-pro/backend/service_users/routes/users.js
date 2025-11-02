import express from "express";
import {
  getUsers,
  getUserById,
  updateUsername,
  changePassword,
  deleteUser
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUsername);          // обновить логин
router.put("/:id/password", changePassword); // сменить пароль
router.delete("/:id", deleteUser);

export default router;
