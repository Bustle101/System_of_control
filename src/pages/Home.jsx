import '../css/main.css'
import stroyka from "/images/stroyka.jpg";
import Header from "../components/Header/Header";

export default function Home() {
  return (
    <div className="container">
      
      <Header/>

      <main>
          <h1>ООО «СистемаКонтроля»</h1>
          <p className="subtitle">
            Централизованная система управления дефектами на строительных объектах.
          </p>

          <div className="hero">
            <img src={stroyka} alt="Строительство" />
          </div>

          <div className="about">
            Наша компания специализируется на создании решений для контроля и управления строительными объектами. 
            Мы помогаем фиксировать дефекты, контролировать сроки, получать прозрачные отчёты о ходе работ.
          </div>
      </main>
      
    </div>
  )
}
