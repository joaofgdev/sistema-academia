import { defineFunction } from '@aws-amplify/backend';

export const apiComCriptografia = defineFunction({
  // Aponta para o arquivo que contém a lógica
  entry: './handler.ts',
  
  // Define variáveis de ambiente que estarão disponíveis dentro da função
  environment: {
    KMS_KEY_ALIAS: 'alias/chave-academia-dynamo' // A chave que você criou no KMS
  }
});