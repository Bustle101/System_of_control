import { pool } from "../db.js";

// Получить все проекты
export const getProjects = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка при получении проектов:", error);
    res.status(500).json({ error: "Ошибка при получении проектов" });
  }
};

// Добавить новый проект
export const createProject = async (req, res) => {
  try {
    const { name, description, stage, photo_url } = req.body;
    const result = await pool.query(
      `INSERT INTO projects (name, description, stage, photo_url)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, description, stage, photo_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Ошибка при добавлении проекта:", error);
    res.status(500).json({ error: "Ошибка при добавлении проекта" });
  }
};


// Удалить проект по id
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params; // получаем id из URL
    const result = await pool.query(
      "DELETE FROM projects WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Проект не найден" });
    }

    res.json({ message: "Проект успешно удалён", deleted: result.rows[0] });
  } catch (error) {
    console.error("Ошибка при удалении проекта:", error);
    res.status(500).json({ error: "Ошибка при удалении проекта" });
  }
};


// Обновить данные проекта
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, stage, photo_url } = req.body;

    // Проверяем, существует ли проект
    const existing = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);
    if (existing.rowCount === 0) {
      return res.status(404).json({ message: "Проект не найден" });
    }

    // Обновляем данные
    const result = await pool.query(
      `UPDATE projects 
       SET name = $1, description = $2, stage = $3, photo_url = $4
       WHERE id = $5 
       RETURNING *`,
      [name, description, stage, photo_url, id]
    );

    res.json({
      message: "Проект успешно обновлён",
      project: result.rows[0],
    });
  } catch (error) {
    console.error("Ошибка при обновлении проекта:", error);
    res.status(500).json({ error: "Ошибка при обновлении проекта" });
  }
};


// Получить проект по ID
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Проект не найден" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Ошибка при получении проекта по ID:", error);
    res.status(500).json({ error: "Ошибка при получении проекта" });
  }
};
