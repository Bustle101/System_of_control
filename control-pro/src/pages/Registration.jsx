import "../css/entry.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

export default function Registration() {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Менеджер",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // все поля заполнены
    if (
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim()
    ) {
      setMessage("Пожалуйста, заполните все поля");
      return;
    }

    // длина пароля
    if (formData.password.length < 6) {
      setMessage("Пароль должен содержать не менее 6 символов");
      return;
    }

    // совпадение паролей
    if (formData.password !== formData.confirmPassword) {
      setMessage("Пароли не совпадают");
      return;
    }

    try {
      const res = await api.post("/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      setMessage("Регистрация прошла успешно!");

      // Очистка формы
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Менеджер",
      });


    } 
    catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Ошибка регистрации");
    }
  };

  return (
    <div className="login-container">
      <div className="link_reg">
        <Link to="/">Назад</Link>
      </div>

      <h1>ООО «СистемаКонтроля»</h1>
      <p>по работе с строительными объектами</p>
      <h2>Регистрация</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Логин"
          value={formData.username}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Почта"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Повторите пароль"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="roles"
        >
          <option>Менеджер</option>
          <option>Инженер</option>
          <option>Наблюдатель</option>
        </select>

        <button type="submit">Далее</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}
