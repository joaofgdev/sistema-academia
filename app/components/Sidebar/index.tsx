'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface SidebarProps {
  isOpen?: boolean;
  onMenuItemClick?: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onMenuItemClick }) => {
  const menuItems = [
    { name: 'INADIMPLENTES', href: '/inadimplentes' },
    { name: 'ALUNOS', href: '/' },
    { name: 'CADASTRO', href: '/Cadastro' }, // CORRIGIDO: rota correta da página de cadastro
  ];

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen w-64 bg-white shadow-lg p-6
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col items-center
      `}
    >
      <div className="mb-10 mt-4">
        <Image
          src="/images/logo.png"
          alt="Studio Duo Personal Trainer Logo"
          width={200}
          height={50}
        />
      </div>

      <nav className="w-full">
        <ul className="space-y-6">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href} passHref>
                <span
                  className="
                    block text-center text-xl font-semibold text-[#A6A5A4] hover:text-[#38BDF2]
                    transition-colors duration-200 py-2 px-4 rounded-md
                    hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-[#38BDF2] focus:ring-opacity-50
                    cursor-pointer
                  "
                  onClick={() => onMenuItemClick?.(item.name)}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
