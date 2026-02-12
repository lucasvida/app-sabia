"use client";

import Link from "next/link";
import Image from "next/image";

const PROFILE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC0R_uibMsdhqmLXvOuY0z0yFArPkkxTeHINldFNJj5gTu8RJX_8hOOr72h-5tUzWtaQiEdcJ-0gb4ED5RShvqwkPd-NcvN6LELtvQg7zteGLBJJkNzyzX3l_cZAVeuUfXByJvypOpG-_pkBDpNcaEUMNvIOynKYpsjEdyFT8sgJfVy2-bmf43bPeNFd5_qOCHOPX65hwsg3cFz0QkB69nVOnLmWU8qHYo1kiso1cw7E2F4pqsyX7-jwSkifiOF9TF_NvTXwCROpgs";

const historyHoje = [
  { id: "1", title: "Plano de aula: Geografia 5º ano", icon: "chat_bubble_outline", active: true },
  { id: "2", title: "Correção de redações", icon: "edit_note", active: false },
];

const historyOntem = [
  { id: "3", title: "Ideias para feira de ciências", icon: "science", active: false },
  { id: "4", title: "Dinâmica de grupo matemática", icon: "school", active: false },
];

const historySemana = [
  { id: "5", title: "História do Brasil Colonial", icon: "history_edu", active: false },
];

export function ChatSidebar() {
  return (
    <aside className="relative z-20 flex w-80 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <div className="border-b border-gray-100 p-5 dark:border-white/5">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-linear-to-tr from-primary to-yellow-300 text-xl font-bold text-black shadow-lg shadow-primary/20">
            S
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Sabiá AI
          </h1>
        </div>
        <Link
          href="/chat"
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 px-4 font-semibold text-black shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark active:scale-95 cursor-pointer"
        >
          <span className="material-icons-outlined">add</span>
          Nova Conversa
        </Link>
      </div>

      {/* Histórico */}
      <div className="flex-1 space-y-6 overflow-y-auto p-3">
        <div>
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Hoje
          </h3>
          <ul className="space-y-1">
            {historyHoje.map((item) => (
              <li key={item.id}>
                <Link
                  href="#"
                  className={`flex items-center gap-3 rounded-md border-l-4 px-3 py-3 text-sm transition-colors cursor-pointer ${
                    item.active
                      ? "border-primary bg-gray-100 text-gray-900 dark:bg-white/5 dark:text-white"
                      : "border-transparent text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
                  }`}
                >
                  <span className="material-icons-outlined text-lg text-gray-500 dark:text-gray-400">
                    {item.icon}
                  </span>
                  <span className="truncate font-medium">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Ontem
          </h3>
          <ul className="space-y-1">
            {historyOntem.map((item) => (
              <li key={item.id}>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-md border-l-4 border-transparent px-3 py-3 text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5 cursor-pointer"
                >
                  <span className="material-icons-outlined text-lg text-gray-400">
                    {item.icon}
                  </span>
                  <span className="truncate">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Semana Passada
          </h3>
          <ul className="space-y-1">
            {historySemana.map((item) => (
              <li key={item.id}>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-md border-l-4 border-transparent px-3 py-3 text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5 cursor-pointer"
                >
                  <span className="material-icons-outlined text-lg text-gray-400">
                    {item.icon}
                  </span>
                  <span className="truncate">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-3">
          <Image
            src={PROFILE_IMAGE}
            alt="Perfil"
            className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm dark:border-gray-700"
            width={40}
            height={40}
            unoptimized
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
              Profa. Mariana
            </p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              Plano Premium
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
        >
          <span className="material-icons-outlined text-lg">arrow_back</span>
          Voltar ao Dashboard
        </Link>
      </div>
    </aside>
  );
}
