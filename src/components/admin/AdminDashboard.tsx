import React from 'react';
import {
  Users,
  Dumbbell,
  FileText,
  Video,
  Apple,
  Calendar,
  Activity,
  Plus,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';
import { DashboardOverviewStats } from '../../repositories/AdminRepository';
import { AuditLog } from '../../types';

interface AdminDashboardProps {
  stats: DashboardOverviewStats;
  auditLogs: AuditLog[];
  onNavigateTab: (tabId: string) => void;
  onOpenCreateModal: (entityType: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  auditLogs,
  onNavigateTab,
  onOpenCreateModal,
}) => {
  const metricCards = [
    {
      id: 'users',
      title: 'کاربران ثبت‌نام شده',
      value: stats.totalUsers.toLocaleString('fa-IR'),
      subtext: `${stats.activeUsers.toLocaleString('fa-IR')} کاربر فعال این ماه`,
      icon: Users,
      color: 'from-purple-500/20 to-indigo-500/10 text-purple-400 border-purple-500/20',
      badge: '+۱۲٪ این ماه',
    },
    {
      id: 'workouts',
      title: 'تمرین‌های انجام شده',
      value: stats.totalWorkoutsCompleted.toLocaleString('fa-IR'),
      subtext: 'مجموع حجم ثبت‌شده کاربران',
      icon: Activity,
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/20',
      badge: 'ثبت زنده',
    },
    {
      id: 'exercises',
      title: 'حرکات ورزشی فعال',
      value: stats.totalExercises.toLocaleString('fa-IR'),
      subtext: 'کتابخانه کامل بیومکانیک',
      icon: Dumbbell,
      color: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/20',
      badge: 'آماده تمرین',
    },
    {
      id: 'programs',
      title: 'برنامه‌های تمرینی',
      value: stats.totalPrograms.toLocaleString('fa-IR'),
      subtext: 'سیستم‌های تفکیکی و فول‌بادی',
      icon: Calendar,
      color: 'from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/20',
      badge: 'چندروزه',
    },
    {
      id: 'articles',
      title: 'مقالات منتشر شده',
      value: stats.totalArticles.toLocaleString('fa-IR'),
      subtext: 'راهنماهای علمی و کاربردی',
      icon: FileText,
      color: 'from-blue-500/20 to-sky-500/10 text-blue-400 border-blue-500/20',
      badge: 'مطالعه آنلاین',
    },
    {
      id: 'videos',
      title: 'ویدیوهای آموزشی',
      value: stats.totalVideos.toLocaleString('fa-IR'),
      subtext: 'تحلیل دقیق بیومکانیک',
      icon: Video,
      color: 'from-rose-500/20 to-red-500/10 text-rose-400 border-rose-500/20',
      badge: 'کیفیت HD',
    },
  ];

  const maxWorkout = Math.max(...stats.workoutCompletionsTrend.map((t) => t.count), 100);

  return (
    <div className="space-y-8 text-right" dir="rtl">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-zinc-900 via-zinc-900 to-emerald-950/40 border border-zinc-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                متصل به پایگاه داده ابری Firebase
              </span>
              <span className="text-xs text-zinc-400">نسخه ۲.۴.۰</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">داشبورد مدیریت کوچ من</h1>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl leading-relaxed">
              مدیریت جامع کاربران، برنامه‌های بدنسازی، کاتالوگ حرکات، بانک تغذیه و اطلاع‌رسانی یکپارچه با اپلیکیشن موبایل.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenCreateModal('exercise')}
              className="px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black rounded-2xl transition flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن حرکت جدید</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenCreateModal('program')}
              className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-2xl border border-zinc-700 transition flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>طراحی برنامه تمرینی</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenCreateModal('notification')}
              className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-2xl border border-zinc-700 transition flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>ارسال اعلان همگانی</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('seed')}
              className="px-4 py-3 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 text-xs font-bold rounded-2xl border border-emerald-500/30 transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>داده‌های اولیه (سیدر)</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              onClick={() => onNavigateTab(card.id)}
              className={`relative overflow-hidden bg-gradient-to-b ${card.color} bg-zinc-900/90 border rounded-3xl p-6 cursor-pointer group shadow-xl`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-zinc-400 block mb-1">{card.title}</span>
                  <div className="text-3xl font-black text-white tracking-tight">{card.value}</div>
                  <div className="text-xs text-zinc-400 mt-2">{card.subtext}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-white group-hover:scale-110 transition duration-300">
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-bold">{card.badge}</span>
                <span className="text-zinc-500 group-hover:text-zinc-300 flex items-center gap-1 transition">
                  مدیریت داده‌ها <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics & Trends Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workout Activity Trend Chart */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                تعداد تمرین‌های انجام‌شده روزانه در هفته جاری
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">پایبندی ورزشکاران به برنامه تمرینی</p>
            </div>
            <span className="text-xs px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full border border-zinc-700 font-medium">
              ۷ روز اخیر
            </span>
          </div>

          {/* Bar Chart Visual */}
          <div className="h-64 flex items-end justify-between gap-3 pt-6 px-2">
            {stats.workoutCompletionsTrend.map((item, index) => {
              const heightPercent = Math.round((item.count / maxWorkout) * 100);
              return (
                <div key={item.label} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[11px] font-bold text-zinc-400 group-hover:text-emerald-400 transition">
                    {item.count}
                  </span>
                  <div className="w-full bg-zinc-800/80 rounded-2xl overflow-hidden flex flex-col justify-end h-44 relative">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(heightPercent, 12)}%` }}
                      transition={{ duration: 0.6, delay: index * 0.08 }}
                      className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-2xl group-hover:from-emerald-500 group-hover:to-teal-300 transition shadow-lg shadow-emerald-950/40"
                    />
                  </div>
                  <span className="text-xs font-medium text-zinc-400">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown & System Status */}
        <div className="space-y-6">
          {/* Exercises Distribution */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-amber-400" />
              توزیع عضلات در بانک حرکات
            </h3>
            <div className="space-y-3">
              {stats.categoryDistribution.map((cat, idx) => {
                const percent = Math.min(100, Math.round((cat.count / Math.max(stats.totalExercises, 1)) * 100));
                const colors = ['bg-emerald-500', 'bg-cyan-500', 'bg-purple-500', 'bg-amber-500'];
                const color = colors[idx % colors.length];
                return (
                  <div key={cat.category} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-300 font-medium">{cat.category}</span>
                      <span className="text-zinc-400 font-mono">{cat.count} حرکت ({percent}٪)</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full`} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick System Integrity card */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">امنیت و پایداری داده‌ها</h4>
                <p className="text-xs text-zinc-400">قوانین Firestore و احراز هویت فعال است</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-zinc-300 pt-2 border-t border-zinc-800">
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">اتصال Firestore:</span>
                <span className="text-emerald-400 font-bold">پایدار و زنده (OK)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">فضای ذخیره ابری Storage:</span>
                <span className="text-emerald-400 font-bold">آماده آپلود رسانه</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">حالت اپلیکیشن:</span>
                <span className="text-emerald-400 font-bold">تولید تجاری (Production)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Audit Logs Stream */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              آخرین رویدادها و لاگ‌های مدیریتی (Audit Trail)
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">ثبت تمامی تغییرات با شناسه مدیر و زمان دقیق</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('audit')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition"
          >
            مشاهده تمام لاگ‌ها <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {auditLogs.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 text-sm">
            هنوز رویدادی ثبت نشده است. با ویرایش یا افزودن محتوا، لاگ‌ها به صورت خودکار در این قسمت نمایش داده می‌شوند.
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/60 overflow-hidden">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-bold text-zinc-200">{log.action}</span>
                    <span className="text-xs text-zinc-500 mr-2">توسط {log.adminEmail}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span className="px-2.5 py-0.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300">
                    {log.entityType}
                  </span>
                  <span className="font-mono text-[11px] text-zinc-500">
                    {new Date(log.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
