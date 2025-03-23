import styled from "styled-components";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getGames } from "../services/api";
import PanelFiltros from "../components/Filtros/PanelFiltros";

const Inicio = () => {
  const [juegos, setJuegos] = useState([]);
  const [cargando, setCargando] = useState(true);
  // Nuevos estados para manejar errores y casos sin resultados
  const [error, setError] = useState(null);
  const [sinResultados, setSinResultados] = useState(false);

  useEffect(() => {
    const cargarJuegos = async () => {
      try {
        const data = await getGames({ ordering: "-metacritic", page_size: 20 });
        setJuegos(data.results);
        setSinResultados(data.results.length === 0);
      } catch (error) {
        console.error("Error cargando juegos:", error);
        setError("No pudimos cargar los juegos. Por favor, intenta de nuevo.");
      } finally {
        setCargando(false);
      }
    };

    cargarJuegos();
  }, []);

  const manejarFiltros = (filtros) => {
    setCargando(true);
    setError(null);
    setSinResultados(false);
    
    // Parámetros para la API RAWG
    const params = {
      ordering: "-metacritic",
      page_size: 20,
    };
    
    // Mapeo de filtros a parámetros de la API
    if (filtros.year) {
      params.dates = `${filtros.year}-01-01,${filtros.year}-12-31`;
    }
    
    if (filtros.genre) {
      params.genres = filtros.genre;
    }
    
    if (filtros.platform) {
      params.platforms = filtros.platform;
    }
    
    getGames(params)
      .then((data) => {
        setJuegos(data.results);
        setSinResultados(data.results.length === 0);
      })
      .catch((error) => {
        console.error("Error aplicando filtros:", error);
        setError("No pudimos aplicar los filtros. Por favor, intenta de nuevo.");
      })
      .finally(() => setCargando(false));
  };

  // Contenido mejorado con mensajes para diferentes estados
  if (cargando) return <LoadingMessage>Cargando juegos...</LoadingMessage>;
  
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <Container>
      <Title>Mejores Videojuegos</Title>
      <PanelFiltros onApplyFilters={manejarFiltros} />
      
      {sinResultados ? (
        <NoResultsContainer>
          <NoResultsMessage>
            No se encontraron juegos con los filtros seleccionados.
          </NoResultsMessage>
          <ResetButton onClick={() => manejarFiltros({})}>
            Ver todos los juegos
          </ResetButton>
        </NoResultsContainer>
      ) : (
        <GameList>
          {juegos.map((juego) => (
            <GameItem key={juego.id}>
              <GameImage src={juego.background_image} alt={juego.name} />
              <GameTitle>{juego.name}</GameTitle>
              <p>Puntuación: {juego.metacritic || "No disponible"}</p>
              <DetailsButton to={`/juego/${juego.id}`}>Detalles</DetailsButton>
            </GameItem>
          ))}
        </GameList>
      )}
    </Container>
  );
};

// Mantengo tus estilos actuales
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

// Nuevos estilos para mensajes
const LoadingMessage = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #666;
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  margin: 20px auto;
  max-width: 800px;
`;

const NoResultsContainer = styled.div`
  text-align: center;
  padding: 30px;
  background: #fff8e1;
  border-radius: 8px;
  margin: 20px 0;
`;

const NoResultsMessage = styled.p`
  font-size: 18px;
  color: #856404;
  margin-bottom: 15px;
`;

const ResetButton = styled.button`
  background: #007bff;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;

  &:hover {
    background: #0056b3;
  }
`;

export default Inicio;