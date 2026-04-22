import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function NewsDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchArticle() {
            try {
                const docRef = doc(db, 'noticias', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setArticle({ id: docSnap.id, ...docSnap.data() });
                    window.scrollTo(0, 0);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching article:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchArticle();
    }, [id]);

    if (isLoading) {
        return (
            <div className="py-32 text-center">
                <div className="animate-pulse text-text-muted">Cargando noticia...</div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="py-32 text-center">
                <h2 className="text-2xl font-serif font-bold mb-4">Noticia no encontrada</h2>
                <button
                    onClick={() => navigate('/')}
                    className="bg-primary text-white px-6 py-2 rounded-full"
                >
                    Volver al Inicio
                </button>
            </div>
        );
    }

    return (
        <article className="min-h-screen bg-slate-50 pt-20">
            {/* Header Image / Hero */}
            <div className="relative h-[350px] md:h-[500px] overflow-hidden">
                <img
                    src={article.imagen}
                    alt={article.titulo}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 pb-24 md:pb-32">
                    <div className="max-w-[1200px] w-full mx-auto">

                        
                        <div className="flex flex-wrap items-center gap-3 mb-4 text-[10px] md:text-xs font-bold text-white/90 uppercase tracking-[0.2em]">
                            <span className="bg-impch-primary px-3 py-1 rounded-md">{article.autor}</span>
                            <span className="opacity-60">{article.fecha_display}</span>
                        </div>
                        
                        <h1 className="text-2xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-[1.2] lg:leading-tight">
                            {article.titulo}
                        </h1>
                    </div>
                </div>
            </div>
 
            {/* Content Card */}
            <div className="max-w-[1200px] mx-auto px-4 md:px-6 pb-20">
                <div className="bg-white p-6 md:p-16 rounded-3xl shadow-xl shadow-slate-200/50 -mt-16 md:-mt-24 relative z-10 border border-slate-100">
                    <div className="prose prose-slate prose-lg max-w-none">
                        <p className="text-lg md:text-xl font-medium text-slate-900 mb-8 border-l-4 border-impch-primary pl-6 py-2 bg-slate-50/50 pr-4 rounded-r-lg">
                            {article.resumen}
                        </p>
                        <div className="text-slate-600 leading-relaxed space-y-6">
                            {article.contenido.split('\n\n').map((paragraph, index) => (
                                <p key={index}>
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
 
                    <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Compartir:</span>
                            <div className="flex gap-4">
                                <button className="text-slate-400 hover:text-impch-primary transition-colors bg-transparent border-0 p-0 text-xs font-bold uppercase tracking-widest">WhatsApp</button>
                                <button className="text-slate-400 hover:text-impch-primary transition-colors bg-transparent border-0 p-0 text-xs font-bold uppercase tracking-widest">Facebook</button>
                                <button className="text-slate-400 hover:text-impch-primary transition-colors bg-transparent border-0 p-0 text-xs font-bold uppercase tracking-widest">Email</button>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center gap-3 text-impch-primary font-bold text-xs uppercase tracking-widest hover:gap-4 transition-all bg-slate-50 px-6 py-4 rounded-xl group"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Explorar más noticias
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
