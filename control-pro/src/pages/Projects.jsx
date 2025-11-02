import SearchBar from "../components/SearchBar/SearchBar"
import Header from "../components/Header/Header"
import '../css/main.css'
import '../css/proj.css'
import ElProjects from "../components/ElProjects/ElProjects"

const testProjects = [
  { id: 1, name: "ЖК Северный", status: "Фундамент", image: "/images/stroyka.jpg", pathto: "projects" },
  { id: 2, name: "Офисный центр Sky", status: "Отделочные работы", image: "/images/stroyka.jpg", pathto: "projects" },
];


export default function Projects() {
  return (
    <div className="basa">
      <Header />
      <main>
        <div className="projects-header">
          <h1 className="hpage">Проекты</h1>
          <SearchBar className="searchbar" />
        </div>
        
        <button className="adminbutton">Добавить проект</button>
        
        <div className="projects-list">
          {testProjects.map((project) => (
            <ElProjects 
              key={project.id}
              id={project.id}
              name={project.name}
              status={project.status}
              image={project.image}
              pathto={project.pathto}
            />
          ))}
        </div>

      </main>
    </div>
  )
}
