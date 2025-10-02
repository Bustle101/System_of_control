import { Link } from "react-router-dom";
import '../css/main.css'
import stroyka from "../images/stroyka.jpg";

export default function Home() {
  return (
    <div className="basa">
        <header>
            <div className="logo">СистемаКонтроля</div>
            <nav>
            <a href="/projects">Проекты</a>
            <a href="/defects">Дефекты</a>
            <a href="/reports">Отчёты</a>
            <a href="/contacts">Контакты</a>
            </nav>
            <div className="profile"></div>
        </header>

        <main>
            <h1>ООО «СистемаКонтроля»</h1>
            <p className="subtitle">
            Централизованная ситема управления дефектами на строительных объектах.
            </p>

            <div className="hero">
            <img src={stroyka} alt="Строительство" />
            </div>

            <div className="about">
            Наша компания специализируется на создании решений для контроля и
            управления строительными объектами. Мы помогаем фиксировать дефекты,
            контролировать сроки, получать прозрачные отчёты о ходе работ.
            </div>
        </main>
    </div>

  )
}
