import Link from "next/link";
import Image from "next/image";

const BOOK_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCYk_p69wXjpOyCpAZy54lHNWegzZVLOlGDbAuSujxiZFQvsbWVjeWhljLvk2FgghgvklmJqollblK3jXVsnWrPtXzg7k9PGOlaJQjlMocp3fiV5EuLf6CLQ7OD28zoKXKCPQroElwNTDXw_bNoMQ_QaaKXYvuv7tFXgOwznYRJg_8cdDniSr6nFSWzNOSpBj4pNN_4FPg1r5uw4BlOunfKzSXUk10ewjYiYNh91M6eDjbDfZ7uwjnAL9t1zgLa_pi0HJ1CvmeYtnA";

export function NewHeroSection() {
  return (
    <div className="relative z-10">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 dark:bg-primary/20 text-green-700 dark:text-green-400 text-sm font-bold mb-6">
        <div className="relative w-4 h-4">
          <Image
            src="/favicon.png"
            alt="Ícone do Sabiá - assistente pedagógico inteligente"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
        Assistente Pedagógico Inteligente
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-slate-900 dark:text-white">
        Ensine com <span className="text-primary">leveza</span>,<br />
        voe mais alto.
      </h1>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-lg leading-relaxed">
        O Sabiá ajuda você a planejar aulas personalizadas e inspirar seus alunos com o poder da inteligência artificial feita para educadores.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-slate-900 rounded-md font-bold text-lg shadow-xl shadow-primary/30 transition-all hover:-translate-y-1 cursor-pointer"
        >
          Começar agora{" "}
          <span className="material-icons-outlined text-xl">arrow_forward</span>
        </Link>
        <Link
          href="/sobre"
          className="flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer"
        >
          Sobre o projeto
        </Link>
      </div>

      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
        <div className="flex -space-x-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden italic text-[10px] font-bold text-slate-600 dark:text-slate-300"
            >
              P{i}
            </div>
          ))}
        </div>
        <span>
          Usado por{" "}
          <strong className="text-slate-900 dark:text-white">+15.000</strong>{" "}
          professores no Brasil
        </span>
      </div>
    </div>
  );
}
