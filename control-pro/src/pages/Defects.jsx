import { useEffect, useState } from "react";
import api from "../api/axios";

import SearchBar from "../components/SearchBar/SearchBar";
import Header from "../components/Header/Header";
import Filter from "../components/Filter/Filter";
import Sort from "../components/Sort/Sort";
import "../css/proj.css";

import ElDefect from "../components/Defects/ElDefect";
import DefectForm from "../components/Defects/DefectForm";
import ModalWrapper from "../components/ModalWrapper/ModalWrapper";


export default function Defects() {
  const [defects, setDefects] = useState([]);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedDefect, setSelectedDefect] = useState(null);

  const loadAll = async () => {
    try {
      setLoading(true);

      const [defRes, projRes] = await Promise.all([
        api.get("/orders/defects"),
        api.get("/orders")
      ]);

      const defectsData = defRes.data.data || [];
      const projectsData = projRes.data.data || [];

      const projectMap = {};
      projectsData.forEach(p => projectMap[p.id] = p.name);

      const enriched = defectsData.map(d => ({
        ...d,
        project_name: projectMap[d.project_id] || "Не найден"
      }));

      setDefects(enriched);
      setProjects(projectsData);

    } catch (err) {
      console.error(err);
      setError("Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить дефект?")) return;

    try {
      await api.delete(`/orders/defects/${id}`);
      setDefects((prev) => prev.filter((d) => d.id !== id));
    } catch (e) {
      alert("Ошибка удаления");
    }
  };

  const handleEdit = (id) => {
    const defect = defects.find(d => d.id === id);
    setSelectedDefect(defect);
    setShowForm(true);
  };

  const handleCreated = () => {
    setSelectedDefect(null);
    setShowForm(false);
    loadAll();
  };

  return (
    <div className="basa">
      <Header />

      <main>
        <div className="projects-header">
          <h1 className="hpage">Дефекты</h1>
          <Sort />
          <Filter />
          <SearchBar />
        </div>

        <button className="adminbutton" onClick={() => {
          setSelectedDefect(null);
          setShowForm((v) => !v);
        }}>
          {showForm ? "Закрыть форму" : "Добавить дефект"}
        </button>

        {showForm && (
          <ModalWrapper onClose={() => setShowForm(false)}>
            <DefectForm
              onCreated={handleCreated}
              onClose={() => setShowForm(false)}
              editData={selectedDefect}
            />
          </ModalWrapper>
        )}


        {loading && <p>Загрузка...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <div className="projects-list">
            {defects.length > 0 ? (
              defects.map(d => (
                <ElDefect
                  key={d.id}
                  {...d}
                  project={d.project_name}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <p>Дефекты отсутствуют.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
