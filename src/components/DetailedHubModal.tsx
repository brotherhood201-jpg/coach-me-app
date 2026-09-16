import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  TrendingUp,
  Scale,
  Camera,
  Apple,
  Award,
  Bell,
  BookOpen,
  Sparkles,
  Plus,
  Flame,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { DotMatrixNumber } from './common/DotMatrixNumber';
import {
  ProgressRepository,
  NutritionRepository,
  NotificationRepository,
  AchievementRepository,
  ContentRepository,
} from '../repositories/AdditionalRepositories';
import { AIService } from '../services/AIService';
import { BodyMeasurement, ProgressPhoto, NutritionLog, NotificationItem, AchievementItem, ArticleItem } from '../types';

interface DetailedHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  defaultTab?: 'progress' | 'nutrition' | 'achievements' | 'ai' | 'notifications';
}

export const DetailedHubModal: React.FC<DetailedHubModalProps> = ({
  isOpen,
  onClose,
  userId = 'guest',
  defaultTab = 'progress',
}) => {
  const [activeTab, setActiveTab] = useState<'progress' | 'nutrition' | 'achievements' | 'ai' | 'notifications'>(defaultTab);

  // Data states
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [newWeight, setNewWeight] = useState('');
  const [newWaist, setNewWaist] = useState('');
  const [newArm, setNewArm] = useState('');
  const [nutrition, setNutrition] = useState<NutritionLog>({
    id: '1',
    userId,
    date: 'امروز',
    calories: 2450,
    protein: 165,
    carbs: 280,
    fat: 65,
    water: 3.2,
  });
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    if (isOpen) {
      ProgressRepository.getBodyMeasurements(userId).then((res) => {
        if (res.length > 0) setMeasurements(res);
        else {
          setMeasurements([
            { id: '1', userId, date: '۱۴۰۳/۰۶/۱۰', weight: 79.2, arm: 38.5, waist: 82 },
            { id: '2', userId, date: '۱۴۰۳/۰۶/۰۳', weight: 79.8, arm: 38.2, waist: 83 },
            { id: '3', userId, date: '۱۴۰۳/۰۵/۲۶', weight: 80.5, arm: 38.0, waist: 84 },
          ]);
        }
      });

      AchievementRepository.getUserAchievements(userId).then(setAchievements);
      NotificationRepository.getNotifications(userId).then(setNotifications);
      ContentRepository.getArticles().then(setArticles);
    }
  }, [isOpen, userId]);

  const handleAddMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;
    const w = parseFloat(newWeight);
    const armVal = newArm ? parseFloat(newArm) : undefined;
    const waistVal = newWaist ? parseFloat(newWaist) : undefined;

    const item = await ProgressRepository.saveBodyMeasurement(userId, {
      date: new Intl.DateTimeFormat('fa-IR').format(new Date()),
      weight: w,
      arm: armVal,
      waist: waistVal,
    });

    setMeasurements([item, ...measurements]);
    setNewWeight('');
    setNewWaist('');
    setNewArm('');
  };

  const handleRunAiAnalysis = async () => {
    setLoadingAi(true);
    try {
      const res = await AIService.analyzeProgress(userId);
      setAiAnalysis(res.adviceFa);
    } finally {
      setLoadingAi(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-[#0c0819]/90 border border-violet-500/20 rounded-[36px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.95),0_0_40px_rgba(139,92,246,0.15)] flex flex-col overflow-hidden z-10 text-right backdrop-blur-3xl"
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#120c24]/80 sticky top-0 z-10 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.25)]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">مرکز پایش و پیشرفت جامع</h3>
                <p className="text-xs text-zinc-400">سوابق ابری، تغذیه، رکوردها و تحلیل هوشمند</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-white/[0.05] text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 p-3 px-6 border-b border-white/5 bg-white/[0.01] overflow-x-auto">
            {[
              { id: 'progress', label: 'روند و ابعاد بدن', icon: Scale },
              { id: 'nutrition', label: 'تغذیه و کالری', icon: Apple },
              { id: 'achievements', label: 'افتخارات و مدال‌ها', icon: Award },
              { id: 'notifications', label: 'اعلان‌ها', icon: Bell },
              { id: 'ai', label: 'مشاور هوش مصنوعی', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-[0_4px_20px_rgba(139,92,246,0.4)]'
                      : 'bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.06] border border-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Contents */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* 1. Progress & Body Measurements Tab */}
            {activeTab === 'progress' && (
              <div className="space-y-6">
                <div className="rounded-3xl bg-black/30 border border-white/5 p-5">
                  <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-violet-400" />
                    <span>ثبت ابعاد و وزن جدید در پایگاه داده</span>
                  </h4>
                  <form onSubmit={handleAddMeasurement} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <input
                      type="number"
                      step="0.1"
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                      placeholder="وزن (کیلوگرم) *"
                      required
                      className="bg-black/40 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30"
                    />
                    <input
                      type="number"
                      step="0.5"
                      value={newArm}
                      onChange={(e) => setNewArm(e.target.value)}
                      placeholder="دور بازو (cm)"
                      className="bg-black/40 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30"
                    />
                    <input
                      type="number"
                      step="0.5"
                      value={newWaist}
                      onChange={(e) => setNewWaist(e.target.value)}
                      placeholder="دور کمر (cm)"
                      className="bg-black/40 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30"
                    />
                    <button
                      type="submit"
                      className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-violet-500/30 transition-all cursor-pointer"
                    >
                      ذخیره ابری
                    </button>
                  </form>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-zinc-300">سوابق تغییرات فیزیکی</h4>
                  <div className="space-y-2">
                    {(measurements || []).map((m, idx) => {
                      if (!m) return null;
                      return (
                        <div
                          key={m.id || idx}
                          className="rounded-2xl bg-black/30 border border-white/5 p-4 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 text-xs font-bold font-mono shadow-[0_0_10px_rgba(139,92,246,0.15)]">
                              ⚖️
                            </div>
                            <div>
                              <div className="text-sm font-bold text-white">
                                <DotMatrixNumber value={m.weight ?? 0} unit="کیلوگرم" size="sm" glow="none" color="white" />
                              </div>
                              <span className="text-[11px] text-zinc-500 block mt-0.5">{m.date}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-zinc-400">
                            {m.arm && (
                              <div className="flex items-center gap-1">
                                <span>بازو:</span>
                                <DotMatrixNumber value={m.arm} unit="cm" size="2xs" glow="none" color="muted" />
                              </div>
                            )}
                            {m.waist && (
                              <div className="flex items-center gap-1">
                                <span>کمر:</span>
                                <DotMatrixNumber value={m.waist} unit="cm" size="2xs" glow="none" color="muted" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 2. Nutrition Tab */}
            {activeTab === 'nutrition' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-3xl bg-black/30 border border-white/5 text-center">
                    <span className="text-[11px] text-zinc-400 block">کالری روزانه</span>
                    <div className="mt-1 flex justify-center">
                      <DotMatrixNumber value={nutrition.calories} size="lg" glow="violet" color="violet" />
                    </div>
                    <div className="text-[10px] text-zinc-500 flex items-center justify-center gap-1 mt-1">
                      <span>هدف:</span>
                      <DotMatrixNumber value="2600" size="2xs" glow="none" color="muted" />
                    </div>
                  </div>
                  <div className="p-4 rounded-3xl bg-black/30 border border-white/5 text-center">
                    <span className="text-[11px] text-zinc-400 block">پروتئین</span>
                    <div className="mt-1 flex justify-center">
                      <DotMatrixNumber value={nutrition.protein} unit="g" size="lg" glow="none" color="white" />
                    </div>
                    <div className="text-[10px] text-zinc-500 flex items-center justify-center gap-1 mt-1">
                      <span>هدف:</span>
                      <DotMatrixNumber value="160" unit="g" size="2xs" glow="none" color="muted" />
                    </div>
                  </div>
                  <div className="p-4 rounded-3xl bg-black/30 border border-white/5 text-center">
                    <span className="text-[11px] text-zinc-400 block">کربوهیدرات</span>
                    <div className="mt-1 flex justify-center">
                      <DotMatrixNumber value={nutrition.carbs} unit="g" size="lg" glow="none" color="white" />
                    </div>
                    <div className="text-[10px] text-zinc-500 flex items-center justify-center gap-1 mt-1">
                      <span>هدف:</span>
                      <DotMatrixNumber value="300" unit="g" size="2xs" glow="none" color="muted" />
                    </div>
                  </div>
                  <div className="p-4 rounded-3xl bg-black/30 border border-white/5 text-center">
                    <span className="text-[11px] text-zinc-400 block">مصرف آب</span>
                    <div className="mt-1 flex justify-center">
                      <DotMatrixNumber value={nutrition.water} unit="L" size="lg" glow="violet" color="violet" />
                    </div>
                    <div className="text-[10px] text-zinc-500 flex items-center justify-center gap-1 mt-1">
                      <span>هدف:</span>
                      <DotMatrixNumber value="3.5" unit="لیتر" size="2xs" glow="none" color="muted" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Achievements Tab */}
            {activeTab === 'achievements' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {achievements.map((ach) => (
                  <div
                    key={ach.achievementId}
                    className={`p-4 rounded-3xl border flex items-center gap-3.5 transition-all ${
                      ach.unlocked
                        ? 'bg-violet-500/10 border-violet-500/30 text-white shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                        : 'bg-white/[0.02] border-white/5 text-zinc-500 opacity-60'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center text-2xl shrink-0">
                      {ach.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{ach.titleFa}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">{ach.descriptionFa}</p>
                      <span className="text-[10px] text-violet-400 mt-1 block font-medium">
                        {ach.unlocked ? 'کسب شده ✓' : 'در حال پیشرفت...'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.notificationId}
                    className="p-4 rounded-3xl bg-black/30 border border-white/5 flex items-start gap-3"
                  >
                    <div className="p-2 rounded-2xl bg-violet-500/15 text-violet-400 shrink-0 mt-0.5 shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{notif.titleFa}</h4>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{notif.bodyFa}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 5. AI Fitness Advisor Tab (Abstraction ready) */}
            {activeTab === 'ai' && (
              <div className="space-y-5">
                <div className="p-5 rounded-3xl bg-gradient-to-r from-[#1c1236]/80 to-[#0c0819]/80 border border-violet-500/30 shadow-[0_0_25px_rgba(139,92,246,0.15)]">
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
                    <h4 className="text-base font-black text-white">تحلیلگر پیشرفت و خستگی (AI Advisor)</h4>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    این ماژول سوابق حجم تمرینی و وزنه‌های ثبت‌شده در Firestore را پایش کرده و بازخورد اختصاصی ریکاوری را از طریق سرویس امن سمت سرور تولید می‌کند.
                  </p>
                  <button
                    onClick={handleRunAiAnalysis}
                    disabled={loadingAi}
                    className="mt-4 py-3 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-violet-500/30 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{loadingAi ? 'در حال تحلیل داده‌های ابری...' : 'دریافت تحلیل وضعیت فعلی'}</span>
                  </button>
                </div>

                {aiAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-3xl bg-black/40 border border-white/10"
                  >
                    <h5 className="text-xs font-bold text-violet-300 mb-2">نتیجه پایش بیومکانیک و ریکاوری:</h5>
                    <p className="text-sm text-zinc-200 leading-relaxed">{aiAnalysis}</p>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
