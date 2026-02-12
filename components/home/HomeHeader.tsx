"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme/ThemeProvider";

const navLinks = [
  { name: "Início", href: "/" },
  { name: "Sobre", href: "/sobre" },
  { name: "Documentação ↗", href: "/documentacao" },
  { name: "Contato", href: "/contato" },

];

export function HomeHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
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
          >
            <div className="relative h-16 md:h-18 w-auto group-hover:scale-110 transition-transform">
              <Image
                src="/logo-sabia.png"
                alt="Sabiá Logo"
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
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                {link.hasDropdown ? (
                  <>
                    <button className={`flex items-center gap-1 text-sm font-medium transition-colors cursor-pointer font-bold ${
                      currentTheme === "dark" ? "text-white" : "text-slate-600"
                    } hover:text-primary`}>
                      {link.name}
                      <span className="material-icons-outlined text-sm opacity-50 group-hover:rotate-180 transition-transform">
                        expand_more
                      </span>
                    </button>
                    <div className="absolute top-full left-0 mt-4 w-56 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                      <div className={`rounded-md shadow-xl p-2 ${
                        currentTheme === "dark" 
                          ? "bg-slate-800 border border-slate-700" 
                          : "bg-white border border-slate-100"
                      }`}>
                        {link.items?.map((item) => (
                          <button
                            key={item.name}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-md transition-colors cursor-pointer ${
                              currentTheme === "dark"
                                ? "text-slate-200 hover:bg-slate-700 hover:text-primary"
                                : "text-slate-600 hover:bg-primary/10 hover:text-primary"
                            }`}
                          >
                            <span className="material-icons-outlined text-lg">
                              {item.icon}
                            </span>
                            {item.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className={`text-sm font-bold transition-colors cursor-pointer ${
                      pathname === link.href
                        ? "text-primary"
                        : currentTheme === "dark" ? "text-white" : "text-slate-600 hover:text-primary"
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
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
              className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-md transition-colors cursor-pointer ${
                currentTheme === "dark" 
                  ? "text-white hover:bg-slate-800" 
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span className="material-icons-outlined text-lg">login</span>
              Entrar
            </Link>
            <Link
              href="/login"
              className="bg-primary hover:bg-primary-dark text-slate-900 px-6 py-2.5 rounded-md font-bold shadow-lg shadow-primary/25 active:scale-95 transition-all cursor-pointer"
            >
              Começar Agora
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
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-2xl font-semibold text-slate-800 cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-slate-100" />
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-md border-2 border-slate-100 font-bold text-slate-700 cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="material-icons-outlined">login</span> Entrar no Sabiá
            </Link>
            <Link
              href="/login"
              className="w-full py-4 bg-primary text-slate-900 rounded-md font-bold shadow-lg shadow-primary/30 text-center cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              Teste Grátis Agora
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
