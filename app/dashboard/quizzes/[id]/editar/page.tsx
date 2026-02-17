"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Quiz = {
  id: number | string;
  quizzes?: any;
  [key: string]: any;
};

type PerguntaEdicao = {
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

function letraDoIndice(i: number): string {
  return String.fromCharCode(65 + i);
}

const PERGUNTA_VAZIA: PerguntaEdicao = {
  questao: "",
  respostas: ["", ""],
  resposta_certa: "A",
};

export default function EditarQuizPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;
  const contentRef = useRef<HTMLDivElement>(null);
  const lastSelectionRef = useRef<Range | null>(null);
  const initialHtmlAppliedRef = useRef(false);

  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [perguntas, setPerguntas] = useState<PerguntaEdicao[]>([]);
  const [usarModoPerguntas, setUsarModoPerguntas] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [initialHtml, setInitialHtml] = useState<string>("");
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    if (loading || initialHtml === "" || initialHtmlAppliedRef.current || !contentRef.current) return;
    const html =
      typeof initialHtml === "string" && initialHtml.startsWith('"') && initialHtml.endsWith('"')
        ? (() => {
            try {
              return JSON.parse(initialHtml) as string;
            } catch {
              return initialHtml;
            }
          })()
        : initialHtml;
    contentRef.current.innerHTML = html;
    initialHtmlAppliedRef.current = true;
    setInitialHtml("");
  }, [loading, initialHtml]);

  const loadQuiz = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/dashboard/quizzes/${encodeURIComponent(id)}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ?? "Quiz não encontrado.");
        return;
      }
      const data = (await res.json()) as Quiz;
      const json = parseQuizField(data);
      setTitulo((json.titulo ?? json.title ?? "") as string);

      const perguntasBruto = json.perguntas;
      if (Array.isArray(perguntasBruto) && perguntasBruto.length > 0) {
        setPerguntas(
          perguntasBruto.map((p: any) => ({
            questao: String(p.questao ?? ""),
            respostas: Array.isArray(p.respostas)
              ? p.respostas.map((r: any) => String(r ?? ""))
              : ["", ""],
            resposta_certa: String(p.resposta_certa ?? "A").toUpperCase().trim().slice(0, 1) || "A",
          }))
        );
        setUsarModoPerguntas(true);
      } else {
        let c = (json.conteudo ?? json.content ?? json.html ?? json.body ?? "") as string;
        if (typeof c !== "string") c = String(c ?? "");
        setConteudo(c);
        setInitialHtml(c);
        initialHtmlAppliedRef.current = false;
      }
      setHasData(true);
    } catch {
      setError("Erro ao carregar o quiz.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  const saveSelection = useCallback(() => {
    const sel = document.getSelection();
    const el = contentRef.current;
    if (!el || !sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (el.contains(range.commonAncestorContainer)) {
      lastSelectionRef.current = range.cloneRange();
    }
  }, []);

  const restoreSelection = useCallback(() => {
    const el = contentRef.current;
    const range = lastSelectionRef.current;
    if (!el || !range) return;
    try {
      const sel = document.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } catch {
      lastSelectionRef.current = null;
    }
  }, []);

  const execCommand = useCallback(
    (cmd: string, value?: string) => {
      const el = contentRef.current;
      if (!el) return;
      el.focus();
      restoreSelection();
      document.execCommand(cmd, false, value ?? undefined);
      lastSelectionRef.current = null;
    },
    [restoreSelection]
  );

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      if (usarModoPerguntas) {
        const perguntasLimpas = perguntas
          .filter((p) => p.questao.trim())
          .map((p) => {
            const respostas = p.respostas.filter((r) => r.trim());
            const letras = respostas.map((_, i) => letraDoIndice(i));
            const respostaCerta = letras.includes(p.resposta_certa) ? p.resposta_certa : letras[0] ?? "A";
            return {
              questao: p.questao.trim(),
              respostas: respostas.length >= 2 ? respostas : [p.respostas[0] || "", p.respostas[1] || ""],
              resposta_certa: respostaCerta,
            };
          });
        if (perguntasLimpas.length === 0) {
          setError("Adicione ao menos uma pergunta com enunciado.");
          setSaving(false);
          return;
        }
        const res = await fetch(`/api/dashboard/quizzes/${encodeURIComponent(id)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ titulo: titulo.trim(), perguntas: perguntasLimpas }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError((data?.error as string) ?? "Erro ao salvar.");
          setSaving(false);
          return;
        }
      } else {
        const html = contentRef.current?.innerHTML ?? "";
        const res = await fetch(`/api/dashboard/quizzes/${encodeURIComponent(id)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ titulo: titulo.trim(), conteudo: html }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError((data?.error as string) ?? "Erro ao salvar.");
          setSaving(false);
          return;
        }
      }
      setError(null);
      router.push("/dashboard/quizzes");
    } catch {
      setError("Erro ao salvar o quiz.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = () => setShowDeleteModal(true);

  const handleConfirmDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/dashboard/quizzes/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data?.error as string) ?? "Erro ao deletar.");
        setShowDeleteModal(false);
        return;
      }
      router.push("/dashboard/quizzes");
    } catch {
      setError("Erro ao deletar o quiz.");
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const adicionarPergunta = () => {
    setPerguntas((prev) => [...prev, { ...PERGUNTA_VAZIA }]);
  };

  const removerPergunta = (index: number) => {
    setPerguntas((prev) => prev.filter((_, i) => i !== index));
  };

  const atualizarPergunta = (index: number, campo: keyof PerguntaEdicao, valor: string | string[]) => {
    setPerguntas((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [campo]: valor };
      return next;
    });
  };

  const adicionarResposta = (pIndex: number) => {
    setPerguntas((prev) => {
      const next = [...prev];
      next[pIndex] = { ...next[pIndex], respostas: [...next[pIndex].respostas, ""] };
      return next;
    });
  };

  const removerResposta = (pIndex: number, rIndex: number) => {
    setPerguntas((prev) => {
      const next = [...prev];
      const respostas = next[pIndex].respostas.filter((_, i) => i !== rIndex);
      if (respostas.length < 2) return prev;
      const letras = respostas.map((_, i) => letraDoIndice(i));
      const novaCerta = letras.includes(next[pIndex].resposta_certa)
        ? next[pIndex].resposta_certa
        : letras[0] ?? "A";
      next[pIndex] = { ...next[pIndex], respostas, resposta_certa: novaCerta };
      return next;
    });
  };

  if (loading) {
    return (
      <div className="p-6 md:p-10">
        <p className="text-slate-500 dark:text-slate-400">Carregando quiz…</p>
      </div>
    );
  }

  if (!loading && error && !hasData) {
    return (
      <div className="p-6 md:p-10">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
          <p className="font-medium text-red-800 dark:text-red-200">{error}</p>
          <Link
            href="/dashboard/quizzes"
            className="mt-4 inline-block text-sm font-medium text-red-700 hover:underline dark:text-red-300"
          >
            ← Voltar para Meus Quizzes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <Link
        href="/dashboard/quizzes"
        className="mb-6 inline-block text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        ← Voltar para Meus Quizzes
      </Link>

      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Editar quiz</h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="titulo" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Título
          </label>
          <input
            id="titulo"
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            placeholder="Título do quiz"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              const novoModo = !usarModoPerguntas;
              setUsarModoPerguntas(novoModo);
              if (novoModo && perguntas.length === 0) {
                setPerguntas([{ ...PERGUNTA_VAZIA }]);
              }
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {usarModoPerguntas ? "Usar editor de texto" : "Usar perguntas e respostas"}
          </button>
        </div>

        {usarModoPerguntas ? (
          <div className="space-y-6">
            {perguntas.length === 0 && (
              <p className="text-slate-500 dark:text-slate-400">Nenhuma pergunta. Adicione a primeira abaixo.</p>
            )}
            {perguntas.map((pergunta, pIndex) => (
              <div
                key={pIndex}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Pergunta {pIndex + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removerPergunta(pIndex)}
                    className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    aria-label="Remover pergunta"
                  >
                    <span className="material-icons-outlined">delete</span>
                  </button>
                </div>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Enunciado
                  </label>
                  <textarea
                    value={pergunta.questao}
                    onChange={(e) => atualizarPergunta(pIndex, "questao", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    rows={2}
                    placeholder="Ex: Qual é o maior planeta do Sistema Solar?"
                  />
                </div>
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Opções de resposta
                    </label>
                    <button
                      type="button"
                      onClick={() => adicionarResposta(pIndex)}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      + Opção
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {pergunta.respostas.map((opcao, rIndex) => (
                      <li key={rIndex} className="flex items-center gap-2">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700 dark:bg-slate-600 dark:text-slate-200">
                          {letraDoIndice(rIndex)}
                        </span>
                        <input
                          type="text"
                          value={opcao}
                          onChange={(e) => {
                            const nova = [...pergunta.respostas];
                            nova[rIndex] = e.target.value;
                            atualizarPergunta(pIndex, "respostas", nova);
                          }}
                          className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                          placeholder={`Opção ${letraDoIndice(rIndex)}`}
                        />
                        <button
                          type="button"
                          onClick={() => removerResposta(pIndex, rIndex)}
                          disabled={pergunta.respostas.length <= 2}
                          className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40 disabled:hover:bg-transparent dark:hover:bg-red-900/20 dark:hover:text-red-400"
                          aria-label="Remover opção"
                        >
                          <span className="material-icons-outlined text-lg">close</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Resposta correta
                  </label>
                  <select
                    value={pergunta.resposta_certa}
                    onChange={(e) => atualizarPergunta(pIndex, "resposta_certa", e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  >
                    {pergunta.respostas.map((_, rIndex) => (
                      <option key={rIndex} value={letraDoIndice(rIndex)}>
                        {letraDoIndice(rIndex)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={adicionarPergunta}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-6 text-slate-600 transition hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-slate-600 dark:text-slate-400 dark:hover:border-primary dark:hover:bg-primary/10 dark:hover:text-primary"
            >
              <span className="material-icons-outlined">add</span>
              Adicionar pergunta
            </button>
          </div>
        ) : (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Conteúdo</label>
            <div className="flex flex-wrap gap-1 rounded-t-lg border-b-0 border-slate-300 bg-slate-100 px-2 py-1.5 dark:border-slate-600 dark:bg-slate-800">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  execCommand("bold");
                }}
                className="rounded p-2 text-slate-700 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-700"
                title="Negrito"
              >
                <span className="material-icons-outlined text-lg">format_bold</span>
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  execCommand("italic");
                }}
                className="rounded p-2 text-slate-700 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-700"
                title="Itálico"
              >
                <span className="material-icons-outlined text-lg">format_italic</span>
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  execCommand("insertUnorderedList");
                }}
                className="rounded p-2 text-slate-700 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-700"
                title="Lista"
              >
                <span className="material-icons-outlined text-lg">format_list_bulleted</span>
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  execCommand("insertOrderedList");
                }}
                className="rounded p-2 text-slate-700 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-700"
                title="Lista numerada"
              >
                <span className="material-icons-outlined text-lg">format_list_numbered</span>
              </button>
            </div>
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              className="aula-content editor-list-style min-h-[240px] w-full rounded-b-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-600 dark:bg-slate-800 dark:text-white prose prose-slate dark:prose-invert max-w-none"
              onInput={() => setConteudo(contentRef.current?.innerHTML ?? "")}
              onMouseUp={saveSelection}
              onKeyUp={saveSelection}
              onBlur={saveSelection}
            />
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 font-bold text-slate-900 shadow-lg shadow-primary/25 transition hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60"
        >
          {saving ? "Salvando…" : "Salvar"}
        </button>
        <button
          type="button"
          onClick={handleDeleteClick}
          disabled={deleting}
          className="inline-flex items-center justify-center rounded-lg border-2 border-red-300 bg-white px-6 py-2.5 font-semibold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-60 dark:border-red-700 dark:bg-slate-800 dark:text-red-300 dark:hover:bg-red-900/20"
        >
          {deleting ? "Excluindo…" : "Deletar"}
        </button>
      </div>

      <ConfirmDeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir quiz?"
        message="Tem certeza que deseja excluir este quiz? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        loading={deleting}
      />
    </div>
  );
}
