import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900 pt-[120px]">
      {/* Background Image - Sober fade instead of extreme zoom */}
      <div
        className="absolute inset-0 hero-bg-image bg-cover bg-center opacity-40 mix-blend-luminosity"
        aria-hidden="true"
      />

      {/* Classic dark overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/60"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-[1400px] px-8 py-20 flex flex-col items-center text-center">
        <div className="max-w-[1400px] animate-fadeInUp flex flex-col items-center">

          <div className="inline-flex items-center gap-2 px-6 py-1.5 border border-white/20 text-slate-300 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] mb-8">
            <span>Iglesia Metodista Pentecostal de Chile</span>
          </div>

          <h1 className="font-sans font-bold text-white mb-8 text-[clamp(2.5rem,6vw,4.5rem)] leading-tight tracking-tight">
            Pregonando con Poder<br />
            el Evangelio de Salvación
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-12 leading-relaxed max-w-[900px] font-light italic border-l-2 border-impch-primary/50 pl-6">
            Desde hace 15 años, la IMPCH Pulmahue mantiene viva la llama del avivamiento, anunciando la Palabra de Dios en cada hogar para la honra y gloria de nuestro Señor Jesucristo.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 sm:items-center justify-center">
            <a
              href="#noticias"
              onClick={(e) => {
                if (window.location.pathname !== '/') {
                  e.preventDefault();
                  navigate('/#noticias');
                }
              }}
              className="inline-flex items-center justify-center gap-3 px-8 py-3.5 text-sm font-semibold text-white bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors duration-300"
            >
              Últimas Noticias
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#departamentos"
              onClick={(e) => {
                if (window.location.pathname !== '/') {
                  e.preventDefault();
                  navigate('/#departamentos');
                }
              }}
              className="inline-flex items-center justify-center gap-3 px-8 py-3.5 text-sm font-semibold text-white bg-transparent border border-white/40 hover:bg-white/10 transition-colors duration-300"
            >
              Conócenos más
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
