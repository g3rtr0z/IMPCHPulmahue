import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { navLinks } from '../../data/siteData';
import LogoIcon from './LogoIcon';
import { User, Menu } from 'lucide-react';

export default function Header() {
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      if (window.location.pathname === '/') {
        // Normal hash navigation is handled by the browser if it's just an anchor link
      } else {
        e.preventDefault();
        navigate('/' + href);
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-[100] w-full transition-all duration-300 border-b ${isScrolled
        ? 'bg-white/85 backdrop-blur-xl shadow-sm border-slate-200/50 py-3'
        : 'bg-white border-transparent py-5'
        }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between gap-8 transition-all duration-300">
        <a
          href="/"
          onClick={(e) => { e.preventDefault(); navigate('/'); }}
          className="flex items-center gap-3 text-impch-primary no-underline hover:no-underline group"
        >
          <div className="transform transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
            <LogoIcon />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-xl leading-none text-slate-900 text-nowrap tracking-tight group-hover:text-impch-primary transition-colors">IMPCH Pulmahue</span>
            <span className="text-[11px] text-slate-500 font-medium tracking-widest uppercase mt-1">Viviendo en la fe</span>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`text-[0.95rem] font-semibold no-underline relative py-2 transition-colors duration-200 group ${link.active
                ? 'text-impch-primary'
                : 'text-slate-600 hover:text-impch-primary'
                }`}
            >
              {link.label}
              <span
                className={`absolute left-0 bottom-0 w-full h-0.5 rounded-full transition-all duration-300 ${link.active
                  ? 'bg-impch-primary scale-x-100 opacity-100'
                  : 'bg-impch-primary scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'
                  }`}
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {!currentUser ? (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center justify-center p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-impch-primary hover:text-white transition-all duration-300 border border-slate-200 hover:border-impch-primary hover:shadow-soft hover:-translate-y-0.5"
              title="Acceso Staff"
            >
              <User className="w-[1.125rem] h-[1.125rem]" />
            </button>
          ) : (
            <button
              onClick={() => {
                if (userRole === 'admin') window.location.href = '/admin';
                else if (userRole === 'pastor') window.location.href = '/pastor';
                else if (userRole === 'comunicaciones') window.location.href = '/comunicaciones';
                else {
                  logout().then(() => { window.location.href = '/login'; });
                }
              }}
              className="flex items-center justify-center p-2.5 bg-impch-primary/10 text-impch-primary rounded-xl hover:bg-impch-primary hover:text-white transition-all duration-300 border border-impch-primary/20 hover:shadow-soft hover:-translate-y-0.5 relative group"
              title="Ir al panel"
            >
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-impch-accent opacity-40"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-impch-accent border-2 border-white"></span>
              </span>
              <User className="w-[1.125rem] h-[1.125rem]" />
            </button>
          )}

          {/* Simple Mobile Menu Button Header Icon */}
          <button className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
