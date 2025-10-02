import '../css/entry.css'
import { Link } from "react-router-dom";

export default function Entrance(){
    return(
        <div class="login-container">
            <div className='link_reg'>
                <Link to="/">Назад</Link>
            </div>
            <h1>ООО «СистемаКонтроля»</h1>
            <p>по работе с строительными объектами</p>
            <h2>Восстановление пароля</h2>
            

            <form>
            <input type="text" placeholder="Почта"/>
            <input type="text" placeholder="Новый пароль"/>
            <input type="password" placeholder="Повторите пароль"/>
            <button type="submit">Далее</button>
            </form>

        </div>
    )
}
