import { pool } from "../db.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

// Генерация токена
const signToken = (user) => {
  const payload = { id: user.id, username: user.username, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET || "secret", {
    expiresIn: "7d",
  });
};


export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Все поля обязательны для заполнения",
      });
    }

    // Проверяем уникальность ЛОГИНА
    const checkUser = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );
    if (checkUser.rowCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Пользователь с таким логином уже существует",
      });
    }

    const hash = await argon2.hash(password);

    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, role, created_at`,
      [username, email, hash, role || "Менеджер"]
    );

    const user = result.rows[0];

    return res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка при регистрации пользователя",
    });
  }
};


export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Введите логин и пароль",
      });
    }

    
    const userRes = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (userRes.rowCount === 0) {
      return res.status(401).json({
        success: false,
        message: "Пользователь не найден",
      });
    }

    const user = userRes.rows[0];
    const valid = await argon2.verify(user.password_hash, password);

    if (!valid) {
      return res.status(401).json({
        success: false,
        message: "Неверный пароль",
      });
    }

    const token = signToken(user);

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Ошибка входа:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка при входе в систему",
    });
  }
};


export const me = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Не авторизован"
      });
    }

    const result = await pool.query(
      "SELECT id, username, email, role, created_at FROM users WHERE id = $1",
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Пользователь не найден"
      });
    }

    return res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Ошибка при получении профиля:", error);
    return res.status(500).json({
      success: false,
      message: "Ошибка при получении профиля"
    });
  }
};

