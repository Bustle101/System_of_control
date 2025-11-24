import { useState } from "react";
import api from "../../api/axios";
import "./ProjectForm.css"; 

export default function ProjectForm({ onCreated, onClose, editData }) {
  const isEdit = Boolean(editData);
  const [status, setStatus] = useState(editData?.status || "создан");
  const [name, setName] = useState(editData?.name || "");
  const [description, setDescription] = useState(editData?.description || "");
  const [total, setTotal] = useState(editData?.total || "");
  const [file, setFile] = useState(null);
  const [existingPhoto, setExistingPhoto] = useState(editData?.photo_url || null);



  const normalizeItems = (raw) => {
  if (!raw) return [{ name: "", qty: 1 }];

  // если уже массив – просто возвращаем
  if (Array.isArray(raw)) return raw;

  // если пришла строка (например, из старых данных) – пробуем распарсить
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // если парс не удался – падаем ниже и вернём дефолт
    }
  }

  // если пришёл объект или что-то ещё — игнорируем и даём дефолт
    return [{ name: "", qty: 1 }];
  };

  const [items, setItems] = useState(() => normalizeItems(editData?.items));

  
  
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const addItem = () => setItems((prev) => [...prev, { name: "", qty: 1 }]);
  const removeItem = (idx) => setItems((prev) => prev.filter((_, i) => i !== idx));
  const updateItem = (idx, field, value) =>
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it))
    );

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setExistingPhoto(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setExistingPhoto(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const cleanItems = items
      .map((it) => ({
        name: (it.name || "").trim(),
        qty: Number(it.qty) || 0,
      }))
      .filter((it) => it.name && it.qty > 0);

    try {
      setPending(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("total", Number(total) || 0);
      formData.append("items", JSON.stringify(cleanItems));
      formData.append("status", status);


      if (file) formData.append("file", file);
      if (!file && existingPhoto) formData.append("photo_url", existingPhoto);

      if (!isEdit) {
        await api.post("/orders", formData);
      } else {
        await api.put(`/orders/${editData.id}`, formData);
      }

      onCreated();
    } catch (e) {
      setError("Ошибка сохранения проекта");
    } finally {
      setPending(false);
    }
  };

  return (
    <form className="projform-container" onSubmit={handleSubmit}>
      <h2 className="projform-title">
        {isEdit ? "Редактировать проект" : "Создать проект"}
      </h2>

      {error && <p className="projform-error">{error}</p>}

      <label className="projform-label">
        Название проекта
        <input
          className="projform-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
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

      <fieldset className="projform-fieldset">
        <legend className="projform-legend">Состав проекта</legend>

        {Array.isArray(items) &&
          items.map((it, idx) => (
            <div key={idx} className="projform-item-row">
              <input
                className="projform-input"
                value={it.name}
                onChange={(e) => updateItem(idx, "name", e.target.value)}
                placeholder="Материал (ед. изм.)"
              />

              <input
                className="projform-input small"
                type="number"
                min="1"
                value={it.qty}
                onChange={(e) => updateItem(idx, "qty", e.target.value)}
                placeholder="Кол-во"
              />

              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="projform-delete-btn"
              >
                Удалить
              </button>
            </div>
          ))
        }


        <button
          type="button"
          onClick={addItem}
          className="projform-add-btn"
        >
          + Добавить позицию
        </button>
      </fieldset>

      <label className="projform-label">
        Бюджет проекта (руб.)
        <input
          className="projform-input"
          type="number"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
        />
      </label>

      <label className="projform-label">
        <p>Статус проекта</p>
        <select
          className="projform-input"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="создан">Создан</option>
          <option value="в работе">В работе</option>
          <option value="выполнен">Выполнен</option>
          <option value="отменён">Отменён</option>
        </select>
      </label>


      {/* === ФОТО === */}
      <label className="projform-label">
        Фото

        {/* скрытый input */}
        <input
          type="file"
          className="projform-file-hidden"
          id="projform-file"
          onChange={handleFile}
        />

        {/* кастомная кнопка */}
        <div htmlFor="projform-file" className="projform-file-btn">
          Выбрать файл
        </div>
      </label>


      {file && (
        <div className="projform-filebox">
          <span>{file.name}</span>
          <button type="button" className="projform-delete-btn" onClick={removeFile}>
            Удалить
          </button>
        </div>
      )}

      {!file && existingPhoto && (
        <div className="projform-filebox">
          <span>{existingPhoto.split("/").pop()}</span>
          <button
            type="button"
            className="projform-delete-btn"
            onClick={() => setExistingPhoto(null)}
          >
            Удалить
          </button>
        </div>
      )}

  <div className="projform-submit-wrapper">
    <button className="projform-submit" disabled={pending}>
      {isEdit ? "Сохранить" : "Создать"}
    </button>
  </div>

    </form>
  );
}
