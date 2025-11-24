import { pool } from "../db.js";
import fs from "fs";

const STATUS = ["создан", "в работе", "выполнен", "отменён"];


const canAccess = (user, row) => row && row.user_id === user.id;


export const getProjects = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const limit = Math.min(parseInt(req.query.limit || "20", 10), 100);
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const offset = (page - 1) * limit;

    const sortBy = ["created_at", "updated_at", "total", "name"].includes(req.query.sortBy)
      ? req.query.sortBy
      : "created_at";
    const order = (req.query.order || "desc").toLowerCase() === "asc" ? "asc" : "desc";

    const sql = `
      SELECT *
      FROM projects
      WHERE user_id = $1
      ORDER BY ${sortBy} ${order}
      LIMIT $2
      OFFSET $3;
    `;

    const { rows } = await pool.query(sql, [userId, limit, offset]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Ошибка при получении заказов:", error);
    res
      .status(500)
      .json({ success: false, error: { code: "ORDERS_LIST_FAILED", message: "Ошибка при получении заказов" } });
  }
};

// POST /api/orders
export const createProject = async (req, res) => {
  try {
    const { id: userId } = req.user;
    let { name, description, items = "[]", total = 0, status = "создан" } = req.body;


    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION", message: "Поле name обязательно" },
      });
    }

   
    if (typeof items === "string") {
      try {
        items = JSON.parse(items);
      } catch {
        items = [];
      }
    }

  
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;


    const insert = `
      INSERT INTO projects (user_id, name, description, items, status, total, photo_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const params = [
      userId,
      name.trim(),
      description || null,
      JSON.stringify(items),
      status,
      Number(total) || 0,
      filePath,
    ];

    const { rows } = await pool.query(insert, params);

    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Ошибка при создании проекта:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "ORDER_CREATE_FAILED",
        message: "Ошибка при создании проекта",
      },
    });
  }
};



export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);

    if (rows.length === 0)
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Проект не найден" } });

    if (!canAccess(req.user, rows[0])) {
      return res
        .status(403)
        .json({ success: false, error: { code: "FORBIDDEN", message: "Недостаточно прав для доступа" } });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Ошибка при получении проекта:", error);
    res
      .status(500)
      .json({ success: false, error: { code: "ORDER_GET_FAILED", message: "Ошибка при получении проекта" } });
  }
};


export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, description, items, total, status } = req.body;

  
    if (status && !STATUS.includes(status)) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION", message: "Недопустимый статус" },
      });
    }

    if (typeof items === "string") {
      try {
        items = JSON.parse(items);
      } catch {
        items = undefined; 
      }
    }

   
    total = total !== undefined ? Number(total) : undefined;

    const newFilePath = req.file ? `/uploads/${req.file.filename}` : null;

    const cur = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);
    if (cur.rowCount === 0)
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Проект не найден" } });

    const row = cur.rows[0];

    if (!canAccess(req.user, row))
      return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Недостаточно прав" } });

    if (row.status === "выполнен" || row.status === "отменён")
      return res.status(400).json({
        success: false,
        error: { code: "IMMUTABLE", message: "Нельзя редактировать завершённый проект" },
      });

   
    if (newFilePath && row.photo_url) {
      const oldPath = "/app" + row.photo_url;
      try { fs.unlinkSync(oldPath); } catch {}
    }

    const finalPhoto = newFilePath || row.photo_url || null;

    const upd = `
      UPDATE projects
      SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        items = COALESCE($3, items),
        total = COALESCE($4, total),
        status = COALESCE($5, status),
        photo_url = $6,
        updated_at = NOW()
      WHERE id = $7
      RETURNING *;
    `;

    const params = [
      name ?? null,
      description ?? null,
      items !== undefined ? JSON.stringify(items) : null,
      total ?? null,
      status ?? null,
      finalPhoto,
      id,
    ];

    const result = await pool.query(upd, params);

    res.json({ success: true, data: result.rows[0] });

  } catch (error) {
    console.error("Ошибка при обновлении проекта:", error);
    res.status(500).json({
      success: false,
      error: { code: "ORDER_UPDATE_FAILED", message: "Ошибка при обновлении проекта" },
    });
  }
};



export const cancelProject = async (req, res) => {
  try {
    const { id } = req.params;

   
    const cur = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);

    if (cur.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Проект не найден" },
      });
    }

    const row = cur.rows[0];

  
    if (!canAccess(req.user, row)) {
      return res.status(403).json({
        success: false,
        error: { code: "FORBIDDEN", message: "Недостаточно прав" },
      });
    }

   
    if (row.photo_url) {
      const filePath = "/app" + row.photo_url; 
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.warn("Не удалось удалить файл:", filePath);
      }
    }

    const result = await pool.query(
      "DELETE FROM projects WHERE id = $1 RETURNING *",
      [id]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Ошибка при удалении проекта:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "ORDER_DELETE_FAILED",
        message: "Ошибка при удалении проекта",
      },
    });
  }
};
