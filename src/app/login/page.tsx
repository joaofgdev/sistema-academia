'use client';
import React, { useState, FormEvent } from 'react';
import Image from 'next/image';

// Componente principal da página de login
export default function LoginPage() {
  const [username, setUsername] = useState<string>(''); // Estado do usuário
  const [password, setPassword] = useState<string>(''); // Estado da senha

  // Função para lidar com o envio do formulário
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Usuário:', username);
    console.log('Senha:', password);
    console.log('Login attempt! Check console for data.');
  };

  return (
    <div className="flex min-h-screen w-screen overflow-hidden">
      {/* Lado esquerdo: Formulário */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center items-center p-8 bg-white rounded-r-[50px]">
        <Image
          src="/images/logo.png"
          alt="Logo Studio Duo"
          width={300}
          height={80}
          className="mb-10"
        />

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
          {/* Usuário */}
          <div>
            <label htmlFor="username" className="block text-gray-700 text-lg font-medium mb-2">
              Usuário
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Digite seu usuário"
              required
            />
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="password" className="block text-black text-lg font-medium mb-2">
              Senha:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-black border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite sua senha"
              required
            />
          </div>

          {/* Botão */}
          <button
            type="submit"
            className="w-full bg-[#38BDF2] text-white py-3 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
          >
            Entrar
          </button>
        </form>
      </div>

      {/* Lado direito: Imagem */}
      <div className="hidden lg:block w-3/5 h-screen overflow-hidden relative rounded-l-[50px]">
        <Image
          src="/images/background.png"
          alt="Fundo de Login"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
