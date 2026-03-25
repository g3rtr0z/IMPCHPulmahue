import React, { useState, useEffect } from 'react';
import { contactInfo } from '../../data/siteData';
import { MapPin, Mail, Phone } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const socialIcons = {
  Facebook: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  Instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  YouTube: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#fff" />
    </svg>
  ),
};

export default function Footer() {
  const [socials, setSocials] = useState([]);

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const docRef = doc(db, "config", "social");
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
        console.error("Error fetching social config:", err);
      }
    };
    fetchSocials();
  }, []);

  return (
    <footer className="bg-gray-900 text-white/85 py-12 px-6 border-t border-slate-800">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">

        {/* Left Section: Info */}
        <div className="flex flex-col gap-5">
          <span className="font-serif font-bold text-3xl text-white">IMPCH Pulmahue</span>

          <div className="flex flex-col gap-4 mt-2">
            <a
              href="https://maps.google.com/?q=IMPCH+Pulmahue"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center md:justify-start gap-3 text-white/70 hover:text-white transition-colors text-sm font-medium group"
            >
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-impch-primary/20 transition-colors">
                <MapPin className="w-4 h-4 text-impch-primary group-hover:scale-110 transition-transform" />
              </div>
              {contactInfo.direccion}
            </a>

            <a
              href={`mailto:${contactInfo.email}`}
              className="flex items-center justify-center md:justify-start gap-3 text-white/70 hover:text-white transition-colors text-sm font-medium group"
            >
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-impch-primary/20 transition-colors">
                <Mail className="w-4 h-4 text-impch-primary group-hover:scale-110 transition-transform" />
              </div>
              {contactInfo.email}
            </a>

            <a
              href={`tel:${contactInfo.telefono.replace(/\s+/g, '')}`}
              className="flex items-center justify-center md:justify-start gap-3 text-white/70 hover:text-white transition-colors text-sm font-medium group"
            >
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-impch-primary/20 transition-colors">
                <Phone className="w-4 h-4 text-impch-primary group-hover:scale-110 transition-transform" />
              </div>
              {contactInfo.telefono}
            </a>
          </div>
        </div>

        {/* Right Section: SocialLinks */}
        <div className="flex flex-col items-center md:items-end gap-6">
          <h4 className="font-serif font-bold text-lg text-white">Síguenos</h4>
          <div className="flex items-center justify-center md:justify-end gap-4">
            {socials.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-white/85 transition-colors hover:bg-primary hover:text-white no-underline"
              >
                {socialIcons[label] || null}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto mt-10 pt-6 border-t border-white/10 text-center flex flex-col items-center justify-center">
        <span className="text-sm text-white/50">
          © 2026 IMPCH Pulmahue. Todos los derechos reservados.
        </span>
      </div>
    </footer>
  );
}
