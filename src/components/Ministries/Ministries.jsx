import { useState } from 'react';
import { ministerios } from '../../data/siteData';
import { ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';

export default function Ministries() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const m = ministerios[currentIndex];
  const isAlt = currentIndex % 2 !== 0; // Alternates layout based on index

  const next = () => setCurrentIndex((prev) => (prev + 1) % ministerios.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + ministerios.length) % ministerios.length);

  return (
    <section id="departamentos" className="py-24 bg-white border-b border-slate-200 overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-6">

        {/* Header Section */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-12 h-[1px] bg-slate-200"></span>
            <span className="text-xs font-bold tracking-[0.3em] text-slate-400 uppercase">
              Descubriendo el servicio
            </span>
          </div>
          <h2 className="font-sans font-bold text-slate-900 text-4xl md:text-5xl tracking-tight leading-tight">
            Nuestros Departamentos
          </h2>
        </div>

        {/* Interactive Slider Area */}
        <div className="relative">
          <div className={`flex flex-col md:flex-row items-stretch min-h-[500px] bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden transition-all duration-500 ease-in-out`}>

            {/* Content Side */}
            <div className={`w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center ${isAlt ? 'md:order-2' : 'md:order-1'}`}>
              <div className="mb-8">
                <span className="inline-block px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
                  {m.subtitulo || 'Institución'}
                </span>
                <h3 className="font-sans font-bold text-3xl md:text-5xl text-slate-900 mb-6 tracking-tight">
                  {m.titulo}
                </h3>
                <p className="text-slate-500 text-lg leading-relaxed mb-10">
                  {m.descripcion}
                </p>
              </div>

              {/* Detail list instead of simple grid */}
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-1 h-1 bg-slate-300 rounded-full" />
                  <p className="text-sm font-medium text-slate-600">
                    <span className="text-slate-400 font-normal mr-2 uppercase tracking-tighter text-[10px]">LIDERAZGO:</span>
                    {m.detalle.lider}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-1 h-1 bg-slate-300 rounded-full" />
                  <p className="text-sm font-medium text-slate-600">
                    <span className="text-slate-400 font-normal mr-2 uppercase tracking-tighter text-[10px]">HORARIO:</span>
                    {m.detalle.horario}
                  </p>
                </div>
              </div>

              {/* Navigation button */}
              <button
                onClick={next}
                className="group inline-flex items-center gap-4 text-slate-900 font-bold text-sm tracking-wide uppercase hover:text-slate-600 transition-all"
              >
                Siguiente Departamento
                <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-white group-hover:shadow-lg transition-all">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            </div>

            {/* Image Side */}
            <div className={`w-full md:w-1/2 relative bg-slate-200 ${isAlt ? 'md:order-1' : 'md:order-2'}`}>
              <img
                src={m.imagen}
                alt={m.titulo}
                className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />

              {/* Floating index indicator */}
              <div className={`absolute bottom-10 ${isAlt ? 'left-10' : 'right-10'} bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl`}>
                <span className="text-white text-xs font-bold font-serif opacity-80 uppercase tracking-widest block mb-1">
                  Sección
                </span>
                <span className="text-white text-3xl font-bold font-serif leading-none">
                  0{currentIndex + 1}
                </span>
                <span className="text-white/40 text-xl font-bold font-serif leading-none mx-2">/</span>
                <span className="text-white/40 text-sm font-bold font-serif leading-none">
                  0{ministerios.length}
                </span>
              </div>
            </div>

          </div>

          {/* Quick nav dots */}
          <div className="mt-8 flex items-center justify-center gap-3">
            {ministerios.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-slate-900' : 'w-2 bg-slate-200 hover:bg-slate-300'
                  } rounded-full`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
