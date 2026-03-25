import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Save, CheckCircle2, Facebook, Instagram, Youtube, Link as LinkIcon } from "lucide-react";

export default function SocialMediaManager() {
    const [links, setLinks] = useState({
        facebook: "",
        instagram: "",
        youtube: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const docRef = doc(db, "config", "social");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setLinks({
                        facebook: docSnap.data().facebook || "",
                        instagram: docSnap.data().instagram || "",
                        youtube: docSnap.data().youtube || ""
                    });
                }
            } catch (err) {
                console.error("Error fetching social links:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLinks();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccess("");
        setError("");

        try {
            await setDoc(doc(db, "config", "social"), links, { merge: true });
            setSuccess("Enlaces guardados correctamente.");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            console.error("Error saving social links:", err);
            setError("No se pudieron guardar los enlaces.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm ring-1 ring-slate-200/50 p-6 md:p-8 w-full border border-slate-100">
            <div className="flex flex-col mb-8 border-b border-slate-100 pb-6">
                <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
                    <LinkIcon className="w-6 h-6 text-primary" />
                    Gestión de Redes Sociales
                </h2>
                <p className="text-slate-500 mt-1">
                    Actualiza los enlaces a las redes oficiales. Se reflejarán automáticamente en la página web.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <form onSubmit={handleSave} className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-3 bg-green-50 text-green-700 text-sm rounded-xl border border-green-100 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" /> {success}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-slate-700">
                                <Facebook className="w-5 h-5 text-blue-600" /> URL de Facebook
                            </label>
                            <input
                                type="url"
                                value={links.facebook}
                                onChange={(e) => setLinks({ ...links, facebook: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-slate-50 focus:bg-white transition-all"
                                placeholder="https://facebook.com/..."
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-slate-700">
                                <Instagram className="w-5 h-5 text-pink-600" /> URL de Instagram
                            </label>
                            <input
                                type="url"
                                value={links.instagram}
                                onChange={(e) => setLinks({ ...links, instagram: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-slate-50 focus:bg-white transition-all"
                                placeholder="https://instagram.com/..."
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-slate-700">
                                <Youtube className="w-5 h-5 text-red-600" /> URL de YouTube
                            </label>
                            <input
                                type="url"
                                value={links.youtube}
                                onChange={(e) => setLinks({ ...links, youtube: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-slate-50 focus:bg-white transition-all"
                                placeholder="https://youtube.com/..."
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {saving ? "Guardando..." : <><Save className="w-5 h-5" /> Guardar Enlaces</>}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
