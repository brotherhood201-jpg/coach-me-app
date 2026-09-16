import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Target,
  Flame,
  Zap,
  Heart,
  Activity,
  Award,
  Trophy,
  Rocket,
  Calendar,
  RotateCcw,
  CheckCircle2,
  Star,
  Crown,
  Shield,
  Building2,
  Home,
  Layers,
  Dumbbell,
  Clock,
  User,
  HeartPulse,
  ChevronLeft,
  ChevronRight,
  Check,
  Sliders,
  Info,
  X,
  Boxes,
  CircleDot,
} from 'lucide-react';
import { UserProfile, OnboardingAnswers, WorkoutProgram, ProgramMatchResult } from '../../types';
import { RecommendationEngine } from '../../services/RecommendationEngine';
import { AdminRepository } from '../../repositories/AdminRepository';
import { UserRepository } from '../../repositories/UserRepository';
import { DotMatrixNumber } from '../common/DotMatrixNumber';
import { playWorkoutSound } from '../../utils/persian';

interface FitnessOnboardingFlowProps {
  userId?: string;
  initialProfile?: Partial<UserProfile>;
  isEditMode?: boolean;
  initialStep?: number;
  onComplete: (updatedProfile: UserProfile, recommendedProgram: WorkoutProgram) => void;
  onClose?: () => void;
}

export const FitnessOnboardingFlow: React.FC<FitnessOnboardingFlowProps> = ({
  userId = 'guest',
  initialProfile,
  isEditMode = false,
  initialStep,
  onComplete,
  onClose,
}) => {
  // Step 1..10 = Question screens
  const [step, setStep] = useState<number>(() => {
    if (initialStep !== undefined) return initialStep;
    return 1;
  });
  const totalSteps = 10;

  // Form State initialized from initialProfile
  const [answers, setAnswers] = useState<OnboardingAnswers>({
    primaryGoal: (initialProfile?.primaryGoal || initialProfile?.goal as any) || 'muscle_gain',
    trainingExperience: initialProfile?.trainingExperience || 'intermediate',
    fitnessLevel: initialProfile?.fitnessLevel || 'intermediate',
    daysPerWeek: initialProfile?.daysPerWeek || initialProfile?.trainingDaysPerWeek || 4,
    workoutLocation: (initialProfile?.workoutLocation as any) || 'gym',
    availableEquipment: Array.isArray(initialProfile?.availableEquipment)
      ? initialProfile.availableEquipment
      : ['دمبل', 'هالتر', 'نیمکت', 'دستگاه'],
    workoutDuration: (initialProfile?.workoutDuration as any) || '45_60',
    name: initialProfile?.name || 'ورزشکار عزیز',
    age: initialProfile?.age || 24,
    gender: initialProfile?.gender || 'male',
    heightCm: initialProfile?.heightCm || initialProfile?.height || 180,
    weightKg: initialProfile?.weightKg || initialProfile?.weight || 78,
    priorityMuscles: initialProfile?.priorityMuscles || ['سینه', 'پشت و زیربغل'],
    trainingPreferences: initialProfile?.trainingPreferences || ['وزنه‌های آزاد', 'هایپرتروفی استاندارد'],
  });

  // Track status key for step 2 (Experience status)
  const [trainingStatusKey, setTrainingStatusKey] = useState<string>('regular');

  // Programs and matched recommendations
  const [allPrograms, setAllPrograms] = useState<WorkoutProgram[]>([]);
  const [matchResults, setMatchResults] = useState<ProgramMatchResult[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string>('');
  const [showAllPrograms, setShowAllPrograms] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Load programs from database or fallback to seed
  useEffect(() => {
    AdminRepository.getWorkoutPrograms().then((progs) => {
      if (progs && progs.length > 0) {
        setAllPrograms(progs);
      }
    });
  }, []);

  // Compute matches when arriving at step 10
  useEffect(() => {
    if (step === 10) {
      const results = RecommendationEngine.matchPrograms(answers, allPrograms);
      setMatchResults(results);
      if (results.length > 0 && !selectedProgramId) {
        setSelectedProgramId(results[0].program.id);
      }
    }
  }, [step, answers, allPrograms]);

  // Smooth auto-advancing on single choice selection
  const handleSingleSelect = (updateFn: () => void) => {
    playWorkoutSound('tick');
    updateFn();
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setStep((prev) => Math.min(totalSteps, prev + 1));
      setIsTransitioning(false);
    }, 320);
  };

  const handleNext = () => {
    playWorkoutSound('tick');
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    } else {
      handleFinalize();
    }
  };

  const handleBack = () => {
    playWorkoutSound('tick');
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else if (step === 1 && onClose) {
      onClose();
    }
  };

  // Toggle multi-select equipment
  const toggleEquipment = (eq: string) => {
    playWorkoutSound('tick');
    setAnswers((prev) => {
      if (eq === 'بدون تجهیزات') {
        const isCurrentlySelected = prev.availableEquipment.includes('بدون تجهیزات');
        return {
          ...prev,
          availableEquipment: isCurrentlySelected ? [] : ['بدون تجهیزات'],
        };
      } else {
        const filtered = prev.availableEquipment.filter((item) => item !== 'بدون تجهیزات');
        const exists = filtered.includes(eq);
        return {
          ...prev,
          availableEquipment: exists
            ? filtered.filter((item) => item !== eq)
            : [...filtered, eq],
        };
      }
    });
  };

  // Toggle multi-select muscle priorities
  const togglePriorityMuscle = (muscle: string) => {
    playWorkoutSound('tick');
    setAnswers((prev) => {
      const exists = prev.priorityMuscles.includes(muscle);
      return {
        ...prev,
        priorityMuscles: exists
          ? prev.priorityMuscles.filter((m) => m !== muscle)
          : [...prev.priorityMuscles, muscle],
      };
    });
  };

  // Finalize & Persist to Firestore / LocalStorage
  const handleFinalize = async () => {
    setIsSaving(true);
    playWorkoutSound('success');

    const chosenProg =
      matchResults.find((r) => r.program.id === selectedProgramId)?.program ||
      matchResults[0]?.program ||
      allPrograms[0];

    const now = new Date().toISOString();

    const finalProfile: UserProfile = {
      userId,
      name: answers.name.trim() || 'ورزشکار عزیز',
      email: initialProfile?.email || '',
      age: Number(answers.age) || 24,
      gender: answers.gender,
      height: Number(answers.heightCm) || 180,
      heightCm: Number(answers.heightCm) || 180,
      weight: Number(answers.weightKg) || 78,
      weightKg: Number(answers.weightKg) || 78,
      fitnessLevel: answers.fitnessLevel,
      trainingExperience: answers.trainingExperience,
      primaryGoal: answers.primaryGoal,
      goal: answers.primaryGoal,
      trainingDaysPerWeek: answers.daysPerWeek,
      daysPerWeek: answers.daysPerWeek,
      workoutLocation: answers.workoutLocation,
      availableEquipment: answers.availableEquipment,
      workoutDuration: answers.workoutDuration,
      priorityMuscles: answers.priorityMuscles,
      trainingPreferences: answers.trainingPreferences,
      recommendedProgramId: chosenProg?.id,
      activeProgramId: chosenProg?.id,
      onboardingCompleted: true,
      isProfileComplete: true,
      streakDays: initialProfile?.streakDays ?? 1,
      totalWorkoutsDone: initialProfile?.totalWorkoutsDone ?? 0,
      createdAt: initialProfile?.createdAt || now,
      updatedAt: now,
    };

    try {
      if (userId && userId !== 'guest') {
        await UserRepository.saveUserProfile(finalProfile);
      }
      localStorage.setItem('polad_user_profile', JSON.stringify(finalProfile));
      localStorage.setItem('polad_onboarding_completed', 'true');
      localStorage.setItem('polad_profile_setup_done', 'true');
      onComplete(finalProfile, chosenProg);
    } catch (err) {
      console.warn('Error saving onboarding profile:', err);
      onComplete(finalProfile, chosenProg);
    } finally {
      setIsSaving(false);
    }
  };

  // Helper labels for summary
  const getGoalLabel = (goal?: string) => {
    switch (goal) {
      case 'muscle_gain':
        return 'عضله‌سازی';
      case 'fat_loss':
        return 'چربی‌سوزی';
      case 'strength':
        return 'افزایش قدرت';
      case 'maintenance':
        return 'تناسب اندام';
      case 'endurance':
        return 'افزایش استقامت';
      default:
        return 'تناسب اندام';
    }
  };

  const getLevelLabel = (level?: string) => {
    switch (level) {
      case 'advanced':
        return 'پیشرفته';
      case 'intermediate':
        return 'متوسط';
      case 'beginner':
      default:
        return 'مبتدی';
    }
  };

  const getLocationLabel = (loc?: string) => {
    switch (loc) {
      case 'home_equipment':
      case 'home_bodyweight':
        return 'خانه';
      case 'outdoor':
        return 'فضای باز';
      case 'gym':
      default:
        return 'باشگاه';
    }
  };

  const getDurationLabel = (dur?: string | number) => {
    if (dur === '30_45') return '30 - 45 دقیقه';
    if (dur === '45_60') return '45 - 60 دقیقه';
    if (dur === '60_90') return 'بیشتر از 60 دقیقه';
    return `${dur || 45} دقیقه`;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#060810] text-zinc-100 flex items-center justify-center p-0 sm:p-4 font-['Vazirmatn',system-ui,sans-serif] selection:bg-purple-500 selection:text-white select-none overflow-y-auto"
      dir="rtl"
    >
      {/* Cinematic Ambient Background Glows */}
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-violet-800/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Mobile Screen Wrapper (Restrained max-w for phone feel on desktop) */}
      <div className="w-full max-w-[430px] h-full sm:h-[860px] sm:max-h-[94vh] bg-[#090d1a]/90 backdrop-blur-2xl sm:rounded-[44px] sm:border sm:border-white/[0.08] sm:shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_50px_rgba(139,92,246,0.12)] relative flex flex-col justify-between overflow-hidden">

        {/* Subtle Top Inner Highlight */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-30" />

        {/* Top Bar (Header + Segmented Progress Bar) */}
        <div className="w-full px-5 pt-5 pb-3 z-20 shrink-0 space-y-3">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <button
              type="button"
              onClick={handleBack}
              aria-label="بازگشت"
              className="w-10 h-10 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] active:scale-95 border border-white/[0.08] flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Step indicator tag */}
            <div className="text-xs font-bold text-purple-300/80 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
              <span>گام</span>
              <DotMatrixNumber value={step} size="2xs" glow="none" color="purple" />
              <span>از</span>
              <DotMatrixNumber value={totalSteps} size="2xs" glow="none" color="purple" />
            </div>

            {/* Skip or Cancel button */}
            {isEditMode && onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-zinc-400 hover:text-white px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] transition-colors cursor-pointer"
              >
                انصراف
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  playWorkoutSound('tick');
                  setStep(10);
                }}
                className="text-xs font-bold text-zinc-400 hover:text-purple-300 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] transition-all cursor-pointer"
              >
                رد کردن
              </button>
            )}
          </div>

          {/* Minimal Segmented Progress Bar (Liquid Glass capsules) */}
          <div className="flex items-center gap-1.5 w-full pt-1">
            {Array.from({ length: totalSteps }).map((_, i) => {
              const stepNum = i + 1;
              const isCurrent = stepNum === step;
              const isCompleted = stepNum < step;
              return (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isCurrent
                      ? 'flex-1 bg-gradient-to-r from-purple-400 to-violet-500 shadow-[0_0_12px_rgba(168,85,247,0.75)]'
                      : isCompleted
                      ? 'w-2.5 bg-purple-500/50'
                      : 'flex-1 bg-white/[0.07]'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Step Content Container (Scrollable Area) */}
        <div className="flex-1 w-full px-5 py-2 overflow-y-auto z-10 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {/* ============================================================ */}
            {/* SCREEN 1: PRIMARY GOAL */}
            {/* ============================================================ */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="space-y-5 my-auto py-2"
              >
                <div className="space-y-1.5 text-center">
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    <span className="text-purple-400">هدف اصلی</span>
                    <br />
                    تو چیه؟
                  </h2>
                  <p className="text-xs text-zinc-400">
                    مهم‌ترین هدفی که می‌خوای بهش برسی رو انتخاب کن.
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  {[
                    { id: 'muscle_gain', title: 'عضله‌سازی', icon: Dumbbell },
                    { id: 'fat_loss', title: 'چربی‌سوزی', icon: Flame },
                    { id: 'strength', title: 'افزایش قدرت', icon: Zap },
                    { id: 'maintenance', title: 'تناسب اندام', icon: Heart },
                    { id: 'endurance', title: 'افزایش استقامت', icon: Activity },
                  ].map((item) => {
                    const selected = answers.primaryGoal === item.id;
                    const IconComp = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          handleSingleSelect(() => {
                            setAnswers((p) => ({ ...p, primaryGoal: item.id as any }));
                          })
                        }
                        className={`w-full p-4 rounded-3xl text-right transition-all cursor-pointer flex items-center justify-between gap-3 border ${
                          selected
                            ? 'bg-gradient-to-r from-purple-700/80 to-violet-600/90 border-purple-400/80 shadow-[0_0_25px_rgba(168,85,247,0.35),inset_0_1px_2px_rgba(255,255,255,0.25)] text-white scale-[1.01]'
                            : 'bg-white/[0.04] hover:bg-white/[0.07] border-white/[0.08] text-zinc-300 hover:text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                              selected
                                ? 'bg-white/20 text-white'
                                : 'bg-white/[0.05] text-purple-400'
                            }`}
                          >
                            <IconComp className="w-5 h-5 stroke-[2.2]" />
                          </div>
                          <span className="text-sm sm:text-base font-black">{item.title}</span>
                        </div>

                        <div
                          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                            selected
                              ? 'bg-white text-purple-900 border-white shadow-sm'
                              : 'border-white/20'
                          }`}
                        >
                          {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* SCREEN 2: CURRENT TRAINING STATUS / EXPERIENCE */}
            {/* ============================================================ */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="space-y-5 my-auto py-2"
              >
                <div className="space-y-1.5 text-center">
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    وضعیت تمرینت
                    <br />
                    <span className="text-purple-400">الان چطوره؟</span>
                  </h2>
                  <p className="text-xs text-zinc-400">
                    بهم بگو در حال حاضر کجای پیش‌تمرینی هستی
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  {[
                    { id: 'fresh', title: 'تازه می‌خوام شروع کنم', exp: 'beginner', icon: Rocket },
                    { id: 'sometimes', title: 'گاهی تمرین می‌کنم', exp: 'beginner', icon: Calendar },
                    { id: 'restart', title: 'بعد از مدتی دوباره شروع کردم', exp: 'intermediate', icon: RotateCcw },
                    { id: 'regular', title: 'به‌طور منظم تمرین می‌کنم', exp: 'intermediate', icon: CheckCircle2 },
                    { id: 'veteran', title: 'چند ساله تمرین می‌کنم', exp: 'advanced', icon: Trophy },
                  ].map((item) => {
                    const selected = trainingStatusKey === item.id;
                    const IconComp = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          handleSingleSelect(() => {
                            setTrainingStatusKey(item.id);
                            setAnswers((p) => ({ ...p, trainingExperience: item.exp as any }));
                          })
                        }
                        className={`w-full p-4 rounded-3xl text-right transition-all cursor-pointer flex items-center justify-between gap-3 border ${
                          selected
                            ? 'bg-gradient-to-r from-purple-700/80 to-violet-600/90 border-purple-400/80 shadow-[0_0_25px_rgba(168,85,247,0.35),inset_0_1px_2px_rgba(255,255,255,0.25)] text-white scale-[1.01]'
                            : 'bg-white/[0.04] hover:bg-white/[0.07] border-white/[0.08] text-zinc-300 hover:text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                              selected
                                ? 'bg-white/20 text-white'
                                : 'bg-white/[0.05] text-purple-400'
                            }`}
                          >
                            <IconComp className="w-5 h-5 stroke-[2.2]" />
                          </div>
                          <span className="text-sm font-black">{item.title}</span>
                        </div>

                        <div
                          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                            selected
                              ? 'bg-white text-purple-900 border-white shadow-sm'
                              : 'border-white/20'
                          }`}
                        >
                          {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* SCREEN 3: FITNESS LEVEL */}
            {/* ============================================================ */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="space-y-5 my-auto py-2"
              >
                <div className="space-y-1.5 text-center">
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    <span className="text-purple-400">سطح تمرینت</span>
                    <br />
                    چطوره؟
                  </h2>
                  <p className="text-xs text-zinc-400">
                    سطح خودت رو انتخاب کن
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { id: 'beginner', title: 'مبتدی', desc: 'یادگیری فرم صحیح و وزنه‌های پایه', icon: Star },
                    { id: 'intermediate', title: 'متوسط', desc: 'مسلط به حرکات با تجربه تمرین پیوسته', icon: Activity },
                    { id: 'advanced', title: 'پیشرفته', desc: 'ورزشکار حرفه‌ای آماده حجم و شدت بیشینه', icon: Crown },
                  ].map((item) => {
                    const selected = answers.fitnessLevel === item.id;
                    const IconComp = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          handleSingleSelect(() => {
                            setAnswers((p) => ({ ...p, fitnessLevel: item.id as any }));
                          })
                        }
                        className={`w-full p-5 rounded-3xl text-right transition-all cursor-pointer flex items-center justify-between gap-3 border ${
                          selected
                            ? 'bg-gradient-to-r from-purple-700/80 to-violet-600/90 border-purple-400/80 shadow-[0_0_25px_rgba(168,85,247,0.35),inset_0_1px_2px_rgba(255,255,255,0.25)] text-white scale-[1.01]'
                            : 'bg-white/[0.04] hover:bg-white/[0.07] border-white/[0.08] text-zinc-300 hover:text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                              selected
                                ? 'bg-white/20 text-white'
                                : 'bg-white/[0.05] text-purple-400'
                            }`}
                          >
                            <IconComp className="w-6 h-6 stroke-[2.2]" />
                          </div>
                          <div>
                            <span className="text-base font-black block">{item.title}</span>
                            <span className="text-[11px] text-zinc-400 block mt-0.5">{item.desc}</span>
                          </div>
                        </div>

                        <div
                          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                            selected
                              ? 'bg-white text-purple-900 border-white shadow-sm'
                              : 'border-white/20'
                          }`}
                        >
                          {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* SCREEN 4: DAYS PER WEEK */}
            {/* ============================================================ */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="space-y-5 my-auto py-2"
              >
                <div className="space-y-1.5 text-center">
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    چند روز در هفته
                    <br />
                    <span className="text-purple-400">تمرین می‌کنی؟</span>
                  </h2>
                  <p className="text-xs text-zinc-400">
                    میزان وقتی که می‌تونی برای تمرین بذاری
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[2, 3, 4].map((days) => {
                    const selected = answers.daysPerWeek === days;
                    return (
                      <button
                        key={days}
                        type="button"
                        onClick={() =>
                          handleSingleSelect(() => {
                            setAnswers((p) => ({ ...p, daysPerWeek: days }));
                          })
                        }
                        className={`p-4 py-5 rounded-3xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                          selected
                            ? 'bg-gradient-to-b from-purple-600 to-violet-700 border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.4)] text-white scale-105'
                            : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-zinc-300'
                        }`}
                      >
                        <DotMatrixNumber value={days} size="xl" glow="none" color={selected ? 'white' : 'muted'} />
                        <span className="text-[11px] font-bold text-zinc-400">روز در هفته</span>
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[5, 6].map((days) => {
                    const selected = answers.daysPerWeek === days;
                    return (
                      <button
                        key={days}
                        type="button"
                        onClick={() =>
                          handleSingleSelect(() => {
                            setAnswers((p) => ({ ...p, daysPerWeek: days }));
                          })
                        }
                        className={`p-4 py-5 rounded-3xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                          selected
                            ? 'bg-gradient-to-b from-purple-600 to-violet-700 border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.4)] text-white scale-105'
                            : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-zinc-300'
                        }`}
                      >
                        <DotMatrixNumber value={days} size="xl" glow="none" color={selected ? 'white' : 'muted'} />
                        <span className="text-[11px] font-bold text-zinc-400">روز در هفته</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* SCREEN 5: WORKOUT LOCATION */}
            {/* ============================================================ */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="space-y-5 my-auto py-2"
              >
                <div className="space-y-1.5 text-center">
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    معمولاً کجا
                    <br />
                    <span className="text-purple-400">تمرین می‌کنی؟</span>
                  </h2>
                  <p className="text-xs text-zinc-400">
                    محل تمرینت رو انتخاب کن
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { id: 'gym', title: 'باشگاه', desc: 'دسترسی کامل به هالتر، دمبل و دستگاه‌ها', icon: Building2 },
                    { id: 'home_equipment', title: 'خانه', desc: 'تمرین در منزل با دمبل یا وزن بدن', icon: Home },
                    { id: 'outdoor', title: 'هر دو / فضای باز', desc: 'ترکیب باشگاه، خانه و پارک ورزشی', icon: Layers },
                  ].map((item) => {
                    const selected = answers.workoutLocation === item.id;
                    const IconComp = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          handleSingleSelect(() => {
                            setAnswers((p) => ({ ...p, workoutLocation: item.id as any }));
                          })
                        }
                        className={`w-full p-5 rounded-3xl text-right transition-all cursor-pointer flex items-center justify-between gap-3 border ${
                          selected
                            ? 'bg-gradient-to-r from-purple-700/80 to-violet-600/90 border-purple-400/80 shadow-[0_0_25px_rgba(168,85,247,0.35),inset_0_1px_2px_rgba(255,255,255,0.25)] text-white scale-[1.01]'
                            : 'bg-white/[0.04] hover:bg-white/[0.07] border-white/[0.08] text-zinc-300 hover:text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                              selected
                                ? 'bg-white/20 text-white'
                                : 'bg-white/[0.05] text-purple-400'
                            }`}
                          >
                            <IconComp className="w-6 h-6 stroke-[2.2]" />
                          </div>
                          <div>
                            <span className="text-base font-black block">{item.title}</span>
                            <span className="text-[11px] text-zinc-400 block mt-0.5">{item.desc}</span>
                          </div>
                        </div>

                        <div
                          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                            selected
                              ? 'bg-white text-purple-900 border-white shadow-sm'
                              : 'border-white/20'
                          }`}
                        >
                          {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* SCREEN 6: EQUIPMENT (3x3 Grid Multi-Select) */}
            {/* ============================================================ */}
            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="space-y-4 my-auto py-1"
              >
                <div className="space-y-1 text-center">
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    چه تجهیزاتی
                    <br />
                    <span className="text-purple-400">در اختیار داری؟</span>
                  </h2>
                  <p className="text-[11px] text-zinc-400">
                    هر کدوم که داری انتخاب کن
                  </p>
                </div>

                {/* 3x3 Liquid Glass Grid */}
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  {[
                    { name: 'دمبل', icon: Dumbbell },
                    { name: 'هالتر', icon: Boxes },
                    { name: 'کش', icon: Sparkles },
                    { name: 'کتل‌بل', icon: Shield },
                    { name: 'نیمکت', icon: Layers },
                    { name: 'بارفیکس', icon: Activity },
                    { name: 'کابل', icon: Zap },
                    { name: 'دستگاه', icon: Building2 },
                    { name: 'بدون تجهیزات', icon: User },
                  ].map((eq) => {
                    const selected = answers.availableEquipment.includes(eq.name);
                    const IconComp = eq.icon;
                    return (
                      <button
                        key={eq.name}
                        type="button"
                        onClick={() => toggleEquipment(eq.name)}
                        className={`p-3 py-3.5 rounded-2xl text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-2 border relative ${
                          selected
                            ? 'bg-purple-600/30 border-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] scale-[1.02]'
                            : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-zinc-300'
                        }`}
                      >
                        {/* Mini checkmark indicator */}
                        {selected && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-sm">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}

                        <div className="w-8 h-8 rounded-xl bg-white/[0.05] flex items-center justify-center text-purple-400">
                          <IconComp className="w-4 h-4 stroke-[2.2]" />
                        </div>
                        <span className="text-xs font-bold">{eq.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Fixed CTA for Multi-select */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-black text-sm shadow-[0_0_25px_rgba(168,85,247,0.35)] hover:shadow-[0_0_35px_rgba(168,85,247,0.5)] active:scale-[0.98] transition-all cursor-pointer border border-purple-400/40"
                  >
                    ادامه
                  </button>
                </div>
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* SCREEN 7: WORKOUT DURATION */}
            {/* ============================================================ */}
            {step === 7 && (
              <motion.div
                key="step7"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="space-y-5 my-auto py-2"
              >
                <div className="space-y-1.5 text-center">
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    برای هر جلسه
                    <br />
                    <span className="text-purple-400">چقدر وقت داری؟</span>
                  </h2>
                  <p className="text-xs text-zinc-400">
                    مدت زمان مناسب برای هر جلسه تمرین
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  {[
                    { id: '30_45', title: 'کمتر از ۳۰ دقیقه' },
                    { id: '30_45', title: '۳۰ - ۴۵ دقیقه' },
                    { id: '45_60', title: '۴۵ - ۶۰ دقیقه' },
                    { id: '60_90', title: 'بیشتر از ۶۰ دقیقه' },
                  ].map((dur, idx) => {
                    const selected =
                      answers.workoutDuration === dur.id &&
                      ((dur.title.includes('کمتر') && idx === 0) ||
                        (dur.title.includes('۳۰ - ۴۵') && idx === 1) ||
                        (dur.title.includes('۴۵ - ۶۰') && idx === 2) ||
                        (dur.title.includes('بیشتر') && idx === 3));

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          handleSingleSelect(() => {
                            setAnswers((p) => ({ ...p, workoutDuration: dur.id as any }));
                          })
                        }
                        className={`w-full p-4 rounded-3xl text-right transition-all cursor-pointer flex items-center justify-between gap-3 border ${
                          selected
                            ? 'bg-gradient-to-r from-purple-700/80 to-violet-600/90 border-purple-400/80 shadow-[0_0_25px_rgba(168,85,247,0.35),inset_0_1px_2px_rgba(255,255,255,0.25)] text-white scale-[1.01]'
                            : 'bg-white/[0.04] hover:bg-white/[0.07] border-white/[0.08] text-zinc-300 hover:text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                              selected
                                ? 'bg-white/20 text-white'
                                : 'bg-white/[0.05] text-purple-400'
                            }`}
                          >
                            <Clock className="w-5 h-5 stroke-[2.2]" />
                          </div>
                          <span className="text-sm font-black font-mono">{dur.title}</span>
                        </div>

                        <div
                          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                            selected
                              ? 'bg-white text-purple-900 border-white shadow-sm'
                              : 'border-white/20'
                          }`}
                        >
                          {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* SCREEN 8: BASIC INFORMATION */}
            {/* ============================================================ */}
            {step === 8 && (
              <motion.div
                key="step8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="space-y-4 my-auto py-1"
              >
                <div className="space-y-1 text-center">
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    <span className="text-purple-400">اطلاعات پایه</span>
                  </h2>
                  <p className="text-[11px] text-zinc-400">
                    برای محاسبه دقیق‌تر شاخص‌ها و شخصی‌سازی برنامه
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  {/* Gender Selector */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAnswers((p) => ({ ...p, gender: 'male' }))}
                      className={`p-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        answers.gender === 'male'
                          ? 'bg-purple-600/30 border-purple-400 text-white shadow-sm'
                          : 'bg-white/[0.04] border-white/[0.08] text-zinc-400'
                      }`}
                    >
                      <span>👨 آقا</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnswers((p) => ({ ...p, gender: 'female' }))}
                      className={`p-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        answers.gender === 'female'
                          ? 'bg-purple-600/30 border-purple-400 text-white shadow-sm'
                          : 'bg-white/[0.04] border-white/[0.08] text-zinc-400'
                      }`}
                    >
                      <span>👩 خانم</span>
                    </button>
                  </div>

                  {/* Age Input */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-300">سن</span>
                    <input
                      type="number"
                      value={answers.age}
                      onChange={(e) => setAnswers((p) => ({ ...p, age: Number(e.target.value) }))}
                      className="w-20 bg-transparent text-left font-mono text-sm font-bold text-purple-300 focus:outline-none"
                    />
                  </div>

                  {/* Height Input */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-300">قد (سانتی‌متر)</span>
                    <input
                      type="number"
                      value={answers.heightCm}
                      onChange={(e) => setAnswers((p) => ({ ...p, heightCm: Number(e.target.value) }))}
                      className="w-20 bg-transparent text-left font-mono text-sm font-bold text-purple-300 focus:outline-none"
                    />
                  </div>

                  {/* Weight Input */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-300">وزن (کیلوگرم)</span>
                    <input
                      type="number"
                      step="0.5"
                      value={answers.weightKg}
                      onChange={(e) => setAnswers((p) => ({ ...p, weightKg: Number(e.target.value) }))}
                      className="w-20 bg-transparent text-left font-mono text-sm font-bold text-purple-300 focus:outline-none"
                    />
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-black text-sm shadow-[0_0_25px_rgba(168,85,247,0.35)] hover:shadow-[0_0_35px_rgba(168,85,247,0.5)] active:scale-[0.98] transition-all cursor-pointer border border-purple-400/40"
                  >
                    ادامه
                  </button>
                </div>
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* SCREEN 9: TARGET MUSCLES & PREFERENCES */}
            {/* ============================================================ */}
            {step === 9 && (
              <motion.div
                key="step9"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="space-y-4 my-auto py-1"
              >
                <div className="space-y-1 text-center">
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    عضلات هدف و
                    <br />
                    <span className="text-purple-400">ترجیحات تمرینی</span>
                  </h2>
                  <p className="text-[11px] text-zinc-400">
                    بخش‌هایی که دوست داری بیشترین تمرکز روشون باشه
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {[
                    { id: 'سینه', icon: '🫁' },
                    { id: 'پشت و زیربغل', icon: '🦅' },
                    { id: 'سرشانه', icon: '🛡️' },
                    { id: 'بازوها (جلوبازو و پشت‌بازو)', icon: '💪' },
                    { id: 'پاها و باسن', icon: '🦵' },
                    { id: 'شکم و هسته بدن', icon: '🎯' },
                  ].map((m) => {
                    const selected = answers.priorityMuscles.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => togglePriorityMuscle(m.id)}
                        className={`p-3 rounded-2xl text-right transition-all cursor-pointer flex items-center justify-between border ${
                          selected
                            ? 'bg-purple-600/30 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                            : 'bg-white/[0.04] border-white/[0.08] text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{m.icon}</span>
                          <span className="text-xs font-bold">{m.id}</span>
                        </div>
                        {selected && <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* CTA */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-black text-sm shadow-[0_0_25px_rgba(168,85,247,0.35)] hover:shadow-[0_0_35px_rgba(168,85,247,0.5)] active:scale-[0.98] transition-all cursor-pointer border border-purple-400/40"
                  >
                    ادامه
                  </button>
                </div>
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* SCREEN 10: PROFILE SUMMARY & RECOMMENDED PROGRAM */}
            {/* ============================================================ */}
            {step === 10 && (
              <motion.div
                key="step10"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-4 my-auto py-1"
              >
                <div className="space-y-1 text-center">
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center justify-center gap-1.5">
                    <span>پروفایل تمرینی تو آماده‌ست</span>
                    <span className="text-purple-400">🎯</span>
                  </h2>
                  <p className="text-[11px] text-zinc-400">
                    اطلاعاتت رو بررسی کن و تایید کن
                  </p>
                </div>

                {/* Liquid Glass Profile Summary Card */}
                <div className="p-4 rounded-3xl bg-white/[0.04] border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] space-y-2.5">
                  <div className="flex items-center justify-between text-xs py-1 border-b border-white/[0.05]">
                    <span className="text-zinc-400">هدف</span>
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span>{getGoalLabel(answers.primaryGoal)}</span>
                      <Dumbbell className="w-3.5 h-3.5 text-purple-400" />
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-1 border-b border-white/[0.05]">
                    <span className="text-zinc-400">سطح</span>
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span>{getLevelLabel(answers.fitnessLevel)}</span>
                      <Activity className="w-3.5 h-3.5 text-purple-400" />
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-1 border-b border-white/[0.05]">
                    <span className="text-zinc-400">تمرین در هفته</span>
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <DotMatrixNumber value={answers.daysPerWeek} unit="روز در هفته" size="2xs" glow="none" color="white" />
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-1 border-b border-white/[0.05]">
                    <span className="text-zinc-400">محل تمرین</span>
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span>{getLocationLabel(answers.workoutLocation)}</span>
                      <Building2 className="w-3.5 h-3.5 text-purple-400" />
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-1 border-b border-white/[0.05]">
                    <span className="text-zinc-400">مدت هر جلسه</span>
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <DotMatrixNumber value={getDurationLabel(answers.workoutDuration)} size="2xs" glow="none" color="white" />
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-zinc-400">تجهیزات</span>
                    <span className="font-bold text-purple-300 text-[11px] truncate max-w-[200px] text-left">
                      {answers.availableEquipment.join('، ') || 'بدون تجهیزات'}
                    </span>
                  </div>
                </div>

                {/* Recommended Program Card Highlight */}
                {matchResults.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/40 via-violet-900/30 to-purple-950/40 border border-purple-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-white">
                            {matchResults[0].program.name || matchResults[0].program.title}
                          </span>
                          <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-1.5 py-0.2 rounded-md">
                            <DotMatrixNumber value={matchResults[0].matchPercentage} unit="٪ تطابق" size="2xs" glow="none" color="purple" />
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                          <DotMatrixNumber value={matchResults[0].program.daysPerWeek || 4} unit="روز در هفته" size="2xs" glow="none" color="muted" />
                          <span>•</span>
                          <span>{matchResults[0].program.difficulty}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Primary & Secondary Action CTAs */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={handleFinalize}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 text-white font-black text-sm shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.55)] active:scale-[0.98] transition-all cursor-pointer border border-purple-400/40 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <span>در حال ذخیره و ساخت برنامه...</span>
                    ) : (
                      <>
                        <span>مشاهده برنامه پیشنهادی</span>
                        <ChevronLeft className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAllPrograms(!showAllPrograms)}
                    className="w-full py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white font-bold text-xs transition-all cursor-pointer border border-white/[0.06]"
                  >
                    مشاهده همه برنامه‌ها
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Bar Footer (Step Counter or safe area spacer) */}
        {step > 0 && (
          <div className="w-full px-5 pb-4 pt-1 z-20 shrink-0 flex items-center justify-center gap-1.5 text-[11px] font-bold text-zinc-500">
            <DotMatrixNumber value={step} size="2xs" glow="none" color="muted" />
            <span>از</span>
            <DotMatrixNumber value={totalSteps} size="2xs" glow="none" color="muted" />
          </div>
        )}
      </div>
    </div>
  );
};
