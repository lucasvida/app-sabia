"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useChat } from "./ChatContext";
import { createClient } from "@/lib/supabase/client";

const QUICK_ACTIONS = [
  { label: "Salvar Aula", prompt: "Salvar Aula", icon: "class" },
  { label: "Salvar Plano de Aula", prompt: "Salvar Plano de Aula", icon: "edit_calendar" },
  { label: "Salvar Quiz", prompt: "Salvar Quiz", icon: "quiz" },
];

type ChatSidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export function ChatSidebar({ isOpen = true, onClose }: ChatSidebarProps) {
  const { clearConversation, sendMessage } = useChat();
  const [userName, setUserName] = useState<string>("Professor(a)");

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.user_metadata?.display_name ||
          user.email?.split("@")[0] ||
          "Professor(a)";
        setUserName(name);
      }
    }
    fetchUser();
  }, []);

  const handleNewConversation = () => {
    clearConversation();
  };

  const handleQuickAction = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-80 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 transition-transform duration-300 md:relative md:z-20 ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-50 rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden cursor-pointer"
          aria-label="Fechar menu"
        >
          <span className="material-icons-outlined">close</span>
        </button>
      )}
      {/* Header com logo (mesma da home) */}
      <div className="border-b border-gray-100 p-5 dark:border-white/5">
        <div className="mb-6 flex justify-center">
          <Link href="/" className="flex items-center cursor-pointer" aria-label="Sabiá - Página inicial">
            <Image
              src="/logo-sabia.png"
              alt="Logo do Sabiá"
              className="h-20 w-auto object-contain"
              width={220}
              height={80}
              unoptimized
            />
          </Link>
        </div>
        <button
          type="button"
          onClick={handleNewConversation}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 px-4 font-semibold text-black shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark active:scale-95 cursor-pointer"
        >
          <span className="material-icons-outlined">add</span>
          Nova Conversa
        </button>
      </div>

      {/* Ações rápidas */}
      <div className="flex-1 space-y-4 overflow-y-auto p-3">
        <div>
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Ações rápidas
          </h3>
          <ul className="space-y-1">
            {QUICK_ACTIONS.map((item) => (
              <li key={item.prompt}>
                <button
                  type="button"
                  onClick={() => handleQuickAction(item.prompt)}
                  className="flex w-full items-center gap-3 rounded-md border-l-4 border-transparent px-3 py-3 text-left text-sm text-gray-600 transition-colors hover:border-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5 cursor-pointer"
                >
                  <span className="material-icons-outlined text-lg text-gray-500 dark:text-gray-400">
                    {item.icon}
                  </span>
                  <span className="truncate font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Divisor e Atalhos */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4" />
        <div>
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Atalhos
          </h3>
          <ul className="space-y-1">
            <li>
              <Link
                href="/dashboard/aulas"
                className="flex items-center gap-3 rounded-md border-l-4 border-transparent px-3 py-3 text-sm text-gray-600 transition-colors hover:border-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5 cursor-pointer"
              >
                <span className="material-icons-outlined text-lg text-gray-500 dark:text-gray-400">class</span>
                <span className="truncate font-medium">Minhas Aulas</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/planejamento"
                className="flex items-center gap-3 rounded-md border-l-4 border-transparent px-3 py-3 text-sm text-gray-600 transition-colors hover:border-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5 cursor-pointer"
              >
                <span className="material-icons-outlined text-lg text-gray-500 dark:text-gray-400">edit_calendar</span>
                <span className="truncate font-medium">Meus Planos de Aula</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/quizzes"
                className="flex items-center gap-3 rounded-md border-l-4 border-transparent px-3 py-3 text-sm text-gray-600 transition-colors hover:border-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5 cursor-pointer"
              >
                <span className="material-icons-outlined text-lg text-gray-500 dark:text-gray-400">quiz</span>
                <span className="truncate font-medium">Meus Quizzes</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer com nome do professor */}
      <div className="border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
            <span className="material-icons-outlined text-slate-600 dark:text-slate-300">person</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
              {userName}
            </p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              Professor(a)
            </p>
          </div>
          <Link
            href="/dashboard/configuracoes"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
            aria-label="Configurações"
          >
            <span className="material-icons-outlined">settings</span>
          </Link>
        </div>
        <Link
          href="/dashboard"
          className="flex w-full items-center justify-center gap-2 rounded-md py-2 px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200/50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white cursor-pointer"
          aria-label="Voltar ao Dashboard"
        >
          <span className="material-icons-outlined text-lg" aria-hidden="true">arrow_back</span>
          Voltar ao Dashboard
        </Link>
      </div>
    </aside>
  );
}
