import { useState } from "react";
import "./Filter.css";

export default function Filter({ onFilter }) {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    const selected = e.target.value;
    setValue(selected);
    onFilter(selected); 
  };

  return (
    <div className="filter">
      <select className="filter-types" value={value} onChange={handleChange}>
        <option value="">Все</option>
        <option value="Новый">новый</option>
        <option value="В работе">в работе</option>
        <option value="На проверке">на проверке</option>
        <option value="Закрыт/Отменен">закрыт</option>
      </select>
    </div>
  );
}
