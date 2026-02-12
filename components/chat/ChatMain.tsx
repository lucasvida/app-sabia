"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const PENDING_PROMPT_KEY = "sabia_pending_prompt";

const AI_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA6I5yYNPqFc18oY-B50JVJfR7bkQq9B1eq9CPO9fur89_tc75h9oAYN1-p16SvjWt29uaBf43O3Y_-SEirc3WSqadDdczDBeEPWVAJg0874pPwDfS1Ex4pA3GHumIe-a0k8OC_ikmMGyMtdHFiLtcPXJijgOQsxBzsrBSa43sBhhT0aI2FJpRaJWiqq62kxak0_gE88znz3aVWyJur3_T-GCt4nwPs3TuFY417-fjY5I9jbpfEAILfC1K67shEAYAhiFV1bOivdS0";

const USER_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD_SIsSxs-0XPQBguo2ZTPCT-hIOT788173C1npTJ5dpbJhf5nxB3D6qxE6HBI5jI2yRchpSXB0ft4hgnD009tdJ7Qdjs504Rt8uABaD7eBKHkk_wdTudXbwEIe_5XsQNkjIRXjo8pZzQn_1qE-SsVyuPhq8moYtuZjYfG7rQe3f_NytoqfW-rO_9eLRfAWGSO0_wjdw9ex8OGRbzzo-RVE_8CdpsnaZ4dLwZ1YT4nJhLEX40tLNBYKxYdCFtU0h6hN9hEzaqfygU4";

type Message = { role: "user" | "assistant"; content: string };

function getResponseText(data: { response?: string }): string {
  return typeof data?.response === "string" ? data.response : "Não foi possível obter resposta.";
}

export function ChatMain() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialLoadRef = useRef(false);

  const scrollToBottom = () => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errMsg = typeof data?.error === "string" ? data.error : "Erro ao conversar. Tente novamente.";
        setError(errMsg);
        setMessages((prev) => prev.slice(0, -1));
        return;
      }

      const responseText = getResponseText(data);
      setMessages((prev) => [...prev, { role: "assistant", content: responseText }]);
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;

    const pending = typeof window !== "undefined" ? window.sessionStorage.getItem(PENDING_PROMPT_KEY) : null;
    if (pending) {
      window.sessionStorage.removeItem(PENDING_PROMPT_KEY);
      sendMessage(pending);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    const toSend = message;
    setMessage("");
    sendMessage(toSend);
  };

  const conversationTitle =
    messages.length > 0 && messages[0].role === "user"
      ? messages[0].content.slice(0, 50) + (messages[0].content.length > 50 ? "…" : "")
      : "Nova conversa";

  return (
    <main className="relative flex flex-1 flex-col bg-white dark:bg-background-dark/50">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-100 bg-white/80 px-6 backdrop-blur-md dark:border-white/5 dark:bg-background-dark/80">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Conversa atual:
          </span>
          <span className="max-w-[280px] truncate text-sm font-bold text-gray-900 dark:text-white">
            {conversationTitle}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-primary dark:hover:bg-white/5"
            aria-label="Exportar"
          >
            <span className="material-icons-outlined">ios_share</span>
          </button>
          <button
            type="button"
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500 dark:hover:bg-white/5"
            aria-label="Limpar chat"
          >
            <span className="material-icons-outlined">delete_outline</span>
          </button>
        </div>
      </header>

      {/* Messages */}
      <div
        ref={containerRef}
        id="chat-container"
        className="flex-1 space-y-8 overflow-y-auto p-6 scroll-smooth md:p-10"
      >
        <div className="flex justify-center pb-8">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500 dark:bg-white/5 dark:text-gray-400">
            {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })},{" "}
            {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        {messages.length === 0 && !loading && (
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Digite uma mensagem abaixo ou comece pelo dashboard com um prompt.
            </p>
          </div>
        )}

        {messages.map((msg, i) =>
          msg.role === "user" ? (
            <div key={i} className="group mx-auto flex max-w-4xl flex-row-reverse gap-4">
              <div className="shrink-0">
                <Image
                  src={USER_AVATAR}
                  alt="Você"
                  className="h-10 w-10 rounded-full object-cover shadow-sm"
                  width={40}
                  height={40}
                  unoptimized
                />
              </div>
              <div className="flex-1 space-y-2 text-right">
                <div className="inline-block max-w-[85%] rounded-2xl rounded-tr-none bg-primary/20 p-4 text-left text-gray-900 dark:text-white">
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>
          ) : (
            <div key={i} className="mx-auto flex max-w-4xl gap-4">
              <div className="shrink-0">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-primary to-green-600 shadow-md">
                  <Image
                    src={AI_AVATAR}
                    alt="Sabiá"
                    className="h-full w-full object-cover opacity-90 mix-blend-overlay"
                    width={40}
                    height={40}
                    unoptimized
                  />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <span className="font-bold text-gray-900 dark:text-white">Sabiá</span>
                <div className="markdown-content prose prose-sm max-w-none rounded-2xl rounded-tl-none border border-gray-100 bg-white p-6 text-gray-700 shadow-sm dark:border-white/5 dark:bg-neutral-surface-dark dark:text-gray-300">
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            </div>
          )
        )}

        {loading && (
          <div className="mx-auto flex max-w-4xl gap-4">
            <div className="shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-primary to-green-600 shadow-md">
                <span className="material-icons-outlined text-lg text-white">smart_toy</span>
              </div>
            </div>
            <div className="flex-1 rounded-2xl rounded-tl-none border border-gray-100 bg-white p-6 dark:border-white/5 dark:bg-neutral-surface-dark">
              <span className="text-gray-500 dark:text-gray-400">Sabiá está pensando...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mx-auto max-w-4xl rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="h-24" />
      </div>

      {/* Input */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-linear-to-t from-white via-white to-transparent p-6 dark:from-background-dark dark:via-background-dark">
        <div className="pointer-events-auto mx-auto max-w-4xl">
          <form
            onSubmit={handleSubmit}
            className="relative flex items-end gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl transition-shadow focus-within:ring-2 focus-within:ring-primary/50 dark:border-white/10 dark:bg-neutral-surface-dark"
          >
            <button
              type="button"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-50 hover:text-primary dark:hover:bg-white/5"
              aria-label="Anexar"
            >
              <span className="material-icons-outlined">attach_file</span>
            </button>
            <textarea
              className="max-h-32 w-full resize-none rounded border-none bg-transparent py-3 px-2 leading-relaxed text-gray-900 placeholder-gray-400 focus:ring-0 dark:text-white dark:placeholder-gray-500"
              placeholder="Digite sua mensagem ou peça uma atividade..."
              rows={1}
              style={{ minHeight: "48px" }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="group flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-black shadow-lg shadow-primary/20 transition-transform hover:bg-primary-dark active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Enviar"
            >
              <span className="material-icons-outlined transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                send
              </span>
            </button>
          </form>
          <p className="mt-2 text-center text-[10px] text-gray-400 dark:text-gray-500">
            O Sabiá pode cometer erros. Verifique informações importantes.
          </p>
        </div>
      </div>
    </main>
  );
}
