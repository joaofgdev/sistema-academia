'use client';

import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource'; // Ajuste o caminho se necessário

import RenewButton from '../components/RenewButton';
import DeleteButton from '../components/DeleteButton';

// Componente de título
const PageTitle: React.FC<{ title: string }> = ({ title }) => (
  <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">{title}</h1>
);

// Crie o cliente do Amplify fora do componente
const client = generateClient<Schema>();

const HomePage: React.FC = () => {
  const [alunos, setAlunos] = useState<Schema['Aluno'][]>([]);

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        // --- ALTERAÇÃO AQUI ---
        // Busca apenas os campos necessários usando o `selectionSet`.
        const { data: todosAlunos, errors } = await client.models.Aluno.list({
          selectionSet: ['id', 'nome_aluno', 'telefone', 'data_fim_plano'],
        });

        if (errors) {
          console.error('Erro ao buscar alunos:', errors);
          return;
        }
        setAlunos(todosAlunos);
      } catch (error) {
        console.error('Ocorreu um erro inesperado:', error);
      }
    };

    fetchAlunos();
  }, []);

  const getStatusPlano = (vencimentoPlano: string | undefined | null): 'Ativo' | 'Inativo' => {
    if (!vencimentoPlano) return 'Inativo';
    // Usando o horário local do Brasil para a comparação
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    // Ajusta a data de vencimento para não ter problemas com fuso horário
    const dataVencimento = new Date(vencimentoPlano + 'T00:00:00');
    return dataVencimento >= hoje ? 'Ativo' : 'Inativo';
  };

  const handleRenewPlan = async (alunoId: string) => {
    const today = new Date();
    today.setDate(today.getDate() + 30);
    const novaDataFimPlano = today.toISOString().split('T')[0];

    try {
      await client.models.Aluno.update({
        id: alunoId,
        data_fim_plano: novaDataFimPlano,
      });

      // Atualiza o estado local de forma segura
      setAlunos((prevAlunos) =>
        prevAlunos.map((aluno) =>
          aluno.id === alunoId
            ? { ...aluno, data_fim_plano: novaDataFimPlano }
            : aluno
        )
      );
    } catch (error) {
      console.error('Erro ao renovar o plano:', error);
    }
  };

  // --- NOVA FUNÇÃO ---
  // Função para deletar um aluno
  const handleDeleteStudent = async (alunoId: string) => {
    // Adiciona uma confirmação para evitar exclusões acidentais
    if (!window.confirm('Tem certeza de que deseja excluir este aluno?')) {
      return;
    }

    try {
      await client.models.Aluno.delete({ id: alunoId });

      // Remove o aluno da lista na interface
      setAlunos((prevAlunos) =>
        prevAlunos.filter((aluno) => aluno.id !== alunoId)
      );
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-5x1 mx-auto">
        <PageTitle title="Central de Alunos" />

        {alunos.length === 0 ? (
          <p className="text-center text-gray-600">Nenhum aluno cadastrado ainda.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {alunos.map((aluno) => (
                  <tr key={aluno.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{aluno.nome_aluno}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{aluno.telefone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusPlano(aluno.data_fim_plano) === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {getStatusPlano(aluno.data_fim_plano)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {aluno.data_fim_plano ? new Date(aluno.data_fim_plano + 'T00:00:00').toLocaleDateString('pt-BR') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <RenewButton onClick={() => handleRenewPlan(aluno.id)} />
                      {/* --- ALTERAÇÃO AQUI ---
                          Passando o `id` para a função de deletar.
                          É mais eficiente e seguro deletar pelo ID único do registro. */}
                      <DeleteButton onClick={() => handleDeleteStudent(aluno.id)} />
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