import styled from "styled-components";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getGames } from "../services/api";
import PanelFiltros from "../components/Filtros/PanelFiltros";


const Inicio = () => {
  const [juegos, setJuegos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarJuegos = async () => {
      try {
        const data = await getGames({ ordering: "-metacritic", page_size: 20 });
        setJuegos(data.results);
      } catch (error) {
        console.error("Error cargando juegos:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarJuegos();
  }, []);

  const manejarFiltros = (filtros) => {
    setCargando(true);
    const params = {
      ordering: "-metacritic",
      page_size: 20,
      ...filtros,
    };
    getGames(params)
      .then((data) => setJuegos(data.results))
      .catch((error) => console.error("Error aplicando filtros:", error))
      .finally(() => setCargando(false));
  };

  if (cargando) return <div>Cargando juegos...</div>;

  return (
    <Container>
      <Title>Mejores Videojuegos</Title>
      <PanelFiltros onApplyFilters={manejarFiltros} />
      <GameList>
        {juegos.map((juego) => (
          <GameItem key={juego.id}>
            <GameImage src={juego.background_image} alt={juego.name} />
            <GameTitle>{juego.name}</GameTitle>
            <p>Puntuación: {juego.metacritic}</p>
            <DetailsButton to={`/juego/${juego.id}`}>Detalles</DetailsButton>
          </GameItem>
        ))}
      </GameList>
    </Container>
  );
};

// Estilos con styled-components
const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const GameList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  list-style: none;
  padding: 0;
`;

const GameItem = styled.li`
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const GameTitle = styled.h2`
  font-size: 18px;
  margin: 10px;
  color: #444;
  transition: color 0.3s;

  &:hover {
    color: #007bff;
  }
`;

const GameImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const DetailsButton = styled(Link)`
  display: inline-block;
  background: #007bff;
  color: white;
  padding: 8px 12px;
  text-decoration: none;
  border-radius: 5px;
  font-size: 14px;
  transition: background 0.3s;

  &:hover {
    background: #0056b3;
  }
`;

export default Inicio;
