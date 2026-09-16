import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Calendar,
  History,
  Clock,
  Dumbbell,
  ArrowLeft,
  ChevronLeft,
  SlidersHorizontal,
  X,
  Plus,
  Flame,
  Layers,
  Sparkles,
} from 'lucide-react';
import { DotMatrixNumber } from '../common/DotMatrixNumber';
import { WorkoutSession, WorkoutProgram, WorkoutProgramDay, Exercise } from '../../types';
import { playWorkoutSound } from '../../utils/persian';
import { AdminRepository } from '../../repositories/AdminRepository';
import { COMPREHENSIVE_EXERCISE_LIBRARY } from '../../data/workoutData';

interface WorkoutViewProps {
  currentWorkout: WorkoutSession;
  onStartWorkout: () => void;
  onStartFreeWorkout: () => void;
  onStartCustomWorkoutSession?: (session: WorkoutSession) => void;
  onOpenHistory: () => void;
  onOpenCalendar: () => void;
  onOpenPRs: () => void;
  onOpenEditor: () => void;
  onViewExercises: () => void;
  onSelectExercise?: (exercise: Exercise) => void;
}

export const WorkoutView: React.FC<WorkoutViewProps> = ({
  currentWorkout,
  onStartWorkout,
  onStartFreeWorkout,
  onStartCustomWorkoutSession,
  onOpenHistory,
  onOpenCalendar,
  onOpenPRs,
  onOpenEditor,
  onViewExercises,
  onSelectExercise,
}) => {
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [isProgramsModalOpen, setIsProgramsModalOpen] = useState(false);
  const [selectedProgramForDetails, setSelectedProgramForDetails] = useState<WorkoutProgram | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  useEffect(() => {
    AdminRepository.getWorkoutPrograms().then((data) => {
      if (data && data.length > 0) {
        setPrograms(data.filter((p) => p.status === 'published' || !p.status));
      }
    });
  }, []);

  const handleStartProgramDay = (program: WorkoutProgram, day: WorkoutProgramDay) => {
    playWorkoutSound('success');

    const mappedExercises: Exercise[] = day.exercises.map((progEx, idx) => {
      const match = COMPREHENSIVE_EXERCISE_LIBRARY.find(
        (e) => e.id === progEx.exerciseId || e.nameFa === progEx.nameFa
      );
      const setsCount = progEx.sets || 3;
      return {
        id: progEx.exerciseId || `ex_prog_${idx}`,
        nameFa: progEx.nameFa,
        nameEn: match?.nameEn || '',
        targetMuscle: day.muscleGroupFa || match?.targetMuscle || 'بدن',
        primaryMuscle: match?.primaryMuscle || day.muscleGroupFa,
        equipment: match?.equipment || 'وزنه آزاد',
        difficulty: (program.difficulty as any) || 'متوسط',
        restSeconds: progEx.restSeconds || 75,
        imageUrl:
          match?.imageUrl ||
          'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop',
        videoUrl: match?.videoUrl,
        sets: Array.from({ length: setsCount }, (_, sIdx) => ({
          id: sIdx + 1,
          setNumber: sIdx + 1,
          targetReps: progEx.reps || '10',
          targetWeightKg: (sIdx + 1) * 15 + 30,
          completed: false,
        })),
      };
    });

    const newSession: WorkoutSession = {
      id: `session_${Date.now()}`,
      programId: program.id,
      workoutName: `${program.name} - ${day.titleFa}`,
      titleFa: day.titleFa,
      workoutDay: `روز ${day.dayNumber}`,
      muscleGroupsFa: day.muscleGroupFa,
      totalExercises: mappedExercises.length,
      totalSets: mappedExercises.reduce((acc, e) => acc + e.sets.length, 0),
      totalReps: mappedExercises.length * 30,
      estimatedMinutes: program.estimatedDuration || 50,
      targetCalories: 400,
      intensity: 'متوسط',
      exercises: mappedExercises,
      status: 'in_progress',
      startedAt: new Date().toISOString(),
    };

    if (onStartCustomWorkoutSession) {
      onStartCustomWorkoutSession(newSession);
    } else {
      onStartWorkout();
    }
    setSelectedProgramForDetails(null);
    setIsProgramsModalOpen(false);
  };

  // Preview only the first 3 exercises
  const previewExercises = (currentWorkout.exercises || []).slice(0, 3);
  const totalExercisesCount = currentWorkout.totalExercises || currentWorkout.exercises?.length || 6;
  const estimatedDuration = currentWorkout.estimatedMinutes || 45;
  const heroImage =
    currentWorkout.exercises?.[0]?.imageUrl ||
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop';

  return (
    <div className="space-y-4 pb-28 text-white select-none max-w-xl mx-auto" dir="rtl">
      {/* --------------------------------------------------
          1. HEADER
          "تمرین امروز" + supporting info (e.g. روز ۳ از برنامه)
          Minimal utility icons for Calendar & History
          -------------------------------------------------- */}
      <div className="flex items-center justify-between px-1">
        <div className="space-y-0.5">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">تمرین امروز</h1>
          <p className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
            <span>{currentWorkout.workoutDay || 'روز ۳ از برنامه'}</span>
            {currentWorkout.workoutName && (
              <>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400 truncate max-w-[180px]">{currentWorkout.workoutName}</span>
              </>
            )}
          </p>
        </div>

        {/* Header Utilities: Calendar, History & Programs button */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              playWorkoutSound('tick');
              onOpenCalendar();
            }}
            title="تقویم تمرینی"
            className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              playWorkoutSound('tick');
              onOpenHistory();
            }}
            title="تاریخچه تمرینات"
            className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <History className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              playWorkoutSound('tick');
              setIsProgramsModalOpen(true);
            }}
            title="سایر برنامه‌ها و ابزارها"
            className="w-8 h-8 rounded-full bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/30 text-violet-300 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* --------------------------------------------------
          2. PRIMARY WORKOUT CARD
          The main visual focus of the page.
          Dark cinematic image + gradient overlay + Liquid Glass.
          Shows: نام تمرین, مدت زمان, تعداد حرکات, سطح تمرین.
          ONE primary CTA: "شروع تمرین" (Blue → Violet → Magenta pill).
          -------------------------------------------------- */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative w-full rounded-[32px] overflow-hidden border border-violet-500/30 bg-[#060b18] shadow-[0_20px_50px_rgba(0,0,0,0.75),0_0_35px_rgba(139,92,246,0.18)] p-5 sm:p-6 flex flex-col justify-between min-h-[290px] sm:min-h-[310px] group"
      >
        {/* Dark Cinematic Background with Gradient Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={heroImage}
            alt={currentWorkout.titleFa || 'تمرین امروز'}
            className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060b18] via-[#060b18]/80 to-[#060b18]/45" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#060b18]/85 via-transparent to-transparent" />
        </div>

        {/* Top Badges: Level & Target Muscle */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 backdrop-blur-md">
              سطح {currentWorkout.intensity || currentWorkout.difficultyFa || 'متوسط'}
            </span>
            {currentWorkout.muscleGroupsFa && (
              <span className="text-xs text-zinc-300 backdrop-blur-md bg-white/[0.06] border border-white/10 px-2.5 py-1 rounded-full truncate max-w-[170px]">
                {currentWorkout.muscleGroupsFa}
              </span>
            )}
          </div>

          {/* Quick link to exercise list drawer */}
          <button
            type="button"
            onClick={onViewExercises}
            className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            <span>حرکات</span>
            <ChevronLeft className="w-3 h-3 text-zinc-400" />
          </button>
        </div>

        {/* Middle: Workout Name + 2 Clean Stats in Dot-Matrix */}
        <div className="relative z-10 py-3 space-y-3">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {currentWorkout.titleFa || currentWorkout.muscleGroupsFa || 'تمرین قدرتی بالاتنه'}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-normal">
              تمرکز بر اجرای صحیح، بارگذاری تدریجی و تفکیک عضلانی
            </p>
          </div>

          {/* Useful stats only: Duration + Exercises */}
          <div className="flex items-center gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs text-zinc-200 bg-white/[0.06] backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/[0.08]">
              <Dumbbell className="w-4 h-4 text-violet-400" />
              <div className="flex items-center gap-1">
                <DotMatrixNumber value={totalExercisesCount} size="xs" glow="none" color="white" />
                <span className="text-zinc-400">حرکت</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-200 bg-white/[0.06] backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/[0.08]">
              <Clock className="w-4 h-4 text-sky-400" />
              <div className="flex items-center gap-1">
                <DotMatrixNumber value={estimatedDuration} size="xs" glow="none" color="white" />
                <span className="text-zinc-400">دقیقه</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: ONE Primary CTA — Blue → Violet → Magenta Pill */}
        <div className="relative z-10 pt-1">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              playWorkoutSound('beep');
              onStartWorkout();
            }}
            className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 text-white font-black text-base border border-white/25 shadow-[0_10px_35px_rgba(139,92,246,0.5)] hover:shadow-[0_12px_45px_rgba(139,92,246,0.7)] transition flex items-center justify-center gap-3 cursor-pointer group"
          >
            <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
            <span>شروع تمرین</span>
          </motion.button>
        </div>
      </motion.div>

      {/* --------------------------------------------------
          3. EXERCISE PREVIEW
          Shows ONLY a compact preview of approximately first 3 exercises.
          Tapping an exercise opens the existing Exercise Detail screen.
          "مشاهده همه حرکات →" opens the full exercise drawer.
          -------------------------------------------------- */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-zinc-400">حرکات این جلسه (پیش‌نمایش)</h3>
          <span className="text-[11px] text-zinc-500">
            ۳ حرکت از {totalExercisesCount} حرکت
          </span>
        </div>

        <div className="space-y-2">
          {previewExercises.map((ex, idx) => {
            const setsCount = ex.sets?.length || 3;
            const targetReps = ex.sets?.[0]?.targetReps || '10-12';

            return (
              <motion.div
                key={ex.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => {
                  playWorkoutSound('tick');
                  if (onSelectExercise) {
                    onSelectExercise(ex);
                  } else {
                    onViewExercises();
                  }
                }}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-[#0c0a1a]/85 via-[#110c22]/80 to-[#0c0a1a]/85 border border-white/[0.07] hover:border-violet-500/35 backdrop-blur-xl transition-all cursor-pointer group flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Number Badge with DotMatrixNumber */}
                  <div className="w-7 h-7 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center shrink-0">
                    <DotMatrixNumber value={idx + 1} size="2xs" glow="none" color="violet" />
                  </div>

                  {/* Thumbnail */}
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-white/10 shrink-0">
                    <img
                      src={
                        ex.imageUrl ||
                        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=200&auto=format&fit=crop'
                      }
                      alt={ex.nameFa}
                      className="w-full h-full object-cover group-hover:scale-108 transition duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Name and sets × reps */}
                  <div className="min-w-0 space-y-0.5">
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-violet-200 transition truncate">
                      {ex.nameFa}
                    </h4>
                    <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                      <DotMatrixNumber value={setsCount} unit="ست" size="2xs" glow="none" color="muted" />
                      <span>×</span>
                      <DotMatrixNumber value={targetReps} unit="تکرار" size="2xs" glow="none" color="muted" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-400 group-hover:text-violet-300 transition shrink-0">
                  <span>جزئیات</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View all exercises button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => {
            playWorkoutSound('tick');
            onViewExercises();
          }}
          className="w-full py-3 px-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-bold text-violet-300 hover:text-white flex items-center justify-center gap-2 transition cursor-pointer mt-1"
        >
          <span>مشاهده همه حرکات ({totalExercisesCount})</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      {/* --------------------------------------------------
          4. SECONDARY TOOLS & PROGRAMS MODAL
          Preserves 100% of existing functionality:
          - Free Workout
          - Workout Routine Editor
          - Personal Records (PRs)
          - Other Published Programs
          All kept clean and accessible on demand.
          -------------------------------------------------- */}
      <AnimatePresence>
        {isProgramsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 font-['Vazirmatn',system-ui,sans-serif]" dir="rtl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProgramsModalOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl max-h-[85vh] bg-[#0c0919] border border-violet-500/25 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden z-10 text-right backdrop-blur-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/5 bg-[#120e24]/90 sticky top-0 z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">ابزارها و سایر دوره‌ها</h3>
                    <p className="text-[11px] text-zinc-400">دسترسی به برنامه‌های دیگر، طراحی تمرین و ابزارها</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsProgramsModalOpen(false)}
                  className="p-2 rounded-xl bg-white/[0.05] text-zinc-400 hover:text-white transition cursor-pointer border border-white/5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* Fast Action Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProgramsModalOpen(false);
                      onStartFreeWorkout();
                    }}
                    className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex flex-col items-center justify-center gap-1.5 transition text-center cursor-pointer group"
                  >
                    <Flame className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-bold text-zinc-200">تمرین آزاد</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProgramsModalOpen(false);
                      onOpenEditor();
                    }}
                    className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex flex-col items-center justify-center gap-1.5 transition text-center cursor-pointer group"
                  >
                    <Plus className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-bold text-zinc-200">طراحی برنامه</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProgramsModalOpen(false);
                      onOpenPRs();
                    }}
                    className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex flex-col items-center justify-center gap-1.5 transition text-center cursor-pointer group"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-bold text-zinc-200">رکوردهای من</span>
                  </button>
                </div>

                {/* Other Published Programs List */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-zinc-400">سایر برنامه‌های تمرینی</h4>

                  {programs.length === 0 ? (
                    <div className="text-center py-6 text-zinc-500 text-xs">
                      برنامه تمرینی دیگری در دسترس نیست.
                    </div>
                  ) : (
                    programs.map((prog) => (
                      <div
                        key={prog.id}
                        className="p-3.5 rounded-2xl bg-[#140e26]/70 border border-white/5 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-white/10 shrink-0">
                            <img
                              src={
                                prog.coverImage ||
                                'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80'
                              }
                              alt={prog.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          <div className="min-w-0 space-y-0.5">
                            <h5 className="text-xs font-bold text-white truncate">{prog.name}</h5>
                            <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                              <span>هدف: {prog.goal || 'هایپرتروفی'}</span>
                              <span>•</span>
                              <DotMatrixNumber
                                value={prog.daysPerWeek || prog.days?.length || 4}
                                unit="روز"
                                size="2xs"
                                glow="none"
                                color="muted"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedProgramForDetails(prog);
                              setSelectedDayIndex(0);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white border border-white/10 text-xs font-bold transition cursor-pointer"
                          >
                            جزئیات
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Program Details Modal (when user taps "جزئیات" of another program) */}
      <AnimatePresence>
        {selectedProgramForDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 font-['Vazirmatn',system-ui,sans-serif]" dir="rtl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProgramForDetails(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[88vh] bg-[#0d0a18] border border-violet-500/25 rounded-[36px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.95),0_0_40px_rgba(139,92,246,0.15)] flex flex-col overflow-hidden z-10 text-right backdrop-blur-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/5 bg-[#120e24]/90 sticky top-0 z-10 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">{selectedProgramForDetails.name}</h3>
                    <p className="text-xs text-zinc-400">{selectedProgramForDetails.goal || 'برنامه تمرینی'}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProgramForDetails(null)}
                  className="p-2.5 rounded-2xl bg-white/[0.05] text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {selectedProgramForDetails.description || 'برنامه جامع بدنسازی با تفکیک عضلات و بار تمرینی بهینه.'}
                </p>

                {/* Day Navigation Tabs */}
                {selectedProgramForDetails.days && selectedProgramForDetails.days.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                      {selectedProgramForDetails.days.map((day, idx) => (
                        <button
                          key={day.dayNumber || idx}
                          type="button"
                          onClick={() => {
                            playWorkoutSound('tick');
                            setSelectedDayIndex(idx);
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                            selectedDayIndex === idx
                              ? 'bg-violet-600/25 text-violet-200 border border-violet-400/40 shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                              : 'bg-[#140e26]/70 text-zinc-400 border border-white/5 hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            <span>روز</span>
                            <DotMatrixNumber
                              value={day.dayNumber}
                              size="2xs"
                              glow="none"
                              color={selectedDayIndex === idx ? 'violet' : 'muted'}
                            />
                            <span>: {day.muscleGroupFa || day.titleFa}</span>
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Active Day Content */}
                    {selectedProgramForDetails.days[selectedDayIndex] && (
                      <div className="space-y-3 bg-[#140e26]/80 p-4 rounded-3xl border border-white/5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-black text-white">
                              {selectedProgramForDetails.days[selectedDayIndex].titleFa}
                            </h4>
                            <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                              <span>تعداد حرکات:</span>
                              <DotMatrixNumber
                                value={selectedProgramForDetails.days[selectedDayIndex].exercises.length}
                                unit="حرکت"
                                size="2xs"
                                glow="none"
                                color="muted"
                              />
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleStartProgramDay(
                                selectedProgramForDetails,
                                selectedProgramForDetails.days![selectedDayIndex]
                              )
                            }
                            className="py-2 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>شروع تمرین این روز</span>
                          </button>
                        </div>

                        {/* Exercises List for this day */}
                        <div className="space-y-2 pt-2">
                          {selectedProgramForDetails.days[selectedDayIndex].exercises.map((ex, exIdx) => (
                            <div
                              key={ex.exerciseId || exIdx}
                              className="p-3 bg-[#0c0818]/70 rounded-2xl border border-white/5 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-xl bg-violet-500/15 text-violet-300 text-xs font-black flex items-center justify-center">
                                  <DotMatrixNumber value={exIdx + 1} size="2xs" glow="none" color="violet" />
                                </span>
                                <div>
                                  <h5 className="text-xs font-bold text-white">{ex.nameFa}</h5>
                                  <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                                    <DotMatrixNumber value={ex.sets} unit="ست" size="2xs" glow="none" color="muted" />
                                    <span>×</span>
                                    <DotMatrixNumber value={ex.reps} unit="تکرار" size="2xs" glow="none" color="muted" />
                                    <span>• استراحت:</span>
                                    <DotMatrixNumber
                                      value={ex.restSeconds}
                                      unit="ثانیه"
                                      size="2xs"
                                      glow="none"
                                      color="muted"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-zinc-500 text-xs">
                    هنوز روزهای تمرینی برای این برنامه تعریف نشده است.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
