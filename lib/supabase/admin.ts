import { createClient } from "@supabase/supabase-js";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "./env";

/**
 * Cliente Supabase com service_role. Usar APENAS no servidor (API routes, server components).
 * Permite operações de admin (listar/criar/excluir usuários).
 */
export function createAdminClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseServiceRoleKey();
  if (!url || !key) {
    throw new Error(
      "Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local para usar o admin client."
    );
  }
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}
