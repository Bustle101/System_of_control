import express from "express";
import { pool } from "../db.js";
import {
  getUsers,
  getUserById,
  updateUsername,
  changePassword,
  deleteUser
} from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/engineers", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, role FROM users WHERE role = 'engineer'"
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
router.get("/:id", getUserById);
router.put("/:id", updateUsername);          
router.put("/:id/password", changePassword); 
router.delete("/:id", deleteUser);


export default router;
