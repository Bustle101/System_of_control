import "../css/entry.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

export default function Entrance() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!username.trim() || !password.trim()) {
      setMessage("Заполните все поля");
      return;
    }

    try {
      const res = await api.post("/auth/login", { username, password });

      const token = res.data.data.token;
      const user = res.data.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setMessage("Вход выполнен успешно!");

      setTimeout(() => navigate("/home"), 1000);
    } catch (error) {
      console.error("Ошибка при входе:", error);
      setMessage(error.response?.data?.message || "Неверный логин или пароль");
    }

  };

  return (
    <div className="entry-page">
      <div className="login-container">
        <h1>ООО «СистемаКонтроля»</h1>
        <p>по работе со строительными объектами</p>

        <h2>Вход</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="next">
            Далее
          </button>
        </form>

        {message && <p className="message">{message}</p>}

        <div className="links">
          <Link to="/registration">Регистрация</Link>
          <Link to="/lost-password">Забыли пароль?</Link>
        </div>
      </div>
    </div>
  );
}
