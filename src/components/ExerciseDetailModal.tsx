import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Dumbbell, AlertTriangle, CheckCircle2, Trophy, Flame } from 'lucide-react';
import { Exercise, PersonalRecord } from '../types';
import { FavoritesRepository } from '../repositories/FavoritesRepository';
import { DotMatrixNumber } from './common/DotMatrixNumber';

interface ExerciseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise | null;
  userId?: string;
  onStartWithExercise?: () => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  isOpen,
  onClose,
  exercise,
  userId,
}) => {
  const [isFav, setIsFav] = useState(false);
  const [pr, setPr] = useState<PersonalRecord | null>(null);

  useEffect(() => {
    if (exercise) {
      setIsFav(FavoritesRepository.isFavorite(exercise.id, 'exercise'));
      const savedPR = localStorage.getItem(`polad_pr_${exercise.id}`);
      if (savedPR) {
        setPr(JSON.parse(savedPR));
      } else {
        setPr(null);
      }
    }
  }, [exercise]);

  if (!isOpen || !exercise) return null;

  const handleToggleFavorite = async () => {
    const nextStatus = await FavoritesRepository.toggleFavorite(userId, {
      id: exercise.id,
      type: 'exercise',
      title: exercise.nameFa,
      subtitle: exercise.nameEn,
      category: exercise.primaryMuscle || exercise.targetMuscle,
      rawItem: exercise,
    });
    setIsFav(nextStatus);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 font-['Vazirmatn',system-ui,sans-serif]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl max-h-[88vh] bg-[#0c0819]/90 border border-white/10 rounded-[36px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.95),0_0_40px_rgba(139,92,246,0.15)] flex flex-col overflow-hidden z-10 text-right backdrop-blur-3xl"
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#120c24]/80 sticky top-0 z-10 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.25)]">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">{exercise.nameFa}</h3>
                <p className="text-xs text-zinc-400 font-sans tracking-wide">{exercise.nameEn}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleFavorite}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  isFav
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                    : 'bg-white/[0.05] text-zinc-400 hover:text-white border-white/5'
                }`}
                title={isFav ? 'حذف از نشان‌شده‌ها' : 'نشان کردن حرکت'}
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500' : ''}`} />
              </button>

              <button
                onClick={onClose}
                className="p-2.5 rounded-2xl bg-white/[0.05] text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-violet-500/15 text-violet-300 border border-violet-500/30 text-xs font-bold shadow-[0_0_10px_rgba(139,92,246,0.15)]">
                عضله اصلی: {exercise.primaryMuscle || exercise.targetMuscle}
              </span>
              {exercise.equipment && (
                <span className="px-3 py-1 rounded-xl bg-white/[0.04] text-zinc-300 border border-white/10 text-xs">
                  تجهیزات: {exercise.equipment}
                </span>
              )}
              {exercise.difficulty && (
                <span className="px-3 py-1 rounded-xl bg-white/[0.04] text-zinc-300 border border-white/10 text-xs">
                  سطح: {exercise.difficulty}
                </span>
              )}
            </div>

            {/* Personal Record Badge if available */}
            {pr && (
              <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-300 block">رکورد شخصی ثبت‌شده شما (PR)</span>
                    <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                      <span>محاسبه 1RM تخمینی:</span>
                      <DotMatrixNumber value={pr.estimated1RM} unit="کیلوگرم" size="2xs" glow="amber" color="amber" />
                    </div>
                  </div>
                </div>

                <div className="text-left">
                  <div className="block">
                    <DotMatrixNumber value={pr.maxWeightKg} unit="kg" size="sm" glow="amber" color="amber" />
                  </div>
                  <div className="mt-0.5">
                    <DotMatrixNumber value={pr.maxRepsAtWeight} unit="تکرار" size="2xs" glow="none" color="muted" />
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>مراحل اجرای صحیح حرکت</span>
              </h4>

              <div className="space-y-2">
                {exercise.instructions && exercise.instructions.length > 0 ? (
                  exercise.instructions.map((step, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-3">
                      <span className="w-5 h-5 rounded-lg bg-violet-500/20 text-violet-300 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        <DotMatrixNumber value={idx + 1} size="2xs" glow="none" color="violet" />
                      </span>
                      <p className="text-xs text-zinc-300 leading-relaxed">{step}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-400 leading-relaxed">{exercise.notesFa}</p>
                )}
              </div>
            </div>

            {/* Technique Tips */}
            {exercise.techniqueTipFa && (
              <div className="p-4 rounded-3xl bg-violet-500/10 border border-violet-500/20 space-y-1.5 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                <h4 className="text-xs font-bold text-violet-300 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-violet-400" />
                  <span>نکته طلایی مربی</span>
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed">{exercise.techniqueTipFa}</p>
              </div>
            )}

            {/* Common Mistakes */}
            {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-red-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>اشتباهات رایج برای پیشگیری از آسیب</span>
                </h4>

                <div className="space-y-2">
                  {exercise.commonMistakes.map((mistake, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-red-500/[0.03] border border-red-500/10 flex gap-2.5 items-start">
                      <span className="text-red-400 font-bold text-xs">•</span>
                      <p className="text-xs text-zinc-300 leading-relaxed">{mistake}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
