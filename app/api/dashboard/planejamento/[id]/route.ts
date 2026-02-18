import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const COL_PROFESSOR_ID = "id_professor";
const COL_JSON = "planos_de_aulas";

/**
 * GET /api/dashboard/planejamento/[id] — Busca um plano de aula para edição (apenas dono).
 * PATCH — Atualiza plano (apenas dono).
 * DELETE — Remove plano (apenas dono).
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID do plano é obrigatório." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("planos_de_aulas")
      .select("*")
      .eq("id", id)
      .eq(COL_PROFESSOR_ID, user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Plano de aula não encontrado." }, { status: 404 });
      }
      console.error("Erro ao buscar plano (dashboard):", error);
      return NextResponse.json({ error: "Erro ao buscar plano de aula." }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("API dashboard planejamento [id] GET error:", err);
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
      return NextResponse.json({ error: "ID do plano é obrigatório." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const body = await request.json();
    const { titulo, conteudo } = body;

    const planoJson: Record<string, unknown> = {};
    const { data: existing } = await supabase
      .from("planos_de_aulas")
      .select(COL_JSON)
      .eq("id", id)
      .eq(COL_PROFESSOR_ID, user.id)
      .single();

    if (existing?.[COL_JSON as keyof typeof existing]) {
      const raw = existing[COL_JSON as keyof typeof existing];
      if (typeof raw === "string") {
        try {
          Object.assign(planoJson, JSON.parse(raw));
        } catch {
          // Valor no banco não é JSON válido (ex.: HTML puro); começa do zero com titulo/conteudo
        }
      } else if (raw && typeof raw === "object") {
        Object.assign(planoJson, raw);
      }
    }
    if (titulo !== undefined) planoJson.titulo = titulo;
    if (conteudo !== undefined) planoJson.conteudo = conteudo;

    const { error } = await supabase
      .from("planos_de_aulas")
      .update({
        [COL_JSON]: planoJson,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq(COL_PROFESSOR_ID, user.id);

    if (error) {
      console.error("Erro ao atualizar plano:", error);
      return NextResponse.json({ error: "Erro ao salvar plano de aula." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API dashboard planejamento [id] PATCH error:", err);
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
      return NextResponse.json({ error: "ID do plano é obrigatório." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { error } = await supabase
      .from("planos_de_aulas")
      .delete()
      .eq("id", id)
      .eq(COL_PROFESSOR_ID, user.id);

    if (error) {
      console.error("Erro ao deletar plano:", error);
      return NextResponse.json({ error: "Erro ao deletar plano de aula." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API dashboard planejamento [id] DELETE error:", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
