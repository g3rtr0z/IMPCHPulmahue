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
    <section id="servicios" className="py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-[1400px] mx-auto px-8">
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

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {schedules.length > 0 ? (
              schedules.map((s, idx) => (
                <div key={idx} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-1">{s.dia}</h3>
                      <h4 className="text-xl md:text-2xl font-sans font-bold text-slate-900 group-hover:text-primary transition-colors tracking-tight">
                        {s.servicio}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-slate-50 px-6 py-4 rounded-xl border border-slate-100 group-hover:bg-primary/5 transition-all">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-xl font-sans font-bold text-slate-900 tracking-tight">{s.hora}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
                <p className="text-slate-400">No hay horarios publicados por el momento.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

