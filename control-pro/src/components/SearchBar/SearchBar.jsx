import './SearchBar.css'
export default function SearchBar({ placeholder, onSearch }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={placeholder || "Поиск..."}
        onChange={(e) => onSearch(e.target.value)}
      />
      <button>
        🔍
      </button>
    </div>
  );
}
