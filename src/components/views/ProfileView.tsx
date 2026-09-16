import React from 'react';
import { motion } from 'motion/react';
import {
  User,
  Crown,
  Settings,
  Bell,
  LogOut,
  ChevronLeft,
  Sliders,
  Shield,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { DotMatrixNumber } from '../common/DotMatrixNumber';
import { UserProfile, ProgramRequest } from '../../types';
import { playWorkoutSound } from '../../utils/persian';

interface ProfileViewProps {
  userProfile: UserProfile;
  isLoggedIn: boolean;
  onOpenAuth: () => void;
  onOpenSettings: () => void;
  onOpenFavorites: () => void;
  onOpenAchievements: () => void;
  onOpenNutrition: () => void;
  onOpenTrainingProfile?: () => void;
  onOpenFoodPreferences?: () => void;
  onOpenNotificationSettings?: () => void;
  onOpenDetailedProfile?: () => void;
  onOpenRequestStatus?: () => void;
  programRequest?: ProgramRequest | null;
  onLogout: () => void;
  onOpenAdmin?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  isLoggedIn,
  onOpenAuth,
  onOpenSettings,
  onOpenTrainingProfile,
  onOpenNotificationSettings,
  onOpenDetailedProfile,
  onOpenRequestStatus,
  programRequest,
  onLogout,
  onOpenAdmin,
}) => {
  // Essential personal metrics from real profile data
  const height = userProfile?.height || userProfile?.heightCm || 178;
  const weight = userProfile?.weight || userProfile?.weightKg || 79.5;
  const age = userProfile?.age || 26;

  // Goal short label in Persian
  const getGoalShortLabel = (goal?: string) => {
    switch (goal) {
      case 'fat_loss':
        return 'کاهش وزن';
      case 'muscle_gain':
        return 'عضله‌سازی';
      case 'strength':
        return 'افزایش قدرت';
      case 'endurance':
        return 'استقامت بدنی';
      case 'maintenance':
      case 'general_fitness':
      default:
        return 'تناسب اندام';
    }
  };

  // Program title resolution
  const getProgramName = () => {
    if (programRequest?.assignedTrainingPlan?.title) {
      return programRequest.assignedTrainingPlan.title;
    }
    switch (userProfile?.primaryGoal || userProfile?.goal) {
      case 'fat_loss':
        return 'Fat Loss — Phase 01';
      case 'muscle_gain':
        return 'Hypertrophy — Phase 01';
      case 'strength':
        return 'Strength & Power — Phase 01';
      case 'endurance':
        return 'Endurance — Phase 01';
      default:
        return 'General Fitness — Phase 01';
    }
  };

  // Program timeline calculations
  const totalProgramDays = programRequest?.assignedTrainingPlan?.durationWeeks
    ? programRequest.assignedTrainingPlan.durationWeeks * 7
    : 60;
  const rawWorkouts = userProfile?.totalWorkoutsDone || 18;
  const currentDay = Math.min(
    Math.max(1, rawWorkouts % totalProgramDays || 18),
    totalProgramDays
  );
  const daysRemaining = Math.max(0, totalProgramDays - currentDay);
  const progressPercentage = Math.round((currentDay / totalProgramDays) * 100);

  return (
    <div
      className="space-y-4 pb-28 text-white select-none max-w-lg mx-auto font-['Vazirmatn',system-ui,sans-serif]"
      dir="rtl"
    >
      {/* ==================================================
          1. HEADER / PROFILE HERO
          Who am I?
          - Profile photo inside subtle glowing circular frame
          - Large elegant name typography
          - Short personal status
          Clean, minimal, generous whitespace.
          ================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col items-center text-center pt-2 pb-1 space-y-3"
      >
        {/* Glowing Circular Avatar */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full p-[2.5px] bg-gradient-to-tr from-blue-500 via-violet-500 to-fuchsia-500 shadow-[0_0_25px_rgba(139,92,246,0.35)] flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#080c1d] flex items-center justify-center overflow-hidden">
              {userProfile?.profileImage ? (
                <img
                  src={userProfile.profileImage}
                  alt={userProfile?.name || 'پروفایل'}
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-2xl font-black text-white select-none">
                  {userProfile?.name?.slice(0, 1) || 'ع'}
                </span>
              )}
            </div>
          </div>

          {/* Pro indicator badge */}
          <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-violet-600 border-2 border-[#080c1d] flex items-center justify-center shadow-lg">
            <Crown className="w-3 h-3 text-amber-300" />
          </div>
        </div>

        {/* Name & Personal Status */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {userProfile?.name || 'علیرضا'}
          </h1>
          <p className="text-xs text-zinc-400 font-medium">در مسیر بهتر شدن</p>
        </div>
      </motion.div>

      {/* ==================================================
          2. PROGRAM STATUS ("برنامه فعلی")
          What is my current program? How much time is left?
          - ONE prominent but compact Liquid Glass section
          - Program name (e.g. "Fat Loss — Phase 01")
          - روز فعلی / کل دوره (روز ۱۸ / ۶۰)
          - "۴۲ روز باقی مانده"
          - ALL numbers in GLOBAL DOT-MATRIX typography
          - Subtle progress indicator
          ================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
        className="rounded-[28px] bg-white/[0.02] border border-violet-500/25 p-4 sm:p-5 backdrop-blur-2xl shadow-[0_12px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(139,92,246,0.12)] space-y-3 relative overflow-hidden"
      >
        {/* Subtle background illumination */}
        <div className="absolute -top-12 right-1/3 w-36 h-24 bg-violet-600/10 blur-2xl pointer-events-none" />

        {/* Program Header & Days Remaining */}
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-zinc-400 block">برنامه فعلی</span>
            <h2 className="text-sm sm:text-base font-black text-white tracking-tight">
              {getProgramName()}
            </h2>
          </div>

          {/* Time Remaining Pill */}
          <div className="px-3 py-1 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center gap-1.5 backdrop-blur-md shrink-0">
            <DotMatrixNumber
              value={daysRemaining}
              size="xs"
              glow="violet"
              color="violet"
            />
            <span className="text-[11px] font-bold text-violet-300">روز باقی مانده</span>
          </div>
        </div>

        {/* Program Timeline & Ratio */}
        <div className="space-y-1.5 pt-1 relative z-10">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-zinc-300 font-medium">
              <span>روز</span>
              <DotMatrixNumber
                value={currentDay}
                size="xs"
                glow="none"
                color="white"
              />
              <span className="text-zinc-600">/</span>
              <DotMatrixNumber
                value={totalProgramDays}
                size="xs"
                glow="none"
                color="muted"
              />
            </div>

            <div className="flex items-center gap-1">
              <DotMatrixNumber
                value={`${progressPercentage}%`}
                size="2xs"
                glow="emerald"
                color="emerald"
              />
            </div>
          </div>

          {/* Subtle Progress Bar Indicator */}
          <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 transition-all duration-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* ==================================================
          3. PERSONAL INFORMATION ("اطلاعات من")
          Only essential information:
          قد | وزن | سن | هدف
          Clean compact list/grid.
          Numbers: Dot-Matrix typography.
          Persian text: premium typography.
          + ONE clear action: "ویرایش اطلاعات".
          ================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.1 }}
        className="space-y-2"
      >
        <span className="text-xs font-bold text-zinc-400 block px-1">اطلاعات من</span>

        <div className="rounded-[24px] bg-white/[0.02] border border-white/[0.07] backdrop-blur-xl p-3.5 space-y-3">
          {/* 4 Essential Metrics Grid */}
          <div className="grid grid-cols-4 divide-x divide-x-reverse divide-white/[0.06] text-center">
            {/* قد */}
            <div className="px-1 space-y-1">
              <span className="text-[10px] text-zinc-400 font-medium block">قد</span>
              <DotMatrixNumber
                value={height}
                unit="cm"
                size="xs"
                glow="none"
                color="white"
              />
            </div>

            {/* وزن */}
            <div className="px-1 space-y-1">
              <span className="text-[10px] text-zinc-400 font-medium block">وزن</span>
              <DotMatrixNumber
                value={typeof weight === 'number' ? weight.toFixed(1) : weight}
                unit="kg"
                size="xs"
                glow="none"
                color="white"
              />
            </div>

            {/* سن */}
            <div className="px-1 space-y-1">
              <span className="text-[10px] text-zinc-400 font-medium block">سن</span>
              <DotMatrixNumber
                value={age}
                unit="سال"
                size="xs"
                glow="none"
                color="white"
              />
            </div>

            {/* هدف */}
            <div className="px-1 space-y-1">
              <span className="text-[10px] text-zinc-400 font-medium block">هدف</span>
              <span className="text-xs font-bold text-white block truncate leading-relaxed">
                {getGoalShortLabel(userProfile?.goal || userProfile?.primaryGoal)}
              </span>
            </div>
          </div>

          {/* EDIT PROFILE - ONE Clear Action */}
          <button
            type="button"
            onClick={() => {
              playWorkoutSound('tick');
              onOpenTrainingProfile?.();
            }}
            className="w-full py-2 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-xs font-bold text-zinc-300 hover:text-white transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Sliders className="w-3.5 h-3.5 text-violet-400" />
            <span>ویرایش اطلاعات</span>
          </button>
        </div>
      </motion.div>

      {/* ==================================================
          4. SETTINGS ("تنظیمات")
          Minimal settings section:
          - اعلان‌ها
          - تنظیمات برنامه
          - حریم خصوصی
          - خروج از حساب
          Simple line icons, compact rows, no giant cards.
          ================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.15 }}
        className="space-y-2"
      >
        <span className="text-xs font-bold text-zinc-400 block px-1">تنظیمات</span>

        <div className="rounded-[24px] bg-white/[0.02] border border-white/[0.07] backdrop-blur-xl divide-y divide-white/[0.05] overflow-hidden">
          {/* اعلان‌ها */}
          <button
            type="button"
            onClick={() => {
              playWorkoutSound('tick');
              if (onOpenNotificationSettings) {
                onOpenNotificationSettings();
              } else {
                onOpenSettings();
              }
            }}
            className="w-full py-2.5 px-3.5 flex items-center justify-between hover:bg-white/[0.03] transition cursor-pointer text-right group"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-zinc-400 group-hover:text-violet-400 transition" />
              <span className="text-xs font-bold text-zinc-200 group-hover:text-white transition">
                اعلان‌ها
              </span>
            </div>
            <ChevronLeft className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition" />
          </button>

          {/* تنظیمات برنامه */}
          <button
            type="button"
            onClick={() => {
              playWorkoutSound('tick');
              onOpenSettings();
            }}
            className="w-full py-2.5 px-3.5 flex items-center justify-between hover:bg-white/[0.03] transition cursor-pointer text-right group"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-zinc-400 group-hover:text-violet-400 transition" />
              <span className="text-xs font-bold text-zinc-200 group-hover:text-white transition">
                تنظیمات برنامه
              </span>
            </div>
            <ChevronLeft className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition" />
          </button>

          {/* حریم خصوصی */}
          <button
            type="button"
            onClick={() => {
              playWorkoutSound('tick');
              onOpenSettings();
            }}
            className="w-full py-2.5 px-3.5 flex items-center justify-between hover:bg-white/[0.03] transition cursor-pointer text-right group"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-zinc-400 group-hover:text-violet-400 transition" />
              <span className="text-xs font-bold text-zinc-200 group-hover:text-white transition">
                حریم خصوصی
              </span>
            </div>
            <ChevronLeft className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition" />
          </button>

          {/* پرونده شاگرد (If available) */}
          {(onOpenDetailedProfile || programRequest) && (
            <button
              type="button"
              onClick={() => {
                playWorkoutSound('tick');
                if (programRequest && onOpenRequestStatus) {
                  onOpenRequestStatus();
                } else if (onOpenDetailedProfile) {
                  onOpenDetailedProfile();
                }
              }}
              className="w-full py-2.5 px-3.5 flex items-center justify-between hover:bg-white/[0.03] transition cursor-pointer text-right group"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-zinc-400 group-hover:text-purple-400 transition" />
                <span className="text-xs font-bold text-zinc-200 group-hover:text-white transition">
                  پرونده تکمیلی شاگرد
                </span>
              </div>
              <ChevronLeft className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition" />
            </button>
          )}

          {/* پنل مدیریت (If available) */}
          {onOpenAdmin && (
            <button
              type="button"
              onClick={() => {
                playWorkoutSound('tick');
                onOpenAdmin();
              }}
              className="w-full py-2.5 px-3.5 flex items-center justify-between hover:bg-white/[0.03] transition cursor-pointer text-right group"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-300 group-hover:text-emerald-200 transition">
                  پنل مدیریت
                </span>
              </div>
              <ChevronLeft className="w-3.5 h-3.5 text-emerald-500/70 group-hover:text-emerald-400 transition" />
            </button>
          )}

          {/* خروج از حساب / ورود به حساب */}
          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => {
                playWorkoutSound('tick');
                onLogout();
              }}
              className="w-full py-2.5 px-3.5 flex items-center justify-between hover:bg-rose-500/[0.04] transition cursor-pointer text-right group"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-4 h-4 text-rose-400/80 group-hover:text-rose-400 transition" />
                <span className="text-xs font-bold text-rose-300 group-hover:text-rose-200 transition">
                  خروج از حساب
                </span>
              </div>
              <ChevronLeft className="w-3.5 h-3.5 text-rose-500/50 group-hover:text-rose-400 transition" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                playWorkoutSound('tick');
                onOpenAuth();
              }}
              className="w-full py-2.5 px-3.5 flex items-center justify-between hover:bg-violet-500/[0.04] transition cursor-pointer text-right group"
            >
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-bold text-violet-300 group-hover:text-violet-200 transition">
                  ورود به حساب کاربری
                </span>
              </div>
              <ChevronLeft className="w-3.5 h-3.5 text-violet-500/50 group-hover:text-violet-400 transition" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

