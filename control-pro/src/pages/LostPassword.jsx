import "../css/entry.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

export default function LostPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email.trim()) {
      setMessage("Введите почту");
      return;
    }

    try {
      const res = await api.post("/password/request", { email });
      setMessage(res.data.message);
      setEmail("");
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Ошибка при отправке письма");
    }
  };

  return (
    <div className="login-container">
      <div className="link_reg">
        <Link to="/">Назад</Link>
      </div>
      <h1>ООО «СистемаКонтроля»</h1>
      <p>по работе со строительными объектами</p>
      <h2>Восстановление пароля</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Отправить ссылку</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
