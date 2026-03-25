import ServiceIcon from './ServiceIcon';

export default function ServiceCard({ dia, titulo, horario, icono }) {
  return (
    <div className="group flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-8 bg-white rounded-3xl ring-1 ring-slate-200 hover:ring-primary/50 hover:shadow-card transition-all duration-300">
      <div className="flex items-center gap-6 md:gap-8">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-blue-50/50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:shadow-lg transition-all duration-300 shrink-0">
          <ServiceIcon name={icono} />
        </div>
        <div>
          <h3 className="text-xs md:text-sm font-bold tracking-[0.2em] text-primary uppercase mb-2 md:mb-1">{dia}</h3>
          <p className="text-xl md:text-3xl font-serif font-bold text-slate-800 mb-0 group-hover:text-slate-900 transition-colors">{titulo}</p>
        </div>
      </div>
      <div className="mt-6 md:mt-0 md:ml-6 flex items-center gap-3 bg-slate-50 px-6 py-4 rounded-2xl ring-1 ring-slate-200/60 group-hover:bg-blue-50 group-hover:ring-blue-100 transition-colors w-full md:w-auto overflow-hidden">
        <div className="p-1 rounded-full bg-white shadow-sm shrink-0">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="font-semibold text-slate-700 whitespace-nowrap">{horario}</span>
      </div>
    </div>
  );
}
