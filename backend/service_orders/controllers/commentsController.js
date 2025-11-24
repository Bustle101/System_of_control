import { pool } from "../db.js";

export const getComments = async (req, res) => {
  try {
    const { defect_id } = req.params;

    const result = await pool.query(
      `SELECT c.*, u.username
       FROM comments c
       LEFT JOIN users u ON u.id = c.author_id
       WHERE defect_id = $1
       ORDER BY created_at ASC`,
      [defect_id]
    );

    res.json({ success: true, data: result.rows });

  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { defect_id } = req.params;
    const { message } = req.body;
    const userId = req.user?.id || null;

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Комментарий не может быть пустым"
      });
    }

    const result = await pool.query(
      `INSERT INTO comments (defect_id, author_id, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [defect_id, userId, message.trim()]
    );

    res.json({ success: true, data: result.rows[0] });

  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};
