import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Shield,
  AlertTriangle,
  User,
  Activity,
  Apple,
  Dumbbell,
  CheckCircle2,
  Clock,
  MessageSquare,
  Send,
  Lock,
  Calendar,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import {
  ProgramRequest,
  WorkoutProgram,
  AssignedNutritionPlan,
  AdminUser,
} from '../../types';
import { ProgramRequestService } from '../../services/ProgramRequestService';
import { toPersianDigits, playWorkoutSound } from '../../utils/persian';

interface CoachReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ProgramRequest;
  availablePrograms: WorkoutProgram[];
  currentAdmin: AdminUser;
  onUpdated: () => void;
}

export const CoachReviewModal: React.FC<CoachReviewModalProps> = ({
  isOpen,
  onClose,
  request,
  availablePrograms,
  currentAdmin,
  onUpdated,
}) => {
  const profile = request?.detailedProfileSnapshot || {};
  const measurements = profile?.bodyMeasurements || {};
  const photos = profile?.progressPhotos || [];
  const health = profile?.healthInfo || { hasInjuryOrLimitation: false, hasMedicalConditionOrMedication: false, specialCondition: 'none' };
  const lifestyle = profile?.lifestyle || { dailyActivityLevel: 'moderate' };
  const nutrition = profile?.nutritionProfile || { favoriteFoods: [], dislikedFoods: [], allergies: [], dietPreference: 'omnivore', mealFrequency: '3' };
  const goal = profile?.goalDetails || { primaryGoal: 'muscle_gain' };
  const training = profile?.trainingPreferences || { preferredStyles: [] };

  // Review Form States
  const [selectedProgramId, setSelectedProgramId] = useState<string>(
    request?.assignedProgramId || (availablePrograms.length > 0 ? availablePrograms[0].id : '')
  );

  const [coachNotes, setCoachNotes] = useState<string>(request?.coachNotes || '');

  // Nutrition Plan
  const [assignNutrition, setAssignNutrition] = useState<boolean>(!!request?.assignedNutritionPlan);
  const [calorieTarget, setCalorieTarget] = useState<number>(
    request?.assignedNutritionPlan?.dailyCalorieTarget || 2400
  );
  const [proteinTarget, setProteinTarget] = useState<number>(
    request?.assignedNutritionPlan?.proteinTarget || 150
  );
  const [carbTarget, setCarbTarget] = useState<number>(
    request?.assignedNutritionPlan?.carbTarget || 260
  );
  const [fatTarget, setFatTarget] = useState<number>(
    request?.assignedNutritionPlan?.fatTarget || 70
  );
  const [nutritionNotes, setNutritionNotes] = useState<string>(
    request?.assignedNutritionPlan?.nutritionNotes || ''
  );

  // Ask for more info
  const [showQuestionInput, setShowQuestionInput] = useState<boolean>(false);
  const [coachQuestion, setCoachQuestion] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);

  // Active Tab in Reviewer
  const [activeTab, setActiveTab] = useState<'profile' | 'health' | 'nutrition' | 'assignment'>('profile');

  if (!isOpen || !request) return null;

  // Selected program object
  const selectedProgram = availablePrograms.find((p) => p.id === selectedProgramId);

  // Handle: Start Review
  const handleStartReview = async () => {
    setProcessing(true);
    try {
      await ProgramRequestService.startReview(request.requestId, currentAdmin.name);
      playWorkoutSound('tick');
      onUpdated();
    } catch (e) {
      console.warn('Start review error:', e);
    } finally {
      setProcessing(false);
    }
  };

  // Handle: Send Question
  const handleSendQuestion = async () => {
    if (!coachQuestion.trim()) return;
    setProcessing(true);
    try {
      await ProgramRequestService.requestMoreInfo(request.requestId, coachQuestion.trim(), currentAdmin.name);
      playWorkoutSound('success');
      setShowQuestionInput(false);
      onUpdated();
      onClose();
    } catch (e) {
      console.warn('Request more info error:', e);
      alert('خطا در ارسال پیام. لطفاً دوباره تلاش کنید.');
    } finally {
      setProcessing(false);
    }
  };

  // Handle: Assign and Publish Plan
  const handlePublishPlan = async () => {
    if (!selectedProgramId || !selectedProgram) {
      alert('لطفاً یک برنامه تمرینی برای شاگرد انتخاب کنید.');
      return;
    }

    setProcessing(true);
    try {
      const nutritionPlan: AssignedNutritionPlan | null = assignNutrition
        ? {
            dailyCalorieTarget: Number(calorieTarget),
            proteinTarget: Number(proteinTarget),
            carbTarget: Number(carbTarget),
            fatTarget: Number(fatTarget),
            nutritionNotes,
          }
        : null;

      await ProgramRequestService.assignProgramAndPublish(
        request.requestId,
        selectedProgramId,
        selectedProgram.titleFa || selectedProgram.title,
        nutritionPlan,
        coachNotes,
        currentAdmin.name
      );

      playWorkoutSound('success');
      alert(`برنامه "${selectedProgram.titleFa || selectedProgram.title}" با موفقیت برای کاربر منتشر و فعال شد.`);
      onUpdated();
      onClose();
    } catch (e) {
      console.error('Publish plan error:', e);
      alert('خطا در انتشار برنامه. لطفاً دوباره تلاش کنید.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl overflow-y-auto"
      dir="rtl"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-4xl bg-zinc-900 border border-purple-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-purple-950/50 my-auto text-right flex flex-col max-h-[92vh]"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">{request.userName}</h2>
                <span className="text-xs text-zinc-400 font-mono">({request.userEmail})</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                تاریخ ثبت درخواست: {new Date(request.submittedAt).toLocaleDateString('fa-IR')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Flags Banner */}
        <div className="space-y-2 mb-4">
          {request.specialReviewRequired && (
            <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center gap-2.5 text-xs text-amber-300 font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>⚠️ نیازمند بررسی ویژه: کاربر دارای شرایط خاص، بارداری/زایمان یا شرایط پزشکی/دارویی است.</span>
            </div>
          )}

          {request.allergyFlag && (
            <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300 font-bold">
              <Shield className="w-4 h-4 shrink-0 text-rose-400" />
              <span>
                حساسیت‌های غذایی ثبت شده:{' '}
                <span className="text-white">{nutrition.allergies.join('، ')}</span>
              </span>
            </div>
          )}

          {request.injuryFlag && (
            <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center gap-2 text-xs text-purple-300 font-bold">
              <Activity className="w-4 h-4 shrink-0 text-purple-400" />
              <span>
                محدودیت یا آسیب‌دیدگی:{' '}
                <span className="text-white">
                  {(health.injuryCategories || []).join('، ')} {health.injuryDescription ? `(${health.injuryDescription})` : ''}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Tabs Bar */}
        <div className="flex gap-2 border-b border-white/10 pb-3 mb-4 overflow-x-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-3.5 rounded-xl transition-all ${
              activeTab === 'profile'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10'
            }`}
          >
            اندازه‌ها و عکس‌های بدنی
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('health')}
            className={`py-2 px-3.5 rounded-xl transition-all ${
              activeTab === 'health'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10'
            }`}
          >
            سلامت، آسیب‌ها و سبک زندگی
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('nutrition')}
            className={`py-2 px-3.5 rounded-xl transition-all ${
              activeTab === 'nutrition'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10'
            }`}
          >
            تغذیه، آلرژی‌ها و اهداف
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('assignment')}
            className={`py-2 px-3.5 rounded-xl transition-all ${
              activeTab === 'assignment'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10'
            }`}
          >
            تخصیص و انتشار برنامه (کوچ)
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 pl-1 custom-scrollbar">
          {/* TAB 1: Profile & Measurements */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {/* Basic measurements */}
              <GlassCard className="p-4 space-y-3">
                <h4 className="text-xs font-black text-purple-300 flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  <span>اندازه‌گیری‌های بدنی ثبت شده</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-zinc-400 block">وزن</span>
                    <span className="font-bold text-white text-sm">
                      {measurements?.weightKg ? `${toPersianDigits(measurements.weightKg)} kg` : 'ثبت نشده'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-zinc-400 block">قد</span>
                    <span className="font-bold text-white text-sm">
                      {measurements?.heightCm ? `${toPersianDigits(measurements.heightCm)} cm` : 'ثبت نشده'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-zinc-400 block">دور کمر</span>
                    <span className="font-bold text-white text-sm">
                      {measurements.waistCm ? `${toPersianDigits(measurements.waistCm)} cm` : 'ثبت نشده'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-zinc-400 block">دور سینه</span>
                    <span className="font-bold text-white text-sm">
                      {measurements.chestCm ? `${toPersianDigits(measurements.chestCm)} cm` : 'ثبت نشده'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-zinc-400 block">دور بازو</span>
                    <span className="font-bold text-white text-sm">
                      {measurements.armCm ? `${toPersianDigits(measurements.armCm)} cm` : 'ثبت نشده'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-zinc-400 block">دور ران</span>
                    <span className="font-bold text-white text-sm">
                      {measurements.thighCm ? `${toPersianDigits(measurements.thighCm)} cm` : 'ثبت نشده'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-zinc-400 block">دور باسن</span>
                    <span className="font-bold text-white text-sm">
                      {measurements.hipCm ? `${toPersianDigits(measurements.hipCm)} cm` : 'ثبت نشده'}
                    </span>
                  </div>
                </div>
              </GlassCard>

              {/* Private Progress Photos */}
              <GlassCard className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-purple-300 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-purple-400" />
                    <span>عکس‌های وضعیت بدنی (محرمانه - فقط دسترسی مربی)</span>
                  </h4>
                  <span className="text-[10px] text-zinc-400">
                    {toPersianDigits(photos.length)} عکس ثبت شده
                  </span>
                </div>

                {photos.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-3 text-center">
                    شاگرد عکسی بارگذاری نکرده است.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {photos.map((p) => {
                      const labelFa = p.type === 'front' ? 'روبه‌رو' : p.type === 'side' ? 'نیمرخ' : 'پشت';
                      return (
                        <div key={p.id} className="space-y-1.5 text-center">
                          <span className="text-xs font-bold text-zinc-300">{labelFa}</span>
                          <div className="w-full h-48 rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                            <img
                              src={p.downloadUrl}
                              alt={labelFa}
                              className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                              onClick={() => window.open(p.downloadUrl, '_blank')}
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </GlassCard>
            </div>
          )}

          {/* TAB 2: Health & Lifestyle */}
          {activeTab === 'health' && (
            <div className="space-y-4">
              <GlassCard className="p-4 space-y-3">
                <h4 className="text-xs font-black text-rose-300 flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  <span>آسیب‌ها و شرایط پزشکی</span>
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-zinc-400 font-bold block">محدودیت یا آسیب‌دیدگی:</span>
                    <p className="text-white font-bold">
                      {health.hasInjuryOrLimitation
                        ? `بله (${(health.injuryCategories || []).join('، ')}) - ${health.injuryDescription || 'بدون توضیح'}`
                        : 'خیر - بدون آسیب'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-zinc-400 font-bold block">شرایط پزشکی یا داروهای خاص:</span>
                    <p className="text-white font-bold">
                      {health.hasMedicalConditionOrMedication
                        ? `بله: ${health.medicalConditionDescription || 'دارای شرایط خاص'}`
                        : 'خیر - بدون داروی خاص'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-zinc-400 font-bold block">وضعیت بارداری / پس از زایمان:</span>
                    <p className="text-white font-bold">
                      {health.specialCondition === 'pregnancy'
                        ? `بارداری - ${health.specialConditionNotes || ''}`
                        : health.specialCondition === 'postpartum'
                        ? `پس از زایمان - ${health.specialConditionNotes || ''}`
                        : 'هیچ‌کدام'}
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Lifestyle */}
              <GlassCard className="p-4 space-y-3">
                <h4 className="text-xs font-black text-purple-300 flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  <span>سبک زندگی و فعالیت روزمره</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5">
                    <span className="text-[10px] text-zinc-400 block">سطح فعالیت روزانه</span>
                    <span className="font-bold text-white">
                      {lifestyle.dailyActivityLevel === 'sedentary'
                        ? 'کم‌تحرک'
                        : lifestyle.dailyActivityLevel === 'active'
                        ? 'فعال'
                        : lifestyle.dailyActivityLevel === 'very_active'
                        ? 'خیلی فعال'
                        : 'معمولی'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5">
                    <span className="text-[10px] text-zinc-400 block">نوع شغل</span>
                    <span className="font-bold text-white">
                      {lifestyle.jobType === 'desk'
                        ? 'پشت‌میزنشین'
                        : lifestyle.jobType === 'active'
                        ? 'فعال'
                        : 'ترکیبی'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5">
                    <span className="text-[10px] text-zinc-400 block">تحرک عمومی</span>
                    <span className="font-bold text-white">
                      {lifestyle.dailyMovement === 'low'
                        ? 'کم'
                        : lifestyle.dailyMovement === 'high'
                        ? 'زیاد'
                        : 'متوسط'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5">
                    <span className="text-[10px] text-zinc-400 block">برنامه خواب</span>
                    <span className="font-bold text-white">
                      {lifestyle.sleepSchedule || 'معمولی'}
                    </span>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {/* TAB 3: Nutrition & Goals */}
          {activeTab === 'nutrition' && (
            <div className="space-y-4">
              <GlassCard className="p-4 space-y-3">
                <h4 className="text-xs font-black text-rose-300 flex items-center gap-1.5">
                  <Apple className="w-4 h-4" />
                  <span>ترجیحات تغذیه‌ای و آلرژی‌ها</span>
                </h4>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <span className="text-zinc-400 font-bold">سبک رژیم:</span>
                    <span className="font-black text-white">
                      {nutrition.dietPreference === 'vegetarian'
                        ? 'گیاه‌خواری'
                        : nutrition.dietPreference === 'vegan'
                        ? 'وگان'
                        : 'همه‌چیزخوار'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <span className="text-zinc-400 font-bold">تعداد وعده‌ها:</span>
                    <span className="font-black text-white font-mono">
                      {toPersianDigits(nutrition.mealFrequency)} وعده در روز
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-1">
                    <span className="text-rose-400 font-bold block">حساسیت‌ها و آلرژی‌های غذایی:</span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {nutrition.allergies.length > 0 ? (
                        nutrition.allergies.map((a) => (
                          <span
                            key={a}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs"
                          >
                            {a}
                          </span>
                        ))
                      ) : (
                        <span className="text-zinc-400">حساسیتی ثبت نشده است.</span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                    <span className="text-emerald-400 font-bold block">غذاهای مورد علاقه:</span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {nutrition.favoriteFoods.map((f) => (
                        <span
                          key={f}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 space-y-1">
                    <span className="text-red-400 font-bold block">غذاهای نامحبوب:</span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {nutrition.dislikedFoods.length > 0 ? (
                        nutrition.dislikedFoods.map((f) => (
                          <span
                            key={f}
                            className="px-2.5 py-1 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 font-bold text-xs"
                          >
                            {f}
                          </span>
                        ))
                      ) : (
                        <span className="text-zinc-400">موردی ثبت نشده.</span>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Goal & Preferences */}
              <GlassCard className="p-4 space-y-3">
                <h4 className="text-xs font-black text-purple-300 flex items-center gap-1.5">
                  <Dumbbell className="w-4 h-4" />
                  <span>هدف، سبک تمرین و محدودیت‌های حرکتی</span>
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5 flex justify-between">
                    <span className="text-zinc-400">تمرکز هدف:</span>
                    <span className="font-bold text-white">{goal.specificFocus || 'تناسب اندام'}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 space-y-1">
                    <span className="text-zinc-400 block">سبک‌های تمرینی ترجیحی:</span>
                    <span className="font-bold text-purple-300">
                      {(training.preferredStyles || []).join('، ')}
                    </span>
                  </div>

                  {training.dislikedExercises && (
                    <div className="p-2.5 rounded-xl bg-white/5">
                      <span className="text-zinc-400 block mb-0.5">حرکات نامحبوب:</span>
                      <span className="text-white">{training.dislikedExercises}</span>
                    </div>
                  )}

                  {training.restrictedExercises && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <span className="text-amber-400 block font-bold mb-0.5">حرکات محدود / غیرقابل انجام:</span>
                      <span className="text-white">{training.restrictedExercises}</span>
                    </div>
                  )}

                  {profile.coachNotes && (
                    <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-1">
                      <span className="text-purple-300 font-bold block">یادداشت مستقیم شاگرد به مربی:</span>
                      <p className="text-zinc-200 leading-relaxed font-normal">{profile.coachNotes}</p>
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>
          )}

          {/* TAB 4: Assignment & Publishing (Part 27 & 28) */}
          {activeTab === 'assignment' && (
            <div className="space-y-4">
              {/* Select Program */}
              <GlassCard className="p-4 space-y-3">
                <h4 className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                  <Dumbbell className="w-4 h-4" />
                  <span>تخصیص برنامه تمرینی رسمی</span>
                </h4>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                    انتخاب برنامه از کتابخانه برنامه‌های آماده:
                  </label>
                  <select
                    value={selectedProgramId}
                    onChange={(e) => setSelectedProgramId(e.target.value)}
                    className="w-full bg-zinc-800 border border-white/15 rounded-xl p-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    {availablePrograms.map((prog) => (
                      <option key={prog.id} value={prog.id}>
                        {prog.titleFa || prog.title} | {prog.level === 'advanced' ? 'پیشرفته' : prog.level === 'intermediate' ? 'متوسط' : 'مبتدی'} ({toPersianDigits(prog.daysPerWeek)} روز در هفته)
                      </option>
                    ))}
                  </select>
                </div>

                {selectedProgram && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300 leading-relaxed">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-white">{selectedProgram.titleFa || selectedProgram.title}</span>
                      <span className="text-emerald-400 font-mono">{toPersianDigits(selectedProgram.durationWeeks)} هفته</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">{selectedProgram.descriptionFa}</p>
                  </div>
                )}
              </GlassCard>

              {/* Coach Personal Notes */}
              <GlassCard className="p-4 space-y-2">
                <h4 className="text-xs font-black text-purple-300 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>توصیه‌ها و یادداشت اختصاصی مربی برای شاگرد:</span>
                </h4>
                <textarea
                  value={coachNotes}
                  onChange={(e) => setCoachNotes(e.target.value)}
                  placeholder="مثلاً: در تمرینات روز پا، مراقب زانوی راستت باش و وزنه رو کنترل شده پایین بیار. در وعده بعد تمرین پروتئین کافی مصرف کن..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-purple-500 focus:outline-none leading-relaxed"
                />
              </GlassCard>

              {/* Nutrition Plan Targets (Part 27) */}
              <GlassCard className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                    <Apple className="w-4 h-4" />
                    <span>تنظیم اهداف تغذیه‌ای اختصاصی</span>
                  </h4>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                    <input
                      type="checkbox"
                      checked={assignNutrition}
                      onChange={(e) => setAssignNutrition(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    <span>فعال‌سازی هدف تغذیه</span>
                  </label>
                </div>

                {assignNutrition && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-zinc-400 block mb-1">کالری روزانه</label>
                        <input
                          type="number"
                          value={calorieTarget}
                          onChange={(e) => setCalorieTarget(Number(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 block mb-1">پروتئین (گرم)</label>
                        <input
                          type="number"
                          value={proteinTarget}
                          onChange={(e) => setProteinTarget(Number(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 block mb-1">کربوهیدرات (گرم)</label>
                        <input
                          type="number"
                          value={carbTarget}
                          onChange={(e) => setCarbTarget(Number(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 block mb-1">چربی (گرم)</label>
                        <input
                          type="number"
                          value={fatTarget}
                          onChange={(e) => setFatTarget(Number(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={nutritionNotes}
                        onChange={(e) => setNutritionNotes(e.target.value)}
                        placeholder="نکات تغذیه‌ای (مثلاً: آب روزانه حداقل ۳ لیتر، عدم مصرف فست‌فود)..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-xs text-white"
                      />
                    </div>
                  </motion.div>
                )}
              </GlassCard>
            </div>
          )}
        </div>

        {/* Coach Action Bottom Bar */}
        <div className="border-t border-white/10 pt-4 mt-4 space-y-3">
          {/* Ask Question Popup Inline */}
          {showQuestionInput ? (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <label className="text-xs font-bold text-amber-400 block">
                سؤال یا استعلام تکمیلی از کاربر:
              </label>
              <textarea
                value={coachQuestion}
                onChange={(e) => setCoachQuestion(e.target.value)}
                placeholder="مثلاً: آیا سابقه جراحی در زانو داری یا صرفاً کوفتگی تمرینی است؟"
                rows={2}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowQuestionInput(false)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 text-xs text-zinc-400 hover:text-white"
                >
                  انصراف
                </button>
                <button
                  type="button"
                  onClick={handleSendQuestion}
                  disabled={!coachQuestion.trim() || processing}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 text-black font-black text-xs hover:bg-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ارسال استعلام برای کاربر</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {request.status === 'submitted' && (
                  <button
                    type="button"
                    onClick={handleStartReview}
                    disabled={processing}
                    className="py-2.5 px-4 rounded-xl bg-purple-600/30 border border-purple-500/40 hover:bg-purple-600/50 text-purple-300 font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>تغییر وضعیت به در حال بررسی</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowQuestionInput(true)}
                  className="py-2.5 px-4 rounded-xl bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-300 font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>درخواست اطلاعات بیشتر (سؤال از شاگرد)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handlePublishPlan}
                disabled={processing || !selectedProgramId}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-xs shadow-lg shadow-emerald-950/40 hover:opacity-95 active:scale-[0.98] transition-all flex items-center gap-2"
              >
                {processing ? (
                  <span>در حال انتشار...</span>
                ) : (
                  <>
                    <span>تأیید و انتشار برنامه اختصاصی</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
