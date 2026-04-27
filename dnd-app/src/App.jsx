import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";

import Home from "./pages/Home";
import Detalle from "./pages/Detalle";
import Favoritos from "./pages/Favoritos";
import Original from "./pages/Original";
import Info from "./pages/Info";
import Usuario from "./pages/Usuario";

function App() {
  const [loading, setLoading] = useState(true);

useEffect(() => {
  setTimeout(() => setLoading(false), 2000);
}, []);

if (loading) {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#0a0a1f",
      color: "white",
      fontSize: "2rem"
    }}>
      🧙 Cargando mundo mágico...
    </div>
  );
}
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detalle/:id" element={<Detalle />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/original" element={<Original />} />
        <Route path="/info" element={<Info />} />
        <Route path="/usuario" element={<Usuario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;