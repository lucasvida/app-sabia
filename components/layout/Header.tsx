"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSelector } from "@/components/theme/ThemeSelector";

const navItems = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/recursos", label: "Recursos" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-slate-700/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
          aria-label="Sabiá - Página inicial"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/25">
            <span className="material-icons text-lg">auto_awesome</span>
          </span>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Sabiá
          </span>
        </Link>

        {/* Links centrais */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(({ href, label }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2.5 text-sm font-medium transition-colors rounded-lg border-b-2 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  isActive
                    ? "text-primary border-primary"
                    : "border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Direita: tema + Entrar + Começar Agora */}
        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <ThemeSelector />
          <Link
            href="/"
            className="hidden sm:inline-flex text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-slate-900 shadow-lg shadow-primary/25 transition hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-[0.98]"
          >
            Começar Agora
          </Link>
        </div>
      </nav>
    </header>
  );
}
