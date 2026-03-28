import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db, firebaseConfig } from "../../firebase";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { sendWelcomeEmail } from "../../utils/emailService";
import {
  Search,
  Plus,
  Edit2,
  MapPin,
  Phone,
  Mail,
  User,
  ShieldCheck,
  X,
  CheckCircle2,
} from "lucide-react";

export default function MembersManager() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [ministryOps, setMinistryOps] = useState([]);

  // Form state
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    direccion: "",
    ministerio: "",
    fechaIngreso: "",
    estado: "activo",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "miembros"), orderBy("nombre", "asc"));
      const snap = await getDocs(collection(db, "miembros")); // without index for now
      const list = [];
      snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));

      // Sort client-side if no index
      list.sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""));
      setMembers(list);
    } catch (err) {
      console.error("Error fetching members:", err);
      setError("Error al cargar los miembros.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMinistryOps = async () => {
    try {
      const q = query(
        collection(db, "ministerio_list"),
        orderBy("nombre", "asc"),
      );
      const snap = await getDocs(q);
      const list = [];
      snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
      setMinistryOps(list);
    } catch (err) {
      console.error("Error fetching ministries list:", err);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchMinistryOps();
  }, []);

  const handleOpenModal = (member = null) => {
    setError("");
    setSuccess("");
    if (member) {
      setEditingId(member.id);
      setFormData({
        nombre: member.nombre || "",
        telefono: member.telefono || "",
        email: member.email || "",
        direccion: member.direccion || "",
        ministerio: member.ministerio || "",
        fechaIngreso: member.fechaIngreso || "",
        estado: member.estado || "activo",
      });
    } else {
      setEditingId(null);
      setFormData({
        nombre: "",
        telefono: "",
        email: "",
        direccion: "",
        ministerio: "",
        fechaIngreso: new Date().toISOString().split("T")[0],
        estado: "activo",
      });
    }
    setShowModal(true);
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    setSuccess("");

    try {
      const memberRef = editingId
        ? doc(db, "miembros", editingId)
        : doc(collection(db, "miembros"));

      await setDoc(
        memberRef,
        {
          ...formData,
          updatedAt: serverTimestamp(),
          ...(editingId ? {} : { createdAt: serverTimestamp() }),
        },
        { merge: true },
      );

      setSuccess("Miembro guardado exitosamente.");
      setTimeout(() => {
        setShowModal(false);
        fetchMembers();
      }, 1000);
    } catch (err) {
      console.error("Error saving member:", err);
      setError("No se pudo guardar el miembro.");
    } finally {
      setFormLoading(false);
    }
  };

  const filteredMembers = members.filter(
    (m) =>
      (m.nombre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.ministerio || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-200/50 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
            <User className="w-6 h-6 text-primary" />
            Directorio congregacional
          </h2>
          <p className="text-slate-500 mt-1">
            Administra la base de datos de los miembros y asistentes.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-hover shadow-sm transition-all focus:ring-2 focus:ring-primary/50 flex items-center gap-2 hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Agregar miembro
        </button>
      </div>

      {/* Filter */}
      <div className="relative mb-6 max-w-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre, email o ministerio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full rounded-xl border-0 py-2.5 pl-10 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6 bg-slate-50"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto ring-1 ring-slate-200 rounded-2xl">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6"
                >
                  Nombre y Contacto
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                >
                  Ministerio
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                >
                  Fecha de Ingreso
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                >
                  Estado
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-right text-sm font-semibold text-slate-900 pr-6"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-500">
                    No se encontraron miembros registrados.
                  </td>
                </tr>
              )}
              {filteredMembers.map((m) => (
                <tr
                  key={m.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">
                        {m.nombre || "Sin Nombre"}
                      </span>
                      <span className="text-slate-500 text-sm flex items-center gap-1 mt-0.5">
                        {m.telefono && (
                          <>
                            <Phone className="w-3 h-3" /> {m.telefono}
                          </>
                        )}
                        {m.email && (
                          <>
                            <Mail className="w-3 h-3 ml-2" /> {m.email}
                          </>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-700">
                    {m.ministerio || "-"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                    {m.fechaIngreso
                      ? new Date(m.fechaIngreso).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                    {m.estado === "activo" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 ring-1 ring-inset ring-emerald-600/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-slate-700 bg-slate-100 ring-1 ring-inset ring-slate-600/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 text-right pr-6">
                    <button
                      onClick={() => handleOpenModal(m)}
                      className="text-primary hover:text-primary-hover hover:bg-blue-50 p-2 rounded-lg transition-colors inline-flex items-center justify-center font-medium"
                    >
                      <Edit2 className="w-4 h-4 mr-1.5" /> Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-6 md:p-8 shadow-2xl relative my-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-3">
              <User className="w-6 h-6 text-primary" />
              {editingId ? "Editar Miembro" : "Registrar Nuevo Miembro"}
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-xl border border-green-100 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> {success}
              </div>
            )}

            <form onSubmit={handleSaveMember} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-700">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-slate-50 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-700">
                    Ministerio / Cargo
                  </label>
                  <select
                    value={formData.ministerio}
                    onChange={(e) =>
                      setFormData({ ...formData, ministryId: e.target.value, ministerio: e.target.options[e.target.selectedIndex].text })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-slate-50 focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="">-- Sin Cargo Asignado --</option>
                    {ministryOps.map((op) => (
                      <option key={op.id} value={op.nombre}>
                        {op.nombre}
                      </option>
                    ))}
                    <option value="OTRO" className="font-bold text-primary italic">
                      + Gestionar Ministerios (Desde el Menú Lateral)
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-700">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) =>
                      setFormData({ ...formData, telefono: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-slate-50 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-700">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-slate-50 focus:bg-white transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1 text-slate-700">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) =>
                      setFormData({ ...formData, direccion: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-slate-50 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-700">
                    Fecha de Ingreso
                  </label>
                  <input
                    type="date"
                    value={formData.fechaIngreso}
                    onChange={(e) =>
                      setFormData({ ...formData, fechaIngreso: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-slate-50 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-700">
                    Estado
                  </label>
                  <select
                    value={formData.estado}
                    onChange={(e) =>
                      setFormData({ ...formData, estado: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-slate-50 focus:bg-white transition-all"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo / Retirado</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={formLoading}
                  className="flex-1 py-3 text-slate-600 font-semibold bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {formLoading ? "Guardando..." : "Guardar Información"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
