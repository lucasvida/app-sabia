"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";

/** Coluna que armazena o UUID do professor na tabela plano_de_aula. */
const COL_PROFESSOR_ID = "id_professor";

type PlanoJson = {
  titulo?: string;
  [key: string]: unknown;
};

type PlanoDeAula = {
  id: number | string;
  id_professor?: string;
  planos_de_aulas?: PlanoJson | string;
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

function getTitulo(plano: PlanoDeAula): string {
  if (plano.planos_de_aulas) {
    let planoJson: PlanoJson;
    if (typeof plano.planos_de_aulas === "string") {
      try {
        planoJson = JSON.parse(plano.planos_de_aulas);
      } catch {
        planoJson = {};
      }
    } else {
      planoJson = plano.planos_de_aulas as PlanoJson;
    }
    if (planoJson.titulo) return planoJson.titulo;
  }
  return (plano as { titulo?: string }).titulo ?? "Plano sem título";
}

export default function PlanejamentoPage() {
  const [planos, setPlanos] = useState<PlanoDeAula[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [planoToDelete, setPlanoToDelete] = useState<PlanoDeAula | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadPlanos() {
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
        setPlanos([]);
        setLoading(false);
        return;
      }

      const { data, error: err } = await supabase
        .from("planos_de_aulas")
        .select("*")
        .eq(COL_PROFESSOR_ID, user.id)
        .order("created_at", { ascending: false });

      if (err) {
        console.error("Erro ao buscar planos:", err);
        setError(`Erro ao buscar planos: ${err.message}. Verifique as políticas RLS no Supabase.`);
        setPlanos([]);
      } else {
        setPlanos((data as PlanoDeAula[]) ?? []);
      }
      setLoading(false);
    }
    loadPlanos();
  }, []);

  const handleConfirmDelete = async () => {
    if (!planoToDelete?.id) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/dashboard/planejamento/${encodeURIComponent(String(planoToDelete.id))}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPlanos((prev) => prev.filter((p) => p.id !== planoToDelete.id));
        setPlanoToDelete(null);
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        Planejamento de Aula
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Gerencie seus planos de aula cadastrados.
      </p>

      {loading && (
        <p className="mt-6 text-slate-500 dark:text-slate-400">Carregando planos…</p>
      )}

      {error && (
        <div className="mt-6 rounded-md bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          <p className="font-semibold mb-1">Erro ao carregar planos:</p>
          <p>{error}</p>
          {error.includes("RLS") && (
            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
              <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                💡 Possível problema de RLS (Row Level Security):
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                No Supabase Dashboard → Authentication → Policies → Tabela &quot;planos_de_aulas&quot;, crie uma política SELECT:
              </p>
              <code className="text-xs block mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded">
                CREATE POLICY &quot;Users can view their own planos_de_aulas&quot;<br />
                ON planos_de_aulas FOR SELECT<br />
                USING (id_professor = auth.uid());
              </code>
            </div>
          )}
        </div>
      )}

      {!loading && !error && planos.length === 0 && (
        <p className="mt-6 text-slate-500 dark:text-slate-400">
          Nenhum plano de aula cadastrado ainda.
        </p>
      )}

      {!loading && !error && planos.length > 0 && (
        <ul className="mt-6 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white shadow-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
          {planos.map((plano) => (
            <li
              key={plano.id}
              className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <Link
                  href={`/dashboard/planejamento/${plano.id}/editar`}
                  className="font-medium text-slate-900 dark:text-white hover:text-primary hover:underline"
                >
                  {getTitulo(plano)}
                </Link>
                {typeof plano.disciplina === "string" && plano.disciplina && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {plano.disciplina}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  {formatDate((plano.data_plano as string) ?? (plano.created_at as string))}
                </span>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/dashboard/planejamento/${plano.id}`}
                    className="font-medium text-sky-600 hover:underline dark:text-sky-400"
                    aria-label={`Ver plano: ${getTitulo(plano)}`}
                  >
                    Ver
                  </Link>
                  <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-800/80 p-1">
                    <Link
                      href={`/dashboard/planejamento/${plano.id}/editar`}
                      className="cursor-pointer p-1.5 rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                      title="Editar plano"
                      aria-label={`Editar plano: ${getTitulo(plano)}`}
                    >
                      <span className="material-icons-outlined text-lg">edit</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setPlanoToDelete(plano)}
                      className="cursor-pointer p-1.5 rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                      title="Excluir plano"
                      aria-label={`Excluir plano: ${getTitulo(plano)}`}
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
        open={!!planoToDelete}
        onClose={() => setPlanoToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir plano de aula?"
        message="Tem certeza que deseja excluir este plano de aula? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        loading={deleting}
      />
    </div>
  );
}
