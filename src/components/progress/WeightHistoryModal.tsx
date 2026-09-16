import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Scale, Plus, TrendingDown, TrendingUp, Calendar, Check } from 'lucide-react';
import { BodyMeasurement } from '../../types';
import { DotMatrixNumber } from '../common/DotMatrixNumber';
import { playWorkoutSound } from '../../utils/persian';
import { ProgressRepository } from '../../repositories/AdditionalRepositories';

interface WeightHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  measurements: BodyMeasurement[];
  onMeasurementAdded: (newMeasure: BodyMeasurement) => void;
}

export const WeightHistoryModal: React.FC<WeightHistoryModalProps> = ({
  isOpen,
  onClose,
  userId,
  measurements,
  onMeasurementAdded,
}) => {
  const [newWeight, setNewWeight] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  if (!isOpen) return null;

  // Sort measurements by date descending
  const sorted = [...measurements].sort((a, b) => {
    return (b.date || '').localeCompare(a.date || '');
  });

  const handleAddWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newWeight);
    if (isNaN(val) || val <= 0) return;

    setIsSubmitting(true);
    playWorkoutSound('tick');

    try {
      const todayStr = new Intl.DateTimeFormat('fa-IR').format(new Date());
      const item = await ProgressRepository.saveBodyMeasurement(userId, {
        date: todayStr,
        weight: val,
      });

      onMeasurementAdded(item);
      setNewWeight('');
      setShowAddForm(false);
    } catch (e) {
      console.warn('Failed to save weight:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 font-['Vazirmatn',system-ui,sans-serif]" dir="rtl">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-xl"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-lg max-h-[85vh] bg-[#070b18] border border-violet-500/30 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.95),0_0_35px_rgba(139,92,246,0.18)] flex flex-col overflow-hidden z-10 text-right backdrop-blur-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#0c1024]/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-300">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">تاریخچه تغییرات وزن</h3>
              <p className="text-xs text-zinc-400">سوابق ثبت شده وزن در طول مسیر</p>
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

        {/* Action button to expand Add Form */}
        <div className="p-4 border-b border-white/[0.07] bg-white/[0.01]">
          {!showAddForm ? (
            <button
              type="button"
              onClick={() => {
                playWorkoutSound('tick');
                setShowAddForm(true);
              }}
              className="w-full py-2.5 px-4 rounded-2xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/35 text-violet-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition shadow-[0_0_15px_rgba(139,92,246,0.15)]"
            >
              <Plus className="w-4 h-4" />
              <span>ثبت وزن جدید امروز</span>
            </button>
          ) : (
            <form onSubmit={handleAddWeight} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300">ثبت وزن امروز (کیلوگرم)</span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs text-zinc-400 hover:text-white"
                >
                  انصراف
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="250"
                  placeholder="مثال: 79.5"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  autoFocus
                  required
                  className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono font-bold focus:border-violet-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !newWeight}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-xs font-bold transition cursor-pointer disabled:opacity-40 flex items-center gap-1.5 shrink-0"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'در حال ثبت...' : 'ذخیره'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5">
          {sorted.length === 0 ? (
            <div className="py-12 text-center space-y-3 bg-white/[0.01] rounded-2xl border border-dashed border-white/10">
              <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mx-auto">
                <Scale className="w-5 h-5 opacity-60" />
              </div>
              <p className="text-xs text-zinc-400">هنوز وزنی در تاریخچه ثبت نشده است.</p>
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="py-2 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ثبت وزن اولیه</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {sorted.map((item, idx) => {
                const prev = sorted[idx + 1];
                const diff = prev ? item.weight - prev.weight : 0;
                const isDown = diff < 0;
                const isUp = diff > 0;

                return (
                  <div
                    key={item.id || idx}
                    className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 flex items-center justify-between transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-400">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">{item.date}</span>
                        {prev && (
                          <span className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5">
                            {isDown ? (
                              <TrendingDown className="w-3 h-3 text-emerald-400" />
                            ) : isUp ? (
                              <TrendingUp className="w-3 h-3 text-amber-400" />
                            ) : null}
                            <span>
                              {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)} کیلو نسبت به قبل
                            </span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-left">
                      <DotMatrixNumber
                        value={item.weight.toFixed(1)}
                        unit="kg"
                        size="sm"
                        glow="violet"
                        color="violet"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
