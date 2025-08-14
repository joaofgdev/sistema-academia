// Seu arquivo: DeleteButton.tsx (está perfeito)
import React from 'react';

interface DeleteButtonProps {
  onClick: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md
                 shadow-md transition duration-300 ease-in-out transform hover:scale-105
                 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75
                 whitespace-nowrap ml-2"
    >
      Deletar
    </button>
  );
};

export default DeleteButton;