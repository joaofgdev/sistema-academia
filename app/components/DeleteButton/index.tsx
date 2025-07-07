import React from 'react';

// Define as propriedades que o componente DeleteButton pode receber
interface DeleteButtonProps {
  onClick: () => void; // Função a ser executada quando o botão for clicado
}

/**
 * Componente de botão para deletar um item.
 * Estilizado com Tailwind CSS para uma aparência moderna e responsiva.
 *
 * @param {DeleteButtonProps} props - As propriedades do componente.
 * @param {Function} props.onClick - A função de callback para o evento de clique.
 * @returns {JSX.Element} O elemento do botão de deletar.
 */
const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md
                 shadow-md transition duration-300 ease-in-out transform hover:scale-105
                 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75
                 whitespace-nowrap ml-2" // Adiciona uma margem à esquerda para separar do botão Renovar
    >
      Deletar
    </button>
  );
};

export default DeleteButton;
