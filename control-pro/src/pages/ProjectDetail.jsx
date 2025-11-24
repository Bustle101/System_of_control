import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import api from "../api/axios";
import "../css/main.css";
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
      const msg = e?.response?.data?.error?.message || "Ошибка загрузки проекта";
      setError(msg);
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
    <div className="basa">
      <Header />
      <main className="project-detail">
        <div className="project-detail-back">
          <Link to="/projects">← Назад</Link>
        </div>

        {loading && <p>Загрузка...</p>}
        {error && <p className="error">{error}</p>}

        {project && !loading && !error && (
          <>
            <h1 className="project-detail-title">Проект: {project.name}</h1>

            <div className="project-detail-field">
              <div className="project-detail-label">Описание:</div>
              <textarea
                className="project-detail-textarea"
                value={project.description || ""}
                readOnly
              />
            </div>

            <div className="project-detail-field">
              <span className="project-detail-label">Статус: </span>
              <span className={`project-status project-status-${project.status}`}>
                {project.status}
              </span>
            </div>

            <div className="project-detail-field">
              <span className="project-detail-label">Бюджет проекта:</span>
              <span>{formatTotal(project.total)} ₽</span>
            </div>

            {items.length > 0 && (
              <div className="project-detail-field">
                <div className="project-detail-label">Состав проекта:</div>
                <ul className="project-detail-items">
                  {items.map((item, i) => (
                    <li key={i} className="project-detail-item">
                      <span className="project-detail-item-dot" />
                      <span>
                        {item.name} - {item.qty}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="project-detail-field">
              <div className="project-detail-label">Фото</div>
              {getImageSrc() ? (
                <img
                  src={getImageSrc()}
                  alt={project.name}
                  className="project-detail-image"
                />
              ) : (
                <p>Фото не загружено</p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
