"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/components/theme/ThemeProvider";

const pathLabels: Record<string, string> = {
  "/dashboard": "Visão Geral",
  "/dashboard/aulas": "Minhas Aulas",
  "/dashboard/planejamento": "Meus Planejamentos",
  "/dashboard/quizzes": "Meus Quizzes",
  "/dashboard/configuracoes": "Configurações",
  "/dashboard/historico": "Histórico",
};

export function DashboardTopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLabel = pathLabels[pathname ?? ""] ?? "Dashboard";
  const { setTheme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || "light";
  const toggleTheme = () => setTheme(currentTheme === "dark" ? "light" : "dark");

  async function handleLogout() {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-4 md:px-10">
      <div className="hidden items-center text-sm text-slate-500 dark:text-slate-400 md:flex">
        <Link href="/dashboard" className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
          Início
        </Link>
        <span className="material-icons-round mx-2 text-xs">chevron_right</span>
        <span className="font-medium text-slate-900 dark:text-white">
          {currentLabel}
        </span>
      </div>
      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <Link
          href="/chat"
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-slate-900 shadow-sm transition-colors hover:bg-primary-dark cursor-pointer"
          aria-label="Abrir chat"
        >
          <span className="material-icons-round text-lg">chat_bubble_outline</span>
          <span className="hidden sm:inline">Chat</span>
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            currentTheme === "dark" 
              ? "text-white hover:bg-slate-800" 
              : "text-slate-500 hover:bg-slate-100"
          }`}
          aria-label={currentTheme === "dark" ? "Modo claro" : "Modo escuro"}
        >
          <span className="material-icons-outlined">
            {currentTheme === "dark" ? "light_mode" : "dark_mode"}
          </span>
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-neutral-surface-dark px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          aria-label="Sair"
        >
          <span className="material-icons-round text-lg">logout</span>
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  );
}
