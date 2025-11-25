import request from "supertest";
import app from "../server.js";
import { pool } from "../db.js";

const FAKE_TOKEN = "Bearer testtoken123";
const TEST_USER_ID = "11111111-1111-1111-1111-111111111111";

beforeAll(async () => {
  // создаём пользователя 
  await pool.query(
    `
    INSERT INTO users (id, email, password_hash, username, role)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (id) DO NOTHING;
    `,
    [
      TEST_USER_ID,
      "test-engineer@example.com",
      "test-hash",
      "test engineer",
      "engineer",
    ]
  );

  // чистим проекты
  await pool.query("DELETE FROM projects");
});

afterAll(async () => {
  await pool.end();
});

describe("Projects API", () => {
  let projectId = null;

  // создание
  it("should create a project", async () => {
    const mockProject = {
      user_id: TEST_USER_ID,
      name: "Тестовый проект",
      description: "Описание проекта",
      items: [
        { name: "бетон", qty: 2 },
        { name: "арматура", qty: 10 },
      ],
    };

    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", FAKE_TOKEN)
      .send(mockProject);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");

    projectId = res.body.data.id;
  });

  // получить по id
  it("should get project by id", async () => {
    const res = await request(app)
      .get(`/api/orders/${projectId}`)
      .set("Authorization", FAKE_TOKEN);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(projectId);
  });

  // обновление
  it("should update project", async () => {
    const res = await request(app)
      .put(`/api/orders/${projectId}`)
      .set("Authorization", FAKE_TOKEN)
      .send({
        name: "Обновлённый проект",
        total: 999.99,
        status: "в работе"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Обновлённый проект");
    expect(Number(res.body.data.total)).toBe(999.99);
  });

  //удаление
  it("should delete project", async () => {
    const res = await request(app)
      .delete(`/api/orders/${projectId}`)
      .set("Authorization", FAKE_TOKEN);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // точно удален
  it("should return 404 after project was deleted", async () => {
    const res = await request(app)
      .get(`/api/orders/${projectId}`)
      .set("Authorization", FAKE_TOKEN);

    expect(res.statusCode).toBe(404);
  });
});
