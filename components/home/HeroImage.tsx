import Image from "next/image";

export function HeroImage() {
  return (
    <div className="relative w-full h-full flex items-center justify-center lg:justify-end overflow-visible">
      {/* Card Hero: imagem com cantos arredondados; overflow-hidden só na foto */}
      <div className="relative w-full h-[60vh] min-h-[500px] max-h-[700px] lg:h-[65vh] lg:min-h-[600px] lg:max-h-[800px] rounded-xl shadow-2xl overflow-visible">
        <div className="absolute inset-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
          <Image
            src="/cover-home.png"
            alt="Estudantes em sala de aula - capa do site Sabiá"
            className="w-full h-full object-cover object-center"
            fill
            unoptimized
            priority
          />
        </div>

        {/* Tooltip no canto inferior direito, sem inclinação; animação "mensagem recebida" */}
        <div
          className="absolute -bottom-10 -right-6 w-[88%] max-w-sm rounded-xl p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-slate-500/40 translate-x-5 translate-y-2 animate-message-received hover:scale-[1.02] hover:shadow-xl transition-transform transition-shadow duration-200 cursor-default"
          style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.08)" }}
          role="complementary"
          aria-label="Sugestão do Sabiá: Vamos criar um quiz interativo sobre sustentabilidade?"
        >
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 bg-primary/90 rounded-lg flex items-center justify-center shadow-lg" aria-hidden="true">
              <span className="material-icons-outlined text-white text-xl">chat_bubble_outline</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">
                SABIÁ DIZ:
              </p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                "Vamos criar um quiz interativo sobre sustentabilidade?"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
