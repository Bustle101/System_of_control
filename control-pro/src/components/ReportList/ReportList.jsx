// src/components/ReportsList.jsx
import './ReportList.css'
export default function ReportsList() {
  const reports = [
    { id: 2, title: "Название", date: "01.01.2025" },
    { id: 1, title: "Название", date: "01.01.2025" },
  ];

  return (
    <div className="reports-list">
      {reports.map((r) => (
        <div key={r.id} className="report-card">
          <span>Отчёт № {r.id}</span>
          <span>{r.title}</span>
          <span>Дата: {r.date}</span>
        </div>
      ))}
    </div>
  );
}
