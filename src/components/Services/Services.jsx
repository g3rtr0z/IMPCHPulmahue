import { servicios } from '../../data/siteData';
import ServiceCard from './ServiceCard';

export default function Services() {
  return (
    <section id="servicios" className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4 block">
            Nuestras Reuniones
          </span>
          <h2 className="font-sans font-bold text-slate-900 mb-6 text-3xl md:text-4xl tracking-tight">
            Acompáñanos esta semana
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto">
            Únete a nosotros en oración, alabanza y estudio bíblico. Contamos con horarios diseñados para integrar a toda la familia.
          </p>
        </div>

        <div className="flex flex-col border border-slate-200">
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
      </div>
    </section>
  );
}

