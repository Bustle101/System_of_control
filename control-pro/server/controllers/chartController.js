import { pool } from "../db.js";

// Общее количество проектов
export const getProjectStats = async (req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*) AS total_projects FROM projects");
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Ошибка при получении статистики проектов:", error);
    res.status(500).json({ error: "Ошибка при получении статистики проектов" });
  }
};

// Количество дефектов по статусам
export const getDefectStatusStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT status, COUNT(*) AS count
      FROM defects
      GROUP BY status
      ORDER BY count DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка при получении статистики дефектов по статусу:", error);
    res.status(500).json({ error: "Ошибка при получении статистики дефектов по статусу" });
  }
};

// Количество дефектов по приоритетам
export const getDefectPriorityStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT priority, COUNT(*) AS count
      FROM defects
      GROUP BY priority
      ORDER BY count DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка при получении статистики дефектов по приоритету:", error);
    res.status(500).json({ error: "Ошибка при получении статистики дефектов по приоритету" });
  }
};

// Распределение дефектов по проектам
export const getDefectsByProject = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.name AS project_name, COUNT(d.id) AS defect_count
      FROM projects p
      LEFT JOIN defects d ON p.id = d.project_id
      GROUP BY p.name
      ORDER BY defect_count DESC;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Ошибка при получении распределения дефектов по проектам:", error);
    res.status(500).json({ error: "Ошибка при получении данных по проектам" });
  }
};
