import React, { useId } from 'react';
import { motion } from 'motion/react';

export interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: 'cyan' | 'emerald' | 'amber' | 'purple' | 'rose' | 'electric' | 'violet' | 'magenta' | 'coral';
  centerContent?: React.ReactNode;
  showGlow?: boolean;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  size = 80,
  strokeWidth = 6,
  color = 'electric',
  centerContent,
  showGlow = true,
  className = '',
}) => {
  const gradientId = useId().replace(/:/g, '');
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  const getGradientStops = () => {
    switch (color) {
      case 'electric':
        return { start: '#00D4FF', end: '#0066FF', glow: 'rgba(0, 102, 255, 0.45)' };
      case 'violet':
        return { start: '#0066FF', end: '#7C3AED', glow: 'rgba(124, 58, 237, 0.45)' };
      case 'magenta':
        return { start: '#7C3AED', end: '#D946EF', glow: 'rgba(217, 70, 239, 0.45)' };
      case 'coral':
        return { start: '#EC4899', end: '#FB7185', glow: 'rgba(251, 113, 133, 0.45)' };
      case 'emerald':
        return { start: '#34D399', end: '#10B981', glow: 'rgba(16, 185, 129, 0.40)' };
      case 'amber':
        return { start: '#FBBF24', end: '#F59E0B', glow: 'rgba(245, 158, 11, 0.40)' };
      case 'rose':
        return { start: '#FB7185', end: '#F43F5E', glow: 'rgba(244, 63, 94, 0.40)' };
      case 'cyan':
        return { start: '#38BDF8', end: '#0284C7', glow: 'rgba(56, 189, 248, 0.40)' };
      case 'purple':
      default:
        return { start: '#0066FF', end: '#8B5CF6', glow: 'rgba(0, 102, 255, 0.40)' };
    }
  };

  const { start, end, glow } = getGradientStops();

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        <defs>
          <linearGradient id={`grad-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={start} />
            <stop offset="100%" stopColor={end} />
          </linearGradient>
        </defs>

        {/* Ambient Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.07)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Animated Progress Path */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#grad-${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          strokeLinecap="round"
          fill="transparent"
          style={{
            filter: showGlow ? `drop-shadow(0 0 6px ${glow})` : undefined,
          }}
        />
      </svg>

      {centerContent && (
        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
          {centerContent}
        </div>
      )}
    </div>
  );
};

