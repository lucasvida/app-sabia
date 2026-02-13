"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const PROFILE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBawc2pG4cBv1FBoyjeihoH7iABj2X1HxPsGC8ZU5jg8bYR8hFUXSLstFe-6RFgHbMV_lG5ERZGyNCHR4pMrx1ud5A2RQNc2yFanwilL4Z9700bmAXuuKc3AySdsVeKOxK_eR0euwvQ9dFvRoazzgynnzAR8TjxuL7bdcXZD4uzua-xZsLwPmVL9zul0JDxQCJ0Id6qI2yGWsZSi7NIpmXB6Z69nQW1UTEzHMYiQcD0wzGOwNvmODnR8VL0Z6OamYldAe6TGLf07NU";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/dashboard/aulas", label: "Minhas Aulas", icon: "class" },
  { href: "/dashboard/planejamento", label: "Meus Planejamentos", icon: "edit_calendar" },
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

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("Prof. …");

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
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
    <aside className="flex h-auto w-full shrink-0 flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 md:h-screen md:w-64 md:sticky md:top-0 z-20">
      <div>
        <Link href="/dashboard" className="flex items-center justify-center gap-3 p-6 cursor-pointer hover:opacity-80 transition-opacity" aria-label="Sabiá - Voltar ao dashboard">
          <div className="relative h-16 w-auto">
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
        <nav className="space-y-1 px-4 py-2">
          {navItems.map(({ href, label, icon }) => {
            const isActive =
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-md px-4 py-3 transition-colors cursor-pointer ${
                  isActive
                    ? "bg-primary/10 font-semibold text-primary-dark dark:text-primary"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span className="material-icons-round">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-slate-100 dark:border-slate-800 p-4 space-y-1">
        <Link
          href="/dashboard/configuracoes"
          className="flex items-center gap-3 rounded-md px-4 py-3 text-slate-600 dark:text-slate-400 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
          aria-label={`Configurações da conta - ${displayName}`}
        >
          <div className="relative shrink-0">
            <Image
              src={PROFILE_IMAGE}
              alt="Foto de perfil do professor"
              className="h-8 w-8 rounded-full object-cover"
              width={32}
              height={32}
              unoptimized
            />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-neutral-surface-dark bg-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
              {displayName}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-500">
              Configurações
            </p>
          </div>
          <span className="material-icons-round text-slate-400">settings</span>
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-slate-600 dark:text-slate-400 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
        >
          <span className="material-icons-round">logout</span>
          <span className="text-sm font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
}
