import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // Usuários que acessam o sistema (dono e sócio da academia)
  User: a
    .model({
      nome: a.string().required(),
      email: a.email().required(),
    })
    .authorization((allow) => [allow.authenticated()]),

  // Alunos cadastrados no sistema
  Aluno: a
    .model({
      nome_aluno: a.string().required(),
      cpf: a.string().required(),
      data_nascimento: a.date().required(),
      telefone: a.string(),
      email: a.string().required(),
      data_cadastro: a.date().required(),
      data_inicio_plano: a.date().required(),
      data_fim_plano: a.date().required(), // esse será calculado via código e salvo no banco
      tipo_plano: a.enum(['MENSAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL']),
      informacoes_adicionais: a.string(),
    })
    // AQUI está a correção: use allow.guest() para permitir acesso público
    .authorization((allow) => [
      allow.authenticated(),
      allow.guest().to(['create', 'read', 'delete', 'update'])
    ])
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});
