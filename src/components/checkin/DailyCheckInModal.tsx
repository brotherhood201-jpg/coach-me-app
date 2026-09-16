import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import {
  X,
  Sparkles,
  CheckCircle2,
  Calendar,
  Smile,
  Dumbbell,
  Utensils,
  BatteryCharging,
  Star,
  ChevronLeft,
} from 'lucide-react';
import { DailyCheckIn } from '../../types';
import { DailyCheckInService } from '../../services/DailyCheckInService';
import { DotMatrixNumber } from '../common/DotMatrixNumber';
import { playWorkoutSound } from '../../utils/persian';

interface DailyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onCheckInSaved?: (checkIn: DailyCheckIn) => void;
  waterAchieved?: boolean;
  workoutDone?: boolean;
  existingCheckIn?: DailyCheckIn | null;
}

export const DailyCheckInModal: React.FC<DailyCheckInModalProps> = ({
  isOpen,
  onClose,
  userId,
  onCheckInSaved,
  waterAchieved = false,
  workoutDone = true,
  existingCheckIn,
}) => {
  const [dietAdherence, setDietAdherence] = useState<'very_low' | 'medium' | 'good' | 'great'>(
    existingCheckIn?.dietAdherence || 'good'
  );
  const [workoutFeeling, setWorkoutFeeling] = useState<'hard' | 'good' | 'great' | 'very_easy' | 'rest_day'>(
    existingCheckIn?.workoutFeeling || 'good'
  );
  const [energy, setEnergy] = useState<'low' | 'normal' | 'good' | 'super'>(
    existingCheckIn?.energy || 'good'
  );
  const [notes, setNotes] = useState<string>(existingCheckIn?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedResult, setSavedResult] = useState<DailyCheckIn | null>(existingCheckIn || null);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSubmitting(true);
    playWorkoutSound('tick');

    try {
      const result = await DailyCheckInService.saveDailyCheckIn(userId, {
        dietAdherence,
        workoutFeeling,
        energy,
        notes,
        waterAchieved,
        workoutDone,
      });

      setSavedResult(result);
      if (onCheckInSaved) onCheckInSaved(result);
    } catch (e) {
      console.error('Error saving checkin:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const dietOptions = [
    { value: 'very_low' as const, label: 'خیلی کم', icon: '🥀', desc: 'دور از برنامه' },
    { value: 'medium' as const, label: 'متوسط', icon: '⚖️', desc: 'نصف‌ونیمه' },
    { value: 'good' as const, label: 'خوب', icon: '🥗', desc: 'پایبند و عالی' },
    { value: 'great' as const, label: 'عالی', icon: '🎯', desc: '۱۰۰٪ دقیق' },
  ];

  const workoutOptions = [
    { value: 'great' as const, label: 'عالی و پرانرژی', icon: '💪' },
    { value: 'good' as const, label: 'خوب بود', icon: '👍' },
    { value: 'hard' as const, label: 'سخت و سنگین', icon: '💥' },
    { value: 'very_easy' as const, label: 'خیلی راحت', icon: '🧘‍♂️' },
    { value: 'rest_day' as const, label: 'روز استراحت', icon: '🛋️' },
  ];

  const energyOptions = [
    { value: 'low' as const, label: 'کم و خسته', icon: '😴' },
    { value: 'normal' as const, label: 'معمولی', icon: '😐' },
    { value: 'good' as const, label: 'خوب و سرحال', icon: '🙂' },
    { value: 'super' as const, label: 'عالی و پرتوان', icon: '🔥' },
  ];

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
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">امروز چطور گذشت؟</h3>
              <p className="text-[11px] text-zinc-400">یه دقیقه وقت بذار و وضعیت امروزت رو ثبت کن.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {savedResult ? (
            /* Result Screen after check-in */
            <div className="text-center py-4 space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-3xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 mx-auto shadow-[0_0_25px_rgba(139,92,246,0.3)]">
                <Star className="w-8 h-8 fill-violet-400 text-violet-300" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-zinc-400">نمره عملکرد روزانه شما</span>
                <div className="flex items-baseline justify-center gap-1.5 pt-1">
                  <DotMatrixNumber value={savedResult.dailyScore} size="xl" glow="violet" color="violet" />
                  <span className="text-zinc-500 font-bold">/</span>
                  <DotMatrixNumber value="10" size="sm" glow="none" color="muted" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/25 max-w-sm mx-auto">
                <p className="text-xs text-violet-200 leading-relaxed font-bold">
                  {savedResult.feedbackMessage}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 max-w-sm mx-auto text-center text-xs">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-zinc-400 block">پایبندی رژیم</span>
                  <span className="font-bold text-white mt-0.5 block">
                    {dietOptions.find((d) => d.value === savedResult.dietAdherence)?.label}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-zinc-400 block">تمرین</span>
                  <span className="font-bold text-white mt-0.5 block">
                    {workoutOptions.find((w) => w.value === savedResult.workoutFeeling)?.label}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-zinc-400 block">انرژی</span>
                  <span className="font-bold text-white mt-0.5 block">
                    {energyOptions.find((e) => e.value === savedResult.energy)?.label}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-black text-xs shadow-[0_0_15px_rgba(139,92,246,0.3)] transition cursor-pointer"
              >
                تأیید و بازگشت
              </button>
            </div>
          ) : (
            <>
              {/* Question 1: Diet Adherence */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Utensils className="w-4 h-4 text-violet-400" />
                  <span>امروز چقدر به رژیمت پایبند بودی؟</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {dietOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        playWorkoutSound('tick');
                        setDietAdherence(opt.value);
                      }}
                      className={`p-2.5 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                        dietAdherence === opt.value
                          ? 'bg-violet-600/25 border-violet-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                          : 'bg-white/[0.03] border-white/5 text-zinc-400 hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      <span className="text-xl">{opt.icon}</span>
                      <span className="text-xs font-bold">{opt.label}</span>
                      <div className="text-[9px] text-zinc-400">
                        <DotMatrixNumber value={opt.desc} size="2xs" glow="none" color="muted" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Workout Feeling */}
              <div className="space-y-2.5 pt-2 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Dumbbell className="w-4 h-4 text-violet-400" />
                  <span>تمرین امروزت چطور بود؟</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {workoutOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        playWorkoutSound('tick');
                        setWorkoutFeeling(opt.value);
                      }}
                      className={`py-2 px-3 rounded-2xl border text-center transition cursor-pointer flex items-center justify-center gap-2 ${
                        workoutFeeling === opt.value
                          ? 'bg-violet-600/25 border-violet-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                          : 'bg-white/[0.03] border-white/5 text-zinc-400 hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      <span>{opt.icon}</span>
                      <span className="text-xs font-bold">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Energy / Mood */}
              <div className="space-y-2.5 pt-2 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <BatteryCharging className="w-4 h-4 text-violet-400" />
                  <span>امروز سطح انرژیت چطور بود؟</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {energyOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        playWorkoutSound('tick');
                        setEnergy(opt.value);
                      }}
                      className={`p-2.5 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                        energy === opt.value
                          ? 'bg-violet-600/25 border-violet-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                          : 'bg-white/[0.03] border-white/5 text-zinc-400 hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      <span className="text-xl">{opt.icon}</span>
                      <span className="text-xs font-bold">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Notes */}
              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <label className="text-xs font-bold text-zinc-400 block">یادداشت دلخواه امروز (اختیاری):</label>
                <input
                  type="text"
                  placeholder="مثلاً حس خوبی بعد از تمرین داشتم، خواب دیشبم عالی بود..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-violet-500 outline-none"
                />
              </div>

              {/* Save CTA */}
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-black text-xs shadow-[0_0_15px_rgba(139,92,246,0.3)] transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>محاسبه نمره و ثبت گزارش امروز</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
