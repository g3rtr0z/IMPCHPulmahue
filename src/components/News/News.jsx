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
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function News() {
    const { currentUser, isComms } = useAuth();
    const [news, setNews] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [newPost, setNewPost] = useState({ titulo: '', resumen: '', contenido: '', imagen: '', autor: 'Comunicaciones' });
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

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!isComms) return;
        if (!newPost.titulo || !newPost.resumen) return;

        try {
            const post = {
                ...newPost,
                fecha_display: new Date().toLocaleDateString('es-CL'),
                createdAt: serverTimestamp(),
                imagen: newPost.imagen || 'https://images.unsplash.com/photo-1490122417551-6ee9691429d0?w=800&h=500&fit=crop'
            };

            await addDoc(collection(db, 'noticias'), post);
            setNewPost({ titulo: '', resumen: '', contenido: '', imagen: '', autor: 'Comunicaciones' });
            setShowForm(false);
        } catch (error) {
            alert("Error al guardar en Firebase: " + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!isComms) return;
        if (window.confirm('¿Estás seguro de eliminar esta noticia?')) {
            try {
                await deleteDoc(doc(db, 'noticias', id));
            } catch (error) {
                alert("Error al eliminar de Firebase: " + error.message);
            }
        }
    };

    const scroll = (direction) => {
        if (carouselRef.current) {
            const { current } = carouselRef;
            // Scroll exactly the width of the container (1 full slide)
            const scrollAmount = direction === 'left' ? -current.offsetWidth : current.offsetWidth;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section id="noticias" className="py-24 bg-white border-b border-slate-100">
            <div className="max-w-[1000px] mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div>
                        <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4 block">
                            Actualidad
                        </span>
                        <h2 className="font-sans font-bold text-slate-900 mb-4 text-3xl md:text-4xl tracking-tight">
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
                                className="bg-slate-900 text-white px-6 py-2.5 text-sm font-semibold hover:bg-slate-800 transition-colors duration-300"
                            >
                                {showForm ? 'Cancelar' : 'Nueva Noticia'}
                            </button>
                        )}
                        {!isLoading && news.length > 1 && (
                            <div className="hidden md:flex gap-2 ml-4">
                                <button onClick={() => scroll('left')} className="w-10 h-10 border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-400 transition-colors duration-300" aria-label="Anterior">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button onClick={() => scroll('right')} className="w-10 h-10 border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-400 transition-colors duration-300" aria-label="Siguiente">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- FORM SECTION --- */}
                {isComms && showForm && (
                    <div className="mb-16 p-8 md:p-10 bg-slate-50 border border-slate-200">
                        <h3 className="text-2xl font-sans font-bold mb-8 text-slate-900">Redactar Noticia</h3>
                        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 text-slate-500">Título</label>
                                <input type="text" value={newPost.titulo} onChange={(e) => setNewPost({ ...newPost, titulo: e.target.value })} className="w-full px-5 py-3.5 border border-slate-200 focus:outline-none focus:border-slate-400 bg-white text-sm font-medium transition-all" placeholder="Ej: Gran Servicio de Acción de Gracias" required />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 text-slate-500">Breve Resumen</label>
                                <input type="text" value={newPost.resumen} onChange={(e) => setNewPost({ ...newPost, resumen: e.target.value })} className="w-full px-5 py-3.5 border border-slate-200 focus:outline-none focus:border-slate-400 bg-white text-sm font-medium transition-all" placeholder="Aparecerá en la vista previa..." required />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 text-slate-500">Contenido Completo</label>
                                <textarea value={newPost.contenido} onChange={(e) => setNewPost({ ...newPost, contenido: e.target.value })} className="w-full px-5 py-3.5 border border-slate-200 focus:outline-none focus:border-slate-400 bg-white text-sm min-h-[160px] font-medium transition-all" placeholder="Detalla la noticia aquí..." required />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 text-slate-500">URL Imagen (Unsplash)</label>
                                <input type="url" value={newPost.imagen} onChange={(e) => setNewPost({ ...newPost, imagen: e.target.value })} className="w-full px-5 py-3.5 border border-slate-200 focus:outline-none focus:border-slate-400 bg-white text-sm font-medium transition-all" placeholder="https://images.unsplash.com/..." />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 text-slate-500">Autor / Departamento</label>
                                <input type="text" value={newPost.autor} onChange={(e) => setNewPost({ ...newPost, autor: e.target.value })} className="w-full px-5 py-3.5 border border-slate-200 focus:outline-none focus:border-slate-400 bg-white text-sm font-medium transition-all" />
                            </div>
                            <div className="md:col-span-2 flex justify-end mt-4">
                                <button type="submit" className="bg-slate-900 text-white px-8 py-3.5 text-sm font-bold tracking-wide hover:bg-slate-800 transition-colors duration-300">
                                    Publicar Noticia
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* --- CAROUSEL --- */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="relative w-full">
                        {/* Custom scrollbars hidden via inline style */}
                        <div
                            ref={carouselRef}
                            className="flex overflow-x-auto gap-8 pb-10 snap-x snap-mandatory flex-nowrap w-full"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            <style dangerouslySetInnerHTML={{ __html: `\n::-webkit-scrollbar { display: none; }\n` }} />

                            {news.map((item, index) => {
                                return (
                                    <article key={item.id} className="snap-center shrink-0 w-full flex flex-col md:flex-row bg-white border border-slate-200 relative hover:shadow-md transition-shadow duration-300 min-h-[420px]">
                                        {isComms && (
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="absolute top-4 right-4 z-20 bg-white text-rose-500 w-10 h-10 flex items-center justify-center hover:bg-rose-50 border border-slate-200 transition-colors duration-300 shadow-sm"
                                                title="Eliminar Noticia"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                            </button>
                                        )}
                                        <div className="w-full md:w-[45%] aspect-[16/10] md:aspect-auto overflow-hidden relative border-b md:border-b-0 md:border-r border-slate-200">
                                            <img
                                                src={item.imagen}
                                                alt={item.titulo}
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                            {index === 0 && (
                                                <div className="absolute top-6 left-6 bg-white text-slate-900 text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 hidden md:block border border-slate-200 shadow-sm">
                                                    Lo Último
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col flex-grow justify-center bg-white">
                                            <div className="flex items-center gap-3 mb-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                                <span>{item.autor}</span>
                                                <span className="text-slate-300">•</span>
                                                <span>{item.fecha_display}</span>
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-sans font-bold text-slate-900 mb-6 leading-[1.2] line-clamp-3 hover:text-slate-600 transition-colors">
                                                {item.titulo}
                                            </h3>
                                            <p className="text-slate-500 text-base md:text-lg line-clamp-3 mb-8 leading-relaxed flex-grow">
                                                {item.resumen}
                                            </p>
                                            <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-start">
                                                <button
                                                    onClick={() => navigate(`/noticia/${item.id}`)}
                                                    className="inline-flex items-center gap-3 text-slate-900 font-bold hover:text-slate-500 transition-colors border-0 bg-transparent p-0 text-sm tracking-wide"
                                                >
                                                    Leer artículo completo
                                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                            {news.length === 0 && (
                                <div className="w-full py-24 text-center">
                                    <span className="inline-block p-4 bg-slate-50 border border-slate-200 text-slate-400 mb-4">
                                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </span>
                                    <p className="text-slate-500 font-medium">No hay noticias publicadas por el momento.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );

}
