import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../server.js";

// тестовый секрет для JWT
process.env.JWT_SECRET = "testsecret";

// тестовый токен
const VALID_TOKEN = "Bearer " + jwt.sign(
  { id: "123", role: "engineer" },
  process.env.JWT_SECRET
);

describe("API Gateway", () => {

  // Публичные маршруты доступны без токена
  it("should allow public auth path without token", async () => {
    const res = await request(app).post("/api/auth/login");
    expect([200, 404]).toContain(res.statusCode);
  });

  // Запрос без токена должен блокироваться
  it("should block protected routes without token", async () => {
    const res = await request(app).get("/api/orders/defects");
    expect(res.statusCode).toBe(401);
  });

  //  Неверный токен должен блокироваться
  it("should block protected route with invalid token", async () => {
    const res = await request(app)
      .get("/api/orders/defects")
      .set("Authorization", "Bearer wrong");

    expect(res.statusCode).toBe(403);
  });

  //  Правильный токен должен пропускать 
  it("should accept valid token and return proxy mock", async () => {
    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", VALID_TOKEN);

    expect(res.statusCode).toBe(200);
    expect(res.body.test).toBe(true);
    expect(res.body.path).toBe("/");
  });

  //  Проверка CORS-заголовков
  it("should return CORS headers", async () => {
    const res = await request(app)
      .options("/api/orders")
      .set("Origin", "http://localhost:5173");

    expect(res.headers["access-control-allow-origin"])
      .toBe("http://localhost:5173");
  });

  //  Корневой маршрут работает
  it("should return gateway status", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("API Gateway");
  });



});
