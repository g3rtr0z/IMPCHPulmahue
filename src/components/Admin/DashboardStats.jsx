import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { Users, UserCog, ShieldCheck, UserCheck } from "lucide-react";

export default function DashboardStats() {
  const [counts, setCounts] = useState({
    miembros: null,
    miembrosActivos: null,
    usuarios: null,
    roles: null,
  });

  useEffect(() => {
    // Real-time listener for miembros
    const unsubMiembros = onSnapshot(collection(db, "miembros"), (snap) => {
      const all = snap.docs.map((d) => d.data());
      setCounts((prev) => ({
        ...prev,
        miembros: snap.size,
        miembrosActivos: all.filter((m) => m.estado === "activo").length,
      }));
    });

    // Real-time listener for users (portal access)
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      setCounts((prev) => ({ ...prev, usuarios: snap.size }));
    });

    // Real-time listener for roles
    const unsubRoles = onSnapshot(collection(db, "roles"), (snap) => {
      setCounts((prev) => ({ ...prev, roles: snap.size }));
    });

    return () => {
      unsubMiembros();
      unsubUsers();
      unsubRoles();
    };
  }, []);

  const stats = [
    {
      name: "Total Miembros",
      value: counts.miembros,
      sub: `${counts.miembrosActivos ?? "—"} activos`,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      name: "Miembros Activos",
      value: counts.miembrosActivos,
      sub: "En comunión activa",
      icon: UserCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      name: "Usuarios del Portal",
      value: counts.usuarios,
      sub: "Con acceso al sistema",
      icon: UserCog,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
    {
      name: "Roles Configurados",
      value: counts.roles,
      sub: "Niveles de acceso",
      icon: ShieldCheck,
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-100",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
          Panel de Administración
        </h2>
        <p className="mt-2 text-slate-500">
          Resumen en tiempo real de las métricas de IMPCH Pulmahue.
        </p>
      </div>

      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className={`relative overflow-hidden rounded-2xl bg-white px-5 py-6 shadow-sm ring-1 ring-slate-200/50 border-t-2 ${item.border} hover:shadow-md transition-shadow duration-300`}
          >
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm font-semibold text-slate-500">{item.name}</p>
              <div className={`p-2 rounded-xl ${item.bg}`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
            </div>
            <p className="text-4xl font-bold tracking-tight text-slate-900">
              {item.value === null ? (
                <span className="inline-block w-12 h-9 bg-slate-100 rounded animate-pulse" />
              ) : (
                item.value
              )}
            </p>
            <p className="mt-1 text-xs text-slate-400 font-medium">{item.sub}</p>
          </div>
        ))}
      </dl>

      {/* Members table preview */}
      <MembersPreview />
    </div>
  );
}

function MembersPreview() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "miembros"), (snap) => {
      const list = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""))
        .slice(0, 5);
      setMembers(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/50 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900">Últimos Miembros Registrados</h3>
          <p className="text-xs text-slate-400 mt-0.5">Actualizado en tiempo real desde el Portal Pastor</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          En vivo
        </span>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-6 h-6 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : members.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">
          Aún no hay miembros registrados. El Pastor puede agregar desde su portal.
        </div>
      ) : (
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th className="py-3 pl-6 pr-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nombre</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Ministerio</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Ingreso</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 bg-white">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 pl-6 pr-3 text-sm font-semibold text-slate-900">
                  {m.nombre || "—"}
                  {m.email && <p className="text-xs text-slate-400 font-normal">{m.email}</p>}
                </td>
                <td className="px-3 py-3.5 text-sm text-slate-500">{m.ministerio || "—"}</td>
                <td className="px-3 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${m.estado === "activo"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${m.estado === "activo" ? "bg-emerald-500" : "bg-slate-400"}`} />
                    {m.estado === "activo" ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-3 py-3.5 text-sm text-slate-400">
                  {m.fechaIngreso ? new Date(m.fechaIngreso + "T12:00:00").toLocaleDateString("es-CL") : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
