import request from "supertest";
import app from "../server.js";
import { pool } from "../db.js";

const FAKE_TOKEN = "Bearer testtoken123";

const TEST_USER_ID = "11111111-1111-1111-1111-111111111111";      // автор проекта
const TEST_ASSIGNEE_ID = "22222222-2222-2222-2222-222222222222";  // исполнитель дефекта

describe("Defects API", () => {
  let projectId = null;
  let defectId = null;

  beforeAll(async () => {
    // Чистим таблицы в правильном порядке
    await pool.query("DELETE FROM defects");
    await pool.query("DELETE FROM projects");
    await pool.query("DELETE FROM users");

    // создаём пользователя — автора проекта
    await pool.query(
      `
      INSERT INTO users (id, email, password_hash, username, role)
      VALUES ($1, 'creator@test.com', 'hash', 'creator', 'engineer')
      ON CONFLICT (id) DO NOTHING;
      `,
      [TEST_USER_ID]
    );

    // создаём пользователя — исполнителя
    await pool.query(
      `
      INSERT INTO users (id, email, password_hash, username, role)
      VALUES ($1, 'assignee@test.com', 'hash', 'assignee', 'engineer')
      ON CONFLICT (id) DO NOTHING;
      `,
      [TEST_ASSIGNEE_ID]
    );

    // создаём тестовый проект
    const projectRes = await pool.query(
      `
      INSERT INTO projects (user_id, name, description, items)
      VALUES ($1, 'Тестовый проект', 'desc', '[]')
      RETURNING id;
      `,
      [TEST_USER_ID]
    );

    projectId = projectRes.rows[0].id;
  });

  afterAll(async () => {
    await pool.end();
  });

  // ---------- CREATE ----------
  it("should create defect", async () => {
    const newDef = {
      project_id: projectId,
      title: "Проблема штукатурки",
      description: "Отслоилась штукатурка",
      priority: "высокий",
      assigned_to_id: TEST_ASSIGNEE_ID,
      due_date: "2025-12-31",
      status: "новый"
    };

    const res = await request(app)
      .post("/api/orders/defects")
      .set("Authorization", FAKE_TOKEN)
      .send(newDef);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");

    defectId = res.body.data.id;
  });

  // ---------- GET BY ID ----------
  it("should get defect by id", async () => {
    const res = await request(app)
      .get(`/api/orders/defects/${defectId}`)
      .set("Authorization", FAKE_TOKEN);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(defectId);
  });

  // ---------- LIST ----------
  it("should return defects list", async () => {
    const res = await request(app)
      .get("/api/orders/defects")
      .set("Authorization", FAKE_TOKEN);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  // ---------- UPDATE ----------
  it("should update defect", async () => {
    const res = await request(app)
      .put(`/api/orders/defects/${defectId}`)
      .set("Authorization", FAKE_TOKEN)
      .send({
        title: "Обновлённое название",
        priority: "средний",
        status: "в работе"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Обновлённое название");
  });

  // ---------- DELETE ----------
  it("should delete defect", async () => {
    const res = await request(app)
      .delete(`/api/orders/defects/${defectId}`)
      .set("Authorization", FAKE_TOKEN);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
