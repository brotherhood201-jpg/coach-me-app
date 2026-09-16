import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import {
  X,
  Bell,
  Droplets,
  Utensils,
  Moon,
  Dumbbell,
  Clock,
  Check,
  Sparkles,
  Send,
} from 'lucide-react';
import { NotificationPreferences } from '../../types';
import { NotificationService } from '../../services/NotificationService';
import { playWorkoutSound, toPersianDigits } from '../../utils/persian';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  initialPreferences?: NotificationPreferences;
  onSaved?: (prefs: NotificationPreferences) => void;
  waterGlasses?: number;
  targetWaterGlasses?: number;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  userId,
  initialPreferences,
  onSaved,
  waterGlasses = 5,
  targetWaterGlasses = 8,
}) => {
  const [prefs, setPrefs] = useState<NotificationPreferences>(() => {
    return (
      initialPreferences || {
        waterReminder: true,
        waterStartTime: '08:00',
        waterEndTime: '22:00',
        waterIntervalHours: 2,
        dietReminders: true,
        breakfastReminderTime: '08:30',
        snackReminderTime: '16:30',
        dinnerReminderTime: '20:30',
        sleepReminder: true,
        sleepReminderTime: '23:00',
        workoutReminder: true,
        workoutReminderTime: '17:00',
        checkInReminder: true,
        checkInReminderTime: '21:30',
      }
    );
  });

  const [testSent, setTestSent] = useState(false);

  if (!isOpen) return null;

  const toggle = (key: keyof NotificationPreferences) => {
    playWorkoutSound('tick');
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    playWorkoutSound('tick');
    try {
      localStorage.setItem(`polad_notif_prefs_${userId}`, JSON.stringify(prefs));
    } catch {
      // ignore
    }
    if (onSaved) onSaved(prefs);
    onClose();
  };

  const sendTestNotification = async (type: 'water' | 'afternoon_snack' | 'sleep' | 'checkin') => {
    playWorkoutSound('tick');
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);

    if (type === 'water') {
      await NotificationService.notifyWaterReminder(userId, waterGlasses, targetWaterGlasses);
    } else if (type === 'afternoon_snack') {
      await NotificationService.notifyDietReminder(userId, 'afternoon');
    } else if (type === 'sleep') {
      await NotificationService.notifySleepReminder(userId);
    } else if (type === 'checkin') {
      await NotificationService.notifyCheckInReminder(userId);
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
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">تنظیمات یادآورها و اعلان‌ها</h3>
              <p className="text-[11px] text-zinc-400">یادآورهای صمیمی و انگیزشی بدون سرزنش یا اضطراب</p>
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Tone banner */}
          <div className="p-3.5 rounded-2xl bg-violet-500/10 border border-violet-500/25 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
            <p className="text-[11px] text-violet-200/90 leading-relaxed">
              کوچ من شما را هرگز سرزنش نمی‌کند. یادآورها صمیمی، انسانی و صرفاً برای کمک به جریان روزمرگی شما هستند.
            </p>
          </div>

          {/* 1. Water Reminder */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">یادآور نوشیدن آب</span>
                  <span className="text-[10px] text-zinc-400">«وقتشه یه لیوان آب بخوری؛ یه جرعه هم عالیه 😉»</span>
                </div>
              </div>

              <button
                onClick={() => toggle('waterReminder')}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  prefs.waterReminder ? 'bg-violet-600' : 'bg-white/10'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    prefs.waterReminder ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {prefs.waterReminder && (
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-zinc-300">
                <span>فاصله تکرار:</span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3].map((hours) => (
                    <button
                      key={hours}
                      onClick={() => {
                        playWorkoutSound('tick');
                        setPrefs({ ...prefs, waterIntervalHours: hours });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                        prefs.waterIntervalHours === hours
                          ? 'bg-violet-600 text-white'
                          : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                      }`}
                    >
                      هر {toPersianDigits(hours)} ساعت
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Diet & Meals Reminders */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">یادآور هوشمند وعده‌ها و تغذیه</span>
                  <span className="text-[10px] text-zinc-400">صبحانه، هوس شیرینی عصرگاهی و شام هوشمند</span>
                </div>
              </div>

              <button
                onClick={() => toggle('dietReminders')}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  prefs.dietReminders ? 'bg-violet-600' : 'bg-white/10'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    prefs.dietReminders ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {prefs.dietReminders && (
              <div className="space-y-1.5 pt-2 border-t border-white/5 text-[11px] text-zinc-400">
                <div className="flex justify-between items-center py-1">
                  <span>🍳 صبحانه پرانرژی:</span>
                  <span className="font-mono text-zinc-300">ساعت ۰۸:۳۰</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>🍫 عصرانه و کنترل هوس قند:</span>
                  <span className="font-mono text-zinc-300">ساعت ۱۶:۳۰</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>🥗 شام متعادل و سبک:</span>
                  <span className="font-mono text-zinc-300">ساعت ۲۰:۳۰</span>
                </div>
              </div>
            )}
          </div>

          {/* 3. Sleep Reminder */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">یادآور خواب و ریکاوری شبانه</span>
                  <span className="text-[10px] text-zinc-400">«کم‌کم وقت خوابه؛ فردای قوی از امشب شروع میشه»</span>
                </div>
              </div>

              <button
                onClick={() => toggle('sleepReminder')}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  prefs.sleepReminder ? 'bg-violet-600' : 'bg-white/10'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    prefs.sleepReminder ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {prefs.sleepReminder && (
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-zinc-300">
                <span>زمان یادآوری:</span>
                <span className="font-mono text-violet-400 font-bold">۲۳:۰۰ (ساعت ۱۱ شب)</span>
              </div>
            )}
          </div>

          {/* 4. Daily Check-in Reminder */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">یادآور چک‌این روزانه</span>
                  <span className="text-[10px] text-zinc-400">«امروز چطور گذشت؟ یه دقیقه وقت بذار و ثبت کن»</span>
                </div>
              </div>

              <button
                onClick={() => toggle('checkInReminder')}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  prefs.checkInReminder ? 'bg-violet-600' : 'bg-white/10'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    prefs.checkInReminder ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {prefs.checkInReminder && (
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-zinc-300">
                <span>زمان یادآوری:</span>
                <span className="font-mono text-emerald-400 font-bold">۲۱:۳۰ (ساعت ۹:۳۰ شب)</span>
              </div>
            )}
          </div>

          {/* Interactive Test Trigger Area */}
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <span className="text-[10px] font-bold text-zinc-400 block">تست ارسال اعلان فوری درون برنامه:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => sendTestNotification('water')}
                className="py-1.5 px-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1 border border-blue-500/20"
              >
                <Droplets className="w-3 h-3" />
                <span>تست یادآور آب</span>
              </button>
              <button
                onClick={() => sendTestNotification('afternoon_snack')}
                className="py-1.5 px-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1 border border-amber-500/20"
              >
                <Utensils className="w-3 h-3" />
                <span>تست یادآور عصرانه</span>
              </button>
              <button
                onClick={() => sendTestNotification('sleep')}
                className="py-1.5 px-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1 border border-indigo-500/20"
              >
                <Moon className="w-3 h-3" />
                <span>تست یادآور خواب</span>
              </button>
              <button
                onClick={() => sendTestNotification('checkin')}
                className="py-1.5 px-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1 border border-emerald-500/20"
              >
                <Clock className="w-3 h-3" />
                <span>تست یادآور چک‌این</span>
              </button>
            </div>
            {testSent && (
              <p className="text-[10px] text-emerald-400 text-center font-bold animate-in fade-in">
                اعلان آزمایشی به صندوق پیام‌های شما ارسال شد!
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-zinc-950/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs font-bold transition cursor-pointer"
          >
            بستن
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-black shadow-[0_0_15px_rgba(139,92,246,0.3)] transition cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>ذخیره تنظیمات</span>
          </button>
        </div>
      </div>
    </div>
  );
};
