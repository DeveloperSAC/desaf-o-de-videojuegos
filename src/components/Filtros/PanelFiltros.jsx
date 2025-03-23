import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

// Configuración de la API
const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

const PanelFiltros = ({ onApplyFilters }) => {
  const [filtros, setFiltros] = useState({
    year: "",
    genre: "",
    platform: "",
    tag: "",
    developer: "",
  });

  const [years, setYears] = useState([]);
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [tags, setTags] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [cargandoOpciones, setCargandoOpciones] = useState(false);

  useEffect(() => {
    const generateYears = () => {
      const currentYear = new Date().getFullYear();
      const yearList = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);
      setYears(yearList);
    };

    const fetchOption = async (endpoint) => {
      try {
        const response = await axios.get(`${BASE_URL}/${endpoint}?key=${API_KEY}`);
        console.log(`Datos cargados de ${endpoint}:`, response.data);
        return response.data.results || [];
      } catch (error) {
        console.error(`Error cargando ${endpoint}:`, error);
        return [];
      }
    };

    const fetchOptions = async () => {
      setCargandoOpciones(true);
      const [genresData, platformsData, tagsData, developersData] = await Promise.all([
        fetchOption("genres"),
        fetchOption("platforms"),
        fetchOption("tags"),
        fetchOption("developers"),
      ]);
      setGenres(genresData);
      setPlatforms(platformsData);
      setTags(tagsData);
      setDevelopers(developersData);
      setCargandoOpciones(false);
    };

    generateYears();
    fetchOptions();
  }, []);

  const cambiarFiltro = (e) => {
    const { name, value } = e.target;
    console.log(`Filtro cambiado: ${name} = ${value}`);
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const aplicarFiltros = (e) => {
    e.preventDefault();

    const filtrosValidos = Object.fromEntries(
      Object.entries(filtros).filter(([_, value]) => value)
    );

    if (!Object.keys(filtrosValidos).length) {
      alert("Por favor, selecciona al menos un filtro.");
      return;
    }

    console.log("Filtros válidos enviados:", filtrosValidos);
    onApplyFilters(filtrosValidos);
  };

  const limpiarFiltros = () => {
    console.log("Limpiando filtros...");
    const filtrosLimpios = { year: "", genre: "", platform: "", tag: "", developer: "" };
    setFiltros(filtrosLimpios);
    onApplyFilters({});
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
        <FilterSelect name="genre" value={filtros.genre} onChange={cambiarFiltro} disabled={cargandoOpciones}>
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
        <FilterSelect name="platform" value={filtros.platform} onChange={cambiarFiltro} disabled={cargandoOpciones}>
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
        <FilterSelect name="tag" value={filtros.tag} onChange={cambiarFiltro} disabled={cargandoOpciones}>
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
        <FilterSelect name="developer" value={filtros.developer} onChange={cambiarFiltro} disabled={cargandoOpciones}>
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

// Estilos mantenidos sin cambios
const FilterContainer = styled.form`
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
`;

const FilterLabel = styled.label`
  display: flex;
  flex-direction: column;
  flex: 1 0 200px;
  font-weight: 500;
  color: #333;
`;

const FilterSelect = styled.select`
  margin-top: 5px;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;

  &:disabled {
    background-color: #f9f9f9;
    cursor: not-allowed;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex: 1 0 100%;
  gap: 10px;
  margin-top: 10px;
`;

const FilterButton = styled.button`
  padding: 10px 15px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #357ae8;
  }
`;

const ClearButton = styled.button`
  padding: 10px 15px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #c0392b;
  }
`;

export default PanelFiltros;
