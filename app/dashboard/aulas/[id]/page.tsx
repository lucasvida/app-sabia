"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Aula = {
  id: number | string;
  aula?: any;
  [key: string]: any;
};

function parseAulaField(aula: Aula): Record<string, any> {
  const raw = aula.aula;
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

export default function VerAulaPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [aula, setAula] = useState<Aula | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID da aula não informado.");
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const res = await fetch(`/api/dashboard/aulas/${encodeURIComponent(id!)}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data?.error ?? "Aula não encontrada.");
          setAula(null);
          return;
        }
        const data = (await res.json()) as Aula;
        setAula(data);
        setError(null);
      } catch {
        setError("Erro ao carregar a aula.");
        setAula(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 md:p-10">
        <p className="text-slate-500 dark:text-slate-400">Carregando aula…</p>
      </div>
    );
  }

  if (error || !aula) {
    return (
      <div className="p-6 md:p-10">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
          <p className="font-medium text-red-800 dark:text-red-200">
            {error ?? "Aula não encontrada."}
          </p>
          <Link
            href="/dashboard/aulas"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline cursor-pointer"
          >
            ← Voltar para Minhas Aulas
          </Link>
        </div>
      </div>
    );
  }

  const json = parseAulaField(aula);
  const titulo = (json.titulo ?? json.title ?? "") as string;
  const conteudo = (json.conteudo ?? json.content ?? json.html ?? json.body ?? "") as string;
  const { titulo: _t, title: _t2, conteudo: _c, content: _c2, html: _h, body: _b, ...resto } = json;

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <Link
        href="/dashboard/aulas"
        className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 inline-block cursor-pointer"
      >
        ← Voltar para Minhas Aulas
      </Link>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {titulo || "Aula"}
        </h1>
        <Link
          href={`/dashboard/aulas/${aula.id}/editar`}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
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
