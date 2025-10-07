import jwt from "jsonwebtoken";

// Проверка токена
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Нет токена авторизации" });
  }

  // "Bearer tokenvalue"
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Некорректный токен" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded; // Сохраняем данные пользователя
    next();
  } catch (error) {
    return res.status(401).json({ message: "Неверный или истёкший токен" });
  }
};


export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Недостаточно прав" });
  }
  next();
};
