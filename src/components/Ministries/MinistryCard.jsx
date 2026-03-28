import React from 'react';
import { motion } from 'framer-motion';
import { User, Clock, ChevronRight } from 'lucide-react';

/**
 * Modern Ministry Card V2: Vertical Grid Design
 * Focused on premium aesthetics with glassmorphism and smooth reveals.
 */
function MinistryCard({ m, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative h-[450px] rounded-3xl overflow-hidden bg-slate-900 border border-white/5 shadow-2xl"
        >
            {/* Background Image with Hover Scaling */}
            <div className="absolute inset-0 z-0">
                <img
                    src={m.imagen}
                    alt={m.titulo}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
            </div>

            {/* Vertical "Branch" Accent Line */}
            <div 
                className="absolute left-0 top-0 bottom-0 w-1.5 bg-impch-primary z-10 transition-all duration-500 group-hover:w-2"
                style={{ height: '30%' }} // Initially short like a sprout
            />

            {/* Content Container */}
            <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                {/* Header Info */}
                <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-3">
                        {m.subtitulo}
                    </span>
                    <h3 className="text-3xl font-serif font-bold text-white mb-2 leading-tight">
                        {m.titulo}
                    </h3>
                </div>

                {/* Info Panel: Slide up on hover */}
                <div className="relative overflow-hidden">
                    <div className="transition-all duration-500 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 flex flex-col">
                        <p className="text-slate-300 text-sm mb-6 line-clamp-3 leading-relaxed font-light italic">
                            "{m.descripcion}"
                        </p>
                        
                        <div className="flex flex-col gap-3 border-t border-white/10 pt-4 mb-4">
                            <div className="flex items-center gap-2 text-white/70">
                                <User className="w-3.5 h-3.5 text-impch-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">{m.detalle.lider || "Responsable"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/70">
                                <Clock className="w-3.5 h-3.5 text-impch-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">{m.detalle.horario}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar / Action */}
                <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
                    <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-white/50 group-hover:text-white transition-colors">
                        Saber más
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-impch-primary transition-all duration-300">
                        <ChevronRight className="w-4 h-4 text-white" />
                    </div>
                </div>
            </div>

            {/* Overlay for better text readability on top */}
            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors pointer-events-none" />
        </motion.div>
    );
}

export default MinistryCard;
