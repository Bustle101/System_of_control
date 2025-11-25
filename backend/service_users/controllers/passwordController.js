import { pool } from "../db.js";
import crypto from "crypto";
import argon2 from "argon2";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "./server/.env" });


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const userRes = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (userRes.rowCount === 0) {
      return res.status(404).json({ message: "Пользователь с такой почтой не найден" });
    }

    const user = userRes.rows[0];
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 мин

    await pool.query(
      "INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [user.id, token, expiresAt]
    );

    const resetLink = `${process.env.RESET_URL}?token=${token}`;

    await transporter.sendMail({
      from: `"SystemControl" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Сброс пароля — Система Контроля",
      html: `
        <h3>Восстановление пароля</h3>
        <p>Для сброса пароля перейдите по ссылке:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Ссылка действительна 30 минут.</p>
      `,
    });

    res.json({ message: "Письмо для сброса пароля отправлено на вашу почту" });
  } catch (error) {
    console.error("Ошибка при запросе сброса пароля:", error);
    res.status(500).json({ error: "Ошибка при отправке письма" });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const resetRes = await pool.query(
      "SELECT * FROM password_resets WHERE token = $1 AND used = false AND expires_at > NOW()",
      [token]
    );

    if (resetRes.rowCount === 0) {
      return res.status(400).json({ message: "Недействительный или истекший токен" });
    }

    const reset = resetRes.rows[0];
    const hash = await argon2.hash(newPassword);

    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [hash, reset.user_id]);
    await pool.query("UPDATE password_resets SET used = true WHERE id = $1", [reset.id]);

    res.json({ message: "Пароль успешно обновлён" });
  } catch (error) {
    console.error("Ошибка при сбросе пароля:", error);
    res.status(500).json({ error: "Ошибка при сбросе пароля" });
  }
};
