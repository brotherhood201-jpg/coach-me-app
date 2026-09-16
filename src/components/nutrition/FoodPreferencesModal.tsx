import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import {
  X,
  Heart,
  Ban,
  AlertTriangle,
  ShieldAlert,
  Check,
  Plus,
  Sparkles,
} from 'lucide-react';
import { FoodPreferences } from '../../types';
import { NutritionService } from '../../services/NutritionService';
import { playWorkoutSound } from '../../utils/persian';

interface FoodPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  initialPreferences?: FoodPreferences;
  onSaved?: (prefs: FoodPreferences) => void;
}

const COMMON_ALLERGIES = [
  'بادام‌زمینی و مغزها',
  'گلوتن (گندم/جو)',
  'لاکتوز و لبنیات گاوی',
  'تخم‌مرغ',
  'ماهی و غذاهای دریایی',
  'سویا',
  'کنجد',
];

const COMMON_RESTRICTIONS = [
  'گیاه‌خواری (Vegetarian)',
  'وگان (Vegan)',
  'بدون گلوتن (Gluten-Free)',
  'عدم تحمل لاکتوز',
  'کتوژنیک',
  'کم‌سدیم (فشار خون)',
  'دیابتیک (بدون قند ساده)',
];

export const FoodPreferencesModal: React.FC<FoodPreferencesModalProps> = ({
  isOpen,
  onClose,
  userId,
  initialPreferences,
  onSaved,
}) => {
  const current = initialPreferences || NutritionService.getFoodPreferences(userId);

  const [favoriteFoods, setFavoriteFoods] = useState<string[]>(current.favoriteFoods || []);
  const [dislikedFoods, setDislikedFoods] = useState<string[]>(current.dislikedFoods || []);
  const [allergies, setAllergies] = useState<string[]>(current.allergies || []);
  const [restrictions, setRestrictions] = useState<string[]>(current.restrictions || []);

  const [favInput, setFavInput] = useState('');
  const [dislikeInput, setDislikeInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleAddFavorite = () => {
    if (!favInput.trim()) return;
    if (!favoriteFoods.includes(favInput.trim())) {
      setFavoriteFoods([...favoriteFoods, favInput.trim()]);
    }
    setFavInput('');
  };

  const handleRemoveFavorite = (food: string) => {
    setFavoriteFoods(favoriteFoods.filter((f) => f !== food));
  };

  const handleAddDislike = () => {
    if (!dislikeInput.trim()) return;
    if (!dislikedFoods.includes(dislikeInput.trim())) {
      setDislikedFoods([...dislikedFoods, dislikeInput.trim()]);
    }
    setDislikeInput('');
  };

  const handleRemoveDislike = (food: string) => {
    setDislikedFoods(dislikedFoods.filter((f) => f !== food));
  };

  const toggleAllergy = (allergy: string) => {
    playWorkoutSound('tick');
    if (allergies.includes(allergy)) {
      setAllergies(allergies.filter((a) => a !== allergy));
    } else {
      setAllergies([...allergies, allergy]);
    }
  };

  const toggleRestriction = (restriction: string) => {
    playWorkoutSound('tick');
    if (restrictions.includes(restriction)) {
      setRestrictions(restrictions.filter((r) => r !== restriction));
    } else {
      setRestrictions([...restrictions, restriction]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    playWorkoutSound('tick');

    const updatedPrefs: FoodPreferences = {
      favoriteFoods,
      dislikedFoods,
      allergies,
      restrictions,
      allergyNoticeAcknowledged: true,
    };

    try {
      await NutritionService.saveFoodPreferences(userId, updatedPrefs);
      if (onSaved) onSaved(updatedPrefs);
      onClose();
    } catch (e) {
      console.error('Error saving food preferences:', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-zinc-950/95 border border-white/10 rounded-t-[28px] sm:rounded-[28px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        dir="rtl"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">ترجیحات غذایی من</h3>
              <p className="text-[11px] text-zinc-400">سفارشی‌سازی علایق، بیزاری‌ها و حساسیت‌ها</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* Medical & Safety Disclaimer */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-200/90 leading-relaxed">
              <strong>توجه ایمنی و سلامت:</strong> کوچ من هیچ‌گونه ادعا یا تشخیص پزشکی و درمانی ارائه نمی‌کند. در صورت ابتلا به حساسیت‌های آنافیلاکسی یا شرایط بالینی خاص، حتماً دستورات پزشک معالج خود را مبنای عمل قرار دهید.
            </p>
          </div>

          {/* 1. Favorite Foods */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>غذاهای مورد علاقه من</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="افزودن غذای مورد علاقه (مثلاً سینه مرغ، خرما)..."
                value={favInput}
                onChange={(e) => setFavInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddFavorite()}
                className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-violet-500"
              />
              <button
                onClick={handleAddFavorite}
                className="p-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {favoriteFoods.map((f) => (
                <span
                  key={f}
                  className="px-2.5 py-1 rounded-xl bg-violet-500/15 border border-violet-500/30 text-xs font-medium text-violet-200 flex items-center gap-1.5"
                >
                  <span>{f}</span>
                  <button onClick={() => handleRemoveFavorite(f)} className="hover:text-rose-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 2. Disliked Foods */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Ban className="w-3.5 h-3.5 text-zinc-400" />
              <span>غذاهایی که دوست ندارم (حذف از پیشنهادات)</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="افزودن غذایی که ترجیح نمی‌دهید..."
                value={dislikeInput}
                onChange={(e) => setDislikeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddDislike()}
                className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-violet-500"
              />
              <button
                onClick={handleAddDislike}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {dislikedFoods.map((f) => (
                <span
                  key={f}
                  className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 flex items-center gap-1.5"
                >
                  <span>{f}</span>
                  <button onClick={() => handleRemoveDislike(f)} className="hover:text-rose-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 3. Allergies */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>حساسیت‌ها و آلرژی‌های غذایی</span>
            </div>
            <p className="text-[11px] text-zinc-400">گزینه‌هایی که به آن حساسیت دارید را فعال کنید:</p>

            <div className="flex flex-wrap gap-1.5">
              {COMMON_ALLERGIES.map((allergy) => {
                const isSelected = allergies.includes(allergy);
                return (
                  <button
                    key={allergy}
                    onClick={() => toggleAllergy(allergy)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                        : 'bg-white/[0.03] border-white/5 text-zinc-400 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{allergy}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Dietary Restrictions */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>محدودیت‌ها و الگوهای رژیمی</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {COMMON_RESTRICTIONS.map((restriction) => {
                const isSelected = restrictions.includes(restriction);
                return (
                  <button
                    key={restriction}
                    onClick={() => toggleRestriction(restriction)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-violet-600 border-violet-500 text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                        : 'bg-white/[0.03] border-white/5 text-zinc-400 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{restriction}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-zinc-950/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs font-bold transition cursor-pointer"
          >
            انصراف
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-black shadow-[0_0_15px_rgba(139,92,246,0.3)] transition cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>ذخیره ترجیحات</span>
          </button>
        </div>
      </div>
    </div>
  );
};
