import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
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
      limit(3)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const news = [];
      snap.forEach(doc => news.push({ id: doc.id, ...doc.data() }));
      setLatestNews(news);
    });

    return () => unsubscribe();
  }, []);

  // Default church background images fallback list
  const fallbackImages = [
    { id: 'fallback-1', imagen: '/hero.jpeg', titulo: 'Templo IMPCH Pulmahue', fecha_display: 'Iglesia Metodista Pentecostal' },
    { id: 'fallback-2', imagen: '/hero-pastores.png', titulo: 'Nuestros Pastores', fecha_display: 'Liderazgo & Pastoral' },
  ];

  const slides = latestNews.length > 0 ? latestNews : fallbackImages;

  // Auto-play carousel
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  const handleNavClick = (e, href) => {
    if (location.pathname !== '/') {
      e.preventDefault();
      navigate('/' + href);
    }
  };

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <section id="inicio" className="relative min-h-screen flex flex-col justify-between bg-slate-950 text-white pt-28 lg:pt-32 pb-8 overflow-hidden">
      
      {/* Full-bleed Dynamic Background Image Carousel */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide?.imagen || '/hero.jpeg'}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.65, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 bg-cover bg-center filter brightness-90 contrast-110"
            style={{ backgroundImage: `url('${currentSlide?.imagen || '/hero.jpeg'}')` }}
          />
        </AnimatePresence>

        {/* Soft gradient overlay so background photo shines clearly while ensuring text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/40 to-slate-950/95 z-10" />
      </div>

      {/* Left Navigation Arrow (Desktop Only) */}
      {slides.length > 1 && (
        <button 
          onClick={prevSlide}
          className="hidden lg:flex absolute left-8 lg:left-12 top-1/2 -translate-y-1/2 z-30 w-13 h-13 rounded-full bg-slate-950/70 border border-slate-800/80 text-slate-300 hover:text-white hover:border-slate-600 hover:bg-slate-900 transition-all items-center justify-center backdrop-blur-md shadow-2xl active:scale-95"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Right Navigation Arrow (Desktop Only) */}
      {slides.length > 1 && (
        <button 
          onClick={nextSlide}
          className="hidden lg:flex absolute right-8 lg:right-12 top-1/2 -translate-y-1/2 z-30 w-13 h-13 rounded-full bg-slate-950/70 border border-slate-800/80 text-slate-300 hover:text-white hover:border-slate-600 hover:bg-slate-900 transition-all items-center justify-center backdrop-blur-md shadow-2xl active:scale-95"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Centered Hero Main Content */}
      <div className="relative z-20 w-full max-w-[1440px] mx-auto px-5 sm:px-12 lg:px-24 text-center flex flex-col items-center justify-center my-auto py-6 sm:py-8">
        
        {/* Main Bienvenida Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.15] sm:leading-[1.12] mb-4 sm:mb-6 max-w-5xl drop-shadow-md"
        >
          Bienvenidos a nuestra <br className="hidden sm:block" />
          <span className="font-normal text-slate-200">comunidad de fe</span>
        </motion.h1>

        {/* Subtitle / Welcome text */}
        <motion.p 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm sm:text-xl text-slate-200 font-normal leading-relaxed max-w-3xl mb-8 sm:mb-10 text-center drop-shadow-sm"
        >
          Les damos la más cordial bienvenida a la Iglesia Metodista Pentecostal de Chile en Pulmahue. Un lugar de encuentro donde compartimos el amor de Jesucristo, la adoración y el servicio a nuestra comunidad.
        </motion.p>

        {/* Centered Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xl"
        >
          <a
            href="#noticias"
            onClick={(e) => handleNavClick(e, '#noticias')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:px-9 sm:py-4 text-xs font-bold uppercase tracking-wider text-white bg-[#142742] hover:bg-[#1e3a5f] border border-[#1e3a5f] transition-all rounded-full shadow-lg shadow-[#142742]/50 active:scale-95"
          >
            Ver Noticias
            <ArrowRight className="w-4 h-4 text-white" />
          </a>

          <a
            href="#servicios"
            onClick={(e) => handleNavClick(e, '#servicios')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:px-9 sm:py-4 text-xs font-semibold uppercase tracking-wider text-slate-200 bg-slate-950/80 border border-slate-800 hover:bg-slate-900 hover:text-white transition-all rounded-full active:scale-95 backdrop-blur-md"
          >
            Horarios de Culto
          </a>
        </motion.div>

      </div>

      {/* Bottom Bar: Editorial News Drawer Card */}
      <div className="relative z-20 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-2 pb-4">
        {latestNews.length > 0 && currentSlide?.titulo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => navigate(`/noticia/${currentSlide.id}`)}
            className="group cursor-pointer w-full max-w-2xl mx-auto flex items-center justify-between gap-4 p-2.5 sm:p-3.5 rounded-2xl bg-slate-950/85 border border-slate-800/90 hover:border-slate-700 transition-all backdrop-blur-md shadow-2xl"
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              {/* Category Badge */}
              <div className="px-3.5 py-1.5 rounded-xl bg-[#1e3a5f] text-white text-[10px] font-bold uppercase tracking-wider shrink-0 flex items-center gap-2 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] animate-pulse" />
                <span>Última Noticia</span>
              </div>

              {/* News Title */}
              <span className="text-xs sm:text-sm text-slate-200 group-hover:text-white transition-colors truncate font-semibold">
                {currentSlide.titulo}
              </span>
            </div>

            {/* Read CTA & Mobile Navigation Arrows */}
            <div className="flex items-center gap-3 shrink-0">
              {slides.length > 1 && (
                <div className="flex items-center gap-1.5 lg:hidden">
                  <button 
                    onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 active:text-white transition-colors"
                    aria-label="Anterior"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 active:text-white transition-colors"
                    aria-label="Siguiente"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-[#60a5fa] group-hover:text-white transition-colors pr-2">
                <span>Leer noticia</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </motion.div>
        )}
      </div>

    </section>
  );
}

