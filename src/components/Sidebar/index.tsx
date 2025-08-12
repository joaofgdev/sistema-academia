import React, { useState } from 'react';
import { Menu, CreditCard, Users, UserPlus } from 'lucide-react'; // Ícones para a navegação
import Image from 'next/image';

// O componente de navegação lateral (Sidebar)
const Sidebar = () => {
  // Estado para controlar se a barra lateral está expandida ou recolhida
  const [isExpanded, setIsExpanded] = useState(true);

  // Função para alternar o estado de expansão
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <nav
      // Estilo da barra lateral com Tailwind CSS
      // A largura muda com base no estado 'isExpanded'
      className={`
        bg-white h-screen fixed top-0 left-0 transition-all duration-300 ease-in-out
        ${isExpanded ? 'w-64' : 'w-20'}
        flex flex-col shadow-lg rounded-r-2xl
      `}
    >
      {/* Cabeçalho da barra lateral com o logo e o botão de toggle */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'w-full' : 'w-0'}`}>
          {/* Logo da aplicação. A imagem é um placeholder. */}
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={isExpanded ? 150 : 0}
            height={40}
            className="transition-all duration-300"
          />
        </div>
        {/* Botão de menu hambúrguer para expandir/recolher a barra lateral */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Itens de navegação */}
      <div className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-2">
          {/* Item de navegação: Inadimplentes */}
          <li>
            <a
              href="inadimplentes"
              className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-600 group"
            >
              <CreditCard className="flex-shrink-0 w-6 h-6 text-gray-500 group-hover:text-blue-500 transition duration-150" />
              <span className={`ml-4 transition-all duration-300 whitespace-nowrap ${isExpanded ? 'opacity-100' : 'opacity-0 absolute'}`}>
                Inadimplentes
              </span>
            </a>
          </li>
          
          {/* Item de navegação: Alunos */}
          <li>
            <a
              href="/"
              className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-600 group"
            >
              <Users className="flex-shrink-0 w-6 h-6 text-gray-500 group-hover:text-blue-500 transition duration-150" />
              <span className={`ml-4 transition-all duration-300 whitespace-nowrap ${isExpanded ? 'opacity-100' : 'opacity-0 absolute'}`}>
                Alunos
              </span>
            </a>
          </li>

          {/* Item de navegação: Cadastro */}
          <li>
            <a
              href="Cadastro"
              className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-600 group"
            >
              <UserPlus className="flex-shrink-0 w-6 h-6 text-gray-500 group-hover:text-blue-500 transition duration-150" />
              <span className={`ml-4 transition-all duration-300 whitespace-nowrap ${isExpanded ? 'opacity-100' : 'opacity-0 absolute'}`}>
                Cadastro
              </span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

// Componente principal para renderizar a barra lateral
const App = () => {
  return (
      <Sidebar />
  );
};

export default App;
