import request from "supertest";
import app from "../server.js"; // или откуда ты экспортируешь express-приложение

describe("Service Orders basic", () => {
  it("should respond 404 on unknown route", async () => {
    const res = await request(app).get("/__unknown__");
    expect(res.statusCode).toBe(404);
  });
});
