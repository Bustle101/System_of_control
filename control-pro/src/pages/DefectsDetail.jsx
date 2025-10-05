import { useParams,Link } from "react-router-dom";
import '../css/main.css'
import Header from "../components/Header/Header";


export default function Defectsdetail() {
  const { id } = useParams(); // достаём ID проекта из адреса
  return (
    <div className="basa">
        <Header></Header>

        <main>
            <div>
                <Link to="/defects">Назад</Link>
            </div>
            <h1>Дефект #{id}</h1>
            <h2>Название проекта</h2>
            <p>описание дефекта</p>
            <p>Статус дефекта</p>
            <p>Комментарии: </p>
        </main>

    </div>
  );
}
