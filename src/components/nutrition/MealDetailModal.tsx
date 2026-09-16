import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Clock, Flame, ChevronLeft } from 'lucide-react';
import { MealItem } from '../../types';
import { DotMatrixNumber } from '../common/DotMatrixNumber';
import { playWorkoutSound } from '../../utils/persian';

interface MealDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  mealTitle: string;
  mealIcon: React.ReactNode;
  mealTime: string;
  items: MealItem[];
  onOpenAddFood: () => void;
  onDeleteItem: (itemId: string) => void;
}

export const MealDetailModal: React.FC<MealDetailModalProps> = ({
  isOpen,
  onClose,
  mealTitle,
  mealIcon,
  mealTime,
  items,
  onOpenAddFood,
  onDeleteItem,
}) => {
  if (!isOpen) return null;

  const totalCalories = items.reduce((sum, item) => sum + (item.calories || 0), 0);
  const totalProtein = items.reduce((sum, item) => sum + (item.protein || 0), 0);
  const totalCarbs = items.reduce((sum, item) => sum + (item.carbs || 0), 0);
  const totalFat = items.reduce((sum, item) => sum + (item.fat || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 font-['Vazirmatn',system-ui,sans-serif]" dir="rtl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-lg max-h-[85vh] bg-[#0c0919] border border-violet-500/25 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.95),0_0_35px_rgba(139,92,246,0.15)] flex flex-col overflow-hidden z-10 text-right backdrop-blur-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#120e24]/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-300">
              {mealIcon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">{mealTitle}</h3>
                <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-zinc-500" />
                  <span>{mealTime}</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <DotMatrixNumber value={totalCalories} unit="kcal" size="xs" glow="amber" color="amber" />
                <span className="text-zinc-600">•</span>
                <span className="text-[11px] text-zinc-400">
                  <DotMatrixNumber value={items.length} unit="قلم غذا" size="2xs" glow="none" color="muted" />
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.05] text-zinc-400 hover:text-white transition cursor-pointer border border-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Macros Summary of this meal */}
        <div className="px-5 pt-4">
          <div className="grid grid-cols-3 divide-x divide-x-reverse divide-white/[0.08] rounded-2xl bg-white/[0.03] border border-white/[0.07] p-2.5">
            <div className="text-center px-1">
              <span className="text-[10px] text-zinc-400 block">پروتئین</span>
              <DotMatrixNumber value={Math.round(totalProtein)} unit="g" size="xs" glow="violet" color="violet" />
            </div>
            <div className="text-center px-1">
              <span className="text-[10px] text-zinc-400 block">کربوهیدرات</span>
              <DotMatrixNumber value={Math.round(totalCarbs)} unit="g" size="xs" glow="cyan" color="cyan" />
            </div>
            <div className="text-center px-1">
              <span className="text-[10px] text-zinc-400 block">چربی</span>
              <DotMatrixNumber value={Math.round(totalFat)} unit="g" size="xs" glow="rose" color="rose" />
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">اقلام ثبت شده</span>
            <button
              type="button"
              onClick={() => {
                playWorkoutSound('tick');
                onOpenAddFood();
              }}
              className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>افزودن غذای جدید</span>
            </button>
          </div>

          {items.length === 0 ? (
            <div className="py-10 text-center space-y-3 bg-white/[0.01] rounded-2xl border border-dashed border-white/10">
              <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mx-auto">
                <Flame className="w-5 h-5 opacity-60" />
              </div>
              <p className="text-xs text-zinc-400">هنوز غذایی در این وعده ثبت نشده است.</p>
              <button
                type="button"
                onClick={() => {
                  playWorkoutSound('tick');
                  onOpenAddFood();
                }}
                className="py-2 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ثبت اولین غذا</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/5 flex items-center justify-between transition group"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">{item.name}</h4>
                      {item.portion && (
                        <span className="text-[10px] text-zinc-500 font-normal">({item.portion})</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                      <DotMatrixNumber value={item.calories} unit="kcal" size="2xs" glow="amber" color="amber" />
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <span>پ:</span>
                        <DotMatrixNumber value={item.protein} unit="g" size="2xs" glow="none" color="white" />
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <span>ک:</span>
                        <DotMatrixNumber value={item.carbs} unit="g" size="2xs" glow="none" color="white" />
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <span>چ:</span>
                        <DotMatrixNumber value={item.fat} unit="g" size="2xs" glow="none" color="white" />
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playWorkoutSound('tick');
                      onDeleteItem(item.id);
                    }}
                    className="w-8 h-8 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center transition cursor-pointer shrink-0"
                    title="حذف این مورد"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-white/10 bg-[#120e24]/80">
          <button
            type="button"
            onClick={() => {
              playWorkoutSound('tick');
              onOpenAddFood();
            }}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-[0_8px_25px_rgba(139,92,246,0.35)] hover:shadow-[0_10px_30px_rgba(139,92,246,0.5)] transition"
          >
            <Plus className="w-4 h-4" />
            <span>افزودن غذا به {mealTitle}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
