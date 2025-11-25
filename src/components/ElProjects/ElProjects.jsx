import './El.css'
import { Link } from "react-router-dom";

export default function ElProjects({ id, name, status, image, pathto, onEdit, onDelete }) {
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

      <h3>{name}</h3>
      <img src={image} alt={name} width="200" />
      <p>Этап: {status}</p>

      <Link to={`/${pathto}/${id}`}>
        <button className="details-btn">Подробнее</button>
      </Link>
    </div>
  );
}
