import { pool } from "../db.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

// Функция для генерации токена
const signToken = (user) => {
  const payload = { id: user.id, username: user.username, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });
};

// Регистрация пользователя
export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Проверяем, заполнены ли поля
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Все поля обязательны для заполнения" });
    }

    // Проверяем, существует ли пользователь с таким email
    const checkUser = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (checkUser.rowCount > 0) {
      return res.status(400).json({ message: "Пользователь с таким email уже существует" });
    }

    // Хэшируем пароль
    const hash = await argon2.hash(password);

    // Добавляем нового пользователя
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, role, created_at`,
      [username, email, hash, role || "Менеджер"]
    );

    const user = result.rows[0];
    const token = signToken(user);

    res.status(201).json({ message: "Регистрация успешна", token, user });
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    res.status(500).json({ error: "Ошибка при регистрации пользователя" });
  }
};

// Авторизация пользователя (вход)

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Введите логин и пароль" });
    }

    // Находим пользователя по логину
    const userRes = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (userRes.rowCount === 0) {
      return res.status(401).json({ message: "Пользователь не найден" });
    }

    const user = userRes.rows[0];
    const valid = await argon2.verify(user.password_hash, password);

    if (!valid) {
      return res.status(401).json({ message: "Неверный пароль" });
    }

    const token = signToken(user);

    res.json({
      message: "Вход выполнен успешно",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Ошибка входа:", error);
    res.status(500).json({ error: "Ошибка при входе в систему" });
  }
};

// Получить информацию о текущем пользователе
export const me = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Не авторизован" });

    const result = await pool.query(
      "SELECT id, username, email, role, created_at FROM users WHERE id = $1",
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Ошибка при получении профиля:", error);
    res.status(500).json({ error: "Ошибка при получении профиля" });
  }
};
