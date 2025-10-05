import { useParams,Link } from "react-router-dom";
import '../css/main.css'
import Header from "../components/Header/Header";
import '../css/proj.css'


export default function ProjectDetail() {
  const { id } = useParams(); // достаём ID проекта из адреса
  return (
    <div className="basa">
        <Header></Header>

        <main>
            <div>
                <Link to="/projects">Назад</Link>
            </div>
            <h1>Проект #{id}</h1>
            <h2>Название проекта</h2>
            <p>описание проекта</p>
            <p>Этап проекта</p>
            <p>Дефекты на проекте:</p>
            <ul>
                <li>1</li>
                <li>2</li>        
            </ul>
        </main>

    </div>
  );
}
