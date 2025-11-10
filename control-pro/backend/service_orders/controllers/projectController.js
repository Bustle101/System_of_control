import { pool } from "../db.js";

// допустимые статусы
const STATUS = ["создан", "в работе", "выполнен", "отменён"];

// проверка прав 
const canAccess = (user, row) => row && row.user_id === user.id;

// GET /api/orders
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
    const { name, description, items = [], total = 0, photo_url } = req.body;

    if (!name?.trim()) {
      return res
        .status(400)
        .json({ success: false, error: { code: "VALIDATION", message: "Поле name обязательно" } });
    }

    const insert = `
      INSERT INTO projects (user_id, name, description, items, status, total, photo_url)
      VALUES ($1, $2, $3, $4, 'создан', $5, $6)
      RETURNING *;
    `;
    const params = [userId, name, description || null, JSON.stringify(items), total, photo_url || null];
    const { rows } = await pool.query(insert, params);

    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Ошибка при создании заказа:", error);
    res
      .status(500)
      .json({ success: false, error: { code: "ORDER_CREATE_FAILED", message: "Ошибка при создании заказа" } });
  }
};

// GET /api/orders/:id
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

// PUT /api/orders/:id
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, items, total, photo_url } = req.body;

    const cur = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);
    if (cur.rowCount === 0)
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Проект не найден" } });

    const row = cur.rows[0];
    if (!canAccess(req.user, row)) {
      return res
        .status(403)
        .json({ success: false, error: { code: "FORBIDDEN", message: "Недостаточно прав для редактирования" } });
    }

    if (row.status === "выполнен" || row.status === "отменён") {
      return res
        .status(400)
        .json({ success: false, error: { code: "IMMUTABLE", message: "Нельзя редактировать завершённый проект" } });
    }

    const upd = `
      UPDATE projects
      SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        items = COALESCE($3, items),
        total = COALESCE($4, total),
        photo_url = COALESCE($5, photo_url),
        updated_at = NOW()
      WHERE id = $6
      RETURNING *;
    `;
    const params = [
      name ?? null,
      description ?? null,
      items !== undefined ? JSON.stringify(items) : null,
      total ?? null,
      photo_url ?? null,
      id,
    ];

    const { rows } = await pool.query(upd, params);
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Ошибка при обновлении проекта:", error);
    res
      .status(500)
      .json({ success: false, error: { code: "ORDER_UPDATE_FAILED", message: "Ошибка при обновлении проекта" } });
  }
};

// PUT /api/orders/:id/status
export const updateProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!STATUS.includes(status)) {
      return res
        .status(400)
        .json({ success: false, error: { code: "VALIDATION", message: `Недопустимый статус (${STATUS.join(", ")})` } });
    }

    const cur = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);
    if (cur.rowCount === 0)
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Проект не найден" } });

    const row = cur.rows[0];
    if (!canAccess(req.user, row)) {
      return res
        .status(403)
        .json({ success: false, error: { code: "FORBIDDEN", message: "Недостаточно прав" } });
    }

    const { rows } = await pool.query(
      "UPDATE projects SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *;",
      [status, id]
    );
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Ошибка при изменении статуса проекта:", error);
    res
      .status(500)
      .json({ success: false, error: { code: "ORDER_STATUS_FAILED", message: "Ошибка при изменении статуса" } });
  }
};

// DELETE /api/orders/:id
export const cancelProject = async (req, res) => {
  try {
    const { id } = req.params;
    const cur = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);
    if (cur.rowCount === 0)
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Проект не найден" } });

    const row = cur.rows[0];
    if (!canAccess(req.user, row)) {
      return res
        .status(403)
        .json({ success: false, error: { code: "FORBIDDEN", message: "Недостаточно прав" } });
    }

    if (row.status === "отменён") return res.json({ success: true, data: row });

    const { rows } = await pool.query(
      "UPDATE projects SET status = 'отменён', updated_at = NOW() WHERE id = $1 RETURNING *;",
      [id]
    );
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Ошибка при отмене проекта:", error);
    res
      .status(500)
      .json({ success: false, error: { code: "ORDER_CANCEL_FAILED", message: "Ошибка при отмене проекта" } });
  }
};
