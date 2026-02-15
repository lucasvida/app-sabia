import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const COL_PROFESSOR_ID = "id_professor";

/**
 * GET /api/dashboard/aulas/[id] — Busca uma aula para edição (apenas dono).
 * PATCH — Atualiza aula (apenas dono).
 * DELETE — Remove aula (apenas dono).
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID da aula é obrigatório." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("aulas")
      .select("*")
      .eq("id", id)
      .eq(COL_PROFESSOR_ID, user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Aula não encontrada." }, { status: 404 });
      }
      console.error("Erro ao buscar aula (dashboard):", error);
      return NextResponse.json({ error: "Erro ao buscar aula." }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("API dashboard aulas [id] GET error:", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID da aula é obrigatório." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const body = await request.json();
    const { titulo, conteudo } = body;

    const aulaJson: Record<string, unknown> = {};
    const { data: existing } = await supabase
      .from("aulas")
      .select("aula")
      .eq("id", id)
      .eq(COL_PROFESSOR_ID, user.id)
      .single();

    if (existing?.aula) {
      Object.assign(aulaJson, typeof existing.aula === "string" ? JSON.parse(existing.aula) : existing.aula);
    }
    if (titulo !== undefined) aulaJson.titulo = titulo;
    if (conteudo !== undefined) aulaJson.conteudo = conteudo;

    const { error } = await supabase
      .from("aulas")
      .update({
        aula: aulaJson,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq(COL_PROFESSOR_ID, user.id);

    if (error) {
      console.error("Erro ao atualizar aula:", error);
      return NextResponse.json({ error: "Erro ao salvar aula." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API dashboard aulas [id] PATCH error:", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID da aula é obrigatório." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { error } = await supabase
      .from("aulas")
      .delete()
      .eq("id", id)
      .eq(COL_PROFESSOR_ID, user.id);

    if (error) {
      console.error("Erro ao deletar aula:", error);
      return NextResponse.json({ error: "Erro ao deletar aula." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API dashboard aulas [id] DELETE error:", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
