import React, { useState, useEffect } from 'react';
import { contactInfo, navLinks } from '../../data/siteData';
import { MapPin, Mail, Phone, ArrowUp } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const socialIcons = {
  Facebook: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  Instagram: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  YouTube: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#fff" />
    </svg>
  ),
};

export default function Footer() {
  const [socials, setSocials] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const docRef = doc(db, 'config', 'social');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const activeSocials = [];
          if (data.facebook) activeSocials.push({ label: 'Facebook', href: data.facebook });
          if (data.instagram) activeSocials.push({ label: 'Instagram', href: data.instagram });
          if (data.youtube) activeSocials.push({ label: 'YouTube', href: data.youtube });
          setSocials(activeSocials);
        }
      } catch (err) {
        console.error('Error fetching social config:', err);
      }
    };
    fetchSocials();
  }, []);

  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      if (window.location.pathname !== '/') {
        navigate('/' + href);
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 pt-12 pb-8">
        
        {/* Top Header & Navigation Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-900">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">IMPCH Pulmahue</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Iglesia Metodista Pentecostal de Chile • Padre Las Casas</p>
          </div>

          {/* Nav links inline */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Middle Info & Social Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6 items-center text-xs">
          
          {/* Contact Details */}
          <div className="md:col-span-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-slate-400">
            <a
              href="https://maps.google.com/?q=IMPCH+Pulmahue"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-slate-200 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-impch-accent-light shrink-0" />
              <span>{contactInfo.direccion}</span>
            </a>
            
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex items-center gap-2 hover:text-slate-200 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-impch-accent-light shrink-0" />
              <span>{contactInfo.email}</span>
            </a>

            <a
              href={`tel:${contactInfo.telefono.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 hover:text-slate-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-impch-accent-light shrink-0" />
              <span>{contactInfo.telefono}</span>
            </a>
          </div>

          {/* Social Icons & Back to top */}
          <div className="md:col-span-4 flex items-center justify-start md:justify-end gap-2.5">
            {socials.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                {label === 'Facebook' && socialIcons.Facebook}
                {label === 'Instagram' && socialIcons.Instagram}
                {label === 'YouTube' && socialIcons.YouTube}
              </a>
            ))}

            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
              aria-label="Volver arriba"
              title="Volver arriba"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-6 border-t border-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-medium">
          <span>© {new Date().getFullYear()} IMPCH Pulmahue. Todos los derechos reservados.</span>
          <span>Padre Las Casas, La Araucanía · Chile</span>
        </div>

      </div>
    </footer>
  );
}
