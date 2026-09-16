export const THEME = {
  colors: {
    bg: {
      // Dark Foundation - Near black & deep charcoal atmospheres
      canvas: '#05070E',          // Deepest canvas base
      primary: '#070B16',         // Primary app background
      secondary: '#0A0F20',       // Secondary atmospheric layer
      tertiary: '#0E1428',        // Elevated container surfaces
      surface: 'rgba(14, 20, 40, 0.65)',        // Liquid glass default surface
      surfaceElevated: 'rgba(17, 24, 48, 0.85)', // Elevated liquid glass surface
      surfaceActive: 'rgba(0, 102, 255, 0.12)',  // Active selection surface
      surfaceSubtle: 'rgba(255, 255, 255, 0.035)', // Ultra-subtle flat surface
    },
    // Primary Futuristic Chromatic Spectrum
    chromatic: {
      deepBlack: '#05070E',
      midnightBlue: '#0A122A',
      electricBlue: '#0066FF',
      electricCyan: '#00D4FF',
      violet: '#7C3AED',
      magenta: '#D946EF',
      deepMagenta: '#C026D3',
    },
    // Secondary Warm Accents (used purposefully and sparingly)
    secondary: {
      softPink: '#F472B6',
      warmCoral: '#FB7185',
      subtleOrange: '#FB923C',
      emerald: '#10B981',
      amber: '#F59E0B',
    },
    // Backwards-compatible status tokens
    status: {
      emerald: '#10B981',
      amber: '#F59E0B',
      rose: '#F43F5E',
      cyan: '#00D4FF',
      blue: '#0066FF',
      violet: '#7C3AED',
      magenta: '#D946EF',
    },
    // Backwards-compatible accent tokens with new chromatic depth
    accent: {
      primary: '#0066FF',      // Electric Blue primary
      secondary: '#7C3AED',    // Violet
      magenta: '#D946EF',      // Magenta highlight
      light: '#38BDF8',        // Sky/Cyan accent
      deep: '#0A122A',         // Midnight Blue
      glow: 'rgba(0, 102, 255, 0.35)',
      glowViolet: 'rgba(124, 58, 237, 0.35)',
      glowMagenta: 'rgba(217, 70, 239, 0.35)',
      ambient: 'rgba(0, 102, 255, 0.12)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.72)',
      muted: 'rgba(255, 255, 255, 0.45)',
      faint: 'rgba(255, 255, 255, 0.22)',
      electric: '#38BDF8',
      violet: '#C084FC',
      magenta: '#F472B6',
      coral: '#FDA4AF',
    },
    border: {
      ultraSubtle: 'rgba(255, 255, 255, 0.04)',
      subtle: 'rgba(255, 255, 255, 0.08)',
      medium: 'rgba(255, 255, 255, 0.14)',
      electric: 'rgba(0, 102, 255, 0.40)',
      violet: 'rgba(124, 58, 237, 0.40)',
      magenta: 'rgba(217, 70, 239, 0.40)',
      highlight: 'rgba(255, 255, 255, 0.25)',
      sheen: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 100%)',
    },
    gradients: {
      // Direction: Black → Deep Blue → Electric Blue → Violet → Magenta
      brandSpectrum: 'linear-gradient(135deg, #05070E 0%, #0A122A 30%, #0066FF 65%, #7C3AED 85%, #D946EF 100%)',
      electricViolet: 'linear-gradient(135deg, #0066FF 0%, #7C3AED 55%, #D946EF 100%)',
      electricCyan: 'linear-gradient(135deg, #00D4FF 0%, #0066FF 50%, #4F46E5 100%)',
      violetMagenta: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)',
      warmSunset: 'linear-gradient(135deg, #EC4899 0%, #FB7185 50%, #FB923C 100%)',
      deepAtmosphere: 'radial-gradient(ellipse at top, #0A1430 0%, #070B18 55%, #05070E 100%)',
      glassSheen: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 100%)',
      cardOverlay: 'linear-gradient(180deg, rgba(14, 20, 42, 0.4) 0%, rgba(5, 7, 14, 0.85) 100%)',
    }
  },
  glass: {
    subtle: {
      bg: 'rgba(10, 15, 32, 0.50)',
      blur: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
    },
    liquid: {
      bg: 'rgba(10, 17, 36, 0.72)',
      blur: 'blur(24px)',
      border: '1px solid rgba(255, 255, 255, 0.09)',
      shadow: '0 16px 45px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
    },
    elevated: {
      bg: 'rgba(14, 22, 48, 0.88)',
      blur: 'blur(32px)',
      border: '1px solid rgba(255, 255, 255, 0.14)',
      shadow: '0 24px 60px rgba(0, 0, 0, 0.70), 0 0 35px rgba(0, 102, 255, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
    },
    electric: {
      bg: 'linear-gradient(145deg, rgba(10, 18, 42, 0.85), rgba(16, 26, 60, 0.75))',
      blur: 'blur(28px)',
      border: '1px solid rgba(0, 102, 255, 0.35)',
      shadow: '0 20px 50px rgba(0, 0, 0, 0.65), 0 0 30px rgba(0, 102, 255, 0.22), inset 0 1px 0 rgba(56, 189, 248, 0.30)',
    },
  },
  radius: {
    sm: '12px',
    md: '18px',
    lg: '24px',
    xl: '28px',
    '2xl': '32px',
    '3xl': '38px',
    pill: '9999px',
    // Backwards-compatible aliases
    card: '28px',
    cardLg: '36px',
    button: '20px',
    chip: '16px',
    input: '18px',
  },
  shadows: {
    glass: '0 16px 45px rgba(0, 0, 0, 0.55)',
    elevated: '0 24px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(0, 102, 255, 0.12)',
    glowElectric: '0 0 30px rgba(0, 102, 255, 0.45)',
    glowViolet: '0 0 30px rgba(124, 58, 237, 0.45)',
    glowMagenta: '0 0 30px rgba(217, 70, 239, 0.45)',
    glowCoral: '0 0 25px rgba(251, 113, 133, 0.40)',
    innerSheen: 'inset 0 1px 0 rgba(255, 255, 255, 0.15)',
    // Backwards-compatible
    glow: '0 0 25px rgba(0, 102, 255, 0.40)',
    glowSm: '0 0 15px rgba(0, 102, 255, 0.25)',
  },
  typography: {
    fontFamily: "'Vazirmatn', system-ui, -apple-system, sans-serif",
    display: {
      hero: 'text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]',
      titleLg: 'text-2xl sm:text-3xl font-black tracking-tight leading-tight',
      titleMd: 'text-xl sm:text-2xl font-black tracking-tight leading-snug',
      titleSm: 'text-lg sm:text-xl font-extrabold tracking-tight',
    },
    body: {
      lead: 'text-base sm:text-lg font-normal leading-relaxed text-zinc-300',
      regular: 'text-sm sm:text-base font-normal leading-relaxed text-zinc-300',
      subtle: 'text-xs sm:text-sm font-medium text-zinc-400',
      caption: 'text-[11px] sm:text-xs font-medium text-zinc-500',
    },
    metric: {
      huge: 'font-dot-matrix font-black text-3xl sm:text-4xl lg:text-5xl tracking-wider',
      large: 'font-dot-matrix font-black text-2xl sm:text-3xl tracking-wider',
      medium: 'font-dot-matrix font-extrabold text-xl sm:text-2xl tracking-wider',
      compact: 'font-dot-matrix font-bold text-sm sm:text-base tracking-wider',
    },
    dotMatrix: {
      fontFamily: "'Doto', 'DotGothic16', monospace",
      hero: 'font-dot-matrix font-black text-4xl sm:text-5xl lg:text-6xl tracking-wider',
      large: 'font-dot-matrix font-black text-2xl sm:text-3xl tracking-wider',
      medium: 'font-dot-matrix font-extrabold text-xl sm:text-2xl tracking-wider',
      small: 'font-dot-matrix font-bold text-base sm:text-lg tracking-wider',
      compact: 'font-dot-matrix font-bold text-xs sm:text-sm tracking-wider',
    },
  },
} as const;
