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

const getName = (d) => d?.title?.toLowerCase() || "";

export default function Defects() {
  const [defects, setDefects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filteredDefects, setFilteredDefects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [selectedDefect, setSelectedDefect] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortType, setSortType] = useState("");

  const [searchReset, setSearchReset] = useState(0);


  let user = {};
  try {
    const raw = localStorage.getItem("user");
    user = raw && raw !== "undefined" ? JSON.parse(raw) : {};
  } catch {
    user = {};
  }

  const role = user.role || "";
  const canEdit = role === "engineer";
  const canCreate = role === "engineer";
  const canDelete = role === "engineer";

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
      projectsData.forEach((p) => (projectMap[p.id] = p.name));

      const enriched = defectsData.map((d) => ({
        ...d,
        project_name: projectMap[d.project_id] || "Не найден"
      }));

      setDefects(enriched);
      setFilteredDefects(enriched);
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

  const cleanStatus = (s) =>
    (s || "").toLowerCase().replace(/"/g, "").replace(/[\s\u00A0]+/g, " ").trim();

  const applyFilters = (list, { search, status, sort }) => {
    let result = [...list];

    if (search.trim()) {
      const lower = search.toLowerCase();

      result = result.filter((defect) => {
        const name =
          defect.title?.toLowerCase() ||
          defect.defect_name?.toLowerCase() ||
          defect.label?.toLowerCase() ||
          "";

        const project = defect.project_name?.toLowerCase() || "";
        return name.includes(lower) || project.includes(lower);
      });
    }

    if (status) {
      result = result.filter(
        (d) => cleanStatus(d.status) === cleanStatus(status)
      );
    }

    if (sort) {
      result = applySort(result, sort);
    }

    return result;
  };

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
    const newList = applyFilters(defects, {
      search: query.toLowerCase(),
      status: filterStatus,
      sort: sortType
    });
    setFilteredDefects(newList);
  };

  const handleFilter = (status) => {
    setFilterStatus(status);
    const newList = applyFilters(defects, {
      search: searchQuery,
      status,
      sort: sortType
    });
    setFilteredDefects(newList);
  };

  const handleSort = (type) => {
    setSortType(type);
    const newList = applyFilters(defects, {
      search: searchQuery,
      status: filterStatus,
      sort: type
    });
    setFilteredDefects(newList);
  };

  const applySort = (array, type) => {
    let sorted = [...array];

    if (type === "name") {
      sorted.sort((a, b) =>
        getName(a).localeCompare(getName(b), "ru")
      );
    }

    if (type === "status") {
      const order = ["новый", "в работе", "на проверке", "закрыт"];
      sorted.sort(
        (a, b) =>
          order.indexOf(cleanStatus(a.status)) -
          order.indexOf(cleanStatus(b.status))
      );
    }

    return sorted;
  };

  const handleDelete = async (id) => {
    if (!canDelete) return alert("Недостаточно прав");

    if (!window.confirm("Удалить дефект?")) return;

    try {
      await api.delete(`/orders/defects/${id}`);
      loadAll();
    } catch (e) {
      alert("Ошибка удаления");
    }
  };

  const handleEdit = (id) => {
    if (!canEdit) return alert("Недостаточно прав");

    const defect = defects.find((d) => d.id === id);
    setSelectedDefect(defect);
    setShowForm(true);
  };

  const handleCreated = () => {
    setSelectedDefect(null);
    setShowForm(false);
    loadAll();
    setSearchReset((v) => v + 1);
  };

  return (
    <div className="container">
      <Header />

      <main>
        <div className="projects-header">
          <h1 className="hpage">Дефекты</h1>

          <Filter onFilter={handleFilter} />
          <Sort onSort={handleSort} />
          <SearchBar onSearch={handleSearch} resetTrigger={searchReset} />
        </div>

      
        {canCreate && (
          <button
            className="adminbutton"
            onClick={() => {
              setSelectedDefect(null);
              setShowForm((v) => !v);
            }}
          >
            {showForm ? "Закрыть форму" : "Добавить дефект"}
          </button>
        )}

        {showForm && canCreate && (
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
            {filteredDefects.length > 0 ? (
              filteredDefects.map((d) => (
                <ElDefect
                  key={d.id}
                  {...d}
                  project={d.project_name}
                  onEdit={canEdit ? handleEdit : null}
                  onDelete={canDelete ? handleDelete : null}
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
