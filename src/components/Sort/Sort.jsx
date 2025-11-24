import { useState } from "react";
import "./Sort.css";

export default function Sort({ onSort }) {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    const selected = e.target.value;
    setValue(selected);
    onSort(selected); 
  };

  return (
    <div className="sort">
      <select className="sort-types" value={value} onChange={handleChange}>
        <option value="">Без сортировки</option>
        <option value="name">По алфавиту</option>
        <option value="status">По статусу</option>
      </select>
    </div>
  );
}
