import './El.css'
import { Link } from "react-router-dom";

export default function ElProjects({ id, name, status, image, pathto }) {
  return (
    <div className="project-card">
      <h3>{name}</h3>
      <img src={image} alt={name} width="200" />
      <p>Этап: {status}</p>
      <Link to={`/${pathto}/${id}`}>
        <button className="details-btn">Подробнее</button>
      </Link>
    </div>
  );
}
