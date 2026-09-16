import React from 'react';
import { motion } from 'motion/react';

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
  className?: string;
}

/**
 * Minimal Sparkline Graph with smooth bezier curve and gradient area fill
 */
export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 120,
  height = 36,
  strokeColor = '#0066FF',
  fillColor = 'rgba(0, 102, 255, 0.15)',
  strokeWidth = 2,
  className = '',
}) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;
  const paddingY = 4;
  const usableHeight = height - paddingY * 2;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - paddingY - ((val - min) / range) * usableHeight;
    return { x, y };
  });

  // Generate SVG cubic bezier path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const controlX = (current.x + next.x) / 2;
    pathD += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
  }

  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className={`relative inline-block overflow-hidden ${className}`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <linearGradient id={`sparkFill-${width}-${height}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.30" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <path d={areaD} fill={`url(#sparkFill-${width}-${height})`} />
        
        <motion.path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            filter: `drop-shadow(0 0 5px ${strokeColor}80)`,
          }}
        />

        {/* Ending glow point */}
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r={3}
          fill="#FFFFFF"
          stroke={strokeColor}
          strokeWidth={2}
          style={{ filter: `drop-shadow(0 0 6px ${strokeColor})` }}
        />
      </svg>
    </div>
  );
};

export interface MicroBarStepsProps {
  values: number[]; // numbers 0 to 1 representing fill fraction
  totalSteps?: number;
  height?: number;
  activeColor?: string;
  inactiveColor?: string;
  className?: string;
}

/**
 * Minimal equalizer bar steps for training volume / recovery metrics
 */
export const MicroBarSteps: React.FC<MicroBarStepsProps> = ({
  values,
  height = 24,
  activeColor = '#0066FF',
  inactiveColor = 'rgba(255, 255, 255, 0.08)',
  className = '',
}) => {
  return (
    <div className={`flex items-end gap-1 ${className}`} style={{ height }}>
      {values.map((val, idx) => {
        const fillHeight = Math.max(15, Math.min(100, Math.round(val * 100)));
        return (
          <div
            key={idx}
            className="w-1.5 rounded-full overflow-hidden flex flex-col justify-end transition-all"
            style={{ height: '100%', backgroundColor: inactiveColor }}
          >
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${fillHeight}%` }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
              className="w-full rounded-full"
              style={{
                backgroundColor: activeColor,
                boxShadow: val > 0.6 ? `0 0 8px ${activeColor}80` : undefined,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export interface DotMatrixProgressProps {
  totalDots?: number;
  activeDots?: number;
  activeColor?: string;
  className?: string;
}

/**
 * Dot matrix indicator for minimal futuristic telemetry
 */
export const DotMatrixProgress: React.FC<DotMatrixProgressProps> = ({
  totalDots = 7,
  activeDots = 4,
  activeColor = '#0066FF',
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {Array.from({ length: totalDots }).map((_, idx) => {
        const isActive = idx < activeDots;
        return (
          <span
            key={idx}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              isActive ? 'scale-110' : 'opacity-25'
            }`}
            style={{
              backgroundColor: isActive ? activeColor : 'rgba(255, 255, 255, 0.4)',
              boxShadow: isActive ? `0 0 6px ${activeColor}` : undefined,
            }}
          />
        );
      })}
    </div>
  );
};
