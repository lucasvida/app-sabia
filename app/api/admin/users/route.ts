import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSuperAdminEmail } from "@/lib/supabase/env";

async function ensureSuperAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.email) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const superAdminEmail = getSuperAdminEmail();
  if (user.email.toLowerCase() !== superAdminEmail.toLowerCase()) {
    return NextResponse.json({ error: "Acesso restrito ao super admin." }, { status: 403 });
  }

  return null;
}

/**
 * GET /api/admin/users — Lista usuários (apenas super admin).
 */
export async function GET() {
  const authError = await ensureSuperAdmin();
  if (authError) return authError;

  try {
    const admin = createAdminClient();
    const {
      data: { users },
      error,
    } = await admin.auth.admin.listUsers({ page: 1, perPage: 500 });

    if (error) {
      console.error("Erro ao listar usuários:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const list = (users ?? []).map((u) => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      user_metadata: u.user_metadata,
    }));

    return NextResponse.json(list);
  } catch (err) {
    console.error("API admin users GET error:", err);
    return NextResponse.json({ error: "Erro ao listar usuários." }, { status: 500 });
  }
}

/**
 * POST /api/admin/users — Cria usuário (apenas super admin).
 * Body: { email: string, password: string, name?: string }
 */
export async function POST(request: Request) {
  const authError = await ensureSuperAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const name = typeof body.name === "string" ? body.name.trim() : undefined;

    if (!email) {
      return NextResponse.json({ error: "E-mail é obrigatório." }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Senha deve ter no mínimo 6 caracteres." }, { status: 400 });
    }

    let admin;
    try {
      admin = createAdminClient();
    } catch (configErr) {
      console.error("Admin client config error:", configErr);
      return NextResponse.json(
        { error: "Serviço indisponível. Configure SUPABASE_SERVICE_ROLE_KEY no servidor (.env.local)." },
        { status: 503 }
      );
    }

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: name ? { full_name: name } : undefined,
    });

    if (error) {
      console.error("Erro ao criar usuário:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      id: data.user?.id,
      email: data.user?.email,
      message: "Usuário criado. Ele já pode fazer login com o e-mail e senha definidos.",
    });
  } catch (err) {
    console.error("API admin users POST error:", err);
    const message = err instanceof Error ? err.message : "Erro ao criar usuário.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
