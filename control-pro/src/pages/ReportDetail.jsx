import { useParams,Link } from "react-router-dom";
import '../css/main.css'
import Header from "../components/Header/Header";


export default function ReportDetail() {
  const { id } = useParams(); // достаём ID проекта из адреса
  return (
    <div className="basa">
        <Header></Header>

        <main>
            <div>
                <Link to="/reports">Назад</Link>
            </div>
            <button className="adminbutton">Редактировать</button>
            <button className="adminbutton">Удалить</button>
            <h1>Отчёт{id}</h1>
            <h2>Название отчета</h2>
            <p>описание отчета</p>


        </main>

    </div>
  );
}
