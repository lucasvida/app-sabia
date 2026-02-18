"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardChatCTA } from "@/components/dashboard/DashboardChatCTA";
import { createClient } from "@/lib/supabase/client";

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
function formatRecenteDate(s: string | undefined): string {
  if (!s) return "—";
  try {
    const d = new Date(s);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffHours < 1) return "Agora";
    if (diffHours < 24) return `Há ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `Há ${diffDays} dias`;
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return "—";
  }
}

const quickAccess = [
  {
    href: "/dashboard/aulas",
    title: "Minhas Aulas",
    description: "Gerencie suas aulas e planejamentos.",
    icon: "class",
    iconBg: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white",
    blob: "bg-blue-50 dark:bg-blue-900/10",
  },
  {
    href: "/dashboard/planejamento",
    title: "Meus Planos de Aula",
    description: "Crie planos de aula detalhados com IA.",
    icon: "edit_calendar",
    iconBg: "bg-primary/20 text-primary-dark dark:text-primary group-hover:bg-primary group-hover:text-background-dark",
    blob: "bg-primary/10",
  },
  {
    href: "/dashboard/quizzes",
    title: "Meus Quizzes",
    description: "Gere avaliações e exercícios rápidos.",
    icon: "quiz",
    iconBg: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 group-hover:bg-yellow-400 group-hover:text-yellow-900",
    blob: "bg-yellow-50 dark:bg-yellow-900/10",
  },
  {
    href: null,
    title: "Histórico",
    description: "Acesse conversas e materiais anteriores.",
    icon: "history",
    iconBg: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white",
    blob: "bg-purple-50 dark:bg-purple-900/10",
    comingSoon: true,
  },
];

type RecentItem = {
  id: string | number;
  title: string;
  subtitle: string;
  icon: string;
  iconBg: string;
  href: string;
};

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>("Professor(a)");
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();
      if (!supabase) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.user_metadata?.display_name ||
          user.email?.split("@")[0] ||
          "Professor(a)";
        setUserName(name);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchRecentes() {
      const supabase = createClient();
      if (!supabase) {
        setRecentLoading(false);
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) {
        setRecentItems([]);
        setRecentLoading(false);
        return;
      }
      const items: RecentItem[] = [];
      try {
        const [aulasRes, planosRes, quizzesRes] = await Promise.all([
          supabase.from("aulas").select("id, aula, created_at").eq("id_professor", user.id).order("created_at", { ascending: false }).limit(1),
          supabase.from("planos_de_aulas").select("id, planos_de_aulas, created_at").eq("id_professor", user.id).order("created_at", { ascending: false }).limit(1),
          supabase.from("quizzes").select("id, quizzes, created_at").eq("id_professor", user.id).order("created_at", { ascending: false }).limit(1),
        ]);
        const lastAula = aulasRes.data?.[0] as { id: number; aula?: unknown; created_at?: string } | undefined;
        const lastPlano = planosRes.data?.[0] as { id: number; planos_de_aulas?: unknown; created_at?: string } | undefined;
        const lastQuiz = quizzesRes.data?.[0] as { id: number; quizzes?: unknown; created_at?: string } | undefined;
        if (lastAula) {
          items.push({
            id: lastAula.id,
            title: getTituloAula(lastAula),
            subtitle: formatRecenteDate(lastAula.created_at),
            icon: "description",
            iconBg: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
            href: `/dashboard/aulas/${lastAula.id}`,
          });
        }
        if (lastPlano) {
          items.push({
            id: `plano-${lastPlano.id}`,
            title: getTituloPlano(lastPlano),
            subtitle: formatRecenteDate(lastPlano.created_at),
            icon: "edit_calendar",
            iconBg: "bg-primary/20 text-primary-dark dark:text-primary group-hover:bg-primary group-hover:text-background-dark",
            href: `/dashboard/planejamento/${lastPlano.id}`,
          });
        }
        if (lastQuiz) {
          items.push({
            id: `quiz-${lastQuiz.id}`,
            title: getTituloQuiz(lastQuiz),
            subtitle: formatRecenteDate(lastQuiz.created_at),
            icon: "task_alt",
            iconBg: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
            href: `/dashboard/quizzes/${lastQuiz.id}`,
          });
        }
        setRecentItems(items);
      } catch {
        setRecentItems([]);
      }
      setRecentLoading(false);
    }
    fetchRecentes();
  }, []);

  return (
    <>
        {/* Welcome */}
        <section className="mx-auto max-w-5xl mb-6 md:mb-10">
          <div className="mb-2 flex flex-col items-start justify-between gap-2 md:flex-row md:items-end md:gap-4">
            <div>
              <h2 className="mb-1 text-2xl font-bold text-slate-900 dark:text-white md:mb-2 md:text-3xl lg:text-4xl">
                Olá, {userName}!{" "}
                <span className="inline-block animate-pulse">👋</span>
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-400 md:text-lg">
                <Link
                  href="/chat"
                  className="font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded cursor-pointer"
                >
                  Como posso ajudar a transformar sua aula hoje?
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* CTA: Nova conversa */}
        <DashboardChatCTA />

        {/* Acesso Rápido */}
        <section className="mx-auto max-w-5xl mt-6 md:mt-8">
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white md:mb-6 md:text-lg">
            <span className="material-icons-round text-primary">grid_view</span>
            Acesso Rápido
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {quickAccess.map((item) => {
              const isComingSoon = "comingSoon" in item && item.comingSoon;
              const cardContent = (
                <>
                  {"comingSoon" in item && item.comingSoon && (
                    <span className="absolute right-3 top-3 rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-600 dark:text-slate-300">
                      Em Breve
                    </span>
                  )}
                  <div
                    className={`absolute -right-4 -top-4 h-24 w-24 rounded-bl-full transition-transform ${!isComingSoon ? "group-hover:scale-110" : ""} ${item.blob}`}
                  />
                  <div className="relative z-10">
                    <div
                      className={`mb-4 flex h-12 w-12 items-center justify-center rounded-md transition-colors duration-300 ${item.iconBg}`}
                    >
                      <span className="material-icons-round text-2xl">
                        {item.icon}
                      </span>
                    </div>
                    <h4 className="mb-1 text-lg font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </>
              );
              if (isComingSoon || item.href == null) {
                return (
                  <div
                    key={item.title}
                    className="group relative overflow-hidden rounded-md border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-neutral-surface-dark opacity-90"
                  >
                    {cardContent}
                  </div>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative overflow-hidden rounded-md border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-neutral-surface-dark cursor-pointer"
                >
                  {cardContent}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Recentes */}
        <section className="mx-auto mt-8 max-w-5xl md:mt-12">
          <div className="mb-4 flex items-center justify-between md:mb-6">
            <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white md:text-lg">
              <span className="material-icons-round text-slate-400">schedule</span>
              Recentes
            </h3>
            <Link
              href="/dashboard/historico"
              className="text-sm font-medium text-primary hover:underline cursor-pointer"
            >
              Ver tudo
            </Link>
          </div>
          <div className="divide-y divide-slate-100 rounded-md border border-slate-100 bg-white shadow-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-neutral-surface-dark">
            {recentLoading ? (
              <p className="p-4 text-sm text-slate-500 dark:text-slate-400">Carregando…</p>
            ) : recentItems.length === 0 ? (
              <p className="p-4 text-sm text-slate-500 dark:text-slate-400">Nenhum item recente. Crie uma aula, plano de aula ou quiz.</p>
            ) : (
              recentItems.map((item) => (
                <Link
                  key={String(item.id)}
                  href={item.href}
                  className="group flex cursor-pointer items-center gap-4 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${item.iconBg}`}
                  >
                    <span className="material-icons-round">{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-bold text-slate-900 transition-colors group-hover:text-primary dark:text-white">
                      {item.title}
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.subtitle}
                    </p>
                  </div>
                  <span className="material-icons-round text-slate-300 transition-colors group-hover:text-primary">
                    chevron_right
                  </span>
                </Link>
              ))
            )}
          </div>
        </section>
    </>
  );
}
