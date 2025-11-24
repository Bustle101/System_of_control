import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import api from "../api/axios";
import "../css/projdet.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/orders/${id}`);
      setProject(res.data.data);
    } catch (e) {
      setError(e?.response?.data?.error?.message || "Ошибка загрузки проекта");
      if (e?.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const formatTotal = (value) =>
    Number(value || 0).toLocaleString("ru-RU");

  const getImageSrc = () => {
    if (!project?.photo_url) return null;
    if (project.photo_url.startsWith("http")) return project.photo_url;
    return `${API_URL}${project.photo_url}`;
  };

  const items = Array.isArray(project?.items) ? project.items : [];

  return (
    <div className="container">
      <Header />

      <main className="detail-page">
        <Link to="/projects" className="detail-back">← Назад</Link>

        {loading && <p>Загрузка...</p>}
        {error && <p className="error">{error}</p>}

        {project && !loading && !error && (
          <>
            <h1 className="detail-title">Проект: {project.name}</h1>

            <div className="detail-block">
              <label>Описание:</label>
              <textarea readOnly value={project.description || ""} />
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Статус:</span>
                <span className={`status status-${project.status}`}>
                  {project.status}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Бюджет:</span>
                <span>{formatTotal(project.total)} ₽</span>
              </div>
            </div>

            {items.length > 0 && (
              <div className="detail-block">
                <label>Состав проекта:</label>
                <ul className="project-items-list">
                  {items.map((item, i) => (
                    <li key={i} className="project-item">
                      <div className="dot"></div>
                      <span>{item.name} — {item.qty}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="detail-block">
              <label>Фото:</label>
              {getImageSrc() ? (
                <img className="detail-image" src={getImageSrc()} alt={project.name} />
              ) : (
                <p>Фото отсутствует</p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
