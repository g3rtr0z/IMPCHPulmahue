import PrayerForm from './PrayerForm';

export default function Contact() {
  return (
    <section className="py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4 block">
            Estamos para ti
          </span>
          <h2 className="font-sans font-bold text-slate-900 mb-6 text-3xl md:text-4xl tracking-tight">
            ¿Quieres formar parte de IMPCH Pulmahue?
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            Creemos firmemente en el poder de la oración. Nuestra iglesia tiene las puertas abiertas para recibirte.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col lg:flex-row shadow-sm">
          {/* Left Column: Form */}
          <div className="w-full lg:w-[45%] p-8 md:p-12 lg:p-14 bg-white relative">
            <div className="flex items-center gap-5 mb-10">
              <div className="w-12 h-12 bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 border border-slate-200">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <h3 className="font-sans font-bold text-slate-900 text-xl leading-tight mb-1">
                  Me gustaría unirme
                </h3>
                <p className="text-sm text-slate-500 font-medium">Déjanos tus datos de contacto.</p>
              </div>
            </div>

            <div className="flex-grow w-full">
              <PrayerForm />
            </div>
          </div>

          {/* Right Column: Interactive Map */}
          <div className="w-full lg:w-[55%] min-h-[400px] lg:min-h-full relative bg-slate-100 border-t lg:border-t-0 lg:border-l border-slate-200">
            <iframe
              title="Ubicación IMPCH Pulmahue"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=IMPCH%20Pulmahue,%20Padre%20Las%20Casas,%20Chile&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              className="absolute inset-0 w-full h-full transition-all duration-700"
            ></iframe>

            <div className="absolute bottom-6 right-6 z-20 bg-white border border-slate-200 p-4 flex items-center gap-4 shadow-md max-w-xs">
              <div className="w-10 h-10 bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Iglesia Pulmahue</p>
                <p className="font-semibold text-slate-800 text-sm leading-tight">Los Queltehues 1230, Padre Las Casas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
