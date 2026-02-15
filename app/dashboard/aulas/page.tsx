"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";

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
  const [aulaToDelete, setAulaToDelete] = useState<Aula | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleConfirmDelete = async () => {
    if (!aulaToDelete?.id) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/dashboard/aulas/${encodeURIComponent(String(aulaToDelete.id))}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAulas((prev) => prev.filter((a) => a.id !== aulaToDelete.id));
        setAulaToDelete(null);
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        Minhas Aulas
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Gerencie suas aulas cadastradas.
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
                No Supabase Dashboard → Authentication → Policies → Tabela &quot;aulas&quot;, crie uma política SELECT:
              </p>
              <code className="text-xs block mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded">
                CREATE POLICY &quot;Users can view their own aulas&quot;<br />
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
                <Link
                  href={`/dashboard/aulas/${aula.id}/editar`}
                  className="font-medium text-slate-900 dark:text-white hover:text-primary hover:underline"
                >
                  {getTitulo(aula)}
                </Link>
                {typeof aula.disciplina === "string" && aula.disciplina && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {aula.disciplina}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  {formatDate((aula.data_aula as string) ?? (aula.created_at as string))}
                </span>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/aulas/${aula.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-sky-600 hover:underline dark:text-sky-400"
                    aria-label={`Abrir link público da aula: ${getTitulo(aula)}`}
                  >
                    Link público
                  </Link>
                  <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-800/80 p-1">
                    <button
                      type="button"
                      onClick={() => {
                        const url = `${typeof window !== "undefined" ? window.location.origin : ""}/aulas/${aula.id}`;
                        navigator.clipboard.writeText(url);
                      }}
                      className="cursor-pointer p-1.5 rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                      title="Copiar link"
                      aria-label="Copiar link público"
                    >
                      <span className="material-icons-outlined text-lg">content_copy</span>
                    </button>
                    <Link
                      href={`/dashboard/aulas/${aula.id}/editar`}
                      className="cursor-pointer p-1.5 rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                      title="Editar aula"
                      aria-label={`Editar aula: ${getTitulo(aula)}`}
                    >
                      <span className="material-icons-outlined text-lg">edit</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setAulaToDelete(aula)}
                      className="cursor-pointer p-1.5 rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                      title="Excluir aula"
                      aria-label={`Excluir aula: ${getTitulo(aula)}`}
                    >
                      <span className="material-icons-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDeleteModal
        open={!!aulaToDelete}
        onClose={() => setAulaToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir aula?"
        message="Tem certeza que deseja excluir esta aula? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        loading={deleting}
      />
    </div>
  );
}
