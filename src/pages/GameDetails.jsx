import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import Spinner from "../components/UI/Spinner";

const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

const GameDetails = () => {
  const { id } = useParams(); // Obtiene el ID desde la URL
  const [juego, setJuego] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      setCargando(true);
      try {
        const response = await axios.get(`${BASE_URL}/games/${id}?key=${API_KEY}`);
        console.log("Detalles del juego:", response.data);
        setJuego(response.data);
      } catch (error) {
        console.error("Error al cargar los detalles del juego:", error);
        setError("No pudimos cargar los detalles del juego. Intenta de nuevo.");
      } finally {
        setCargando(false);
      }
    };

    fetchGameDetails();
  }, [id]);

  if (cargando) return <Spinner height="300px" />;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <Container>
      {juego && (
        <>
          <Title>{juego.name}</Title>
          <CoverImage src={juego.background_image} alt={juego.name} />
          <DetailsList>
            <DetailItem><strong>Género:</strong> {juego.genres.map((g) => g.name).join(", ")}</DetailItem>
            <DetailItem><strong>Puntuación:</strong> {juego.metacritic || "No disponible"}</DetailItem>
            <DetailItem><strong>Plataformas:</strong> {juego.platforms.map((p) => p.platform.name).join(", ")}</DetailItem>
            <DetailItem><strong>Año de lanzamiento:</strong> {juego.released || "No disponible"}</DetailItem>
            <DetailItem><strong>Descripción:</strong> <Description>{juego.description_raw || "Sin descripción disponible."}</Description></DetailItem>
          </DetailsList>
          {juego.clip && (
            <Trailer>
              <h3>Trailer</h3>
              <video controls src={juego.clip.clip}></video>
            </Trailer>
          )}
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const CoverImage = styled.img`
  width: 100%;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const DetailsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const DetailItem = styled.li`
  margin-bottom: 10px;
  font-size: 16px;
`;

const Description = styled.p`
  font-size: 14px;
  line-height: 1.6;
`;

const Trailer = styled.div`
  margin-top: 20px;
  text-align: center;
  video {
    width: 100%;
    border-radius: 8px;
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

export default GameDetails;
