import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { ArrowRight, ChevronRight, ChevronLeft, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Hero() {
  const navigate = useNavigate();
  const location = useLocation();
  const [latestNews, setLatestNews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, 'noticias'),
      orderBy('createdAt', 'desc'),
      limit(2)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const news = [];
      snap.forEach(doc => news.push({ id: doc.id, ...doc.data() }));
      setLatestNews(news);
    });

    return () => unsubscribe();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (latestNews.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === 0 ? 1 : 0));
    }, 30000);
    return () => clearInterval(timer);
  }, [latestNews]);

  const nextSlide = () => setCurrentIndex((prev) => (prev === 0 ? 1 : 0));
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? 1 : 0));

  const handleNavClick = (e, href) => {
    if (location.pathname !== '/') {
        e.preventDefault();
        navigate('/' + href);
    }
  };

  return (
    <section id="inicio" className="relative min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden bg-slate-900 pt-[112px]">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/60 z-10" />
        <div
          className="absolute inset-0 opacity-40 mix-blend-luminosity bg-cover bg-center"
          style={{ backgroundImage: "url('/hero.jpeg')" }}
        />
      </div>

      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Institutional Info */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 border border-white/20 bg-white/5 backdrop-blur-sm text-slate-300 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-8 rounded-lg"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-impch-primary animate-pulse" />
              Iglesia Metodista Pentecostal de Chile
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-sans font-bold text-white mb-8 text-[clamp(2.5rem,5.5vw,4.2rem)] leading-[1.1] tracking-tight"
            >
              Pregonando con Poder<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">
                el Evangelio de Salvación
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-300 mb-12 leading-relaxed max-w-[650px] font-light italic border-l-2 border-impch-primary/50 pl-6"
            >
              Desde hace 15 años, la IMPCH Pulmahue mantiene viva la llama del avivamiento, anunciando la Palabra de Dios en cada hogar para gloria de nuestro Señor Jesucristo.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-5"
            >
              <a
                href="#noticias"
                onClick={(e) => handleNavClick(e, '#noticias')}
                className="inline-flex items-center justify-center gap-3 px-10 py-4 text-[11px] font-bold uppercase tracking-widest text-white bg-impch-primary hover:bg-impch-accent transition-all duration-300 rounded-xl shadow-lg shadow-impch-primary/20"
              >
                Últimas Noticias
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#departamentos"
                onClick={(e) => handleNavClick(e, '#departamentos')}
                className="inline-flex items-center justify-center gap-3 px-10 py-4 text-[11px] font-bold uppercase tracking-widest text-white bg-white/5 border border-white/20 backdrop-blur-md hover:bg-white/10 transition-all duration-300 rounded-xl"
              >
                Nuestros Ministerios
              </a>
            </motion.div>
          </div>

          {/* Right Column: News Carousel */}
          <div className="lg:col-span-5 h-full flex items-center">
            <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5] max-h-[600px] group">
              <AnimatePresence mode="wait">
                {latestNews.length > 0 ? (
                  <motion.div
                    key={latestNews[currentIndex].id}
                    initial={{ opacity: 0, scale: 0.95, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 1.05, x: -20 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 rounded-[32px] overflow-hidden shadow-2xl shadow-black/50 border border-white/10"
                    onClick={() => navigate(`/noticia/${latestNews[currentIndex].id}`)}
                  >
                    <img 
                      src={latestNews[currentIndex].imagen} 
                      alt={latestNews[currentIndex].titulo}
                      className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110 cursor-pointer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10 text-left pointer-events-none">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-impch-primary text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                          Noticias Recientes
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-300 text-[10px] font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          {latestNews[currentIndex].fecha_display}
                        </div>
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-serif font-bold text-white mb-4 leading-tight">
                        {latestNews[currentIndex].titulo}
                      </h3>
                      <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">
                        Leer Artículo Completo
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="absolute inset-0 bg-slate-800/50 rounded-[32px] border border-white/5 flex items-center justify-center">
                    <p className="text-slate-500 text-sm font-medium italic">Obteniendo noticias...</p>
                  </div>
                )}
              </AnimatePresence>

              {/* Carousel Controls */}
              {latestNews.length > 1 && (
                <div className="absolute -bottom-6 right-8 flex gap-3 z-30">
                  <button 
                    onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                    className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl hover:bg-impch-primary hover:border-impch-primary transition-all active:scale-90"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                    className="w-12 h-12 flex items-center justify-center bg-slate-900 border border-white/10 text-white rounded-2xl hover:bg-impch-primary hover:border-impch-primary transition-all active:scale-90"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}

              {/* Slide Indicators */}
              <div className="absolute top-8 right-8 flex flex-col gap-2 z-30">
                {latestNews.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`w-1 transition-all duration-500 rounded-full ${currentIndex === idx ? 'h-8 bg-impch-primary' : 'h-2 bg-white/20'}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
