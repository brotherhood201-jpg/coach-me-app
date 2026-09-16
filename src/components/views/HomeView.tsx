import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Droplets,
  Flame,
  Sparkles,
  ChevronLeft,
  Clock,
  Dumbbell,
  ArrowLeft,
  Plus,
  Play,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import { WorkoutSession, NutritionLog, DailyCheckIn, ProgramRequest } from '../../types';
import { playWorkoutSound } from '../../utils/persian';
import { AdminRepository } from '../../repositories/AdminRepository';
import { DotMatrixNumber } from '../common/DotMatrixNumber';

interface HomeViewProps {
  workout: WorkoutSession;
  isTodayDone: boolean;
  onStartWorkout: () => void;
  onViewExercises?: () => void;
  onNavigateToDiet: () => void;
  waterGlasses: number;
  targetWaterGlasses?: number;
  onAddWater: () => void;
  streakDays: number;
  nutritionLog?: NutritionLog | null;
  onOpenArticles?: () => void;
  onOpenVideos?: () => void;
  dailyCheckIn?: DailyCheckIn | null;
  onOpenCheckIn?: () => void;
  programRequest?: ProgramRequest | null;
  onOpenDetailedProfile?: () => void;
  onOpenRequestStatus?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  workout,
  isTodayDone,
  onStartWorkout,
  onViewExercises,
  onNavigateToDiet,
  waterGlasses,
  targetWaterGlasses = 8,
  onAddWater,
  streakDays,
  nutritionLog,
  onOpenArticles,
  onOpenVideos,
  dailyCheckIn,
  onOpenCheckIn,
  programRequest,
  onOpenDetailedProfile,
  onOpenRequestStatus,
}) => {
  // Recommended content (1 item only for today)
  const [dailyContent, setDailyContent] = useState<{
    id: string;
    type: 'article' | 'video';
    title: string;
    category: string;
    readTimeOrDuration: string;
    image: string;
  }>({
    id: 'recovery-1',
    type: 'article',
    title: 'اصول ریکاوری عضلات و خواب بهینه',
    category: 'ریکاوری علمی',
    readTimeOrDuration: '۴ دقیقه مطالعه',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
  });

  useEffect(() => {
    AdminRepository.getArticles().then((arts) => {
      if (arts && arts.length > 0) {
        const topArt = arts[0];
        setDailyContent({
          id: topArt.id,
          type: 'article',
          title: topArt.title || 'اصول ریکاوری و خواب بهتر',
          category: topArt.category || 'آموزش روز',
          readTimeOrDuration: '۳ دقیقه مطالعه',
          image: topArt.coverImage || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
        });
      }
    });
  }, []);

  const consumedCalories = nutritionLog?.calories || 1460;
  const targetCalories = nutritionLog?.targetCalories || 2200;
  const caloriePercent = Math.min(100, Math.round((consumedCalories / targetCalories) * 100));

  const handleWaterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playWorkoutSound('tick');
    onAddWater();
  };

  const handleStartWorkout = (e: React.MouseEvent) => {
    e.stopPropagation();
    playWorkoutSound('beep');
    onStartWorkout();
  };

  const isReviewPending = programRequest && ['under_review', 'needs_more_info', 'plan_ready'].includes(programRequest.status);

  return (
    <div className="space-y-4 pb-28 text-white select-none max-w-xl mx-auto" dir="rtl">
      {/* --------------------------------------------------
          1. CURRENT STATUS / GREETING INDICATOR
          Calm, one-line status touchpoint.
          -------------------------------------------------- */}
      {isReviewPending ? (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onOpenRequestStatus || onOpenDetailedProfile}
          className="rounded-2xl px-4 py-3 bg-gradient-to-r from-violet-950/50 via-[#160b2d]/60 to-purple-950/40 border border-violet-500/30 backdrop-blur-xl flex items-center justify-between cursor-pointer group shadow-sm hover:border-violet-400/50 transition"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_#a855f7] animate-ping" />
            <span className="text-xs font-bold text-violet-200 truncate">
              {programRequest?.status === 'under_review'
                ? 'پرونده تمرینی شما در حال بررسی توسط مربی است'
                : programRequest?.status === 'needs_more_info'
                ? 'مربی یک سوال برای تنظیم برنامه شما دارد'
                : 'برنامه اختصاصی شما آماده شده است 🎉'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-violet-300 group-hover:text-white transition shrink-0">
            <span>مشاهده</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </div>
        </motion.div>
      ) : (
        <div className="flex items-center justify-between px-1 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            <span>برنامه امروز شما آماده است</span>
          </div>
          <span className="text-[11px] font-medium text-zinc-500">
            هفته دوم • فاز سازگاری
          </span>
        </div>
      )}

      {/* --------------------------------------------------
          2. TODAY'S WORKOUT — PRIMARY HERO
          ONE large important card with ONE primary CTA.
          Tapping body opens exercise details drawer.
          -------------------------------------------------- */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative w-full rounded-[30px] overflow-hidden border border-blue-500/30 bg-[#060b18] shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_30px_rgba(0,102,255,0.14)] p-5 sm:p-6 flex flex-col justify-between min-h-[290px] sm:min-h-[320px] group"
      >
        {/* Background Image with Calm Dark Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop"
            alt="تمرین امروز"
            className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060b18] via-[#060b18]/85 to-[#060b18]/40" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#060b18]/90 via-transparent to-transparent" />
        </div>

        {/* Top Header Row in Card */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          {/* Status badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border ${
              isTodayDone
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
            }`}
          >
            {isTodayDone ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>تمرین امروز انجام شد</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span>تمرین امروز</span>
              </>
            )}
          </div>

          {/* Secondary Action: Exercise Details Link */}
          {onViewExercises && (
            <button
              type="button"
              onClick={onViewExercises}
              className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-zinc-400" />
              <span>مشاهده حرکات</span>
              <ChevronLeft className="w-3 h-3 text-zinc-400" />
            </button>
          )}
        </div>

        {/* Center / Body: Title & Essential Metrics */}
        <div className="relative z-10 py-4 space-y-2.5">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {workout.titleFa || 'تمرین قدرتی بالاتنه'}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-normal">
              سطح {workout.difficultyFa || 'متوسط'} • تمرکز بر عضله‌سازی و فرم صحیح
            </p>
          </div>

          {/* Two Key Numbers Only (Exercises + Estimated Time) */}
          <div className="flex items-center gap-4 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-zinc-300 bg-white/[0.05] px-3 py-1.5 rounded-xl border border-white/[0.08]">
              <Dumbbell className="w-3.5 h-3.5 text-sky-400" />
              <DotMatrixNumber value={workout.totalExercises || 6} size="xs" glow="none" color="white" />
              <span>حرکت</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-zinc-300 bg-white/[0.05] px-3 py-1.5 rounded-xl border border-white/[0.08]">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <DotMatrixNumber value={workout.estimatedMinutes || 45} size="xs" glow="none" color="white" />
              <span>دقیقه</span>
            </div>
          </div>
        </div>

        {/* Bottom: ONE Primary CTA Button */}
        <div className="relative z-10 pt-1">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartWorkout}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-black text-sm sm:text-base border border-white/20 shadow-[0_8px_25px_rgba(79,70,229,0.45)] hover:shadow-[0_10px_35px_rgba(79,70,229,0.65)] transition cursor-pointer flex items-center justify-between group"
          >
            <span>
              {isTodayDone ? 'مرور مجدد تمرین' : 'شروع تمرین امروز'}
            </span>

            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:translate-x-[-2px] transition">
              <ArrowLeft className="w-4 h-4 text-white" />
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* --------------------------------------------------
          3 & 4. WATER & NUTRITION SUMMARY
          Balanced twin cards for today's physical essentials.
          Calm, one clear number each, progressive disclosure.
          -------------------------------------------------- */}
      <div className="grid grid-cols-2 gap-3">
        {/* 3. Water Card */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          onClick={handleWaterClick}
          className="rounded-[24px] p-4 bg-gradient-to-br from-[#07152b]/80 via-[#0a1835]/75 to-[#071124]/90 border border-sky-500/25 backdrop-blur-xl shadow-md cursor-pointer group flex flex-col justify-between min-h-[145px]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-400 fill-sky-400/20" />
              <span className="text-xs font-bold text-zinc-300">مصرف آب</span>
            </div>

            {/* Quick Add Plus Button */}
            <button
              type="button"
              onClick={handleWaterClick}
              className="w-7 h-7 rounded-full bg-sky-500/20 hover:bg-sky-500/35 border border-sky-400/40 text-sky-200 flex items-center justify-center transition cursor-pointer shadow-sm"
              title="ثبت یک لیوان آب"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-baseline gap-1">
              <DotMatrixNumber
                value={`${waterGlasses} / ${targetWaterGlasses}`}
                unit="لیوان"
                size="lg"
                glow="cyan"
                color="cyan"
              />
            </div>

            {/* Subtle Pill Progress */}
            <div className="flex items-center gap-1 w-full pt-1">
              {Array.from({ length: 6 }).map((_, idx) => {
                const filled = idx < Math.min(6, Math.round((waterGlasses / targetWaterGlasses) * 6));
                return (
                  <div
                    key={idx}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      filled
                        ? 'bg-gradient-to-r from-blue-500 to-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.5)]'
                        : 'bg-white/[0.08]'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* 4. Calories / Nutrition Summary Card */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          onClick={onNavigateToDiet}
          className="rounded-[24px] p-4 bg-gradient-to-br from-[#1b0a16]/80 via-[#15091d]/75 to-[#0e0717]/90 border border-rose-500/25 backdrop-blur-xl shadow-md cursor-pointer group flex flex-col justify-between min-h-[145px]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-400 fill-rose-400/20" />
              <span className="text-xs font-bold text-zinc-300">کالری امروز</span>
            </div>

            <div className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center text-zinc-400 group-hover:text-white transition">
              <ChevronLeft className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-baseline gap-1">
              <DotMatrixNumber
                value={consumedCalories.toLocaleString('en-US')}
                unit="kcal"
                size="lg"
                glow="rose"
                color="rose"
              />
            </div>

            {/* Single clean bar */}
            <div className="space-y-1 pt-1">
              <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-rose-500 to-pink-400 transition-all duration-500"
                  style={{ width: `${caloriePercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-400 font-medium">
                <span>هدف: {targetCalories}</span>
                <span>{caloriePercent}٪</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* --------------------------------------------------
          5. SHORT PROGRESS / STATUS
          A single calm touchpoint for today's check-in & streak.
          Opens DailyCheckInModal when tapped.
          -------------------------------------------------- */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        onClick={onOpenCheckIn}
        className="rounded-[22px] px-4 py-3.5 bg-[#0f0c22]/75 hover:bg-[#151030]/85 border border-purple-500/20 backdrop-blur-xl shadow-sm cursor-pointer group flex items-center justify-between transition"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0">
            {dailyCheckIn ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Sparkles className="w-4 h-4 text-purple-400" />
            )}
          </div>

          <div className="min-w-0">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{dailyCheckIn ? 'گزارش امروز ثبت شد' : 'ثبت گزارش روزانه'}</span>
              <span className="text-[10px] text-purple-300/80 font-normal">
                ({streakDays || 5} روز استریک)
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 truncate mt-0.5">
              {dailyCheckIn
                ? `نمره امروز شما: ${dailyCheckIn.dailyScore || 8} از ۱۰`
                : 'انرژی، خواب و حس عضلانی امروزت رو ثبت کن'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-bold text-purple-300 group-hover:text-purple-200 transition shrink-0">
          <span>{dailyCheckIn ? 'ویرایش' : 'ثبت'}</span>
          <ChevronLeft className="w-3.5 h-3.5" />
        </div>
      </motion.div>

      {/* --------------------------------------------------
          6. ONE RECOMMENDED CONTENT ITEM
          Calm, editorial, single card at the bottom.
          Opens article/video modal on tap.
          -------------------------------------------------- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        onClick={() => {
          if (dailyContent.type === 'video') onOpenVideos?.();
          else onOpenArticles?.();
        }}
        className="rounded-[24px] p-3.5 bg-gradient-to-r from-[#140824]/75 via-[#10071d]/75 to-[#0b0c1e]/80 border border-violet-500/20 backdrop-blur-xl shadow-sm cursor-pointer group flex items-center justify-between gap-3 hover:border-violet-400/40 transition"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Thumbnail */}
          <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10">
            <img
              src={dailyContent.image}
              alt={dailyContent.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
              <Play className="w-3.5 h-3.5 fill-white text-white opacity-80" />
            </div>
          </div>

          {/* Details */}
          <div className="min-w-0 space-y-0.5">
            <span className="text-[10px] font-bold text-violet-400 block">
              {dailyContent.category}
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-violet-200 transition">
              {dailyContent.title}
            </h4>
            <span className="text-[10px] text-zinc-400 block">
              {dailyContent.readTimeOrDuration}
            </span>
          </div>
        </div>

        <div className="w-7 h-7 rounded-full bg-white/[0.05] flex items-center justify-center text-zinc-400 group-hover:text-white transition shrink-0">
          <ChevronLeft className="w-3.5 h-3.5" />
        </div>
      </motion.div>
    </div>
  );
};
