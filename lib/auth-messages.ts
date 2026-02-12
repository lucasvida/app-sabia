/**
 * Traduz mensagens de erro do Supabase Auth para português brasileiro.
 */
export function getAuthErrorMessage(error: { message?: string; status?: number }): string {
  const msg = (error?.message ?? "").toLowerCase();

  if (msg.includes("invalid login credentials") || msg.includes("invalid_credentials")) {
    return "E-mail ou senha incorretos. Verifique e tente novamente.";
  }
  if (msg.includes("email not confirmed")) {
    return "E-mail ainda não confirmado. Confira sua caixa de entrada.";
  }
  if (msg.includes("user not found")) {
    return "Usuário não encontrado.";
  }
  if (msg.includes("too many requests") || error?.status === 429) {
    return "Muitas tentativas. Aguarde um momento e tente novamente.";
  }
  if (msg.includes("invalid email")) {
    return "E-mail inválido.";
  }
  if (msg.includes("password")) {
    return "Senha incorreta ou inválida.";
  }
  if (msg.includes("network") || msg.includes("fetch")) {
    return "Erro de conexão. Verifique sua internet e tente novamente.";
  }

  // Mensagem genérica para qualquer outro erro
  return "Não foi possível entrar. Tente novamente.";
}
