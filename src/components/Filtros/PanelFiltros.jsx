import { useState } from "react";
import styled from "styled-components";

const PanelFiltros = ({ onApplyFilters }) => {
  const [filtros, setFiltros] = useState({
    year: "",
    genre: "",
    platform: "",
  });

  const cambiarFiltro = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const aplicarFiltros = (e) => {
    e.preventDefault();
    onApplyFilters(filtros); // Envía los filtros al componente padre
  };
  
  // Nueva función para limpiar filtros
  const limpiarFiltros = () => {
    const filtrosLimpios = {
      year: "",
      genre: "",
      platform: "",
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
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
          <option value="2019">2019</option>
        </FilterSelect>
      </FilterLabel>

      <FilterLabel>
        Género:
        <FilterSelect name="genre" value={filtros.genre} onChange={cambiarFiltro}>
          <option value="">Todos</option>
          <option value="action">Acción</option>
          <option value="adventure">Aventura</option>
          <option value="rpg">RPG</option>
          <option value="shooter">Shooter</option>
          <option value="strategy">Estrategia</option>
        </FilterSelect>
      </FilterLabel>

      <FilterLabel>
        Plataforma:
        <FilterSelect name="platform" value={filtros.platform} onChange={cambiarFiltro}>
          <option value="">Todas</option>
          <option value="4">PC</option>
          <option value="187">PlayStation 5</option>
          <option value="18">PlayStation 4</option>
          <option value="1">Xbox One</option>
          <option value="7">Nintendo Switch</option>
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

// Mantengo tus estilos actuales
const FilterContainer = styled.form`
  display: flex;
  justify-content: space-between;
  background: #f0f0f0;
  padding: 10px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const FilterLabel = styled.label`
  margin-right: 15px;
  font-size: 14px;
  color: #555;
`;

const FilterSelect = styled.select`
  padding: 5px 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
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

// Nuevos estilos para los botones
const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
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