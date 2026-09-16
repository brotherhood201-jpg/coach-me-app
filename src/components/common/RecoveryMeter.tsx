import React from 'react';
import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';
import { DotMatrixNumber } from './DotMatrixNumber';
import { toPersianDigits } from '../../utils/persian';
import { Activity, Zap } from 'lucide-react';

export interface MuscleRecoveryItem {
  name: string;
  percentage: number;
  status: 'آماده' | 'در حال ریکاوری' | 'خسته';
  lastTrainedDaysAgo?: number;
}

interface RecoveryMeterProps {
  items?: MuscleRecoveryItem[];
}

export const RecoveryMeter: React.FC<RecoveryMeterProps> = ({
  items = [
    { name: 'سینه', percentage: 92, status: 'آماده', lastTrainedDaysAgo: 4 },
    { name: 'پشت', percentage: 100, status: 'آماده', lastTrainedDaysAgo: 5 },
    { name: 'پاها', percentage: 74, status: 'در حال ریکاوری', lastTrainedDaysAgo: 2 },
  ],
}) => {
  const getStatusColor = (percent: number) => {
    if (percent >= 90) return { bar: 'from-emerald-400 to-teal-500', text: 'text-emerald-400', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
    if (percent >= 70) return { bar: 'from-violet-500 to-purple-600', text: 'text-violet-400', badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30' };
    return { bar: 'from-amber-400 to-orange-500', text: 'text-amber-400', badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.2)]">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">وضعیت ریکاوری عضلات</h3>
            <p className="text-[11px] text-zinc-400">میزان آمادگی و بازیابی فیبرهای عضلانی</p>
          </div>
        </div>
        <div className="text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.2)] flex items-center gap-1">
          <span>آمادگی</span>
          <DotMatrixNumber value="92%" size="xs" glow="emerald" color="emerald" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {items.map((item, idx) => {
          const colors = getStatusColor(item.percentage);
          return (
            <GlassCard key={idx} className="p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-200">{item.name}</span>
                <DotMatrixNumber
                  value={`${item.percentage}%`}
                  size="xs"
                  glow="none"
                  color={item.percentage >= 90 ? 'emerald' : item.percentage >= 70 ? 'violet' : 'amber'}
                />
              </div>

              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden mb-2 border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.15, ease: 'easeOut' }}
                  className={`h-full bg-gradient-to-l ${colors.bar} rounded-full shadow-[0_0_10px_rgba(139,92,246,0.4)]`}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-zinc-400">
                <span>{item.status}</span>
                {item.lastTrainedDaysAgo && (
                  <span>{toPersianDigits(item.lastTrainedDaysAgo)} روز پیش</span>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
