import { useState } from "react";

const Buscador = () => {
  const [busqueda, setBusqueda] = useState("");
  
  const manejarBusqueda = (e) => {
    setBusqueda(e.target.value);
  };
  
  const enviarBusqueda = (e) => {
    e.preventDefault();
    // Aquí irá el código para buscar juegos
    console.log("Buscando:", busqueda);
  };
  
  return (
    <form onSubmit={enviarBusqueda}>
      <input 
        type="text" 
        placeholder="Buscar juegos..." 
        value={busqueda}
        onChange={manejarBusqueda}
      />
      <button type="submit">Buscar</button>
    </form>
  );
};

export default Buscador;
