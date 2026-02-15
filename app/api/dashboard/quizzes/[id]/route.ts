import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const COL_PROFESSOR_ID = "id_professor";
const COL_JSON = "quizzes";

/**
 * GET /api/dashboard/quizzes/[id] — Busca um quiz para edição (apenas dono).
 * PATCH — Atualiza quiz (apenas dono).
 * DELETE — Remove quiz (apenas dono).
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID do quiz é obrigatório." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", id)
      .eq(COL_PROFESSOR_ID, user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Quiz não encontrado." }, { status: 404 });
      }
      console.error("Erro ao buscar quiz (dashboard):", error);
      return NextResponse.json({ error: "Erro ao buscar quiz." }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("API dashboard quizzes [id] GET error:", err);
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
      return NextResponse.json({ error: "ID do quiz é obrigatório." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const body = await request.json();
    const { titulo, conteudo } = body;

    const quizJson: Record<string, unknown> = {};
    const { data: existing } = await supabase
      .from("quizzes")
      .select(COL_JSON)
      .eq("id", id)
      .eq(COL_PROFESSOR_ID, user.id)
      .single();

    if (existing?.[COL_JSON as keyof typeof existing]) {
      const raw = existing[COL_JSON as keyof typeof existing];
      Object.assign(quizJson, typeof raw === "string" ? JSON.parse(raw) : raw);
    }
    if (titulo !== undefined) quizJson.titulo = titulo;
    if (conteudo !== undefined) quizJson.conteudo = conteudo;

    const { error } = await supabase
      .from("quizzes")
      .update({
        [COL_JSON]: quizJson,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq(COL_PROFESSOR_ID, user.id);

    if (error) {
      console.error("Erro ao atualizar quiz:", error);
      return NextResponse.json({ error: "Erro ao salvar quiz." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API dashboard quizzes [id] PATCH error:", err);
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
      return NextResponse.json({ error: "ID do quiz é obrigatório." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { error } = await supabase
      .from("quizzes")
      .delete()
      .eq("id", id)
      .eq(COL_PROFESSOR_ID, user.id);

    if (error) {
      console.error("Erro ao deletar quiz:", error);
      return NextResponse.json({ error: "Erro ao deletar quiz." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API dashboard quizzes [id] DELETE error:", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
