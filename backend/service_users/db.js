import dotenv from "dotenv";
import pkg from "pg";

const { Pool } = pkg;

if (process.env.NODE_ENV === "test") {

  dotenv.config({ path: "./.env.test", override: true });
  console.log("[db.js] NODE_ENV=test, загружаю .env.test");
} else {

  dotenv.config({ path: "./server.env", override: true });
  console.log("[db.js] NODE_ENV=", process.env.NODE_ENV, "загружаю server.env");
}

console.log("[db.js] DATABASE_URL =", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("Подключение к базе данных установлено");
});

pool.on("error", (err) => {
  console.error("Ошибка подключения к базе данных:", err);
});

export { pool };
