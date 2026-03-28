import React, { useState, useEffect } from 'react';
import { contactInfo, navLinks } from '../../data/siteData';
import { MapPin, Mail, Phone } from 'lucide-react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const socialIcons = {
  Facebook: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  Instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  YouTube: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
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

  return (
    <footer className="bg-slate-900 text-slate-400">

      {/* ── Top accent line ── */}
      <div className="h-1 w-full bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800" />

      {/* ── Main body ── */}
      <div className="max-w-[1400px] mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">

          {/* Column 1 – Brand */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="font-sans font-bold text-xl text-white tracking-tight mb-1">IMPCH Pulmahue</p>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Iglesia Metodista Pentecostal de Chile</p>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Una comunidad de fe comprometida con el evangelio, la familia y el servicio en la región de La Araucanía.
            </p>
            {/* Social icons */}
            {socials.length > 0 && (
              <div className="flex items-center gap-3 pt-2">
                {socials.map(({ href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="flex items-center justify-center w-10 h-10 border border-slate-700 text-slate-500 hover:text-white hover:border-slate-400 bg-slate-800 hover:bg-slate-700 transition-colors duration-200"
                  >
                    {label === 'Facebook' && socialIcons.Facebook}
                    {label === 'Instagram' && socialIcons.Instagram}
                    {label === 'YouTube' && socialIcons.YouTube}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Column 2 – Navigation */}
          <div className="flex flex-col gap-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300 border-b border-slate-800 pb-3">
              Navegación
            </p>
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm text-slate-500 hover:text-slate-200 transition-colors duration-200 w-fit"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 3 – Contact */}
          <div className="flex flex-col gap-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300 border-b border-slate-800 pb-3">
              Contacto
            </p>
            <div className="flex flex-col gap-5">
              <a
                href="https://maps.google.com/?q=IMPCH+Pulmahue"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 text-sm text-slate-500 hover:text-slate-200 transition-colors duration-200"
              >
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{contactInfo.direccion}</span>
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                className="group flex items-center gap-3 text-sm text-slate-500 hover:text-slate-200 transition-colors duration-200"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span>{contactInfo.email}</span>
              </a>
              <a
                href={`tel:${contactInfo.telefono.replace(/\s+/g, '')}`}
                className="group flex items-center gap-3 text-sm text-slate-500 hover:text-slate-200 transition-colors duration-200"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>{contactInfo.telefono}</span>
              </a>
            </div>

            {/* Horarios Dinámicos */}
            <DynamicSchedules />
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-slate-800">
        <div className="max-w-[1400px] mx-auto px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-600">
            © {new Date().getFullYear()} IMPCH Pulmahue. Todos los derechos reservados.
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-700">
            Padre Las Casas, La Araucanía · Chile
          </span>
        </div>
      </div>

    </footer>
  );
}

// Componente para cargar y mostrar horarios dinámicamente
function DynamicSchedules() {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    // Escucha en tiempo real (Real-time updates)
    const unsubscribe = onSnapshot(doc(db, 'config', 'schedules'), (snap) => {
      if (snap.exists()) {
        setSchedules(snap.data().items || []);
      }
    }, (error) => {
      console.error('Error fetching real-time schedules:', error);
    });

    return () => unsubscribe();
  }, []);

  if (schedules.length === 0) return null;

  return (
    <div className="mt-2 space-y-3">
      {schedules
        .filter(item => item.dia.toLowerCase().includes('doming'))
        .map((item, index) => (
          <div key={index} className="p-3 bg-slate-800/50 border border-slate-800 rounded-lg">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">{item.dia}</p>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-slate-300 font-medium">{item.servicio}</span>
              <span className="text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{item.hora}</span>
            </div>
          </div>
        ))}
    </div>
  );
}
