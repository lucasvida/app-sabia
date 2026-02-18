"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PENDING_PROMPT_KEY = "sabia_pending_prompt";

export function DashboardChatCTA() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (prompt.trim()) {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(PENDING_PROMPT_KEY, prompt.trim());
      }
    }
    router.push("/chat");
  }

  return (
    <section className="mx-auto mb-12 max-w-5xl">
      <div className="group relative overflow-hidden rounded-md border border-slate-100 bg-white shadow-xl ring-1 ring-slate-900/5 transition-transform duration-300 hover:scale-[1.01] dark:border-slate-800 dark:bg-neutral-surface-dark dark:ring-white/10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/20 opacity-50 blur-3xl dark:opacity-20" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-yellow-200/40 opacity-50 blur-3xl dark:bg-yellow-500/10 dark:opacity-20" />
        <div className="relative flex flex-col items-center justify-between gap-8 p-8 md:flex-row md:p-10">
          <div className="flex-1 text-center md:text-left">
            <h3 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
              Inicie uma nova conversa
            </h3>
            <p className="mb-6 max-w-lg text-slate-600 dark:text-slate-400">
              Precisa de um plano de aula criativo, uma lista de exercícios ou
              apenas brainstorming? O Sabiá está pronto para voar com você.
            </p>
            <form onSubmit={handleSubmit} className="relative w-full max-w-2xl transition-shadow duration-300 group-hover:shadow-lg">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <div className="relative w-6 h-6">
                  <Image
                    src="/favicon.png"
                    alt="Ícone do Sabiá"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
              <input
                type="text"
                placeholder="Digite aqui... ex: 'Crie um quiz sobre a Amazônia para o 5º ano'"
                className="block w-full rounded-md border-2 border-slate-100 bg-slate-50 py-4 pl-12 pr-36 font-medium text-slate-900 shadow-sm placeholder-slate-400 transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button
                type="submit"
                className="absolute inset-y-2 right-2 flex items-center gap-2 rounded-md bg-primary px-6 font-bold text-background-dark transition-colors hover:bg-primary-dark cursor-pointer"
              >
                <span>Enviar</span>
                <span className="material-icons-outlined text-lg" aria-hidden="true">arrow_upward</span>
              </button>
            </form>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Ou abra o{" "}
              <Link
                href="/chat"
                className="font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded cursor-pointer"
              >
                chat
              </Link>{" "}
              sem digitar nada.
            </p>
          </div>
          <div className="relative hidden md:flex h-44 w-44 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 ring-4 ring-slate-100 dark:ring-slate-800" aria-hidden="true">
            <span
              className="material-icons-outlined text-slate-400 dark:text-slate-500 inline-block origin-center"
              style={{ fontSize: "5em", transform: "scale(1.5)" }}
              aria-hidden="true"
            >
              school
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
