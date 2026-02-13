import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/home/Footer";

const IMAGE_SOBRE =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80";

const features = [
  {
    title: "Inovação",
    description: "Tecnologia pensada para o Brasil",
    icon: "water_drop",
    iconBg: "bg-primary",
  },
  {
    title: "Simplicidade",
    description: "Interface clara para o dia a dia",
    icon: "auto_awesome",
    iconBg: "bg-yellow-400",
  },
  {
    title: "Impacto",
    description: "Resultados reais na sala de aula",
    icon: "groups",
    iconBg: "bg-primary",
  },
];

const stats = [
  { value: "15k+", label: "PROFESSORES" },
  { value: "100%", label: "SEGURO E ÉTICO" },
  { value: "40%", label: "ECONOMIA DE TEMPO" },
  { value: "BR", label: "FOCO REGIONAL", highlight: true },
];

const team = [
  {
    name: "Jhonnathan de Sousa",
    role: "Desenvolvimento",
    photo: "/jhonnathan-de-sousa.png",
    linkedin: "#",
    github: "https://github.com/JhonnathanL",
  },
  {
    name: "Gustavo Almeida",
    role: "Desenvolvimento",
    photo: "/gustavo-almeida.jpg.png",
    linkedin: "https://www.linkedin.com/in/gustavoalmeidabp/",
    github: "https://github.com/GusRed",
  },
  {
    name: "Renan Morais",
    role: "Desenvolvimento",
    photo: "/renan-morais.png",
    linkedin: "https://www.linkedin.com/in/renan-morais-1bb762145/",
    github: "https://github.com/renangf4",
  },
  {
    name: "Marcos Augusto",
    role: "Desenvolvimento",
    photo: "/macos.png",
    linkedin: "https://www.linkedin.com/in/marcos-augusto-santello-78a5881a3/",
    github: "https://github.com/MarcosAugusto10",
  },
  {
    name: "Lucas Vida",
    role: "Desenvolvimento",
    photo: "/lucas-vida.png",
    linkedin: "https://www.linkedin.com/in/lucas-vida/",
    github: "https://github.com/lucasvida",
  },
];

export default function SobrePage() {
  return (
    <div className="min-h-screen">
      {/* Conteúdo principal: duas colunas */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
          {/* Coluna esquerda: imagem + citação + badge impacto */}
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <Image
                src={IMAGE_SOBRE}
                alt="Ensino que floresce com inteligência"
                className="aspect-4/3 w-full object-cover"
                width={800}
                height={600}
                unoptimized
              />
              <div className="absolute inset-x-0 bottom-0 rounded-b-2xl bg-black/60 px-6 py-5">
                <p className="text-center font-medium italic leading-relaxed text-white">
                  &ldquo;Conta o sabiá na palmeira, onde o ensino floresce com
                  inteligência.&rdquo;
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary">
                  <span className="material-icons-outlined text-2xl text-white">
                    school
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Impacto
                  </p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">
                    +500 Escolas
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary">
                  <span className="material-icons-outlined text-2xl text-white">
                    menu_book
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Conteúdos
                  </p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">
                    +1000 Conteúdos Públicos
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna direita: tag, título, texto, features, CTAs */}
          <div className="space-y-8">
            <span className="inline-block rounded-full bg-primary px-4 py-1.5 text-sm font-semibold uppercase tracking-wider text-white">
              Sobre o projeto
            </span>
            <h1 className="text-4xl font-bold leading-tight text-slate-900 dark:text-white md:text-5xl">
              Inteligência Artificial a serviço de{" "}
              <span className="text-primary">quem educa.</span>
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              O Sabiá nasceu do desejo de devolver ao professor o seu bem mais
              precioso: o tempo. Somos um assistente inteligente brasileiro,
              desenvolvido para entender os desafios reais da sala de aula e
              simplificar a rotina pedagógica com tecnologia humana e ética.
            </p>

            <h2 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white md:text-1xl">
              Por quê o nome Sabiá?
            </h2>
            <p className="max-w-lg text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Sabiá carrega nossa essência no próprio nome. Inspirado no pássaro brasileiro que anuncia o amanhecer com seu canto, ele simboliza começo, presença e identidade. Ao mesmo tempo, <strong>é uma alusão a Saber + IA</strong>  a união entre o conhecimento humano e a inteligência artificial. O Sabiá nasce para apoiar quem educa, devolvendo tempo ao professor e colocando a tecnologia a serviço da sabedoria, nunca no lugar dela.
            </p>

            <div className="grid gap-6 sm:grid-cols-3">
              {features.map((item) => (
                <div key={item.title} className="space-y-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${item.iconBg} text-white`}
                  >
                    <span className="material-icons-outlined text-xl">
                      {item.icon}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>


          </div>
        </div>

        {/* Card de equipe — Vamos nos conectar? */}
        <div className="mt-20">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800/50 md:p-10">
            <h2 className="mb-10 text-center text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
              Vamos nos conectar?
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50/80 p-6 transition hover:border-primary/30 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-primary/40"
                >
                  <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full ring-2 ring-primary/20">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="mb-4 text-center text-sm text-slate-600 dark:text-slate-400">
                    {member.role}
                  </p>
                  <div className="mt-auto flex gap-3 justify-center">
                    {member.linkedin !== "#" && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition hover:bg-[#0a66c2] hover:text-white dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-[#0a66c2]"
                        aria-label={`LinkedIn de ${member.name}`}
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    )}
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition hover:bg-slate-800 hover:text-white dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-100 dark:hover:text-slate-900"
                      aria-label={`GitHub de ${member.name}`}
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Barra de estatísticas */}
      <section className="border-t border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="text-center"
              >
                <p
                  className={`text-3xl font-bold md:text-4xl ${
                    item.highlight
                      ? "text-yellow-500 dark:text-yellow-400"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  {item.value}
                </p>
                <p className="mt-1 text-sm font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
