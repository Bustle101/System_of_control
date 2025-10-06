import { Link } from "react-router-dom";
import './ReportList.css'

export default function ReportsList() {
  const reports = [
    { id: 2, title: "Название", date: "01.01.2025", pathto: "reports" },
    { id: 1, title: "Название", date: "01.01.2025", pathto: "reports" },
  ];

  return (
    <div className="reports-list">
      {reports.map((r) => (
        <Link to={`/${r.pathto}/${r.id}`} key={r.id} className="report-link">
          <div className="report-card">
            <span>Отчёт № {r.id}</span>
            <span>{r.title}</span>
            <span>Дата: {r.date}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
