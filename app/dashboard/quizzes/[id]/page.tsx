"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Quiz = {
  id: number | string;
  quizzes?: any;
  [key: string]: any;
};

function parseQuizField(quiz: Quiz): Record<string, any> {
  const raw = quiz.quizzes;
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

function letraDoIndice(i: number): string {
  return String.fromCharCode(65 + i);
}

export default function VerQuizPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID do quiz não informado.");
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const res = await fetch(`/api/dashboard/quizzes/${encodeURIComponent(id!)}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data?.error ?? "Quiz não encontrado.");
          setQuiz(null);
          return;
        }
        const data = (await res.json()) as Quiz;
        setQuiz(data);
        setError(null);
      } catch {
        setError("Erro ao carregar o quiz.");
        setQuiz(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 md:p-10">
        <p className="text-slate-500 dark:text-slate-400">Carregando quiz…</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="p-6 md:p-10">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
          <p className="font-medium text-red-800 dark:text-red-200">
            {error ?? "Quiz não encontrado."}
          </p>
          <Link
            href="/dashboard/quizzes"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline cursor-pointer"
          >
            ← Voltar para Meus Quizzes
          </Link>
        </div>
      </div>
    );
  }

  const json = parseQuizField(quiz);
  const titulo = (json.titulo ?? json.title ?? "") as string;
  const perguntas = Array.isArray(json.perguntas) ? json.perguntas : [];
  const conteudo = (json.conteudo ?? json.content ?? json.html ?? json.body ?? "") as string;
  const { titulo: _t, title: _t2, perguntas: _p, conteudo: _c, content: _c2, html: _h, body: _b, ...resto } = json;

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <Link
        href="/dashboard/quizzes"
        className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 inline-block cursor-pointer"
      >
        ← Voltar para Meus Quizzes
      </Link>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {titulo || "Quiz"}
        </h1>
        <Link
          href={`/dashboard/quizzes/${quiz.id}/editar`}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <span className="material-icons-outlined text-lg">edit</span>
          Editar
        </Link>
      </div>

      {perguntas.length > 0 ? (
        <div className="space-y-6">
          {perguntas.map((p: any, idx: number) => (
            <div
              key={idx}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <p className="mb-3 font-semibold text-slate-900 dark:text-white">
                {idx + 1}. {String(p.questao ?? "")}
              </p>
              <ul className="list-none space-y-1">
                {(Array.isArray(p.respostas) ? p.respostas : []).map((r: string, i: number) => {
                  const letra = letraDoIndice(i);
                  const isCerta = String(p.resposta_certa ?? "A").toUpperCase() === letra;
                  return (
                    <li
                      key={i}
                      className={`flex items-center gap-2 rounded px-2 py-1 ${isCerta ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200" : "text-slate-600 dark:text-slate-300"}`}
                    >
                      <span className="font-medium">{letra}.</span> {String(r ?? "")}
                      {isCerta && (
                        <span className="ml-2 text-xs font-medium text-green-600 dark:text-green-400">(correta)</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      ) : typeof conteudo === "string" && conteudo.trim() ? (
        <article
          className="rounded-lg border border-slate-200 bg-white p-6 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
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
