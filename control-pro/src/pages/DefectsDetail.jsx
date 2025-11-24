import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import CommentList from "../components/Comments/CommentList";
import CommentForm from "../components/Comments/CommentForm";
import Header from "../components/Header/Header";
import "../css/defect.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Функция для формата ДД.ММ.ГГГГ
function formatISODate(isoString) {
  if (!isoString) return null;

  const date = new Date(isoString);
  
  // Проверяем валидность даты
  if (isNaN(date.getTime())) return isoString; 

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

export default function DefectsDetail() {
  const { id } = useParams();

  const [defect, setDefect] = useState(null);
  const [project, setProject] = useState(null);
  const [engineer, setEngineer] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);

  useEffect(() => {
    api
      .get(`/orders/defects/${id}`)
      .then((res) => {
        const d = res.data.data;
        setDefect(d);

        // Проект
        if (d.project_id) {
          api
            .get(`/orders/${d.project_id}`)
            .then((r) => setProject(r.data.data))
            .catch(() => {});
        }

        // Исполнитель
        if (d.assigned_to_id) {
          api
            .get(`/users/${d.assigned_to_id}`)
            .then((r) => setEngineer(r.data.data))
            .catch(() => {});
        }

        // Комментарии
        loadComments();
      })
      .catch(() => setError("Не удалось загрузить дефект"));
  }, [id]);

  const loadComments = async () => {
    setIsCommentsLoading(true);

    try {
      const res = await api.get(`/orders/defects/comments/${id}`);
      setComments(res.data.data || []);
    } catch (err) {
      setComments([]);
    }

    setIsCommentsLoading(false);
  };

  const getImageSrc = () => {
    if (!project?.photo_url) return null;
    if (project.photo_url.startsWith("http")) return project.photo_url;
    return `${API_URL}${project.photo_url}`;
  };

  if (error) return <p>{error}</p>;
  if (!defect) return <p>Загрузка...</p>;

  return (
    <div className="basas">
      <Header />

      <main className="project-details">
        <div className="project-detail-back">
          <Link to="/defects">← Назад</Link>
        </div>

        <h1 className="project-detail-title">Дефект: {defect.title}</h1>

        <div className="project-detail-field">
          <div className="project-detail-label">Описание: </div>
          <textarea
            className="project-detail-textarea"
            value={defect.description || ""}
            readOnly
          />
        </div>

        <div className="project-detail-field">
          <span className="project-detail-label"></span>
          <span className={`project-status project-status-${defect.status}`}>
            {defect.status}
          </span>
        </div>

        <div className="project-detail-field">
          <span className="project-detail-label">Приоритет:</span>
          <span>{defect.priority || "-"}</span>
        </div>

        <div className="project-detail-field">
          <span className="project-detail-label">Исполнитель:</span>
          <span>{engineer ? engineer.username : "Не назначен"}</span>
        </div>

        <div className="project-detail-field">
          <span className="project-detail-label">Крайний срок:</span>
          <span>{formatISODate(defect.due_date) || "—"}</span>
        </div>

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

        <p>
          <strong>Создан:</strong>{" "}
          {new Date(defect.created_at).toLocaleString("ru-RU")}
        </p>

       
        <div className="comments-container">
          {isCommentsLoading ? (
            <p>Загружаем комментарии...</p>
          ) : (
            <CommentList comments={comments} />
          )}
        </div>

        
        <CommentForm defectId={id} onAdded={loadComments} />
      </main>
    </div>
  );
}
