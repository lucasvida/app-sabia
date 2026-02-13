import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

/**
 * GET /api/aulas/[id] — Busca uma aula por id para exibição pública.
 * Usa um client anônimo (sem sessão) para que qualquer pessoa acesse.
 *
 * RLS necessário no Supabase: política SELECT na tabela "aulas"
 * para o role "anon" com USING (true).
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

    const url = getSupabaseUrl();
    const key = getSupabaseAnonKey();
    if (!url || !key) {
      return NextResponse.json({ error: "Supabase não configurado." }, { status: 500 });
    }

    // Client anônimo — não depende de cookies nem sessão
    const supabase = createSupabaseClient(url, key);

    const { data, error } = await supabase
      .from("aulas")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Aula não encontrada." }, { status: 404 });
      }
      console.error("Erro ao buscar aula:", error);
      return NextResponse.json(
        { error: "Erro ao buscar aula." },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("API aulas [id] error:", err);
    return NextResponse.json(
      { error: "Erro interno ao buscar aula." },
      { status: 500 }
    );
  }
}
