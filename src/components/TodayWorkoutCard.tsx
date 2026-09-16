import React from 'react';
import { motion } from 'motion/react';
import { Play, CheckCircle2, Clock, Dumbbell, ChevronLeft } from 'lucide-react';
import { WorkoutSession } from '../types';
import { playWorkoutSound } from '../utils/persian';
import { DotMatrixNumber } from './common/DotMatrixNumber';

interface TodayWorkoutCardProps {
  workout: WorkoutSession;
  onStartWorkout: () => void;
  onViewExercises?: () => void;
  isTodayDone?: boolean;
}

export const TodayWorkoutCard: React.FC<TodayWorkoutCardProps> = ({
  workout,
  onStartWorkout,
  onViewExercises,
  isTodayDone = false,
}) => {
  const handleStart = () => {
    playWorkoutSound('beep');
    onStartWorkout();
  };

  // Calculate workout progress if started
  const isStarted = workout.status === 'in_progress' || (workout.exercises && workout.exercises.some((e) => e.sets?.some((s) => s.completed)));
  const completedExercisesCount = workout.exercises
    ? workout.exercises.filter((e) => e.sets?.every((s) => s.completed)).length
    : 0;
  const progressPercent = workout.totalExercises > 0
    ? Math.round((completedExercisesCount / workout.totalExercises) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative w-full rounded-[32px] overflow-hidden border transition-all duration-300 ${
        isTodayDone
          ? 'bg-[#0a1215]/85 border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(16,185,129,0.1)]'
          : 'bg-[#0d091e]/90 border-violet-500/25 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_35px_rgba(139,92,246,0.12)]'
      } backdrop-blur-2xl`}
    >
      {/* Cinematic subtle background image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop"
          alt="تمرین امروز"
          className="w-full h-full object-cover object-center opacity-15"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07050F] via-[#0D0A18]/95 to-[#120b24]/85" />
      </div>

      {/* Ambient glow */}
      <div className={`absolute top-0 right-1/4 w-60 h-28 rounded-full blur-[70px] pointer-events-none ${
        isTodayDone ? 'bg-emerald-500/15' : 'bg-violet-600/20'
      }`} />

      {/* Card Content */}
      <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-between min-h-[300px] sm:min-h-[340px]">
        {/* Top Tag & Status */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={`px-3.5 py-1.5 rounded-full text-xs font-black border flex items-center gap-2 ${
              isTodayDone
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : 'bg-violet-500/15 text-violet-200 border-violet-400/30 shadow-[0_0_12px_rgba(139,92,246,0.2)]'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                isTodayDone ? 'bg-emerald-400' : 'bg-violet-400 animate-pulse'
              }`} />
              <span>تمرین امروز</span>
            </span>
          </div>

          {isTodayDone ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>کامل شد ✓</span>
            </div>
          ) : isStarted ? (
            <span className="text-[11px] font-bold text-violet-300 bg-violet-500/15 border border-violet-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
              <span>در حال اجرا (</span>
              <DotMatrixNumber value={`${progressPercent}%`} size="2xs" glow="violet" color="violet" />
              <span>)</span>
            </span>
          ) : null}
        </div>

        {/* Workout Title & Focus */}
        <div className="my-5">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
            {workout.titleFa || workout.muscleGroupsFa || 'سینه و پشت بازو'}
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1.5 font-medium line-clamp-1">
            {workout.muscleGroupsFa ? `عضلات هدف: ${workout.muscleGroupsFa}` : 'تمرین اختصاصی با تفکیک عضلانی پیشرفته'}
          </p>
        </div>

        {/* Info Metrics Row & In-progress Bar */}
        <div className="space-y-3">
          <div className="flex items-center gap-5 text-xs sm:text-sm text-zinc-300 py-3 border-y border-white/5">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-violet-400" />
              <DotMatrixNumber value={workout.totalExercises} unit="حرکت" size="sm" glow="none" color="white" />
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-400" />
              <DotMatrixNumber value={workout.estimatedMinutes || 45} unit="دقیقه" size="sm" glow="none" color="white" />
            </div>

            {isStarted && !isTodayDone && (
              <div className="flex items-center gap-1 text-violet-300 font-bold mr-auto text-xs">
                <DotMatrixNumber value={completedExercisesCount} size="xs" glow="violet" color="violet" />
                <span>از</span>
                <DotMatrixNumber value={workout.totalExercises} size="xs" glow="none" color="white" />
                <span>انجام شد</span>
              </div>
            )}
          </div>

          {/* Small progress bar if workout has started */}
          {isStarted && !isTodayDone && (
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-l from-purple-500 to-violet-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, progressPercent)}%` }}
              />
            </div>
          )}
        </div>

        {/* Primary CTA */}
        <div className="flex items-center gap-3 pt-4">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            id="start-workout-hero-btn"
            className={`flex-1 py-3.5 sm:py-4 px-6 rounded-2xl text-base sm:text-lg font-black transition-all cursor-pointer flex items-center justify-center gap-2 border select-none ${
              isTodayDone
                ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border-emerald-500/30 shadow-[0_4px_20px_rgba(16,185,129,0.2)]'
                : 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-violet-400/30 shadow-[0_10px_28px_rgba(139,92,246,0.35)]'
            }`}
          >
            {isTodayDone ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>تمرین امروز کامل شد ✓</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current text-white" />
                <span>{isStarted ? 'ادامه تمرین' : 'شروع تمرین'}</span>
              </>
            )}
          </motion.button>

          {onViewExercises && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                playWorkoutSound('tick');
                onViewExercises();
              }}
              className="p-3.5 sm:p-4 rounded-2xl bg-[#140e28]/80 hover:bg-[#1a1236] text-zinc-300 hover:text-white text-xs sm:text-sm font-bold border border-white/10 backdrop-blur-md cursor-pointer transition-all flex items-center gap-1 shrink-0"
              title="مشاهده حرکات"
            >
              <span>حرکات</span>
              <ChevronLeft className="w-4 h-4 text-zinc-400" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
