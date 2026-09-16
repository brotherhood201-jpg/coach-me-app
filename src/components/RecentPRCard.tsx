import React from 'react';
import { motion } from 'motion/react';
import { Trophy, TrendingUp, ChevronLeft, Sparkles } from 'lucide-react';
import { GlassCard } from './common/GlassCard';
import { DotMatrixNumber } from './common/DotMatrixNumber';

interface RecentPRCardProps {
  exerciseName?: string;
  weightKg?: number;
  reps?: number;
  improvement?: string;
  onOpenPRs?: () => void;
}

export const RecentPRCard: React.FC<RecentPRCardProps> = ({
  exerciseName = 'پرس سینه هالتر',
  weightKg = 85,
  reps = 6,
  improvement = '+۵ کیلوگرم نسبت به ماه قبل',
  onOpenPRs,
}) => {
  return (
    <GlassCard
      interactive={!!onOpenPRs}
      onClick={onOpenPRs}
      className="p-5 sm:p-6 bg-gradient-to-l from-[#180f33]/90 via-[#110c24]/90 to-[#0e0a1c]/90 border-violet-500/30"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.2)]">
            <Trophy className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                رکورد جدید (PR)
              </span>
              <span className="text-xs text-zinc-400">آخرین دستاورد قدرتی</span>
            </div>

            <h4 className="text-base sm:text-lg font-black text-white mt-1">
              {exerciseName}
            </h4>
          </div>
        </div>

        <div className="text-left flex items-center gap-3">
          <div>
            <div className="flex items-baseline gap-1 justify-end">
              <DotMatrixNumber value={weightKg} unit="کیلوگرم" size="lg" glow="violet" color="violet" />
            </div>
            <div className="text-xs text-zinc-400 font-bold block text-left mt-0.5">
              <DotMatrixNumber value={reps} unit="تکرار کامل" size="xs" glow="none" color="muted" />
            </div>
          </div>

          {onOpenPRs && (
            <div className="p-2 rounded-xl bg-white/[0.04] text-zinc-400 hover:text-white transition">
              <ChevronLeft className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <TrendingUp className="w-3.5 h-3.5" />
          <DotMatrixNumber value={improvement} size="xs" glow="emerald" color="emerald" />
        </div>

        <div className="text-zinc-400 text-[11px] flex items-center gap-1">
          <span>محاسبه تخمینی توان ۱ تکرار:</span>
          <DotMatrixNumber value={Math.round(weightKg * 1.18)} unit="kg" size="2xs" glow="none" color="white" />
        </div>
      </div>
    </GlassCard>
  );
};
