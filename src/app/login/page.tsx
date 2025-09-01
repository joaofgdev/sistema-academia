'use client';
import React, { useState, FormEvent } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react'; // 1. Importar a função signIn
import { useRouter } from 'next/navigation'; // 2. Importar o hook de navegação

// Componente principal da página de login
export default function LoginPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null); // 3. Estado para a mensagem de erro
  const [isLoading, setIsLoading] = useState<boolean>(false); // Estado para o carregamento
  const router = useRouter(); // Instância do router

  // 4. Lógica de login atualizada para usar o NextAuth
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Limpa erros antigos
    setIsLoading(true); // Inicia o carregamento

    try {
      const result = await signIn('credentials', {
        redirect: false, // Importante para lidar com o erro aqui mesmo
        username: username,
        password: password,
      });

      if (result?.error) {
        // Se o NextAuth retornar um erro (usuário/senha errados), exibe a mensagem
        setError('Usuário ou senha inválidos.');
        setIsLoading(false); // Para o carregamento
      } else {
        // Se o login for bem-sucedido, redireciona para a página principal
        router.push('/'); // Ou para '/dashboard', etc.
      }
    } catch (err) {
      // Caso ocorra um erro inesperado
      console.error(err);
      setError('Ocorreu um erro inesperado. Tente novamente.');
      setIsLoading(false); // Para o carregamento
    }
  };

  return (
    <div className="flex min-h-screen w-screen overflow-hidden">
      {/* Lado esquerdo: Formulário */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center items-center p-8 bg-white">
        <Image
          src="/images/logo.png"
          alt="Logo Studio Duo"
          width={300}
          height={80}
          className="mb-10"
          priority
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
              disabled={isLoading} // Desabilita o campo durante o carregamento
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
              disabled={isLoading} // Desabilita o campo durante o carregamento
            />
          </div>

          {/* 5. Exibir a mensagem de erro, se houver */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Botão */}
          <button
            type="submit"
            className="w-full bg-[#38BDF2] text-white py-3 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold disabled:bg-gray-400"
            disabled={isLoading} // Desabilita o botão durante o carregamento
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
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
