import { Routes, Route } from "react-router-dom";
import Entrance from "./pages/Entrance";
import Registration from "./pages/Registration";
import LostPassword from "./pages/LostPassword";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Entrance />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/lost-password" element={<LostPassword />} />
      </Routes>
    </>
  );
}
