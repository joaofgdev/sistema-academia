import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { apiComCriptografia } from './functions/resourse'; 
// 1. CORREÇÃO: Importe o 'Effect' junto com o 'PolicyStatement'
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam'; 

const backend = defineBackend({
  auth,
  data,
  apiComCriptografia, 
});

const alunoTableArn = backend.data.resources.tables.Aluno.tableArn;

// Adicionando a política de permissão para o DynamoDB
backend.apiComCriptografia.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    // 2. CORREÇÃO: Use o tipo 'Effect.ALLOW' em vez do texto "Allow"
    effect: Effect.ALLOW,
    actions: ['dynamodb:PutItem', 'dynamodb:GetItem'],
    resources: [alunoTableArn],
  })
);

// Adicionando a política de permissão para o KMS
// **SUBSTITUA 'us-east-1' E 'SEU_ACCOUNT_ID' PELOS SEUS DADOS!**
backend.apiComCriptografia.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    // 3. CORREÇÃO: Use o tipo 'Effect.ALLOW' aqui também
    effect: Effect.ALLOW,
    actions: ['kms:Encrypt', 'kms:Decrypt', 'kms:GenerateDataKey'],
    resources: ['arn:aws:kms:us-east-1:0726-7421-7150:alias/chave-academia-dynamo'],
  })
);