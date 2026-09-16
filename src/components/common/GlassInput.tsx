import React from 'react';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  hint?: string;
}

export const GlassInput: React.FC<GlassInputProps> = ({
  label,
  error,
  icon,
  hint,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

  return (
    <div className="w-full space-y-1.5 text-right" dir="rtl">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-bold text-zinc-300">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          className={`w-full bg-[#08111f]/85 text-white placeholder-zinc-500 text-sm font-medium py-3 px-4 rounded-2xl border border-white/[0.09] focus:border-[#0066ff] focus:outline-none focus:ring-2 focus:ring-[#0066ff]/25 transition-all backdrop-blur-xl shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)] ${
            icon ? 'pr-11' : ''
          } ${error ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20' : ''} ${className}`}
          {...props}
        />

        {icon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>

      {hint && !error && (
        <p className="text-[11px] text-zinc-400 font-medium">{hint}</p>
      )}

      {error && (
        <p className="text-[11px] text-rose-400 font-bold">{error}</p>
      )}
    </div>
  );
};
