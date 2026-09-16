import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Ruler, Plus, Calendar, Check, TrendingDown, TrendingUp } from 'lucide-react';
import { BodyMeasurement } from '../../types';
import { DotMatrixNumber } from '../common/DotMatrixNumber';
import { playWorkoutSound } from '../../utils/persian';
import { ProgressRepository } from '../../repositories/AdditionalRepositories';

interface BodyMeasurementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  measurements: BodyMeasurement[];
  onMeasurementAdded: (newMeasure: BodyMeasurement) => void;
}

export const BodyMeasurementsModal: React.FC<BodyMeasurementsModalProps> = ({
  isOpen,
  onClose,
  userId,
  measurements,
  onMeasurementAdded,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [waist, setWaist] = useState('');
  const [arm, setArm] = useState('');
  const [thigh, setThigh] = useState('');
  const [chest, setChest] = useState('');
  const [weight, setWeight] = useState('');

  if (!isOpen) return null;

  // Latest measurement
  const latest = measurements[0] || {
    waist: 81.0,
    arm: 39.5,
    thigh: 62.0,
    chest: 108.0,
    weight: 79.5,
    date: '۱۴۰۳/۰۶/۱۰',
  };

  const allMetrics = [
    { key: 'waist', label: 'دور کمر', val: latest.waist, unit: 'cm', change: '-2.0 cm' },
    { key: 'arm', label: 'دور بازو', val: latest.arm, unit: 'cm', change: '+1.8 cm' },
    { key: 'thigh', label: 'دور ران', val: latest.thigh, unit: 'cm', change: '+2.2 cm' },
    { key: 'chest', label: 'دور سینه', val: latest.chest, unit: 'cm', change: '+3.5 cm' },
    { key: 'weight', label: 'وزن بدن', val: latest.weight, unit: 'kg', change: '-4.2 kg' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waist && !arm && !thigh && !chest && !weight) return;

    setIsSubmitting(true);
    playWorkoutSound('tick');

    try {
      const todayStr = new Intl.DateTimeFormat('fa-IR').format(new Date());
      const item = await ProgressRepository.saveBodyMeasurement(userId, {
        date: todayStr,
        weight: weight ? parseFloat(weight) : latest.weight || 79.5,
        waist: waist ? parseFloat(waist) : undefined,
        arm: arm ? parseFloat(arm) : undefined,
        thigh: thigh ? parseFloat(thigh) : undefined,
        chest: chest ? parseFloat(chest) : undefined,
      });

      onMeasurementAdded(item);
      setWaist('');
      setArm('');
      setThigh('');
      setChest('');
      setWeight('');
      setShowAddForm(false);
    } catch (e) {
      console.warn('Failed to save measurements:', e);
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

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-lg max-h-[88vh] bg-[#070b18] border border-violet-500/30 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.95),0_0_35px_rgba(139,92,246,0.18)] flex flex-col overflow-hidden z-10 text-right backdrop-blur-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#0c1024]/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">تمام اندازه‌های بدن</h3>
              <p className="text-xs text-zinc-400">سوابق ابعاد عضلانی و تغییرات سایز</p>
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Action button / Toggle Form */}
          {!showAddForm ? (
            <button
              type="button"
              onClick={() => {
                playWorkoutSound('tick');
                setShowAddForm(true);
              }}
              className="w-full py-2.5 px-4 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/35 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition shadow-[0_0_15px_rgba(6,182,212,0.15)]"
            >
              <Plus className="w-4 h-4" />
              <span>ثبت اندازه‌گیری جدید سایزها</span>
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-white/[0.03] border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">ثبت سایزهای جدید (سانتی‌متر)</span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs text-zinc-400 hover:text-white"
                >
                  انصراف
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">دور کمر (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="مثال: 81"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">دور بازو (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="مثال: 39.5"
                    value={arm}
                    onChange={(e) => setArm(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">دور ران (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="مثال: 62"
                    value={thigh}
                    onChange={(e) => setThigh(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">دور سینه (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="مثال: 108"
                    value={chest}
                    onChange={(e) => setChest(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">وزن (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="مثال: 79.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'در حال ثبت...' : 'ذخیره اندازه‌ها'}</span>
              </button>
            </form>
          )}

          {/* Current Measurements Grid */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-zinc-400 block">آخرین وضعیت ثبت شده ({latest.date})</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {allMetrics.map((m) => (
                <div
                  key={m.key}
                  className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-white block">{m.label}</span>
                    <span className="text-[10px] text-emerald-400 font-medium block mt-0.5">
                      {m.change}
                    </span>
                  </div>
                  <DotMatrixNumber
                    value={m.val !== undefined ? String(m.val) : '-'}
                    unit={m.unit}
                    size="sm"
                    glow="cyan"
                    color="cyan"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
