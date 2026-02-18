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
 * DELETE /api/admin/users/[id] — Exclui usuário (apenas super admin).
 * Não permite excluir a si mesmo (super admin).
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await ensureSuperAdmin();
  if (authError) return authError;

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "ID do usuário é obrigatório." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();
  if (currentUser?.id === id) {
    return NextResponse.json({ error: "Você não pode excluir sua própria conta." }, { status: 400 });
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(id);

    if (error) {
      console.error("Erro ao excluir usuário:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API admin users DELETE error:", err);
    return NextResponse.json({ error: "Erro ao excluir usuário." }, { status: 500 });
  }
}
