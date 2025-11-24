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

export const getDefectHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const defectId = parseInt(id, 10);

    if (Number.isNaN(defectId)) {
      return res.status(400).json({
        success: false,
        error: { code: "BAD_ID", message: "Некорректный ID дефекта" },
      });
    }

    const result = await pool.query(
      `SELECT 
          activity_log.*,
          users.username
       FROM activity_log
       LEFT JOIN users ON users.id = activity_log.user_id
       WHERE activity_log.entity_type = 'defect' 
         AND activity_log.entity_id = $1
       ORDER BY activity_log.created_at DESC`,
      [defectId]
    );

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Ошибка загрузки истории:", err);
    res.status(500).json({ success: false, message: "Ошибка загрузки истории" });
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

  
    let newPhoto = oldData.photo_url;

    if (req.file) {
      newPhoto = `/uploads/${req.file.filename}`;

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

    const updatedDefect = result.rows[0];


    const changes = [];

    if (title && title !== oldData.title)
      changes.push(`Название: "${oldData.title}" → "${title}"`);

    if (description && description !== oldData.description)
      changes.push(`Описание изменено`);

    if (priority && priority !== oldData.priority)
      changes.push(`Приоритет: "${oldData.priority}" → "${priority}"`);

    if (assigned_to_id && assigned_to_id !== oldData.assigned_to_id)
      changes.push(`Исполнитель: "${oldData.assigned_to_id}" → "${assigned_to_id}"`);

    if (due_date && due_date !== oldData.due_date?.toISOString())
      changes.push(`Крайний срок изменён`);

    if (status && status !== oldData.status)
      changes.push(`Статус: "${oldData.status}" → "${status}"`);

    if (req.file)
      changes.push(`Фото обновлено`);


    if (changes.length > 0) {
      await pool.query(
        `INSERT INTO activity_log (user_id, action, entity_type, entity_id)
         VALUES ($1, $2, 'defect', $3)`,
        [
          req.user.id,
          changes.join("; "),
          id
        ]
      );
    }


    res.json({ success: true, data: updatedDefect });

  } catch (error) {
    console.error("Ошибка при обновлении дефекта:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "DEFECT_UPDATE_FAILED",
        message: "Ошибка при обновлении дефекта"
      }
    });
  }
};


export const deleteDefect = async (req, res) => {
  try {
    const { id } = req.params;

   
    const defect = await pool.query("SELECT photo_url FROM defects WHERE id = $1", [id]);
    
    if (defect.rowCount === 0) {
      return res.status(404).json({ 
        success: false, 
        error: { code: "NOT_FOUND", message: "Дефект не найден" }
      });
    }

    
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
