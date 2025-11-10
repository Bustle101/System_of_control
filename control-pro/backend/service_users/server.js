import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import passwordRoutes from "./routes/password.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; 

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/password", passwordRoutes);

app.get("/", (req, res) => {
  res.send("Service Users работает");
});

app.listen(PORT, () => {
  console.log(`Service Users запущен на порту ${PORT}`);
  console.log(`http://localhost:${PORT}/`);
});
