"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

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

export default function PlanoPublicoPage() {
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
        const res = await fetch(`/api/planejamento/${encodeURIComponent(id!)}`);
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
      <div className="mx-auto max-w-4xl px-4 py-12">
        <p className="text-slate-500 dark:text-slate-400">Carregando plano…</p>
      </div>
    );
  }

  if (error || !plano) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
          <p className="font-medium text-red-800 dark:text-red-200">
            {error ?? "Plano não encontrado."}
          </p>
        </div>
      </div>
    );
  }

  const json = parsePlanoField(plano);
  const titulo = json.titulo ?? json.title ?? "";
  const { titulo: _t, title: _t2, ...resto } = json;
  const conteudo = json.conteudo ?? json.content ?? json.html ?? json.body ?? "";
  const nomeProfessor = (plano as { nome_professor?: string }).nome_professor ?? "";

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      {titulo && (
        <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
          {titulo}
        </h1>
      )}

      <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">
        Criado por <span className="font-semibold text-slate-700 dark:text-slate-300">Sabiá</span>
        {nomeProfessor && (
          <>, revisado por <span className="font-semibold text-slate-700 dark:text-slate-300">Prof. {nomeProfessor}</span></>
        )}
      </p>

      {typeof conteudo === "string" && conteudo.trim() ? (
        <div
          className="aula-content text-slate-700 dark:text-slate-300"
          dangerouslySetInnerHTML={{ __html: conteudo }}
        />
      ) : Object.keys(resto).length > 0 ? (
        <pre className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-6 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          {JSON.stringify(resto, null, 2)}
        </pre>
      ) : null}
    </article>
  );
}
