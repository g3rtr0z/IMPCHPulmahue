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
        <section id="noticias" className="py-24 bg-white relative overflow-hidden border-t border-slate-200">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div>
                        <span className="text-sm font-bold tracking-[0.2em] text-primary uppercase mb-4 block">Actualidad</span>
                        <h2 className="font-serif font-bold text-slate-900 mb-4 text-[clamp(2.5rem,4vw,3.5rem)] leading-tight">
                            Últimas Noticias
                        </h2>
                        <p className="text-slate-500 text-lg md:text-xl max-w-2xl leading-relaxed mb-0">
                            Mantente informado sobre los últimos acontecimientos destacables de nuestra congregación e iglesia.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {isComms && (
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-hover transition-colors shadow-soft"
                            >
                                {showForm ? 'Cancelar' : 'Nueva Noticia'}
                            </button>
                        )}
                        {!isLoading && news.length > 1 && (
                            <div className="hidden md:flex gap-2 ml-4">
                                <button onClick={() => scroll('left')} className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary hover:bg-blue-50 transition-all shadow-sm">
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button onClick={() => scroll('right')} className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary hover:bg-blue-50 transition-all shadow-sm">
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {isComms && showForm && (
                    <div className="mb-16 p-8 bg-slate-50 rounded-3xl border border-slate-200 shadow-soft">
                        <h3 className="text-xl font-serif font-bold mb-6 text-gray-900">Redactar Noticia</h3>
                        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold mb-2 text-gray-700">Título</label>
                                <input type="text" value={newPost.titulo} onChange={(e) => setNewPost({ ...newPost, titulo: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white" placeholder="Ej: Gran Servicio de Acción de Gracias" required />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold mb-2 text-gray-700">Breve Resumen</label>
                                <input type="text" value={newPost.resumen} onChange={(e) => setNewPost({ ...newPost, resumen: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white" placeholder="Aparecerá en la vista previa..." required />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold mb-2 text-gray-700">Contenido Completo (Markdown soportado)</label>
                                <textarea value={newPost.contenido} onChange={(e) => setNewPost({ ...newPost, contenido: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white min-h-[200px]" placeholder="Detalla la noticia aquí..." required />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700">URL Imagen (Unsplash)</label>
                                <input type="url" value={newPost.imagen} onChange={(e) => setNewPost({ ...newPost, imagen: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white" placeholder="https://images.unsplash.com/..." />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700">Autor / Departamento</label>
                                <input type="text" value={newPost.autor} onChange={(e) => setNewPost({ ...newPost, autor: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white" />
                            </div>
                            <div className="md:col-span-2 flex justify-end">
                                <button type="submit" className="bg-primary text-white px-12 py-4 rounded-full font-bold hover:bg-primary-hover transition-all shadow-card">
                                    Publicar en la Web
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="relative w-full">
                        <div
                            ref={carouselRef}
                            className="flex overflow-x-auto gap-6 pb-10 snap-x snap-mandatory flex-nowrap w-full"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {/* Hide webkit scrollbar via arbitrary class */}
                            <style dangerouslySetContent={{ __html: `\n::-webkit-scrollbar { display: none; }\n` }} />

                            {news.map((item, index) => {
                                return (
                                    <article key={item.id} className="snap-center shrink-0 w-full group flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 border border-slate-100 relative">
                                        {isComms && (
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur text-red-500 w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white shadow-sm transition-colors"
                                                title="Eliminar Noticia"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                            </button>
                                        )}
                                        <div className="w-full md:w-1/2 aspect-[16/10] md:aspect-auto overflow-hidden relative">
                                            <img
                                                src={item.imagen}
                                                alt={item.titulo}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            {index === 0 && <div className="absolute top-6 left-6 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg z-10 hidden md:block">Lo Último</div>}
                                        </div>
                                        <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col flex-grow justify-center">
                                            <div className="flex items-center gap-3 mb-4 text-[10px] md:text-xs font-bold text-primary uppercase tracking-[0.15em]">
                                                <span className="bg-blue-50 px-3 py-1.5 rounded-lg">{item.autor}</span>
                                                <span className="text-slate-300">•</span>
                                                <span className="text-slate-500">{item.fecha_display}</span>
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-4 leading-tight group-hover:text-primary transition-colors line-clamp-3">
                                                {item.titulo}
                                            </h3>
                                            <p className="text-slate-500 text-base line-clamp-3 mb-8 leading-relaxed flex-grow">
                                                {item.resumen}
                                            </p>
                                            <div className="mt-auto pt-6 border-t border-slate-100">
                                                <button
                                                    onClick={() => navigate(`/noticia/${item.id}`)}
                                                    className="inline-flex items-center gap-3 text-primary font-bold hover:text-primary-hover transition-colors group/btn p-0 bg-transparent border-0 text-left w-full text-lg"
                                                >
                                                    Leer artículo completo
                                                    <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                            {news.length === 0 && (
                                <div className="w-full py-20 text-center text-slate-500">No hay noticias publicadas por el momento.</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
