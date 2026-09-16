import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MessageSquare,
  Edit3,
  Dumbbell,
  Send,
  Calendar,
  Shield,
  Apple,
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { ProgramRequest, DetailedClientProfile } from '../../types';
import { ProgramRequestService } from '../../services/ProgramRequestService';
import { toPersianDigits, playWorkoutSound } from '../../utils/persian';

interface ProgramRequestStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ProgramRequest | null;
  onEditProfile: () => void;
  onOpenWorkoutProgram?: () => void;
  onRefresh: () => void;
}

export const ProgramRequestStatusModal: React.FC<ProgramRequestStatusModalProps> = ({
  isOpen,
  onClose,
  request,
  onEditProfile,
  onOpenWorkoutProgram,
  onRefresh,
}) => {
  const [userReply, setUserReply] = useState<string>('');
  const [submittingReply, setSubmittingReply] = useState<boolean>(false);

  if (!isOpen || !request) return null;

  const handleSendReply = async () => {
    if (!userReply.trim()) return;
    setSubmittingReply(true);
    try {
      await ProgramRequestService.replyToCoachQuestion(request.userId, userReply.trim());
      setUserReply('');
      playWorkoutSound('success');
      onRefresh();
    } catch (e) {
      console.warn('Reply error:', e);
      alert('خطا در ارسال پاسخ. لطفاً دوباره تلاش کنید.');
    } finally {
      setSubmittingReply(false);
    }
  };

  const getStatusBadge = () => {
    switch (request.status) {
      case 'submitted':
        return {
          label: 'پرونده دریافت شد (در صف بررسی)',
          color: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
          icon: Clock,
        };
      case 'under_review':
        return {
          label: 'مربی در حال بررسی پرونده',
          color: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30',
          icon: Clock,
        };
      case 'needs_more_info':
        return {
          label: 'مربی نیاز به اطلاعات بیشتر دارد',
          color: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
          icon: AlertCircle,
        };
      case 'plan_ready':
        return {
          label: 'برنامه اختصاصی آماده و فعال است',
          color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
          icon: CheckCircle2,
        };
      default:
        return {
          label: 'در حال بررسی',
          color: 'text-zinc-400 bg-white/5 border-white/10',
          icon: Clock,
        };
    }
  };

  const statusBadge = getStatusBadge();
  const StatusIcon = statusBadge.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl overflow-y-auto"
      dir="rtl"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-lg bg-zinc-900/95 border border-purple-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-purple-950/50 my-auto relative text-right space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">وضعیت درخواست برنامه</h2>
              <p className="text-[11px] text-zinc-400">کوچینگ اختصاصی و نظارت مربی</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Chip */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/10">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border ${statusBadge.color}`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              <span>{statusBadge.label}</span>
            </span>
          </div>

          <span className="text-[10px] text-zinc-400 font-mono">
            {request.updatedAt
              ? new Date(request.updatedAt).toLocaleDateString('fa-IR')
              : 'امروز'}
          </span>
        </div>

        {/* Status Specific Content */}
        {/* 1. Submitted or Under Review */}
        {(request.status === 'submitted' || request.status === 'under_review') && (
          <GlassCard className="p-5 space-y-3 bg-purple-950/20 border-purple-500/30 text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>

            <h3 className="text-base font-black text-white">
              پرونده‌ات در حال بررسیه 💜
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed max-w-sm mx-auto">
              مربی اطلاعاتت رو بررسی میکنه و بعد از آماده شدن برنامه بهت خبر میدیم. تمام اهداف، اندازه‌ها و ترجیحاتت در طراحی برنامه لحاظ خواهد شد.
            </p>

            <div className="pt-2 flex justify-center gap-2">
              <button
                type="button"
                onClick={onEditProfile}
                className="py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-zinc-300 flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>ویرایش اطلاعات پرونده</span>
              </button>
            </div>
          </GlassCard>
        )}

        {/* 2. Needs More Info (Part 20) */}
        {request.status === 'needs_more_info' && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-black">
                <MessageSquare className="w-4 h-4" />
                <span>مربی یه سؤال دیگه ازت داره:</span>
              </div>
              <p className="text-xs text-white leading-relaxed font-bold bg-black/30 p-3 rounded-xl border border-white/5">
                "{request.coachQuestion}"
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300 block">
                پاسخ شما به مربی:
              </label>
              <textarea
                value={userReply}
                onChange={(e) => setUserReply(e.target.value)}
                placeholder="توضیحات تکمیلی را اینجا بنویسید..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-amber-500 focus:outline-none leading-relaxed"
              />

              <div className="flex justify-between items-center pt-1">
                <button
                  type="button"
                  onClick={onEditProfile}
                  className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>تکمیل یا ویرایش بخش‌های پرونده</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendReply}
                  disabled={!userReply.trim() || submittingReply}
                  className="py-2 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-xs hover:opacity-90 disabled:opacity-40 transition-all flex items-center gap-1.5"
                >
                  {submittingReply ? (
                    <span>در حال ارسال...</span>
                  ) : (
                    <>
                      <span>ارسال پاسخ</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. Plan Ready (Part 28 & 29) */}
        {request.status === 'plan_ready' && (
          <div className="space-y-4">
            <GlassCard className="p-5 space-y-3 bg-emerald-950/20 border-emerald-500/30 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <h3 className="text-base font-black text-white">
                برنامه اختصاصی تو آماده‌ست 🎉
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                مربی برنامه جدیدت را با توجه به پرونده و اهدافت آماده کرده است.
              </p>

              {request.assignedProgramName && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-right">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">
                      {request.assignedProgramName}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-bold">برنامه فعال</span>
                </div>
              )}

              {/* Coach Personal Notes */}
              {request.coachNotes && (
                <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-right space-y-1">
                  <span className="text-[11px] text-purple-300 font-bold block flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    یادداشت و توصیه مربی:
                  </span>
                  <p className="text-xs text-zinc-200 leading-relaxed">
                    {request.coachNotes}
                  </p>
                </div>
              )}

              {/* Nutrition Targets if assigned */}
              {request?.assignedNutritionPlan && (
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-right space-y-2">
                  <span className="text-[11px] text-emerald-300 font-bold block flex items-center gap-1">
                    <Apple className="w-3.5 h-3.5" />
                    هدف تغذیه‌ای تعیین‌شده توسط مربی:
                  </span>
                  <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                    <div className="p-1.5 rounded-lg bg-white/5">
                      <span className="text-[10px] text-zinc-400 block">کالری</span>
                      <span className="font-bold text-white font-mono">
                        {toPersianDigits(request.assignedNutritionPlan?.dailyCalorieTarget ?? 0)}
                      </span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white/5">
                      <span className="text-[10px] text-zinc-400 block">پروتئین</span>
                      <span className="font-bold text-rose-400 font-mono">
                        {toPersianDigits(request.assignedNutritionPlan?.proteinTarget ?? 0)}g
                      </span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white/5">
                      <span className="text-[10px] text-zinc-400 block">کربوهیدرات</span>
                      <span className="font-bold text-amber-400 font-mono">
                        {toPersianDigits(request.assignedNutritionPlan?.carbTarget ?? 0)}g
                      </span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white/5">
                      <span className="text-[10px] text-zinc-400 block">چربی</span>
                      <span className="font-bold text-cyan-400 font-mono">
                        {toPersianDigits(request.assignedNutritionPlan?.fatTarget ?? 0)}g
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {onOpenWorkoutProgram && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenWorkoutProgram();
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-xs hover:opacity-95 shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2"
                  >
                    <Dumbbell className="w-4 h-4" />
                    <span>مشاهده برنامه تمرینی</span>
                  </button>
                </div>
              )}
            </GlassCard>
          </div>
        )}

        {/* Footer info & Edit */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-zinc-400">
          <button
            type="button"
            onClick={onEditProfile}
            className="hover:text-purple-300 transition-colors flex items-center gap-1"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>ویرایش پرونده تکمیلی</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs transition-colors"
          >
            بستن
          </button>
        </div>
      </motion.div>
    </div>
  );
};
