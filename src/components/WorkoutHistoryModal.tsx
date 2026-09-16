import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Calendar,
  Clock,
  Flame,
  Dumbbell,
  ChevronDown,
  ChevronUp,
  Trophy,
  History,
  Search,
  Zap,
  Filter,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { WorkoutSession } from '../types';
import { WorkoutRepository } from '../repositories/WorkoutRepository';
import { formatPersianDate } from '../utils/persian';
import { DotMatrixNumber } from './common/DotMatrixNumber';

interface WorkoutHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  onStartNewWorkout?: () => void;
}

export const WorkoutHistoryModal: React.FC<WorkoutHistoryModalProps> = ({
  isOpen,
  onClose,
  userId = 'guest',
  onStartNewWorkout,
}) => {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'month' | 'heavy'>('all');

  const loadSessions = () => {
    setLoading(true);
    WorkoutRepository.getUserSessions(userId).then((res) => {
      setSessions(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen, userId]);

  // Overall Statistics from history
  const historyStats = useMemo(() => {
    const totalSessions = sessions.length;
    const totalVolumeKg = sessions.reduce((acc, s) => acc + (s.totalVolumeKg || 0), 0);
    const totalMinutes = sessions.reduce((acc, s) => acc + Math.round((s.durationSeconds || 3120) / 60), 0);
    const avgMinutes = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;
    const totalPRs = sessions.reduce((acc, s) => {
      if (!s.completedSetsSummary || !Array.isArray(s.completedSetsSummary)) return acc;
      const count = s.completedSetsSummary.reduce((subAcc, ex) => {
        if (!ex || !Array.isArray(ex.sets)) return subAcc;
        return subAcc + ex.sets.filter((set) => set && set.isPR).length;
      }, 0);
      return acc + count;
    }, 0);

    return {
      totalSessions,
      totalVolumeKg,
      totalMinutes,
      avgMinutes,
      totalPRs,
    };
  }, [sessions]);

  // Filtered Sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter((sess) => {
      // Search term matching
      const matchesSearch =
        sess.titleFa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sess.workoutName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sess.muscleGroupsFa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(sess.completedSetsSummary) &&
          sess.completedSetsSummary.some((s) => s?.exerciseNameFa?.toLowerCase().includes(searchTerm.toLowerCase())));

      if (!matchesSearch) return false;

      // Filter tabs
      if (filterType === 'heavy') {
        return sess.intensity === 'سنگین' || sess.intensity === 'حرفه‌ای';
      }
      if (filterType === 'month') {
        if (!sess.completedAt) return true;
        const d = new Date(sess.completedAt);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }

      return true;
    });
  }, [sessions, searchTerm, filterType]);

  const handleDeleteSession = async (sessionId: string) => {
    await WorkoutRepository.deleteWorkoutSession(userId, sessionId);
    setSessions((prev) => prev.filter((s) => s.id !== sessionId && s.sessionId !== sessionId));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 font-['Vazirmatn',system-ui,sans-serif]">
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
          className="relative w-full max-w-3xl max-h-[90vh] bg-[#0c0c0c] border border-white/10 rounded-[36px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden z-10 text-right backdrop-blur-2xl"
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-zinc-950/80 sticky top-0 z-10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-600/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <History className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <span>تاریخچه و لاگ جلسات تمرینی</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    لاگ دائم
                  </span>
                </h3>
                <p className="text-xs text-zinc-400">سوابق کامل ست‌ها، تناژ جابجایی و رکوردهای تمرینی</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-white/[0.05] text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
            {/* Top KPI Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-900/50 border border-white/5 p-4 sm:p-5 rounded-3xl backdrop-blur-sm">
              <div className="space-y-1">
                <span className="text-[11px] text-zinc-400 font-bold block">مجموع جلسات</span>
                <div className="flex items-baseline gap-1">
                  <DotMatrixNumber value={historyStats.totalSessions} size="lg" glow="white" color="white" />
                  <span className="text-xs text-zinc-500 font-medium">جلسه</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-zinc-400 font-bold block">کل تناژ جابجایی</span>
                <div className="flex items-baseline gap-1">
                  <DotMatrixNumber value={(historyStats.totalVolumeKg / 1000).toFixed(1)} size="lg" glow="amber" color="amber" />
                  <span className="text-xs text-zinc-500 font-medium">تُن وزنه</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-zinc-400 font-bold block">میانگین زمان جلسه</span>
                <div className="flex items-baseline gap-1">
                  <DotMatrixNumber value={historyStats.avgMinutes} size="lg" glow="emerald" color="emerald" />
                  <span className="text-xs text-zinc-500 font-medium">دقیقه</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-zinc-400 font-bold block">رکوردهای ثبت‌شده</span>
                <div className="flex items-baseline gap-1">
                  <DotMatrixNumber value={historyStats.totalPRs} size="lg" glow="amber" color="amber" />
                  <span className="text-xs text-zinc-500 font-medium">مورد PR</span>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="جستجو در بین تمرینات، حرکات یا عضلات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-zinc-900/80 border border-white/10 rounded-2xl pr-11 pl-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
                />
                <Search className="w-5 h-5 text-zinc-500 absolute right-3.5 top-3.5" />
              </div>

              <div className="flex items-center gap-1.5 bg-zinc-900/80 border border-white/10 p-1 rounded-2xl shrink-0">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    filterType === 'all'
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  همه
                </button>
                <button
                  onClick={() => setFilterType('month')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    filterType === 'month'
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  این ماه
                </button>
                <button
                  onClick={() => setFilterType('heavy')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    filterType === 'heavy'
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  سنگین
                </button>
              </div>
            </div>

            {/* Session List */}
            <div className="space-y-4">
              {loading ? (
                <div className="py-12 text-center text-zinc-500 text-xs font-mono">
                  در حال بارگذاری سوابق از Firestore...
                </div>
              ) : filteredSessions.length === 0 ? (
                <div className="py-16 text-center space-y-4 bg-zinc-900/30 rounded-3xl border border-white/5">
                  <div className="w-14 h-14 rounded-3xl bg-white/[0.03] border border-white/5 mx-auto flex items-center justify-center text-zinc-500">
                    <Dumbbell className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-zinc-300">تمرینی یافت نشد</h4>
                    <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                      تمرینی مطابق با این فیلتر ثبت نشده است. برای ثبت لاگ جدید، تمرین امروز را شروع کنید.
                    </p>
                  </div>
                  {onStartNewWorkout && (
                    <button
                      onClick={onStartNewWorkout}
                      className="px-5 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition shadow-lg shadow-orange-600/20 cursor-pointer"
                    >
                      شروع تمرین جدید
                    </button>
                  )}
                </div>
              ) : (
                filteredSessions.map((sess) => {
                  const isExpanded = expandedSessionId === (sess.id || sess.sessionId);
                  const formattedDate = sess.completedAt
                    ? formatPersianDate(sess.completedAt, 'full')
                    : 'امروز';

                  return (
                    <div
                      key={sess.id || sess.sessionId}
                      className="rounded-3xl bg-zinc-900/60 border border-white/5 hover:border-white/10 transition-all overflow-hidden"
                    >
                      <div
                        onClick={() => setExpandedSessionId(isExpanded ? null : (sess.id || sess.sessionId || ''))}
                        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-black text-white">{sess.titleFa}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">
                              {sess.intensity || 'سنگین'}
                            </span>
                            {sess.workoutDay && (
                              <span className="text-[10px] text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded-md">
                                {sess.workoutDay}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                              <span>{formattedDate}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-zinc-500" />
                              <DotMatrixNumber value={Math.round((sess.durationSeconds || 3120) / 60)} unit="دقیقه" size="2xs" glow="none" color="muted" />
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Dumbbell className="w-3.5 h-3.5 text-zinc-500" />
                              <DotMatrixNumber value={sess.totalSets || 18} unit="ست" size="2xs" glow="none" color="muted" />
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5">
                          <div className="text-right sm:text-left">
                            <div className="block">
                              <DotMatrixNumber value={sess.totalVolumeKg || 0} unit="کیلوگرم" size="sm" glow="amber" color="amber" />
                            </div>
                            <span className="text-[10px] text-zinc-500">حجم کل جابجایی</span>
                          </div>

                          <div className="p-2 rounded-xl bg-white/[0.04] text-zinc-400">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>

                      {/* Drill-down sets overview */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-5 pb-5 pt-3 border-t border-white/5 space-y-3 bg-black/40"
                          >
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-bold text-zinc-300">ریز جزئیات حرکات و ست‌ها:</h5>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSession(sess.id || sess.sessionId || '');
                                }}
                                className="text-xs text-rose-400/80 hover:text-rose-400 flex items-center gap-1 cursor-pointer transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>حذف این جلسه</span>
                              </button>
                            </div>

                            {sess.completedSetsSummary && Array.isArray(sess.completedSetsSummary) && sess.completedSetsSummary.length > 0 ? (
                              <div className="space-y-2.5">
                                {sess.completedSetsSummary.map((exSummary, idx) => {
                                  if (!exSummary) return null;
                                  const setsList = Array.isArray(exSummary.sets) ? exSummary.sets : [];
                                  return (
                                    <div
                                      key={idx}
                                      className="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-2.5"
                                    >
                                      <div className="flex items-center justify-between text-xs font-bold text-white">
                                        <span className="flex items-center gap-2">
                                          <span className="w-2 h-2 rounded-full bg-orange-500" />
                                          <span>{exSummary.exerciseNameFa || 'حرکت ورزشی'}</span>
                                        </span>
                                        <div className="text-[11px] text-zinc-400">
                                          <DotMatrixNumber value={setsList.length} unit="ست ثبت شده" size="2xs" glow="none" color="muted" />
                                        </div>
                                      </div>

                                      <div className="flex flex-wrap gap-2">
                                        {setsList.map((set, sIdx) => {
                                          if (!set) return null;
                                          return (
                                            <div
                                              key={sIdx}
                                              className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border ${
                                                set.isPR
                                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/10'
                                                  : 'bg-white/[0.04] text-zinc-300 border-white/5'
                                              }`}
                                            >
                                              <span className="text-[10px] text-zinc-500 flex items-center gap-0.5">
                                                <span>ست</span>
                                                <DotMatrixNumber value={sIdx + 1} size="2xs" glow="none" color="muted" />
                                                <span>:</span>
                                              </span>
                                              <strong className="text-white flex items-center">
                                                <DotMatrixNumber value={set.weight ?? 0} unit="kg" size="2xs" glow="none" color="white" />
                                              </strong>
                                              <span className="text-zinc-500">×</span>
                                              <DotMatrixNumber value={set.reps ?? 0} size="2xs" glow="none" color="white" />
                                              {set.isPR && (
                                                <span className="flex items-center gap-0.5 text-amber-400 font-bold text-[10px] bg-amber-500/10 px-1 py-0.5 rounded">
                                                  <Trophy className="w-3 h-3" />
                                                  PR
                                                </span>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="p-3 rounded-2xl bg-white/[0.02] text-xs text-zinc-400">
                                تمرین با موفقیت تکمیل گردیده و مقادیر کلی ثبت شده است.
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
