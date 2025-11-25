import jwt from "jsonwebtoken";

// Проверка токена
export const requireAuth = (req, res, next) => {

  if (process.env.NODE_ENV === "test") {

    req.user = {
      id: "11111111-1111-1111-1111-111111111111",
      role: "engineer",
    };
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Нет токена авторизации" });
  }

 
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Некорректный токен" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded; 
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Неверный или истёкший токен" });
  }
};


export const requireRole = (...roles) => (req, res, next) => {
  
  if (process.env.NODE_ENV === "test") {
    return next();
  }

  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Недостаточно прав" });
  }
  next();
};
