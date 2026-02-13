import Link from "next/link";

export function Footer() {
  return (
    <footer role="contentinfo" aria-label="Rodapé do site" className="w-full border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
            <Link
              href="https://github.com/lucasvida/app-sabia"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
              aria-label="Repositório oficial da aplicação Sabiá no GitHub (abre em nova aba)"
            >
              <span className="material-icons-outlined text-lg" aria-hidden="true">code</span>
              <span>Repositório oficial da aplicação</span>
            </Link>
            <Link
              href="https://github.com/lucasvida/api-sabia"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
              aria-label="Repositório oficial da API Sabiá no GitHub (abre em nova aba)"
            >
              <span className="material-icons-outlined text-lg" aria-hidden="true">api</span>
              <span>Repositório oficial da API</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="material-icons-outlined text-lg" aria-hidden="true">open_source</span>
            <span className="font-medium">Open Source</span>
          </div>
        </div>
        <p className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 text-center text-xs text-slate-400 dark:text-slate-500 max-w-2xl mx-auto">
          Projeto educacional desenvolvido como trabalho de conclusão da pós-graduação em Full Stack — FIAP FSDT. Parte dos conteúdos exibidos foi gerada por IA com fins ilustrativos e de marcação.
        </p>
      </div>
    </footer>
  );
}
