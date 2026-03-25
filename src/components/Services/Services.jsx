import { servicios } from '../../data/siteData';
import ServiceCard from './ServiceCard';

export default function Services() {
  return (
    <section id="servicios" className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
      {/* Subtle border top separator */}
      <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <span className="text-sm font-bold tracking-[0.2em] text-primary uppercase mb-4 block">Nuestras Reuniones</span>
            <h2 className="font-serif font-bold text-slate-900 mb-4 text-[clamp(2.5rem,4vw,3.5rem)] leading-tight">
              Acompáñanos esta Semana
            </h2>
            <p className="text-slate-500 text-lg md:text-xl leading-relaxed mb-0">
              Únete a nosotros en oración, alabanza y estudio bíblico. Contamos con horarios diseñados para integrar a toda la familia.
            </p>
          </div>

          <a
            href="#calendario"
            className="hidden md:inline-flex items-center gap-3 bg-white ring-1 ring-slate-200 text-sm font-bold text-slate-700 hover:text-primary hover:ring-primary/50 transition-all rounded-full px-6 py-3 shadow-sm hover:shadow-card group"
          >
            Ver Calendario
            <svg className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        <div className="flex flex-col gap-5 relative">
          <div className="absolute left-10 md:left-14 top-10 bottom-10 w-px bg-blue-100 hidden md:block -z-10"></div>

          {servicios.map((s) => (
            <ServiceCard
              key={s.dia}
              dia={s.dia}
              titulo={s.titulo}
              horario={s.horario}
              icono={s.icono}
            />
          ))}
        </div>

        {/* Mobile button below the list */}
        <div className="mt-10 md:hidden flex justify-center">
          <a
            href="#calendario"
            className="inline-flex items-center gap-3 bg-white ring-1 ring-slate-200 text-sm font-bold text-slate-700 hover:text-primary transition-all rounded-full px-8 py-4 shadow-sm group w-full justify-center"
          >
            Ver Calendario Completo
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
