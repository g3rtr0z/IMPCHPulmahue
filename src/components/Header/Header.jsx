import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { navLinks } from '../../data/siteData';
import { User, Menu, X } from 'lucide-react';

export default function Header() {
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Block body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNavClick = (e, href) => {
    setMobileOpen(false);
    if (href.startsWith('#')) {
      if (window.location.pathname !== '/') {
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
    else logout().then(() => { window.location.href = '/login'; });
  };

  return (
    <>
      {/* ── Top bar ── */}
      <header
        className={`fixed top-0 left-0 right-0 w-full z-[100] bg-white border-b border-slate-200 transition-all duration-300 ease-in-out ${isScrolled ? 'py-2 shadow-sm' : 'py-3'
          }`}
      >
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 relative">
          <div className="flex items-center justify-between">

            {/* Logo and Desktop Title */}
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); navigate('/'); setMobileOpen(false); }}
              className="flex items-center gap-3 text-slate-900 hover:text-slate-600 transition-colors duration-300 z-10"
            >
              <img
                src="/logo-impch.png"
                alt="Logo IMPCH Pulmahue"
                className="h-14 w-auto object-contain"
              />
              <span className="font-sans font-bold text-lg leading-none tracking-tight hidden md:block">
                IMPCH Pulmahue
              </span>
            </a>

            {/* Mobile Centered Title */}
            <span className="absolute left-1/2 -translate-x-1/2 font-sans font-bold text-lg leading-none tracking-tight block md:hidden whitespace-nowrap text-slate-900 z-0">
              IMPCH Pulmahue
            </span>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-[11px] font-semibold uppercase tracking-[0.2em] no-underline transition-colors duration-300 ${link.active ? 'text-slate-900' : 'text-slate-400 hover:text-slate-900'
                    }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3 z-10">
              {/* Portal / Login button — always visible */}
              {!currentUser ? (
                <button
                  onClick={() => { navigate('/login'); setMobileOpen(false); }}
                  className="hidden lg:flex items-center justify-center p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-300"
                  title="Acceso Miembros"
                >
                  <User className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handlePortal}
                  className="hidden lg:flex items-center justify-center px-5 py-2 bg-slate-900 text-white text-[11px] uppercase tracking-widest font-semibold hover:bg-slate-700 transition-colors duration-300"
                >
                  Portal
                </button>
              )}

              {/* Hamburger — mobile only */}
              <button
                className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 transition-colors duration-300"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Abrir menú"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer overlay ── */}
      <div
        className={`fixed inset-0 z-[90] bg-slate-900/40 transition-opacity duration-300 lg:hidden ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── Mobile drawer ── */}
      <div
        className={`fixed top-0 right-0 h-full w-72 max-w-[85vw] z-[95] bg-white border-l border-slate-200 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <img src="/logo-impch.png" alt="Logo IMPCH" className="h-12 w-auto object-contain" />
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="flex items-center px-4 py-3.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Portal button at the bottom */}
        <div className="p-4 border-t border-slate-100">
          {!currentUser ? (
            <button
              onClick={() => { navigate('/login'); setMobileOpen(false); }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white text-sm font-semibold tracking-wide hover:bg-slate-700 transition-colors"
            >
              <User className="w-4 h-4" />
              Acceso Miembros
            </button>
          ) : (
            <button
              onClick={handlePortal}
              className="w-full py-3 bg-slate-900 text-white text-sm font-semibold tracking-wide hover:bg-slate-700 transition-colors"
            >
              Ir al Portal
            </button>
          )}
        </div>
      </div>
    </>
  );
}
