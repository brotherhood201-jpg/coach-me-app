import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export type GlassButtonVariant = 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost' | 'electric' | 'magenta' | 'liquid';
export type GlassButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface GlassButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: GlassButtonVariant;
  size?: GlassButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  pill?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  icon,
  variant = 'electric',
  size = 'md',
  fullWidth = false,
  loading = false,
  pill = false,
  className = '',
  disabled,
  ...props
}) => {
  const getSizeStyles = () => {
    const radius = pill ? 'rounded-full' : 'rounded-2xl';
    switch (size) {
      case 'sm':
        return `px-3.5 py-1.5 text-xs ${radius} gap-1.5 font-bold`;
      case 'lg':
        return `px-7 py-3.5 text-base font-black ${radius} gap-2.5`;
      case 'xl':
        return `px-8 py-4 text-lg font-black ${radius} gap-3 shadow-2xl`;
      case 'md':
      default:
        return `px-5 py-2.5 text-sm font-extrabold ${radius} gap-2`;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'electric':
        return 'bg-gradient-to-r from-[#0055ff] via-[#0066ff] to-[#0a84ff] text-white shadow-[0_0_30px_rgba(0,102,255,0.4)] hover:shadow-[0_0_40px_rgba(0,102,255,0.6)] border border-white/20';
      case 'magenta':
        return 'bg-gradient-to-r from-[#7c3aed] via-[#d946ef] to-[#ec4899] text-white shadow-[0_0_28px_rgba(217,70,239,0.35)] hover:shadow-[0_0_38px_rgba(217,70,239,0.5)] border border-white/20';
      case 'liquid':
        return 'bg-[#08111f]/80 hover:bg-[#0d1b35]/85 text-white border border-white/15 backdrop-blur-2xl shadow-[0_12px_35px_rgba(0,0,0,0.65),0_0_20px_rgba(0,102,255,0.12)] hover:border-[#0066ff]/45';
      case 'primary':
        return 'bg-gradient-to-r from-[#0055ff] via-[#0066ff] to-[#0a84ff] text-white shadow-[0_0_26px_rgba(0,102,255,0.4)] hover:shadow-[0_0_36px_rgba(0,102,255,0.55)] border border-white/20';
      case 'accent':
        return 'bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white shadow-[0_0_20px_rgba(124,58,237,0.35)] border border-white/20';
      case 'secondary':
        return 'bg-[#08111f]/65 hover:bg-[#0d1b35]/85 text-zinc-200 hover:text-white border border-white/[0.1] backdrop-blur-xl shadow-md hover:border-[#0066ff]/40';
      case 'danger':
        return 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.35)] border border-rose-400/30';
      case 'ghost':
        return 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent';
    }
  };

  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      disabled={disabled || loading}
      className={`relative inline-flex items-center justify-center transition-all cursor-pointer select-none overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${getSizeStyles()} ${getVariantStyles()} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
      {loading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {children}
          {icon && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </motion.button>
  );
};

