import { ministerios } from '../../data/siteData';

function MinistryCard({ m, index }) {
  // Ahora: 
  // index 0 (even) -> Nombre IZQ, Imagen DER
  // index 1 (odd)  -> Imagen IZQ, Nombre DER
  const isEven = index % 2 === 0;

  return (
    <div className={`w-full flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-20 py-16 border-b border-slate-100 last:border-b-0`}>

      {/* Lado de la Información */}
      <div className="w-full md:w-1/2 flex flex-col justify-center animate-fadeInUp">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-10 h-[1px] bg-slate-300"></span>
          <span className="text-[11px] font-bold tracking-[0.3em] text-slate-400 uppercase">
            {m.subtitulo || 'Departamento'}
          </span>
        </div>

        <h3 className="font-serif font-bold text-4xl md:text-5xl text-slate-900 leading-tight mb-8">
          {m.titulo}
        </h3>

        <p className="text-lg text-slate-500 leading-relaxed mb-10 font-light">
          {m.descripcion}
        </p>

        <div className="flex flex-wrap gap-8 pt-8 border-t border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Líder a cargo</span>
            <span className="text-slate-800 font-semibold text-sm">{m.detalle.lider}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Reuniones</span>
            <span className="text-slate-800 font-semibold text-sm">{m.detalle.horario}</span>
          </div>
        </div>
      </div>

      {/* Lado de la Imagen */}
      <div className="w-full md:w-1/2 relative group">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-slate-900/5">
          <img
            src={m.imagen}
            alt={m.titulo}
            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
          />
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-slate-900/10 mix-blend-multiply transition-opacity group-hover:opacity-0" />
        </div>

        {/* Floating badge for members - only visible on hover or mobile */}
        <div className="absolute -bottom-4 -right-4 bg-white px-6 py-4 shadow-xl border border-slate-100 rounded-xl hidden sm:block transform group-hover:-translate-y-2 transition-transform duration-500">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Participantes</span>
          <span className="text-slate-900 font-serif font-bold text-lg">{m.detalle.miembros}</span>
        </div>
      </div>
    </div>
  );
}

export default function Ministries() {
  return (
    <section id="departamentos" className="py-32 bg-white">
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="text-center mb-24">
          <span className="text-xs font-bold tracking-[0.4em] text-blue-600 uppercase mb-5 block">
            Cuerpo Ministerial
          </span>
          <h2 className="font-serif font-bold text-slate-900 mb-8 text-4xl md:text-6xl tracking-tight leading-none">
            Áreas de Edificación
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto font-light">
            En IMPCH Pulmahue, cada departamento es una familia dedicada a servir con amor,
            perseverancia y fe.
          </p>
        </div>

        <div className="space-y-12">
          {ministerios.map((m, index) => (
            <MinistryCard key={m.titulo} m={m} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
