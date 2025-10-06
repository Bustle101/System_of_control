import { pool } from "../db.js";
import argon2 from "argon2";

// Получить всех пользователей
export const getUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username, email, role, created_at FROM users ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка при получении пользователей:", error);
    res.status(500).json({ error: "Ошибка при получении пользователей" });
  }
};

// Получить пользователя по ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT id, username, email, role, created_at FROM users WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Ошибка при получении пользователя:", error);
    res.status(500).json({ error: "Ошибка при получении пользователя" });
  }
};

// Обновить логин (username)
export const updateUsername = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    const result = await pool.query(
      "UPDATE users SET username = $1 WHERE id = $2 RETURNING id, username, email, role, created_at",
      [username, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json({ message: "Имя пользователя обновлено", user: result.rows[0] });
  } catch (error) {
    console.error("Ошибка при обновлении логина:", error);
    res.status(500).json({ error: "Ошибка при обновлении логина" });
  }
};

// Смена пароля
export const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "Пароль не может быть пустым" });
    }

    const hashed = await argon2.hash(newPassword);

    const result = await pool.query(
      "UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id, username, email, role",
      [hashed, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json({ message: "Пароль успешно изменён" });
  } catch (error) {
    console.error("Ошибка при смене пароля:", error);
    res.status(500).json({ error: "Ошибка при смене пароля" });
  }
};

// Удалить пользователя (только для админов)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json({ message: "Пользователь удалён", deleted: result.rows[0] });
  } catch (error) {
    console.error("Ошибка при удалении пользователя:", error);
    res.status(500).json({ error: "Ошибка при удалении пользователя" });
  }
};
