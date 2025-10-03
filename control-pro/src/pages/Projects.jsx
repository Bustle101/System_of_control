import ElProjects from "../components/ElProjects/ElProjects"
import SearchBar from "../components/SearchBar/SearchBar"
import Header from "../components/Header/Header"
export default function Projects() {
  return (
    <div className="basa">

        <Header></Header>
        <main>
            <div className="projects-header">
                <h1 className="hpage">
                    Проекты
                </h1>
                <SearchBar></SearchBar>
            </div>
            <div className="projects-grid">
                <ElProjects
                title="Название проекта 1"
                
                onDetails={() => alert("Открыть проект 1")}
                />
                <ElProjects
                title="Название проекта 2"
               
                onDetails={() => alert("Открыть проект 2")}
                />
            </div>
        </main>
    </div>

  )
}
