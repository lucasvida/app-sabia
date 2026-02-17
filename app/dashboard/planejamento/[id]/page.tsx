"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

/* eslint-disable @typescript-eslint/no-explicit-any */
type PlanoDeAula = {
  id: number | string;
  planos_de_aulas?: any;
  [key: string]: any;
};

function parsePlanoField(plano: PlanoDeAula): Record<string, any> {
  const raw = plano.planos_de_aulas;
  if (raw == null) return {};
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) ?? {};
    } catch {
      return {};
    }
  }
  return (typeof raw === "object" ? raw : {}) as Record<string, any>;
}

export default function VerPlanoPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [plano, setPlano] = useState<PlanoDeAula | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID do plano não informado.");
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const res = await fetch(`/api/dashboard/planejamento/${encodeURIComponent(id!)}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data?.error ?? "Plano não encontrado.");
          setPlano(null);
          return;
        }
        const data = (await res.json()) as PlanoDeAula;
        setPlano(data);
        setError(null);
      } catch {
        setError("Erro ao carregar o plano.");
        setPlano(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 md:p-10">
        <p className="text-slate-500 dark:text-slate-400">Carregando plano…</p>
      </div>
    );
  }

  if (error || !plano) {
    return (
      <div className="p-6 md:p-10">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
          <p className="font-medium text-red-800 dark:text-red-200">
            {error ?? "Plano não encontrado."}
          </p>
          <Link
            href="/dashboard/planejamento"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            ← Voltar para Planejamento de Aula
          </Link>
        </div>
      </div>
    );
  }

  const json = parsePlanoField(plano);
  const titulo = json.titulo ?? json.title ?? "";
  const { titulo: _t, title: _t2, ...resto } = json;
  const conteudo = json.conteudo ?? json.content ?? json.html ?? json.body ?? "";

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <Link
        href="/dashboard/planejamento"
        className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 inline-block"
      >
        ← Voltar para Planejamento de Aula
      </Link>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {titulo || "Plano de aula"}
        </h1>
        <Link
          href={`/dashboard/planejamento/${plano.id}/editar`}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <span className="material-icons-outlined text-lg">edit</span>
          Editar
        </Link>
      </div>

      {typeof conteudo === "string" && conteudo.trim() ? (
        <article
          className="aula-content rounded-lg border border-slate-200 bg-white p-6 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          dangerouslySetInnerHTML={{ __html: conteudo }}
        />
      ) : Object.keys(resto).length > 0 ? (
        <pre className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-6 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          {JSON.stringify(resto, null, 2)}
        </pre>
      ) : (
        <p className="text-slate-500 dark:text-slate-400">Nenhum conteúdo ainda.</p>
      )}
    </div>
  );
}
