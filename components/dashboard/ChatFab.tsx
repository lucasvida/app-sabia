"use client";

import Link from "next/link";

/**
 * Ícone flutuante no canto inferior direito que leva à página do chat.
 * Exibido dentro do layout do dashboard.
 */
export function ChatFab() {
  return (
    <Link
      href="/chat"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-slate-900 shadow-lg shadow-primary/30 transition-all hover:scale-110 hover:shadow-xl hover:shadow-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/40"
      aria-label="Abrir chat com o Sabiá"
      title="Abrir chat"
    >
      <span className="material-icons-round text-2xl">chat_bubble</span>
    </Link>
  );
}
