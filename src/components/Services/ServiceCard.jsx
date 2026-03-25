import ServiceIcon from './ServiceIcon';

export default function ServiceCard({ dia, titulo, horario, icono }) {
  return (
    <div className="group flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-8 border-b border-slate-200 last:border-b-0 bg-white hover:bg-slate-50 transition-colors duration-300">
      <div className="flex items-center gap-6">
        <div className="w-14 h-14 rounded bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 border border-slate-200 group-hover:bg-slate-800 group-hover:text-white group-hover:border-slate-800 transition-colors duration-300">
          <ServiceIcon name={icono} />
        </div>
        <div>
          <h3 className="text-[10px] md:text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase mb-2">{dia}</h3>
          <p className="text-xl md:text-2xl font-bold text-slate-800 mb-0 transition-colors">{titulo}</p>
        </div>
      </div>
      <div className="mt-6 md:mt-0 md:ml-6 flex items-center gap-3 bg-white px-5 py-3 rounded border border-slate-200 group-hover:border-slate-300 transition-colors w-full md:w-auto">
        <div className="p-1.5 rounded-full bg-slate-50 shrink-0">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-slate-600 whitespace-nowrap">{horario}</span>
      </div>
    </div>
  );
}
