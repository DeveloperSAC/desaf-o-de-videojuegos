import React, { useState } from 'react';
import styled from 'styled-components';

const BuscadorContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const FormBuscador = styled.form`
  display: flex;
  position: relative;
  width: 100%;
`;

const InputBuscador = styled.input`
  width: 100%;
  padding: 12px 20px;
  border-radius: 25px;
  border: 1px solid #ddd;
  font-size: 16px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

const BotonBuscar = styled.button`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s;
  
  &:hover {
    background: #0056b3;
  }
`;

const Buscador = ({ onBuscar }) => {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  const manejarCambio = (e) => {
    setTerminoBusqueda(e.target.value);
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    onBuscar(terminoBusqueda);
  };

  return (
    <BuscadorContainer>
      <FormBuscador onSubmit={manejarEnvio}>
        <InputBuscador
          type="text"
          placeholder="Buscar videojuegos..."
          value={terminoBusqueda}
          onChange={manejarCambio}
        />
        <BotonBuscar type="submit">
          🔍
        </BotonBuscar>
      </FormBuscador>
    </BuscadorContainer>
  );
};

export default Buscador;