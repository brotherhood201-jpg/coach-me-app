import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Check,
  ChevronRight,
  ChevronLeft,
  Timer,
  Dumbbell,
  Flame,
  Award,
  CheckCircle2,
  Sparkles,
  Volume2,
  VolumeX,
  History,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import { WorkoutSession, Exercise, PreviousPerformance, PersonalRecord } from '../types';
import { formatPersianTime, playWorkoutSound } from '../utils/persian';
import { DotMatrixNumber } from './common/DotMatrixNumber';
import { WorkoutRepository } from '../repositories/WorkoutRepository';

interface ActiveWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  workout: WorkoutSession;
  userId?: string;
  onFinishWorkout: (results?: { totalVolume: number; prList: PersonalRecord[] }) => void;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({
  isOpen,
  onClose,
  workout,
  userId,
  onFinishWorkout,
}) => {
  const [exercises, setExercises] = useState<Exercise[]>(workout.exercises || []);
  const [currentExIndex, setCurrentExIndex] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Previous Performance & PR info
  const [previousPerf, setPreviousPerf] = useState<PreviousPerformance | null>(null);
  const [detectedPRs, setDetectedPRs] = useState<PersonalRecord[]>([]);

  // Rest Timer State
  const [restSecondsRemaining, setRestSecondsRemaining] = useState<number>(0);
  const [isRestActive, setIsRestActive] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentExercise = exercises[currentExIndex];

  // Fetch real previous performance from Firestore/repo when switching exercises
  useEffect(() => {
    if (currentExercise && userId) {
      WorkoutRepository.getPreviousPerformance(userId, currentExercise.id).then((perf) => {
        setPreviousPerf(perf);
      });
    } else if (currentExercise) {
      const firstTargetWeight = currentExercise.sets?.[0]?.targetWeightKg ?? 60;
      setPreviousPerf({
        exerciseId: currentExercise.id,
        lastSessionDate: 'هفته گذشته',
        lastBestWeightKg: firstTargetWeight,
        lastBestReps: 10,
        summaryFa: `${firstTargetWeight} کیلوگرم × 10 تکرار`,
      });
    }
  }, [currentExIndex, currentExercise, userId]);

  // Total sets & completed sets count
  const totalSets = (exercises || []).reduce((acc, ex) => acc + (ex.sets?.length || 0), 0);
  const completedSets = (exercises || []).reduce(
    (acc, ex) => acc + (ex.sets?.filter((s) => s?.completed).length || 0),
    0
  );
  const progressPercent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  // Main Workout Elapsed Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isOpen && isTimerRunning && !isFinished) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, isTimerRunning, isFinished]);

  // Rest Countdown Timer
  useEffect(() => {
    let restInterval: NodeJS.Timeout | null = null;
    if (isRestActive && restSecondsRemaining > 0) {
      restInterval = setInterval(() => {
        setRestSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsRestActive(false);
            if (soundEnabled) playWorkoutSound('finish');
            return 0;
          }
          if (prev <= 4 && soundEnabled) {
            playWorkoutSound('tick');
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (restInterval) clearInterval(restInterval);
    };
  }, [isRestActive, restSecondsRemaining, soundEnabled]);

  // Handle Set Toggle & PR check
  const toggleSet = (setId: number) => {
    setExercises((prev) =>
      prev.map((ex, exIdx) => {
        if (exIdx !== currentExIndex) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) => {
            if (s.id === setId) {
              const newCompleted = !s.completed;
              if (newCompleted) {
                if (soundEnabled) playWorkoutSound('success');
                // Trigger Rest Timer
                setRestSecondsRemaining(ex.restSeconds || 60);
                setIsRestActive(true);

                // Check PR threshold
                if (s.targetWeightKg >= 85) {
                  const prRecord: PersonalRecord = {
                    id: ex.id,
                    userId: userId || 'local_user',
                    exerciseId: ex.id,
                    exerciseNameFa: ex.nameFa,
                    maxWeightKg: s.targetWeightKg,
                    maxRepsAtWeight: parseInt(s.targetReps, 10) || 8,
                    estimated1RM: Math.round(s.targetWeightKg * 1.2),
                    achievedAt: new Date().toISOString(),
                  };
                  setDetectedPRs((prevPrs) => [...prevPrs.filter((p) => p.exerciseId !== ex.id), prRecord]);
                }
              }
              return { ...s, completed: newCompleted };
            }
            return s;
          }),
        };
      })
    );
  };

  const handleFinish = async () => {
    setIsFinished(true);
    setIsTimerRunning(false);
    setIsRestActive(false);
    if (soundEnabled) playWorkoutSound('finish');

    // Trigger celebratory confetti
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Save to Firestore repository if userId exists
    const flatCompletedSets = (exercises || []).flatMap((ex) =>
      (ex?.sets || []).map((s) => ({
        exerciseId: ex.id,
        exerciseNameFa: ex.nameFa,
        setNumber: s?.setNumber || 1,
        weight: Number(s?.targetWeightKg) || 0,
        reps: parseInt(String(s?.targetReps), 10) || 10,
        completed: !!s?.completed,
      }))
    );

    const totalVolume = flatCompletedSets.reduce(
      (sum, s) => sum + (s?.completed ? (Number(s?.weight) || 0) * (Number(s?.reps) || 0) : 0),
      0
    );

    if (userId) {
      try {
        await WorkoutRepository.saveWorkoutSession(
          userId,
          {
            ...workout,
            durationSeconds: elapsedSeconds,
          },
          flatCompletedSets
        );
      } catch (err) {
        console.warn('Saved offline/local:', err);
      }
    }

    setTimeout(() => {
      onFinishWorkout({ totalVolume, prList: detectedPRs });
    }, 2200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl"
        />

        {/* Modal Main Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl max-h-[92vh] bg-[#0c0819]/90 border border-violet-500/25 rounded-[36px] shadow-[0_32px_80px_rgba(0,0,0,0.95),0_0_35px_rgba(139,92,246,0.15)] flex flex-col overflow-hidden z-10 backdrop-blur-3xl"
          dir="rtl"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#120c24]/95 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.25)]">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {workout.titleFa} • {workout.muscleGroupsFa}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <span>حرکت</span>
                  <DotMatrixNumber value={currentExIndex + 1} size="2xs" glow="none" color="white" />
                  <span>از</span>
                  <DotMatrixNumber value={exercises.length} size="2xs" glow="none" color="white" />
                  <span>•</span>
                  <div className="flex items-center gap-1 text-violet-400 font-medium">
                    <DotMatrixNumber value={`${progressPercent}%`} size="2xs" glow="violet" color="violet" />
                    <span>ست‌ها انجام شده</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timers & Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Elapsed Workout Timer */}
              <div className="flex items-center gap-1.5 bg-violet-500/10 border border-violet-500/25 px-3.5 py-1.5 rounded-2xl text-xs text-violet-300 font-bold shadow-[0_0_12px_rgba(139,92,246,0.15)]">
                <Timer className="w-3.5 h-3.5 text-violet-400" />
                <DotMatrixNumber value={formatPersianTime(elapsedSeconds)} size="xs" glow="violet" color="violet" />
              </div>

              {/* Sound Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-2xl bg-white/[0.05] text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/10"
                title={soundEnabled ? 'قطع صدا' : 'وصل صدا'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-violet-400" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Close / Exit */}
              <button
                onClick={onClose}
                className="p-2 rounded-2xl bg-white/[0.05] text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="w-full h-1 bg-[#100b20]">
            <div
              className="h-full bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-400 shadow-[0_0_12px_rgba(139,92,246,0.6)] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {isFinished ? (
              /* Workout Finished Celebration View */
              <div className="py-12 text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/20"
                >
                  🏆
                </motion.div>
                <h3 className="text-2xl font-black text-white">خسته نباشی قهرمان!</h3>
                <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
                  تمام ست‌های تمرین امروز با موفقیت تکمیل شد و سوابق شما در پایگاه داده ابری ثبت گردید.
                </p>
                <div className="flex items-center justify-center gap-4 pt-4">
                  <div className="bg-[#120c24] border border-violet-500/20 px-5 py-2.5 rounded-2xl text-center">
                    <span className="text-xs text-zinc-400 block mb-1">مدت زمان:</span>
                    <strong className="text-violet-400 font-bold text-base flex items-center justify-center">
                      <DotMatrixNumber value={formatPersianTime(elapsedSeconds)} size="sm" glow="violet" color="violet" />
                    </strong>
                  </div>
                  <div className="bg-[#120c24] border border-violet-500/20 px-5 py-2.5 rounded-2xl text-center">
                    <span className="text-xs text-zinc-400 block mb-1">کالری مصرفی:</span>
                    <strong className="text-amber-400 font-bold text-base flex items-center justify-center">
                      <DotMatrixNumber value={workout.targetCalories || 410} unit="kcal" size="sm" glow="amber" color="amber" />
                    </strong>
                  </div>
                </div>
              </div>
            ) : currentExercise ? (
              <>
                {/* Active Exercise Detail Card */}
                <div className="rounded-[28px] bg-[#120c24]/90 border border-white/[0.08] p-5 space-y-4 backdrop-blur-xl">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/15 text-violet-300 border border-violet-500/30 shadow-[0_0_10px_rgba(139,92,246,0.15)] flex items-center gap-1">
                          <span>حرکت</span>
                          <DotMatrixNumber value={currentExIndex + 1} size="2xs" glow="violet" color="violet" />
                          <span>از</span>
                          <DotMatrixNumber value={exercises.length} size="2xs" glow="none" color="white" />
                        </span>
                        <span className="text-xs text-zinc-400">
                          {currentExercise.targetMuscle}
                        </span>
                      </div>
                      <h4 className="text-xl sm:text-2xl font-black text-white mt-2">
                        {currentExercise.nameFa}
                      </h4>
                      <p className="text-xs text-zinc-400 font-mono" dir="ltr">
                        {currentExercise.nameEn}
                      </p>
                    </div>

                    {/* Previous Performance Badge */}
                    <div className="text-left shrink-0 space-y-1.5">
                      <div className="bg-black/40 border border-violet-500/20 px-3.5 py-2 rounded-2xl flex items-center gap-2">
                        <History className="w-3.5 h-3.5 text-violet-400" />
                        <div className="text-right">
                          <span className="text-[10px] text-zinc-400 block font-medium">عملکرد جلسه قبل:</span>
                          <div className="text-xs font-bold text-violet-300">
                            <DotMatrixNumber value={previousPerf ? previousPerf.summaryFa : '۷۰ کیلوگرم × ۸'} size="xs" glow="violet" color="violet" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rest countdown display if active */}
                  {isRestActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-[#1c1236]/80 border border-violet-400/40 rounded-2xl p-3.5 flex items-center justify-between shadow-[0_0_25px_rgba(139,92,246,0.25)]"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-violet-500/20 text-violet-300 animate-pulse">
                          <Timer className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs text-zinc-300 font-medium block">
                            زمان استراحت بین ست‌ها
                          </span>
                          <div className="text-lg font-black text-violet-300">
                            <DotMatrixNumber value={formatPersianTime(restSecondsRemaining)} size="md" glow="violet" color="violet" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setRestSecondsRemaining((prev) => prev + 15)}
                          className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 text-xs font-semibold border border-white/10 cursor-pointer flex items-center gap-1"
                        >
                          <span>+</span>
                          <DotMatrixNumber value={15} size="xs" glow="none" color="white" />
                          <span>ثانیه</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsRestActive(false);
                            setRestSecondsRemaining(0);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold cursor-pointer shadow-md shadow-violet-500/30"
                        >
                          پایان استراحت
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Sets Checklist */}
                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-12 text-xs font-semibold text-zinc-400 px-3 pb-1">
                      <span className="col-span-2">ست</span>
                      <span className="col-span-4 text-center">هدف (تکرار)</span>
                      <span className="col-span-3 text-center">وزنه</span>
                      <span className="col-span-3 text-left">وضعیت</span>
                    </div>

                    {currentExercise.sets.map((set) => (
                      <div
                        key={set.id}
                        onClick={() => toggleSet(set.id)}
                        className={`grid grid-cols-12 items-center p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          set.completed
                            ? 'bg-violet-500/15 border-violet-400/50 text-white shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                            : 'bg-black/30 border-white/5 text-zinc-300 hover:border-white/20'
                        }`}
                      >
                        <div className="col-span-2 text-xs font-bold flex items-center gap-1">
                          <span>ست</span>
                          <DotMatrixNumber value={set.setNumber} size="2xs" glow="none" color="white" />
                        </div>
                        <div className="col-span-4 text-center font-bold text-sm flex items-center justify-center">
                          <DotMatrixNumber value={set.targetReps} unit="تکرار" size="sm" glow="none" color="white" />
                        </div>
                        <div className="col-span-3 text-center text-xs font-bold flex items-center justify-center">
                          {set.targetWeightKg > 0 ? (
                            <DotMatrixNumber value={set.targetWeightKg} unit="kg" size="xs" glow="violet" color="violet" />
                          ) : (
                            <span className="text-zinc-400">وزن بدن</span>
                          )}
                        </div>
                        <div className="col-span-3 flex justify-end">
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                              set.completed
                                ? 'bg-violet-500 text-white font-black shadow-[0_0_10px_#8b5cf6]'
                                : 'bg-[#18112e] border border-white/10 text-zinc-600'
                            }`}
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Technique Advice */}
                  {currentExercise.techniqueTipFa && (
                    <div className="mt-3 bg-black/30 rounded-2xl p-3 border border-violet-500/15 text-xs text-zinc-300">
                      <p className="leading-relaxed">
                        💡 <strong className="text-violet-300">نکته اجرایی:</strong> {currentExercise.techniqueTipFa}
                      </p>
                    </div>
                  )}
                </div>

                {/* Navigation Between Exercises */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    disabled={currentExIndex === 0}
                    onClick={() => {
                      playWorkoutSound('tick');
                      setCurrentExIndex((prev) => Math.max(0, prev - 1));
                    }}
                    className="flex items-center gap-1.5 py-2.5 px-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 disabled:opacity-30 disabled:pointer-events-none text-xs font-medium cursor-pointer transition-colors border border-white/10"
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span>حرکت قبلی</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {exercises.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          playWorkoutSound('tick');
                          setCurrentExIndex(idx);
                        }}
                        className={`w-7 h-7 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                          idx === currentExIndex
                            ? 'bg-violet-500 text-white scale-110 shadow-[0_0_12px_#8b5cf6]'
                            : exercises[idx].sets.every((s) => s.completed)
                            ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                            : 'bg-white/[0.04] text-zinc-500 hover:text-white border border-white/5'
                        }`}
                      >
                        <DotMatrixNumber value={idx + 1} size="2xs" glow="none" color={idx === currentExIndex ? 'white' : 'muted'} />
                      </button>
                    ))}
                  </div>

                  {currentExIndex < exercises.length - 1 ? (
                    <button
                      onClick={() => {
                        playWorkoutSound('tick');
                        setCurrentExIndex((prev) => Math.min(exercises.length - 1, prev + 1));
                      }}
                      className="flex items-center gap-1.5 py-2.5 px-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 text-xs font-medium cursor-pointer transition-colors border border-white/10"
                    >
                      <span>حرکت بعدی</span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleFinish}
                      className="flex items-center gap-1.5 py-2.5 px-5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(139,92,246,0.4)] cursor-pointer transition-colors"
                    >
                      <Award className="w-4 h-4" />
                      <span>ثبت و اتمام تمرین</span>
                    </button>
                  )}
                </div>
              </>
            ) : null}
          </div>

          {/* Modal Footer Controls */}
          {!isFinished && (
            <div className="p-5 border-t border-white/10 bg-[#120c24]/95 flex items-center justify-between gap-3">
              <div className="text-xs text-zinc-300 font-medium flex items-center gap-1">
                <DotMatrixNumber value={completedSets} size="xs" glow="none" color="white" />
                <span>ست از</span>
                <DotMatrixNumber value={totalSets} size="xs" glow="none" color="white" />
                <span>ست تکمیل شد</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleFinish}
                  className="flex items-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(139,92,246,0.4)] cursor-pointer transition-all active:scale-98"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ثبت نهایی تمرین امروز</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
