import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { Search, Filter, UserPlus, Phone, Mail, CheckCircle, Trash2, Clock, CheckCircle2 } from "lucide-react";

export default function PrayerRequestsManager() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, "solicitudes_contacto"));
      const list = [];
      snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));

      list.sort((a, b) => {
        const dateA = a.createdAt?.toMillis() || 0;
        const dateB = b.createdAt?.toMillis() || 0;
        return dateB - dateA;
      });
      setRequests(list);
    } catch (err) {
      console.error("Error fetching contact requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await setDoc(doc(db, "solicitudes_contacto", id), { estado: newStatus, updatedAt: serverTimestamp() }, { merge: true });
      setRequests(requests.map((r) => (r.id === id ? { ...r, estado: newStatus } : r)));
    } catch (err) {
      console.error("Error updating status:", err);
      alert("No se pudo actualizar el estado.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este contacto?")) return;
    try {
      await deleteDoc(doc(db, "solicitudes_contacto", id));
      setRequests(requests.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Error deleting contact request:", err);
      alert("Error al eliminar.");
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "pendiente": return "bg-amber-50 text-amber-700 ring-amber-600/20";
      case "contactado": return "bg-blue-50 text-blue-700 ring-blue-600/20";
      case "unido": return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
      default: return "bg-slate-50 text-slate-700 ring-slate-600/20";
    }
  };

  const StatusIcon = ({ status }) => {
    switch (status) {
      case "pendiente": return <Clock className="w-3.5 h-3.5" />;
      case "contactado": return <Phone className="w-3.5 h-3.5" />;
      case "unido": return <CheckCircle2 className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  const filteredRequests = requests.filter((r) => {
    const matchesSearch = (r.nombre || "").toLowerCase().includes(searchTerm.toLowerCase()) || (r.mensaje || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-200/50 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-primary" />
            Nuevos Contactos e Interesados
          </h2>
          <p className="text-slate-500 mt-1">
            Revisa y gestiona las personas que desean ser parte de la iglesia.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o mensaje..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-xl border-0 py-2.5 pl-10 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6 bg-slate-50"
          />
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button onClick={() => setStatusFilter("all")} className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${statusFilter === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Todas</button>
          <button onClick={() => setStatusFilter("pendiente")} className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${statusFilter === "pendiente" ? "bg-white text-amber-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Pendientes</button>
          <button onClick={() => setStatusFilter("contactado")} className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${statusFilter === "contactado" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Contactados</button>
          <button onClick={() => setStatusFilter("unido")} className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${statusFilter === "unido" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Unidos</button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl">
              No se encontraron solicitudes.
            </div>
          )}
          {filteredRequests.map((req) => (
            <div key={req.id} className="relative flex flex-col bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusStyles(req.estado || "pendiente")}`}>
                  <StatusIcon status={req.estado || "pendiente"} /> <span className="capitalize">{req.estado || "pendiente"}</span>
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                  {req.createdAt ? new Date(req.createdAt.toMillis()).toLocaleDateString() : "Reciente"}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{req.nombre}</h3>

              <div className="flex flex-col gap-2 mb-4 text-sm text-slate-600">
                {req.telefono && (
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /> <a href={`tel:${req.telefono}`} className="hover:text-primary hover:underline">{req.telefono}</a></div>
                )}
                {req.email && (
                  <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /> <a href={`mailto:${req.email}`} className="hover:text-primary hover:underline">{req.email}</a></div>
                )}
              </div>

              {req.mensaje && (
                <div className="flex-1 bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                  <p className="text-sm text-slate-700 italic leading-relaxed">"{req.mensaje}"</p>
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {(req.estado === "pendiente" || !req.estado) && (
                    <button onClick={() => handleUpdateStatus(req.id, "contactado")} className="text-[11px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                      Contactar
                    </button>
                  )}
                  {req.estado !== "unido" && (
                    <button onClick={() => handleUpdateStatus(req.id, "unido")} className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Se Integró
                    </button>
                  )}
                </div>
                <button onClick={() => handleDelete(req.id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className={`absolute top-0 left-0 w-full h-1 ${req.estado === "unido" ? "bg-emerald-500" : req.estado === "contactado" ? "bg-blue-500" : "bg-amber-400"}`}></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
