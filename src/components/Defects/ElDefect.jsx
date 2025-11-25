import "./ElDefect.css";
import { Link } from "react-router-dom";

function formatISODate(isoString) {
  if (!isoString) return null;

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

export default function ElDefect({
  id,
  title,
  status,
  priority,
  project,
  due_date,
  onEdit,
  onDelete
}) {
  const formattedDueDate = formatISODate(due_date);

  return (
    <div className="project-card">

      
      {(onEdit || onDelete) && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          {onEdit && (
            <button className="adminbutton" onClick={() => onEdit(id)}>
              Редактировать
            </button>
          )}

          {onDelete && (
            <button
              className="adminbutton"
              style={{ backgroundColor: "#d16565" }}
              onClick={() => onDelete(id)}
            >
              Удалить
            </button>
          )}
        </div>
      )}

      <h3>{title}</h3>
      <p><strong>Проект:</strong> {project}</p>
      <p><strong>Статус:</strong> {status || "не указан"}</p>
      <p><strong>Приоритет:</strong> {priority || "—"}</p>

      {formattedDueDate && (
        <p><strong>Крайний срок:</strong> {formattedDueDate}</p>
      )}

      <Link to={`/defects/${id}`}>
        <button className="details-btn">Подробнее</button>
      </Link>
    </div>
  );
}
