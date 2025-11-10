import pkg from "pg";
const { Pool } = pkg;

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
