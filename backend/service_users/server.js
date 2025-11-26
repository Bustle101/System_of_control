import express from "express";
import cors from "cors";
import userRoutes from "./routes/users.js";
import passwordRoutes from "./routes/password.js";
import authRoutes from "./routes/auth.js";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs"; 

const app = express();
const PORT = process.env.PORT || 3001; 

app.use(cors());
app.use(express.json());


const swaggerDocument = yaml.load("./docs/openapi.yaml"); 
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/password", passwordRoutes);

app.get("/", (req, res) => {
  res.send("Service Users работает");
});


if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Service Users запущен на порту ${PORT}`);
    console.log(`http://localhost:${PORT}/`);
  });
}

export default app;

