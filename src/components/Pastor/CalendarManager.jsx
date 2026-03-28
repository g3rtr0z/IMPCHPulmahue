import React, { useState, useEffect } from "react";
import { Plus, Edit2, MapPin, Calendar as CalendarIcon, Clock, Building2, Map, X, CheckCircle2, Trash2 } from "lucide-react";
import { collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";

export default function CalendarManager() {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form state
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        time: "",
        location: "",
        type: "local",
    });

    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchEventos = async () => {
        try {
            setLoading(true);
            const q = query(collection(db, "eventos"), orderBy("date", "asc"));
            const snap = await getDocs(q);
            const list = [];
            snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
            setEventos(list);
        } catch (err) {
            console.error("Error fetching eventos:", err);
            // Fallback si falla el indexado de orderBy
            try {
                const snap = await getDocs(collection(db, "eventos"));
                const list = [];
                snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
                list.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
                setEventos(list);
            } catch (fallbackErr) {
                console.error("Error en fallback:", fallbackErr);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEventos();
    }, []);

    const handleOpenModal = (evento = null) => {
        setError("");
        setSuccess("");
        if (evento) {
            setEditingId(evento.id);
            setFormData({
                title: evento.title || "",
                date: evento.date || "",
                time: evento.time || "",
                location: evento.location || "",
                type: evento.type || "local",
            });
        } else {
            setEditingId(null);
            setFormData({
                title: "",
                date: new Date().toISOString().split("T")[0],
                time: "19:00",
                location: "",
                type: "local",
            });
        }
        setShowModal(true);
    };

    const handleSaveEvento = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setError("");
        setSuccess("");

        try {
            const eventoRef = editingId
                ? doc(db, "eventos", editingId)
                : doc(collection(db, "eventos"));

            await setDoc(eventoRef, {
                ...formData,
                updatedAt: serverTimestamp(),
                ...(editingId ? {} : { createdAt: serverTimestamp() }),
            }, { merge: true });

            setSuccess("Evento guardado exitosamente.");
            setTimeout(() => {
                setShowModal(false);
                fetchEventos();
            }, 1000);
        } catch (err) {
            console.error("Error saving evento:", err);
            setError("No se pudo guardar el evento.");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteEvento = async (id) => {
        if (!window.confirm("¿Está seguro de eliminar este evento? Esta acción no se puede deshacer.")) {
            return;
        }
        try {
            await deleteDoc(doc(db, "eventos", id));
            fetchEventos();
        } catch (err) {
            console.error("Error deleting evento:", err);
            alert("No se pudo eliminar el evento.");
        }
    };

    const localEvents = eventos.filter((ev) => ev.type === "local");
    const sectoralEvents = eventos.filter((ev) => ev.type === "sectorial");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-200/50 p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
                            <CalendarIcon className="w-6 h-6 text-primary" />
                            Calendario de Cultos y Actividades
                        </h2>
                        <p className="text-slate-500 mt-1">
                            Administra las fechas de actividades a nivel de Iglesia Local y Sectorial (Firebase).
                        </p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-hover shadow-sm transition-all flex items-center gap-2 hover:-translate-y-0.5">
                        <Plus className="w-5 h-5" />
                        Agregar evento
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20 bg-white rounded-3xl shadow-sm ring-1 ring-slate-200/50">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Local Events List */}
                    <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-200/50 p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Iglesia Local</h3>
                                <p className="text-sm text-slate-500">Actividades dentro de nuestra congregación</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {localEvents.map((ev) => (
                                <div key={ev.id} className="p-4 rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-sm transition-all bg-slate-50 hover:bg-white group flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">{ev.title}</h4>
                                        <div className="flex flex-col gap-1 text-sm text-slate-500 mt-2">
                                            <span className="flex items-center gap-1.5"><CalendarIcon className="w-4 h-4 text-blue-400 stroke-2" /> {ev.date ? new Date(ev.date + 'T00:00:00').toLocaleDateString() : '-'}</span>
                                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-400 stroke-2" /> {ev.time}Hrs</span>
                                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-blue-400 stroke-2" /> {ev.location}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all">
                                        <button
                                            onClick={() => handleOpenModal(ev)}
                                            className="text-slate-400 hover:text-primary p-2 bg-white rounded-xl shadow-sm border border-slate-200"
                                            title="Editar evento"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteEvento(ev.id)}
                                            className="text-slate-400 hover:text-red-500 p-2 bg-white rounded-xl shadow-sm border border-slate-200"
                                            title="Eliminar evento"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {localEvents.length === 0 && (
                                <div className="text-center py-8 text-slate-500">
                                    No hay actividades locales programadas.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sectoral Events List */}
                    <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-200/50 p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                <Map className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Iglesia Sectorial</h3>
                                <p className="text-sm text-slate-500">Actividades a nivel del sector</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {sectoralEvents.map((ev) => (
                                <div key={ev.id} className="p-4 rounded-2xl border border-slate-100 hover:border-emerald-100 hover:shadow-sm transition-all bg-slate-50 hover:bg-white group flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">{ev.title}</h4>
                                        <div className="flex flex-col gap-1 text-sm text-slate-500 mt-2">
                                            <span className="flex items-center gap-1.5"><CalendarIcon className="w-4 h-4 text-emerald-400 stroke-2" /> {ev.date ? new Date(ev.date + 'T00:00:00').toLocaleDateString() : '-'}</span>
                                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-emerald-400 stroke-2" /> {ev.time}Hrs</span>
                                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-emerald-400 stroke-2" /> {ev.location}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all">
                                        <button
                                            onClick={() => handleOpenModal(ev)}
                                            className="text-slate-400 hover:text-primary p-2 bg-white rounded-xl shadow-sm border border-slate-200"
                                            title="Editar evento"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteEvento(ev.id)}
                                            className="text-slate-400 hover:text-red-500 p-2 bg-white rounded-xl shadow-sm border border-slate-200"
                                            title="Eliminar evento"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {sectoralEvents.length === 0 && (
                                <div className="text-center py-8 text-slate-500">
                                    No hay actividades sectoriales programadas.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Form Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-3xl w-full max-w-xl p-6 md:p-8 shadow-2xl relative my-auto">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <CalendarIcon className="w-6 h-6 text-primary" />
                            {editingId ? "Editar Evento" : "Crear Nuevo Evento"}
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

                        <form onSubmit={handleSaveEvento} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-slate-700">
                                    Título del Evento *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-slate-50 focus:bg-white transition-all"
                                    placeholder="Ej. Servicio General Local"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-slate-700">
                                        Fecha *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-slate-50 focus:bg-white transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1 text-slate-700">
                                        Hora *
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-slate-50 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1 text-slate-700">
                                    Ubicación (Templo / Lugar) *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-slate-50 focus:bg-white transition-all"
                                    placeholder="Ej. Templo Central"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1 text-slate-700">
                                    Tipo de Evento *
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-slate-50 focus:bg-white transition-all"
                                >
                                    <option value="local">Iglesia Local</option>
                                    <option value="sectorial">Iglesia Sectorial</option>
                                </select>
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
                                    {formLoading ? "Guardando..." : "Guardar Evento"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
