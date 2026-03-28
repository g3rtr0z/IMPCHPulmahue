import React, { useState } from 'react';

/**
 * Componente reutilizable para cada departamento/ministerio
 * Incluye efecto de deslizamiento interactivo para escritorio.
 */
function MinistryCard({ m, index }) {
    const [showInfo, setShowInfo] = useState(false);
    const isEven = index % 2 === 0;

    // Lógica de posición alternada para escritorio (md:)
    const imagePos = isEven
        ? (showInfo ? 'md:translate-x-[150%]' : 'md:translate-x-0')
        : (showInfo ? 'md:translate-x-0' : 'md:translate-x-[150%]');

    const contentPos = isEven
        ? (showInfo ? 'md:translate-x-0' : 'md:translate-x-[66.6%]')
        : (showInfo ? 'md:translate-x-[66.6%]' : 'md:translate-x-0');

    return (
        <div className="w-full h-auto md:h-[480px] rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col md:block group">

            {/* Contenedor de Imagen */}
            <div
                className={`w-full md:w-2/5 h-[320px] md:h-full transition-all duration-700 ease-in-out relative md:absolute top-0 bottom-0 z-10 ${imagePos}`}
            >
                <img
                    src={m.imagen}
                    alt={m.titulo}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 text-white text-[9px] font-bold tracking-[0.2em] uppercase leading-relaxed">
                    {m.detalle.miembros}
                </div>
            </div>

            {/* Contenedor de Contenido */}
            <div
                className={`w-full md:w-3/5 h-auto md:h-full p-8 md:p-16 flex flex-col justify-center transition-all duration-700 ease-in-out relative md:absolute top-0 bottom-0 z-20 bg-white ${contentPos}`}
            >
                <div className="flex items-center gap-2 mb-4">
                    <span className="w-8 h-[1px] bg-slate-200"></span>
                    <span className="text-[10px] font-semibold tracking-[0.2em] text-slate-400 uppercase">
                        {m.subtitulo || 'Departamento'}
                    </span>
                </div>

                <h3 className="font-sans font-bold text-2xl md:text-3xl text-slate-900 leading-tight mb-4 md:mb-6">
                    {m.titulo}
                </h3>

                {/* Info Detallada: Con transición de altura */}
                <div className={`transition-all duration-500 overflow-hidden ${showInfo ? 'max-h-[600px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                    <p className="text-slate-600 leading-relaxed mb-8 text-sm md:text-base">
                        {m.descripcion}
                    </p>

                    <div className="grid grid-cols-2 gap-6 border-t border-slate-100 pt-6 mb-4">
                        <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Responsable</span>
                            <span className="text-slate-900 font-medium text-xs md:text-sm">{m.detalle.lider || m.detalle.encargado}</span>
                        </div>
                        <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Reunión</span>
                            <span className="text-slate-900 font-medium text-xs md:text-sm">{m.detalle.horario}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setShowInfo(!showInfo)}
                    className="mt-6 text-[10px] font-extrabold uppercase tracking-[0.3em] text-slate-900 hover:text-impch-primary transition-all flex items-center gap-2 group/btn cursor-pointer relative z-30"
                >
                    {showInfo ? 'Cerrar Detalles' : 'Ver Información'}
                    <div className="w-4 h-[1px] bg-slate-200 group-hover/btn:bg-impch-primary transition-colors" />
                </button>
            </div>
        </div>
    );
}

export default MinistryCard;
