import './El.css'
export default function ElProjects({ title, image, onDetails }) {
  return (
    <div className="project-card">
      <h3>{title}</h3>
      <img src={image} alt={title} />
      <button onClick={onDetails}>Подробнее</button>
    </div>
  );
}
