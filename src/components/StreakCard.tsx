import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Calendar, ArrowUpRight } from 'lucide-react';
import { DotMatrixNumber } from './common/DotMatrixNumber';

interface StreakCardProps {
  streakDays: number;
  bestStreak?: number;
  onOpenCalendar?: () => void;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  streakDays,
  bestStreak = 18,
  onOpenCalendar,
}) => {
  const nextMilestone = streakDays < 7 ? 7 : streakDays < 14 ? 14 : streakDays < 21 ? 21 : streakDays < 30 ? 30 : streakDays + 10;
  const prevMilestone = streakDays < 7 ? 0 : streakDays < 14 ? 7 : streakDays < 21 ? 14 : 21;
  const progressPercent = Math.min(100, Math.round(((streakDays - prevMilestone) / (nextMilestone - prevMilestone)) * 100));
  const daysToMilestone = Math.max(0, nextMilestone - streakDays);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="w-full bg-[#110c22]/80 border border-white/[0.08] p-6 sm:p-7 rounded-[32px] backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col justify-between"
    >
      {/* Background Purple Radial Glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between gap-3 mb-2">
          <div>
            <span className="text-violet-400/90 text-xs font-bold uppercase tracking-[0.15em] block">
              روند پیوستگی و انضباط
            </span>
            <div className="flex items-center gap-2 mt-1">
              <DotMatrixNumber value={streakDays} unit="روز پیوسته" size="xl" glow="amber" color="amber" />
            </div>
          </div>

          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -4, 4, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-4xl sm:text-5xl drop-shadow-[0_0_20px_rgba(245,158,11,0.5)] select-none"
          >
            🔥
          </motion.div>
        </div>

        <p className="text-zinc-300 text-xs sm:text-sm mt-1 leading-relaxed">
          {streakDays > 0
            ? 'ریتم تمرینی شما عالی است! هر روز پایبندی، شما را به نسخه نیرومندتر خودتان نزدیک‌تر می‌کند.'
            : 'امروز بهترین فرصت برای شروع زنجیره پیوستگی شما در کوچ من است. تمرین امروز را ثبت کنید!'}
        </p>

        {/* Milestone Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-300 font-medium">
            <div className="text-violet-300 font-bold flex items-center gap-1">
              <DotMatrixNumber value={daysToMilestone} size="xs" glow="violet" color="violet" />
              <span>روز تا نشان</span>
              <DotMatrixNumber value={nextMilestone} size="xs" glow="none" color="white" />
              <span>روزه</span>
            </div>
            <DotMatrixNumber value={`${progressPercent}%`} size="xs" glow="amber" color="amber" />
          </div>
          <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-l from-amber-400 via-purple-500 to-violet-600 rounded-full shadow-[0_0_12px_rgba(139,92,246,0.5)]"
            />
          </div>
        </div>
      </div>

      {/* Footer Record & Calendar Button */}
      <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/5 px-3 py-1.5 rounded-2xl text-xs text-zinc-300">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span className="flex items-center gap-1.5">
            <span>بهترین رکورد:</span>
            <DotMatrixNumber value={bestStreak} unit="روز" size="xs" glow="amber" color="amber" />
          </span>
        </div>

        {onOpenCalendar && (
          <button
            onClick={onOpenCalendar}
            className="flex items-center gap-1.5 text-xs text-violet-300 hover:text-white font-bold bg-violet-500/15 hover:bg-violet-500/25 border border-violet-400/30 px-3 py-1.5 rounded-2xl transition cursor-pointer shadow-[0_0_10px_rgba(139,92,246,0.15)]"
          >
            <Calendar className="w-3.5 h-3.5 text-violet-400" />
            <span>تقویم تمرینی</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </motion.div>
  );
};
