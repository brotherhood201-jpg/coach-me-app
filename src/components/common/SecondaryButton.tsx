import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export interface SecondaryButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  pill?: boolean;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  icon,
  size = 'md',
  fullWidth = false,
  pill = false,
  className = '',
  disabled,
  ...props
}) => {
  const getSizeStyles = () => {
    const radius = pill ? 'rounded-full' : 'rounded-2xl';
    switch (size) {
      case 'sm':
        return `px-3.5 py-1.5 text-xs ${radius} gap-1.5`;
      case 'lg':
        return `px-6 py-3.5 text-sm font-extrabold ${radius} gap-2.5`;
      case 'md':
      default:
        return `px-4 py-2.5 text-xs font-bold ${radius} gap-2`;
    }
  };

  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      disabled={disabled}
      className={`inline-flex items-center justify-center bg-[#08111f]/65 hover:bg-[#0d1b35]/85 text-slate-300 hover:text-white border border-white/10 hover:border-[#0066ff]/45 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.5)] transition-all cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed ${getSizeStyles()} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
};

