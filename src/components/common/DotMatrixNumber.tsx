import React from 'react';

export interface DotMatrixNumberProps {
  /** The numeric value or string to display. If omitted, children is used. */
  value?: string | number;
  /** Children can be string, number, or React nodes */
  children?: React.ReactNode;
  /** Optional unit/label displayed beside the number (e.g. 'kcal', 'kg', 'لیوان', 'تکرار') */
  unit?: string;
  /** Predefined size step */
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'hero';
  /** Luminous glow color effect */
  glow?: 'none' | 'white' | 'blue' | 'electric' | 'cyan' | 'violet' | 'rose' | 'amber' | 'emerald';
  /** Text color */
  color?: 'white' | 'blue' | 'electric' | 'cyan' | 'violet' | 'rose' | 'amber' | 'emerald' | 'gradient' | 'muted' | 'current';
  /** Dot matrix font weight (defaults to 600) */
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  /** Container extra classes */
  className?: string;
  /** Extra classes directly on the dot-matrix numeral */
  numberClassName?: string;
  /** Extra classes directly on the unit label */
  unitClassName?: string;
  /** Put unit first (useful in certain RTL contexts) */
  unitFirst?: boolean;
  /** Layout mode: inline or inline-flex (default inline-flex) */
  inline?: boolean;
}

/**
 * Converts Persian/Arabic digits and localized symbols to standard characters
 * so the dot-matrix font accurately renders the luminous dotted matrix glyphs.
 */
export function toLatinDigits(str: string | number): string {
  if (typeof str === 'number') {
    return str.toString();
  }
  if (!str) return '';
  return String(str)
    .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728))
    .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1584))
    .replace(/٫/g, '.')
    .replace(/،/g, ',')
    .replace(/٪/g, '%')
    .replace(/[–—]/g, '-');
}

/**
 * Regex matching numeric segments:
 * Digits (Latin, Persian, Arabic) with optional leading +/- and
 * connecting punctuation (., : / - × x) and trailing %
 */
const NUMERIC_SEGMENT_REGEX = /([+-]?[\d۰-۹٠-٩]+(?:[\.,٫،:\/×x\s–—-]*[\d۰-۹٠-٩]+)*(?:[\s]*[%٪])?)/g;

export const DotMatrixNumber: React.FC<DotMatrixNumberProps> = ({
  value,
  children,
  unit,
  size = 'md',
  glow = 'white',
  color = 'white',
  weight = 600,
  className = '',
  numberClassName = '',
  unitClassName = '',
  unitFirst = false,
  inline = false,
}) => {
  // Resolve raw text/value
  const rawContent = value !== undefined && value !== null ? value : children;

  // Size mapping
  const sizeClasses: Record<string, string> = {
    '2xs': 'text-[11px] sm:text-xs',
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl',
    '2xl': 'text-3xl sm:text-4xl',
    '3xl': 'text-4xl sm:text-5xl',
    hero: 'text-5xl sm:text-6xl lg:text-7xl',
  };

  // Unit size mapping (harmonious proportional step)
  const unitSizeClasses: Record<string, string> = {
    '2xs': 'text-[9px]',
    xs: 'text-[10px]',
    sm: 'text-[11px]',
    md: 'text-xs',
    lg: 'text-xs sm:text-sm',
    xl: 'text-sm sm:text-base',
    '2xl': 'text-base sm:text-lg',
    '3xl': 'text-lg sm:text-xl',
    hero: 'text-xl sm:text-2xl',
  };

  // Color mapping
  const colorClasses: Record<string, string> = {
    white: 'text-white',
    blue: 'text-sky-400',
    electric: 'text-sky-400',
    cyan: 'text-cyan-300',
    violet: 'text-violet-300',
    rose: 'text-rose-400',
    amber: 'text-amber-300',
    emerald: 'text-emerald-400',
    muted: 'text-zinc-400',
    current: 'text-current',
    gradient: 'text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-300 to-purple-300',
  };

  // Glow mapping
  const glowClasses: Record<string, string> = {
    none: '',
    white: 'dot-glow-white',
    blue: 'dot-glow-blue',
    electric: 'dot-glow-electric',
    cyan: 'dot-glow-cyan',
    violet: 'dot-glow-violet',
    rose: 'dot-glow-rose',
    amber: 'dot-glow-amber',
    emerald: 'dot-glow-emerald',
  };

  const selectedSizeClass = sizeClasses[size] || sizeClasses.md;
  const selectedUnitSizeClass = unitSizeClasses[size] || unitSizeClasses.md;
  const selectedColorClass = colorClasses[color] || colorClasses.white;
  const selectedGlowClass = glowClasses[glow] || '';

  // Render a purely numeric token into the dot-matrix font span
  const renderNumericGlyph = (val: string, key?: number | string) => (
    <span
      key={key}
      className={`font-dot-matrix ${selectedSizeClass} ${selectedColorClass} ${selectedGlowClass} ${numberClassName}`}
      style={{
        fontVariationSettings: `'ROND' 100, 'wght' ${weight}`,
      }}
      dir="ltr"
    >
      {toLatinDigits(val)}
    </span>
  );

  // If content is simple number or strictly numeric string
  if (typeof rawContent === 'number') {
    return (
      <span
        className={`${inline ? 'inline' : 'inline-flex'} items-baseline gap-1.5 leading-none ${className}`}
        dir="ltr"
      >
        {unitFirst && unit && (
          <span
            className={`font-sans font-medium text-zinc-400 ${selectedUnitSizeClass} ${unitClassName}`}
            dir="rtl"
          >
            {unit}
          </span>
        )}
        {renderNumericGlyph(rawContent.toString())}
        {!unitFirst && unit && (
          <span
            className={`font-sans font-medium text-zinc-400 ${selectedUnitSizeClass} ${unitClassName}`}
            dir="rtl"
          >
            {unit}
          </span>
        )}
      </span>
    );
  }

  if (typeof rawContent === 'string') {
    // If string contains mixed Persian words and numbers (e.g. "وزن ۸۹ کیلوگرم" or "۱۲ حرکت")
    const parts = rawContent.split(NUMERIC_SEGMENT_REGEX);

    return (
      <span
        className={`${inline ? 'inline' : 'inline-flex'} items-baseline gap-1 leading-none ${className}`}
      >
        {unitFirst && unit && (
          <span
            className={`font-sans font-medium text-zinc-400 ${selectedUnitSizeClass} ${unitClassName}`}
            dir="rtl"
          >
            {unit}
          </span>
        )}

        {parts.map((part, idx) => {
          if (!part) return null;
          // Check if part matches a numeric segment
          if (part.match(/[\d۰-۹٠-٩]/)) {
            return renderNumericGlyph(part, idx);
          }
          // Non-numeric Persian/standard text
          return (
            <span key={idx} className={`font-sans ${unitClassName}`}>
              {part}
            </span>
          );
        })}

        {!unitFirst && unit && (
          <span
            className={`font-sans font-medium text-zinc-400 ${selectedUnitSizeClass} ${unitClassName}`}
            dir="rtl"
          >
            {unit}
          </span>
        )}
      </span>
    );
  }

  // Fallback for custom nodes
  return (
    <span
      className={`font-dot-matrix ${selectedSizeClass} ${selectedColorClass} ${selectedGlowClass} ${className}`}
      style={{
        fontVariationSettings: `'ROND' 100, 'wght' ${weight}`,
      }}
      dir="ltr"
    >
      {rawContent}
    </span>
  );
};

export const DotMatrixText = DotMatrixNumber;

