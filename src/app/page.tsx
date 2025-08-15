'use client';

import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';

// --- CORREÇÃO FINAL AQUI ---
import type { Schema } from '@/amplify/data/resource';
import { type SelectionSet } from 'aws-amplify/data';

import RenewButton from '../components/RenewButton';
import DeleteButton from '../components/DeleteButton';

// Componente de título
const PageTitle: React.FC<{ title: string }> = ({ title }) => (
  <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">{title}</h1>
);

// Crie o cliente do Amplify fora do componente
const client = generateClient<Schema>();

// Usamos SelectionSet para definir o tipo customizado
type AlunoSelecionado = SelectionSet<Schema['Aluno']['type'], ['id', 'nome_aluno', 'telefone', 'data_fim_plano', 'cpf']>;

const HomePage: React.FC = () => {
  // Usamos o novo tipo no estado
  const [alunos, setAlunos] = useState<AlunoSelecionado[]>([]);

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const { data: todosAlunos, errors } = await client.models.Aluno.list({
          selectionSet: ['id', 'nome_aluno', 'telefone', 'data_fim_plano', 'cpf'],
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
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
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

  const handleDeleteStudent = async (alunoId: string) => {
    try {
      await client.models.Aluno.delete({ id: alunoId });

      setAlunos((prevAlunos) =>
        prevAlunos.filter((aluno) => aluno.id !== alunoId)
      );
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-5xl mx-auto">
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
                      {aluno.id ? (
                        <>
                          <RenewButton onClick={() => handleRenewPlan(aluno.id)} />
                          <DeleteButton onClick={() => handleDeleteStudent(aluno.id)} />
                        </>
                      ) : (
                        <span className="text-xs text-red-500">Erro: ID não encontrado</span>
                      )}
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