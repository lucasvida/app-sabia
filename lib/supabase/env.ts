/**
 * Retorna a chave pública do Supabase.
 * Aceita o nome antigo (ANON_KEY) ou o novo (PUBLISHABLE_KEY / PUBLISHABLE_DEFAULT_KEY).
 */
export function getSupabaseAnonKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

export function getSupabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
}

/** Chave de serviço (server-side apenas). Usada para operações admin (ex.: criar/listar/excluir usuários). */
export function getSupabaseServiceRoleKey(): string | undefined {
  return process.env.SUPABASE_SERVICE_ROLE_KEY;
}

/** E-mail do super admin. Só este usuário pode gerenciar outros (criar, listar, excluir). */
export function getSuperAdminEmail(): string {
  return process.env.SUPER_ADMIN_EMAIL ?? "professor@sabiaedu.ia.br";
}
