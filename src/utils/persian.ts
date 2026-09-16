// Helper to convert English digits to Persian digits
export function toPersianDigits(num: number | string): string {
  if (num === undefined || num === null) return '';
  const str = String(num);
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/\d/g, (x) => persianDigits[parseInt(x, 10)]);
}

// Convert Persian digits to English digits
export function toEnglishDigits(str: string): string {
  if (!str) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  let result = str;
  persianDigits.forEach((p, i) => {
    result = result.replace(new RegExp(p, 'g'), i.toString());
  });
  return result;
}

// Format seconds into MM:SS in Persian digits
export function formatPersianTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  return toPersianDigits(formatted);
}

// Format date into standard Persian string (e.g. ۱۴۰۳/۰۶/۱۵ یا شنبه ۱۵ شهریور)
export function formatPersianDate(dateInput: string | Date | number, format: 'short' | 'full' | 'monthDay' = 'short'): string {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return 'نامشخص';

    if (format === 'full') {
      return new Intl.DateTimeFormat('fa-IR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(d);
    }

    if (format === 'monthDay') {
      return new Intl.DateTimeFormat('fa-IR', {
        day: 'numeric',
        month: 'long',
      }).format(d);
    }

    // Default short YYYY/MM/DD
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(d);
  } catch {
    return 'نامشخص';
  }
}

// Calculate estimated 1 Rep Max (Brzycki & Epley formulas)
export function calculate1RM(weightKg: number, reps: number): { epley: number; brzycki: number; average: number } {
  if (weightKg <= 0 || reps <= 0) return { epley: 0, brzycki: 0, average: 0 };
  if (reps === 1) return { epley: weightKg, brzycki: weightKg, average: weightKg };

  const epley = Math.round(weightKg * (1 + reps / 30));
  const brzycki = Math.round(weightKg * (36 / (37 - Math.min(reps, 36))));
  const average = Math.round((epley + brzycki) / 2);

  return { epley, brzycki, average };
}

export interface ShamsiCalendarDay {
  date: Date;
  dateKey: string; // YYYY-MM-DD
  shamsiYear: number;
  shamsiMonthName: string;
  shamsiMonthIndex: number;
  shamsiDay: number;
  dayOfWeekIndex: number; // 0 for Saturday to 6 for Friday
  isCurrentMonth: boolean;
  isToday: boolean;
}

// Persian Month Names
export const PERSIAN_MONTH_NAMES = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

export const PERSIAN_WEEKDAY_NAMES = [
  { short: 'ش', full: 'شنبه', index: 0 },
  { short: 'ی', full: 'یکشنبه', index: 1 },
  { short: 'د', full: 'دوشنبه', index: 2 },
  { short: 'س', full: 'سه‌شنبه', index: 3 },
  { short: 'چ', full: 'چهارشنبه', index: 4 },
  { short: 'پ', full: 'پنج‌شنبه', index: 5 },
  { short: 'ج', full: 'جمعه', index: 6 },
];

// Audio synthesizer for workout timer & set completion
export function playWorkoutSound(type: 'beep' | 'finish' | 'tick' | 'success' | 'pr') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'tick') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'beep') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'finish') {
      // High pleasant chord
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.45);
      });
    } else if (type === 'success' || type === 'pr') {
      const freqs = type === 'pr' ? [587.33, 739.99, 880, 1174.66] : [600, 800];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.09);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.09 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.09);
        osc.stop(ctx.currentTime + i * 0.09 + 0.35);
      });
    }
  } catch {
    // AudioContext might be restricted until user gesture
  }
}

