import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ClipboardList,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  User,
  Shield,
  Activity,
  Apple,
  RefreshCw,
} from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { ProgramRequest, WorkoutProgram, AdminUser } from '../../types';
import { ProgramRequestService } from '../../services/ProgramRequestService';
import { CoachReviewModal } from './CoachReviewModal';
import { toPersianDigits } from '../../utils/persian';

interface AdminProgramRequestsProps {
  programs: WorkoutProgram[];
  currentAdmin: AdminUser;
}

export const AdminProgramRequests: React.FC<AdminProgramRequestsProps> = ({
  programs,
  currentAdmin,
}) => {
  const [requests, setRequests] = useState<ProgramRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRequest, setSelectedRequest] = useState<ProgramRequest | null>(null);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await ProgramRequestService.getAllProgramRequests();
      setRequests(data);
    } catch (e) {
      console.warn('Error loading program requests:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.userName?.toLowerCase().includes(q);
      const matchEmail = r.userEmail?.toLowerCase().includes(q);
      return matchName || matchEmail;
    }
    return true;
  });

  // Stats
  const totalCount = requests.length;
  const pendingCount = requests.filter((r) => r.status === 'submitted').length;
  const underReviewCount = requests.filter((r) => r.status === 'under_review').length;
  const needsInfoCount = requests.filter((r) => r.status === 'needs_more_info').length;
  const readyCount = requests.filter((r) => r.status === 'plan_ready').length;
  const specialReviewCount = requests.filter((r) => r.specialReviewRequired).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return { label: 'جدید (در صف)', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      case 'under_review':
        return { label: 'در حال بررسی', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
      case 'needs_more_info':
        return { label: 'نیازمند اطلاعات', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'plan_ready':
        return { label: 'برنامه فعال', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      default:
        return { label: status, color: 'bg-white/10 text-zinc-300 border-white/10' };
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Top Banner & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-purple-400" />
            <span>درخواست‌های برنامه و پرونده‌های شاگردان</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            بررسی پرونده‌های تفصیلی، تصمیم‌گیری مربی و تخصیص برنامه‌های تمرینی و اهداف تغذیه
          </p>
        </div>

        <button
          onClick={loadRequests}
          disabled={loading}
          className="self-start sm:self-auto py-2 px-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-zinc-300 transition-colors flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>به‌روزرسانی لیست</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <GlassCard className="p-3.5 space-y-1">
          <span className="text-[10px] text-zinc-400 font-bold block">کل درخواست‌ها</span>
          <span className="text-xl font-black text-white font-mono">{toPersianDigits(totalCount)}</span>
        </GlassCard>

        <GlassCard className="p-3.5 space-y-1 border-purple-500/30 bg-purple-950/20">
          <span className="text-[10px] text-purple-300 font-bold block">جدید (در صف بررسی)</span>
          <span className="text-xl font-black text-purple-300 font-mono">{toPersianDigits(pendingCount)}</span>
        </GlassCard>

        <GlassCard className="p-3.5 space-y-1 border-indigo-500/30 bg-indigo-950/20">
          <span className="text-[10px] text-indigo-300 font-bold block">در حال بررسی</span>
          <span className="text-xl font-black text-indigo-300 font-mono">{toPersianDigits(underReviewCount)}</span>
        </GlassCard>

        <GlassCard className="p-3.5 space-y-1 border-amber-500/30 bg-amber-950/20">
          <span className="text-[10px] text-amber-300 font-bold block">نیازمند اطلاعات</span>
          <span className="text-xl font-black text-amber-300 font-mono">{toPersianDigits(needsInfoCount)}</span>
        </GlassCard>

        <GlassCard className="p-3.5 space-y-1 border-emerald-500/30 bg-emerald-950/20">
          <span className="text-[10px] text-emerald-300 font-bold block">آماده و فعال</span>
          <span className="text-xl font-black text-emerald-300 font-mono">{toPersianDigits(readyCount)}</span>
        </GlassCard>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs font-bold">
          {[
            { id: 'all', label: 'همه' },
            { id: 'submitted', label: 'جدید' },
            { id: 'under_review', label: 'در حال بررسی' },
            { id: 'needs_more_info', label: 'نیازمند اطلاعات' },
            { id: 'plan_ready', label: 'برنامه فعال' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className={`py-1.5 px-3 rounded-xl transition-all whitespace-nowrap ${
                filterStatus === f.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white/5 text-zinc-400 hover:bg-white/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-500 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی نام یا ایمیل شاگرد..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="p-12 text-center text-zinc-400 text-xs">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span>در حال بارگذاری درخواست‌های برنامه...</span>
        </div>
      ) : filteredRequests.length === 0 ? (
        <GlassCard className="p-12 text-center space-y-2">
          <ClipboardList className="w-10 h-10 text-zinc-600 mx-auto" />
          <p className="text-xs text-zinc-400 font-bold">هیچ درخواستی در این دسته‌بندی یافت نشد.</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((req) => {
            const badge = getStatusBadge(req.status);
            const pSnapshot = req.detailedProfileSnapshot || {};
            const measurements = pSnapshot.bodyMeasurements;

            return (
              <GlassCard
                key={req.requestId}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-white/10 hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black shrink-0">
                    <User className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-black text-white">{req.userName}</span>
                      <span className="text-[11px] text-zinc-400 font-mono">({req.userEmail})</span>
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                      {measurements?.weightKg && (
                        <span>وزن: {toPersianDigits(measurements.weightKg)} kg</span>
                      )}
                      {measurements?.heightCm && (
                        <span>قد: {toPersianDigits(measurements.heightCm)} cm</span>
                      )}
                      <span>
                        تاریخ ثبت: {new Date(req.submittedAt).toLocaleDateString('fa-IR')}
                      </span>
                    </div>

                    {/* Warning flags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {req.specialReviewRequired && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center gap-1 border border-amber-500/30">
                          <AlertTriangle className="w-3 h-3" />
                          <span>بررسی ویژه (پزشکی / بارداری)</span>
                        </span>
                      )}
                      {req.allergyFlag && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-bold flex items-center gap-1 border border-rose-500/30">
                          <Shield className="w-3 h-3" />
                          <span>دارای آلرژی غذایی</span>
                        </span>
                      )}
                      {req.injuryFlag && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-bold flex items-center gap-1 border border-purple-500/30">
                          <Activity className="w-3 h-3" />
                          <span>محدودیت حرکتی</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="self-end sm:self-center shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedRequest(req)}
                    className="py-2.5 px-5 rounded-xl bg-purple-600/30 border border-purple-500/40 hover:bg-purple-600 text-purple-200 hover:text-white font-bold text-xs transition-all flex items-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" />
                    <span>بررسی پرونده و تخصیص</span>
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {selectedRequest && (
        <CoachReviewModal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          request={selectedRequest}
          availablePrograms={programs}
          currentAdmin={currentAdmin}
          onUpdated={loadRequests}
        />
      )}
    </div>
  );
};
