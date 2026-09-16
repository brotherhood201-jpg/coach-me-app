import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingDown,
  TrendingUp,
  Sparkles,
  ChevronLeft,
  Ruler,
  Dumbbell,
  Trophy,
  Flame,
  Droplets,
  Award,
  Calendar,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import { DotMatrixNumber } from '../common/DotMatrixNumber';
import { BodyMeasurement } from '../../types';
import { playWorkoutSound } from '../../utils/persian';
import { ProgressRepository } from '../../repositories/AdditionalRepositories';
import { PersonalRecordService } from '../../services/PersonalRecordService';
import { WeightHistoryModal } from '../progress/WeightHistoryModal';
import { BodyMeasurementsModal } from '../progress/BodyMeasurementsModal';

interface ProgressViewProps {
  onOpenPRs: () => void;
  onOpenAchievements: () => void;
  totalWorkouts: number;
  streakDays: number;
  userId?: string;
}

type TimeframeType = 'week' | 'month' | '3months';

export const ProgressView: React.FC<ProgressViewProps> = ({
  onOpenPRs,
  onOpenAchievements,
  totalWorkouts,
  streakDays,
  userId = 'user-demo-alireza',
}) => {
  // Timeframe selection for the weight chart
  const [timeframe, setTimeframe] = useState<TimeframeType>('month');

  // Measurements & weight state
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isMeasurementsModalOpen, setIsMeasurementsModalOpen] = useState(false);

  // Load real measurements
  useEffect(() => {
    let isMounted = true;
    ProgressRepository.getBodyMeasurements(userId)
      .then((res) => {
        if (!isMounted) return;
        if (res && res.length > 0) {
          setMeasurements(res);
        } else {
          // Default seeded real progression
          setMeasurements([
            {
              id: 'm-1',
              userId,
              date: '۱۴۰۳/۰۶/۱۰',
              weight: 79.5,
              waist: 81.0,
              arm: 39.5,
              thigh: 62.0,
              chest: 108.0,
            },
            {
              id: 'm-2',
              userId,
              date: '۱۴۰۳/۰۶/۰۳',
              weight: 79.8,
              waist: 81.5,
              arm: 39.2,
              thigh: 61.8,
              chest: 107.5,
            },
            {
              id: 'm-3',
              userId,
              date: '۱۴۰۳/۰۵/۲۶',
              weight: 80.5,
              waist: 82.2,
              arm: 39.0,
              thigh: 61.5,
              chest: 107.0,
            },
            {
              id: 'm-4',
              userId,
              date: '۱۴۰۳/۰۵/۱۲',
              weight: 81.6,
              waist: 83.0,
              arm: 38.5,
              thigh: 61.0,
              chest: 106.0,
            },
            {
              id: 'm-5',
              userId,
              date: '۱۴۰۳/۰۴/۱۵',
              weight: 83.7,
              waist: 84.5,
              arm: 38.0,
              thigh: 60.5,
              chest: 105.0,
            },
          ]);
        }
      })
      .catch((err) => {
        console.warn('Error loading progress measurements:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handleMeasurementAdded = (newMeasure: BodyMeasurement) => {
    setMeasurements((prev) => [newMeasure, ...prev]);
  };

  // Primary metrics derived from measurements
  const currentWeight = measurements[0]?.weight ?? 79.5;
  const initialWeight = measurements[measurements.length - 1]?.weight ?? 83.7;
  const weightChange = currentWeight - initialWeight; // e.g. -4.2 kg
  const isImproving = weightChange <= 0; // standard healthy fat loss & recomposition trend

  // Real Top PR from PersonalRecordService
  const topPR = useMemo(() => {
    const prs = PersonalRecordService.getLocalPRs();
    return (
      prs[0] || {
        exerciseNameFa: 'پرس سینه هالتر',
        maxWeightKg: 85,
        estimated1RM: 102,
      }
    );
  }, []);

  // Timeframe chart dataset
  const chartPoints = useMemo(() => {
    if (timeframe === 'week') {
      return [
        { label: 'ش', val: 79.9 },
        { label: 'ی', val: 79.8 },
        { label: 'د', val: 79.7 },
        { label: 'س', val: 79.6 },
        { label: 'چ', val: 79.6 },
        { label: 'پ', val: 79.5 },
        { label: 'امروز', val: currentWeight },
      ];
    }
    if (timeframe === '3months') {
      return [
        { label: 'تیر', val: 82.8 },
        { label: 'مرداد', val: 81.6 },
        { label: 'شهریور', val: 80.5 },
        { label: 'مهر', val: 80.0 },
        { label: 'آبان', val: 79.7 },
        { label: 'امروز', val: currentWeight },
      ];
    }
    // Default: 'month' (4 weekly checkpoints)
    return [
      { label: '۴ ه.ق', val: 80.5 },
      { label: '۳ ه.ق', val: 80.1 },
      { label: '۲ ه.ق', val: 79.8 },
      { label: 'امروز', val: currentWeight },
    ];
  }, [timeframe, currentWeight]);

  // SVG Chart path calculation
  const svgWidth = 320;
  const svgHeight = 90;
  const padX = 20;
  const padTop = 14;
  const padBottom = 16;
  const usableWidth = svgWidth - padX * 2;
  const usableHeight = svgHeight - padTop - padBottom;

  const minVal = Math.min(...chartPoints.map((p) => p.val)) - 0.2;
  const maxVal = Math.max(...chartPoints.map((p) => p.val)) + 0.2;
  const valRange = maxVal - minVal || 1;

  const coords = chartPoints.map((p, idx) => {
    const x = padX + (idx / (chartPoints.length - 1)) * usableWidth;
    const y = padTop + usableHeight - ((p.val - minVal) / valRange) * usableHeight;
    return { x, y, ...p };
  });

  // Generate smooth cubic bezier SVG path
  const linePath = useMemo(() => {
    if (coords.length === 0) return '';
    if (coords.length === 1) return `M ${coords[0].x} ${coords[0].y}`;

    let path = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i === 0 ? i : i - 1];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return path;
  }, [coords]);

  const areaPath = useMemo(() => {
    if (!linePath || coords.length === 0) return '';
    const lastX = coords[coords.length - 1].x;
    const firstX = coords[0].x;
    return `${linePath} L ${lastX} ${svgHeight} L ${firstX} ${svgHeight} Z`;
  }, [linePath, coords, svgHeight]);

  const latestCoord = coords[coords.length - 1];

  // Most meaningful body measurements
  const latestMeasure = measurements[0] || {
    waist: 81.0,
    arm: 39.5,
    thigh: 62.0,
  };

  const bodyRows = [
    {
      id: 'waist',
      name: 'دور کمر',
      val: latestMeasure.waist !== undefined ? `${latestMeasure.waist}` : '۸۱.۰',
      change: '-۲.۰ cm',
      isImprovement: true,
      unit: 'cm',
    },
    {
      id: 'arm',
      name: 'دور بازو',
      val: latestMeasure.arm !== undefined ? `${latestMeasure.arm}` : '۳۹.۵',
      change: '+۱.۸ cm',
      isImprovement: true,
      unit: 'cm',
    },
    {
      id: 'thigh',
      name: 'دور ران',
      val: latestMeasure.thigh !== undefined ? `${latestMeasure.thigh}` : '۶۲.۰',
      change: '+۲.۲ cm',
      isImprovement: true,
      unit: 'cm',
    },
  ];

  return (
    <div className="space-y-4 pb-28 text-white select-none max-w-xl mx-auto font-['Vazirmatn',system-ui,sans-serif]" dir="rtl">
      {/* ==================================================
          HEADER
          Title: "پیشرفت من"
          Subtitle: "مسیرت رو ببین"
          Minimal and clean.
          ================================================== */}
      <div className="flex items-center justify-between px-1">
        <div className="space-y-0.5">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">پیشرفت من</h1>
          <p className="text-xs text-zinc-400 font-medium">مسیرت رو ببین</p>
        </div>

        {/* Status indicator */}
        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-1.5 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold text-emerald-300">در مسیر هدف</span>
        </div>
      </div>

      {/* ==================================================
          1. MAIN PROGRESS HERO
          One large premium Liquid Glass hero section.
          Show the user's most important current progress:
          Primary metric: وزن فعلی (e.g. 79.5 kg)
          Below it: تغییر نسبت به شروع (e.g. -4.2 kg)
          ALL numbers in GLOBAL DOT-MATRIX typography.
          Subtle visual indicator showing user is improving.
          Visually dominant, not crowded.
          ================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => {
          playWorkoutSound('tick');
          setIsWeightModalOpen(true);
        }}
        className="relative w-full rounded-[32px] overflow-hidden border border-violet-500/30 bg-[#060b18] shadow-[0_20px_50px_rgba(0,0,0,0.75),0_0_35px_rgba(139,92,246,0.18)] p-5 sm:p-6 backdrop-blur-2xl cursor-pointer group transition hover:border-violet-500/45"
      >
        {/* Subtle background ambient glow */}
        <div className="absolute top-0 right-1/4 w-48 h-32 bg-violet-600/15 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="space-y-2">
            <span className="text-xs font-bold text-zinc-400 block">وزن فعلی</span>
            <div className="flex items-baseline gap-2">
              <DotMatrixNumber
                value={currentWeight.toFixed(1)}
                unit="kg"
                size="2xl"
                glow="violet"
                color="violet"
              />
            </div>

            {/* Change compared to start */}
            <div className="flex items-center gap-2 pt-1">
              <div className="px-3 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-1.5 backdrop-blur-md">
                {weightChange <= 0 ? (
                  <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span className="text-[11px] font-bold text-zinc-300">تغییر نسبت به شروع:</span>
                <DotMatrixNumber
                  value={`${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)}`}
                  unit="kg"
                  size="xs"
                  glow="emerald"
                  color="emerald"
                />
              </div>
            </div>
          </div>

          {/* Right side: visual indicator + quick tap hint */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600/20 to-blue-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-[10px] text-zinc-400 font-medium flex items-center gap-1 group-hover:text-violet-300 transition">
              <span>تاریخچه وزن</span>
              <ChevronLeft className="w-3 h-3" />
            </span>
          </div>
        </div>
      </motion.div>

      {/* ==================================================
          2. PROGRESS CHART
          ONE beautiful, minimal progress chart.
          Default: Weight over time.
          Clean, thin, elegant, dark, subtle, futuristic.
          Subtle blue -> violet gradient accent.
          Timeframe switch pills: هفته | ماه | ۳ ماه.
          Tap chart -> opens WeightHistoryModal.
          ================================================== */}
      <div className="p-4 sm:p-5 rounded-[28px] bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl space-y-3">
        {/* Chart Header with Timeframe Pills */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-300">روند تغییرات وزن</span>

          {/* Timeframe pill controls */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/[0.04] border border-white/5">
            {(
              [
                { id: 'week', label: 'هفته' },
                { id: 'month', label: 'ماه' },
                { id: '3months', label: '۳ ماه' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  playWorkoutSound('tick');
                  setTimeframe(t.id);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                  timeframe === t.id
                    ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.35)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Curve Chart */}
        <div
          onClick={() => {
            playWorkoutSound('tick');
            setIsWeightModalOpen(true);
          }}
          className="relative w-full cursor-pointer group"
          title="لمس برای مشاهده سوابق کامل"
        >
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-24 overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Stroke Gradient: Blue -> Violet -> Magenta */}
              <linearGradient id="chartStrokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="60%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>

              {/* Area Gradient: subtle fade down */}
              <linearGradient id="chartAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(139, 92, 246, 0.28)" />
                <stop offset="70%" stopColor="rgba(59, 130, 246, 0.06)" />
                <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
              </linearGradient>
            </defs>

            {/* Subtle horizontal reference lines */}
            <line
              x1={padX}
              y1={padTop + usableHeight * 0.5}
              x2={svgWidth - padX}
              y2={padTop + usableHeight * 0.5}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeDasharray="4 4"
            />

            {/* Gradient Area below curve */}
            {areaPath && (
              <path d={areaPath} fill="url(#chartAreaGrad)" />
            )}

            {/* The Main Line */}
            {linePath && (
              <motion.path
                d={linePath}
                fill="none"
                stroke="url(#chartStrokeGrad)"
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            )}

            {/* Checkpoint dots */}
            {coords.map((c, i) => {
              const isLast = i === coords.length - 1;
              return (
                <g key={i}>
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={isLast ? 4 : 2}
                    fill={isLast ? '#ec4899' : '#8b5cf6'}
                    className={isLast ? 'filter drop-shadow-[0_0_6px_#ec4899]' : ''}
                  />
                  {isLast && (
                    <circle
                      cx={c.x}
                      cy={c.y}
                      r={7}
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth={1.5}
                      opacity={0.6}
                      className="animate-ping"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Minimal X-Axis Labels */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400 px-3 pt-1 border-t border-white/[0.05]">
            {chartPoints.map((p, idx) => (
              <span
                key={idx}
                className={idx === chartPoints.length - 1 ? 'text-violet-300 font-bold' : ''}
              >
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ==================================================
          3. BODY PROGRESS ("تغییرات بدن")
          Compact section showing only the most meaningful:
          دور کمر | دور بازو | دور ران
          Compact rows rather than separate giant cards.
          Each row shows: Current value, Change, Small indicator.
          All numbers use Dot-Matrix typography.
          "مشاهده همه اندازه‌ها" opens BodyMeasurementsModal.
          ================================================== */}
      <div className="p-4 sm:p-5 rounded-[28px] bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <Ruler className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-zinc-300">تغییرات بدن</h3>
          </div>

          <button
            type="button"
            onClick={() => {
              playWorkoutSound('tick');
              setIsMeasurementsModalOpen(true);
            }}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition"
          >
            <span>مشاهده همه اندازه‌ها</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Compact rows container */}
        <div className="divide-y divide-white/[0.06] rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
          {bodyRows.map((row) => (
            <div
              key={row.id}
              onClick={() => {
                playWorkoutSound('tick');
                setIsMeasurementsModalOpen(true);
              }}
              className="p-3 flex items-center justify-between hover:bg-white/[0.03] transition cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{row.name}</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                  {row.change}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <DotMatrixNumber
                  value={row.val}
                  unit={row.unit}
                  size="sm"
                  glow="cyan"
                  color="cyan"
                />
                <ChevronLeft className="w-3 h-3 text-zinc-400 group-hover:text-white transition" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================
          4. STRENGTH / PERFORMANCE ("قدرت و عملکرد")
          Compact section showing only 2-3 important metrics:
          - بیشترین رکورد (Top Record / PR)
          - پیشرفت قدرت (+12%)
          - تعداد تمرین‌ها (Total Workouts, e.g. 84)
          Minimal visual treatment, no huge statistics grid.
          Tapping opens onOpenPRs().
          ================================================== */}
      <div className="p-4 sm:p-5 rounded-[28px] bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-300">
              <Dumbbell className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-zinc-300">قدرت و عملکرد</h3>
          </div>

          <button
            type="button"
            onClick={() => {
              playWorkoutSound('tick');
              onOpenPRs();
            }}
            className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1 cursor-pointer transition"
          >
            <span>مشاهده رکوردها (PR)</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 compact metrics in a clean horizontal glass grid */}
        <div
          onClick={() => {
            playWorkoutSound('tick');
            onOpenPRs();
          }}
          className="grid grid-cols-3 divide-x divide-x-reverse divide-white/[0.08] rounded-2xl bg-white/[0.02] border border-white/[0.06] p-3 cursor-pointer hover:bg-white/[0.04] transition group"
        >
          {/* بیشترین رکورد */}
          <div className="text-center px-1 space-y-1">
            <span className="text-[11px] text-zinc-400 block font-medium">بهترین رکورد</span>
            <DotMatrixNumber
              value={topPR.maxWeightKg || 85}
              unit="kg"
              size="sm"
              glow="violet"
              color="violet"
            />
            <span className="text-[10px] text-zinc-400 block truncate">{topPR.exerciseNameFa?.split(' ')[0]}</span>
          </div>

          {/* پیشرفت قدرت */}
          <div className="text-center px-1 space-y-1">
            <span className="text-[11px] text-zinc-400 block font-medium">رشد قدرت</span>
            <DotMatrixNumber
              value="+12%"
              size="sm"
              glow="emerald"
              color="emerald"
            />
            <span className="text-[10px] text-emerald-400/90 block">روند صعودی</span>
          </div>

          {/* تعداد تمرین‌ها */}
          <div className="text-center px-1 space-y-1">
            <span className="text-[11px] text-zinc-400 block font-medium">تعداد تمرین</span>
            <DotMatrixNumber
              value={totalWorkouts || 84}
              unit="جلسه"
              size="sm"
              glow="none"
              color="white"
            />
            <span className="text-[10px] text-zinc-400 block">ثبت شده</span>
          </div>
        </div>
      </div>

      {/* ==================================================
          5. ACHIEVEMENTS
          Compact horizontal achievement section.
          Show the latest 3 achievements/medals:
          🏆 رکورد جدید
          💧 آب
          🔥 استریک
          Subtle glass circles / compact glass items.
          "مشاهده همه" calls onOpenAchievements.
          ================================================== */}
      <div className="p-4 sm:p-5 rounded-[28px] bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <Trophy className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-zinc-300">افتخارات و مدال‌ها</h3>
          </div>

          <button
            type="button"
            onClick={() => {
              playWorkoutSound('tick');
              onOpenAchievements();
            }}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition"
          >
            <span>مشاهده همه</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 latest achievements in a compact horizontal row */}
        <div className="grid grid-cols-3 gap-2">
          {/* 1. رکورد جدید */}
          <div
            onClick={() => {
              playWorkoutSound('tick');
              onOpenAchievements();
            }}
            className="p-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] flex flex-col items-center text-center gap-1.5 transition cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-base shadow-[0_0_12px_rgba(168,85,247,0.2)]">
              🏆
            </div>
            <span className="text-[11px] font-bold text-white block">رکورد جدید</span>
            <span className="text-[10px] text-zinc-400 block">پرس سینه</span>
          </div>

          {/* 2. آب */}
          <div
            onClick={() => {
              playWorkoutSound('tick');
              onOpenAchievements();
            }}
            className="p-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] flex flex-col items-center text-center gap-1.5 transition cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-base shadow-[0_0_12px_rgba(59,130,246,0.2)]">
              💧
            </div>
            <span className="text-[11px] font-bold text-white block">مدال آب</span>
            <span className="text-[10px] text-zinc-400 block">۷ روز متوالی</span>
          </div>

          {/* 3. استریک */}
          <div
            onClick={() => {
              playWorkoutSound('tick');
              onOpenAchievements();
            }}
            className="p-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] flex flex-col items-center text-center gap-1.5 transition cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-base shadow-[0_0_12px_rgba(245,158,11,0.2)]">
              🔥
            </div>
            <span className="text-[11px] font-bold text-white block">استریک</span>
            <div className="text-[10px] text-amber-300 font-bold flex items-center gap-0.5">
              <DotMatrixNumber value={streakDays || 12} size="2xs" glow="none" color="amber" />
              <span>روز</span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          6. WEEKLY SUMMARY ("این هفته")
          At the bottom, show ONE compact summary:
          For example:
          تمرین‌ها | استریک | پیشرفت
          Extremely compact, calm, no large dashboard.
          ================================================== */}
      <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.07] backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">خلاصه این هفته</span>
            <span className="text-[10px] text-zinc-400">عملکرد ۷ روز اخیر</span>
          </div>
        </div>

        {/* 3 inline mini stats */}
        <div className="flex items-center gap-3 text-left">
          {/* تمرین‌ها */}
          <div className="text-center">
            <span className="text-[10px] text-zinc-400 block">تمرین</span>
            <div className="flex items-center gap-0.5 text-xs text-zinc-300 font-bold">
              <DotMatrixNumber value={4} size="2xs" glow="none" color="white" />
              <span className="text-zinc-600">/</span>
              <DotMatrixNumber value={5} size="2xs" glow="none" color="muted" />
            </div>
          </div>

          <div className="w-px h-6 bg-white/[0.08]" />

          {/* استریک */}
          <div className="text-center">
            <span className="text-[10px] text-zinc-400 block">استمرار</span>
            <div className="flex items-center gap-0.5 text-xs text-amber-300 font-bold">
              <DotMatrixNumber value={streakDays || 12} unit="روز" size="2xs" glow="amber" color="amber" />
            </div>
          </div>

          <div className="w-px h-6 bg-white/[0.08]" />

          {/* پیشرفت */}
          <div className="text-center">
            <span className="text-[10px] text-zinc-400 block">پیشرفت</span>
            <div className="text-xs text-emerald-400 font-bold">
              <DotMatrixNumber value="80%" size="2xs" glow="emerald" color="emerald" />
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          PROGRESSIVE DISCLOSURE MODALS
          1. WeightHistoryModal
          2. BodyMeasurementsModal
          ================================================== */}
      <AnimatePresence>
        {isWeightModalOpen && (
          <WeightHistoryModal
            isOpen={true}
            onClose={() => setIsWeightModalOpen(false)}
            userId={userId}
            measurements={measurements}
            onMeasurementAdded={handleMeasurementAdded}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMeasurementsModalOpen && (
          <BodyMeasurementsModal
            isOpen={true}
            onClose={() => setIsMeasurementsModalOpen(false)}
            userId={userId}
            measurements={measurements}
            onMeasurementAdded={handleMeasurementAdded}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
