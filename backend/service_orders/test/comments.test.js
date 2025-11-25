import request from "supertest";
import app from "../server.js";
import { pool } from "../db.js";

const FAKE_TOKEN = "Bearer testtoken123";

const TEST_USER_ID = "11111111-1111-1111-1111-111111111111";      // автор
const TEST_ASSIGNEE_ID = "22222222-2222-2222-2222-222222222222";  // исполнитель

describe("Comments API", () => {
  let projectId = null;
  let defectId = null;
  let commentId = null;

  beforeAll(async () => {
    // Чистим таблицы
    await pool.query("DELETE FROM comments");
    await pool.query("DELETE FROM defects");
    await pool.query("DELETE FROM projects");
    await pool.query("DELETE FROM users");

    // создаём автора комментариев
    await pool.query(
      `
      INSERT INTO users (id, email, password_hash, username, role)
      VALUES ($1, 'commenter@test.com', 'hash', 'commenter', 'engineer')
      ON CONFLICT (id) DO NOTHING;
      `,
      [TEST_USER_ID]
    );

    // создаём второго пользователя (исполнителя дефекта)
    await pool.query(
      `
      INSERT INTO users (id, email, password_hash, username, role)
      VALUES ($1, 'worker@test.com', 'hash', 'worker', 'engineer')
      ON CONFLICT (id) DO NOTHING;
      `,
      [TEST_ASSIGNEE_ID]
    );

    // создаём проект
    const projectRes = await pool.query(
      `
      INSERT INTO projects (user_id, name, description, items)
      VALUES ($1, 'Проект для комментариев', 'desc', '[]')
      RETURNING id;
      `,
      [TEST_USER_ID]
    );

    projectId = projectRes.rows[0].id;

    // создаём дефект
    const defectRes = await pool.query(
      `
      INSERT INTO defects (project_id, title, description, priority, assigned_to_id, status)
      VALUES ($1, 'Тестовый дефект', 'desc', 'высокий', $2, 'новый')
      RETURNING id;
      `,
      [projectId, TEST_ASSIGNEE_ID]
    );

    defectId = defectRes.rows[0].id;
  });

  afterAll(async () => {
    await pool.end();
  });

  // создание комментария
  it("should add comment", async () => {
    const res = await request(app)
      .post(`/api/orders/defects/comments/${defectId}`)
      .set("Authorization", FAKE_TOKEN)
      .send({
        message: "Первый комментарий"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");

    commentId = res.body.data.id;
  });

  // получение комментария
  it("should get comments by defect id", async () => {
    const res = await request(app)
      .get(`/api/orders/defects/comments/${defectId}`)
      .set("Authorization", FAKE_TOKEN);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].message).toBe("Первый комментарий");
  });

  // пустое сообщение
  it("should not accept empty message", async () => {
    const res = await request(app)
      .post(`/api/orders/defects/comments/${defectId}`)
      .set("Authorization", FAKE_TOKEN)
      .send({ message: "" });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

});
