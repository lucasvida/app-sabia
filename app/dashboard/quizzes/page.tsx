"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";

/** Coluna que armazena o UUID do professor na tabela quiz. */
const COL_PROFESSOR_ID = "id_professor";

type QuizJson = {
  titulo?: string;
  [key: string]: unknown;
};

type Quiz = {
  id: number | string;
  id_professor?: string;
  quizzes?: QuizJson | string;
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

function getTitulo(quiz: Quiz): string {
  if (quiz.quizzes) {
    let quizJson: QuizJson;
    if (typeof quiz.quizzes === "string") {
      try {
        quizJson = JSON.parse(quiz.quizzes);
      } catch {
        quizJson = {};
      }
    } else {
      quizJson = quiz.quizzes as QuizJson;
    }
    if (quizJson.titulo) return quizJson.titulo;
  }
  return (quiz as { titulo?: string }).titulo ?? "Quiz sem título";
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadQuizzes() {
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
        setQuizzes([]);
        setLoading(false);
        return;
      }

      const { data, error: err } = await supabase
        .from("quizzes")
        .select("*")
        .eq(COL_PROFESSOR_ID, user.id)
        .order("created_at", { ascending: false });

      if (err) {
        console.error("Erro ao buscar quizzes:", err);
        setError(`Erro ao buscar quizzes: ${err.message}. Verifique as políticas RLS no Supabase.`);
        setQuizzes([]);
      } else {
        setQuizzes((data as Quiz[]) ?? []);
      }
      setLoading(false);
    }
    loadQuizzes();
  }, []);

  const handleConfirmDelete = async () => {
    if (!quizToDelete?.id) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/dashboard/quizzes/${encodeURIComponent(String(quizToDelete.id))}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setQuizzes((prev) => prev.filter((q) => q.id !== quizToDelete.id));
        setQuizToDelete(null);
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        Meus Quizzes
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Gerencie seus quizzes cadastrados.
      </p>

      {loading && (
        <p className="mt-6 text-slate-500 dark:text-slate-400">Carregando quizzes…</p>
      )}

      {error && (
        <div className="mt-6 rounded-md bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          <p className="font-semibold mb-1">Erro ao carregar quizzes:</p>
          <p>{error}</p>
          {error.includes("RLS") && (
            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
              <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                💡 Possível problema de RLS (Row Level Security):
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                No Supabase Dashboard → Authentication → Policies → Tabela &quot;quizzes&quot;, crie uma política SELECT:
              </p>
              <code className="text-xs block mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded">
                CREATE POLICY &quot;Users can view their own quiz&quot;<br />
                ON quizzes FOR SELECT<br />
                USING (id_professor = auth.uid());
              </code>
            </div>
          )}
        </div>
      )}

      {!loading && !error && quizzes.length === 0 && (
        <p className="mt-6 text-slate-500 dark:text-slate-400">
          Nenhum quiz cadastrado ainda.
        </p>
      )}

      {!loading && !error && quizzes.length > 0 && (
        <ul className="mt-6 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white shadow-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
          {quizzes.map((quiz) => (
            <li
              key={quiz.id}
              className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <Link
                  href={`/dashboard/quizzes/${quiz.id}/editar`}
                  className="font-medium text-slate-900 dark:text-white hover:text-primary hover:underline"
                >
                  {getTitulo(quiz)}
                </Link>
                {typeof quiz.disciplina === "string" && quiz.disciplina && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {quiz.disciplina}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  {formatDate((quiz.data_quiz as string) ?? (quiz.created_at as string))}
                </span>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/quizzes/${quiz.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-sky-600 hover:underline dark:text-sky-400"
                    aria-label={`Abrir link público do quiz: ${getTitulo(quiz)}`}
                  >
                    Link público
                  </Link>
                  <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-800/80 p-1">
                    <button
                      type="button"
                      onClick={() => {
                        const url = `${typeof window !== "undefined" ? window.location.origin : ""}/quizzes/${quiz.id}`;
                        navigator.clipboard.writeText(url);
                      }}
                      className="cursor-pointer p-1.5 rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                      title="Copiar link"
                      aria-label="Copiar link público"
                    >
                      <span className="material-icons-outlined text-lg">content_copy</span>
                    </button>
                    <Link
                      href={`/dashboard/quizzes/${quiz.id}/editar`}
                      className="cursor-pointer p-1.5 rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                      title="Editar quiz"
                      aria-label={`Editar quiz: ${getTitulo(quiz)}`}
                    >
                      <span className="material-icons-outlined text-lg">edit</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setQuizToDelete(quiz)}
                      className="cursor-pointer p-1.5 rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                      title="Excluir quiz"
                      aria-label={`Excluir quiz: ${getTitulo(quiz)}`}
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
        open={!!quizToDelete}
        onClose={() => setQuizToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir quiz?"
        message="Tem certeza que deseja excluir este quiz? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        loading={deleting}
      />
    </div>
  );
}
