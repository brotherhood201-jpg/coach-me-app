import React from 'react';
import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';
import { DotMatrixNumber } from './DotMatrixNumber';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    positive?: boolean;
  };
  accentColor?: 'purple' | 'violet' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'blue';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  subtext,
  icon,
  trend,
  accentColor = 'purple',
  onClick,
}) => {
  const getAccentStyles = () => {
    switch (accentColor) {
      case 'emerald':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.15)]';
      case 'amber':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/25 shadow-[0_0_12px_rgba(245,158,11,0.15)]';
      case 'rose':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/25 shadow-[0_0_12px_rgba(244,63,94,0.15)]';
      case 'cyan':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25 shadow-[0_0_12px_rgba(6,182,212,0.15)]';
      case 'blue':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/25 shadow-[0_0_12px_rgba(59,130,246,0.15)]';
      case 'violet':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/25 shadow-[0_0_12px_rgba(168,85,247,0.2)]';
      case 'purple':
      default:
        return 'text-violet-400 bg-violet-500/15 border-violet-500/30 shadow-[0_0_12px_rgba(139,92,246,0.25)]';
    }
  };

  const getGlow = (): 'none' | 'white' | 'cyan' | 'violet' | 'rose' | 'amber' | 'emerald' => {
    switch (accentColor) {
      case 'emerald':
        return 'emerald';
      case 'amber':
        return 'amber';
      case 'rose':
        return 'rose';
      case 'cyan':
      case 'blue':
        return 'cyan';
      case 'violet':
      case 'purple':
        return 'violet';
      default:
        return 'white';
    }
  };

  return (
    <GlassCard
      interactive={!!onClick}
      onClick={onClick}
      className="p-4 sm:p-5 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-bold text-zinc-400">{label}</span>
        {icon && (
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${getAccentStyles()}`}>
            {icon}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-baseline gap-1.5 pt-0.5">
          <DotMatrixNumber
            value={value}
            unit={unit}
            size="lg"
            glow={getGlow()}
            color={getGlow() === 'white' ? 'white' : (getGlow() as any)}
          />
        </div>

        {(subtext || trend) && (
          <div className="flex items-center justify-between mt-1 text-[11px]">
            {subtext && <span className="text-zinc-500">{subtext}</span>}
            {trend && (
              <span
                className={`font-mono font-bold ${
                  trend.positive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {trend.positive ? '↑' : '↓'} {trend.value}
              </span>
            )}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

