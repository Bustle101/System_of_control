import './Filter.css'
export default function Filter() {
  return (
    <div className="filter">
        <select className="filter-types">
            <option >Новый</option>
            <option >В работе</option>
            <option >На проверке</option>
            <option >Закрыт/Отменен</option>
        </select>   
        <button ></button>
    </div>
  );
}
