import { pool } from "../db.js";
import fs from "fs";

export const getAllDefects = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM defects ORDER BY created_at DESC");
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Ошибка при получении дефектов:", error);
    res.status(500).json({ 
      success: false, 
      error: { code: "DEFECTS_LIST_FAILED", message: "Ошибка при получении дефектов" } 
    });
  }
};

export const getDefectById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM defects WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Дефект не найден" }
      });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Ошибка при получении дефекта:", error);
    res.status(500).json({ 
      success: false, 
      error: { code: "DEFECT_GET_FAILED", message: "Ошибка при получении дефекта" } 
    });
  }
};

export const createDefect = async (req, res) => {
  try {
    const {
      project_id,
      title,
      description,
      priority,
      assigned_to_id,
      due_date,
      status
    } = req.body;

    if (!project_id) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION", message: "project_id обязателен" }
      });
    }

    const photo_url = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      `INSERT INTO defects
        (project_id, title, description, priority, assigned_to_id, due_date, photo_url, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        project_id,
        title || null,
        description || null,
        priority || null,
        assigned_to_id || null,
        due_date || null,
        photo_url,
        status || "новый"
      ]
    );

    res.status(201).json({ success: true, data: result.rows[0] });

  } catch (error) {
    console.error("Ошибка при создании дефекта:", error);
    res.status(500).json({ 
      success: false, 
      error: { code: "DEFECT_CREATE_FAILED", message: "Ошибка при создании дефекта" }
    });
  }
};

export const updateDefect = async (req, res) => {
  try {
    const { id } = req.params;

    // Сначала получим старые данные
    const oldDef = await pool.query("SELECT * FROM defects WHERE id = $1", [id]);
    if (oldDef.rowCount === 0) {
      return res.status(404).json({ 
        success: false, 
        error: { code: "NOT_FOUND", message: "Дефект не найден" } 
      });
    }

    const oldData = oldDef.rows[0];

    const {
      title,
      description,
      priority,
      assigned_to_id,
      due_date,
      status
    } = req.body;

    // Новый файл
    let newPhoto = oldData.photo_url;

    if (req.file) {
      newPhoto = `/uploads/${req.file.filename}`;

      // Удаляем старый файл
      if (oldData.photo_url) {
        const oldPath = "/app" + oldData.photo_url;
        try {
          fs.unlinkSync(oldPath);
        } catch (e) {
          console.warn("Не удалось удалить старый файл:", oldPath);
        }
      }
    }

    const result = await pool.query(
      `UPDATE defects
       SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        priority = COALESCE($3, priority),
        assigned_to_id = COALESCE($4, assigned_to_id),
        due_date = COALESCE($5, due_date),
        photo_url = $6,
        status = COALESCE($7, status),
        updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [
        title,
        description,
        priority,
        assigned_to_id,
        due_date,
        newPhoto,
        status,
        id
      ]
    );

    res.json({ success: true, data: result.rows[0] });

  } catch (error) {
    console.error("Ошибка при обновлении дефекта:", error);
    res.status(500).json({ 
      success: false, 
      error: { code: "DEFECT_UPDATE_FAILED", message: "Ошибка при обновлении дефекта" }
    });
  }
};

export const deleteDefect = async (req, res) => {
  try {
    const { id } = req.params;

    // Получаем данные перед удалением, чтобы удалить файл
    const defect = await pool.query("SELECT photo_url FROM defects WHERE id = $1", [id]);
    
    if (defect.rowCount === 0) {
      return res.status(404).json({ 
        success: false, 
        error: { code: "NOT_FOUND", message: "Дефект не найден" }
      });
    }

    // Удаляем файл фото, если он есть
    if (defect.rows[0].photo_url) {
      const filePath = "/app" + defect.rows[0].photo_url;
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.warn("Не удалось удалить файл:", filePath);
      }
    }

    await pool.query("DELETE FROM defects WHERE id = $1", [id]);

    res.json({ success: true });

  } catch (error) {
    console.error("Ошибка при удалении дефекта:", error);
    res.status(500).json({ 
      success: false, 
      error: { code: "DEFECT_DELETE_FAILED", message: "Ошибка при удалении дефекта" }
    });
  }
};
