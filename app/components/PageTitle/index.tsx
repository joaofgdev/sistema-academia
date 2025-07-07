// src/components/PageTitle.tsx
import React from 'react';

// Define as propriedades que o componente PageTitle pode receber
interface PageTitleProps {
  title: string; // O título a ser exibido
  className?: string; // Classes adicionais para estilização (opcional)
}

// Componente funcional PageTitle
const PageTitle: React.FC<PageTitleProps> = ({ title, className }) => {
  return (
    <h1
      className={`
        text-3xl font-bold text-center text-[#38BDF5] mb-8
        ${className || ''}
      `}
    >
      {title}
    </h1>
  );
};

export default PageTitle;