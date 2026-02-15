import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

/**
 * GET /api/planejamento/[id] — Busca um plano de aula por id para exibição pública.
 * Usa um client anônimo (sem sessão) para que qualquer pessoa acesse.
 *
 * RLS necessário no Supabase: política SELECT na tabela "planos_de_aulas"
 * para o role "anon" com USING (true).
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

    const url = getSupabaseUrl();
    const key = getSupabaseAnonKey();
    if (!url || !key) {
      return NextResponse.json({ error: "Supabase não configurado." }, { status: 500 });
    }

    const supabase = createSupabaseClient(url, key);

    const { data, error } = await supabase
      .from("planos_de_aulas")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Plano de aula não encontrado." }, { status: 404 });
      }
      console.error("Erro ao buscar plano:", error);
      return NextResponse.json(
        { error: "Erro ao buscar plano de aula." },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("API planejamento [id] error:", err);
    return NextResponse.json(
      { error: "Erro interno ao buscar plano de aula." },
      { status: 500 }
    );
  }
}
