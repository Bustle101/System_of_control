import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import Header from "../components/Header/Header";
import api from "../api/axios"; 
import "../css/main.css";

const STATUSES = ["создан", "в работе", "выполнен", "отменён"];

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const canChangeStatus = useMemo(() => {
    if (!project) return false;
    return project.status !== "выполнен" && project.status !== "отменён";
  }, [project]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/orders/${id}`);
      setProject(res.data.data);
      setStatus(res.data.data.status);
    } catch (e) {
      const msg = e?.response?.data?.error?.message || "Ошибка загрузки проекта";
      setError(msg);
      // если токен истёк — можно редиректнуть на логин
      if (e?.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
   
  }, [id]);

  const updateStatus = async () => {
    if (!STATUSES.includes(status)) return;
    setPending(true);
    setError(null);
    try {
      const res = await api.put(`/orders/${id}/status`, { status });
      setProject(res.data.data);
    } catch (e) {
      setError(e?.response?.data?.error?.message || "Не удалось обновить статус");
    } finally {
      setPending(false);
    }
  };

  const cancelProject = async () => {
    if (!confirm("Отменить проект?")) return;
    setPending(true);
    setError(null);
    try {
      const res = await api.delete(`/orders/${id}`);
      setProject(res.data.data);
      setStatus(res.data.data.status);
    } catch (e) {
      setError(e?.response?.data?.error?.message || "Не удалось отменить проект");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="basa">
      <Header />
      <main>
        <div>
          <Link to="/projects">← Назад</Link>
        </div>

        {loading && <p>Загрузка...</p>}
        {error && <p className="error">{error}</p>}

        {project && (
          <>
            <h1>Проект: {project.name}</h1>
            <p><strong>Описание:</strong> {project.description || "Нет описания"}</p>
            <p><strong>Статус:</strong> {project.status}</p>
            <p><strong>Сумма:</strong> {Number(project.total || 0).toLocaleString("ru-RU")} ₽</p>

            {Array.isArray(project.items) && project.items.length > 0 && (
              <>
                <h3>Состав проекта:</h3>
                <ul>
                  {project.items.map((item, i) => (
                    <li key={i}>
                      {item.name} — {item.qty}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}>
              <label>
                Изменить статус:&nbsp;
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={!canChangeStatus || pending}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>
              <button onClick={updateStatus} disabled={!canChangeStatus || pending}>
                Сохранить статус
              </button>
              <button onClick={cancelProject} disabled={project.status === "отменён" || pending}>
                Отменить проект
              </button>
              <button onClick={load} disabled={pending}>
                Обновить
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
