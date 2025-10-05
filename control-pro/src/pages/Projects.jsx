
import SearchBar from "../components/SearchBar/SearchBar"
import Header from "../components/Header/Header"
import '../css/main.css'
import '../css/proj.css'
import { Link } from "react-router-dom";

const testProjects = [
  { id: 1, name: "ЖК Северный", status: "Фундамент", image: "/images/stroyka.jpg", pathto: "projects" },
  { id: 2, name: "Офисный центр Sky", status: "Отделочные работы", image: "/images/stroyka.jpg", pathto: "projects" },
];



export default function Projects() {
  return (
    <div className="basa">

        <Header></Header>
        <main>
            <div className="projects-header">
                <h1 className="hpage">
                    Проекты
                </h1>
                <SearchBar className="searchbar"></SearchBar>
            </div>
            <div className="projects-list">
                {testProjects.map((project) => (
                <div className="project-card" key={project.id}>
                    <h2>{project.name}</h2>
                    <img src={project.image} alt={project.name} width="200" />
                    <p>Этап: {project.status}</p>
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
