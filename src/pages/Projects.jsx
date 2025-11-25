import { useEffect, useState } from "react";
import api from "../api/axios";
import SearchBar from "../components/SearchBar/SearchBar";
import Header from "../components/Header/Header";
import "../css/main.css";
import "../css/proj.css";
import ElProjects from "../components/ElProjects/ElProjects";
import AddProjectForm from "../components/ElProjects/ProjectForm";
import ModalWrapper from "../components/ModalWrapper/ModalWrapper";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchReset, setSearchReset] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  
  let user = {};
  try {
    const raw = localStorage.getItem("user");
    user = raw && raw !== "undefined" ? JSON.parse(raw) : {};
  } catch {
    user = {};
  }

  const role = user?.role || ""; 

  const canEdit = role === "engineer";
  const canCreate = role === "engineer";
  const canDelete = role === "engineer";

  const loadProjects = () => {
    setLoading(true);
    api
      .get("/orders")
      .then((res) => {
        const data = res.data.data || [];
        setProjects(data);
        setFilteredProjects(data);
      })
      .catch(() => setError("Ошибка загрузки проектов"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreated = () => {
    setSelectedProject(null);
    setShowForm(false);
    loadProjects();
    setSearchReset((v) => v + 1);
  };

  const handleDelete = async (id) => {
    if (!canDelete) return alert("Недостаточно прав");

    if (!window.confirm("Удалить проект?")) return;

    try {
      await api.delete(`/orders/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setFilteredProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Не удалось удалить проект");
    }
  };

  const handleEdit = (id) => {
    if (!canEdit) return alert("Недостаточно прав");

    const project = projects.find((p) => p.id === id);
    setSelectedProject(project);
    setShowForm(true);
  };

  const handleSearch = (query) => {
    if (!query) {
      setFilteredProjects(projects);
      return;
    }

    const lower = query.toLowerCase();

    const filtered = projects.filter((p) => {
      const name = p.name?.toLowerCase() || "";
      const status = p.status?.toLowerCase() || "";
      return name.includes(lower) || status.includes(lower);
    });

    setFilteredProjects(filtered);
  };

  return (
    <div className="container">
      <Header />

      <main>
        <div className="projects-header">
          <h1 className="hpage">Проекты</h1>

          <SearchBar onSearch={handleSearch} resetTrigger={searchReset} />
        </div>

    
        {canCreate && (
          <button
            className="adminbutton"
            onClick={() => {
              setSelectedProject(null);
              setShowForm((v) => !v);
            }}
            style={{ marginBottom: 12 }}
          >
            {showForm ? "Закрыть форму" : "Добавить проект"}
          </button>
        )}

        {showForm && canCreate && (
          <ModalWrapper onClose={() => setShowForm(false)}>
            <AddProjectForm
              onCreated={handleCreated}
              onClose={() => setShowForm(false)}
              editData={selectedProject}
            />
          </ModalWrapper>
        )}

        {loading && <p>Загрузка...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <div className="projects-list">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((p) => (
                <ElProjects
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  status={p.status}
                  image={
                    p.photo_url
                      ? `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${p.photo_url}`
                      : "/images/stroyka.jpg"
                  }
                  pathto="projects"
                  onEdit={canEdit ? handleEdit : null}
                  onDelete={canDelete ? handleDelete : null}
                />
              ))
            ) : (
              <p>Проекты отсутствуют.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
