import React from 'react';
import { ministerios } from '../../data/siteData';
import MinistryCard from './MinistryCard';

export default function Ministries() {
  return (
    <section id="departamentos" className="py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Encabezado de la Sección */}
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

        {/* Listado de Departamentos usando el componente reutilizable */}
        <div className="flex flex-col gap-8">
          {ministerios.map((m, index) => (
            <MinistryCard key={m.titulo} m={m} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
