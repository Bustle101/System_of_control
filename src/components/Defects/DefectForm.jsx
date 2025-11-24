import { useState, useEffect } from "react";
import api from "../../api/axios";
import "./DefectForm.css";

export default function DefectForm({ onCreated, onClose, editData }) {
  const isEdit = Boolean(editData);

  const [projectId, setProjectId] = useState(editData?.project_id || "");
  const [title, setTitle] = useState(editData?.title || "");
  const [description, setDescription] = useState(editData?.description || "");
  const [priority, setPriority] = useState(editData?.priority || "средний");
  const [assignedToId, setAssignedToId] = useState(editData?.assigned_to_id || "");
  const [dueDate, setDueDate] = useState(editData?.due_date || "");
  const [status, setStatus] = useState(editData?.status || "новый");

  
  const [file, setFile] = useState(null);

  const [projects, setProjects] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/orders").then((r) => setProjects(r.data.data || []));
    api.get("/users/engineers").then((r) => setEngineers(r.data.data || []));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPending(true);

    try {
      const formData = new FormData();
      formData.append("project_id", projectId);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("priority", priority);
      formData.append("assigned_to_id", assignedToId || "");
      formData.append("due_date", dueDate || "");
      formData.append("status", status);

      if (file) formData.append("file", file);

      if (!isEdit) {
        const res = await api.post("/orders/defects", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        console.log("Ответ сервера:", res.data);
      } else {
        const res = await api.put(`/orders/defects/${editData.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        console.log("Ответ сервера (update):", res.data);
      }


      onCreated();

    } catch (err) {
        console.log(err.response?.data);   
        setError("Ошибка сохранения");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="projform-container">

      <h2 className="projform-title">
        {isEdit ? "Редактировать дефект" : "Создать дефект"}
      </h2>

      {error && <p className="projform-error">{error}</p>}

      <label className="projform-label">
        Проект
        <select
          className="projform-input"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          required
        >
          <option value="">-- выберите проект --</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </label>

      <label className="projform-label">
        Заголовок
        <input
          className="projform-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>

      <label className="projform-label">
        Описание
        <textarea
          className="projform-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <label className="projform-label">
        Приоритет
        <select
          className="projform-input"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="низкий">Низкий</option>
          <option value="средний">Средний</option>
          <option value="высокий">Высокий</option>
        </select>
      </label>

      <label className="projform-label">
        Исполнитель
        <select
          className="projform-input"
          value={assignedToId}
          onChange={(e) => setAssignedToId(e.target.value)}
        >
          <option value="">-- не назначен --</option>
          {engineers.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username} ({u.email})
            </option>
          ))}
        </select>
      </label>

      <label className="projform-label">
        Срок
        <input
          className="projform-input"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </label>


      <label className="projform-label">
        Фото
        <input
          type="file"
          className="projform-file-hidden"
          id="defect-file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <label htmlFor="defect-file" className="projform-file-btn">
          Добавить
        </label>

        {file && (
          <span style={{ fontSize: "14px", marginTop: "6px" }}>
            {file.name}
          </span>
        )}
      </label>

      <label className="projform-label">
        Статус
        <select
          className="projform-input"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="новый">Новый</option>
          <option value="в работе">В работе</option>
          <option value="на проверке">На проверке</option>
          <option value="закрыт">Закрыт</option>
        </select>
      </label>

      <div className="projform-buttons">
        <button className="projform-submit" disabled={pending}>
          {isEdit ? "Сохранить" : "Создать"}
        </button>

      </div>

    </form>
  );
}
