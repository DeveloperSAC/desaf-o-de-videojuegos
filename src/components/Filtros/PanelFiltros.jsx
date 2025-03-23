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

  return (
    <FilterContainer onSubmit={aplicarFiltros}>
      <FilterLabel>
        Año:
        <FilterSelect name="year" value={filtros.year} onChange={cambiarFiltro}>
          <option value="">Todos</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
        </FilterSelect>
      </FilterLabel>

      <FilterLabel>
        Género:
        <FilterSelect name="genre" value={filtros.genre} onChange={cambiarFiltro}>
          <option value="">Todos</option>
          <option value="action">Acción</option>
          <option value="adventure">Aventura</option>
          <option value="rpg">RPG</option>
        </FilterSelect>
      </FilterLabel>

      <FilterLabel>
        Plataforma:
        <FilterSelect name="platform" value={filtros.platform} onChange={cambiarFiltro}>
          <option value="">Todas</option>
          <option value="pc">PC</option>
          <option value="playstation">PlayStation</option>
          <option value="xbox">Xbox</option>
        </FilterSelect>
      </FilterLabel>

      <FilterButton type="submit">Aplicar Filtros</FilterButton>
    </FilterContainer>
  );
};

// Estilos con styled-components
const FilterContainer = styled.form`
  display: flex;
  justify-content: space-between;
  background: #f0f0f0;
  padding: 10px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

export default PanelFiltros;
