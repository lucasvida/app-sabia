"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ILLUSTRATION_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBJqoPHQxqZOd0sttnlnOOxx-WU1ZyU-y_AoRsftvYXrcgTINE8KRy0k4pNdMZPWeyYOs1zZncKta_WFdlwIfISeUZVuC6zBTp96blRRG-6uozQaAZ3YchEZywbHNkuBLQXQF-eU8nCx0aqLVHlmmkPbSZCmGceRAh7xUzm_leH43elh_WKCNHgQqYE7A25KpGgbiK9eoloNZJdZC_0HHmn99oXxiyfjfAiOKtTEYHySJGC7Co9xBapEUs0ZMGfsUqvLeLvtSz5E80";

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
      <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl ring-1 ring-slate-900/5 transition-transform duration-300 hover:scale-[1.01] dark:border-slate-800 dark:bg-neutral-surface-dark dark:ring-white/10">
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
            <form onSubmit={handleSubmit} className="relative w-full max-w-xl transition-shadow duration-300 group-hover:shadow-lg">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <span className="material-icons-round text-2xl text-primary">
                  flutter_dash
                </span>
              </div>
              <input
                type="text"
                placeholder="Digite aqui... ex: 'Crie um quiz sobre a Amazônia para o 5º ano'"
                className="block w-full rounded-xl border-2 border-slate-100 bg-slate-50 py-4 pl-12 pr-32 font-medium text-slate-900 shadow-sm placeholder-slate-400 transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button
                type="submit"
                className="absolute inset-y-2 right-2 flex items-center gap-2 rounded-lg bg-primary px-6 font-bold text-background-dark transition-colors hover:bg-primary-dark"
              >
                <span>Enviar</span>
                <span className="material-icons-round text-sm">send</span>
              </button>
            </form>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Ou{" "}
              <Link href="/chat" className="font-medium text-primary hover:underline">
                abra o chat
              </Link>{" "}
              sem digitar nada.
            </p>
          </div>
          <div className="relative hidden h-48 w-48 shrink-0 md:block">
            <div className="absolute inset-0 rounded-full bg-linear-to-br from-primary/30 to-yellow-200/30 blur-2xl" />
            <Image
              src={ILLUSTRATION_URL}
              alt="Ilustração Sabiá"
              className="relative z-10 h-full w-full rounded-2xl object-contain opacity-90 drop-shadow-2xl mix-blend-hard-light"
              width={192}
              height={192}
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  );
}
