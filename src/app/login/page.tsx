'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usuario === 'admin' && senha === '1234') {
      localStorage.setItem('isAuth', 'true');
      router.push('/');
    } else {
      setErro('Usuário ou senha incorretos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {erro && (
          <div className="bg-red-100 text-red-600 p-2 mb-4 rounded text-center">
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <label className="block mb-2 text-sm font-medium">Usuário</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="Digite admin"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />

          <label className="block mb-2 text-sm font-medium">Senha</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded mb-6"
            placeholder="Digite 1234"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
