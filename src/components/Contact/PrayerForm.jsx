import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";

export default function PrayerForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    mensaje: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await addDoc(collection(db, "solicitudes_contacto"), {
        ...formData,
        estado: "pendiente",
        createdAt: serverTimestamp()
      });
      setSuccess(true);
      setFormData({ nombre: "", telefono: "", email: "", mensaje: "" });
      setTimeout(() => setSuccess(false), 8000);
    } catch (err) {
      console.error("Error enviando formulario:", err);
      setError("Ocurrió un error al enviar tus datos. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
      {success && (
        <div className="p-4 bg-emerald-50 text-emerald-700 text-sm rounded-xl font-bold border border-emerald-200 flex gap-3 items-start shadow-sm">
          <span className="mt-0.5 block shrink-0">✅</span>
          <p>¡Tus datos han sido enviados exitosamente! Nos pondremos en contacto contigo muy pronto para darte la bienvenida.</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl font-bold border border-red-200 flex gap-3 items-start shadow-sm">
          <span className="mt-0.5 block shrink-0">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-bold text-slate-700">Nombre y Apellido</span>
          <input
            type="text"
            placeholder="Ej. Juan Pérez"
            required
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-impch-primary/20 focus:border-impch-primary transition-all text-slate-900 placeholder:text-slate-400 font-medium"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-bold text-slate-700">WhatsApp / Teléfono</span>
          <input
            type="tel"
            placeholder="+56 9 1234 5678"
            required
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-impch-primary/20 focus:border-impch-primary transition-all text-slate-900 placeholder:text-slate-400 font-medium"
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-bold text-slate-700">Correo Electrónico (Opcional)</span>
        <input
          type="email"
          placeholder="juan@ejemplo.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-impch-primary/20 focus:border-impch-primary transition-all text-slate-900 placeholder:text-slate-400 font-medium"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-bold text-slate-700">Mensaje Adicional</span>
        <textarea
          placeholder="¿Te gustaría saber más sobre nuestros horarios o departamentos?"
          rows={3}
          value={formData.mensaje}
          onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-impch-primary/20 focus:border-impch-primary transition-all text-slate-900 placeholder:text-slate-400 font-medium resize-y"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className={`w-full mt-2 bg-impch-primary text-white py-4 rounded-xl font-bold transition-all shadow-soft flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-wait' : 'hover:bg-impch-primary-hover hover:-translate-y-0.5'}`}
      >
        <span>{loading ? "Enviando de forma segura..." : "Enviar mis datos"}</span>
        {!loading && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        )}
      </button>
    </form>
  );
}
