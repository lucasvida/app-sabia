"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Tipo = "aula" | "plano" | "quiz";

type ItemHistorico = {
  id: string | number;
  tipo: Tipo;
  titulo: string;
  created_at: string;
  href: string;
  icon: string;
  iconBg: string;
  labelCategoria: string;
};

function getTituloAula(aula: { aula?: unknown }): string {
  if (!aula?.aula) return "Aula sem título";
  try {
    const j = typeof aula.aula === "string" ? JSON.parse(aula.aula) : aula.aula;
    return (j?.titulo as string) ?? "Aula sem título";
  } catch {
    return "Aula sem título";
  }
}
function getTituloPlano(plano: { planos_de_aulas?: unknown }): string {
  if (!plano?.planos_de_aulas) return "Plano sem título";
  try {
    const j = typeof plano.planos_de_aulas === "string" ? JSON.parse(plano.planos_de_aulas) : plano.planos_de_aulas;
    return (j?.titulo as string) ?? "Plano sem título";
  } catch {
    return "Plano sem título";
  }
}
function getTituloQuiz(quiz: { quizzes?: unknown }): string {
  if (!quiz?.quizzes) return "Quiz sem título";
  try {
    const j = typeof quiz.quizzes === "string" ? JSON.parse(quiz.quizzes) : quiz.quizzes;
    return (j?.titulo as string) ?? "Quiz sem título";
  } catch {
    return "Quiz sem título";
  }
}
function formatData(s: string | undefined): string {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

const FILTROS: { value: "todos" | Tipo; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "aula", label: "Aulas" },
  { value: "plano", label: "Planos de Aula" },
  { value: "quiz", label: "Quizzes" },
];

export default function HistoricoPage() {
  const [items, setItems] = useState<ItemHistorico[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<"todos" | Tipo>("todos");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) {
        setItems([]);
        setLoading(false);
        return;
      }
      try {
        const [aulasRes, planosRes, quizzesRes] = await Promise.all([
          supabase.from("aulas").select("id, aula, created_at").eq("id_professor", user.id).order("created_at", { ascending: false }),
          supabase.from("planos_de_aulas").select("id, planos_de_aulas, created_at").eq("id_professor", user.id).order("created_at", { ascending: false }),
          supabase.from("quizzes").select("id, quizzes, created_at").eq("id_professor", user.id).order("created_at", { ascending: false }),
        ]);
        const list: ItemHistorico[] = [];
        (aulasRes.data ?? []).forEach((a: { id: number; aula?: unknown; created_at?: string }) => {
          list.push({
            id: a.id,
            tipo: "aula",
            titulo: getTituloAula(a),
            created_at: a.created_at ?? "",
            href: `/dashboard/aulas/${a.id}`,
            icon: "description",
            iconBg: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
            labelCategoria: "Aula",
          });
        });
        (planosRes.data ?? []).forEach((p: { id: number; planos_de_aulas?: unknown; created_at?: string }) => {
          list.push({
            id: p.id,
            tipo: "plano",
            titulo: getTituloPlano(p),
            created_at: p.created_at ?? "",
            href: `/dashboard/planejamento/${p.id}`,
            icon: "edit_calendar",
            iconBg: "bg-primary/20 text-primary-dark dark:text-primary",
            labelCategoria: "Plano de Aula",
          });
        });
        (quizzesRes.data ?? []).forEach((q: { id: number; quizzes?: unknown; created_at?: string }) => {
          list.push({
            id: q.id,
            tipo: "quiz",
            titulo: getTituloQuiz(q),
            created_at: q.created_at ?? "",
            href: `/dashboard/quizzes/${q.id}`,
            icon: "task_alt",
            iconBg: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
            labelCategoria: "Quiz",
          });
        });
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setItems(list);
      } catch {
        setItems([]);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtrados = filtro === "todos" ? items : items.filter((i) => i.tipo === filtro);

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        Histórico
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Aulas, planos de aula e quizzes. Filtre por categoria.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFiltro(f.value)}
            className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filtro === f.value
                ? "bg-primary text-slate-900"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-6 divide-y divide-slate-100 rounded-md border border-slate-100 bg-white shadow-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-neutral-surface-dark">
        {loading ? (
          <p className="p-6 text-sm text-slate-500 dark:text-slate-400">Carregando…</p>
        ) : filtrados.length === 0 ? (
          <p className="p-6 text-sm text-slate-500 dark:text-slate-400">
            {filtro === "todos" ? "Nenhum item no histórico." : `Nenhum ${FILTROS.find((f) => f.value === filtro)?.label?.toLowerCase()}.`}
          </p>
        ) : (
          filtrados.map((item) => (
            <Link
              key={`${item.tipo}-${item.id}`}
              href={item.href}
              className="group flex cursor-pointer items-center gap-4 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${item.iconBg}`}>
                <span className="material-icons-round">{item.icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="text-sm font-bold text-slate-900 transition-colors group-hover:text-primary dark:text-white">
                  {item.titulo}
                </h5>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatData(item.created_at)}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {item.labelCategoria}
              </span>
              <span className="material-icons-round text-slate-300 transition-colors group-hover:text-primary">
                chevron_right
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
