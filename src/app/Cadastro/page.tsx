'use client';

import React, { useState } from 'react';
// Assumindo que PageTitle e PrimaryButton estão em '../components/'
// Se não existirem, você precisará criá-los ou usar elementos HTML simples.

// Componente de título simples (exemplo, se não tiver um PageTitle real)
const PageTitle: React.FC<{ title: string }> = ({ title }) => (
  <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{title}</h1>
);

// Componente de botão primário simples (exemplo, se não tiver um PrimaryButton real)
const PrimaryButton: React.FC<{ children: React.ReactNode; type?: "button" | "submit" | "reset" }> = ({ children, type = "button" }) => (
  <button
    type={type}
    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md
               shadow-lg transition duration-300 ease-in-out transform hover:scale-105
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
  >
    {children}
  </button>
);


interface FormData {
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  inicioPlano: string;
  tipoPlano: 'Mensal' | 'Trimestral' | 'Anual' | ''; // Adicionado tipoPlano
  vencimentoPlano: string; // Mantido aqui para o resultado final, mas não no input
}

const CadastroPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    cpf: '',
    dataNascimento: '',
    telefone: '',
    email: '',
    inicioPlano: '',
    tipoPlano: '', // Inicializa tipoPlano
    vencimentoPlano: '', // Será calculado
  });

  const [cadastrosList, setCadastrosList] = useState<FormData[]>([]);

  // Handler para inputs de texto e data
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Lógica para calcular o vencimento do plano
    let calculatedVencimentoPlano = '';
    if (formData.inicioPlano && formData.tipoPlano) {
      const startDate = new Date(formData.inicioPlano + 'T00:00:00'); // Adiciona T00:00:00 para evitar problemas de fuso horário
      let endDate = new Date(startDate);

      switch (formData.tipoPlano) {
        case 'Mensal':
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case 'Trimestral':
          endDate.setMonth(endDate.getMonth() + 3);
          break;
        case 'Anual':
          endDate.setMonth(endDate.getMonth() + 12);
          break;
        default:
          break;
      }

      // Formata a data de vencimento para 'YYYY-MM-DD'
      const year = endDate.getFullYear();
      const month = String(endDate.getMonth() + 1).padStart(2, '0'); // Mês é 0-indexed
      const day = String(endDate.getDate()).padStart(2, '0');
      calculatedVencimentoPlano = `${year}-${month}-${day}`;
    }

    // Adiciona o novo cadastro com o vencimento calculado
    setCadastrosList((prevList) => [
      ...prevList,
      { ...formData, vencimentoPlano: calculatedVencimentoPlano },
    ]);

    // Limpa o formulário
    setFormData({
      nome: '',
      cpf: '',
      dataNascimento: '',
      telefone: '',
      email: '',
      inicioPlano: '',
      tipoPlano: '',
      vencimentoPlano: '', // Limpa também o vencimento para o próximo formulário
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <PageTitle title="Cadastro de Alunos" />

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { label: 'Nome', name: 'nome', type: 'text' },
            { label: 'CPF', name: 'cpf', type: 'text' },
            { label: 'Data de Nascimento', name: 'dataNascimento', type: 'date' },
            { label: 'Telefone', name: 'telefone', type: 'tel' },
            { label: 'E-mail', name: 'email', type: 'email' },
            { label: 'Início do Plano', name: 'inicioPlano', type: 'date' },
            // Removido o campo 'Vencimento do Plano' do formulário
          ].map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-gray-700 text-sm font-medium mb-1">
                {field.label}:
              </label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={(formData as any)[field.name]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#A6A5A4]"
                required
              />
            </div>
          ))}

          {/* Novo campo de seleção para o tipo de plano */}
          <div>
            <label htmlFor="tipoPlano" className="block text-gray-700 text-sm font-medium mb-1">
              Tipo de Plano:
            </label>
            <select
              id="tipoPlano"
              name="tipoPlano"
              value={formData.tipoPlano}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         text-gray-900 bg-white appearance-none transition duration-150 ease-in-out
                         sm:text-base text-sm"
              required
            >
              <option value="">-- Selecione o Tipo de Plano --</option>
              <option value="Mensal">Mensal</option>
              <option value="Trimestral">Trimestral</option>
              <option value="Anual">Anual</option>
            </select>
          </div>

          <div className="flex justify-center mt-8">
            <PrimaryButton type="submit">Salvar</PrimaryButton>
          </div>
        </form>

        <div className="mt-10 pt-6 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Cadastros Realizados</h2>
          {cadastrosList.length === 0 ? (
            <p className="text-center text-gray-600">Nenhum cadastro ainda.</p>
          ) : (
            <ul className="space-y-4">
              {cadastrosList.map((cadastro, index) => (
                <li key={index} className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-100 text-gray-800">
                  <p><strong>Nome:</strong> {cadastro.nome}</p>
                  <p><strong>CPF:</strong> {cadastro.cpf}</p>
                  <p><strong>Data Nasc.:</strong> {cadastro.dataNascimento}</p>
                  <p><strong>Telefone:</strong> {cadastro.telefone}</p>
                  <p><strong>Email:</strong> {cadastro.email}</p>
                  <p><strong>Início Plano:</strong> {cadastro.inicioPlano}</p>
                  <p><strong>Tipo Plano:</strong> {cadastro.tipoPlano}</p> {/* Exibe o tipo de plano */}
                  <p><strong>Venc. Plano:</strong> {cadastro.vencimentoPlano}</p> {/* Exibe o vencimento calculado */}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CadastroPage;
