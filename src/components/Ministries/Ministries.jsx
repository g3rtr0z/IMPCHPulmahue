import { useState } from 'react';
import { ministerios } from '../../data/siteData';

function MinistryCard({ m, index }) {
  const [expanded, setExpanded] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-md ring-1 ring-slate-900/5 relative" style={{ minHeight: '280px' }}>
      {/* Sliding track: two full slides side by side */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: expanded ? 'translateX(-50%)' : 'translateX(0)', width: '200%' }}
      >

        {/* === SLIDE 1: Normal view === */}
        <div className={`w-1/2 flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} h-full min-h-[280px]`}>
          {/* Image */}
          <div className="w-full md:w-2/5 relative overflow-hidden min-h-[180px] md:min-h-0">
            <img
              src={m.imagen}
              alt={m.titulo}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>

          {/* Text */}
          <div className="w-full md:w-3/5 bg-white flex flex-col justify-center px-7 py-8 space-y-3">
            <div className="w-10 h-1 bg-primary/30 rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-primary rounded-full" />
            </div>
            <h3 className="font-serif font-bold text-2xl text-slate-900 leading-tight">
              {m.titulo}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {m.descripcion}
            </p>
            <button
              onClick={() => setExpanded(true)}
              className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:gap-4 transition-all bg-transparent border-0 p-0 w-fit mt-1"
            >
              Saber más
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* === SLIDE 2: Detail view === */}
        <div className="w-1/2 flex flex-col md:flex-row h-full min-h-[280px]">
          {/* Blurred image */}
          <div className="hidden md:block w-1/3 relative overflow-hidden">
            <img
              src={m.imagen}
              alt={m.titulo}
              className="absolute inset-0 w-full h-full object-cover scale-110"
              style={{ filter: 'blur(4px) brightness(0.65)' }}
            />
            <div className="absolute inset-0 bg-primary/30 mix-blend-multiply" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center">
              <span className="text-white font-serif font-bold text-xl drop-shadow-lg leading-snug">{m.titulo}</span>
              <span className="text-white/80 text-xs mt-1 font-medium">{m.detalle.miembros}</span>
            </div>
          </div>

          {/* Info panel */}
          <div className="w-full md:w-2/3 bg-slate-50 flex flex-col justify-center px-7 py-8 space-y-4">
            <button
              onClick={() => setExpanded(false)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-primary transition-colors bg-transparent border-0 p-0 w-fit"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Volver
            </button>

            <h4 className="font-serif font-bold text-xl text-slate-900">{m.titulo}</h4>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Líder', value: m.detalle.lider },
                { label: 'Horario', value: m.detalle.horario },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                  <span className="text-[9px] font-bold text-primary uppercase tracking-widest block mb-0.5">{label}</span>
                  <span className="text-slate-700 font-semibold text-xs leading-snug">{value}</span>
                </div>
              ))}
            </div>

            <div>
              <span className="text-[9px] font-bold text-primary uppercase tracking-widest block mb-2">Actividades</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {m.detalle.actividades.map((act) => (
                  <li key={act} className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {act}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function Ministries() {
  return (
    <section id="departamentos" className="py-16 bg-slate-50 overflow-hidden relative border-t border-slate-200">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3 block">Áreas de Trabajo</span>
          <h2 className="font-serif font-bold text-slate-900 mb-4 text-[clamp(2rem,3.5vw,2.8rem)] leading-tight">
            Nuestros Departamentos
          </h2>
          <p className="text-slate-500 text-base leading-relaxed">
            Hay un lugar para ti y toda tu familia para servir y crecer juntos.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {ministerios.map((m, index) => (
            <MinistryCard key={m.titulo} m={m} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
