import React, { useState } from 'react';
import { ministerios } from '../../data/siteData';

function MinistryCard({ m, index }) {
  const [showInfo, setShowInfo] = useState(false);
  const isEven = index % 2 === 0;

  // Lógica de posición alternada (Zig-Zag)
  // Si es par: Empieza Imagen Izq (0) / Contenido Der (66.6%)
  // Si es impar: Empieza Imagen Der (150%) / Contenido Izq (0)
  const imagePos = isEven
    ? (showInfo ? 'md:translate-x-[150%]' : 'md:translate-x-0')
    : (showInfo ? 'md:translate-x-0' : 'md:translate-x-[150%]');

  const contentPos = isEven
    ? (showInfo ? 'md:translate-x-0' : 'md:translate-x-[66.6%]')
    : (showInfo ? 'md:translate-x-[66.6%]' : 'md:translate-x-0');

  return (
    <div className="w-full min-h-[500px] md:h-[480px] rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col md:block">

      {/* Contenedor de Imagen con Deslizamiento */}
      <div
        className={`w-full md:w-2/5 h-[300px] md:h-full transition-all duration-700 ease-in-out md:absolute top-0 bottom-0 z-20 ${imagePos}`}
      >
        <img
          src={m.imagen}
          alt={m.titulo}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-8 left-8 text-white text-[10px] font-bold tracking-[0.3em] uppercase">
          {m.detalle.miembros}
        </div>
      </div>

      {/* Contenedor de Contenido con Deslizamiento */}
      <div
        className={`w-full md:w-3/5 h-full p-10 md:p-16 flex flex-col justify-center transition-all duration-700 ease-in-out md:absolute top-0 bottom-0 ${contentPos}`}
      >
        <div className="flex items-center gap-2 mb-6">
          <span className="w-8 h-[1px] bg-slate-200"></span>
          <span className="text-[10px] font-semibold tracking-[0.2em] text-slate-400 uppercase">
            {m.subtitulo || 'Departamento'}
          </span>
        </div>

        <h3 className="font-sans font-bold text-3xl text-slate-900 leading-tight mb-6">
          {m.titulo}
        </h3>

        <div className={`transition-all duration-500 ${showInfo ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none absolute'}`}>
          <p className="text-slate-600 leading-relaxed mb-8 text-base">
            {m.descripcion}
          </p>

          <div className="grid grid-cols-2 gap-8 border-t border-slate-100 pt-8">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Responsable</span>
              <span className="text-slate-900 font-medium text-sm">{m.detalle.lider || m.detalle.encargado}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Reunión</span>
              <span className="text-slate-900 font-medium text-sm">{m.detalle.horario}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowInfo(!showInfo)}
          className="mt-8 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-900 hover:text-slate-500 transition-colors border-b-2 border-slate-900 pb-1 w-fit"
        >
          {showInfo ? 'Cerrar Detalles' : 'Ver Información'}
        </button>
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
