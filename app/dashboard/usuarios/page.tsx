"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const SUPER_ADMIN_EMAIL = "professor@sabiaedu.ia.br";

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

type UserList = { id: string; email: string | null; created_at: string; user_metadata?: Record<string, unknown> }[];

export default function UsuariosPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [adminUsers, setAdminUsers] = useState<UserList>([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createName, setCreateName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createMessage, setCreateMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isSuperAdmin = userEmail?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      if (!supabase) {
        setLoading(false);
        return;
      }
      const {
        data: { user: u },
      } = await supabase.auth.getUser();
      setUserEmail(u?.email ?? null);
      setLoading(false);
    }
    loadUser();
  }, []);

  useEffect(() => {
    if (!isSuperAdmin) return;
    async function loadUsers() {
      setAdminLoading(true);
      try {
        const res = await fetch("/api/admin/users");
        if (res.ok) {
          const data = (await res.json()) as UserList;
          setAdminUsers(data);
        }
      } catch {
        setAdminUsers([]);
      } finally {
        setAdminLoading(false);
      }
    }
    loadUsers();
  }, [isSuperAdmin]);

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setCreateMessage(null);
    if (!createEmail.trim()) {
      setCreateMessage({ type: "error", text: "Informe o e-mail." });
      return;
    }
    if (!createPassword || createPassword.length < 6) {
      setCreateMessage({ type: "error", text: "Senha deve ter no mínimo 6 caracteres." });
      return;
    }
    setCreateLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: createEmail.trim(),
          password: createPassword,
          name: createName.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setCreateMessage({ type: "error", text: (data?.error as string) ?? "Erro ao criar usuário." });
        return;
      }
      setCreateMessage({ type: "success", text: (data?.message as string) ?? "Usuário criado." });
      setCreateEmail("");
      setCreatePassword("");
      setCreateName("");
      const listRes = await fetch("/api/admin/users");
      if (listRes.ok) setAdminUsers((await listRes.json()) as UserList);
    } catch {
      setCreateMessage({ type: "error", text: "Erro ao criar usuário." });
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleDeleteUser(uid: string) {
    if (!confirm("Excluir este usuário? Ele não poderá mais acessar o sistema.")) return;
    setDeletingId(uid);
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(uid)}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert((data?.error as string) ?? "Erro ao excluir.");
        return;
      }
      setAdminUsers((prev) => prev.filter((u) => u.id !== uid));
    } catch {
      alert("Erro ao excluir usuário.");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="p-6 md:p-10">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Usuários</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Carregando…</p>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <div className="p-6 md:p-10">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Usuários</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Você não tem permissão para gerenciar usuários.</p>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex cursor-pointer items-center gap-2 text-primary hover:underline"
        >
          Voltar ao dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Usuários</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">Criar, listar e excluir usuários do sistema.</p>

      <div className="mt-8 max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <form onSubmit={handleCreateUser} className="mb-8 rounded-lg border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Criar novo usuário</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="email"
              value={createEmail}
              onChange={(e) => setCreateEmail(e.target.value)}
              placeholder="E-mail"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            <input
              type="text"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              placeholder="Nome (opcional)"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            <input
              type="password"
              value={createPassword}
              onChange={(e) => setCreatePassword(e.target.value)}
              placeholder="Senha (mín. 6 caracteres)"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            <button
              type="submit"
              disabled={createLoading}
              className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-bold text-slate-900 shadow-sm hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createLoading ? "Criando…" : "Criar usuário"}
            </button>
          </div>
          {createMessage && (
            <p
              className={`mt-2 text-sm ${createMessage.type === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
            >
              {createMessage.text}
            </p>
          )}
        </form>

        <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Usuários cadastrados</h2>
        {adminLoading ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Carregando…</p>
        ) : adminUsers.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Nenhum usuário além de você.</p>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-700">
            {adminUsers.map((u) => {
              const isCurrent = u.email?.toLowerCase() === userEmail?.toLowerCase();
              return (
                <li
                  key={u.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {u.email ?? "(sem e-mail)"}
                      {isCurrent && (
                        <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">(você)</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDatePTBR(u.created_at)}
                    </p>
                  </div>
                  {!isCurrent && (
                    <button
                      type="button"
                      onClick={() => handleDeleteUser(u.id)}
                      disabled={deletingId === u.id}
                      className="cursor-pointer rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      {deletingId === u.id ? "Excluindo…" : "Excluir"}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
