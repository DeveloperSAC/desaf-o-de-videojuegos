import styled from "styled-components";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getGames } from "../services/api";
import PanelFiltros from "../components/Filtros/PanelFiltros";
import Buscador from "../components/BarraBusqueda/Buscador";
import Spinner from "../components/UI/Spinner";
import ReactPaginate from "react-paginate";


const Inicio = () => {
  const [juegos, setJuegos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [sinResultados, setSinResultados] = useState(false);
  const [filtrosActuales, setFiltrosActuales] = useState({});
  const [paginaActual, setPaginaActual] = useState(1); // Página actual
  const [totalPaginas, setTotalPaginas] = useState(0); // Total de páginas

  // Función genérica para manejar solicitudes y estados
  const manejarSolicitud = async (params) => {
    setCargando(true);
    setError(null);
    setSinResultados(false);

    try {
      console.log("Parámetros enviados a la API:", { ...params, page: paginaActual });
      const data = await getGames({ ...params, page: paginaActual }); // Agregar página actual
      console.log("Datos recibidos:", data);

      setJuegos(data.results);
      setSinResultados(data.results.length === 0);

      // Calcular el número total de páginas basado en el resultado de la API
      const paginas = Math.ceil(data.count / params.page_size);
      setTotalPaginas(paginas);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setError("No pudimos completar la solicitud. Por favor, intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  // Cargar juegos iniciales al montar el componente
  useEffect(() => {
    manejarSolicitud({ ordering: "-metacritic", page_size: 20 });
  }, [paginaActual]); // Recargar cuando la página actual cambie

  const manejarFiltros = (filtros) => {
    console.log("Filtros recibidos:", filtros);
    const params = construirParametros(filtros, filtrosActuales);
    setFiltrosActuales(filtros); // Actualizar filtros actuales
    setPaginaActual(1); // Resetear a la primera página al aplicar filtros
    manejarSolicitud(params);
  };

  const manejarBusqueda = (termino) => {
    console.log("Término de búsqueda:", termino);
    const nuevosFiltros = { ...filtrosActuales, search: termino };
    const params = construirParametros(nuevosFiltros, {});
    setFiltrosActuales(nuevosFiltros);
    setPaginaActual(1); // Resetear a la primera página al buscar
    manejarSolicitud(params);
  };

  const resetearFiltros = () => {
    console.log("Reseteando filtros...");
    setFiltrosActuales({});
    setPaginaActual(1); // Resetear a la primera página al limpiar filtros
    manejarSolicitud({ ordering: "-metacritic", page_size: 20 });
  };

  const construirParametros = (filtros, filtrosPrevios) => {
    const params = { ordering: "-metacritic", page_size: 20 };

    if (filtros.year) params.dates = `${filtros.year}-01-01,${filtros.year}-12-31`;
    if (filtros.genre) params.genres = filtros.genre;
    if (filtros.platform) params.platforms = filtros.platform;
    if (filtros.tag) params.tags = filtros.tag;
    if (filtros.developer) params.developers = filtros.developer;

    if (filtrosPrevios.search) params.search = filtrosPrevios.search;

    return params;
  };

  const manejarCambioDePagina = (pagina) => {
    console.log("Cambiando a la página:", pagina);
    setPaginaActual(pagina);
  };

  if (cargando) return <Spinner height="300px" />;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <Container>
      <Title>Mejores Videojuegos</Title>
      <Buscador onBuscar={manejarBusqueda} />
      <PanelFiltros onApplyFilters={manejarFiltros} />
  
      {sinResultados ? (
        <NoResultsContainer>
          <NoResultsMessage>No se encontraron juegos con los filtros seleccionados.</NoResultsMessage>
          <ResetButton onClick={resetearFiltros}>Ver todos los juegos</ResetButton>
        </NoResultsContainer>
      ) : (
        <>
          {/* Mapeo único para los videojuegos */}
          <GameList>
            {juegos.map((juego) => (
              <GameItem key={juego.id}>
                <GameImage src={juego.background_image} alt={juego.name} />
                <GameTitle>{juego.name}</GameTitle>
                <p>Puntuación: {juego.metacritic || "No disponible"}</p>
                {/* Botón de detalles */}
                <DetailsButton to={`/juego/${juego.id}`}>Detalles</DetailsButton>
              </GameItem>
            ))}
          </GameList>
  
          {/* Paginación al final */}
          <PaginationContainer>
            <ReactPaginate
              previousLabel={"← Anterior"}
              nextLabel={"Siguiente →"}
              breakLabel={"..."}
              pageCount={totalPaginas}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={({ selected }) => manejarCambioDePagina(selected + 1)}
              containerClassName={"pagination"}
              activeClassName={"active"}
            />
          </PaginationContainer>
        </>
      )}
    </Container>
  );
  };
  

// Componentes estilizados para la paginación
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;

  .pagination {
    display: flex;
    list-style: none;
    gap: 10px;
  }

  .pagination li {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
  }

  .pagination .active {
    background-color: #4a90e2;
    color: white;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  color: #333;
`;

const GameList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const GameItem = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const GameImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const GameTitle = styled.h3`
  padding: 10px;
  margin: 0;
  color: #333;
`;

const DetailsButton = styled(Link)`
  display: block;
  text-align: center;
  background-color: #4a90e2;
  color: white;
  padding: 8px 0;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357ae8;
  }
`;

const NoResultsContainer = styled.div`
  text-align: center;
  margin-top: 40px;
`;

const NoResultsMessage = styled.p`
  font-size: 18px;
  color: #666;
  margin-bottom: 20px;
`;

const ResetButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357ae8;
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #e74c3c;
  font-size: 18px;
  margin-top: 40px;
  padding: 20px;
  background-color: #ffeaea;
  border-radius: 8px;
`;

export default Inicio;
