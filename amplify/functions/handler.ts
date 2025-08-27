import { KmsKeyringNode } from '@aws-crypto/kms-keyring-node'; // Nome corrigido para a importação
import { buildClient, CommitmentPolicy } from '@aws-crypto/client-node';
import { DynamoDBClient, PutItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

// Criando o cliente de criptografia
const { encrypt, decrypt } = buildClient(
  CommitmentPolicy.REQUIRE_ENCRYPT_REQUIRE_DECRYPT
);

// --- Configurações ---
const TABLE_NAME = process.env.AMPLIFY_DATA_ALUNO_TABLE_NAME;
const KMS_KEY_ALIAS = process.env.KMS_KEY_ALIAS;

if (!TABLE_NAME || !KMS_KEY_ALIAS) {
  throw new Error("Variáveis de ambiente essenciais não estão definidas!");
}

const dynamoDbClient = new DynamoDBClient({});
const keyring = new KmsKeyringNode({ generatorKeyId: KMS_KEY_ALIAS });

// Lista dos campos que devem ser criptografados
const CAMPOS_SENSIVEIS = ['cpf', 'email', 'telefone'];

// --- Funções Auxiliares para Criptografia ---

/**
 * Criptografa os valores dos campos sensíveis em um objeto.
 */
async function encryptFields(data: Record<string, any>): Promise<Record<string, any>> {
  const encryptedData = { ...data };
  for (const field of CAMPOS_SENSIVEIS) {
    if (encryptedData[field]) {
      const { result } = await encrypt(keyring, encryptedData[field].toString());
      encryptedData[field] = result; // Substitui o valor original pelo Buffer criptografado
    }
  }
  return encryptedData;
}

/**
 * Descriptografa os valores dos campos sensíveis em um objeto.
 */
async function decryptFields(data: Record<string, any>): Promise<Record<string, any>> {
  const decryptedData = { ...data };
  for (const field of CAMPOS_SENSIVEIS) {
    if (decryptedData[field]) {
      const { plaintext } = await decrypt(keyring, decryptedData[field]);
      decryptedData[field] = plaintext.toString(); // Substitui o Buffer pelo valor original
    }
  }
  return decryptedData;
}


// --- Handler Principal da API ---

export const handler = async (event: any) => {
  const method = event.requestContext.http.method;
  const path = event.rawPath;
  const body = event.body ? JSON.parse(event.body) : {};

  try {
    // Rota para CADASTRAR um novo aluno
    if (method === 'POST' && path === '/alunos') {
      const dadosAluno = body;
      dadosAluno.id = `aluno-${Date.now()}`;

      // 1. Criptografa campo por campo
      const dadosParaSalvar = await encryptFields(dadosAluno);

      // 2. 'Marshall' converte o objeto (que agora tem Buffers) para o formato do DynamoDB
      const itemFormatado = marshall(dadosParaSalvar);

      await dynamoDbClient.send(new PutItemCommand({
        TableName: TABLE_NAME,
        Item: itemFormatado, // Agora os tipos são compatíveis!
      }));
      
      return { statusCode: 201, body: JSON.stringify({ message: 'Aluno criado com sucesso!', id: dadosAluno.id }) };
    }

    // Rota para BUSCAR um aluno pelo ID
    if (method === 'GET' && path.startsWith('/alunos/')) {
      const alunoId = path.split('/')[2];
      
      const { Item: itemDoBanco } = await dynamoDbClient.send(new GetItemCommand({
        TableName: TABLE_NAME,
        Key: marshall({ id: alunoId }),
      }));

      if (itemDoBanco) {
        // 1. 'Unmarshall' converte do formato DynamoDB de volta para um objeto JS
        const dadosComBuffer = unmarshall(itemDoBanco);
        
        // 2. Descriptografa campo por campo
        const dadosDecifrados = await decryptFields(dadosComBuffer);

        return { statusCode: 200, body: JSON.stringify(dadosDecifrados) };
      } else {
        return { statusCode: 404, body: JSON.stringify({ message: 'Aluno não encontrado.' }) };
      }
    }
    
    return { statusCode: 404, body: JSON.stringify({ message: `Rota não encontrada: ${method} ${path}` }) };

  } catch (error: any) {
    console.error('ERRO INESPERADO:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Erro interno no servidor.', error: error.message }) };
  }
};