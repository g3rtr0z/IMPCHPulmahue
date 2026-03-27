import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { navLinks } from '../../data/siteData';
import { User, Menu, X } from 'lucide-react';

export default function Header() {
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState(window.location.hash || '#inicio');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
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

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 w-full z-[100] h-[74px] flex items-center transition-all duration-500 ease-in-out border-b
          ${isScrolled 
            ? 'bg-white/95 backdrop-blur-md border-slate-200/60 shadow-md' 
            : 'bg-white border-slate-100 shadow-none'}`}
      >
        <div className="max-w-[1200px] w-full mx-auto px-6 relative h-full">
          <div className="flex items-center justify-between h-full">

            {/* Logo Section - Minimal Branding */}
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); navigate('/'); setMobileOpen(false); setActiveHash('#inicio'); }}
              className="flex items-center gap-3 text-slate-900 group z-10"
            >
              <div className="relative shrink-0">
                <img
                  src="/logo-impch.png"
                  alt="Logo IMPCH"
                  className={`transition-all duration-500 ${isScrolled ? 'h-10' : 'h-11'}`}
                />
              </div>
              <span className="font-sans font-bold text-lg leading-none tracking-tight hidden md:block text-slate-900">
                IMPCH Pulmahue
              </span>
            </a>

            {/* Mobile Centered Title */}
            <div className="absolute left-1/2 -translate-x-1/2 md:hidden z-0">
               <span className="font-sans font-bold text-lg leading-none tracking-tight whitespace-nowrap text-slate-900 ">
                IMPCH Pulmahue
              </span>
            </div>

            {/* Navigation Centered Desktop */}
            <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-10 h-full">
              {navLinks.map((link) => {
                const isActive = activeHash === link.href && location.pathname === '/';
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`relative flex items-center h-full text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 group
                      ${isActive ? 'text-impch-primary' : 'text-slate-400 hover:text-slate-900'}`}
                  >
                    {link.label}
                    {/* Active Accent Dot */}
                    <span className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-impch-primary transition-all duration-300 transform scale-0
                      ${isActive ? 'scale-100 opacity-100' : 'group-hover:scale-50 group-hover:opacity-40'}`} 
                    />
                  </a>
                );
              })}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 z-10">
              {!currentUser ? (
                <button
                  onClick={() => { navigate('/login'); setMobileOpen(false); }}
                  className="hidden lg:flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 hover:text-slate-900 transition-all duration-300 group"
                >
                  <User className="w-4 h-4" />
                  Miembros
                </button>
              ) : (
                <button
                  onClick={handlePortal}
                  className="hidden lg:flex items-center justify-center px-6 py-2.5 bg-impch-primary text-white text-[10px] uppercase tracking-widest font-bold hover:bg-impch-primary-hover shadow-sm hover:shadow-md transition-all duration-300 rounded-lg"
                >
                  Portal
                </button>
              )}

              <button
                className="lg:hidden p-2.5 text-slate-700 hover:bg-slate-50 transition-all duration-300 rounded-xl border border-transparent hover:border-slate-100"
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      <div
        className={`fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-md transition-opacity duration-300 lg:hidden ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] z-[160] bg-white border-l border-slate-200 flex flex-col shadow-2xl transition-transform duration-500 ease-in-out lg:hidden ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-8 h-[80px] border-b border-slate-100">
          <img src="/logo-impch.png" alt="Logo IMPCH" className="h-10 w-auto object-contain" />
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
                className={`flex items-center px-5 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-all rounded-xl
                  ${isActive ? 'bg-impch-primary text-white shadow-lg shadow-impch-primary/20' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="p-8 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={() => { currentUser ? handlePortal() : navigate('/login'); setMobileOpen(false); }}
            className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-impch-primary transition-all shadow-md rounded-xl"
          >
            <User className="w-4 h-4" />
            {currentUser ? 'Ir al Portal' : 'Acceso Miembros'}
          </button>
        </div>
      </div>
    </>
  );
}
