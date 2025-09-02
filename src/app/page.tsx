import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth"; // Ajuste o caminho conforme necessário
import AlunosClientPage from "./alunos/AlunosClientPage"; // 1. Importe seu componente cliente

// Este é o Componente Servidor que protege a rota
export default async function PaginaAlunosProtegida() {
  // Pega a sessão no servidor
  const session = await getServerSession(authOptions);

  // Se não houver sessão, redireciona para o login
  if (!session) {
    redirect("/login");
  }

  // 2. Se o usuário estiver logado, renderiza o componente cliente
  return <AlunosClientPage />;
}
