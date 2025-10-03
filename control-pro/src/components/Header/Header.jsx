import './Header.css'
import { Link } from "react-router-dom";


export default function Header(){
    return(
        <header>
            <div className="logo">
                <Link to="/home">СистемаКонтроля</Link>
            </div>

            <nav>
                <Link to="/projects">Проекты</Link>
                <Link to="/defects">Дефекты</Link>
                <Link to="/reports">Отчеты</Link>
                <Link to="/contacts">Контакты</Link>
            </nav>
            <div className="profile"></div>
        </header>
    )
}