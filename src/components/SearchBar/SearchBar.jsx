import './SearchBar.css';
import { useState, useRef, useEffect } from 'react';

export default function SearchBar({ 
  placeholder = 'Поиск...', 
  onSearch, 
  debounce = 300,
  resetTrigger
}) {
  const [value, setValue] = useState('');
  const timeoutRef = useRef(null);

  useEffect(() => {
    setValue('');
  }, [resetTrigger]);
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);

  
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

   
    timeoutRef.current = setTimeout(() => {
      onSearch(newValue);
    }, debounce);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        aria-label="Поле поиска"
      />
      <button type="submit" className="search-bar__search-btn" aria-label="Выполнить поиск">
        🔍
      </button>
    </form>
  );
}
