import Image from "next/image";

const BOOK_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCYk_p69wXjpOyCpAZy54lHNWegzZVLOlGDbAuSujxiZFQvsbWVjeWhljLvk2FgghgvklmJqollblK3jXVsnWrPtXzg7k9PGOlaJQjlMocp3fiV5EuLf6CLQ7OD28zoKXKCPQroElwNTDXw_bNoMQ_QaaKXYvuv7tFXgOwznYRJg_8cdDniSr6nFSWzNOSpBj4pNN_4FPg1r5uw4BlOunfKzSXUk10ewjYiYNh91M6eDjbDfZ7uwjnAL9t1zgLa_pi0HJ1CvmeYtnA";

export function HeroSection() {
  return (
    <div className="hidden lg:flex flex-col items-start justify-center space-y-8 pr-8">
      <div className="inline-flex items-center space-x-3 bg-white dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 dark:border-primary/20 shadow-sm">
        <span className="bg-primary/20 text-green-800 dark:text-green-300 p-1.5 rounded-full">
          <span className="material-icons text-sm">school</span>
        </span>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Assistente Pedagógico Inteligente
        </span>
      </div>

      <h1 className="text-5xl font-bold leading-tight text-slate-900 dark:text-white">
        Ensine com leveza, <br />
        <span className="text-transparent bg-clip-text bg-linear-to-r from-green-600 to-primary dark:from-green-400 dark:to-primary">
          voe mais alto.
        </span>
      </h1>

      <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
        O Sabiá ajuda você a planejar aulas e inspirar seus
        alunos com o poder da inteligência artificial feito para educadores.
      </p>

      <div className="relative w-full max-w-md aspect-4/3 rounded-md overflow-hidden shadow-2xl shadow-primary/20 border-4 border-white dark:border-slate-800 transform rotate-2 hover:rotate-0 transition-transform duration-500">
        <Image
          src={BOOK_IMAGE}
          alt="Livro aberto simbolizando educação e conhecimento"
          className="object-cover w-full h-full opacity-90 hover:scale-105 transition-transform duration-700"
          width={640}
          height={480}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
          <div className="flex items-center space-x-2 text-white">
            <span className="material-icons text-primary">verified</span>
            <span className="font-medium text-sm">
              Usado por +15.000 professores
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
