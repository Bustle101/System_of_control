import './El.css'

export default function ElProjects({ title, image, onDetails, status }) {
  return (
    <div className="project-card">
      <h3>{title}</h3>
      <img src={image} alt={title} />
      <p >{status}</p>
      <button onClick={onDetails}>Подробнее</button>

    </div>
  );
}
