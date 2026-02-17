"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Quiz = {
  id: number | string;
  quizzes?: any;
  [key: string]: any;
};

type PerguntaQuiz = {
  questao: string;
  respostas: string[];
  resposta_certa: string;
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

function isQuizEstruturado(json: Record<string, any>): json is { perguntas: PerguntaQuiz[] } {
  return Array.isArray(json.perguntas) && json.perguntas.length > 0;
}

function letraDoIndice(i: number): string {
  return String.fromCharCode(65 + i);
}

const MENSAGENS_INCENTIVO = [
  "Cada tentativa te deixa mais forte! Continue estudando.",
  "Você está no caminho! O importante é não desistir.",
  "Boa dedicação! Revisar o conteúdo ajuda a fixar.",
  "Muito bem! Continue assim e você vai longe.",
  "Excelente! Você está mandando bem.",
  "Incrível! Você domina o conteúdo.",
];

function mensagemPorAcertos(acertos: number, total: number): string {
  if (total === 0) return MENSAGENS_INCENTIVO[0];
  const pct = acertos / total;
  if (pct >= 1) return MENSAGENS_INCENTIVO[5];
  if (pct >= 0.8) return MENSAGENS_INCENTIVO[4];
  if (pct >= 0.6) return MENSAGENS_INCENTIVO[3];
  if (pct >= 0.4) return MENSAGENS_INCENTIVO[2];
  if (pct >= 0.2) return MENSAGENS_INCENTIVO[1];
  return MENSAGENS_INCENTIVO[0];
}

export default function QuizPublicoPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [respostasSelecionadas, setRespostasSelecionadas] = useState<Record<number, number>>({});
  const [mostrarResultado, setMostrarResultado] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("ID do quiz não informado.");
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const res = await fetch(`/api/quizzes/${encodeURIComponent(id!)}`);
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
      <div className="mx-auto max-w-4xl px-4 py-12">
        <p className="text-slate-500 dark:text-slate-400">Carregando quiz…</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
          <p className="font-medium text-red-800 dark:text-red-200">
            {error ?? "Quiz não encontrado."}
          </p>
        </div>
      </div>
    );
  }

  const json = parseQuizField(quiz);
  const titulo = json.titulo ?? json.title ?? "";
  const { titulo: _t, title: _t2, perguntas: _p, ...resto } = json;
  const conteudo = json.conteudo ?? json.content ?? json.html ?? json.body ?? "";
  const nomeProfessor = (quiz as { nome_professor?: string }).nome_professor ?? "";
  const dataExibicao = formatDate((quiz as { data_quiz?: string }).data_quiz ?? (quiz.created_at as string));

  const perguntas = isQuizEstruturado(json) ? json.perguntas : null;

  const handleSelecionar = (perguntaIndex: number, respostaIndex: number) => {
    if (mostrarResultado) return;
    setRespostasSelecionadas((prev) => ({ ...prev, [perguntaIndex]: respostaIndex }));
  };

  const handleEnviar = () => {
    setMostrarResultado(true);
  };

  const handleRefazer = () => {
    setRespostasSelecionadas({});
    setMostrarResultado(false);
  };

  const totalPerguntas = perguntas?.length ?? 0;
  const acertos = perguntas
    ? perguntas.reduce((acc, p, i) => {
        const sel = respostasSelecionadas[i];
        if (sel === undefined) return acc;
        const letraSelecionada = letraDoIndice(sel);
        return acc + (letraSelecionada.toUpperCase() === String(p.resposta_certa).toUpperCase() ? 1 : 0);
      }, 0)
    : 0;

  if (perguntas && perguntas.length > 0) {
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
          {dataExibicao && (
            <> · <span>{dataExibicao}</span></>
          )}
        </p>

        {!mostrarResultado ? (
          <>
            <div className="space-y-8">
              {perguntas.map((pergunta, pIndex) => (
                <div
                  key={pIndex}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                    {pIndex + 1}. {pergunta.questao}
                  </h3>
                  <ul className="space-y-2">
                    {pergunta.respostas.map((opcao, rIndex) => {
                      const letra = letraDoIndice(rIndex);
                      const selecionado = respostasSelecionadas[pIndex] === rIndex;
                      return (
                        <li key={rIndex}>
                          <button
                            type="button"
                            onClick={() => handleSelecionar(pIndex, rIndex)}
                            className={`flex w-full items-center gap-3 rounded-lg border-2 px-4 py-3 text-left transition-colors cursor-pointer ${
                              selecionado
                                ? "border-primary bg-primary/10 text-slate-900 dark:text-white"
                                : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600 dark:hover:bg-slate-700"
                            }`}
                          >
                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                selecionado ? "bg-primary text-slate-900" : "bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-200"
                              }`}
                            >
                              {letra}
                            </span>
                            <span className="text-slate-800 dark:text-slate-200">{opcao}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleEnviar}
                disabled={Object.keys(respostasSelecionadas).length < totalPerguntas}
                className="rounded-lg bg-primary px-8 py-3 font-bold text-slate-900 shadow-lg shadow-primary/25 transition hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Enviar respostas
              </button>
              {Object.keys(respostasSelecionadas).length < totalPerguntas && (
                <p className="self-center text-sm text-slate-500 dark:text-slate-400">
                  Responda todas as {totalPerguntas} perguntas para enviar.
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="space-y-8">
              {perguntas.map((pergunta, pIndex) => {
                const sel = respostasSelecionadas[pIndex];
                const respostaCertaLetra = String(pergunta.resposta_certa).toUpperCase().trim();
                const acertou = sel !== undefined && letraDoIndice(sel) === respostaCertaLetra;

                return (
                  <div
                    key={pIndex}
                    className={`rounded-xl border-2 p-6 ${
                      acertou
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-red-300 bg-red-50/50 dark:border-red-700 dark:bg-red-900/20"
                    }`}
                  >
                    <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                      {pIndex + 1}. {pergunta.questao}
                    </h3>
                    <ul className="space-y-2">
                      {pergunta.respostas.map((opcao, rIndex) => {
                        const letra = letraDoIndice(rIndex);
                        const selecionado = sel === rIndex;
                        const eCerta = letra === respostaCertaLetra;
                        const mostraComoCerta = eCerta;
                        const mostraComoErrada = selecionado && !acertou;

                        return (
                          <li key={rIndex}>
                            <div
                              className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 ${
                                mostraComoCerta
                                  ? "border-green-600 bg-green-100 dark:bg-green-900/40"
                                  : mostraComoErrada
                                    ? "border-red-500 bg-red-100 dark:bg-red-900/40"
                                    : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                              }`}
                            >
                              <span
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                  mostraComoCerta
                                    ? "bg-green-600 text-white"
                                    : mostraComoErrada
                                      ? "bg-red-500 text-white"
                                      : "bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-200"
                                }`}
                              >
                                {letra}
                              </span>
                              <span className="flex-1 text-slate-800 dark:text-slate-200">{opcao}</span>
                              {mostraComoCerta && (
                                <span className="material-icons-outlined text-green-600 dark:text-green-400">check_circle</span>
                              )}
                              {mostraComoErrada && (
                                <span className="material-icons-outlined text-red-600 dark:text-red-400">cancel</span>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    {!acertou && (
                      <p className="mt-3 text-sm font-medium text-green-700 dark:text-green-300">
                        Resposta correta: {respostaCertaLetra}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-10 rounded-xl border-2 border-primary/30 bg-primary/5 p-6 dark:bg-primary/10">
              <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                Você acertou {acertos} de {totalPerguntas} {totalPerguntas === 1 ? "pergunta" : "perguntas"}!
              </h2>
              <p className="mb-6 text-slate-700 dark:text-slate-300">
                {mensagemPorAcertos(acertos, totalPerguntas)}
              </p>
              <button
                type="button"
                onClick={handleRefazer}
                className="rounded-lg bg-primary px-6 py-2.5 font-bold text-slate-900 shadow-md transition hover:bg-primary-dark cursor-pointer"
              >
                Refazer quiz
              </button>
            </div>
          </>
        )}
      </article>
    );
  }

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
        {dataExibicao && (
          <> · <span>{dataExibicao}</span></>
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
