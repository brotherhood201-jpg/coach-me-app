import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Trophy,
  Dumbbell,
  Calculator,
  TrendingUp,
  Sparkles,
  Search,
  CheckCircle2,
  Flame,
  ArrowUpRight,
  Plus,
} from 'lucide-react';
import { PersonalRecord } from '../types';
import { toPersianDigits, formatPersianDate, calculate1RM, playWorkoutSound } from '../utils/persian';
import { DotMatrixNumber } from './common/DotMatrixNumber';

interface PersonalRecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  personalRecords: PersonalRecord[];
  onAddCustomPR?: (record: PersonalRecord) => void;
}

export const PersonalRecordsModal: React.FC<PersonalRecordsModalProps> = ({
  isOpen,
  onClose,
  personalRecords,
  onAddCustomPR,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [calcWeight, setCalcWeight] = useState<number>(80);
  const [calcReps, setCalcReps] = useState<number>(6);
  const [showCalculator, setShowCalculator] = useState(false);

  // 1RM Calculation Result
  const calculated1RM = useMemo(() => {
    return calculate1RM(calcWeight, calcReps);
  }, [calcWeight, calcReps]);

  // Filtered PR list
  const filteredRecords = useMemo(() => {
    return personalRecords.filter((pr) =>
      pr.exerciseNameFa.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  }, [personalRecords, searchTerm]);

  // Overall PR Stats
  const stats = useMemo(() => {
    const totalRecords = personalRecords.length;
    const maxLiftWeight = Math.max(...personalRecords.map((p) => p.maxWeightKg), 0);
    const total1RM = personalRecords.reduce((acc, p) => acc + (p.estimated1RM || p.maxWeightKg), 0);
    return {
      totalRecords,
      maxLiftWeight,
      total1RM,
    };
  }, [personalRecords]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 font-['Vazirmatn',system-ui,sans-serif]">
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
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-[#0c0819]/90 border border-violet-500/20 rounded-[36px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.95),0_0_40px_rgba(139,92,246,0.15)] flex flex-col overflow-hidden z-10 text-right backdrop-blur-3xl"
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#120c24]/80 sticky top-0 z-10 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.25)]">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <span>رکوردهای شخصی (Personal Records)</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30">
                    PR
                  </span>
                </h3>
                <p className="text-xs text-zinc-400">سنگین‌ترین وزنه‌ها و بیشترین تکرارهای ثبت‌شده شما در طول تمرین</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-white/[0.05] text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
            {/* Top KPI Stats */}
            <div className="grid grid-cols-3 gap-3 bg-[#120c24]/80 border border-violet-500/15 p-4 sm:p-5 rounded-3xl backdrop-blur-sm">
              <div className="space-y-1">
                <span className="text-[11px] text-zinc-400 font-bold block">تعداد رکوردهای فعال</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <DotMatrixNumber value={stats.totalRecords} unit="حرکت" size="lg" glow="none" color="white" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-zinc-400 font-bold block">سنگین‌ترین رکورد وزنه</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <DotMatrixNumber value={stats.maxLiftWeight} unit="کیلوگرم" size="lg" glow="violet" color="violet" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-zinc-400 font-bold block">مجموع توان ۱RM</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <DotMatrixNumber value={stats.total1RM} unit="کیلوگرم" size="lg" glow="purple" color="purple" />
                </div>
              </div>
            </div>

            {/* 1RM Calculator Accordion Card */}
            <div className="bg-[#120c24]/80 border border-violet-500/20 rounded-3xl p-5 overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-violet-500/15 text-violet-400 border border-violet-500/30">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">ماشین‌حساب یک تکرار بیشینه (1RM Calculator)</h4>
                    <p className="text-xs text-zinc-400">تخمین حد نهایی قدرت بر مبنای فرمول اپلی و برزیکی</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCalculator(!showCalculator)}
                  className="text-xs font-bold text-violet-400 hover:text-violet-300 px-3 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/20 cursor-pointer"
                >
                  {showCalculator ? 'بستن محاسبه‌گر' : 'باز کردن محاسبه‌گر'}
                </button>
              </div>

              {showCalculator && (
                <div className="mt-5 pt-5 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="text-xs text-zinc-400 font-medium block mb-1.5">وزنه جابجا شده (کیلوگرم):</label>
                    <input
                      type="number"
                      value={calcWeight}
                      onChange={(e) => setCalcWeight(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-sm focus:border-violet-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 font-medium block mb-1.5">تعداد تکرار اجرا شده:</label>
                    <input
                      type="number"
                      value={calcReps}
                      onChange={(e) => setCalcReps(Math.min(30, Math.max(1, Number(e.target.value))))}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-sm focus:border-violet-500 focus:outline-none"
                    />
                  </div>

                  <div className="bg-violet-500/15 border border-violet-500/30 p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-violet-300 font-bold block">تخمین ۱ تکرار بیشینه:</span>
                      <div className="mt-1">
                        <DotMatrixNumber value={calculated1RM.average} unit="کیلوگرم" size="md" glow="violet" color="violet" />
                      </div>
                    </div>
                    <Flame className="w-6 h-6 text-violet-400 animate-pulse" />
                  </div>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو در بین رکوردهای حرکات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#120c24]/80 border border-white/10 rounded-2xl pr-11 pl-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none"
              />
              <Search className="w-5 h-5 text-zinc-500 absolute right-3.5 top-3.5" />
            </div>

            {/* PR List */}
            <div className="space-y-3">
              {filteredRecords.length === 0 ? (
                <div className="py-12 text-center space-y-3 bg-[#120c24]/40 rounded-3xl border border-white/5">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] mx-auto flex items-center justify-center text-zinc-500">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-zinc-300">هنوز رکوردی ثبت نشده است</h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    با اجرای تمرینات و ثبت وزنه‌های سنگین‌تر، رکوردهای شما به‌صورت خودکار در این جدول شناسایی و ذخیره می‌شوند.
                  </p>
                </div>
              ) : (
                filteredRecords.map((pr) => {
                  const delta = pr.previousRecordKg ? pr.maxWeightKg - pr.previousRecordKg : 0;
                  return (
                    <motion.div
                      key={pr.id || pr.exerciseId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#120c24]/80 border border-white/5 hover:border-violet-500/30 rounded-3xl p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-violet-500/10 border border-violet-500/25 flex items-center justify-center text-violet-400 shrink-0 mt-0.5 shadow-[0_0_10px_rgba(139,92,246,0.15)]">
                          <Dumbbell className="w-5 h-5" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm sm:text-base font-bold text-white">{pr.exerciseNameFa}</h4>
                            <span className="px-2 py-0.5 rounded-md bg-violet-500/15 text-violet-300 border border-violet-500/30 text-[10px] font-bold">
                              رکورد معتبر
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400">
                            ثبت در تاریخ: {formatPersianDate(pr.achievedAt, 'monthDay')}
                          </p>
                        </div>
                      </div>

                      {/* Numbers Grid */}
                      <div className="flex items-center justify-between sm:justify-end gap-5 bg-black/40 sm:bg-transparent p-3 sm:p-0 rounded-2xl border border-white/5 sm:border-0">
                        {delta > 0 && (
                          <div className="text-center sm:text-left">
                            <span className="text-[10px] text-violet-300 font-bold block">ارتقا</span>
                            <div className="mt-0.5">
                              <DotMatrixNumber value={`+${delta}`} unit="کیلو" size="2xs" glow="violet" color="violet" />
                            </div>
                          </div>
                        )}

                        <div className="text-center sm:text-left">
                          <span className="text-[10px] text-zinc-400 font-medium block">تکرار</span>
                          <div className="mt-0.5">
                            <DotMatrixNumber value={pr.maxRepsAtWeight} unit="تکرار" size="xs" glow="none" color="white" />
                          </div>
                        </div>

                        <div className="text-center sm:text-left">
                          <span className="text-[10px] text-violet-400 font-bold block">وزنه بیشینه</span>
                          <div className="mt-0.5">
                            <DotMatrixNumber value={pr.maxWeightKg} unit="کیلو" size="sm" glow="violet" color="violet" />
                          </div>
                        </div>

                        <div className="text-center sm:text-left border-r sm:border-r border-white/10 pr-3 mr-1">
                          <span className="text-[10px] text-zinc-400 font-medium block">تخمین ۱RM</span>
                          <div className="mt-0.5">
                            <DotMatrixNumber value={pr.estimated1RM} unit="کیلو" size="xs" glow="none" color="white" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
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
