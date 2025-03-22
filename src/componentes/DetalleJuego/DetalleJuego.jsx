import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getGameDetails } from "../../api";
import styled from "styled-components";

const DetalleJuego = () => {
  const { id } = useParams();
  const [juego, setJuego] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDetallesJuego = async () => {
      try {
        setCargando(true);
        setError(null);
        const datos = await getGameDetails(id);
        setJuego(datos);
      } catch (err) {
        console.error("Error al cargar los detalles del juego:", err);
        setError("No se pudieron cargar los detalles del juego. Por favor, intenta de nuevo.");
      } finally {
        setCargando(false);
      }
    };

    cargarDetallesJuego();
  }, [id]);

  // Obtener el año de lanzamiento de la fecha completa
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
              {juego.platforms && juego.platforms.length > 0 ? (
                juego.platforms.map((platform) => (
                  <Item key={platform.platform.id}>
                    {platform.platform.name}
                  </Item>
                ))
              ) : (
                <Item>Información no disponible</Item>
              )}
            </ListaDetalles>
          </SeccionDetalle>

          <SeccionDetalle>
            <SubTitulo>Géneros</SubTitulo>
            <ListaDetalles>
              {juego.genres && juego.genres.length > 0 ? (
                juego.genres.map((genre) => (
                  <Item key={genre.id}>{genre.name}</Item>
                ))
              ) : (
                <Item>Información no disponible</Item>
              )}
            </ListaDetalles>
          </SeccionDetalle>

          <SeccionDetalle>
            <SubTitulo>Año de lanzamiento</SubTitulo>
            <Detalle>{obtenerAnoLanzamiento(juego.released)}</Detalle>
          </SeccionDetalle>

          <SeccionDetalle>
            <SubTitulo>Desarrolladores</SubTitulo>
            <ListaDetalles>
              {juego.developers && juego.developers.length > 0 ? (
                juego.developers.map((developer) => (
                  <Item key={developer.id}>{developer.name}</Item>
                ))
              ) : (
                <Item>Información no disponible</Item>
              )}
            </ListaDetalles>
          </SeccionDetalle>
        </DetallesContainer>
      </ContenidoPrincipal>

      {juego.description && (
        <SeccionDescripcion>
          <SubTitulo>Descripción</SubTitulo>
          <Descripcion dangerouslySetInnerHTML={{ __html: juego.description }} />
        </SeccionDescripcion>
      )}

      {/* Sección para trailers si están disponibles */}
      {juego.clip && (
        <SeccionVideo>
          <SubTitulo>Trailer</SubTitulo>
          <Video controls>
            <source src={juego.clip.clip} type="video/mp4" />
            Tu navegador no soporta el tag de video.
          </Video>
        </SeccionVideo>
      )}

      {/* Sección para capturas de pantalla si no hay trailers */}
      {!juego.clip && juego.short_screenshots && juego.short_screenshots.length > 0 && (
        <SeccionCapturas>
          <SubTitulo>Capturas de pantalla</SubTitulo>
          <GaleriaCapturas>
            {juego.short_screenshots.map((screenshot) => (
              <CapturaThumbnail key={screenshot.id} src={screenshot.image} alt={`Captura ${screenshot.id}`} />
            ))}
          </GaleriaCapturas>
        </SeccionCapturas>
      )}
    </Contenedor>
  );
};

// Estilos con styled-components
const Contenedor = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: #333;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Cargando = styled.div`
  font-size: 1.5rem;
  text-align: center;
  margin: 3rem 0;
  color: #666;
`;

const Error = styled.div`
  font-size: 1.2rem;
  text-align: center;
  margin: 2rem 0;
  color: #e53935;
  padding: 1rem;
  background-color: #ffebee;
  border-radius: 8px;
`;

const BotonVolver = styled.button`
  background-color: transparent;
  border: none;
  color: #666;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  
  &:hover {
    color: #333;
  }
`;

const Boton = styled.button`
  background-color: #3f51b5;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  text-decoration: none;
  display: inline-block;
  
  &:hover {
    background-color: #303f9f;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Titulo = styled.h1`
  font-size: 2.5rem;
  margin: 0;
  color: #333;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
`;

const Puntuacion = styled.div`
  background-color: ${({ metacritic }) => {
    if (metacritic >= 75) return '#5cb85c';
    if (metacritic >= 50) return '#f0ad4e';
    return '#d9534f';
  }};
  color: white;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: bold;
  font-size: 1.2rem;
`;

const ContenidoPrincipal = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ImagenContainer = styled.div`
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Imagen = styled.img`
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
`;

const ImagenPlaceholder = styled.div`
  width: 100%;
  height: 300px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bdbdbd;
  font-size: 1.2rem;
`;

const DetallesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SeccionDetalle = styled.div`
  margin-bottom: 1rem;
`;

const SubTitulo = styled.h3`
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
  color: #555;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
`;

const Detalle = styled.p`
  margin: 0;
  font-size: 1rem;
  color: #666;
`;

const ListaDetalles = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Item = styled.li`
  background-color: #f5f5f5;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #555;
`;

const SeccionDescripcion = styled.section`
  margin: 2rem 0;
`;

const Descripcion = styled.div`
  line-height: 1.6;
  color: #555;
  
  a {
    color: #3f51b5;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const SeccionVideo = styled.section`
  margin: 2rem 0;
`;

const Video = styled.video`
  width: 100%;
  max-height: 500px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const SeccionCapturas = styled.section`
  margin: 2rem 0;
`;

const GaleriaCapturas = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const CapturaThumbnail = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
`;

export default DetalleJuego;