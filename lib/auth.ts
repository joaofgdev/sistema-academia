import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Lista de usuários
const users = [
  { id: '1', name: 'João Carlos', username: 'joao', password: '111', role: 'admin' },
  { id: '2', name: 'Thiago', username: 'thiago', password: '222', role: 'professor' },
  { id: '3', name: 'Lucas', username: 'lucas', password: '333', role: 'professor' },
];

// Configuração do NextAuth
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Usuário", type: "text" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;
        
        const userFound = users.find(user => user.username === credentials.username);
        
        if (!userFound) {
          throw new Error("Usuário não encontrado.");
        }
        
        if (userFound.password !== credentials.password) {
          throw new Error("Senha incorreta.");
        }
        
        return {
          id: userFound.id,
          name: userFound.name,
          username: userFound.username,
          role: userFound.role,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.username = (user as any).username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).username = token.username;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};