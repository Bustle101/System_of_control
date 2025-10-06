import { pool } from "../db.js";

// Получить все дефекты
export const getDefects = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM defects ORDER BY id ASC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка при получении дефектов:", error);
    res.status(500).json({ error: "Ошибка при получении дефектов" });
  }
};

// Получить дефект по ID
export const getDefectById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM defects WHERE id = $1`, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Дефект не найден" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Ошибка при получении дефекта:", error);
    res.status(500).json({ error: "Ошибка при получении дефекта" });
  }
};

// Создать новый дефект
export const createDefect = async (req, res) => {
  try {
    const {
      title,
      description,
      project_id,
      priority,
      assigned_to,
      due_date,
      attachments,
      photo_url,
      status
    } = req.body;

    const result = await pool.query(
      `INSERT INTO defects
        (title, description, project_id, priority, assigned_to, due_date, attachments, photo_url, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [title, description, project_id, priority, assigned_to, due_date, attachments, photo_url, status]
    );

    res.status(201).json({
      message: "Дефект успешно создан",
      defect: result.rows[0],
    });
  } catch (error) {
    console.error("Ошибка при создании дефекта:", error);
    res.status(500).json({ error: "Ошибка при создании дефекта" });
  }
};

// Обновить дефект по ID
export const updateDefect = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      project_id,
      priority,
      assigned_to,
      due_date,
      attachments,
      photo_url,
      status
    } = req.body;

    const result = await pool.query(
      `UPDATE defects
       SET title=$1, description=$2, project_id=$3, priority=$4, assigned_to=$5,
           due_date=$6, attachments=$7, photo_url=$8, status=$9
       WHERE id=$10
       RETURNING *`,
      [title, description, project_id, priority, assigned_to, due_date, attachments, photo_url, status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Дефект не найден" });
    }

    res.json({
      message: "Дефект успешно обновлён",
      defect: result.rows[0],
    });
  } catch (error) {
    console.error("Ошибка при обновлении дефекта:", error);
    res.status(500).json({ error: "Ошибка при обновлении дефекта" });
  }
};

// Удалить дефект
export const deleteDefect = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM defects WHERE id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Дефект не найден" });
    }

    res.json({ message: "Дефект успешно удалён", deleted: result.rows[0] });
  } catch (error) {
    console.error("Ошибка при удалении дефекта:", error);
    res.status(500).json({ error: "Ошибка при удалении дефекта" });
  }
};
