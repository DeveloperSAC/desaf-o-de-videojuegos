import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animación de rotación
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Contenedor del Spinner
const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${(props) => props.height || '200px'};
`;

// Estilo del Spinner (círculo)
const SpinnerCircle = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #007bff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

// Componente Spinner
const Spinner = ({ height }) => (
  <SpinnerContainer height={height}>
    <SpinnerCircle />
  </SpinnerContainer>
);

export default Spinner;
