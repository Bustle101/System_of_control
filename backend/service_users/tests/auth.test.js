import request from "supertest";
import app from "../server.js"; 
import { pool } from "../db.js";
import dotenv from "dotenv";
dotenv.config();


const testEmail = "testuser@example.com";
const testPassword = "123456";

beforeAll(async () => {
  await pool.query("DELETE FROM users WHERE email = $1", [testEmail]);
});

afterAll(async () => {
  await pool.end();
});

describe("Users Service – Auth", () => {
  test("Успешная регистрация", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({
        username: "TestUser",
        email: testEmail,
        password: testPassword
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");
  });

  test("Повторная регистрация — ошибка", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({
        username: "TestUser",
        email: testEmail,
        password: testPassword
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("Успешный вход", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({
        email: testEmail,
        password: testPassword
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
  });

  test("Запрос без токена — должен вернуть 401", async () => {
    const res = await request(app).get("/api/users/profile");

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
