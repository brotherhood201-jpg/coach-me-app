import React from 'react';
import { motion } from 'motion/react';
import { DotMatrixNumber } from './DotMatrixNumber';

export interface GlassChipProps {
  label: string;
  selected?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
  onClick?: () => void;
  variant?: 'default' | 'rose' | 'emerald' | 'amber' | 'electric' | 'violet' | 'magenta' | 'coral';
  size?: 'sm' | 'md' | 'lg';
  pill?: boolean;
  dot?: boolean;
  className?: string;
}

export const GlassChip: React.FC<GlassChipProps> = ({
  label,
  selected = false,
  icon,
  badge,
  onClick,
  variant = 'default',
  size = 'md',
  pill = true,
  dot = false,
  className = '',
}) => {
  const getVariantStyles = () => {
    if (!selected) {
      return 'bg-[#08111f]/65 text-slate-300 border-white/[0.08] hover:text-white hover:bg-[#0d1b35]/80 hover:border-white/15 shadow-sm';
    }

    switch (variant) {
      case 'electric':
        return 'bg-[#0066ff]/20 text-sky-200 border-[#0066ff]/50 shadow-[0_0_20px_rgba(0,102,255,0.35)] font-bold';
      case 'violet':
        return 'bg-[#7c3aed]/20 text-purple-200 border-[#7c3aed]/50 shadow-[0_0_20px_rgba(124,58,237,0.35)] font-bold';
      case 'magenta':
        return 'bg-[#d946ef]/20 text-fuchsia-200 border-[#d946ef]/50 shadow-[0_0_20px_rgba(217,70,239,0.35)] font-bold';
      case 'coral':
        return 'bg-[#fb7185]/20 text-rose-200 border-[#fb7185]/50 shadow-[0_0_18px_rgba(251,113,133,0.35)] font-bold';
      case 'rose':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_16px_rgba(244,63,94,0.3)] font-bold';
      case 'emerald':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_16px_rgba(16,185,129,0.3)] font-bold';
      case 'amber':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_16px_rgba(245,158,11,0.3)] font-bold';
      case 'default':
      default:
        return 'bg-[#0066ff]/20 text-sky-200 border-[#0066ff]/45 shadow-[0_0_18px_rgba(0,102,255,0.3)] font-bold';
    }
  };

  const getSizeStyles = () => {
    const radius = pill ? 'rounded-full' : 'rounded-2xl';
    switch (size) {
      case 'sm':
        return `px-3 py-1.5 text-xs ${radius} gap-1.5`;
      case 'lg':
        return `px-5 py-2.5 text-sm ${radius} gap-2.5`;
      case 'md':
      default:
        return `px-4 py-2 text-xs ${radius} gap-2`;
    }
  };

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className={`inline-flex items-center justify-center border transition-all cursor-pointer select-none shrink-0 backdrop-blur-xl ${getSizeStyles()} ${getVariantStyles()} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            selected ? 'bg-current shadow-[0_0_8px_currentColor]' : 'bg-zinc-500'
          }`}
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="whitespace-nowrap font-medium">{label}</span>
      {badge !== undefined && (
        <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/10 text-white flex items-center">
          <DotMatrixNumber value={badge} size="2xs" glow="none" color="white" />
        </span>
      )}
    </motion.button>
  );
};

