import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { Clock, Calendar } from 'lucide-react';

export default function Services() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'config', 'schedules'), (snap) => {
      if (snap.exists()) {
        setSchedules(snap.data().items || []);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section id="servicios" className="py-24 bg-white border-b border-slate-100">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="text-center mb-16 md:mb-24">
          <span className="text-[10px] font-black tracking-[0.3em] text-impch-primary/40 uppercase mb-4 block">
            Nuestros Encuentros
          </span>
          <h2 className="font-serif font-bold text-slate-900 mb-6 text-4xl md:text-5xl lg:text-6xl tracking-tight">
            Horarios de Iglesia
          </h2>
          <div className="w-16 h-1 bg-impch-primary mx-auto rounded-full mb-8"></div>
          <p className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-4xl mx-auto font-medium">
            Le esperamos con los brazos abiertos en cada uno de nuestros servicios regulares.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-impch-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="w-full">
            {schedules.length > 0 ? (
              <div className="grid gap-4 md:gap-6">
                {schedules.map((s, idx) => (
                  <div 
                    key={idx} 
                    className="relative group bg-slate-50/50 hover:bg-white rounded-3xl md:rounded-full border border-transparent hover:border-slate-200 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(30,58,95,0.06)] overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row md:items-center">
                      {/* Día: Cápsula (adaptada a móvil) */}
                      <div className="bg-impch-primary md:bg-impch-primary text-white py-3 md:py-8 md:min-w-[180px] flex items-center justify-center">
                        <span className="text-xs md:text-base font-black uppercase tracking-[0.3em] font-sans">
                          {s.dia}
                        </span>
                      </div>
                      
                      {/* Contenido Central: Alargado */}
                      <div className="flex-grow px-6 py-4 md:px-10 md:py-0 flex flex-row items-center justify-between gap-4">
                        <div className="flex flex-col">
                          <h4 className="text-base md:text-2xl font-bold text-slate-900 group-hover:text-impch-primary transition-colors duration-300 leading-tight">
                            {s.servicio}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Servicio Institucional</span>
                        </div>

                        {/* Hora: Acomodada para ambos */}
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 hidden md:block">Comienza a las</span>
                            <div className="flex items-center gap-3 text-impch-primary bg-white md:bg-transparent px-4 py-2 md:px-0 md:py-0 rounded-xl border border-slate-100 md:border-0 shadow-sm md:shadow-none">
                              <Clock className="w-5 h-5 opacity-40 md:w-4 md:h-4" />
                              <span className="text-xl md:text-2xl font-black tracking-tighter">{s.hora}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full py-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem] bg-slate-50/50">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Sin horarios disponibles</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-20 text-center">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest opacity-60">
                Puertas abiertas para toda la comunidad
            </p>
        </div>
      </div>
    </section>

  );
}

