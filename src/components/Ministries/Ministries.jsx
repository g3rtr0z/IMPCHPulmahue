import { ministerios } from '../../data/siteData';

function MinistryCard({ m, index }) {
  const isEven = index % 2 === 0;

  return (
    <div className="w-full rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row">
      {/* Image Side */}
      <div className={`w-full md:w-2/5 relative min-h-[250px] ${isEven ? 'order-1 md:order-2' : 'order-1'}`}>
        <img
          src={m.imagen}
          alt={m.titulo}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none" />
        <div className="absolute bottom-6 left-6 text-white text-xs font-semibold tracking-widest uppercase">
          {m.detalle.miembros}
        </div>
      </div>

      {/* Content Side */}
      <div className={`w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center ${isEven ? 'order-2 md:order-1' : 'order-2'}`}>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-8 h-[1px] bg-slate-300"></span>
          <span className="text-[10px] font-semibold tracking-[0.2em] text-slate-400 uppercase">
            {m.subtitulo || 'Departamento'}
          </span>
        </div>

        <h3 className="font-sans font-bold text-2xl md:text-3xl text-slate-800 leading-tight mb-4">
          {m.titulo}
        </h3>

        <p className="text-base text-slate-600 leading-relaxed mb-8">
          {m.descripcion}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block mb-1">Líder</span>
            <span className="text-slate-800 font-medium text-sm">{m.detalle.lider}</span>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block mb-1">Horario Central</span>
            <span className="text-slate-800 font-medium text-sm">{m.detalle.horario}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Ministries() {
  return (
    <section id="departamentos" className="py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4 block">
            Áreas de Trabajo
          </span>
          <h2 className="font-sans font-bold text-slate-900 mb-6 text-3xl md:text-4xl tracking-tight leading-tight">
            Nuestros Departamentos
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto">
            Hay un lugar para ti y toda tu familia para servir y crecer juntos en la obra de Dios.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {ministerios.map((m, index) => (
            <MinistryCard key={m.titulo} m={m} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
