import PrayerForm from './PrayerForm';

export default function Contact() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden border-t border-slate-200">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <span className="text-sm font-bold tracking-[0.2em] text-primary uppercase mb-4 block">Estamos para ti</span>
          <h2 className="font-serif font-bold text-slate-900 mb-6 text-[clamp(2rem,4vw,3rem)] leading-tight">
            ¿Quieres formar parte de IMPCH Pulmahue?
          </h2>
          <p className="text-slate-500 text-lg md:text-xl leading-relaxed">
            Creemos firmemente en el poder de la oración. Nuestra iglesia tiene las puertas abiertas para recibirte.
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 ring-1 ring-slate-900/5 overflow-hidden flex flex-col lg:flex-row relative">

          {/* Left Column: Form */}
          <div className="w-full lg:w-5/12 p-8 md:p-12 lg:p-16 z-10 bg-white relative shadow-2xl shadow-slate-200/30">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-primary shrink-0">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-2xl">
                  Me gustaría unirme
                </h3>
                <p className="text-sm text-slate-500 mb-0 font-medium">Déjanos tus datos de contacto.</p>
              </div>
            </div>

            <div className="flex-grow w-full">
              <PrayerForm />
            </div>
          </div>

          {/* Right Column: Interactive Map that spans fully */}
          <div className="w-full lg:w-7/12 min-h-[400px] lg:min-h-full relative bg-slate-100 overflow-hidden">
            {/* Fade overlay for seamless transition from form */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent z-10 w-24 hidden lg:block pointer-events-none"></div>

            <iframe
              title="Ubicación IMPCH Pulmahue"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=IMPCH%20Pulmahue,%20Padre%20Las%20Casas,%20Chile&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              className="absolute inset-0 w-full h-full lg:filter lg:grayscale-[20%] hover:grayscale-0 transition-all duration-1000 z-0"
            ></iframe>

            <div className="absolute bottom-8 right-8 z-20 bg-white/95 backdrop-blur-md shadow-xl ring-1 ring-slate-200 rounded-2xl p-4 flex items-center gap-4 group transition-colors cursor-default max-w-xs">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Iglesia Pulmahue</p>
                <p className="font-bold text-slate-800 text-sm leading-tight">Los Queltehues 1230, Padre Las Casas</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
