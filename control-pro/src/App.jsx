import { Routes, Route } from "react-router-dom";
import Entrance from "./pages/Entrance";
import Registration from "./pages/Registration";
import LostPassword from "./pages/LostPassword";
import Home from "./pages/Home";
import Projects from "./pages/Projects";


export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Entrance />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/lost-password" element={<LostPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </>
  );
}
