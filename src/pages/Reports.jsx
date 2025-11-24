import { useState } from "react";
import ReportsList from "../components/ReportList/ReportList";
import ChartsView from "../components/ChartsView/ChartsView";
import SearchBar from "../components/SearchBar/SearchBar";
import Header from "../components/Header/Header";

import '../css/main.css'



export default function Reports() {
  const [activeTab, setActiveTab] = useState("reports");



  return (
    <div className="basa">
      <Header></Header>  
      {/* Переключатель */}
      <main>
        <div className="projects-header">
            <button style={{marginLeft: '100px'}}
            className={activeTab === "reports" ? "tab active" : "tab"}
            onClick={() => setActiveTab("reports")}
            >
            Отчёты
            </button>
            <button
            className={activeTab === "charts" ? "tab active" : "tab"}
            onClick={() => setActiveTab("charts")}
            >
            Диаграммы
            </button>

            <SearchBar placeholder="Поиск..." onSearch={(q) => console.log(q)} />
        </div>

        {/* Контент */}
        {activeTab === "reports" ? <ReportsList /> : <ChartsView />}
      </main>
    </div>
  );
}
