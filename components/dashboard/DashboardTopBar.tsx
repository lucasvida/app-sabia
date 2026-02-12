"use client";

import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const pathLabels: Record<string, string> = {
  "/dashboard": "Visão Geral",
  "/dashboard/turmas": "Minhas Turmas",
  "/dashboard/atividades": "Atividades",
  "/dashboard/conteudos": "Conteúdos",
  "/dashboard/configuracoes": "Configurações",
  "/dashboard/planejamento": "Planejamento",
  "/dashboard/quizzes": "Quizzes",
  "/dashboard/historico": "Histórico",
};

export function DashboardTopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLabel = pathLabels[pathname ?? ""] ?? "Dashboard";

  async function handleLogout() {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/50 dark:border-slate-800 bg-background-light dark:bg-background-dark px-6 py-4 md:px-10">
      <div className="hidden items-center text-sm text-slate-500 dark:text-slate-400 md:flex">
        <span>Início</span>
        <span className="material-icons-round mx-2 text-xs">chevron_right</span>
        <span className="font-medium text-slate-900 dark:text-white">
          {currentLabel}
        </span>
      </div>
      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-white hover:text-primary dark:hover:bg-neutral-surface-dark dark:hover:text-primary"
          aria-label="Notificações"
        >
          <span className="material-icons-round">notifications</span>
        </button>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-white hover:text-primary dark:hover:bg-neutral-surface-dark dark:hover:text-primary"
          aria-label="Ajuda"
        >
          <span className="material-icons-round">help_outline</span>
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-neutral-surface-dark px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
          aria-label="Sair"
        >
          <span className="material-icons-round text-lg">logout</span>
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  );
}
