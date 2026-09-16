import React from 'react';
import { DotMatrixNumber } from './DotMatrixNumber';

export interface DataMetricProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: {
    value: string | number;
    isPositive?: boolean;
    label?: string;
  };
  icon?: React.ReactNode;
  accentColor?: 'electric' | 'violet' | 'magenta' | 'coral' | 'emerald' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
}

/**
 * DataMetric component: Strong visual hierarchy numbers with dot-matrix digital display
 */
export const DataMetric: React.FC<DataMetricProps> = ({
  label,
  value,
  unit,
  trend,
  icon,
  accentColor = 'white',
  size = 'md',
  className = '',
}) => {
  const getDotGlow = (): 'none' | 'white' | 'cyan' | 'violet' | 'rose' | 'amber' | 'emerald' => {
    switch (accentColor) {
      case 'electric':
        return 'cyan';
      case 'violet':
        return 'violet';
      case 'magenta':
      case 'coral':
        return 'rose';
      case 'emerald':
        return 'emerald';
      case 'white':
      default:
        return 'white';
    }
  };

  const getDotColor = (): 'white' | 'cyan' | 'violet' | 'rose' | 'amber' | 'emerald' | 'gradient' => {
    switch (accentColor) {
      case 'electric':
        return 'cyan';
      case 'violet':
        return 'violet';
      case 'magenta':
      case 'coral':
        return 'rose';
      case 'emerald':
        return 'emerald';
      case 'white':
      default:
        return 'white';
    }
  };

  return (
    <div className={`flex flex-col gap-1 select-none ${className}`} dir="rtl">
      {/* Label and optional icon */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-zinc-400 tracking-wide">{label}</span>
        {icon && <span className="text-zinc-500 shrink-0">{icon}</span>}
      </div>

      {/* Main Metric Value in Dot-Matrix */}
      <div className="flex items-baseline gap-1.5 pt-0.5">
        <DotMatrixNumber
          value={value}
          unit={unit}
          size={size}
          glow={getDotGlow()}
          color={getDotColor()}
        />
      </div>

      {/* Trend indicator */}
      {trend && (
        <div className="flex items-center gap-1 mt-0.5 text-[11px] font-medium">
          <span
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${
              trend.isPositive
                ? 'text-emerald-300 bg-emerald-500/15 border border-emerald-500/25'
                : 'text-rose-300 bg-rose-500/15 border border-rose-500/25'
            }`}
          >
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{trend.value}</span>
          </span>
          {trend.label && <span className="text-zinc-500">{trend.label}</span>}
        </div>
      )}
    </div>
  );
};

