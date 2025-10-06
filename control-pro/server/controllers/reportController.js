import { pool } from "../db.js";

// Получить все отчёты
export const getReports = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reports ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка при получении отчётов:", error);
    res.status(500).json({ error: "Ошибка при получении отчётов" });
  }
};

// Получить отчёт по ID
export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM reports WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Отчёт не найден" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Ошибка при получении отчёта:", error);
    res.status(500).json({ error: "Ошибка при получении отчёта" });
  }
};

// Создать новый отчёт
export const createReport = async (req, res) => {
  try {
    const { title, description } = req.body;

    const result = await pool.query(
      `INSERT INTO reports (title, description)
       VALUES ($1, $2)
       RETURNING *`,
      [title, description]
    );

    res.status(201).json({
      message: "Отчёт успешно создан",
      report: result.rows[0],
    });
  } catch (error) {
    console.error("Ошибка при создании отчёта:", error);
    res.status(500).json({ error: "Ошибка при создании отчёта" });
  }
};

// Обновить отчёт по ID
export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const result = await pool.query(
      `UPDATE reports
       SET title = $1, description = $2
       WHERE id = $3
       RETURNING *`,
      [title, description, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Отчёт не найден" });
    }

    res.json({
      message: "Отчёт успешно обновлён",
      report: result.rows[0],
    });
  } catch (error) {
    console.error("Ошибка при обновлении отчёта:", error);
    res.status(500).json({ error: "Ошибка при обновлении отчёта" });
  }
};

// Удалить отчёт
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM reports WHERE id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Отчёт не найден" });
    }

    res.json({ message: "Отчёт успешно удалён", deleted: result.rows[0] });
  } catch (error) {
    console.error("Ошибка при удалении отчёта:", error);
    res.status(500).json({ error: "Ошибка при удалении отчёта" });
  }
};
