import { Routes, Route } from "react-router-dom";
import Entrance from "./pages/Entrance";
import Registration from "./pages/Registration";
import LostPassword from "./pages/LostPassword";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Defects from "./pages/Defects";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";


export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Entrance />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/lost-password" element={<LostPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/defects" element={<Defects />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}
