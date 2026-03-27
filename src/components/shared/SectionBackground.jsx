import React from 'react';
import { motion } from 'framer-motion';

/**
 * Shared Background Component
 * Provides a premium, animated mesh gradient and dots grid to any section.
 * Usage: Place at the top of a 'relative' section.
 */
const SectionBackground = ({ variant = 'light' }) => {
  const isDark = variant === 'dark';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {/* 1. Subtle Dots Grid */}
      <div 
        className={`absolute inset-0 opacity-[0.15] ${isDark ? 'bg-slate-900' : 'bg-transparent'}`}
        style={{
          backgroundImage: `radial-gradient(${isDark ? '#334155' : '#cbd5e1'} 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* 2. Animated Mesh Glows (Orbs) */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-[0.3]
          ${isDark ? 'bg-impch-primary' : 'bg-impch-accent-light'}`}
      />

      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-[0.25]
          ${isDark ? 'bg-slate-800' : 'bg-blue-200'}`}
      />

      {/* 3. Global Vignette for depth */}
      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-transparent via-transparent to-slate-900/40' : 'bg-gradient-to-b from-white/20 via-transparent to-slate-50'}`} />
    </div>
  );
};

export default SectionBackground;
