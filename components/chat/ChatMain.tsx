"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useChat } from "./ChatContext";
import { useTheme } from "@/components/theme/ThemeProvider";

const PENDING_PROMPT_KEY = "sabia_pending_prompt";

const USER_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD_SIsSxs-0XPQBguo2ZTPCT-hIOT788173C1npTJ5dpbJhf5nxB3D6qxE6HBI5jI2yRchpSXB0ft4hgnD009tdJ7Qdjs504Rt8uABaD7eBKHkk_wdTudXbwEIe_5XsQNkjIRXjo8pZzQn_1qE-SsVyuPhq8moYtuZjYfG7rQe3f_NytoqfW-rO_9eLRfAWGSO0_wjdw9ex8OGRbzzo-RVE_8CdpsnaZ4dLwZ1YT4nJhLEX40tLNBYKxYdCFtU0h6hN9hEzaqfygU4";

export function ChatMain() {
  const { messages, loading, error, thinkingPhrase, sendMessage } = useChat();
  const { setTheme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || "light";
  const [message, setMessage] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const initialLoadRef = useRef(false);

  const toggleTheme = () => setTheme(currentTheme === "dark" ? "light" : "dark");

  const scrollToBottom = () => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;

    const pending = typeof window !== "undefined" ? window.sessionStorage.getItem(PENDING_PROMPT_KEY) : null;
    if (pending) {
      window.sessionStorage.removeItem(PENDING_PROMPT_KEY);
      sendMessage(pending);
    }
  }, [sendMessage]);

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
    <main className="relative flex flex-1 flex-col bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Conversa atual:
          </span>
          <span className="max-w-[280px] truncate text-sm font-bold text-gray-900 dark:text-white">
            {conversationTitle}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-primary hover:underline cursor-pointer"
            aria-label="Voltar ao dashboard"
          >
            Voltar
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              currentTheme === "dark"
                ? "text-white hover:bg-slate-800"
                : "text-slate-500 hover:bg-slate-100"
            }`}
            aria-label={currentTheme === "dark" ? "Modo claro" : "Modo escuro"}
          >
            <span className="material-icons-outlined">
              {currentTheme === "dark" ? "light_mode" : "dark_mode"}
            </span>
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
                  alt="Avatar do usuário"
                  className="h-10 w-10 rounded-full object-cover shadow-sm"
                  width={40}
                  height={40}
                  unoptimized
                />
              </div>
              <div className="flex-1 space-y-2 text-right">
                <div className="inline-block max-w-[85%] rounded-md rounded-tr-none bg-primary/20 p-4 text-left text-gray-900 dark:text-white">
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>
          ) : (
            <div key={i} className="mx-auto flex max-w-4xl gap-4">
              <div className="shrink-0 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary shadow-md">
                <Image
                  src="/favicon.png"
                  alt="Sabiá"
                  className="h-7 w-7 object-contain"
                  width={28}
                  height={28}
                  unoptimized
                />
              </div>
              <div className="flex-1 space-y-2">
                <span className="font-bold text-gray-900 dark:text-white">Sabiá</span>
                <div className="markdown-content prose prose-sm max-w-none rounded-md rounded-tl-none border border-slate-200 bg-white p-6 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            </div>
          )
        )}

        {loading && (
          <div className="mx-auto flex max-w-4xl gap-4 animate-in fade-in duration-300">
            <div className="shrink-0">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary shadow-md animate-pulse ring-2 ring-primary/30 ring-offset-2 dark:ring-offset-slate-950">
                <Image
                  src="/favicon.png"
                  alt=""
                  className="h-7 w-7 object-contain"
                  width={28}
                  height={28}
                  unoptimized
                />
              </div>
            </div>
            <div className="flex-1 overflow-hidden rounded-md rounded-tl-none border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex min-h-10 items-center gap-2">
                <span className="text-gray-500 dark:text-gray-400 transition-opacity duration-300">
                  {thinkingPhrase ?? "Sabiá está pensando..."}
                </span>
                <span className="flex gap-1" aria-hidden="true">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
                </span>
              </div>
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full w-0 rounded-full bg-primary/60 animate-thinking-progress" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mx-auto max-w-4xl rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="h-24" />
      </div>

      {/* Input */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-linear-to-t from-white via-white to-transparent p-6 dark:from-slate-950 dark:via-slate-950">
        <div className="pointer-events-auto mx-auto max-w-4xl">
          <form
            onSubmit={handleSubmit}
            className="relative flex items-end gap-2 rounded-md border border-slate-200 bg-white p-2 shadow-xl transition-shadow focus-within:ring-2 focus-within:ring-primary/50 dark:border-slate-800 dark:bg-slate-900"
          >
            <textarea
              className="max-h-32 w-full resize-none rounded border-none bg-transparent py-3 px-4 leading-relaxed text-gray-900 placeholder-gray-400 focus:ring-0 dark:text-white dark:placeholder-gray-500"
              placeholder="Digite sua mensagem ou peça uma atividade..."
              rows={1}
              style={{ minHeight: "48px" }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  const form = e.currentTarget.form;
                  if (form && message.trim()) form.requestSubmit();
                }
              }}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="group flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary text-black shadow-lg shadow-primary/20 transition-transform hover:bg-primary-dark active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Enviar"
            >
              <span className="material-icons-outlined transition-transform group-hover:translate-y-0.5">
                arrow_upward
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
