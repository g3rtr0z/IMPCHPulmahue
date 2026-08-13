import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'framer-motion';
import { ChevronRight, Calendar, User, ArrowLeft, Search } from 'lucide-react';

export default function NewsArchive() {
    const [news, setNews] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const q = query(collection(db, 'noticias'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNews(newsData);
            setIsLoading(false);
            window.scrollTo(0, 0);
        });
        return () => unsubscribe();
    }, []);

    const filteredNews = news.filter(item =>
        item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.resumen.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-impch-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="max-w-[1400px] mx-auto px-8">
                {/* Header Page */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-4">
                    <div>
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-slate-400 hover:text-impch-primary font-bold text-[10px] uppercase tracking-widest mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Regresar al Inicio
                        </button>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-4">
                            Archivo de Noticias
                        </h1>
                        <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
                            Explora el registro histórico de las actividades, eventos y testimonios de nuestra congregación.
                        </p>
                    </div>

                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <input
                            type="text"
                            placeholder="Buscar noticias..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-3xl shadow-soft focus:outline-none focus:border-impch-primary focus:ring-4 focus:ring-impch-primary/5 transition-all font-medium text-slate-600"
                        />
                    </div>
                </div>

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredNews.length > 0 ? (
                        filteredNews.map((item, index) => (
                            <motion.article
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-white rounded-[32px] overflow-hidden border border-slate-100/50 shadow-soft hover:shadow-2xl hover:shadow-impch-primary/5 transition-all duration-500 cursor-pointer flex flex-col"
                                onClick={() => navigate(`/noticia/${item.id}`)}
                            >
                                <div className="relative aspect-[16/10] overflow-hidden">
                                    <img
                                        src={item.imagen}
                                        alt={item.titulo}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-900 shadow-sm border border-slate-100">
                                            {item.autor}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg">
                                            <Calendar className="w-3 h-3" />
                                            {item.fecha_display}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-sans font-bold text-slate-900 mb-4 leading-tight group-hover:text-impch-primary transition-colors duration-300">
                                        {item.titulo}
                                    </h3>
                                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-8 font-medium">
                                        {item.resumen}
                                    </p>
                                    <div className="mt-auto pt-6 border-t border-slate-50">
                                        <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-impch-primary group-hover:gap-3 transition-all">
                                            Seguir leyendo
                                            <ChevronRight className="w-4 h-4" />
                                        </span>
                                    </div>
                                </div>
                            </motion.article>
                        ))
                    ) : (
                        <div className="col-span-full py-32 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
                            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                <Search className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No se encontraron noticias</h3>
                            <p className="text-slate-400">Prueba con términos de búsqueda diferentes.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
