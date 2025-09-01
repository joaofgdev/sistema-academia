import 'next-auth';
import 'next-auth/jwt';

/**
 * Este arquivo estende os tipos padrão do NextAuth para incluir
 * as propriedades personalizadas que adicionamos (id e role).
 * O TypeScript agora saberá que esses campos existem na sessão e no token.
 */

declare module 'next-auth' {
  /**
   * Retornado pela `useSession`, `getSession` e recebido como prop para o `SessionProvider`.
   */
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user']; // Mantém os campos padrão (name, email, image)
  }

  /**
   * O objeto de usuário que passamos para o token JWT.
   */
  interface User {
    id: string;
    role: string;
  }
}

declare module 'next-auth/jwt' {
  /** Retornado pela função `jwt` e recebido como `token` na função `session`. */
  interface JWT {
    id: string;
    role: string;
  }
}
