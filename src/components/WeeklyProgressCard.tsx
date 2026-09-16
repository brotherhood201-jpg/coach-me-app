import React from 'react';
import { motion } from 'motion/react';
import { Target, Check, Award } from 'lucide-react';
import { DayProgress } from '../types';
import { playWorkoutSound } from '../utils/persian';
import { DotMatrixNumber } from './common/DotMatrixNumber';

interface WeeklyProgressCardProps {
  completedCount: number;
  targetCount: number;
  days: DayProgress[];
  onToggleDay: (index: number) => void;
}

export const WeeklyProgressCard: React.FC<WeeklyProgressCardProps> = ({
  completedCount,
  targetCount,
  days,
  onToggleDay,
}) => {
  const percentage = Math.min(100, Math.round((completedCount / targetCount) * 100));
  const remaining = Math.max(0, targetCount - completedCount);

  const handleDayClick = (index: number) => {
    playWorkoutSound('tick');
    onToggleDay(index);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="w-full bg-[#110c22]/80 p-6 sm:p-7 rounded-[32px] border border-white/[0.08] backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.6)] flex flex-col justify-between"
    >
      <div>
        {/* Header Eyebrow & Value */}
        <div className="flex items-center justify-between gap-3 mb-2">
          <div>
            <span className="text-violet-400/90 text-xs font-bold uppercase tracking-[0.15em] block">
              پیشرفت این هفته
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <DotMatrixNumber value={completedCount} size="xl" glow="white" color="white" />
              <span className="text-zinc-500 text-xl font-bold">/</span>
              <DotMatrixNumber value={targetCount} size="lg" glow="none" color="muted" />
              <span className="text-xs text-zinc-400 mr-1.5 font-medium">جلسه تمرین</span>
            </div>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <Target className="w-6 h-6" />
          </div>
        </div>

        {/* Visual Progress Bar with Electric Violet glow */}
        <div className="my-4 space-y-2">
          <div className="w-full h-3 bg-black/40 rounded-full p-0.5 overflow-hidden border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-l from-purple-500 via-violet-500 to-indigo-500 rounded-full shadow-[0_0_16px_rgba(139,92,246,0.5)] relative"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-300 font-medium">
            <div className="text-violet-300 font-bold flex items-center gap-1">
              <DotMatrixNumber value={`${percentage}%`} size="xs" glow="violet" color="violet" />
              <span>تکمیل شده</span>
            </div>
            <div>
              {remaining === 0 ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  هدف هفته تکمیل شد!
                </span>
              ) : (
                <span className="text-zinc-400 flex items-center gap-1">
                  <DotMatrixNumber value={remaining} size="xs" glow="none" color="white" />
                  <span>جلسه تا تکمیل هدف</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Week Days Indicators (Saturday to Friday) */}
      <div className="mt-3 pt-3 border-t border-white/5">
        <div className="flex items-center justify-between gap-1 sm:gap-1.5">
          {days.map((day, idx) => {
            return (
              <button
                key={day.dayNameFa}
                onClick={() => handleDayClick(idx)}
                title={`${day.dayNameFa}: ${day.workoutTitle || 'تمرین'} (${day.completed ? 'تکمیل شده' : 'انجام نشده'})`}
                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-xs transition-all duration-200 cursor-pointer ${
                  day.completed
                    ? 'bg-violet-600/25 border border-violet-400/40 text-violet-200 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                    : day.isToday
                    ? 'bg-[#181130] border border-violet-400/60 text-violet-200 ring-1 ring-violet-400/30'
                    : 'bg-black/30 border border-white/5 text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200'
                }`}
              >
                <span className="text-[10px] font-bold mb-1">{day.dayShortFa}</span>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    day.completed
                      ? 'bg-violet-400 text-slate-950 font-black'
                      : day.isToday
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-400/40'
                      : 'bg-white/5 text-zinc-500'
                  }`}
                >
                  {day.completed ? (
                    <Check className="w-3 h-3 stroke-[3]" />
                  ) : (
                    <DotMatrixNumber value={idx + 1} size="2xs" glow="none" color={day.isToday ? 'violet' : 'muted'} />
                  )}
                </div>
                {day.isToday && (
                  <span className="text-[8px] text-violet-400 mt-0.5 font-bold">امروز</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
