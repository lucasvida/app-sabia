"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getAuthErrorMessage } from "@/lib/auth-messages";
import { useTheme } from "@/components/theme/ThemeProvider";

export function LoginCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || "light";
  const toggleTheme = () => setTheme(currentTheme === "dark" ? "light" : "dark");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Prevenir múltiplos submits
    if (loading) return;
    
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      if (!supabase) {
        setError("Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY em .env.local");
        setLoading(false);
        return;
      }
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(getAuthErrorMessage(signInError));
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Ocorreu um erro. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Botão de tema: igual à home, canto superior direito */}
      <button
        type="button"
        onClick={toggleTheme}
        className={`fixed top-4 right-4 z-50 p-2 rounded-full transition-colors cursor-pointer ${
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

      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl shadow-slate-200/30 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-primary to-yellow-300" />

        <div className="text-center mb-8 flex flex-col items-center">
          <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity mb-4" aria-label="Sabiá - Voltar à página inicial">
            <div className="relative h-20 w-auto">
              <Image
                src="/logo-sabia.png"
                alt="Logo do Sabiá - assistente pedagógico inteligente"
                width={200}
                height={80}
                className="object-contain h-full w-auto"
                unoptimized
                priority
              />
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Bem-vindo ao Sabiá
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Faça login para acessar suas turmas.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}
          <div>
            <label
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              htmlFor="email"
            >
              E-mail institucional
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <span className="material-icons text-xl">mail_outline</span>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-md leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out sm:text-sm"
                id="email"
                placeholder="professor@escola.com.br"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              htmlFor="password"
            >
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <span className="material-icons text-xl">lock_outline</span>
              </div>
              <input
                className="block w-full pl-10 pr-10 py-3 border border-slate-200 dark:border-slate-700 rounded-md leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 ease-in-out sm:text-sm"
                id="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                <span className="material-icons text-xl">
                  {showPassword ? "visibility" : "visibility_off"}
                </span>
              </button>
            </div>
          </div>

          <button
            className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-md text-slate-900 bg-primary hover:bg-primary-dark active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-200 shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            type="submit"
            disabled={loading}
          >
            {loading ? "Entrando…" : "Entrar no Sabiá"}
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
        © 2026 Sabiá Educação. Feito com carinho no Brasil 🇧🇷
      </p>
    </div>
  );
}
