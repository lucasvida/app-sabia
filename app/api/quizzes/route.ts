import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

/**
 * GET /api/quizzes — Lista as 20 últimas quizzes (público, sem sessão).
 *
 * Requer política RLS: SELECT para role "anon" com USING (true).
 */
export async function GET() {
  try {
    const url = getSupabaseUrl();
    const key = getSupabaseAnonKey();
    if (!url || !key) {
      return NextResponse.json({ error: "Supabase não configurado." }, { status: 500 });
    }

    const supabase = createClient(url, key);

    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Erro ao listar quizzes:", error);
      return NextResponse.json({ error: "Erro ao carregar quizzes." }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("API quizzes list error:", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
