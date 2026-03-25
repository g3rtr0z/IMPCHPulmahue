import { useNavigate } from 'react-router-dom';
import { ArrowRight, Info } from 'lucide-react';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section id="inicio" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 hero-bg-image bg-cover bg-center"
        aria-hidden="true"
      />
      {/* Modern gradient overlay for better contrast and depth */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/40"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-[1200px] px-6 py-20 flex flex-col justify-center min-h-[80vh]">
        <div className="max-w-[700px] animate-fadeInUp">

          <h1 className="font-serif font-extrabold text-white leading-tight mb-6 text-[clamp(2.5rem,6vw,4.5rem)] tracking-tight">
            Descubre tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary italic font-serif pr-2">propósito</span><br />en nuestra comunidad
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-12 leading-relaxed font-light max-w-[600px]">
            Un lugar para encontrar esperanza, restauración y el amor incondicional de Dios en el corazón de Pulmahue.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <a
              href="#noticias"
              onClick={(e) => {
                if (window.location.pathname !== '/') {
                  e.preventDefault();
                  navigate('/#noticias');
                }
              }}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 font-bold text-base rounded-full border-0 no-underline text-white bg-primary transition-all hover:bg-primary-hover hover:scale-105 hover:shadow-xl hover:shadow-primary/30 group shadow-lg"
            >
              Últimas Noticias
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#departamentos"
              onClick={(e) => {
                if (window.location.pathname !== '/') {
                  e.preventDefault();
                  navigate('/#departamentos');
                }
              }}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 font-bold text-base rounded-full border border-white/30 no-underline text-white bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/50 group"
            >
              <Info className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
              Conócenos más
            </a>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 p-8 hidden lg:flex flex-col gap-6 pointer-events-none opacity-40">
          <div className="w-64 h-64 rounded-full border border-white/20 absolute -right-20 -top-20"></div>
          <div className="w-96 h-96 rounded-full border border-white/10 absolute -right-10 -bottom-10"></div>
        </div>
      </div>
    </section>
  );
}
