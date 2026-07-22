import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Clock, Plus, Trash2, Save, Calendar, CheckCircle2 } from "lucide-react";

export default function ScheduleManager() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const docRef = doc(db, "config", "schedules");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSchedules(docSnap.data().items || []);
                }
            } catch (err) {
                console.error("Error fetching schedules:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedules();
    }, []);

    const handleAddRow = () => {
        setSchedules([...schedules, { dia: "", hora: "", servicio: "" }]);
    };

    const handleRemoveRow = (index) => {
        const newSchedules = schedules.filter((_, i) => i !== index);
        setSchedules(newSchedules);
    };

    const handleChange = (index, field, value) => {
        const newSchedules = [...schedules];
        newSchedules[index][field] = value;
        setSchedules(newSchedules);
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: "", text: "" });
        try {
            await setDoc(doc(db, "config", "schedules"), { items: schedules });
            setMessage({ type: "success", text: "Horarios actualizados correctamente." });
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } catch (err) {
            console.error("Error saving schedules:", err);
            setMessage({ type: "error", text: "No se pudieron guardar los cambios." });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-200/50 p-6 md:p-8 w-full border border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-100 pb-6">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
                        <Clock className="w-6 h-6 text-primary" />
                        Horarios de Servicios
                    </h2>
                    <p className="text-slate-500 mt-1 italic">
                        Configura los días y horas de los cultos semanales.
                    </p>
                </div>
                <button
                    onClick={handleAddRow}
                    className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Agregar Horario
                </button>
            </div>

            {message.text && (
                <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                    }`}>
                    {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    <span className="text-sm font-medium">{message.text}</span>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    {schedules.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
                            <p className="text-slate-400">No hay horarios configurados. Haz clic en "Agregar Horario".</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {schedules.map((item, index) => (
                                <div key={index} className="group relative grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-slate-50 hover:bg-white hover:shadow-md border border-slate-100 hover:border-slate-200 rounded-2xl transition-all">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Día</label>
                                        <input
                                            type="text"
                                            placeholder="Ej: Domingos"
                                            value={item.dia}
                                            onChange={(e) => handleChange(index, "dia", e.target.value)}
                                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Hora</label>
                                        <input
                                            type="text"
                                            placeholder="Ej: 11:00 hrs"
                                            value={item.hora}
                                            onChange={(e) => handleChange(index, "hora", e.target.value)}
                                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium"
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Servicio</label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                placeholder="Ej: Culto General"
                                                value={item.servicio}
                                                onChange={(e) => handleChange(index, "servicio", e.target.value)}
                                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium"
                                            />
                                            <button
                                                onClick={() => handleRemoveRow(index)}
                                                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="pt-8 border-t border-slate-100 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-2xl font-bold hover:shadow-lg disabled:opacity-50 transition-all"
                        >
                            {saving ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            Guardar Todos los Cambios
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
