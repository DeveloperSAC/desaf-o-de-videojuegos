import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

// Configuración de la API
const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

const PanelFiltros = ({ onApplyFilters }) => {
  const [filtros, setFiltros] = useState({
    year: "",
    genre: "",
    platform: "",
    tag: "", // Nuevo filtro
    developer: "", // Nuevo filtro
  });

  const [years, setYears] = useState([]);
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [tags, setTags] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [cargandoOpciones, setCargandoOpciones] = useState(true);

  useEffect(() => {
    const generateYears = () => {
      const currentYear = new Date().getFullYear();
      const yearList = Array.from(
        { length: currentYear - 1999 },
        (_, i) => currentYear - i
      );
      setYears(yearList);
    };

    const fetchOptions = async () => {
      try {
        const [genresResponse, platformsResponse, tagsResponse, developersResponse] =
          await Promise.all([
            axios.get(`${BASE_URL}/genres?key=${API_KEY}`),
            axios.get(`${BASE_URL}/platforms?key=${API_KEY}`),
            axios.get(`${BASE_URL}/tags?key=${API_KEY}`),
            axios.get(`${BASE_URL}/developers?key=${API_KEY}`),
          ]);

        setGenres(genresResponse.data.results);
        setPlatforms(platformsResponse.data.results);
        setTags(tagsResponse.data.results);
        setDevelopers(developersResponse.data.results);
      } catch (error) {
        console.error("Error cargando opciones:", error);
      } finally {
        setCargandoOpciones(false);
      }
    };

    setCargandoOpciones(true);
    generateYears();
    fetchOptions();
  }, []);

  const cambiarFiltro = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const aplicarFiltros = (e) => {
    e.preventDefault();
    onApplyFilters(filtros);
  };

  const limpiarFiltros = () => {
    const filtrosLimpios = {
      year: "",
      genre: "",
      platform: "",
      tag: "",
      developer: "",
    };
    setFiltros(filtrosLimpios);
    onApplyFilters(filtrosLimpios);
  };

  return (
    <FilterContainer onSubmit={aplicarFiltros}>
      <FilterLabel>
        Año:
        <FilterSelect name="year" value={filtros.year} onChange={cambiarFiltro}>
          <option value="">Todos</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </FilterSelect>
      </FilterLabel>

      <FilterLabel>
        Género:
        <FilterSelect
          name="genre"
          value={filtros.genre}
          onChange={cambiarFiltro}
          disabled={cargandoOpciones}
        >
          <option value="">Todos</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </FilterSelect>
      </FilterLabel>

      <FilterLabel>
        Plataforma:
        <FilterSelect
          name="platform"
          value={filtros.platform}
          onChange={cambiarFiltro}
          disabled={cargandoOpciones}
        >
          <option value="">Todas</option>
          {platforms.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </FilterSelect>
      </FilterLabel>

      <FilterLabel>
        Etiqueta:
        <FilterSelect
          name="tag"
          value={filtros.tag}
          onChange={cambiarFiltro}
          disabled={cargandoOpciones}
        >
          <option value="">Todas</option>
          {tags.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </FilterSelect>
      </FilterLabel>

      <FilterLabel>
        Desarrolladora:
        <FilterSelect
          name="developer"
          value={filtros.developer}
          onChange={cambiarFiltro}
          disabled={cargandoOpciones}
        >
          <option value="">Todas</option>
          {developers.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </FilterSelect>
      </FilterLabel>

      <ButtonsContainer>
        <FilterButton type="submit">Aplicar Filtros</FilterButton>
        <ClearButton type="button" onClick={limpiarFiltros}>
          Limpiar Filtros
        </ClearButton>
      </ButtonsContainer>
    </FilterContainer>
  );
};

// Estilos
const FilterContainer = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  background: #f0f0f0;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FilterLabel = styled.label`
  flex: 1 1 200px;
  font-size: 14px;
  color: #555;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 5px 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const FilterButton = styled.button`
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

const ClearButton = styled.button`
  background: #dc3545;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
  &:hover {
    background: #c82333;
  }
`;

export default PanelFiltros;
