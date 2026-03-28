import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Users, HandHeart, CheckCircle, CalendarDays } from "lucide-react";

export default function PastorDashboardStats() {
  const [stats, setStats] = useState([
    {
      title: "Total de Miembros",
      val: "...",
      c: "text-blue-600",
      bg: "bg-blue-50",
      icon: Users,
    },
    {
      title: "Peticiones Pendientes",
      val: "...",
      c: "text-amber-600",
      bg: "bg-amber-50",
      icon: HandHeart,
    },
    {
      title: "Oraciones Respondidas",
      val: "...",
      c: "text-emerald-600",
      bg: "bg-emerald-50",
      icon: CheckCircle,
    },
    {
      title: "Nuevos (Menos de 30 días)",
      val: "...",
      c: "text-rose-600",
      bg: "bg-rose-50",
      icon: CalendarDays,
    },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch members
        const membersSnap = await getDocs(collection(db, "miembros"));
        const membersCount = membersSnap.size;

        let repCount = 0;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        membersSnap.forEach((doc) => {
          const data = doc.data();
          if (data.fechaIngreso) {
            const joined = new Date(data.fechaIngreso);
            if (joined >= thirtyDaysAgo) {
              repCount++;
            }
          }
        });

        // Fetch requests
        const requestsSnap = await getDocs(
          collection(db, "peticiones_oracion"),
        );
        let pendingCount = 0;
        let answeredCount = 0;

        requestsSnap.forEach((doc) => {
          const data = doc.data();
          if (data.estado === "pendiente" || !data.estado) pendingCount++;
          if (data.estado === "respondida") answeredCount++;
        });

        setStats([
          {
            title: "Total Miembros",
            val: membersCount.toString(),
            c: "text-blue-600",
            bg: "bg-blue-50",
            icon: Users,
          },
          {
            title: "Peticiones Pendientes",
            val: pendingCount.toString(),
            c: "text-amber-600",
            bg: "bg-amber-50",
            icon: HandHeart,
          },
          {
            title: "Peticiones Respondidas",
            val: answeredCount.toString(),
            c: "text-emerald-600",
            bg: "bg-emerald-50",
            icon: CheckCircle,
          },
          {
            title: "Nuevos Registros (Mes)",
            val: repCount.toString(),
            c: "text-rose-600",
            bg: "bg-rose-50",
            icon: CalendarDays,
          },
        ]);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
          Bendiciones, Pastor
        </h2>
        <p className="mt-2 text-slate-500">
          Aquí tiene un resumen de las actividades congregacionales actuales.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-slate-200/50 relative overflow-hidden group hover:shadow-md transition-shadow flex items-center justify-between"
          >
            <div className={`absolute top-0 left-0 w-1 h-full ${s.bg}`}></div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-2 truncate pr-2">
                {s.title}
              </p>
              <p className={`text-4xl font-bold ${s.c}`}>{s.val}</p>
            </div>
            <div className={`p-4 rounded-xl ${s.bg}`}>
              <s.icon className={`w-8 h-8 ${s.c} opacity-80`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/50 p-8 border-dashed border-2 border-slate-100 flex flex-col items-center justify-center min-h-[300px] text-center">
          <h3 className="text-lg font-bold text-slate-700">
            Métricas Semanales
          </h3>
          <p className="text-slate-500 mt-2">
            Próximamente podrá visualizar gráficos de asistencia.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/50 p-8 border-dashed border-2 border-slate-100 flex flex-col items-center justify-center min-h-[300px] text-center">
          <h3 className="text-lg font-bold text-slate-700">
            Crecimiento Ministerial
          </h3>
          <p className="text-slate-500 mt-2">
            En proceso de integración con la base de datos de actividades.
          </p>
        </div>
      </div>
    </div>
  );
}
