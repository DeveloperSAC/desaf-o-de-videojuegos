import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio";
import DetalleJuego from "./components/Juego/DetalleJuego";

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

