'use client';

import React, { useState } from 'react';
import RenewButton from './components/RenewButton'; // Importa o componente do botão Renovar

// Componente de título simples (exemplo, se não tiver um PageTitle real)
const PageTitle: React.FC<{ title: string }> = ({ title }) => (
  <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">{title}</h1>
);

// Interface para os dados do aluno, similar à do CadastroPage
interface AlunoData {
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  inicioPlano: string;
  tipoPlano: 'Mensal' | 'Trimestral' | 'Anual' | '';
  vencimentoPlano: string;
}

const HomePage: React.FC = () => {
  // Estado para armazenar a lista de alunos.
  // Usamos dados mockados para demonstração. Em uma aplicação real,
  // esses dados viriam de uma fonte externa (ex: API, Firestore).
  const [alunos, setAlunos] = useState<AlunoData[]>([
    {
      nome: 'Maria Oliveira',
      cpf: '111.222.333-44',
      dataNascimento: '2000-01-15',
      telefone: '(46) 9999-0000',
      email: 'maria.o@example.com',
      inicioPlano: '2025-06-01',
      tipoPlano: 'Mensal',
      vencimentoPlano: '2025-07-01',
    },
    {
      nome: 'Pedro Souza',
      cpf: '555.666.777-88',
      dataNascimento: '1998-03-20',
      telefone: '(46) 9999-0001',
      email: 'pedro.s@example.com',
      inicioPlano: '2025-03-16',
      tipoPlano: 'Trimestral',
      vencimentoPlano: '2025-06-16', // Exemplo de um plano que pode estar vencido
    },
    {
      nome: 'Ana Paula',
      cpf: '999.888.777-66',
      dataNascimento: '2001-11-05',
      telefone: '(46) 9999-0002',
      email: 'ana.p@example.com',
      inicioPlano: '2025-01-10',
      tipoPlano: 'Anual',
      vencimentoPlano: '2026-01-10',
    },
  ]);

  /**
   * Calcula o status do plano (Ativo/Inativo) com base na data de vencimento.
   * @param {string} vencimentoPlano - A data de vencimento do plano no formato 'YYYY-MM-DD'.
   * @returns {'Ativo' | 'Inativo'} O status do plano.
   */
  const getStatusPlano = (vencimentoPlano: string): 'Ativo' | 'Inativo' => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera a hora para comparação apenas de data
    const dataVencimento = new Date(vencimentoPlano + 'T00:00:00');
    return dataVencimento >= hoje ? 'Ativo' : 'Inativo';
  };

  /**
   * Lida com a renovação do plano de um aluno específico.
   * Atualiza a data de vencimento para 30 dias a partir da data atual.
   * @param {number} index - O índice do aluno na lista a ser renovado.
   */
  const handleRenewPlan = (index: number) => {
    setAlunos((prevAlunos) => {
      const newAlunos = [...prevAlunos];
      const alunoToRenew = { ...newAlunos[index] };

      const today = new Date();
      // Adiciona 30 dias à data atual
      today.setDate(today.getDate() + 30);

      // Formata a nova data de vencimento para 'YYYY-MM-DD'
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      alunoToRenew.vencimentoPlano = `${year}-${month}-${day}`;

      newAlunos[index] = alunoToRenew;
      return newAlunos;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl">
        <PageTitle title="Central de Alunos"/>

        {alunos.length === 0 ? (
          <p className="text-center text-gray-600">Nenhum aluno cadastrado ainda.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimento
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {alunos.map((aluno, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {aluno.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {aluno.telefone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                        ${getStatusPlano(aluno.vencimentoPlano) === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {getStatusPlano(aluno.vencimentoPlano)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(aluno.vencimentoPlano + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <RenewButton onClick={() => handleRenewPlan(index)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
