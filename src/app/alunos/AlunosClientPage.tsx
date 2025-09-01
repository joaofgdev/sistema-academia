'use client';

import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { type SelectionSet } from 'aws-amplify/data';
// 1. As importações dos seus componentes reais. O caminho pode precisar de ajuste.
import RenewButton from '../../components/RenewButton';
import DeleteButton from '../../components/DeleteButton';

const PageTitle: React.FC<{ title: string }> = ({ title }) => (
  <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">{title}</h1>
);

const client = generateClient<Schema>();

type AlunoSelecionado = SelectionSet<
  Schema['Aluno']['type'],
  ['id', 'nome_aluno', 'telefone', 'data_fim_plano', 'tipo_plano', 'cpf', 'email']
>;

export default function AlunosClientPage() {
  const [alunos, setAlunos] = useState<AlunoSelecionado[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getStatusPlano = (vencimentoPlano: string | undefined | null): 'Ativo' | 'Inativo' => {
    if (!vencimentoPlano) return 'Inativo';
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataVencimento = new Date(vencimentoPlano + 'T00:00:00');
    return dataVencimento >= hoje ? 'Ativo' : 'Inativo';
  };

  const fetchAlunos = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: todosAlunos, errors } = await client.models.Aluno.list({
        selectionSet: ['id', 'nome_aluno', 'telefone', 'data_fim_plano','tipo_plano', 'cpf', 'email'],
      });

      if (errors) {
        console.error('Erros ao buscar alunos:', errors);
        setError('Erro ao carregar alunos do banco de dados');
        return;
      }

      setAlunos(todosAlunos || []);
      
    } catch (err) {
      console.error('Erro ao buscar alunos:', err);
      setError('Erro ao conectar com o banco de dados');
    } finally {
      setLoading(false);
    }
  };

  const handleRenewPlan = async (aluno: any) => {
    try {
      setError(null);
      const dataBase = new Date(aluno.data_fim_plano) > new Date() ? new Date(aluno.data_fim_plano) : new Date();
      const novaDataFim = new Date(dataBase);
      switch (aluno.tipo_plano) {
        case 'MENSAL': novaDataFim.setMonth(novaDataFim.getMonth() + 1); break;
        case 'TRIMESTRAL': novaDataFim.setMonth(novaDataFim.getMonth() + 3); break;
        case 'SEMESTRAL': novaDataFim.setMonth(novaDataFim.getMonth() + 6); break;
        case 'ANUAL': novaDataFim.setFullYear(novaDataFim.getFullYear() + 1); break;
        default: novaDataFim.setDate(novaDataFim.getDate() + 30); break;
      }
      const dataFormatada = novaDataFim.toISOString().split('T')[0];
      const { errors } = await client.models.Aluno.update({
        id: aluno.id,
        data_fim_plano: dataFormatada,
      });
      if (errors) {
        throw new Error(errors.map(e => e.message).join(', '));
      }
      setAlunos(prevAlunos => prevAlunos.map(a => a.id === aluno.id ? { ...a, data_fim_plano: dataFormatada } : a));
      alert(`Plano de ${aluno.nome_aluno} renovado até ${new Date(dataFormatada + 'T00:00:00').toLocaleDateString('pt-BR')}!`);
    } catch (error) {
      console.error('Erro ao renovar o plano:', error);
      setError('Erro ao renovar plano do aluno');
    }
  };

  const handleDeleteStudent = async (alunoId: string) => {
    try {
      setError(null);
      const response = await client.models.Aluno.delete({ id: alunoId });
      if (response.errors) {
        console.error('Erros ao deletar aluno:', response.errors);
        setError('Erro ao excluir aluno do banco de dados');
        return;
      }
      setAlunos((prevAlunos) =>
        prevAlunos.filter((aluno) => aluno.id !== alunoId)
      );
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
      setError('Erro ao excluir aluno');
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Carregando alunos...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-5">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-6xl mx-auto border border-gray-100">
        <PageTitle title="Central de Alunos" />

        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchAlunos}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {alunos.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-xl text-gray-600 mb-2">Nenhum aluno cadastrado</p>
            <p className="text-gray-600">Cadastre o primeiro aluno para começar.</p>
          </div>
        ) : (
          <>
            {/* Versão Desktop - Tabela */}
            <div className="hidden md:block mb-6">
              <p className="text-sm text-gray-600 mb-4">
                {alunos.length} aluno{alunos.length > 1 ? 's' : ''} cadastrado{alunos.length > 1 ? 's' : ''}.
              </p>
              <div className="rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimento</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {alunos.map((aluno) => (
                      <tr key={aluno.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{aluno.nome_aluno}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{aluno.telefone || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{aluno.email}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                            getStatusPlano(aluno.data_fim_plano) === 'Ativo' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {getStatusPlano(aluno.data_fim_plano)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {aluno.data_fim_plano ? new Date(aluno.data_fim_plano + 'T00:00:00').toLocaleDateString('pt-BR') : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-center text-sm font-medium">
                          <div className="flex justify-center items-center space-x-2">
                            <RenewButton onClick={() => handleRenewPlan(aluno)} />
                            <DeleteButton onClick={() => handleDeleteStudent(aluno.id)} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Versão Mobile - Cards */}
            <div className="block md:hidden space-y-4">
              {alunos.map((aluno) => (
                <div key={aluno.id} className="p-4 rounded-lg border border-gray-200 shadow-sm bg-gray-50">
                  <p className="text-lg font-semibold text-gray-900">{aluno.nome_aluno}</p>
                  <p className="text-sm text-gray-700"><strong>Telefone:</strong> {aluno.telefone || '-'}</p>
                  <p className="text-sm text-gray-700"><strong>Email:</strong> {aluno.email}</p>
                  <p className="text-sm">
                    <strong>Status:</strong>{' '}
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      getStatusPlano(aluno.data_fim_plano) === 'Ativo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {getStatusPlano(aluno.data_fim_plano)}
                    </span>
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Vencimento:</strong>{' '}
                    {aluno.data_fim_plano ? new Date(aluno.data_fim_plano + 'T00:00:00').toLocaleDateString('pt-BR') : 'N/A'}
                  </p>
                  <div className="flex space-x-2 mt-3">
                    <RenewButton onClick={() => handleRenewPlan(aluno)} />
                    <DeleteButton onClick={() => handleDeleteStudent(aluno.id)} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={fetchAlunos}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Atualizar Lista
          </button>
        </div>
      </div>
    </div>
  );
};

