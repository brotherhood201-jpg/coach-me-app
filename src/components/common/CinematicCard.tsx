import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export interface CinematicCardProps extends HTMLMotionProps<'div'> {
  imageUrl: string;
  imageAlt?: string;
  title: string;
  subtitle?: string;
  tag?: string;
  badge?: React.ReactNode;
  actionButton?: React.ReactNode;
  aspectRatio?: 'video' | 'portrait' | 'square' | 'auto';
  height?: string;
  overlayGradient?: 'dark' | 'electric' | 'violet' | 'sunset';
  interactive?: boolean;
  className?: string;
}

/**
 * CinematicCard: Large full-bleed photography with editorial typography,
 * deep atmospheric gradient overlays, and liquid glass elements.
 */
export const CinematicCard: React.FC<CinematicCardProps> = ({
  imageUrl,
  imageAlt = '',
  title,
  subtitle,
  tag,
  badge,
  actionButton,
  aspectRatio = 'video',
  height,
  overlayGradient = 'dark',
  interactive = true,
  className = '',
  ...motionProps
}) => {
  const getAspectRatio = () => {
    if (height) return '';
    switch (aspectRatio) {
      case 'portrait':
        return 'aspect-[4/5]';
      case 'square':
        return 'aspect-square';
      case 'auto':
        return '';
      case 'video':
      default:
        return 'aspect-[16/9] sm:aspect-[21/9]';
    }
  };

  const getOverlayGradient = () => {
    switch (overlayGradient) {
      case 'electric':
        return 'bg-gradient-to-t from-[#05070d] via-[#05070d]/80 to-[#0066ff]/20';
      case 'violet':
        return 'bg-gradient-to-t from-[#05070d] via-[#05070d]/80 to-[#7c3aed]/20';
      case 'sunset':
        return 'bg-gradient-to-t from-[#05070d] via-[#05070d]/80 to-[#f43f5e]/20';
      case 'dark':
      default:
        return 'bg-gradient-to-t from-[#05070d] via-[#05070d]/70 to-transparent';
    }
  };

  return (
    <motion.div
      whileHover={interactive ? { scale: 1.01 } : undefined}
      whileTap={interactive ? { scale: 0.99 } : undefined}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`relative w-full rounded-[32px] overflow-hidden border border-white/[0.08] shadow-[0_24px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(0,102,255,0.08)] group select-none ${getAspectRatio()} ${className}`}
      style={height ? { height } : undefined}
      dir="rtl"
      {...motionProps}
    >
      {/* Background Image */}
      <img
        src={imageUrl}
        alt={imageAlt || title}
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Atmospheric Gradient Overlays */}
      <div className={`absolute inset-0 ${getOverlayGradient()}`} />
      <div className="absolute inset-0 bg-gradient-to-r from-[#05070d]/90 via-[#05070d]/40 to-transparent pointer-events-none" />

      {/* Top Sheen */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none z-10" />

      {/* Top Meta Bar */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20 pointer-events-auto">
        {tag ? (
          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-[#08111f]/80 backdrop-blur-md text-sky-300 border border-sky-400/30 shadow-md">
            {tag}
          </span>
        ) : <div />}
        {badge && <div>{badge}</div>}
      </div>

      {/* Bottom Editorial Content */}
      <div className="absolute bottom-0 inset-x-0 p-5 sm:p-7 z-20 flex flex-col justify-end gap-2">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-md">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed line-clamp-2 max-w-xl drop-shadow">
            {subtitle}
          </p>
        )}

        {actionButton && (
          <div className="mt-2 pt-1">{actionButton}</div>
        )}
      </div>
    </motion.div>
  );
};
