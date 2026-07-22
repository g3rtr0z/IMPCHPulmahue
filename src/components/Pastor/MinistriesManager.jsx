import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../../firebase";
import { 
  Briefcase, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Search
} from "lucide-react";

export default function MinistriesManager() {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form state
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchMinistries = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "ministerio_list"), orderBy("nombre", "asc"));
      const snap = await getDocs(q);
      const list = [];
      snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
      setMinistries(list);
    } catch (err) {
      console.error("Error fetching ministries:", err);
      setError("Error al cargar la lista de ministerios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMinistries();
  }, []);

  const handleOpenModal = (min = null) => {
    setError("");
    setSuccess("");
    if (min) {
      setEditingId(min.id);
      setFormData({
        nombre: min.nombre || "",
        descripcion: min.descripcion || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        nombre: "",
        descripcion: "",
      });
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;
    
    setFormLoading(true);
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        await updateDoc(doc(db, "ministerio_list", editingId), {
          ...formData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "ministerio_list"), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      setSuccess("Ministerio guardado correctamente.");
      setTimeout(() => {
        setShowModal(false);
        fetchMinistries();
      }, 1000);
    } catch (err) {
      console.error("Error saving ministry:", err);
      setError("No se pudo guardar la información.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este ministerio? Esto no afectará a los miembros ya registrados con este cargo, pero ya no aparecerá en la lista.")) return;
    
    try {
      await deleteDoc(doc(db, "ministerio_list", id));
      fetchMinistries();
    } catch (err) {
      console.error("Error deleting:", err);
      setError("Error al eliminar el registro.");
    }
  };

  const filtered = ministries.filter(m => 
    m.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-200/50 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" />
            Gestión de Ministerios y Cargos
          </h2>
          <p className="text-slate-500 mt-1">
            Administra la lista oficial de cargos que se pueden asignar a los miembros.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-hover shadow-sm transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Ministerio
        </button>
      </div>

      <div className="relative mb-6 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar ministerio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full rounded-xl border-0 py-2.5 pl-10 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-primary bg-slate-50"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
              No hay ministerios registrados aún.
            </div>
          )}
          {filtered.map((m) => (
            <div 
              key={m.id} 
              className="p-5 rounded-2xl border border-slate-200 hover:border-primary/30 hover:shadow-md transition-all group relative bg-slate-50/30"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleOpenModal(m)}
                    className="p-1.5 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-colors shadow-none hover:shadow-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(m.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors shadow-none hover:shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{m.nombre}</h3>
              <p className="text-sm text-slate-500 line-clamp-2">{m.descripcion || "Sin descripción"}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-primary" />
              {editingId ? "Editar Ministerio" : "Nuevo Ministerio / Cargo"}
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" /> {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-xl border border-green-100 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> {success}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Nombre del Cargo *</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Ej. Diácono, Corista, Secretario..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Descripción (Opcional)</label>
                <textarea
                  rows="3"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  placeholder="Indica las responsabilidades de este cargo..."
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 text-slate-600 font-semibold bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover shadow-sm transition-all"
                >
                  {formLoading ? "Guardando..." : "Guardar Ministerio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
