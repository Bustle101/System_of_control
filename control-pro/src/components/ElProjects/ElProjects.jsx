import './El.css'
import { Link } from "react-router-dom";

export default function ElProjects({ title, image, status, nameproj, pathto }) {
  return (
    <div className="project-card">
      <h3>{title}</h3>
      <h4>{nameproj}</h4>
      <img src={image} alt={title} />
      <p >{status}</p>

      <Link to={`/${pathto}/${project.id}`}>
        <button className="details-btn">Подробнее</button>
      </Link>

    </div>
  );
}
