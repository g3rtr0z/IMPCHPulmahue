import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { navLinks, contactInfo } from '../../data/siteData';
import { User, Menu, X, Phone, Mail, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState(window.location.hash || '#inicio');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['inicio', 'servicios', 'departamentos', 'noticias'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveHash(`#${section}`);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNavClick = (e, href) => {
    setMobileOpen(false);
    if (href.startsWith('#')) {
      setActiveHash(href);
      if (location.pathname !== '/') {
        e.preventDefault();
        navigate('/' + href);
      }
    }
  };

  const handlePortal = () => {
    setMobileOpen(false);
    if (userRole === 'admin') window.location.href = '/admin';
    else if (userRole === 'pastor') window.location.href = '/pastor';
    else if (userRole === 'comunicaciones') window.location.href = '/comunicaciones';
    else logout().then(() => { window.location.href = '/'; });
  };

  const half = Math.ceil(navLinks.length / 2);
  const leftLinks = navLinks.slice(0, half);
  const rightLinks = navLinks.slice(half);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full z-[100] shadow-md bg-white border-b border-slate-100">
        {/* Upper Top Bar - Always Visible Navy Blue */}
        <div className="hidden lg:block bg-[#1e3a5f] text-white/90 h-8">
          <div className="max-w-[1400px] mx-auto h-full px-8 flex justify-between items-center text-[10px] uppercase tracking-widest font-semibold">
            <div className="flex gap-8">
              <span className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-impch-accent-light" />
                {contactInfo.telefono}
              </span>
              <span className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-impch-accent-light" />
                {contactInfo.email}
              </span>
            </div>
            <div className="flex gap-8">
              <span className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-impch-accent-light" />
                {contactInfo.direccion}
              </span>
              <div className="flex gap-4 border-l border-white/10 pl-4">
                <Facebook className="w-3.5 h-3.5 hover:text-impch-accent-light cursor-pointer transition-colors" />
                <Instagram className="w-3.5 h-3.5 hover:text-impch-accent-light cursor-pointer transition-colors" />
                <Youtube className="w-3.5 h-3.5 hover:text-impch-accent-light cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Header Row - Always White/Solid */}
        <div className="w-full h-20 flex justify-center py-0">
          <div className="max-w-[1400px] w-full relative flex items-center justify-between px-8 lg:px-12">

            {/* Spacer on mobile left to keep branding centered */}
            <div className="lg:hidden flex-1" />

            {/* Branding Column: Lg:Left, Max-Lg:Absolute Center */}
            <div className="flex-1 flex justify-start items-center h-full max-lg:absolute max-lg:inset-0 max-lg:justify-center pointer-events-none">
              <a
                href="/"
                onClick={(e) => { e.preventDefault(); navigate('/'); setMobileOpen(false); setActiveHash('#inicio'); }}
                className="flex items-center gap-3 lg:gap-5 group pointer-events-auto"
              >
                <img src="/logo-impch.png" alt="Logo IMPCH" className="h-10 lg:h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-110" />
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <span className="font-serif italic text-xl lg:text-2xl text-impch-primary font-bold leading-none">IMPCH</span>
                  <span className="font-sans text-[9px] lg:text-[11px] uppercase tracking-[0.35em] font-extrabold text-[#111827]">Pulmahue</span>
                </div>
              </a>
            </div>

            {/* Center Column: Full Navigation (Desktop) */}
            <nav className="hidden lg:flex items-center justify-center gap-12">
              {navLinks.map((link) => {
                const isActive = activeHash === link.href && location.pathname === '/';
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`nav-link text-[11px] font-bold uppercase tracking-[0.25em] transition-all duration-300 relative group
                      ${isActive ? 'text-impch-primary' : 'text-slate-500 hover:text-impch-primary'}`}
                  >
                    {link.label}
                    <span className={`absolute -bottom-2 left-0 w-0 h-0.5 bg-impch-primary transition-all duration-300 group-hover:w-full ${isActive ? 'w-full' : ''}`} />
                  </a>
                );
              })}
            </nav>

            {/* Right Column: Actions (Desktop) */}
            <div className="flex-1 flex items-center justify-end">
              <div className="hidden lg:flex items-center justify-end">
                <button
                  onClick={currentUser ? handlePortal : () => navigate('/login')}
                  className="flex items-center justify-center gap-2 px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest bg-impch-primary text-white hover:bg-impch-accent shadow-md transition-all duration-300 transform active:scale-95"
                >
                  <User className="w-3.5 h-3.5" />
                  {currentUser ? 'Portal' : 'Miembros'}
                </button>
              </div>

              {/* Mobile Menu Toggle - Right Side */}
              <div className="lg:hidden">
                <button className="p-2 text-slate-900" onClick={() => setMobileOpen((v) => !v)}>
                  {mobileOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] bg-slate-900/40 backdrop-blur-md lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] z-[160] bg-white flex flex-col shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between px-8 h-[80px] border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img src="/logo-impch.png" alt="Logo IMPCH" className="h-10 w-auto" />
                  <div className="flex flex-col">
                    <span className="font-serif italic text-lg text-impch-primary leading-none">IMPCH</span>
                    <span className="font-sans text-[8px] uppercase tracking-widest font-bold">Pulmahue</span>
                  </div>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-400">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-6 py-10 flex flex-col gap-2">
                {navLinks.map((link) => {
                  const isActive = activeHash === link.href && location.pathname === '/';
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`flex items-center px-6 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-all rounded-xl
                        ${isActive ? 'bg-impch-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                    >
                      {link.label}
                    </a>
                  );
                })}
              </nav>

              <div className="p-8 border-t border-slate-100">
                <button
                  onClick={currentUser ? handlePortal : () => { navigate('/login'); setMobileOpen(false); }}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-impch-primary text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl shadow-lg"
                >
                  <User className="w-4 h-4" />
                  {currentUser ? 'Ir al Portal' : 'Acceso Miembros'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
