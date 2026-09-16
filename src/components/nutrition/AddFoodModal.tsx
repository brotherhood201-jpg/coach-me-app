import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../common/GlassCard';
import {
  X,
  Search,
  Plus,
  Flame,
  Check,
  Utensils,
  ChevronLeft,
  Sparkles,
  Edit3,
} from 'lucide-react';
import { FoodItem } from '../../types';
import { FOOD_CATEGORIES } from '../../data/foodDatabase';
import { NutritionService } from '../../services/NutritionService';
import { DotMatrixNumber } from '../common/DotMatrixNumber';
import { playWorkoutSound, toPersianDigits } from '../../utils/persian';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFoodAdded: () => void;
  defaultMealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  userId: string;
}

export const AddFoodModal: React.FC<AddFoodModalProps> = ({
  isOpen,
  onClose,
  onFoodAdded,
  defaultMealType = 'breakfast',
  userId,
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'custom'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [amountGrams, setAmountGrams] = useState<number>(100);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>(defaultMealType);

  // Custom food form state
  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState('150');
  const [customProtein, setCustomProtein] = useState('15');
  const [customCarbs, setCustomCarbs] = useState('10');
  const [customFat, setCustomFat] = useState('3');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // All foods
  const allFoods = useMemo(() => NutritionService.getAllFoods(), [isOpen]);

  // Filtered foods
  const filteredFoods = useMemo(() => {
    return allFoods.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.nameFa.toLowerCase().includes(query) ||
        (item.nameEn && item.nameEn.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [allFoods, selectedCategory, searchQuery]);

  // Calculated macros for selected food
  const calculatedMacros = useMemo(() => {
    if (!selectedFood) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    const ratio = amountGrams / 100;
    return {
      calories: Math.round(selectedFood.calories * ratio),
      protein: Math.round(selectedFood.protein * ratio * 10) / 10,
      carbs: Math.round(selectedFood.carbs * ratio * 10) / 10,
      fat: Math.round(selectedFood.fat * ratio * 10) / 10,
    };
  }, [selectedFood, amountGrams]);

  const handleSelectFood = (food: FoodItem) => {
    playWorkoutSound('tick');
    setSelectedFood(food);
    // default 100g or 30g for supplements
    if (food.category === 'supplements') {
      setAmountGrams(30);
    } else {
      setAmountGrams(100);
    }
  };

  const handleAddSelectedFood = async () => {
    if (!selectedFood) return;
    setIsSubmitting(true);
    playWorkoutSound('tick');

    try {
      await NutritionService.addMealItem(userId, {
        foodId: selectedFood.id,
        name: `${selectedFood.nameFa} (${toPersianDigits(amountGrams)} گرم)`,
        calories: calculatedMacros.calories,
        protein: calculatedMacros.protein,
        carbs: calculatedMacros.carbs,
        fat: calculatedMacros.fat,
        amountGrams,
        mealType,
      });
      onFoodAdded();
      handleClose();
    } catch (e) {
      console.error('Error adding food:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCustomFood = async () => {
    if (!customName.trim()) return;
    setIsSubmitting(true);
    playWorkoutSound('tick');

    try {
      const cals = parseFloat(customCalories) || 0;
      const p = parseFloat(customProtein) || 0;
      const c = parseFloat(customCarbs) || 0;
      const f = parseFloat(customFat) || 0;

      // Save to custom database
      const savedFood = NutritionService.saveCustomFood({
        nameFa: customName.trim(),
        category: 'custom',
        calories: cals,
        protein: p,
        carbs: c,
        fat: f,
        servingSize: 'یک وعده',
      });

      // Add to today's meal
      await NutritionService.addMealItem(userId, {
        foodId: savedFood.id,
        name: customName.trim(),
        calories: cals,
        protein: p,
        carbs: c,
        fat: f,
        amountGrams: 100,
        mealType,
      });

      onFoodAdded();
      handleClose();
    } catch (e) {
      console.error('Error adding custom food:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedFood(null);
    setSearchQuery('');
    setActiveTab('search');
    onClose();
  };

  if (!isOpen) return null;

  const mealLabels = [
    { type: 'breakfast' as const, label: 'صبحانه', icon: '🍳' },
    { type: 'lunch' as const, label: 'ناهار', icon: '🍗' },
    { type: 'snack' as const, label: 'میان‌وعده', icon: '🍎' },
    { type: 'dinner' as const, label: 'شام', icon: '🥗' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-zinc-950/95 border border-white/10 rounded-t-[28px] sm:rounded-[28px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">افزودن غذا به رژیم</h3>
              <p className="text-[11px] text-zinc-400">بانک غذاهای غنی ایرانی و پروتئینی</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Meal Selector Bar */}
        <div className="p-3 bg-white/[0.02] border-b border-white/5">
          <div className="flex items-center justify-between gap-1.5 bg-black/40 p-1 rounded-2xl border border-white/5">
            {mealLabels.map((m) => (
              <button
                key={m.type}
                onClick={() => {
                  playWorkoutSound('tick');
                  setMealType(m.type);
                }}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                  mealType === m.type
                    ? 'bg-violet-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab switch: Search library vs Custom Food */}
        <div className="flex border-b border-white/5 px-4 pt-2 gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('search')}
            className={`pb-2 transition relative cursor-pointer ${
              activeTab === 'search' ? 'text-violet-400 border-b-2 border-violet-500' : 'text-zinc-400'
            }`}
          >
            جستجو در بانک غذاها
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-2 transition relative cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'custom' ? 'text-violet-400 border-b-2 border-violet-500' : 'text-zinc-400'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>ثبت غذای دلخواه</span>
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'search' ? (
            <>
              {/* If a food is selected, show quantity config */}
              {selectedFood ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-violet-400 bg-violet-500/20 px-2 py-0.5 rounded-full">
                          انتخاب شده
                        </span>
                        <h4 className="text-sm font-black text-white mt-1">{selectedFood.nameFa}</h4>
                      </div>
                      <button
                        onClick={() => setSelectedFood(null)}
                        className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
                      >
                        تغییر غذا
                      </button>
                    </div>

                    {/* Weight Input */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-300">مقدار (گرم / حجم):</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="5"
                            max="1500"
                            step="5"
                            value={amountGrams}
                            onChange={(e) => setAmountGrams(Math.max(5, parseInt(e.target.value) || 0))}
                            className="w-20 bg-black/50 border border-white/10 rounded-xl px-2.5 py-1 text-center text-sm font-black text-white font-mono focus:border-violet-500 outline-none"
                          />
                          <span className="text-xs text-zinc-400">گرم</span>
                        </div>
                      </div>

                      {/* Fast preset weight chips */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                        {[30, 50, 100, 150, 200, 250].map((preset) => (
                          <button
                            key={preset}
                            onClick={() => {
                              playWorkoutSound('tick');
                              setAmountGrams(preset);
                            }}
                            className={`py-1 px-2.5 rounded-lg text-[11px] font-bold transition cursor-pointer shrink-0 ${
                              amountGrams === preset
                                ? 'bg-violet-600 text-white'
                                : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                            }`}
                          >
                            <DotMatrixNumber value={preset} unit="g" size="2xs" glow="none" color={amountGrams === preset ? 'white' : 'muted'} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Live Calculated Macros */}
                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/10 text-center">
                      <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                        <span className="text-[10px] text-zinc-400 block">کالری</span>
                        <div className="mt-0.5 flex justify-center">
                          <DotMatrixNumber value={calculatedMacros.calories} size="xs" glow="amber" color="amber" />
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                        <span className="text-[10px] text-zinc-400 block">پروتئین</span>
                        <div className="mt-0.5 flex justify-center">
                          <DotMatrixNumber value={calculatedMacros.protein} unit="g" size="xs" glow="violet" color="violet" />
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                        <span className="text-[10px] text-zinc-400 block">کربوهیدرات</span>
                        <div className="mt-0.5 flex justify-center">
                          <DotMatrixNumber value={calculatedMacros.carbs} unit="g" size="xs" glow="none" color="white" />
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                        <span className="text-[10px] text-zinc-400 block">چربی</span>
                        <div className="mt-0.5 flex justify-center">
                          <DotMatrixNumber value={calculatedMacros.fat} unit="g" size="xs" glow="none" color="white" />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleAddSelectedFood}
                      disabled={isSubmitting}
                      className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(139,92,246,0.3)] transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>افزودن به {mealLabels.find((m) => m.type === mealType)?.label}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="جستجوی غذا (مثلاً فیله، جو دوسر، برنج...)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pr-9 pl-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-violet-500 focus:bg-white/[0.06] outline-none transition"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {FOOD_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          playWorkoutSound('tick');
                          setSelectedCategory(cat.id);
                        }}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                          selectedCategory === cat.id
                            ? 'bg-violet-600 text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                            : 'bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-white border border-white/5'
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.nameFa}</span>
                      </button>
                    ))}
                  </div>

                  {/* Food items list */}
                  <div className="space-y-2">
                    {filteredFoods.length > 0 ? (
                      filteredFoods.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectFood(item)}
                          className="p-3 rounded-2xl bg-white/[0.03] hover:bg-violet-500/10 border border-white/5 hover:border-violet-500/30 transition flex items-center justify-between cursor-pointer group"
                        >
                          <div>
                            <span className="text-xs font-bold text-white group-hover:text-violet-300 transition block">
                              {item.nameFa}
                            </span>
                            <div className="flex items-center gap-3 mt-1 text-[11px] text-zinc-400">
                              <span className="flex items-center gap-1">
                                <span>هر</span>
                                <DotMatrixNumber value="100" unit="گرم:" size="2xs" glow="none" color="muted" />
                              </span>
                              <DotMatrixNumber value={item.calories} unit="kcal" size="2xs" glow="amber" color="amber" />
                              <span className="flex items-center gap-1">
                                <span>• پروتئین:</span>
                                <DotMatrixNumber value={item.protein} unit="g" size="2xs" glow="none" color="muted" />
                              </span>
                            </div>
                          </div>

                          <div className="w-7 h-7 rounded-xl bg-white/5 group-hover:bg-violet-600 flex items-center justify-center text-zinc-400 group-hover:text-white transition">
                            <Plus className="w-4 h-4" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 space-y-2">
                        <Utensils className="w-8 h-8 text-zinc-600 mx-auto" />
                        <p className="text-xs text-zinc-400">موردی با این نام پیدا نشد.</p>
                        <button
                          onClick={() => {
                            setCustomName(searchQuery);
                            setActiveTab('custom');
                          }}
                          className="text-xs font-bold text-violet-400 hover:text-violet-300 underline cursor-pointer"
                        >
                          ثبت دستی این غذا در تب اختصاصی
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            /* Custom Food Form */
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block">نام غذا یا میان‌وعده:</label>
                <input
                  type="text"
                  placeholder="مثلاً سالاد مرغ با سس ماست"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:border-violet-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-amber-400 block">کالری کل (kcal):</label>
                  <input
                    type="number"
                    value={customCalories}
                    onChange={(e) => setCustomCalories(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-3 py-2 text-xs font-mono font-bold text-white focus:border-violet-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-violet-400 block">پروتئین (گرم):</label>
                  <input
                    type="number"
                    value={customProtein}
                    onChange={(e) => setCustomProtein(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-3 py-2 text-xs font-mono font-bold text-white focus:border-violet-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-blue-400 block">کربوهیدرات (گرم):</label>
                  <input
                    type="number"
                    value={customCarbs}
                    onChange={(e) => setCustomCarbs(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-3 py-2 text-xs font-mono font-bold text-white focus:border-violet-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-rose-400 block">چربی (گرم):</label>
                  <input
                    type="number"
                    value={customFat}
                    onChange={(e) => setCustomFat(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-3 py-2 text-xs font-mono font-bold text-white focus:border-violet-500 outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleAddCustomFood}
                disabled={!customName.trim() || isSubmitting}
                className="w-full py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold text-xs shadow-[0_0_15px_rgba(139,92,246,0.3)] transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>ثبت غذا و اضافه به {mealLabels.find((m) => m.type === mealType)?.label}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
