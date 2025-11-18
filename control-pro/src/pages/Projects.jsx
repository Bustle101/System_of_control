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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const loadProjects = () => {
    setLoading(true);
    api
      .get("/orders")
      .then((res) => setProjects(res.data.data || []))
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.error?.message || "Ошибка загрузки проектов");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreated = () => {
    setSelectedProject(null);
    setShowForm(false);
    loadProjects();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить проект?")) return;

    try {
      await api.delete(`/orders/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Не удалось удалить проект");
    }
  };

  const handleEdit = (id) => {
    const project = projects.find((p) => p.id === id);
    setSelectedProject(project);
    setShowForm(true);
  };

  return (
    <div className="basa">
      <Header />
      <main>
        <div className="projects-header">
          <h1 className="hpage">Проекты</h1>
          <SearchBar className="searchbar" />
        </div>

        <button
          className="adminbutton"
          onClick={() => {
            setSelectedProject(null);
            setShowForm((v) => !v)
          }}
          style={{ marginBottom: 12 }}
        >
          {showForm ? "Закрыть форму" : "Добавить проект"}
        </button>

        {showForm && (
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
            {projects.length > 0 ? (
              projects.map((p) => (
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
                  onEdit={handleEdit}
                  onDelete={handleDelete}
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
