
import SearchBar from "../components/SearchBar/SearchBar"
import Header from "../components/Header/Header"
import Filter from "../components/Filter/Filter"
import Sort from "../components/Sort/Sort"
import '../css/proj.css'
import { Link } from "react-router-dom";


const testProjects2 = [
  { id: 1, name: "Трещины", nameproj: "Проект1",status: "В работе", image: "/images/stroyka.jpg", pathto: "defects" },
  { id: 2, name: "Вздутие", nameproj: "Проект2",status: "Отменен", image: "/images/stroyka.jpg", pathto: "defects" },
];

export default function Defects() {
  return (
    <div className="basa">

        <Header></Header>
        <main>
            <div className="projects-header">
                <h1 className="hpage">
                    Дефекты
                </h1>
                <Sort></Sort>
                <Filter></Filter>
                <SearchBar></SearchBar>

            </div>
            <div className="projects-list">
                {testProjects2.map((project) => (
                <div className="project-card" key={project.id}>
                    <h2>{project.name}</h2>
                    <h3>{project.nameproj}</h3>
                    <img src={project.image} alt={project.name} width="200" />
                    <p>Статус: {project.status}</p>
                    <Link to={`/${project.pathto}/${project.id}`}>
                        <button className="details-btn">Подробнее</button>
                    </Link>
                </div>
                ))}
            </div>
        </main>
    </div>

  )
}
