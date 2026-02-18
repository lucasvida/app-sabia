"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

export type Message = { role: "user" | "assistant"; content: string };

type ChatContextValue = {
  messages: Message[];
  loading: boolean;
  error: string | null;
  thinkingPhrase: string | null;
  sendMessage: (text: string) => Promise<void>;
  clearConversation: () => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}

const THINKING_PHRASES = [
  "Sabiá está organizando suas ideias…",
  "Preparando um conteúdo caprichado para você.",
  "Só um instante, estou estruturando a aula.",
  "Ajustando os detalhes finais do material.",
  "Pensando na melhor forma de apresentar isso.",
  "Consultando a biblioteca do conhecimento…",
  "Alinhando os tópicos com cuidado.",
  "Organizando o plano passo a passo.",
];
const THINKING_DELAY_MS = 5000;
const PHRASE_ROTATE_MS = 4500;

function getResponseText(data: { response?: string }): string {
  return typeof data?.response === "string" ? data.response : "Não foi possível obter resposta.";
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thinkingPhrase, setThinkingPhrase] = useState<string | null>(null);
  const thinkingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phraseIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearConversation = useCallback(() => {
    setMessages([]);
    setError(null);
    setThinkingPhrase(null);
    if (thinkingTimerRef.current) {
      clearTimeout(thinkingTimerRef.current);
      thinkingTimerRef.current = null;
    }
    if (phraseIntervalRef.current) {
      clearInterval(phraseIntervalRef.current);
      phraseIntervalRef.current = null;
    }
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setLoading(true);
    setThinkingPhrase(null);

    const startPhraseRotation = () => {
      let index = 0;
      setThinkingPhrase(THINKING_PHRASES[0]);
      phraseIntervalRef.current = setInterval(() => {
        index = (index + 1) % THINKING_PHRASES.length;
        setThinkingPhrase(THINKING_PHRASES[index]);
      }, PHRASE_ROTATE_MS);
    };

    thinkingTimerRef.current = setTimeout(() => {
      thinkingTimerRef.current = null;
      startPhraseRotation();
    }, THINKING_DELAY_MS);

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
      setThinkingPhrase(null);
      if (thinkingTimerRef.current) {
        clearTimeout(thinkingTimerRef.current);
        thinkingTimerRef.current = null;
      }
      if (phraseIntervalRef.current) {
        clearInterval(phraseIntervalRef.current);
        phraseIntervalRef.current = null;
      }
    }
  }, [loading]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        loading,
        error,
        thinkingPhrase,
        sendMessage,
        clearConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
