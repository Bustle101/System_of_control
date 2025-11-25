import request from "supertest";
import app from "../server.js";
import { pool } from "../db.js";

const testUsername = "TestUserAuth";
const testEmail = "testuser_auth@example.com";
const testPassword = "123456";

beforeAll(async () => {
  // чистим таблицу с пользователями
  await pool.query("DELETE FROM users WHERE username = $1", [testUsername]);
});

afterAll(async () => {
  await pool.end();
});

// регистрируем

describe("Users Service – Auth", () => {
  test("Успешная регистрация", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: testUsername,
        email: testEmail,
        password: testPassword,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.username).toBe(testUsername);
  });

  // попытка регистрации повторная 
  test("Повторная регистрация — ошибка (логин занят)", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: testUsername,
        email: testEmail,
        password: testPassword,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/логин/i);
  });

  // вход
  test("Успешный вход по логину и паролю", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        username: testUsername,
        password: testPassword,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data.user).toMatchObject({
      username: testUsername,
      email: testEmail,
    });
  });

// проверка токена
  test("Запрос /me без токена — 401", async () => {
    const res = await request(app).get("/api/auth/me");

    expect(res.statusCode).toBe(401);

    expect(res.body.success).toBe(false);
  });
});
