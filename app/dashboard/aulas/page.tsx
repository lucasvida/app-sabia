"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

/** Coluna que armazena o UUID do professor na tabela aulas. */
const COL_PROFESSOR_ID = "id_professor";

type AulaJson = {
  titulo?: string;
  [key: string]: unknown;
};

type Aula = {
  id: number | string;
  id_professor?: string;
  aula?: AulaJson | string; // JSON com titulo dentro
  created_at?: string;
  [key: string]: unknown;
};

function formatDate(s: string | undefined): string {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function getTitulo(aula: Aula): string {
  // Tenta acessar aula.titulo do JSON
  if (aula.aula) {
    let aulaJson: AulaJson;
    if (typeof aula.aula === "string") {
      try {
        aulaJson = JSON.parse(aula.aula);
      } catch {
        aulaJson = {};
      }
    } else {
      aulaJson = aula.aula as AulaJson;
    }
    if (aulaJson.titulo) return aulaJson.titulo;
  }
  // Fallbacks
  return (aula as { titulo?: string }).titulo ?? "Aula sem título";
}

export default function AulasPage() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAulas() {
      const supabase = createClient();
      if (!supabase) {
        setError("Supabase não configurado.");
        setLoading(false);
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        setError(`Erro ao buscar usuário: ${userError.message}`);
        setLoading(false);
        return;
      }

      if (!user?.id) {
        setError("Usuário não autenticado.");
        setAulas([]);
        setLoading(false);
        return;
      }

      const { data, error: err } = await supabase
        .from("aulas")
        .select("*")
        .eq(COL_PROFESSOR_ID, user.id)
        .order("created_at", { ascending: false });

      if (err) {
        console.error("Erro ao buscar aulas:", err);
        setError(`Erro ao buscar aulas: ${err.message}. Verifique as políticas RLS no Supabase.`);
        setAulas([]);
      } else {
        setAulas((data as Aula[]) ?? []);
      }
      setLoading(false);
    }
    loadAulas();
  }, []);

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        Minhas Aulas
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Gerencie suas aulas e planejamentos.
      </p>

      {loading && (
        <p className="mt-6 text-slate-500 dark:text-slate-400">Carregando aulas…</p>
      )}

      {error && (
        <div className="mt-6 rounded-md bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          <p className="font-semibold mb-1">Erro ao carregar aulas:</p>
          <p>{error}</p>
          {error.includes("RLS") && (
            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
              <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                💡 Possível problema de RLS (Row Level Security):
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                No Supabase Dashboard → Authentication → Policies → Tabela "aulas", crie uma política SELECT:
              </p>
              <code className="text-xs block mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded">
                CREATE POLICY "Users can view their own aulas"<br />
                ON aulas FOR SELECT<br />
                USING (id_professor = auth.uid());
              </code>
            </div>
          )}
        </div>
      )}


      {!loading && !error && aulas.length === 0 && (
        <p className="mt-6 text-slate-500 dark:text-slate-400">
          Nenhuma aula cadastrada ainda.
        </p>
      )}

      {!loading && !error && aulas.length > 0 && (
        <ul className="mt-6 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white shadow-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
          {aulas.map((aula) => (
            <li
              key={aula.id}
              className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900 dark:text-white">
                  {getTitulo(aula)}
                </p>
                {typeof aula.disciplina === "string" && aula.disciplina && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {aula.disciplina}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  {formatDate(aula.data_aula ?? aula.created_at)}
                </span>
                <Link
                  href={`/aulas/${aula.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-sky-600 hover:underline dark:text-sky-400"
                  aria-label={`Abrir link público da aula: ${getTitulo(aula)}`}
                >
                  Link público
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
