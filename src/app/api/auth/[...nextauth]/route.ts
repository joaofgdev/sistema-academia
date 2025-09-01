import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Lista de usuários
const users = [
  { id: '1', name: 'João Carlos', username: 'joao', password: '111', role: 'admin' },
  { id: '2', name: 'Thiago', username: 'thiago', password: '222', role: 'professor' },
  { id: '3', name: 'Lucas', username: 'lucas', password: '333', role: 'professor' },
];

// Configuração do NextAuth
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Usuário", type: "text" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials: any) {
        if (!credentials) return null;
        const userFound = users.find(user => user.username === credentials.username);
        if (!userFound) throw new Error("Usuário não encontrado.");
        if (userFound.password !== credentials.password) throw new Error("Senha incorreta.");
        return userFound;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Exportando direto
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
