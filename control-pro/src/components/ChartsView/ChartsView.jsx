
import './ChartsView.css'

export default function ChartsView() {
  const charts = [
  { id: 1, name: "Диаграмма 1", year: 2023, image: "/images/chart1.png" },
  { id: 2, name: "Диаграмма 2", year: 2024, image: "/images/chart2.png" },
];
  return (
    <div className="charts-view">

      
      {charts.map(c => (
        
        <div key={c.id} className="charts-view">
          <button className="adminbutton">Редактировать</button>
          <button className="adminbutton">Удалить</button>
          <h3>{c.name}</h3>
          <img src={c.image} alt={c.name} />
          <p>{c.year}</p>
        </div>
      ))}
  
    
    </div>
  );
}
