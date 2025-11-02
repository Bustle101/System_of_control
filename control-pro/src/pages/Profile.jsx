import Header from "../components/Header/Header";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error("Ошибка при получении профиля:", err);
        setError("Ошибка загрузки данных. Возможно, вы не авторизованы.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/entrance");
  };

  if (loading) {
    return (
      <div className="basa">
        <Header />
        <main>
          <p>Загрузка профиля...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="basa">
        <Header />
        <main>
          <p>{error}</p>
          <Link to="/entrance">Войти снова</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="basa">
      <Header />
      <main>
        <div className="profile-header">
          <div className="profile-info">
            <p><strong>Логин:</strong> {user?.username}</p>
            <p><strong>Роль:</strong> {user?.role}</p>
          </div>

          <div className="profile-photo">
            <span>Фото</span>
          </div>
        </div>

        <button className="btn-secondary" onClick={handleLogout}>
          Выйти
        </button>
      </main>
    </div>
  );
}
