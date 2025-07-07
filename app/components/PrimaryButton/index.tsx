// src/components/PrimaryButton.tsx
import React from 'react';

// Define as propriedades que o componente PrimaryButton pode receber
interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode; // O conteúdo do botão (texto, ícone, etc.)
  className?: string; // Classes adicionais para estilização (opcional)
}

// Componente funcional PrimaryButton
const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`
        bg-[#38BDF2] hover:bg-[#2596be] text-white font-bold py-3 px-6 rounded-full shadow-lg
        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#38BDF2] focus:ring-opacity-75
        ${className || ''}
      `}
      {...props} // Passa todas as outras props (como onClick, type, disabled) para o botão nativo
    >
      {children}
    </button>
  );
};

export default PrimaryButton;