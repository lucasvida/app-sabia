"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const SUPER_ADMIN_EMAIL = "professor@sabiaedu.ia.br";

const baseNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/dashboard/aulas", label: "Minhas Aulas", icon: "class" },
  { href: "/dashboard/planejamento", label: "Meus Planos de Aula", icon: "edit_calendar" },
  { href: "/dashboard/quizzes", label: "Meus Quizzes", icon: "quiz" },
];

function getFirstName(fullName: string | undefined, email: string | undefined): string {
  if (fullName?.trim()) {
    const first = fullName.trim().split(/\s+/)[0];
    return first || "Professor(a)";
  }
  if (email) return email.split("@")[0] || "Professor(a)";
  return "Professor(a)";
}

type DashboardSidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export function DashboardSidebar({ isOpen = true, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("Prof. …");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const isSuperAdmin = userEmail?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
  const navItems = [
    ...baseNavItems,
    ...(isSuperAdmin ? [{ href: "/dashboard/usuarios", label: "Usuários", icon: "people" as const }] : []),
  ];

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email ?? null);
      const name = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.user_metadata?.display_name;
      const first = getFirstName(name, user?.email ?? undefined);
      setDisplayName(`Prof. ${first}`);
    }
    loadUser();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col justify-between border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 transition-transform duration-300 md:relative md:z-20 md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-50 rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden cursor-pointer"
          aria-label="Fechar menu"
        >
          <span className="material-icons-outlined">close</span>
        </button>
      )}
      <div>
        <Link
          href="/dashboard"
          onClick={onClose}
          className="flex items-center justify-center gap-2 p-3 md:p-4 cursor-pointer hover:opacity-80 transition-opacity"
          aria-label="Sabiá - Voltar ao dashboard"
        >
          <div className="relative h-10 w-auto md:h-14">
            <Image
              src="/logo-sabia.png"
              alt="Logo do Sabiá - assistente pedagógico inteligente"
              width={180}
              height={64}
              className="object-contain h-full w-auto"
              unoptimized
              priority
            />
          </div>
        </Link>
        <nav className="space-y-0.5 px-2 py-1 md:px-4 md:py-2">
          {navItems.map(({ href, label, icon }) => {
            const isActive =
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-2 rounded-md px-2 py-2 md:px-4 md:py-2.5 transition-colors cursor-pointer text-sm ${
                  isActive
                    ? "bg-primary/10 font-semibold text-primary-dark dark:text-primary"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span className="material-icons-round text-lg md:text-xl">{icon}</span>
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-slate-100 dark:border-slate-800 p-2 md:p-4 space-y-0.5">
        <Link
          href="/dashboard/configuracoes"
          onClick={onClose}
          className="flex items-center gap-2 rounded-md px-2 py-2 md:px-4 md:py-2.5 text-slate-600 dark:text-slate-400 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
          aria-label={`Configurações da conta - ${displayName}`}
        >
          <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 md:h-8 md:w-8">
            <span className="material-icons-outlined text-base text-slate-500 dark:text-slate-400 md:text-lg" aria-hidden="true">
              person
            </span>
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-white dark:border-neutral-surface-dark bg-primary md:h-2.5 md:w-2.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-slate-900 dark:text-white md:text-sm">
              {displayName}
            </p>
            <p className="truncate text-[10px] text-slate-500 dark:text-slate-500 md:text-xs">
              Configurações
            </p>
          </div>
          <span className="material-icons-round text-slate-400 text-lg md:text-xl">settings</span>
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-slate-600 dark:text-slate-400 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer md:px-4 md:py-2.5"
        >
          <span className="material-icons-round text-lg md:text-xl">logout</span>
          <span className="text-xs font-medium md:text-sm">Sair</span>
        </button>
      </div>
    </aside>
  );
}
