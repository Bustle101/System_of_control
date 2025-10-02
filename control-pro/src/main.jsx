import './index.css'
import App from './App.jsx'
import ReactDOM from 'react-dom/client' 
import { BrowserRouter } from 'react-router-dom'   // <-- вот это

const root = document.getElementById('root')

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
