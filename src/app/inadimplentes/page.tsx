'use client';

import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource'; // Ajuste o caminho conforme sua estrutura
import RenewButton from '../../components/RenewButton';
import DeleteButton from '../../components/DeleteButton';

// Gera o cliente do Amplify
const client = generateClient<Schema>();

// Tipo para os dados do aluno baseado no schema
type AlunoData = Schema['Aluno']['type'];

// Componente de título simples (reutilizado)
const PageTitle: React.FC<{ title: string }> = ({ title }) => (
  <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">{title}</h1>
);

const InadimplentesPage: React.FC = () => {
  // Estados para gerenciar dados e loading
  const [alunos, setAlunos] = useState<AlunoData[]>([]);
  const [inadimplentes, setInadimplentes] = useState<AlunoData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Calcula o status do plano (Ativo/Inativo) com base na data de vencimento.
   */
  const getStatusPlano = (dataFimPlano: string): 'Ativo' | 'Inativo' => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataVencimento = new Date(dataFimPlano);
    return dataVencimento >= hoje ? 'Ativo' : 'Inativo';
  };

  /**
   * Busca todos os alunos do banco de dados
   */
  const fetchAlunos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await client.models.Aluno.list();
      
      if (response.errors) {
        console.error('Erros ao buscar alunos:', response.errors);
        setError('Erro ao carregar alunos do banco de dados');
        return;
      }

      const alunosData = response.data || [];
      setAlunos(alunosData);
      
      // Filtra apenas os inadimplentes
      const filtered = alunosData.filter(aluno => 
        getStatusPlano(aluno.data_fim_plano) === 'Inativo'
      );
      setInadimplentes(filtered);
      
    } catch (err) {
      console.error('Erro ao buscar alunos:', err);
      setError('Erro ao conectar com o banco de dados');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Deleta um aluno do banco de dados
   */
  const handleDeleteStudent = async (alunoId: string) => {
    if (!confirm('Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      setError(null);
      
      const response = await client.models.Aluno.delete({ id: alunoId });
      
      if (response.errors) {
        console.error('Erros ao deletar aluno:', response.errors);
        setError('Erro ao excluir aluno do banco de dados');
        return;
      }

      // Remove o aluno dos estados locais
      setAlunos(prevAlunos => prevAlunos.filter(aluno => aluno.id !== alunoId));
      setInadimplentes(prevInadimplentes => prevInadimplentes.filter(aluno => aluno.id !== alunoId));
      
      // Opcional: Mostrar mensagem de sucesso
      alert('Aluno excluído com sucesso!');
      
    } catch (err) {
      console.error('Erro ao deletar aluno:', err);
      setError('Erro ao excluir aluno');
    }
  };

  /**
   * Renova o plano de um aluno (atualiza data_fim_plano para +30 dias)
   */
  const handleRenewPlan = async (alunoId: string) => {
    try {
      setError(null);
      
      // Calcula nova data de vencimento (30 dias a partir de hoje)
      const today = new Date();
      today.setDate(today.getDate() + 30);
      const newDataFim = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      
      const response = await client.models.Aluno.update({
        id: alunoId,
        data_fim_plano: newDataFim
      });
      
      if (response.errors) {
        console.error('Erros ao renovar plano:', response.errors);
        setError('Erro ao renovar plano do aluno');
        return;
      }

      // Atualiza os estados locais
      const updatedAluno = response.data;
      if (updatedAluno) {
        setAlunos(prevAlunos => 
          prevAlunos.map(aluno => 
            aluno.id === alunoId ? updatedAluno : aluno
          )
        );
        
        // Remove da lista de inadimplentes (agora está ativo)
        setInadimplentes(prevInadimplentes => 
          prevInadimplentes.filter(aluno => aluno.id !== alunoId)
        );
      }
      
      alert('Plano renovado com sucesso!');
      
    } catch (err) {
      console.error('Erro ao renovar plano:', err);
      setError('Erro ao renovar plano do aluno');
    }
  };

  // Carrega os dados quando o componente monta
  useEffect(() => {
    fetchAlunos();
  }, []);

  // Mostra loading
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-6xl">
        <PageTitle title="Central de Inadimplentes" />

        {/* Mostra erros se houver */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchAlunos}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {inadimplentes.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-xl text-gray-600 mb-2">Parabéns!</p>
            <p className="text-gray-600">Nenhum aluno inadimplente encontrado.</p>
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-4">
              {inadimplentes.length} aluno{inadimplentes.length > 1 ? 's' : ''} inadimplente{inadimplentes.length > 1 ? 's' : ''} encontrado{inadimplentes.length > 1 ? 's' : ''}.
            </p>
            
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CPF
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telefone
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vencimento
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inadimplentes.map((aluno) => (
                    <tr key={aluno.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {aluno.nome_aluno}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {aluno.cpf}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {aluno.telefone || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {aluno.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Inativo
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(aluno.data_fim_plano).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center items-center space-x-2">
                          <RenewButton onClick={() => handleRenewPlan(aluno.id)} />
                          <DeleteButton onClick={() => handleDeleteStudent(aluno.id)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Botão para recarregar dados */}
        <div className="mt-6 text-center">
          <button
            onClick={fetchAlunos}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Atualizar Lista
          </button>
        </div>
      </div>
    </div>
  );
};

export default InadimplentesPage;