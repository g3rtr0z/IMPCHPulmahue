import React, { useState, useEffect } from "react";
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { Plus, Trash2, Link, Image as ImageIcon, Calendar, Newspaper } from "lucide-react";

export default function NewsManager() {
    const { isComms } = useAuth();
    const [news, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Configuración de Cloudinary
    const CLOUDINARY_CLOUD_NAME = "dzvfo7b7c";
    const CLOUDINARY_UPLOAD_PRESET = "impchpulmahue";

    const [newPost, setNewPost] = useState({
        titulo: "",
        resumen: "",
        contenido: "",
        imagen: "",
        autor: "Comunicaciones",
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        const q = query(collection(db, "noticias"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const newsArray = [];
                querySnapshot.forEach((doc) => {
                    newsArray.push({ id: doc.id, ...doc.data() });
                });
                setNews(newsArray);
                setIsLoading(false);
            },
            (error) => {
                console.error("Error al obtener noticias: ", error);
                setIsLoading(false);
            }
        );
        return () => unsubscribe();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        try {
            console.log("Iniciando subida a Cloudinary...", { cloud: CLOUDINARY_CLOUD_NAME, preset: CLOUDINARY_UPLOAD_PRESET });

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                    // Eliminamos cabeceras innecesarias para evitar problemas de CORS
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error respuesta Cloudinary:", errorData);
                // Si el error es sobre 'unsigned', le avisamos al usuario
                if (errorData.error.message.includes("unsigned")) {
                    throw new Error("El preset 'impchpulmahue' debe estar configurado como UNSIGNED en tu panel de Cloudinary.");
                }
                throw new Error(errorData.error.message || "Error al subir a la nube");
            }

            const data = await response.json();
            console.log("Subida exitosa:", data.secure_url);
            return data.secure_url;
        } catch (error) {
            console.error("Error de conexión durante el fetch:", error);
            if (error.message.includes("UNSIGNED")) throw error;
            throw new Error("No se pudo conectar con Cloudinary. Por favor, asegúrate de que el preset 'impchpulmahue' sea UNSIGNED en tu panel de control.");
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!isComms) return;
        if (!newPost.titulo || !newPost.resumen || !newPost.contenido) {
            alert("Por favor completa los campos obligatorios.");
            return;
        }

        setIsSaving(true);
        try {
            let finalImageUrl = newPost.imagen;

            // Si hay un archivo seleccionado, lo subimos primero a Cloudinary
            if (imageFile) {
                finalImageUrl = await uploadToCloudinary(imageFile);
            }

            const post = {
                ...newPost,
                fecha_display: new Date().toLocaleDateString("es-CL"),
                createdAt: serverTimestamp(),
                imagen: finalImageUrl || "https://images.unsplash.com/photo-1490122417551-6ee9691429d0?w=800&h=500&fit=crop",
            };

            await addDoc(collection(db, "noticias"), post);
            setNewPost({
                titulo: "",
                resumen: "",
                contenido: "",
                imagen: "",
                autor: "Comunicaciones",
            });
            setImageFile(null);
            setImagePreview(null);
            setShowForm(false);
        } catch (error) {
            alert("Error al guardar la noticia: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!isComms) return;
        if (window.confirm("¿Estás seguro de eliminar esta noticia? Esta acción no se puede deshacer.")) {
            try {
                await deleteDoc(doc(db, "noticias", id));
            } catch (error) {
                alert("Error al eliminar la noticia: " + error.message);
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Cabecera */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-impch-dark-panel">
                        Gestión de Noticias
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        Administra las noticias y anuncios que aparecen en la página principal.
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-impch-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-impch-primary-hover transition-colors shadow-soft whitespace-nowrap"
                >
                    {showForm ? (
                        "Ver Listado"
                    ) : (
                        <>
                            <Plus className="w-4 h-4" /> Nueva Noticia
                        </>
                    )}
                </button>
            </div>

            {/* Formulario de Creación */}
            {showForm ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 animate-in slide-in-from-bottom-4 duration-300">
                    <h3 className="text-xl font-serif font-bold text-impch-dark-panel mb-6">
                        Redactar Nueva Noticia
                    </h3>
                    <form onSubmit={handleCreate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Título de la Noticia <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newPost.titulo}
                                    onChange={(e) =>
                                        setNewPost({ ...newPost, titulo: e.target.value })
                                    }
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-impch-primary/20 focus:border-impch-primary transition-all text-sm"
                                    placeholder="Ej: Gran Servicio de Acción de Gracias"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Breve Resumen <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={newPost.resumen}
                                    onChange={(e) =>
                                        setNewPost({ ...newPost, resumen: e.target.value })
                                    }
                                    rows="2"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-impch-primary/20 focus:border-impch-primary transition-all text-sm resize-none"
                                    placeholder="Un texto corto que aparecerá en la tarjeta de la noticia..."
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Contenido Completo <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={newPost.contenido}
                                    onChange={(e) =>
                                        setNewPost({ ...newPost, contenido: e.target.value })
                                    }
                                    rows="8"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-impch-primary/20 focus:border-impch-primary transition-all text-sm resize-y"
                                    placeholder="Escribe el cuerpo completo de la noticia (Puedes usar Markdown para dar formato si lo deseas)..."
                                    required
                                />
                            </div>

                            <div className="md:col-span-1">
                                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4 text-slate-400" />
                                    Imagen Destacada
                                </label>
                                <div className="flex items-center gap-4">
                                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-impch-primary cursor-pointer transition-all overflow-hidden relative group">
                                        {imagePreview ? (
                                            <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                        ) : (
                                            <div className="flex flex-col items-center text-slate-400">
                                                <Plus className="w-6 h-6 mb-1" />
                                                <span className="text-[10px] uppercase font-bold tracking-tighter">Subir</span>
                                            </div>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                    <div className="flex-1">
                                        <p className="text-xs text-slate-500 mb-2 leading-relaxed">
                                            Selecciona una fotografía para la noticia. Se recomienda un tamaño de 800x500px para mejor visualización.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => { setImageFile(null); setImagePreview(null); }}
                                            className="text-[10px] font-bold uppercase text-red-500 hover:text-red-700 underline"
                                        >
                                            Quitar imagen
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-1">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Autor / Departamento
                                </label>
                                <input
                                    type="text"
                                    value={newPost.autor}
                                    onChange={(e) =>
                                        setNewPost({ ...newPost, autor: e.target.value })
                                    }
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-impch-primary/20 focus:border-impch-primary transition-all text-sm"
                                    placeholder="Ej: Comunicaciones / Depto. Jóvenes"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-6 py-2.5 text-slate-600 font-semibold text-sm hover:text-slate-900 transition-colors mr-2"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className={`bg-impch-accent text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-soft flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-impch-accent-hover'}`}
                            >
                                {isSaving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Publicando...
                                    </>
                                ) : (
                                    "Publicar Noticia"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                /* Lista de Noticias */
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    {isLoading ? (
                        <div className="p-10 text-center text-slate-400 animate-pulse">
                            Cargando noticias...
                        </div>
                    ) : news.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <Newspaper className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700">No hay noticias</h3>
                            <p className="text-slate-500 mt-1 max-w-sm">
                                Aún no has publicado ninguna noticia. Haz clic en el botón superior para crear la primera.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-max text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            Noticia
                                        </th>
                                        <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            Fecha / Autor
                                        </th>
                                        <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {news.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50/50 transition-colors group"
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-shrink-0 w-16 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                                                        {item.imagen ? (
                                                            <img
                                                                src={item.imagen}
                                                                alt="Miniatura"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <ImageIcon className="w-5 h-5 m-auto text-slate-300 mt-3" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 group-hover:text-impch-primary transition-colors line-clamp-1">
                                                            {item.titulo}
                                                        </p>
                                                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 max-w-md">
                                                            {item.resumen}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                        {item.fecha_display}
                                                    </span>
                                                    <span className="text-xs font-medium text-impch-primary bg-impch-primary/5 px-2 py-0.5 rounded w-fit">
                                                        {item.autor}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <a
                                                        href={`/noticia/${item.id}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="p-2 text-slate-400 hover:text-impch-primary hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                                                        title="Ver en la web"
                                                    >
                                                        <Link className="w-4 h-4" />
                                                    </a>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                        title="Eliminar Noticia"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
