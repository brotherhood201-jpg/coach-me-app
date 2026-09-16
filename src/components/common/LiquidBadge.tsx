import React from 'react';

export interface LiquidBadgeProps {
  children: React.ReactNode;
  variant?: 'electric' | 'violet' | 'magenta' | 'coral' | 'neutral' | 'emerald';
  icon?: React.ReactNode;
  pulse?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * LiquidBadge: Minimal glass pill for live status, tags, and category indicators
 */
export const LiquidBadge: React.FC<LiquidBadgeProps> = ({
  children,
  variant = 'electric',
  icon,
  pulse = false,
  size = 'md',
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'violet':
        return 'bg-[#7c3aed]/15 text-purple-200 border-[#7c3aed]/35 shadow-[0_0_12px_rgba(124,58,237,0.25)]';
      case 'magenta':
        return 'bg-[#d946ef]/15 text-fuchsia-200 border-[#d946ef]/35 shadow-[0_0_12px_rgba(217,70,239,0.25)]';
      case 'coral':
        return 'bg-[#fb7185]/15 text-rose-200 border-[#fb7185]/35 shadow-[0_0_12px_rgba(251,113,133,0.25)]';
      case 'emerald':
        return 'bg-[#10b981]/15 text-emerald-200 border-[#10b981]/35 shadow-[0_0_12px_rgba(16,185,129,0.25)]';
      case 'neutral':
        return 'bg-white/[0.05] text-zinc-300 border-white/10';
      case 'electric':
      default:
        return 'bg-[#0066ff]/15 text-sky-200 border-[#0066ff]/35 shadow-[0_0_12px_rgba(0,102,255,0.25)]';
    }
  };

  const getSizeStyles = () => {
    return size === 'sm'
      ? 'px-2.5 py-0.5 text-[11px] gap-1'
      : 'px-3 py-1 text-xs gap-1.5';
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-bold rounded-full border backdrop-blur-md select-none ${getSizeStyles()} ${getVariantStyles()} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="whitespace-nowrap">{children}</span>
    </span>
  );
};
