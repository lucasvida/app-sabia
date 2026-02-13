"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Aula = {
  id: number | string;
  aula?: any;
  nome_professor?: string;
  created_at?: string;
  data_aula?: string;
  [key: string]: any;
};

function getTitulo(aula: Aula): string {
  const raw = aula.aula;
  if (raw == null) return "Aula sem título";
  let json: Record<string, any>;
  if (typeof raw === "string") {
    try {
      json = JSON.parse(raw);
    } catch {
      return "Aula sem título";
    }
  } else {
    json = raw;
  }
  return json.titulo ?? json.title ?? "Aula sem título";
}

function formatDate(s: string | undefined): string {
  if (!s) return "";
  try {
    return new Date(s).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function AulasListPage() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/aulas");
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data?.error ?? "Erro ao carregar aulas.");
          return;
        }
        const data = (await res.json()) as Aula[];
        setAulas(data);
      } catch {
        setError("Erro ao carregar aulas.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 min-h-screen">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        Aulas Recentes
      </h1>
      <p className="mt-2 mb-8 text-slate-600 dark:text-slate-400">
        Confira as últimas aulas publicadas pelos professores.
      </p>

      {loading && (
        <p className="text-slate-500 dark:text-slate-400">Carregando aulas…</p>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {!loading && !error && aulas.length === 0 && (
        <p className="text-slate-500 dark:text-slate-400">
          Nenhuma aula publicada ainda.
        </p>
      )}

      {!loading && !error && aulas.length > 0 && (
        <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white shadow-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
          {aulas.map((aula) => {
            const titulo = getTitulo(aula);
            const data = formatDate(aula.data_aula ?? aula.created_at);
            return (
              <li key={aula.id}>
                <Link
                  href={`/aulas/${aula.id}`}
                  className="flex flex-col gap-1 px-5 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {titulo}
                    </p>
                    {aula.nome_professor && (
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Prof. {aula.nome_professor}
                      </p>
                    )}
                  </div>
                  {data && (
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {data}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
