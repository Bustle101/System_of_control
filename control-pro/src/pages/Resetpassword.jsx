import "../css/entry.css";
import { useSearchParams,useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!newPassword || !confirmPassword) {
      setMessage("Заполните все поля");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Пароль должен быть не менее 6 символов");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Пароли не совпадают");
      return;
    }

    try {
      const res = await api.post("/password/reset", { token, newPassword });

      setMessage(res.data.message + " Переход на страницу входа...");

      // ⏳ Через 2 секунды переход на страницу входа
      setTimeout(() => navigate("/entrance"), 2000);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Ошибка при сбросе пароля");
    }
  };

  return (
    <div className="login-container">


      <h1>ООО «СистемаКонтроля»</h1>
      <p>по работе со строительными объектами</p>
      <h2>Сброс пароля</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Новый пароль"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Повторите пароль"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Сохранить</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}
