import "../css/entry.css";
import { Link } from "react-router-dom";

export default function Entrance() {
  return (
    <div className="login-container">
      <h1>ООО «СистемаКонтроля»</h1>
      <p>по работе с строительными объектами</p>

      <h2>Вход</h2>

      <form>
        <input type="text" placeholder="Логин" />
        <input type="password" placeholder="Пароль" />
        <button type="submit">Далее</button>
      </form>

      <div className="links">
        <Link to="/registration">Регистрация</Link>
        <Link to="/lost-password">Забыли пароль?</Link>
      </div>
    </div>
  );
}
