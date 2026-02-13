"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

function formatDatePTBR(isoDate: string | undefined): string {
  if (!isoDate) return "—";
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export default function ConfiguracoesPage() {
  const [user, setUser] = useState<{ email?: string; name?: string; createdAt?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data: { user: u } } = await supabase.auth.getUser();
      if (u) {
        const name =
          u.user_metadata?.full_name ??
          u.user_metadata?.name ??
          u.user_metadata?.display_name ??
          u.email?.split("@")[0] ??
          "—";
        setUser({
          email: u.email ?? "—",
          name,
          createdAt: u.created_at,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  async function handleResetPassword() {
    const supabase = createClient();
    const email = user?.email;
    if (!supabase || !email || email === "—") {
      setResetMessage({ type: "error", text: "E-mail não disponível para redefinição." });
      return;
    }
    setResetLoading(true);
    setResetMessage(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/login` : undefined,
      });
      if (error) {
        setResetMessage({ type: "error", text: error.message });
      } else {
        setResetMessage({
          type: "success",
          text: "Enviamos um link para redefinir sua senha no seu e-mail. Verifique a caixa de entrada.",
        });
      }
    } catch {
      setResetMessage({ type: "error", text: "Erro ao enviar e-mail. Tente novamente." });
    } finally {
      setResetLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 md:p-10">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Configurações</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Carregando perfil…</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Configurações</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">Ajuste seu perfil e preferências.</p>

      <div className="mt-8 max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Dados do perfil</h2>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Nome</dt>
            <dd className="mt-1 text-slate-900 dark:text-white">{user?.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">E-mail</dt>
            <dd className="mt-1 text-slate-900 dark:text-white">{user?.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Data de criação da conta</dt>
            <dd className="mt-1 text-slate-900 dark:text-white">{formatDatePTBR(user?.createdAt)}</dd>
          </div>
        </dl>

        <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-700">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Senha</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Enviaremos um link para o seu e-mail para redefinir sua senha com segurança.
          </p>
          {resetMessage && (
            <p
              className={`mt-2 text-sm ${resetMessage.type === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
            >
              {resetMessage.text}
            </p>
          )}
          <button
            type="button"
            onClick={handleResetPassword}
            disabled={resetLoading || !user?.email || user.email === "—"}
            className="mt-3 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
          >
            {resetLoading ? "Enviando…" : "Enviar link para redefinir senha"}
          </button>
        </div>
      </div>
    </div>
  );
}
