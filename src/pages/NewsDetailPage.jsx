import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, Calendar, User, Share2, Facebook, MessageCircle, Mail, Clock, Hash } from 'lucide-react';

export default function NewsDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

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
                setTimeout(() => setIsLoading(false), 800);
            }
        }

        fetchArticle();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24">
                <div className="w-full max-w-3xl px-6">
                    <div className="animate-pulse space-y-8">
                        <div className="h-[400px] bg-slate-200 rounded-3xl w-full" />
                        <div className="space-y-4">
                            <div className="h-8 bg-slate-200 rounded w-3/4" />
                            <div className="h-4 bg-slate-200 rounded w-1/4" />
                        </div>
                        <div className="space-y-3">
                            <div className="h-4 bg-slate-200 rounded w-full" />
                            <div className="h-4 bg-slate-200 rounded w-full" />
                            <div className="h-4 bg-slate-200 rounded w-5/6" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center pt-24 px-6 text-center">
                <div className="p-6 bg-white rounded-full shadow-soft mb-8">
                    <Hash className="w-12 h-12 text-slate-300" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Noticia no encontrada</h2>
                <p className="text-slate-500 mb-8 max-w-md">Lo sentimos, la noticia que buscas no existe o ha sido movida.</p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-impch-primary text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-impch-accent transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:scale-95"
                >
                    Volver al Inicio
                </button>
            </div>
        );
    }

    return (
        <article className="min-h-screen bg-slate-50 selection:bg-impch-accent/20 selection:text-impch-primary">
            {/* Reading Progress Bar */}
            <motion.div
                className="fixed top-28 left-0 right-0 h-1.5 bg-impch-primary z-[110] origin-left rounded-r-full shadow-glow"
                style={{ scaleX }}
            />

            {/* Header Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
                <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    src={article.imagen}
                    alt={article.titulo}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 pb-28 pt-32 px-6">
                    <div className="max-w-[1000px] mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <button
                                onClick={() => navigate('/')}
                                className="group flex items-center gap-3 text-white/70 hover:text-white mb-10 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-white/15"
                            >
                                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                Volver al inicio
                            </button>

                            <div className="flex flex-wrap items-center gap-6 mb-8">
                                <span className="flex items-center gap-2 bg-impch-primary/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                                    <User className="w-3 h-3" />
                                    {article.autor}
                                </span>
                                <span className="flex items-center gap-2 text-white/80 text-[10px] font-bold uppercase tracking-widest bg-black/20 backdrop-blur-sm px-4 py-1.5 rounded-full">
                                    <Calendar className="w-3 h-3 text-impch-accent-light" />
                                    {article.fecha_display}
                                </span>
                                <span className="flex items-center gap-2 text-white/80 text-[10px] font-bold uppercase tracking-widest bg-black/20 backdrop-blur-sm px-4 py-1.5 rounded-full">
                                    <Clock className="w-3 h-3 text-impch-accent-light" />
                                    4 min lectura
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-[1.1] tracking-tight drop-shadow-2xl">
                                {article.titulo}
                            </h1>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-[1000px] mx-auto px-6 mb-20">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="bg-white px-8 md:px-16 py-12 md:py-20 rounded-[40px] shadow-2xl -mt-20 relative z-10 border border-slate-100"
                >
                    <div className="max-w-3xl mx-auto">
                        <div className="max-w-none text-slate-700 leading-relaxed font-sans">
                            <p className="text-2xl md:text-3xl font-serif italic text-impch-primary font-bold mb-12 border-l-8 border-impch-primary pl-8 py-3 bg-slate-50/80 rounded-r-3xl leading-tight">
                                {article.resumen}
                            </p>
                            
                            <div className="space-y-10 text-lg md:text-xl text-slate-600 leading-[1.8]">
                                {article.contenido.split('\n\n').map((paragraph, index) => (
                                    <motion.p 
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ delay: index * 0.05 }}
                                        className={index === 0 
                                            ? "first-letter:text-6xl first-letter:font-serif first-letter:font-bold first-letter:mr-4 first-letter:float-left first-letter:text-impch-primary first-letter:leading-none text-slate-700 bg-white" 
                                            : "text-slate-600"}
                                    >
                                        {paragraph}
                                    </motion.p>
                                ))}
                            </div>
                        </div>

                        {/* Social & Sharing Footer */}
                        <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col items-center gap-8 text-center">
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Comparte esta noticia</h3>
                                <div className="flex gap-4">
                                    <button className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-[#25D366] hover:text-white transition-all duration-300 shadow-sm border border-slate-100 group">
                                        <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </button>
                                    <button className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-[#1877F2] hover:text-white transition-all duration-300 shadow-sm border border-slate-100 group">
                                        <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </button>
                                    <button className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white transition-all duration-300 shadow-sm border border-slate-100 group">
                                        <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </button>
                                    <button className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-impch-primary hover:text-white transition-all duration-300 shadow-sm border border-slate-100 group">
                                        <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/')}
                                className="inline-flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-impch-primary transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Ver todas las noticias
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </article>
    );
}
