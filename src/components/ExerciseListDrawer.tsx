import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Dumbbell, Timer, Flame, CheckCircle2, Play, Info, Edit3, ChevronLeft } from 'lucide-react';
import { WorkoutSession, Exercise } from '../types';
import { DotMatrixNumber } from './common/DotMatrixNumber';
import { playWorkoutSound } from '../utils/persian';

interface ExerciseListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  workout: WorkoutSession;
  onStartWorkout: () => void;
  onSelectExercise?: (exercise: Exercise) => void;
  onOpenEditor?: () => void;
}

export const ExerciseListDrawer: React.FC<ExerciseListDrawerProps> = ({
  isOpen,
  onClose,
  workout,
  onStartWorkout,
  onSelectExercise,
  onOpenEditor,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-['Vazirmatn',system-ui,sans-serif]" dir="rtl">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl max-h-[90vh] bg-[#0c0c0c] border border-white/10 rounded-[36px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden z-10 backdrop-blur-2xl text-right"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-zinc-950/80 sticky top-0 z-10 backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-600/15 text-orange-400 border border-orange-500/30">
                  {workout.titleFa}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  فهرست حرکات {workout.muscleGroupsFa}
                </h3>
              </div>
              <div className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                <span>مجموع:</span>
                <DotMatrixNumber value={workout.estimatedMinutes} unit="دقیقه" size="2xs" glow="none" color="muted" />
                <span>• حدود</span>
                <DotMatrixNumber value={workout.targetCalories} unit="کالری سوزی" size="2xs" glow="none" color="muted" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onOpenEditor && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenEditor();
                  }}
                  className="p-2.5 rounded-2xl bg-orange-600/15 hover:bg-orange-600/25 text-orange-400 border border-orange-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="ویرایش حرکات این جلسه"
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="hidden sm:inline">شخصی‌سازی</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="p-2.5 rounded-2xl bg-white/[0.05] text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Exercise List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {workout.exercises.map((exercise, index) => (
              <div
                key={exercise.id || index}
                onClick={() => {
                  if (onSelectExercise) {
                    onSelectExercise(exercise);
                  }
                }}
                className="rounded-[28px] bg-white/[0.02] border border-white/5 hover:border-orange-500/30 p-5 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-2xl bg-orange-600/15 border border-orange-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <DotMatrixNumber value={index + 1} size="xs" glow="orange" color="amber" />
                    </div>

                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        <span>{exercise.nameFa}</span>
                        <ChevronLeft className="w-4 h-4 text-zinc-500 group-hover:text-orange-400 transition-colors" />
                      </h4>
                      <span className="text-xs text-zinc-500 font-mono" dir="ltr">
                        {exercise.nameEn}
                      </span>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20 font-medium">
                          {exercise.targetMuscle}
                        </span>
                        <span className="text-xs text-zinc-400 flex items-center gap-1">
                          <Timer className="w-3.5 h-3.5 text-zinc-400" />
                          <span>استراحت:</span>
                          <DotMatrixNumber value={exercise.restSeconds} unit="ثانیه" size="2xs" glow="none" color="muted" />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left shrink-0 bg-white/[0.03] px-3.5 py-2 rounded-2xl border border-white/5">
                    <span className="text-[11px] text-zinc-500 block text-right">ست‌ها:</span>
                    <div className="mt-0.5">
                      <DotMatrixNumber value={exercise.sets.length} unit="ست" size="xs" glow="none" color="white" />
                    </div>
                  </div>
                </div>

                {/* Sets details pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3.5 pt-3.5 border-t border-white/5">
                  {exercise.sets.map((s) => (
                    <div
                      key={s.id}
                      className="bg-black/40 rounded-xl p-2.5 text-center text-xs border border-white/5"
                    >
                      <div className="text-zinc-500 text-[10px] flex items-center justify-center gap-1">
                        <span>ست</span>
                        <DotMatrixNumber value={s.setNumber} size="2xs" glow="none" color="muted" />
                      </div>
                      <div className="mt-1">
                        <DotMatrixNumber value={s.targetReps} unit="تکرار" size="xs" glow="none" color="white" />
                      </div>
                      {s.targetWeightKg > 0 && (
                        <div className="mt-1">
                          <DotMatrixNumber value={s.targetWeightKg} unit="kg" size="2xs" glow="orange" color="amber" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Technique Tip */}
                {exercise.techniqueTipFa && (
                  <div className="mt-3.5 bg-black/30 rounded-2xl p-3 flex items-start gap-2 text-xs text-zinc-400 border border-white/5">
                    <Info className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-zinc-300">نکته تکنیکی:</strong> {exercise.techniqueTipFa}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="p-5 border-t border-white/5 bg-zinc-950/90 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="py-3 px-5 rounded-2xl text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              بستن
            </button>

            <button
              onClick={() => {
                onClose();
                onStartWorkout();
              }}
              className="flex items-center gap-2 py-3.5 px-7 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-[0_10px_25px_rgba(234,88,12,0.3)] cursor-pointer transition-all active:scale-98"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>شروع همین تمرین</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
