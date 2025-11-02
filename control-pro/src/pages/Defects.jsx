
import SearchBar from "../components/SearchBar/SearchBar"
import Header from "../components/Header/Header"
import Filter from "../components/Filter/Filter"
import Sort from "../components/Sort/Sort"
import '../css/proj.css'

import ElProjects from "../components/ElProjects/ElProjects"


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
            <button className="adminbutton">Добавить дефект</button>
            <div className="projects-list">
                {testProjects2.map((project) => (
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
