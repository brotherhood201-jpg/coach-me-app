import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Camera,
  Trash2,
  Shield,
  Upload,
  AlertTriangle,
  Info,
  Heart,
  Dumbbell,
  Target,
  Activity,
  Apple,
  FileText,
  Lock,
  Plus,
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import {
  DetailedClientProfile,
  UserProfile,
  BodyMeasurements,
  ProgressPhotoItem,
  HealthInfo,
  LifestyleInfo,
  NutritionProfile,
  GoalDetails,
  TrainingPreferencesDetails,
} from '../../types';
import { StorageService } from '../../services/StorageService';
import { ProgramRequestService } from '../../services/ProgramRequestService';
import { toPersianDigits, playWorkoutSound } from '../../utils/persian';

interface DetailedProfileWizardProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: UserProfile;
  userId?: string;
  initialUserData?: {
    name?: string;
    email?: string;
    weightKg?: number;
    weight?: number;
    heightCm?: number;
    height?: number;
    age?: number;
    gender?: string;
    fitnessLevel?: string;
    goal?: string;
  };
  initialProfile?: DetailedClientProfile | null;
  onSubmitted?: (profile: DetailedClientProfile) => void;
  onProfileSubmitted?: (profile: DetailedClientProfile) => void;
}

const COMMON_ALLERGIES = [
  'شیر و لبنیات (لاکتوز)',
  'تخم‌مرغ',
  'بادام‌زمینی',
  'مغزها و آجیل‌ها',
  'گلوتن (گندم)',
  'سویا',
  'غذاهای دریایی و میگو',
  'کنجد',
];

const FOOD_SUGGESTIONS = [
  'سینه مرغ',
  'فیله گوساله',
  'تخم‌مرغ',
  'برنج قهوه‌ای یا سفید',
  'ماهی قزل‌آلا یا سالمون',
  'عدسی و حبوبات',
  'جو دوسر',
  'کره بادام‌زمینی',
  'سیب‌زمینی شیرین یا تنوری',
  'ماست یونانی',
  'سالاد و سبزیجات تازه',
  'ماکارونی سبوس‌دار',
  'کلم بروکلی',
];

const TRAINING_STYLES = [
  { id: 'free_weights', label: 'وزنه آزاد (دمبل و هالتر)' },
  { id: 'machines', label: 'دستگاه‌های بدنسازی' },
  { id: 'hybrid', label: 'تمرین ترکیبی (دستگاه + وزنه)' },
  { id: 'bodyweight', label: 'وزن بدن (کالیستنیکس)' },
  { id: 'cardio', label: 'هوازی و اینتروال (HIIT)' },
  { id: 'functional', label: 'تمرینات عملکردی (فانکشنال)' },
];

export const DetailedProfileWizard: React.FC<DetailedProfileWizardProps> = ({
  isOpen,
  onClose,
  userProfile,
  userId,
  initialUserData,
  initialProfile,
  onSubmitted,
  onProfileSubmitted,
}) => {
  const safeProfile: UserProfile = {
    userId: userId || userProfile?.userId || 'guest',
    name: userProfile?.name || initialUserData?.name || 'علیرضا',
    email: userProfile?.email || initialUserData?.email || '',
    age: userProfile?.age ?? initialUserData?.age ?? 24,
    height: userProfile?.height ?? userProfile?.heightCm ?? initialUserData?.heightCm ?? initialUserData?.height ?? 180,
    weight: userProfile?.weight ?? userProfile?.weightKg ?? initialUserData?.weightKg ?? initialUserData?.weight ?? 79.5,
    gender: (userProfile?.gender || initialUserData?.gender || 'male') as any,
    fitnessLevel: (userProfile?.fitnessLevel || initialUserData?.fitnessLevel || 'intermediate') as any,
    goal: (userProfile?.goal || userProfile?.primaryGoal || initialUserData?.goal || 'muscle_gain') as any,
    trainingDaysPerWeek: userProfile?.trainingDaysPerWeek ?? 5,
    streakDays: userProfile?.streakDays ?? 12,
    totalWorkoutsDone: userProfile?.totalWorkoutsDone ?? 84,
    isProfileComplete: userProfile?.isProfileComplete ?? false,
    ...(userProfile || {}),
  };

  // Wizard steps:
  // 0: Intro
  // 1: Measurements
  // 2: Photos (Optional)
  // 3: Health & Special Conditions
  // 4: Lifestyle & Activity
  // 5: Nutrition & Allergies
  // 6: Goal & Training Preferences
  // 7: Coach Notes & Review
  const [currentStep, setCurrentStep] = useState<number>(0);
  const totalSteps = 8;

  // Form states
  const [measurements, setMeasurements] = useState<BodyMeasurements>({
    weightKg: initialProfile?.bodyMeasurements?.weightKg || safeProfile.weight || 75,
    heightCm: initialProfile?.bodyMeasurements?.heightCm || safeProfile.height || 178,
    waistCm: initialProfile?.bodyMeasurements?.waistCm,
    chestCm: initialProfile?.bodyMeasurements?.chestCm,
    armCm: initialProfile?.bodyMeasurements?.armCm,
    thighCm: initialProfile?.bodyMeasurements?.thighCm,
    hipCm: initialProfile?.bodyMeasurements?.hipCm,
  });

  const [photos, setPhotos] = useState<ProgressPhotoItem[]>([]);
  const [uploadingType, setUploadingType] = useState<string | null>(null);

  const [healthInfo, setHealthInfo] = useState<HealthInfo>({
    hasInjuryOrLimitation: false,
    injuryCategories: [],
    injuryDescription: '',
    hasMedicalConditionOrMedication: false,
    medicalConditionDescription: '',
    specialCondition: 'none',
    specialConditionNotes: '',
  });

  const [lifestyle, setLifestyle] = useState<LifestyleInfo>({
    dailyActivityLevel: 'moderate',
    jobType: 'desk',
    dailyMovement: 'medium',
    sleepSchedule: '۲۳:۳۰ تا ۰۷:۰۰',
  });

  const [nutrition, setNutrition] = useState<NutritionProfile>({
    favoriteFoods: ['سینه مرغ', 'برنج', 'تخم‌مرغ'],
    dislikedFoods: [],
    allergies: [],
    dietPreference: 'omnivore',
    mealFrequency: '3',
    customNotes: '',
  });

  const [customAllergyInput, setCustomAllergyInput] = useState<string>('');
  const [customLikeInput, setCustomLikeInput] = useState<string>('');
  const [customDislikeInput, setCustomDislikeInput] = useState<string>('');

  const [goalDetails, setGoalDetails] = useState<GoalDetails>({
    primaryGoal: safeProfile.goal || 'muscle_gain',
    specificFocus: 'عضله‌سازی با حداقل افزایش چربی',
  });

  const [trainingPrefs, setTrainingPrefs] = useState<TrainingPreferencesDetails>({
    preferredStyles: ['وزنه آزاد (دمبل و هالتر)', 'دستگاه‌های بدنسازی'],
    dislikedExercises: '',
    restrictedExercises: '',
  });

  const [coachNotes, setCoachNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Initialize from existing profile if available
  useEffect(() => {
    if (initialProfile) {
      if (initialProfile.bodyMeasurements) setMeasurements(initialProfile.bodyMeasurements);
      if (initialProfile.progressPhotos) setPhotos(initialProfile.progressPhotos);
      if (initialProfile.healthInfo) setHealthInfo(initialProfile.healthInfo);
      if (initialProfile.lifestyle) setLifestyle(initialProfile.lifestyle);
      if (initialProfile.nutritionProfile) setNutrition(initialProfile.nutritionProfile);
      if (initialProfile.goalDetails) setGoalDetails(initialProfile.goalDetails);
      if (initialProfile.trainingPreferences) setTrainingPrefs(initialProfile.trainingPreferences);
      if (initialProfile.coachNotes) setCoachNotes(initialProfile.coachNotes);
    }
  }, [initialProfile]);

  if (!isOpen) return null;

  // Calculate completion percentage
  const calculateCompletion = () => {
    let score = 25; // Base info completed from onboarding
    if (measurements.weightKg && measurements.heightCm) score += 15;
    if (measurements.waistCm || measurements.armCm) score += 10;
    if (photos.length > 0) score += 10;
    if (healthInfo.specialCondition) score += 10;
    if (lifestyle.dailyActivityLevel) score += 10;
    if (nutrition.dietPreference && nutrition.mealFrequency) score += 10;
    if (trainingPrefs.preferredStyles.length > 0) score += 10;
    return Math.min(100, score);
  };

  const completionPercentage = calculateCompletion();

  // Handle Photo Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'side' | 'back') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingType(type);
    try {
      const activeId = safeProfile.userId || 'guest';
      const uploaded = await StorageService.uploadProgressPhoto(activeId, file, type);
      setPhotos((prev) => [...prev.filter((p) => p.type !== type), uploaded]);
      playWorkoutSound('tick');
    } catch (error) {
      console.warn('Photo upload failed:', error);
      alert('بارگذاری عکس با خطا مواجه شد. لطفاً دوباره تلاش کنید.');
    } finally {
      setUploadingType(null);
    }
  };

  const handleRemovePhoto = (type: 'front' | 'side' | 'back') => {
    setPhotos((prev) => prev.filter((p) => p.type !== type));
    playWorkoutSound('tick');
  };

  // Validation before step changes
  const validateCurrentStep = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (currentStep === 1) {
      // Measurements validation
      if (measurements.weightKg && (measurements.weightKg < 30 || measurements.weightKg > 250)) {
        errors.weight = 'این عدد برای وزن به نظر منطقی نمیاد. لطفاً دوباره بررسیش کن.';
      }
      if (measurements.heightCm && (measurements.heightCm < 100 || measurements.heightCm > 240)) {
        errors.height = 'این عدد برای قد به نظر درست نمیاد. لطفاً دوباره بررسیش کن.';
      }
      if (measurements.waistCm && (measurements.waistCm < 40 || measurements.waistCm > 180)) {
        errors.waist = 'اندازه دور کمر باید بین ۴۰ تا ۱۸۰ سانتی‌متر باشد.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      playWorkoutSound('tick');
      setCurrentStep((prev) => Math.min(totalSteps - 1, prev + 1));
    }
  };

  const handlePrev = () => {
    playWorkoutSound('tick');
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  // Final Submit
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const fullProfile: DetailedClientProfile = {
        bodyMeasurements: measurements,
        progressPhotos: photos,
        healthInfo,
        lifestyle,
        nutritionProfile: nutrition,
        goalDetails,
        trainingPreferences: trainingPrefs,
        coachNotes,
        completionPercentage,
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const activeId = safeProfile.userId || 'guest';
      await ProgramRequestService.submitProgramRequest(activeId, fullProfile, safeProfile);

      playWorkoutSound('success');
      if (onProfileSubmitted) {
        onProfileSubmitted(fullProfile);
      }
      if (onSubmitted) {
        onSubmitted(fullProfile);
      }
      onClose();
    } catch (error) {
      console.error('Failed to submit program request:', error);
      alert('خطا در ارسال پرونده. لطفاً اتصال اینترنت خود را بررسی نمایید.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl overflow-y-auto"
      dir="rtl"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-zinc-900/95 border border-purple-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-purple-950/50 my-auto relative text-right flex flex-col max-h-[92vh]"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">پرونده تکمیلی شاگرد</h2>
              <p className="text-[11px] text-zinc-400">شخصی‌سازی دقیق برنامه توسط مربی اختصاصی</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicator (when not on intro) */}
        {currentStep > 0 && (
          <div className="space-y-1.5 mb-5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-purple-300">
                مرحله {toPersianDigits(currentStep)} از {toPersianDigits(totalSteps - 1)}
              </span>
              <span className="font-mono text-zinc-400 text-[11px]">
                تکمیل اطلاعات: {toPersianDigits(completionPercentage)}٪
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Scrollable Step Content */}
        <div className="flex-1 overflow-y-auto pr-1 pl-1 space-y-5 custom-scrollbar">
          {/* STEP 0: Introduction Screen */}
          {currentStep === 0 && (
            <div className="space-y-5 py-4 text-center">
              <div className="w-20 h-20 rounded-3xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mx-auto shadow-lg shadow-purple-900/30">
                <Sparkles className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  بریم پرونده‌ات رو کامل کنیم 🎯
                </h3>
                <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
                  چند اطلاعات بیشتر لازم داریم تا مربی بتونه برنامه مناسب‌تری برات آماده کنه.
                </p>
              </div>

              <GlassCard className="p-4 border-purple-500/20 bg-purple-950/20 text-right space-y-2.5 max-w-lg mx-auto">
                <div className="flex items-center gap-2 text-purple-300 text-xs font-bold">
                  <Lock className="w-4 h-4" />
                  <span>تضمین محرمانگی و حریم خصوصی</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  اطلاعاتت فقط برای شخصی‌سازی برنامه استفاده میشه و هیچ شخص ثالثی به اندازه‌ها یا عکس‌های بدنی‌ات دسترسی ندارد.
                </p>
              </GlassCard>

              <div className="pt-3">
                <button
                  onClick={handleNext}
                  className="w-full sm:w-72 mx-auto py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-sm shadow-xl shadow-purple-600/30 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>شروع کنیم</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: Body Measurements */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  <span>اندازه‌گیری‌های بدنی</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  اگر اندازه‌گیری دقیق نداری، می‌تونی فعلاً ردش کنی و بعداً ویرایشش کنی.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs text-zinc-300 font-bold block mb-1.5">وزن فعلی (کیلوگرم)</label>
                  <input
                    type="number"
                    value={measurements.weightKg || ''}
                    onChange={(e) => setMeasurements({ ...measurements, weightKg: Number(e.target.value) })}
                    placeholder="مثلاً: 78"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                  {formErrors.weight && <span className="text-[11px] text-rose-400 mt-1 block">{formErrors.weight}</span>}
                </div>

                <div>
                  <label className="text-xs text-zinc-300 font-bold block mb-1.5">قد (سانتی‌متر)</label>
                  <input
                    type="number"
                    value={measurements.heightCm || ''}
                    onChange={(e) => setMeasurements({ ...measurements, heightCm: Number(e.target.value) })}
                    placeholder="مثلاً: 180"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                  {formErrors.height && <span className="text-[11px] text-rose-400 mt-1 block">{formErrors.height}</span>}
                </div>

                <div>
                  <label className="text-xs text-zinc-300 font-bold block mb-1.5">دور کمر (سانتی‌متر - اختیاری)</label>
                  <input
                    type="number"
                    value={measurements.waistCm || ''}
                    onChange={(e) => setMeasurements({ ...measurements, waistCm: Number(e.target.value) })}
                    placeholder="مثلاً: 84"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                  {formErrors.waist && <span className="text-[11px] text-rose-400 mt-1 block">{formErrors.waist}</span>}
                </div>

                <div>
                  <label className="text-xs text-zinc-300 font-bold block mb-1.5">دور سینه (سانتی‌متر - اختیاری)</label>
                  <input
                    type="number"
                    value={measurements.chestCm || ''}
                    onChange={(e) => setMeasurements({ ...measurements, chestCm: Number(e.target.value) })}
                    placeholder="مثلاً: 102"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-300 font-bold block mb-1.5">دور بازو (سانتی‌متر - اختیاری)</label>
                  <input
                    type="number"
                    value={measurements.armCm || ''}
                    onChange={(e) => setMeasurements({ ...measurements, armCm: Number(e.target.value) })}
                    placeholder="مثلاً: 36"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-300 font-bold block mb-1.5">دور ران (سانتی‌متر - اختیاری)</label>
                  <input
                    type="number"
                    value={measurements.thighCm || ''}
                    onChange={(e) => setMeasurements({ ...measurements, thighCm: Number(e.target.value) })}
                    placeholder="مثلاً: 58"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-300 font-bold block mb-1.5">دور باسن (سانتی‌متر - اختیاری)</label>
                  <input
                    type="number"
                    value={measurements.hipCm || ''}
                    onChange={(e) => setMeasurements({ ...measurements, hipCm: Number(e.target.value) })}
                    placeholder="مثلاً: 96"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Progress Photos (Optional & Private) */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-purple-400" />
                  <span>عکس وضعیت بدنی (کاملاً اختیاری)</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  در صورت تمایل، می‌تونی برای بررسی بهتر وضعیت بدنی و تخمین درصد چربی عکس اضافه کنی.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex items-center gap-2.5 text-xs text-purple-300">
                <Shield className="w-4 h-4 shrink-0 text-purple-400" />
                <span>این عکس‌ها عمومی نیستند و با بالاترین سطح حفاظت امنیتی ذخیره می‌شوند.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {(['front', 'side', 'back'] as const).map((type) => {
                  const existingPhoto = photos.find((p) => p.type === type);
                  const labelFa = type === 'front' ? 'عکس روبه‌رو' : type === 'side' ? 'عکس نیمرخ' : 'عکس پشت';

                  return (
                    <div
                      key={type}
                      className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col items-center justify-center text-center space-y-2.5 relative min-h-[170px]"
                    >
                      <span className="text-xs font-bold text-zinc-300">{labelFa}</span>

                      {existingPhoto ? (
                        <div className="relative w-full h-32 rounded-xl overflow-hidden group">
                          <img
                            src={existingPhoto.downloadUrl}
                            alt={labelFa}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(type)}
                            className="absolute top-1.5 left-1.5 p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white backdrop-blur-sm transition-all"
                            title="حذف عکس"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="w-full h-32 rounded-xl border border-dashed border-white/20 hover:border-purple-500/50 bg-white/[0.01] hover:bg-purple-500/5 flex flex-col items-center justify-center cursor-pointer transition-all">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handlePhotoUpload(e, type)}
                            disabled={uploadingType === type}
                            className="hidden"
                          />
                          {uploadingType === type ? (
                            <div className="flex flex-col items-center gap-1.5">
                              <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                              <span className="text-[10px] text-zinc-400">در حال بارگذاری...</span>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-5 h-5 text-zinc-400 mb-1" />
                              <span className="text-[11px] text-purple-400 font-bold">انتخاب تصویر</span>
                              <span className="text-[9px] text-zinc-500">JPG یا PNG</span>
                            </>
                          )}
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Health & Special Conditions */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <span>اطلاعات سلامت و محدودیت‌ها</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  این اطلاعات برای جلوگیری از پیشنهادهای نامناسب و کمک به مربی در شخصی‌سازی برنامه استفاده میشه.
                </p>
              </div>

              {/* 1. Injuries */}
              <GlassCard className="p-4 space-y-3">
                <span className="text-xs font-bold text-white block">
                  آیا محدودیت یا آسیب‌دیدگی فعلی داری؟
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setHealthInfo({ ...healthInfo, hasInjuryOrLimitation: false })}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      !healthInfo.hasInjuryOrLimitation
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                    }`}
                  >
                    خیر
                  </button>
                  <button
                    type="button"
                    onClick={() => setHealthInfo({ ...healthInfo, hasInjuryOrLimitation: true })}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      healthInfo.hasInjuryOrLimitation
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                    }`}
                  >
                    بله
                  </button>
                </div>

                {healthInfo.hasInjuryOrLimitation && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3 pt-2">
                    <div>
                      <span className="text-[11px] text-zinc-300 font-bold block mb-1.5">محل آسیب‌دیدگی:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {['زانو', 'کمر', 'شانه', 'مچ دست یا پا', 'گردن', 'سایر'].map((item) => {
                          const isSel = healthInfo.injuryCategories?.includes(item);
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => {
                                const cats = healthInfo.injuryCategories || [];
                                setHealthInfo({
                                  ...healthInfo,
                                  injuryCategories: isSel ? cats.filter((c) => c !== item) : [...cats, item],
                                });
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                isSel
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                  : 'bg-white/5 text-zinc-400 border border-white/5'
                              }`}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-zinc-300 font-bold block mb-1">توضیح بده:</label>
                      <textarea
                        value={healthInfo.injuryDescription || ''}
                        onChange={(e) => setHealthInfo({ ...healthInfo, injuryDescription: e.target.value })}
                        placeholder="مثلاً: درد خفیف در زانوی راست هنگام اسکوات سنگین..."
                        rows={2}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </motion.div>
                )}
              </GlassCard>

              {/* 2. Medical Conditions & Medication */}
              <GlassCard className="p-4 space-y-3">
                <span className="text-xs font-bold text-white block">
                  آیا شرایط پزشکی یا داروی خاصی هست که فکر می‌کنی مربی باید بدونه؟
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setHealthInfo({ ...healthInfo, hasMedicalConditionOrMedication: false })}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      !healthInfo.hasMedicalConditionOrMedication
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                    }`}
                  >
                    خیر
                  </button>
                  <button
                    type="button"
                    onClick={() => setHealthInfo({ ...healthInfo, hasMedicalConditionOrMedication: true })}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      healthInfo.hasMedicalConditionOrMedication
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                    }`}
                  >
                    بله
                  </button>
                </div>

                {healthInfo.hasMedicalConditionOrMedication && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2 pt-2">
                    <textarea
                      value={healthInfo.medicalConditionDescription || ''}
                      onChange={(e) => setHealthInfo({ ...healthInfo, medicalConditionDescription: e.target.value })}
                      placeholder="توضیح شرایط پزشکی، بیماری‌های قلبی، فشار خون یا داروهای مصرفی..."
                      rows={2}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </motion.div>
                )}

                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 leading-relaxed">
                  ⚠️ در صورت وجود شرایط پزشکی، قبل از شروع یا تغییر برنامه ورزشی/غذایی با متخصص مربوطه مشورت کن.
                </div>
              </GlassCard>

              {/* 3. Pregnancy / Postpartum */}
              <GlassCard className="p-4 space-y-3">
                <span className="text-xs font-bold text-white block">شرایط خاص</span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'none', label: 'هیچ‌کدام' },
                    { id: 'pregnancy', label: 'بارداری' },
                    { id: 'postpartum', label: 'بعد از زایمان' },
                    { id: 'other', label: 'سایر' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setHealthInfo({ ...healthInfo, specialCondition: opt.id as any })}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                        healthInfo.specialCondition === opt.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {(healthInfo.specialCondition === 'pregnancy' || healthInfo.specialCondition === 'postpartum') && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-1.5 pt-2">
                    <label className="text-[11px] text-zinc-300 font-bold block">
                      اگر نکته‌ای هست که مربی باید بدونه، اینجا بنویس:
                    </label>
                    <textarea
                      value={healthInfo.specialConditionNotes || ''}
                      onChange={(e) => setHealthInfo({ ...healthInfo, specialConditionNotes: e.target.value })}
                      placeholder="مثلاً: ماه چهارم بارداری هستم و تمرین سبک نیاز دارم..."
                      rows={2}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </motion.div>
                )}
              </GlassCard>
            </div>
          )}

          {/* STEP 4: Lifestyle & Daily Activity */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  <span>سطح فعالیت و سبک زندگی</span>
                </h3>
                <p className="text-xs text-zinc-400">شناخت روزمرگی به تنظیم حجم و شدت برنامه کمک می‌کند.</p>
              </div>

              {/* Activity Level */}
              <GlassCard className="p-4 space-y-3">
                <span className="text-xs font-bold text-white block">
                  خارج از تمرین چقدر فعالیت داری؟
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'sedentary', label: 'کم‌تحرک' },
                    { id: 'moderate', label: 'فعالیت معمولی' },
                    { id: 'active', label: 'فعال' },
                    { id: 'very_active', label: 'خیلی فعال' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setLifestyle({ ...lifestyle, dailyActivityLevel: lvl.id as any })}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                        lifestyle.dailyActivityLevel === lvl.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </GlassCard>

              {/* Lifestyle / Job Type */}
              <GlassCard className="p-4 space-y-4">
                <span className="text-xs font-bold text-white block">روزت معمولاً چطور می‌گذره؟</span>

                <div>
                  <span className="text-[11px] text-zinc-300 font-bold block mb-2">نوع شغل:</span>
                  <div className="flex gap-2">
                    {[
                      { id: 'desk', label: 'پشت‌میزنشین' },
                      { id: 'active', label: 'فعال و پرتحرک' },
                      { id: 'hybrid', label: 'ترکیبی' },
                    ].map((j) => (
                      <button
                        key={j.id}
                        type="button"
                        onClick={() => setLifestyle({ ...lifestyle, jobType: j.id as any })}
                        className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                          lifestyle.jobType === j.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                        }`}
                      >
                        {j.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-zinc-300 font-bold block mb-2">میانگین تحرک روزانه:</span>
                  <div className="flex gap-2">
                    {[
                      { id: 'low', label: 'کم' },
                      { id: 'medium', label: 'متوسط' },
                      { id: 'high', label: 'زیاد' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setLifestyle({ ...lifestyle, dailyMovement: m.id as any })}
                        className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                          lifestyle.dailyMovement === m.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-zinc-300 font-bold block mb-1.5">
                    برنامه و ساعت خواب معمول (اختیاری):
                  </label>
                  <input
                    type="text"
                    value={lifestyle.sleepSchedule || ''}
                    onChange={(e) => setLifestyle({ ...lifestyle, sleepSchedule: e.target.value })}
                    placeholder="مثلاً: ۲۳:۳۰ تا ۰۷:۰۰ (حدود ۷.۵ ساعت)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </GlassCard>
            </div>
          )}

          {/* STEP 5: Nutrition & Allergies */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Apple className="w-5 h-5 text-purple-400" />
                  <span>پرونده تغذیه‌ای و آلرژی‌ها</span>
                </h3>
                <p className="text-xs text-zinc-400">تنظیم رژیم واقع‌بینانه و مطابق با علایق و سلامتی شما</p>
              </div>

              {/* Diet style & meal frequency */}
              <GlassCard className="p-4 space-y-4">
                <div>
                  <span className="text-xs font-bold text-white block mb-2">سبک غذایی:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'omnivore', label: 'همه‌چیزخوار' },
                      { id: 'vegetarian', label: 'گیاه‌خواری' },
                      { id: 'vegan', label: 'وگان' },
                      { id: 'other', label: 'سایر' },
                    ].map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setNutrition({ ...nutrition, dietPreference: d.id as any })}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                          nutrition.dietPreference === d.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-white block mb-2">تعداد وعده‌های ترجیحی در روز:</span>
                  <div className="flex gap-2">
                    {['2', '3', '4', '5'].map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setNutrition({ ...nutrition, mealFrequency: freq as any })}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                          nutrition.mealFrequency === freq
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                        }`}
                      >
                        {toPersianDigits(freq)} وعده
                      </button>
                    ))}
                  </div>
                </div>
              </GlassCard>

              {/* Food Allergies - Distinct styling */}
              <GlassCard className="p-4 space-y-3 border-rose-500/30 bg-rose-950/10">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-black">
                  <AlertTriangle className="w-4 h-4" />
                  <span>حساسیت‌های غذایی (آلرژن‌ها)</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  اگر به هر کدام از موارد زیر حساسیت داری انتخاب کن تا در رژیم لحاظ نشود:
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {COMMON_ALLERGIES.map((alg) => {
                    const isSelected = nutrition.allergies.includes(alg);
                    return (
                      <button
                        key={alg}
                        type="button"
                        onClick={() => {
                          setNutrition({
                            ...nutrition,
                            allergies: isSelected
                              ? nutrition.allergies.filter((a) => a !== alg)
                              : [...nutrition.allergies, alg],
                          });
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-950'
                            : 'bg-white/5 text-zinc-300 border border-white/10 hover:border-rose-500/30'
                        }`}
                      >
                        {alg}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={customAllergyInput}
                    onChange={(e) => setCustomAllergyInput(e.target.value)}
                    placeholder="افزودن حساسیت خاص دیگر..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:border-rose-500 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && customAllergyInput.trim()) {
                        e.preventDefault();
                        if (!nutrition.allergies.includes(customAllergyInput.trim())) {
                          setNutrition({ ...nutrition, allergies: [...nutrition.allergies, customAllergyInput.trim()] });
                        }
                        setCustomAllergyInput('');
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customAllergyInput.trim() && !nutrition.allergies.includes(customAllergyInput.trim())) {
                        setNutrition({ ...nutrition, allergies: [...nutrition.allergies, customAllergyInput.trim()] });
                        setCustomAllergyInput('');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-600/30 text-rose-300 text-xs font-bold hover:bg-rose-600/50"
                  >
                    افزودن
                  </button>
                </div>
              </GlassCard>

              {/* Likes & Dislikes */}
              <GlassCard className="p-4 space-y-4">
                <div>
                  <span className="text-xs font-bold text-emerald-400 block mb-1">چی دوست داری بخوری؟</span>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {nutrition.favoriteFoods.map((f) => (
                      <span
                        key={f}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold flex items-center gap-1.5"
                      >
                        <span>{f}</span>
                        <button
                          type="button"
                          onClick={() => setNutrition({ ...nutrition, favoriteFoods: nutrition.favoriteFoods.filter((i) => i !== f) })}
                          className="hover:text-white"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customLikeInput}
                      onChange={(e) => setCustomLikeInput(e.target.value)}
                      placeholder="نام غذا یا ماده غذایی..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customLikeInput.trim()) {
                          setNutrition({ ...nutrition, favoriteFoods: [...nutrition.favoriteFoods, customLikeInput.trim()] });
                          setCustomLikeInput('');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600/30 text-emerald-300 text-xs font-bold hover:bg-emerald-600/50"
                    >
                      افزودن
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <span className="text-xs font-bold text-zinc-300 block mb-1">چی اصلاً دوست نداری؟ 😄</span>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {nutrition.dislikedFoods.map((f) => (
                      <span
                        key={f}
                        className="px-2.5 py-1 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-[11px] font-bold flex items-center gap-1.5"
                      >
                        <span>{f}</span>
                        <button
                          type="button"
                          onClick={() => setNutrition({ ...nutrition, dislikedFoods: nutrition.dislikedFoods.filter((i) => i !== f) })}
                          className="hover:text-white"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customDislikeInput}
                      onChange={(e) => setCustomDislikeInput(e.target.value)}
                      placeholder="غذایی که مربی نباید بنویسه..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customDislikeInput.trim()) {
                          setNutrition({ ...nutrition, dislikedFoods: [...nutrition.dislikedFoods, customDislikeInput.trim()] });
                          setCustomDislikeInput('');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-red-600/30 text-red-300 text-xs font-bold hover:bg-red-600/50"
                    >
                      افزودن
                    </button>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {/* STEP 6: Goal Details & Training Preferences */}
          {currentStep === 6 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-purple-400" />
                  <span>تمرکز هدف و ترجیحات تمرینی</span>
                </h3>
                <p className="text-xs text-zinc-400">تعیین سبک دقیق تمرین متناسب با روحیه و شرایط شما</p>
              </div>

              {/* Goal Focus */}
              <GlassCard className="p-4 space-y-3">
                <span className="text-xs font-bold text-white block">تمرکز اصلیت چیه؟</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(safeProfile.goal === 'fat_loss'
                    ? [
                        'کاهش وزن کلی',
                        'کاهش درصد چربی و تفکیک',
                        'فرم‌دهی و لیفت عضلات',
                        'ترکیبی (کاهش سایز + عضله‌سازی)',
                      ]
                    : safeProfile.goal === 'strength'
                    ? ['قدرت عمومی بدنی', 'رکورد پرس سینه', 'اسکوات قدرتی', 'ددلیفت و توان کل بدن']
                    : [
                        'افزایش حجم عمومی',
                        'عضله‌سازی با حداقل افزایش چربی',
                        'افزایش همزمان قدرت + عضله',
                        'فرم‌دهی تخصصی عضلات هدف',
                      ]
                  ).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setGoalDetails({ ...goalDetails, specificFocus: f })}
                      className={`p-3 rounded-xl text-xs font-bold text-right transition-all ${
                        goalDetails.specificFocus === f
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-950'
                          : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </GlassCard>

              {/* Preferred Training Styles */}
              <GlassCard className="p-4 space-y-3">
                <span className="text-xs font-bold text-white block">
                  از تمرین چه سبکی بیشتر خوشت میاد؟ (چند انتخابی)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TRAINING_STYLES.map((style) => {
                    const isSelected = trainingPrefs.preferredStyles.includes(style.label);
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => {
                          setTrainingPrefs({
                            ...trainingPrefs,
                            preferredStyles: isSelected
                              ? trainingPrefs.preferredStyles.filter((s) => s !== style.label)
                              : [...trainingPrefs.preferredStyles, style.label],
                          });
                        }}
                        className={`p-3 rounded-xl text-xs font-bold text-right transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                        }`}
                      >
                        <span>{style.label}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </GlassCard>

              {/* Exercise Dislikes & Restrictions */}
              <GlassCard className="p-4 space-y-3">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                    حرکتی هست که دوست نداری انجام بدی؟ (اختیاری)
                  </label>
                  <input
                    type="text"
                    value={trainingPrefs.dislikedExercises || ''}
                    onChange={(e) => setTrainingPrefs({ ...trainingPrefs, dislikedExercises: e.target.value })}
                    placeholder="مثلاً: بارفیکس یا شنا سوئدی..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                    حرکتی هست که نمی‌تونی یا ترجیح میدی انجام ندی؟ (اختیاری)
                  </label>
                  <input
                    type="text"
                    value={trainingPrefs.restrictedExercises || ''}
                    onChange={(e) => setTrainingPrefs({ ...trainingPrefs, restrictedExercises: e.target.value })}
                    placeholder="مثلاً: ددلیفت به خاطر گودی کمر..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </GlassCard>
            </div>
          )}

          {/* STEP 7: Coach Notes & Final Review */}
          {currentStep === 7 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  <span>چیزی هست که دوست داری مربی بدونه؟</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  هر توضیحی مثل زمان‌بندی کاری، مسافرت پیش‌رو، روزهای خستگی یا هر ترجیح شخصی
                </p>
              </div>

              <textarea
                value={coachNotes}
                onChange={(e) => setCoachNotes(e.target.value)}
                placeholder="مثلاً: صبح‌ها اصلاً وقت تمرین ندارم و ترجیح میدم غروب‌ها تمرین کنم. روزهای پنجشنبه هم انرژی بیشتری دارم..."
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-xs text-white focus:border-purple-500 focus:outline-none leading-relaxed"
              />

              {/* Completion Overview */}
              <GlassCard className="p-4 space-y-3 bg-purple-950/20 border-purple-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-white">پرونده‌ات تقریباً آماده‌ست 🎯</span>
                  <span className="text-xs font-bold text-purple-300 font-mono">
                    {toPersianDigits(completionPercentage)}٪ تکمیل شده
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>اطلاعات پایه ✓</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>اندازه‌ها ✓</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تمرین ✓</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تغذیه ✓</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>شرایط خاص ✓</span>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-300 leading-relaxed pt-2 border-t border-white/10">
                  بعد از ارسال، اطلاعاتت توسط مربی بررسی میشه و برنامه مناسب برات آماده میشه.
                </p>
              </GlassCard>
            </div>
          )}
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="border-t border-white/10 pt-4 mt-4 flex items-center justify-between gap-3">
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-zinc-300 font-bold text-xs hover:bg-white/10 transition-colors flex items-center gap-1"
            >
              <ChevronRight className="w-4 h-4" />
              <span>مرحله قبل</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < totalSteps - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-600/30 hover:opacity-95 active:scale-[0.98] transition-all flex items-center gap-1.5"
            >
              <span>{currentStep === 0 ? 'شروع تکمیل پرونده' : 'ادامه'}</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-emerald-600 text-white font-black text-xs shadow-lg shadow-purple-600/30 hover:opacity-95 active:scale-[0.98] transition-all flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>در حال ارسال برای مربی...</span>
                </>
              ) : (
                <>
                  <span>ارسال برای بررسی مربی</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
