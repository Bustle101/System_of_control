import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import CommentList from "../components/Comments/CommentList";
import CommentForm from "../components/Comments/CommentForm";
import Header from "../components/Header/Header";
import "../css/projdet.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function formatISODate(isoString) {
  if (!isoString) return null;
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
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
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [history, setHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const statuses = ["новая", "в работе", "на проверке", "закрыта", "отменена"];

  
  let user = {};
  try {
    const raw = localStorage.getItem("user");
    user = raw && raw !== "undefined" ? JSON.parse(raw) : {};
  } catch {
    user = {};
  }

  const role = user.role;              
  const canChangeStatus = role === "manager";

  useEffect(() => {
    loadDefect();
  }, [id]);

  const loadDefect = async () => {
    try {
      const res = await api.get(`/orders/defects/${id}`);
      const d = res.data.data;
      setDefect(d);

      setNewStatus(d.status);
      loadHistory();

      if (d.project_id) loadProject(d.project_id);
      if (d.assigned_to_id) loadEngineer(d.assigned_to_id);

      loadComments();
    } catch {
      setError("Не удалось загрузить дефект");
    }
  };

  const loadProject = async (projectId) => {
    try {
      const res = await api.get(`/orders/${projectId}`);
      setProject(res.data.data);
    } catch {}
  };

  const loadEngineer = async (userId) => {
    try {
      const res = await api.get(`/users/${userId}`);
      setEngineer(res.data);
    } catch {}
  };

  const loadComments = async () => {
    setIsCommentsLoading(true);
    try {
      const res = await api.get(`/orders/defects/comments/${id}`);
      setComments(res.data.data || []);
    } catch {
      setComments([]);
    }
    setIsCommentsLoading(false);
  };

  const loadHistory = async () => {
    setIsHistoryLoading(true);
    try {
      const res = await api.get(`/orders/defects/${id}/history`);
      setHistory(res.data.data || []);
    } catch {
      setHistory([]);
    }
    setIsHistoryLoading(false);
  };

  const getImageSrc = () => {
    if (!project?.photo_url) return null;
    return project.photo_url.startsWith("http")
      ? project.photo_url
      : `${API_URL}${project.photo_url}`;
  };

  const updateStatus = async () => {
    if (!canChangeStatus) return alert("Недостаточно прав!");

    try {
      await api.put(`/orders/defects/${id}`, { status: newStatus });
      setIsStatusModalOpen(false);
      loadDefect();
    } catch {
      alert("Ошибка при обновлении статуса");
    }
  };

  if (error) return <p>{error}</p>;
  if (!defect) return <p>Загрузка...</p>;

  return (
    <div className="container">
      <Header />

     
      {isStatusModalOpen && canChangeStatus && (
        <div className="modal-overlay">
          <div className="modal-window">
            <h3>Изменить статус</h3>

            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <div className="modal-buttons">
              <button onClick={updateStatus}>Сохранить</button>
              <button onClick={() => setIsStatusModalOpen(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      <main className="detail-page">
        <Link to="/defects" className="detail-back">← Назад</Link>

        <h1 className="detail-title">Дефект: {defect.title}</h1>

        <div className="detail-block">
          <label>Описание:</label>
          <textarea readOnly value={defect.description || ""} />
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Проект:</span>
            <span>{project ? project.name : "Загрузка..."}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Статус:</span>

            <span className={`status status-${defect.status}`}>{defect.status}</span>

            {canChangeStatus && (
              <button
                className="status-edit-btn"
                onClick={() => {
                  setNewStatus(defect.status);
                  setIsStatusModalOpen(true);
                }}
              >
                Изменить
              </button>
            )}
          </div>

          <div className="detail-item">
            <span className="detail-label">Приоритет:</span>
            <span>{defect.priority}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Исполнитель:</span>
            <span>{engineer ? engineer.username : "Не назначен"}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Крайний срок:</span>
            <span>{formatISODate(defect.due_date) || "—"}</span>
          </div>
        </div>

        <div className="detail-block">
          <label>Фото:</label>
          {getImageSrc() ? (
            <img className="detail-image" src={getImageSrc()} />
          ) : (
            <p>Фото отсутствует</p>
          )}
        </div>

        <p className="detail-created">
          <strong>Создан:</strong>{" "}
          {new Date(defect.created_at).toLocaleString("ru-RU")}
        </p>

    
        <h2 className="detail-comments-title">История изменений</h2>

        <div className="comments-box">
          {isHistoryLoading ? (
            <p>Загрузка...</p>
          ) : history.length === 0 ? (
            <p>Нет записей</p>
          ) : (
            history.map((item) => (
              <div key={item.id} className="comment">
                <div className="comment-header">
                  <span className="comment-author">
                    {item.username || "Система"}
                  </span>
                  <span className="comment-date">
                    {new Date(item.created_at).toLocaleString("ru-RU")}
                  </span>
                </div>
                <div className="comment-text">{item.action}</div>
              </div>
            ))
          )}
        </div>

       
        <h2 className="detail-comments-title">Комментарии</h2>

        <div className="comments-box">
          {isCommentsLoading ? <p>Загрузка...</p> : <CommentList comments={comments} />}
        </div>

        <CommentForm defectId={id} onAdded={loadComments} />
      </main>
    </div>
  );
}
