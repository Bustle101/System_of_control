import '../css/entry.css'
import { Link } from "react-router-dom";


export default function Registration(){
    return(
         <div className="login-container">
            <div className='link_reg'>
                <Link to="/">Назад</Link>
            </div>
            <h1>ООО «СистемаКонтроля»</h1>
            <p>по работе с строительными объектами</p>
            <h2>Регистрация</h2>
            

            <form>
            <input type="text" placeholder="Логин"/>
            <input type="text" placeholder="Почта"/>

            <input type="password" placeholder="Пароль"/>
            <input type="password" placeholder="Повторите пароль"/>
            <select className="roles">
                <option >Менеджер</option>
                <option >Инженер</option>
                <option >Наблюдатель</option>
            </select>
            <button type="submit">Далее</button>
            </form>

        </div>
    )
}