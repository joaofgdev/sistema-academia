import React from 'react';

// Define as propriedades que o componente RenewButton pode receber
interface RenewButtonProps {
  onClick: () => void; // Função a ser executada quando o botão for clicado
}

/**
 * Componente de botão para renovar um plano.
 * Estilizado com Tailwind CSS para uma aparência moderna e responsiva.
 *
 * @param {RenewButtonProps} props - As propriedades do componente.
 * @param {Function} props.onClick - A função de callback para o evento de clique.
 * @returns {JSX.Element} O elemento do botão de renovação.
 */
const RenewButton: React.FC<RenewButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-[#38BDF5] hover:bg-[#38BDF2] text-white font-semibold py-2 px-4 rounded-md
                 shadow-md transition duration-300 ease-in-out transform hover:scale-105
                 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75
                 whitespace-nowrap" // Garante que o texto "Renovar" não quebre em várias linhas
    >
      Renovar
    </button>
  );
};

export default RenewButton;
