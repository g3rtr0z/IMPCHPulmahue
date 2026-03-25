import React from "react";
import { Users, FileUser, ShieldAlert, CalendarClock } from "lucide-react";

const stats = [
  {
    name: "Total Miembros",
    value: "452+",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    name: "Usuarios Activos",
    value: "12",
    icon: FileUser,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    name: "Roles Asignados",
    value: "4",
    icon: ShieldAlert,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    name: "Próximos Eventos",
    value: "3",
    icon: CalendarClock,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

export default function DashboardStats() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
          Bienvenido al Panel de Administración
        </h2>
        <p className="mt-2 text-slate-500">
          Un resumen general de las métricas principales de la iglesia IMPCH
          Pulmahue.
        </p>
      </div>

      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-2xl bg-white px-4 pt-5 pb-12 shadow-sm ring-1 ring-slate-200/50 sm:px-6 sm:pt-6 hover:shadow-md transition-shadow duration-300 group"
          >
            <dt>
              <div className={`absolute rounded-xl p-3 ${item.bg}`}>
                <item.icon
                  className={`h-6 w-6 ${item.color}`}
                  aria-hidden="true"
                />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-slate-500">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-3xl font-bold tracking-tight text-slate-900">
                {item.value}
              </p>
            </dd>
            <div className="absolute inset-x-0 bottom-0 bg-slate-50/50 px-4 py-3 sm:px-6 border-t border-slate-100 group-hover:bg-slate-50 transition-colors">
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-primary hover:text-primary-hover flex items-center gap-1 group-hover:underline"
                >
                  Ver todos los detalles
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </dl>

      {/* Placeholders for upcoming content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/50 p-6 min-h-[300px] flex items-center justify-center border-dashed border-2 border-slate-100">
          <div className="text-center">
            <p className="text-slate-400 font-medium">
              Gráfico de registro de miembros
            </p>
            <span className="text-xs text-slate-300">(Próximamente)</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/50 p-6 min-h-[300px] flex flex-col justify-between border-dashed border-2 border-slate-100">
          <div className="text-center h-full flex flex-col items-center justify-center">
            <p className="text-slate-400 font-medium">
              Actividad reciente del sistema
            </p>
            <span className="text-xs text-slate-300">(Próximamente)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
