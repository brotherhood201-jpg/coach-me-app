import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Utensils,
  Droplets,
  Flame,
  Plus,
  Minus,
  Heart,
  Sliders,
  ChevronLeft,
  Clock,
  Coffee,
  Sun,
  Moon,
  Cookie,
  Sparkles,
} from 'lucide-react';
import { DotMatrixNumber } from '../common/DotMatrixNumber';
import { NutritionLog, MealItem } from '../../types';
import { playWorkoutSound } from '../../utils/persian';
import { NutritionService } from '../../services/NutritionService';
import { WaterService } from '../../services/WaterService';
import { AddFoodModal } from '../nutrition/AddFoodModal';
import { FoodPreferencesModal } from '../nutrition/FoodPreferencesModal';
import { MealDetailModal } from '../nutrition/MealDetailModal';

interface DietViewProps {
  userId?: string;
  userGoal?: string;
  onOpenPreferences?: () => void;
}

export const DietView: React.FC<DietViewProps> = ({
  userId = 'user-demo-alireza',
  userGoal = 'افزایش حجم عضلانی',
}) => {
  const [nutritionLog, setNutritionLog] = useState<NutritionLog>(() =>
    NutritionService.getLocalLog(userId)
  );
  const [waterGlasses, setWaterGlasses] = useState<number>(5);
  const [targetWaterGlasses, setTargetWaterGlasses] = useState<number>(8);
  const [waterRipple, setWaterRipple] = useState(false);

  // Modals state
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [selectedMealTypeForAdd, setSelectedMealTypeForAdd] = useState<
    'breakfast' | 'lunch' | 'dinner' | 'snack'
  >('breakfast');
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [selectedMealForDetail, setSelectedMealForDetail] = useState<
    'breakfast' | 'lunch' | 'dinner' | 'snack' | null
  >(null);

  // Target customization state
  const [isSettingTarget, setIsSettingTarget] = useState(false);
  const [customTargetCal, setCustomTargetCal] = useState<string>('2150');

  // Load latest log & water on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const log = await NutritionService.getNutritionLog(userId);
        setNutritionLog(log);
        if (log.targetCalories) {
          setCustomTargetCal(String(log.targetCalories));
        }

        const water = await WaterService.getWaterLog(userId);
        setWaterGlasses(water.glasses);
        setTargetWaterGlasses(water.targetGlasses || 8);
      } catch (e) {
        console.warn('Error loading nutrition data:', e);
      }
    };
    loadData();
  }, [userId]);

  // Water controls
  const handleAddWater = async () => {
    playWorkoutSound('tick');
    setWaterRipple(true);
    setTimeout(() => setWaterRipple(false), 600);

    const updated = await WaterService.updateWaterGlasses(userId, 1, targetWaterGlasses);
    setWaterGlasses(updated.glasses);
  };

  const handleRemoveWater = async () => {
    if (waterGlasses <= 0) return;
    playWorkoutSound('tick');
    const updated = await WaterService.updateWaterGlasses(userId, -1, targetWaterGlasses);
    setWaterGlasses(updated.glasses);
  };

  // Food handlers
  const handleOpenAddFood = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    playWorkoutSound('tick');
    setSelectedMealTypeForAdd(mealType);
    setIsAddFoodOpen(true);
  };

  const handleFoodAdded = async () => {
    const updated = await NutritionService.getNutritionLog(userId);
    setNutritionLog(updated);
  };

  const handleDeleteMeal = async (mealId: string) => {
    playWorkoutSound('tick');
    const updated = await NutritionService.deleteMealItem(userId, mealId);
    setNutritionLog(updated);
  };

  const handleSaveTargetCalories = async () => {
    playWorkoutSound('tick');
    const val = parseInt(customTargetCal) || 2150;
    const updated = await NutritionService.setTargetMacros(userId, { calories: val });
    setNutritionLog(updated);
    setIsSettingTarget(false);
  };

  // Nutrition Stats calculations
  const targetCalories = nutritionLog?.targetCalories || 2150;
  const consumedCalories = nutritionLog?.calories || 0;
  const remainingCalories = Math.max(0, targetCalories - consumedCalories);
  const targetProtein = nutritionLog?.targetProtein || 145;
  const consumedProtein = nutritionLog?.protein || 0;
  const targetCarbs = nutritionLog?.targetCarbs || 220;
  const consumedCarbs = nutritionLog?.carbs || 0;
  const targetFat = nutritionLog?.targetFat || 65;
  const consumedFat = nutritionLog?.fat || 0;

  const calPercentage = Math.min(100, Math.round((consumedCalories / targetCalories) * 100));

  // Determine current upcoming meal based on local hour
  const getUpcomingMealType = (): 'breakfast' | 'lunch' | 'snack' | 'dinner' => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    if (currentMinutes < 10 * 60) return 'breakfast';
    if (currentMinutes < 14 * 60 + 30) return 'lunch';
    if (currentMinutes < 18 * 60 + 30) return 'snack';
    return 'dinner';
  };

  const upcomingMealType = getUpcomingMealType();

  const mealsList = nutritionLog.meals || [];
  const breakfastMeals = mealsList.filter((m) => m.mealType === 'breakfast');
  const lunchMeals = mealsList.filter((m) => m.mealType === 'lunch');
  const snackMeals = mealsList.filter((m) => m.mealType === 'snack');
  const dinnerMeals = mealsList.filter((m) => m.mealType === 'dinner');

  const mealSections = [
    {
      type: 'breakfast' as const,
      title: 'صبحانه',
      defaultTime: '۰۸:۳۰',
      icon: <Coffee className="w-4 h-4 text-amber-400" />,
      items: breakfastMeals,
    },
    {
      type: 'lunch' as const,
      title: 'ناهار',
      defaultTime: '۱۳:۳۰',
      icon: <Sun className="w-4 h-4 text-orange-400" />,
      items: lunchMeals,
    },
    {
      type: 'snack' as const,
      title: 'میان‌وعده',
      defaultTime: '۱۷:۰۰',
      icon: <Cookie className="w-4 h-4 text-violet-400" />,
      items: snackMeals,
    },
    {
      type: 'dinner' as const,
      title: 'شام',
      defaultTime: '۲۱:۰۰',
      icon: <Moon className="w-4 h-4 text-indigo-400" />,
      items: dinnerMeals,
    },
  ];

  const currentSelectedSection = mealSections.find((s) => s.type === selectedMealForDetail);

  // SVG circular arc math
  const circleSize = 104;
  const strokeWidth = 8;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (calPercentage / 100) * circumference;

  return (
    <div className="space-y-4 pb-28 text-white select-none max-w-xl mx-auto" dir="rtl">
      {/* --------------------------------------------------
          HEADER
          "تغذیه امروز"
          "برنامه غذایی امروزت"
          Minimal header with Food Preferences & Target settings
          -------------------------------------------------- */}
      <div className="flex items-center justify-between px-1">
        <div className="space-y-0.5">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">تغذیه امروز</h1>
          <p className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
            <span>برنامه غذایی امروزت</span>
            <span className="text-zinc-600">•</span>
            <span className="text-violet-300 font-bold">{userGoal}</span>
          </p>
        </div>

        {/* Minimal Utilities */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              playWorkoutSound('tick');
              setIsSettingTarget(!isSettingTarget);
            }}
            title="تنظیم هدف کالری"
            className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              playWorkoutSound('tick');
              setIsPreferencesOpen(true);
            }}
            title="ترجیحات غذایی"
            className="w-8 h-8 rounded-full bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/30 text-violet-300 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Target setting accordion if opened */}
      <AnimatePresence>
        {isSettingTarget && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3.5 rounded-2xl bg-[#0c0919] border border-violet-500/30 space-y-2">
              <span className="text-xs font-bold text-zinc-300 block">تنظیم کالری هدف روزانه:</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1200"
                  max="5000"
                  step="50"
                  value={customTargetCal}
                  onChange={(e) => setCustomTargetCal(e.target.value)}
                  className="w-32 bg-white/[0.05] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono font-bold focus:border-violet-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveTargetCalories}
                  className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  ذخیره
                </button>
                <button
                  type="button"
                  onClick={() => setIsSettingTarget(false)}
                  className="px-2 py-1.5 text-xs text-zinc-400 hover:text-white cursor-pointer"
                >
                  انصراف
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --------------------------------------------------
          1. DAILY CALORIE HERO
          ONE large premium Liquid Glass section.
          Show:
          Calories consumed
          Calories remaining
          Daily target
          Subtle circular arc progress indicator (Blue -> Violet -> Magenta)
          ALL numbers in Dot-Matrix typography.
          -------------------------------------------------- */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative w-full rounded-[32px] overflow-hidden border border-violet-500/25 bg-[#060b18] shadow-[0_20px_50px_rgba(0,0,0,0.75),0_0_35px_rgba(139,92,246,0.18)] p-5 sm:p-6 backdrop-blur-2xl"
      >
        <div className="flex items-center justify-between gap-4">
          {/* Information block: Consumed, Target, Remaining */}
          <div className="space-y-3 min-w-0">
            {/* Consumed & Target */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-zinc-400 block">کالری مصرف شده</span>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <DotMatrixNumber
                  value={consumedCalories}
                  size="xl"
                  glow="violet"
                  color="violet"
                />
                <div className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                  <span>/</span>
                  <DotMatrixNumber
                    value={targetCalories}
                    size="xs"
                    glow="none"
                    color="white"
                  />
                  <span>kcal</span>
                </div>
              </div>
            </div>

            {/* Calories Remaining with Liquid Glass pill */}
            <div className="flex items-center gap-2 pt-0.5">
              <div className="px-3 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 backdrop-blur-md flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-emerald-400">باقی‌مانده:</span>
                <DotMatrixNumber
                  value={remainingCalories}
                  unit="kcal"
                  size="xs"
                  glow="emerald"
                  color="emerald"
                />
              </div>
            </div>
          </div>

          {/* Subtle Circular / Arc Progress Indicator */}
          <div className="relative shrink-0 flex items-center justify-center">
            <svg
              width={circleSize}
              height={circleSize}
              className="transform -rotate-90"
            >
              <defs>
                <linearGradient id="calorieArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#d946ef" />
                </linearGradient>
              </defs>
              {/* Background Track */}
              <circle
                cx={circleSize / 2}
                cy={circleSize / 2}
                r={radius}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Animated Progress Arc */}
              <motion.circle
                cx={circleSize / 2}
                cy={circleSize / 2}
                r={radius}
                stroke="url(#calorieArcGrad)"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>

            {/* Inner Content of the Circle: Percentage */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <DotMatrixNumber
                value={`${calPercentage}%`}
                size="xs"
                glow="violet"
                color="white"
              />
              <span className="text-[9px] text-zinc-500 font-bold mt-0.5">تکمیل</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* --------------------------------------------------
          2. MACROS
          Show only the three essential macros:
          پروتئین | کربوهیدرات | چربی
          Compact horizontal layout connected as one compact component.
          Each number uses Dot-Matrix typography.
          -------------------------------------------------- */}
      <div className="grid grid-cols-3 divide-x divide-x-reverse divide-white/[0.08] rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-3 shadow-sm">
        {/* پروتئین */}
        <div className="text-center px-2 space-y-1">
          <span className="text-[11px] font-bold text-violet-300 block">پروتئین</span>
          <DotMatrixNumber
            value={Math.round(consumedProtein)}
            unit="g"
            size="sm"
            glow="violet"
            color="violet"
          />
          <div className="w-12 h-1 rounded-full bg-white/10 mx-auto overflow-hidden mt-1">
            <div
              className="h-full bg-violet-500 rounded-full"
              style={{ width: `${Math.min(100, (consumedProtein / targetProtein) * 100)}%` }}
            />
          </div>
        </div>

        {/* کربوهیدرات */}
        <div className="text-center px-2 space-y-1">
          <span className="text-[11px] font-bold text-sky-300 block">کربوهیدرات</span>
          <DotMatrixNumber
            value={Math.round(consumedCarbs)}
            unit="g"
            size="sm"
            glow="cyan"
            color="cyan"
          />
          <div className="w-12 h-1 rounded-full bg-white/10 mx-auto overflow-hidden mt-1">
            <div
              className="h-full bg-sky-500 rounded-full"
              style={{ width: `${Math.min(100, (consumedCarbs / targetCarbs) * 100)}%` }}
            />
          </div>
        </div>

        {/* چربی */}
        <div className="text-center px-2 space-y-1">
          <span className="text-[11px] font-bold text-rose-300 block">چربی</span>
          <DotMatrixNumber
            value={Math.round(consumedFat)}
            unit="g"
            size="sm"
            glow="rose"
            color="rose"
          />
          <div className="w-12 h-1 rounded-full bg-white/10 mx-auto overflow-hidden mt-1">
            <div
              className="h-full bg-rose-500 rounded-full"
              style={{ width: `${Math.min(100, (consumedFat / targetFat) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* --------------------------------------------------
          5. WATER
          Today's water progress as a very compact section.
          Example: 5 / 8 لیوان
          Dot-Matrix typography.
          Includes existing water interaction (+ / -).
          -------------------------------------------------- */}
      <div
        className={`p-3 rounded-2xl bg-white/[0.03] border transition-colors flex items-center justify-between backdrop-blur-xl ${
          waterRipple ? 'border-blue-400/50 bg-blue-950/20' : 'border-white/[0.08]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-zinc-300 block">آب امروز</span>
            <div className="flex items-center gap-1 text-xs text-zinc-400">
              <DotMatrixNumber value={waterGlasses} size="xs" glow="cyan" color="cyan" />
              <span>/</span>
              <DotMatrixNumber value={targetWaterGlasses} size="2xs" glow="none" color="white" />
              <span>لیوان</span>
            </div>
          </div>
        </div>

        {/* Quick water interaction buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleRemoveWater}
            disabled={waterGlasses <= 0}
            className="w-8 h-8 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] disabled:opacity-30 flex items-center justify-center text-zinc-400 hover:text-white transition cursor-pointer"
            title="کاهش یک لیوان"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleAddWater}
            className="py-1.5 px-3 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-200 border border-blue-500/30 text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-[0_0_12px_rgba(59,130,246,0.15)]"
          >
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            <span>+ یک لیوان</span>
          </button>
        </div>
      </div>

      {/* --------------------------------------------------
          3. TODAY'S MEALS & 4. NEXT MEAL HIGHLIGHT
          Show today's meals as a clean list.
          For each meal: نام وعده, زمان, کالری.
          Highlight the next upcoming meal with Liquid Glass highlight.
          Tapping ANY meal opens the Meal Detail modal.
          -------------------------------------------------- */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-zinc-400">وعده‌های امروز</h3>
          <span className="text-[11px] text-zinc-500">برای جزئیات یا ثبت لمس کنید</span>
        </div>

        <div className="space-y-2">
          {mealSections.map((section) => {
            const isNextMeal = section.type === upcomingMealType;
            const mealCals = section.items.reduce((sum, item) => sum + item.calories, 0);
            const displayTime = section.items[0]?.time || section.defaultTime;

            return (
              <motion.div
                key={section.type}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  playWorkoutSound('tick');
                  setSelectedMealForDetail(section.type);
                }}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer flex items-center justify-between border ${
                  isNextMeal
                    ? 'bg-gradient-to-r from-violet-950/40 via-purple-950/30 to-[#0b0818] border-violet-500/40 shadow-[0_0_20px_rgba(139,92,246,0.16)]'
                    : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.07]'
                }`}
              >
                {/* Left: Icon + Title + Next Meal Badge */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      isNextMeal
                        ? 'bg-violet-500/20 border-violet-500/35 text-violet-300'
                        : 'bg-white/[0.04] border-white/[0.08] text-zinc-400'
                    }`}
                  >
                    {section.icon}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                        {section.title}
                      </h4>
                      {isNextMeal && (
                        <span className="text-[10px] font-bold text-violet-300 bg-violet-500/20 px-2 py-0.5 rounded-full border border-violet-500/30">
                          وعده بعدی
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      <span>{displayTime}</span>
                      {section.items.length > 0 && (
                        <>
                          <span className="text-zinc-600">•</span>
                          <span className="text-zinc-400 text-[10px]">
                            <DotMatrixNumber
                              value={section.items.length}
                              unit="قلم"
                              size="2xs"
                              glow="none"
                              color="muted"
                            />
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Calories & Chevron */}
                <div className="flex items-center gap-3 shrink-0">
                  <DotMatrixNumber
                    value={mealCals}
                    unit="kcal"
                    size="xs"
                    glow={isNextMeal ? 'amber' : 'none'}
                    color={mealCals > 0 ? 'white' : 'muted'}
                  />

                  <div className="w-7 h-7 rounded-xl bg-white/[0.04] flex items-center justify-center text-zinc-400 group-hover:text-white transition">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* --------------------------------------------------
          MODALS & DETAILS
          1. MealDetailModal: Opens when tapping any meal
          2. AddFoodModal: Opens from meal detail or quick add
          3. FoodPreferencesModal: Opens from header
          -------------------------------------------------- */}
      <AnimatePresence>
        {selectedMealForDetail && currentSelectedSection && (
          <MealDetailModal
            isOpen={true}
            onClose={() => setSelectedMealForDetail(null)}
            mealType={selectedMealForDetail}
            mealTitle={currentSelectedSection.title}
            mealIcon={currentSelectedSection.icon}
            mealTime={currentSelectedSection.items[0]?.time || currentSelectedSection.defaultTime}
            items={currentSelectedSection.items}
            onOpenAddFood={() => {
              handleOpenAddFood(selectedMealForDetail);
            }}
            onDeleteItem={handleDeleteMeal}
          />
        )}
      </AnimatePresence>

      {/* Add Food Modal */}
      <AddFoodModal
        isOpen={isAddFoodOpen}
        onClose={() => setIsAddFoodOpen(false)}
        onFoodAdded={handleFoodAdded}
        defaultMealType={selectedMealTypeForAdd}
        userId={userId}
      />

      {/* Food Preferences Modal */}
      <FoodPreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        userId={userId}
      />
    </div>
  );
};
