import ElProjects from "../components/ElProjects/ElProjects"
import SearchBar from "../components/SearchBar/SearchBar"
import Header from "../components/Header/Header"
import Filter from "../components/Filter/Filter"
import Sort from "../components/Sort/Sort"

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
            <div className="projects-grid">
                <ElProjects
                title="Название дефекта 1"
                status = "status"
                
                />
                <ElProjects
                title="Название дефекта 2"
                status = "status"
                />
            </div>
        </main>
    </div>

  )
}
