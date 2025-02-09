import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Anlagen from "./pages/Anlagen.jsx";
import Profile from "./pages/Profile.jsx";
import OberflaechenUndAnwendungen from "./pages/OberflaechenUndAnwendungen.jsx"; // ✅ Richtiger Import

const Home = () => (
  <div>
    <h1>Willkommen zur Extrusions-App</h1>
    <nav>
      <ul>
        <li><Link to="/anlagen">Extrusionsanlagen</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/oberflaechen-anwendungen">Oberflächen & Anwendungen</Link></li> {/* ✅ Korrekte Verlinkung */}
      </ul>
    </nav>
  </div>
);

ReactDOM.createRoot(document.getElementById("root")).render(
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anlagen" element={<Anlagen />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/oberflaechen-anwendungen" element={<OberflaechenUndAnwendungen />} /> {/* ✅ Jetzt innerhalb von <Routes> */}
      </Routes>
    </Router>
);
