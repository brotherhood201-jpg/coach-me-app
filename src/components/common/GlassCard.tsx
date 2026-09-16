import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'accent' | 'subtle' | 'liquid' | 'electric' | 'cinematic';
  interactive?: boolean;
  sheen?: boolean;
  glow?: 'none' | 'electric' | 'violet' | 'magenta';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  variant = 'default',
  interactive = false,
  sheen = true,
  glow = 'none',
  ...motionProps
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'liquid':
        return 'bg-[#08111f]/75 border-white/[0.09] shadow-[0_16px_45px_rgba(0,0,0,0.65),0_0_20px_rgba(0,102,255,0.08)]';
      case 'electric':
        return 'bg-gradient-to-br from-[#08111f]/92 via-[#0d1b35]/85 to-[#08111f]/90 border-[#0066ff]/35 shadow-[0_20px_50px_rgba(0,0,0,0.70),0_0_30px_rgba(0,102,255,0.20)]';
      case 'cinematic':
        return 'bg-[#05070d]/85 border-white/[0.08] shadow-[0_24px_60px_rgba(0,0,0,0.85)]';
      case 'elevated':
        return 'bg-[#0d1b35]/85 border-white/[0.11] shadow-[0_24px_60px_rgba(0,0,0,0.80),0_0_30px_rgba(0,102,255,0.12)]';
      case 'accent':
        return 'bg-gradient-to-br from-[#0d152b]/90 via-[#0d1b35]/85 to-[#120d2b]/85 border-violet-500/30 shadow-[0_18px_45px_rgba(0,0,0,0.70),0_0_25px_rgba(124,58,237,0.12)]';
      case 'subtle':
        return 'bg-[#08111f]/45 border-white/[0.05] shadow-none';
      case 'default':
      default:
        return 'bg-[#08111f]/70 border-white/[0.08] shadow-[0_16px_45px_rgba(0,0,0,0.60),0_0_20px_rgba(0,102,255,0.06)]';
    }
  };

  const getGlowStyles = () => {
    switch (glow) {
      case 'electric':
        return 'shadow-[0_0_35px_rgba(0,102,255,0.35)]';
      case 'violet':
        return 'shadow-[0_0_30px_rgba(124,58,237,0.25)]';
      case 'magenta':
        return 'shadow-[0_0_30px_rgba(217,70,239,0.25)]';
      case 'none':
      default:
        return '';
    }
  };

  return (
    <motion.div
      whileHover={interactive ? { scale: 1.01, borderColor: 'rgba(0, 102, 255, 0.45)' } : undefined}
      whileTap={interactive ? { scale: 0.99 } : undefined}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`relative backdrop-blur-2xl rounded-[28px] border overflow-hidden transition-colors ${getVariantStyles()} ${getGlowStyles()} ${
        interactive ? 'cursor-pointer' : ''
      } ${className}`}
      {...motionProps}
    >
      {/* Subtle Specular Top Sheen */}
      {sheen && (
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-10" />
      )}
      {children}
    </motion.div>
  );
};

