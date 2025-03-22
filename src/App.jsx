import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./componentes/Inicio/Inicio";
import DetalleJuego from "./componentes/DetalleJuego/DetalleJuego";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/juego/:id" element={<DetalleJuego />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
