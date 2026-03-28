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
        <article className="min-h-screen bg-slate-50">
            {/* Header Image / Hero */}
            <div className="relative h-[400px] md:h-[500px]">
                <img
                    src={article.imagen}
                    alt={article.titulo}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                    <div className="max-w-[1200px] mx-auto">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 bg-transparent border-0 font-semibold transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Volver
                        </button>
                        <div className="flex items-center gap-3 mb-4 text-xs font-bold text-white/90 uppercase tracking-widest">
                            <span className="bg-primary px-3 py-1 rounded-full">{article.autor}</span>
                            <span>{article.fecha_display}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
                            {article.titulo}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[1200px] mx-auto px-6 py-16">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-soft -mt-24 relative z-10 border border-slate-100">
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                        <p className="text-xl font-medium text-gray-900 mb-8 border-l-4 border-primary pl-6 py-1">
                            {article.resumen}
                        </p>
                        {article.contenido.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="mb-6">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex gap-4">
                            <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">Compartir:</span>
                            <div className="flex gap-3">
                                <button className="text-text-muted hover:text-primary transition-colors bg-transparent border-0 p-0">WhatsApp</button>
                                <button className="text-text-muted hover:text-primary transition-colors bg-transparent border-0 p-0">Facebook</button>
                                <button className="text-text-muted hover:text-primary transition-colors bg-transparent border-0 p-0">Email</button>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all bg-transparent border-0 p-0"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
