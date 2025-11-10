import { useState } from "react";
import api from "../../api/axios";

export default function AddProjectForm({ onCreated, onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [total, setTotal] = useState("");
  const [items, setItems] = useState([{ name: "", qty: 1 }]); 
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const addItem = () => setItems((prev) => [...prev, { name: "", qty: 1 }]);

  const removeItem = (idx) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));

  const updateItem = (idx, field, value) =>
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it))
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Название проекта обязательно");
      return;
    }


    const cleanItems = items
      .map((it) => ({ name: (it.name || "").trim(), qty: Number(it.qty) || 0 }))
      .filter((it) => it.name && it.qty > 0);

    try {
      setPending(true);
      const res = await api.post("/orders", {
        name: name.trim(),
        description: description?.trim() || null,
        items: cleanItems,           
        total: total === "" ? 0 : Number(total) || 0, 
        photo_url: photoUrl?.trim() || null,        
       
      });
      onCreated?.(res.data.data);
      onClose?.();
      setName("");
      setDescription("");
      setPhotoUrl("");
      setTotal("");
      setItems([{ name: "", qty: 1 }]);
    } catch (e) {
      setError(e?.response?.data?.error?.message || "Не удалось создать проект");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}
      style={{ display: "grid", gap: 8, maxWidth: 560, marginBottom: 16 }}>
      {error && <div className="error" style={{ color: "crimson" }}>{error}</div>}

      <label>
        Название проекта
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          
        />
      </label>

      <label>
        Описание
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
         
        />
      </label>

      <fieldset style={{ border: "1px solid #ddd", padding: 12 }}>
        <legend>Состав проекта</legend>
        <div style={{ display: "grid", gap: 8 }}>
          {items.map((it, idx) => (
            <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 140px 90px", gap: 8, alignItems: "center" }}>
              <input
                type="text"
                placeholder="Наименование (бетон, арматура...)"
                value={it.name}
                onChange={(e) => updateItem(idx, "name", e.target.value)}
              />
              <input
                type="number"
                min="1"
                step="1"
                placeholder="Кол-во"
                value={it.qty}
                onChange={(e) => updateItem(idx, "qty", e.target.value)}
              />
              <button type="button" onClick={() => removeItem(idx)}>
                Удалить
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addItem} style={{ marginTop: 8 }}>
          + Добавить позицию
        </button>
      </fieldset>

      <label>
        Бюджет проекта (руб.)
        <input
          type="number"
          step="0.01"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          placeholder="0.00"
        />
      </label>

      <label>
        Ссылка на фото (photo_url)
        <input
          type="text"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          placeholder="https://..."
        />
      </label>

      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" className="adminbutton" disabled={pending}>
          {pending ? "Создание..." : "Создать проект"}
        </button>
        <button type="button" onClick={onClose} disabled={pending}>
          Отмена
        </button>
      </div>
    </form>
  );
}
