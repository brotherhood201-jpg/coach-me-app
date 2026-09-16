import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Calendar as CalendarIcon,
  ChevronRight,
  ChevronLeft,
  Flame,
  Dumbbell,
  CheckCircle2,
  Trophy,
  Clock,
  Zap,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { WorkoutSession } from '../types';
import { formatPersianTime, PERSIAN_MONTH_NAMES, PERSIAN_WEEKDAY_NAMES } from '../utils/persian';
import { DotMatrixNumber } from './common/DotMatrixNumber';

interface WorkoutCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: WorkoutSession[];
  onOpenSessionDetails?: (session: WorkoutSession) => void;
  onStartTodayWorkout?: () => void;
}

export const WorkoutCalendarModal: React.FC<WorkoutCalendarModalProps> = ({
  isOpen,
  onClose,
  sessions,
  onOpenSessionDetails,
  onStartTodayWorkout,
}) => {
  // Current viewing month offset (0 = current month, -1 = last month, +1 = next month)
  const [monthOffset, setMonthOffset] = useState<number>(0);
  const [selectedDateKey, setSelectedDateKey] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });

  // Calculate target date based on month offset
  const viewingDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + monthOffset);
    return d;
  }, [monthOffset]);

  // Persian month title formatted e.g. "شهریور ۱۴۰۳"
  const persianMonthTitle = useMemo(() => {
    return new Intl.DateTimeFormat('fa-IR', {
      month: 'long',
      year: 'numeric',
    }).format(viewingDate);
  }, [viewingDate]);

  // Map sessions by date key: "YYYY-MM-DD"
  const sessionsByDate = useMemo(() => {
    const map = new Map<string, WorkoutSession[]>();
    sessions.forEach((s) => {
      if (s.completedAt || s.startedAt) {
        const d = new Date(s.completedAt || s.startedAt!);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const existing = map.get(key) || [];
        existing.push(s);
        map.set(key, existing);
      }
    });
    return map;
  }, [sessions]);

  // Build calendar matrix for viewing month
  const calendarDays = useMemo(() => {
    const year = viewingDate.getFullYear();
    const month = viewingDate.getMonth();

    // First day of this month
    const firstDay = new Date(year, month, 1);
    // Total days in this month
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();

    // JavaScript getDay(): 0 = Sunday, 1 = Monday ... 6 = Saturday
    // Persian Week starts on Saturday:
    // Sat = 0, Sun = 1, Mon = 2, Tue = 3, Wed = 4, Thu = 5, Fri = 6
    const firstDayJs = firstDay.getDay();
    const persianStartCol = (firstDayJs + 1) % 7;

    const days: {
      date: Date;
      dateKey: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      workouts: WorkoutSession[];
    }[] = [];

    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = persianStartCol - 1; i >= 0; i--) {
      const pDay = prevMonthLastDay - i;
      const d = new Date(year, month - 1, pDay);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      days.push({
        date: d,
        dateKey: key,
        dayNumber: pDay,
        isCurrentMonth: false,
        isToday: false,
        workouts: sessionsByDate.get(key) || [],
      });
    }

    // Current month days
    const now = new Date();
    const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(year, month, i);
      const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        date: d,
        dateKey: key,
        dayNumber: i,
        isCurrentMonth: true,
        isToday: key === todayKey,
        workouts: sessionsByDate.get(key) || [],
      });
    }

    // Next month padding to fill grid to multiple of 7
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      days.push({
        date: d,
        dateKey: key,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: false,
        workouts: sessionsByDate.get(key) || [],
      });
    }

    return days;
  }, [viewingDate, sessionsByDate]);

  // Selected date workout info
  const selectedDayInfo = useMemo(() => {
    const workouts = sessionsByDate.get(selectedDateKey) || [];
    const dateObj = new Date(selectedDateKey);
    const dateFormatted = new Intl.DateTimeFormat('fa-IR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(dateObj);

    return {
      dateFormatted,
      workouts,
    };
  }, [selectedDateKey, sessionsByDate]);

  // Monthly summary stats
  const monthlyStats = useMemo(() => {
    let workoutsCount = 0;
    let totalVolumeKg = 0;
    let totalMinutes = 0;

    calendarDays.forEach((day) => {
      if (day.isCurrentMonth && day.workouts.length > 0) {
        day.workouts.forEach((w) => {
          workoutsCount++;
          totalVolumeKg += w.totalVolumeKg || 0;
          totalMinutes += Math.round((w.durationSeconds || 3120) / 60);
        });
      }
    });

    const completionRate = Math.min(100, Math.round((workoutsCount / 16) * 100));

    return {
      workoutsCount,
      totalVolumeKg,
      totalMinutes,
      completionRate,
    };
  }, [calendarDays]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 font-['Vazirmatn',system-ui,sans-serif]">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[92vh] bg-[#0c0819]/90 border border-violet-500/20 rounded-[36px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.95),0_0_40px_rgba(139,92,246,0.15)] flex flex-col overflow-hidden z-10 text-right backdrop-blur-3xl"
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#120c24]/80 sticky top-0 z-10 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.25)]">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <span>تقویم هوشمند تمرین</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30">
                    استمرار و نظم
                  </span>
                </h3>
                <p className="text-xs text-zinc-400">ثبت روزانه تمرینات، روند پیوستگی و بررسی لاگ‌های گذشته</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-white/[0.05] text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
            {/* Monthly Overview Stats Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#120c24]/80 border border-violet-500/15 p-4 sm:p-5 rounded-3xl backdrop-blur-sm">
              <div className="space-y-1">
                <span className="text-[11px] text-zinc-400 font-bold block">جلسات ماه</span>
                <div className="flex items-baseline gap-1">
                  <DotMatrixNumber value={monthlyStats.workoutsCount} size="lg" glow="white" color="white" />
                  <span className="text-xs text-zinc-500 font-medium">جلسه</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-zinc-400 font-bold block">مجموع تناژ جابجایی</span>
                <div className="flex items-baseline gap-1">
                  <DotMatrixNumber value={(monthlyStats.totalVolumeKg / 1000).toFixed(1)} size="lg" glow="violet" color="violet" />
                  <span className="text-xs text-zinc-500 font-medium">تُن وزنه</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-zinc-400 font-bold block">مجموع زمان تمرین</span>
                <div className="flex items-baseline gap-1">
                  <DotMatrixNumber value={monthlyStats.totalMinutes} size="lg" glow="violet" color="violet" />
                  <span className="text-xs text-zinc-500 font-medium">دقیقه</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-zinc-400 font-bold block">نرخ پایبندی به هدف</span>
                <div className="flex items-baseline gap-1">
                  <DotMatrixNumber value={monthlyStats.completionRate} unit="%" size="lg" glow="violet" color="violet" />
                  <span className="text-xs text-zinc-500 font-medium">عالی</span>
                </div>
              </div>
            </div>

            {/* Calendar Controls (Month Selector) */}
            <div className="flex items-center justify-between bg-[#120c24]/60 p-3 px-5 rounded-2xl border border-white/5">
              <button
                onClick={() => setMonthOffset((prev) => prev - 1)}
                className="p-2 rounded-xl bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1 text-xs font-bold cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>ماه قبل</span>
              </button>

              <div className="text-center">
                <h4 className="text-base font-black text-white">{persianMonthTitle}</h4>
                {monthOffset !== 0 && (
                  <button
                    onClick={() => setMonthOffset(0)}
                    className="text-[11px] text-violet-400 hover:underline font-bold mt-0.5"
                  >
                    بازگشت به ماه جاری
                  </button>
                )}
              </div>

              <button
                onClick={() => setMonthOffset((prev) => prev + 1)}
                className="p-2 rounded-xl bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1 text-xs font-bold cursor-pointer"
              >
                <span>ماه بعد</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Weekday Labels Header */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-xs font-bold text-zinc-400 py-1">
              {PERSIAN_WEEKDAY_NAMES.map((w) => (
                <div key={w.short} className="py-1">
                  <span className="hidden sm:inline">{w.full}</span>
                  <span className="sm:hidden">{w.short}</span>
                </div>
              ))}
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
              {calendarDays.map((cell) => {
                const hasWorkout = cell.workouts.length > 0;
                const isSelected = cell.dateKey === selectedDateKey;

                return (
                  <button
                    key={cell.dateKey}
                    onClick={() => setSelectedDateKey(cell.dateKey)}
                    className={`min-h-[70px] sm:min-h-[85px] p-2 rounded-2xl sm:rounded-3xl border transition-all flex flex-col justify-between text-right relative group cursor-pointer ${
                      isSelected
                        ? 'bg-violet-600/20 border-violet-500 ring-2 ring-violet-500/40 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                        : hasWorkout
                        ? 'bg-violet-950/30 border-violet-500/40 hover:border-violet-500/70'
                        : cell.isToday
                        ? 'bg-[#1c1236]/80 border-violet-500/50'
                        : cell.isCurrentMonth
                        ? 'bg-[#120c24]/40 border-white/5 hover:bg-[#181030]/60 hover:border-white/10'
                        : 'bg-black/20 border-transparent text-zinc-600 opacity-40'
                    }`}
                  >
                    {/* Day Number and Today Marker */}
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <DotMatrixNumber
                          value={cell.dayNumber}
                          size="xs"
                          glow={isSelected || cell.isToday ? 'violet' : 'none'}
                          color={isSelected || cell.isToday ? 'violet' : cell.isCurrentMonth ? 'white' : 'muted'}
                        />
                      </div>

                      {cell.isToday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                      )}
                    </div>

                    {/* Workout Indicator Pill */}
                    {hasWorkout ? (
                      <div className="mt-1">
                        <div className="flex items-center gap-1 bg-violet-500/20 border border-violet-500/30 px-1.5 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-bold text-violet-300 truncate">
                          <CheckCircle2 className="w-3 h-3 text-violet-400 shrink-0" />
                          <span className="truncate">{cell.workouts[0]?.titleFa || 'تمرین'}</span>
                        </div>
                      </div>
                    ) : cell.isCurrentMonth && !cell.isToday && cell.date < new Date() ? (
                      <div className="text-[9px] text-zinc-600 font-medium">استراحت</div>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {/* Selected Date Details Inspector Panel */}
            <div className="bg-[#120c24]/80 border border-violet-500/20 rounded-3xl p-5 sm:p-6 backdrop-blur-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{selectedDayInfo.dateFormatted}</h4>
                    <div className="text-xs text-zinc-400 flex items-center gap-1">
                      {selectedDayInfo.workouts.length > 0 ? (
                        <>
                          <DotMatrixNumber value={selectedDayInfo.workouts.length} size="xs" glow="none" color="white" />
                          <span>تمرین ثبت شده در این روز</span>
                        </>
                      ) : (
                        <span>روز استراحت / تمرینی در این روز ثبت نشده</span>
                      )}
                    </div>
                  </div>
                </div>

                {selectedDayInfo.workouts.length === 0 && onStartTodayWorkout && (
                  <button
                    onClick={onStartTodayWorkout}
                    className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition shadow-lg shadow-violet-600/25"
                  >
                    <Dumbbell className="w-4 h-4" />
                    <span>ثبت تمرین برای این روز</span>
                  </button>
                )}
              </div>

              {/* Workout Session Card Preview */}
              {selectedDayInfo.workouts.length > 0 ? (
                <div className="mt-4 space-y-4">
                  {selectedDayInfo.workouts.map((w) => (
                    <div
                      key={w.id}
                      className="bg-black/40 border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-violet-500/30 transition"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm sm:text-base font-black text-white">{w.titleFa}</span>
                          <span className="px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30 text-[10px] font-bold">
                            تکمیل شده
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-violet-400" />
                            <DotMatrixNumber value={Math.round((w.durationSeconds || 3120) / 60)} unit="دقیقه" size="2xs" glow="none" color="muted" />
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Dumbbell className="w-3.5 h-3.5 text-violet-400" />
                            <DotMatrixNumber value={w.totalSets || 18} unit="ست" size="2xs" glow="none" color="muted" />
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5 text-violet-400" />
                            <DotMatrixNumber value={w.totalVolumeKg || 4200} unit="کیلوگرم تناژ" size="2xs" glow="none" color="muted" />
                          </span>
                        </div>
                      </div>

                      {onOpenSessionDetails && (
                        <button
                          onClick={() => onOpenSessionDetails(w)}
                          className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/10 text-zinc-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <span>مشاهده جزئیات لاگ</span>
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-zinc-500 text-xs">
                  در این تاریخ تمرینی ثبت نشده است. روزهای استراحت برای ریکاوری عضلات و رشد بهینه ضروری هستند.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
