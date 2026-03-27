import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
} from 'firebase/firestore';
import { storage, db } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, ChevronRight, Upload, X } from 'lucide-react';

export default function News() {
    const { currentUser, isComms } = useAuth();
    const [news, setNews] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [newPost, setNewPost] = useState({ titulo: '', resumen: '', contenido: '', autor: 'Comunicaciones' });
    const navigate = useNavigate();
    const carouselRef = useRef(null);

    useEffect(() => {
        const q = query(collection(db, 'noticias'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const newsArray = [];
            querySnapshot.forEach((doc) => {
                newsArray.push({ id: doc.id, ...doc.data() });
            });
            setNews(newsArray);
            setIsLoading(false);
        }, (error) => {
            console.error("Error al obtener noticias: ", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!isComms) return;
        if (!newPost.titulo || !newPost.resumen || !imageFile) {
            alert("Por favor completa todos los campos y selecciona una imagen.");
            return;
        }

        setIsUploading(true);

        try {
            // 1. Upload Image to Storage
            const storageRef = ref(storage, `noticias/${Date.now()}_${imageFile.name}`);
            const uploadResult = await uploadBytes(storageRef, imageFile);
            const downloadURL = await getDownloadURL(uploadResult.ref);

            // 2. Save News to Firestore
            const post = {
                ...newPost,
                imagen: downloadURL,
                fecha_display: new Date().toLocaleDateString('es-CL'),
                createdAt: serverTimestamp()
            };

            await addDoc(collection(db, 'noticias'), post);

            // 3. Reset State
            setNewPost({ titulo: '', resumen: '', contenido: '', autor: 'Comunicaciones' });
            setImageFile(null);
            setImagePreview(null);
            setShowForm(false);
        } catch (error) {
            alert("Error al guardar noticia: " + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!isComms) return;
        if (window.confirm('¿Estás seguro de eliminar esta noticia?')) {
            try {
                await deleteDoc(doc(db, 'noticias', id));
            } catch (error) {
                alert("Error al eliminar noticia: " + error.message);
            }
        }
    };

    const scroll = (direction) => {
        if (carouselRef.current) {
            const { current } = carouselRef;
            const scrollAmount = direction === 'left' ? -current.offsetWidth : current.offsetWidth;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section id="noticias" className="py-24 bg-white border-b border-slate-100">
            <div className="max-w-[1400px] mx-auto px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div>
                        <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4 block">
                            Actualidad
                        </span>
                        <h2 className="font-sans font-bold text-slate-900 mb-4 text-3xl md:text-4xl tracking-tight leading-tight">
                            Últimas Noticias
                        </h2>
                        <p className="text-slate-500 text-lg max-w-2xl leading-relaxed mb-0">
                            Mantente informado sobre los últimos acontecimientos destacables de nuestra congregación e iglesia.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {isComms && (
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="bg-slate-900 text-white px-8 py-3 text-sm font-bold tracking-wide hover:bg-slate-800 transition-all duration-300"
                            >
                                {showForm ? 'Cancelar' : 'Nueva Noticia'}
                            </button>
                        )}
                    </div>
                </div>

                {/* --- FORM SECTION --- */}
                {isComms && showForm && (
                    <div className="mb-20 p-10 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
                        <h3 className="text-2xl font-sans font-bold mb-8 text-slate-900">Redactar Noticia</h3>
                        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3 text-slate-500">Título de la Noticia</label>
                                <input type="text" value={newPost.titulo} onChange={(e) => setNewPost({ ...newPost, titulo: e.target.value })} className="w-full px-6 py-4 border border-slate-200 focus:outline-none focus:border-slate-400 rounded-xl bg-white text-sm font-medium transition-all" required />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3 text-slate-500">Breve Resumen</label>
                                <input type="text" value={newPost.resumen} onChange={(e) => setNewPost({ ...newPost, resumen: e.target.value })} className="w-full px-6 py-4 border border-slate-200 focus:outline-none focus:border-slate-400 rounded-xl bg-white text-sm font-medium transition-all" required />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3 text-slate-500">Contenido del Artículo</label>
                                <textarea value={newPost.contenido} onChange={(e) => setNewPost({ ...newPost, contenido: e.target.value })} className="w-full px-6 py-4 border border-slate-200 focus:outline-none focus:border-slate-400 rounded-xl bg-white text-sm min-h-[180px] font-medium transition-all" required />
                            </div>

                            <div className="md:col-span-1">
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3 text-slate-500">Imagen Portada</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="img-upload"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="img-upload"
                                        className="flex items-center justify-center gap-3 w-full px-6 py-4 border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-xl bg-white cursor-pointer transition-all"
                                    >
                                        <Upload className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm font-medium text-slate-600">
                                            {imageFile ? imageFile.name : 'Subir desde dispositivo'}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="md:col-span-1 flex flex-col justify-end">
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3 text-slate-500">Autor / Departamento</label>
                                <input type="text" value={newPost.autor} onChange={(e) => setNewPost({ ...newPost, autor: e.target.value })} className="w-full px-6 py-4 border border-slate-200 focus:outline-none focus:border-slate-400 rounded-xl bg-white text-sm font-medium transition-all" />
                            </div>

                            {imagePreview && (
                                <div className="md:col-span-2 mt-2">
                                    <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-slate-200">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => { setImageFile(null); setImagePreview(null); }}
                                            className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-md text-rose-500"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="md:col-span-2 flex justify-end mt-6">
                                <button
                                    type="submit"
                                    disabled={isUploading}
                                    className={`bg-slate-900 text-white px-10 py-4 text-sm font-bold tracking-widest uppercase hover:bg-slate-800 transition-all rounded-xl flex items-center gap-3 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isUploading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Publicando...
                                        </>
                                    ) : (
                                        'Publicar Noticia'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* --- MINIMALIST NEWS GRID --- */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                        {news.length > 0 ? (
                            news.map((item) => (
                                <article
                                    key={item.id}
                                    className="group flex flex-col cursor-pointer"
                                    onClick={() => navigate(`/noticia/${item.id}`)}
                                >
                                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-50 mb-6 group-hover:shadow-lg transition-all duration-500">
                                        {isComms && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                                className="absolute top-4 right-4 z-30 bg-white/80 backdrop-blur-sm text-slate-400 w-8 h-8 flex items-center justify-center hover:text-rose-500 transition-all rounded-full border border-slate-100"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                        <img
                                            src={item.imagen}
                                            alt={item.titulo}
                                            className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute bottom-4 left-4">
                                            <span className="bg-white/90 backdrop-blur-md text-[9px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg text-slate-900 border border-slate-100">
                                                {item.autor}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col flex-grow">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                                {item.fecha_display}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-sans font-bold text-slate-900 mb-3 leading-snug group-hover:text-primary transition-colors duration-300">
                                            {item.titulo}
                                        </h3>
                                        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-6 font-medium">
                                            {item.resumen}
                                        </p>
                                        <div className="mt-auto">
                                            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900 group-hover:text-primary transition-colors duration-300">
                                                Leer más
                                                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            )
                            )) : (
                            <div className="col-span-full py-20 text-center border border-dashed border-slate-100 rounded-3xl">
                                <p className="text-slate-400 text-sm font-medium tracking-wide">No se encontraron noticias publicadas.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );

}
