import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getGameDetails } from "../../services/api"; // Ruta ajustada
import styled from "styled-components";

const DetalleJuego = () => {
  const { id } = useParams();
  const [juego, setJuego] = useState(null);
  const [trailers, setTrailers] = useState([]); // Estado para trailers
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDetallesJuego = async () => {
      try {
        setCargando(true);
        setError(null);

        // Obtener detalles del juego
        const datos = await getGameDetails(id);
        setJuego(datos);

        // Obtener trailers del juego
        const response = await fetch(
          `https://api.rawg.io/api/games/${id}/movies?key=${import.meta.env.VITE_API_KEY}`
        );
        const trailersData = await response.json();
        setTrailers(trailersData.results || []);
      } catch (err) {
        console.error("Error al cargar los detalles del juego:", err);
        setError("No se pudieron cargar los detalles del juego. Por favor, intenta de nuevo.");
      } finally {
        setCargando(false);
      }
    };

    cargarDetallesJuego();
  }, [id]);

  const obtenerAnoLanzamiento = (fecha) => {
    if (!fecha) return "Desconocido";
    return new Date(fecha).getFullYear();
  };

  if (cargando) {
    return (
      <Contenedor>
        <Cargando>Cargando detalles del juego...</Cargando>
      </Contenedor>
    );
  }

  if (error) {
    return (
      <Contenedor>
        <Error>{error}</Error>
        <Boton as={Link} to="/">Volver al inicio</Boton>
      </Contenedor>
    );
  }

  if (!juego) {
    return (
      <Contenedor>
        <Error>No se encontró información del juego.</Error>
        <Boton as={Link} to="/">Volver al inicio</Boton>
      </Contenedor>
    );
  }

  return (
    <Contenedor>
      <BotonVolver as={Link} to="/">
        &larr; Volver
      </BotonVolver>
      
      <Header>
        <Titulo>{juego.name}</Titulo>
        {juego.metacritic && (
          <Puntuacion metacritic={juego.metacritic}>
            {juego.metacritic}
          </Puntuacion>
        )}
      </Header>

      <ContenidoPrincipal>
        <ImagenContainer>
          {juego.background_image ? (
            <Imagen src={juego.background_image} alt={juego.name} />
          ) : (
            <ImagenPlaceholder>Imagen no disponible</ImagenPlaceholder>
          )}
        </ImagenContainer>

        <DetallesContainer>
          <SeccionDetalle>
            <SubTitulo>Plataformas</SubTitulo>
            <ListaDetalles>
              {juego.platforms?.map((platform) => (
                <Item key={platform.platform.id}>
                  {platform.platform.name}
                </Item>
              )) || <Item>Información no disponible</Item>}
            </ListaDetalles>
          </SeccionDetalle>

          <SeccionDetalle>
            <SubTitulo>Géneros</SubTitulo>
            <ListaDetalles>
              {juego.genres?.map((genre) => (
                <Item key={genre.id}>{genre.name}</Item>
              )) || <Item>Información no disponible</Item>}
            </ListaDetalles>
          </SeccionDetalle>

          <SeccionDetalle>
            <SubTitulo>Año de lanzamiento</SubTitulo>
            <Detalle>{obtenerAnoLanzamiento(juego.released)}</Detalle>
          </SeccionDetalle>

          <SeccionDetalle>
            <SubTitulo>Descripción</SubTitulo>
            <Descripcion dangerouslySetInnerHTML={{ __html: juego.description || "No disponible" }} />
          </SeccionDetalle>
        </DetallesContainer>
      </ContenidoPrincipal>

      {/* Mostrar trailers si existen */}
      {trailers.length > 0 && (
        <SeccionTrailers>
          <SubTitulo>Trailers</SubTitulo>
          <TrailersContainer>
            {trailers.map((trailer) => (
              <Trailer key={trailer.id}>
                <h4>{trailer.name}</h4>
                <Video controls src={trailer.data.max} />
              </Trailer>
            ))}
          </TrailersContainer>
        </SeccionTrailers>
      )}
    </Contenedor>
  );
};

// Estilos (mantenidos y adaptados)
const Contenedor = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Cargando = styled.div`
  text-align: center;
  margin: 3rem 0;
`;

const Error = styled.div`
  text-align: center;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 8px;
  padding: 1rem;
`;

// Otros estilos mantenidos y adaptados...

export default DetalleJuego;
