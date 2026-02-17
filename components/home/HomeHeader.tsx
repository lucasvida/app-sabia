"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme/ThemeProvider";

const navLinks: { name: string; href: string; external?: boolean }[] = [
  { name: "Início", href: "/" },
  { name: "Sobre", href: "/sobre" },
  { name: "Documentação ↗", href: "https://docs.sabiaedu.ia.br/", external: true },
];

export function HomeHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();
  
  // Garantir que resolvedTheme tenha um valor padrão
  const currentTheme = resolvedTheme || "light";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 ${
          scrolled
            ? "mt-4 mx-4 md:mx-12 rounded-md bg-white/70 dark:bg-slate-950 backdrop-blur-md shadow-lg border border-white/20 dark:border-slate-800"
            : currentTheme === "dark"
            ? "bg-slate-950 backdrop-blur-md"
            : "bg-transparent mt-0"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group cursor-pointer"
            aria-label="Sabiá - Ir para a página inicial"
          >
            <div className="relative h-16 md:h-18 w-auto group-hover:scale-110 transition-transform">
              <Image
                src="/logo-sabia.png"
                alt="Logo do Sabiá - assistente pedagógico inteligente"
                width={192}
                height={72}
                className="object-contain h-full w-auto"
                unoptimized
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const linkClass = `text-sm font-bold transition-colors cursor-pointer ${
                !link.external && pathname === link.href
                  ? "text-primary"
                  : currentTheme === "dark" ? "text-white" : "text-slate-600 hover:text-primary"
              }`;
              if (link.external) {
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {link.name}
                  </a>
                );
              }
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={linkClass}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                currentTheme === "dark" 
                  ? "text-white hover:bg-slate-800" 
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span className="material-icons-outlined">
                {currentTheme === "dark" ? "light_mode" : "dark_mode"}
              </span>
            </button>
            <Link
              href="/login"
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-slate-900 px-6 py-2.5 rounded-md font-bold shadow-lg shadow-primary/25 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-icons-outlined text-lg">login</span>
              Fazer Login
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className={`md:hidden p-2 cursor-pointer ${
              currentTheme === "dark" ? "text-white" : "text-slate-600"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="material-icons-outlined text-2xl">
              {isMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="absolute inset-0 bg-white p-8 pt-24">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl font-semibold text-slate-800 cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-2xl font-semibold text-slate-800 cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              )
            )}
            <hr className="border-slate-100" />
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-slate-900 rounded-md font-bold shadow-lg shadow-primary/30 cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="material-icons-outlined">login</span> Fazer Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
