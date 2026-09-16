import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export interface PrimaryButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'cyan' | 'electric' | 'glass' | 'danger' | 'electricBlue' | 'violetMagenta' | 'sunsetCoral' | 'liquidGlass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  pill?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  icon,
  variant = 'electricBlue',
  size = 'md',
  fullWidth = false,
  loading = false,
  pill = false,
  className = '',
  disabled,
  ...props
}) => {
  const getSizeStyles = () => {
    const radius = pill ? 'rounded-full' : 'rounded-[20px]';
    switch (size) {
      case 'sm':
        return `px-4 py-2 text-xs ${radius} gap-1.5 font-bold`;
      case 'lg':
        return `px-7 py-3.5 text-base font-black ${radius} gap-2.5`;
      case 'xl':
        return `px-8 py-4 text-lg font-black ${radius} gap-3 shadow-2xl`;
      case 'md':
      default:
        return `px-5 py-3 text-sm font-extrabold ${radius} gap-2`;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'electricBlue':
        return 'bg-gradient-to-r from-[#0055ff] via-[#0066ff] to-[#0a84ff] text-white shadow-[0_0_30px_rgba(0,102,255,0.45)] hover:shadow-[0_0_40px_rgba(0,102,255,0.65)] border border-white/20';
      case 'violetMagenta':
        return 'bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-[#d946ef] text-white shadow-[0_0_30px_rgba(124,58,237,0.40)] hover:shadow-[0_0_40px_rgba(217,70,239,0.55)] border border-white/20';
      case 'sunsetCoral':
        return 'bg-gradient-to-r from-[#d946ef] via-[#f43f5e] to-[#fb923c] text-white shadow-[0_0_28px_rgba(244,63,94,0.40)] border border-white/20';
      case 'liquidGlass':
        return 'bg-[#08111f]/80 backdrop-blur-2xl text-white border border-white/15 hover:bg-[#0d1b35]/85 hover:border-[#0066ff]/50 shadow-[0_12px_35px_rgba(0,0,0,0.65),0_0_20px_rgba(0,102,255,0.12)]';
      case 'electric':
        return 'bg-gradient-to-r from-[#0055ff] via-[#0066ff] to-[#38bdf8] text-white shadow-[0_0_30px_rgba(0,102,255,0.45)] hover:shadow-[0_0_40px_rgba(0,102,255,0.65)] border border-white/20';
      case 'glass':
        return 'bg-[#0d1b35]/85 text-blue-200 border border-blue-500/30 hover:bg-[#112244] hover:border-blue-400/50 shadow-lg';
      case 'danger':
        return 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-[0_0_25px_rgba(244,63,94,0.35)] border border-rose-400/30';
      case 'cyan':
      default:
        return 'bg-gradient-to-r from-[#0055ff] via-[#0066ff] to-[#0a84ff] hover:from-[#0047d4] hover:to-[#0066ff] text-white shadow-[0_0_28px_rgba(0,102,255,0.4)] border border-white/20';
    }
  };

  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      disabled={disabled || loading}
      className={`relative inline-flex items-center justify-center font-black transition-all cursor-pointer select-none overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${getSizeStyles()} ${getVariantStyles()} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {/* Micro Specular Highlight */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
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

