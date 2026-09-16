import React from 'react';
import {
  TrendingUp,
  Activity,
  Users,
  Dumbbell,
  Clock,
  Calendar,
  Flame,
  Award,
  BarChart2,
  PieChart,
} from 'lucide-react';
import { motion } from 'motion/react';
import { DashboardOverviewStats } from '../../repositories/AdminRepository';

interface AdminAnalyticsProps {
  stats: DashboardOverviewStats;
}

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ stats }) => {
  const topExercises = [
    { name: 'پرس سینه هالتر', muscle: 'سینه', count: 1840, share: 88 },
    { name: 'اسکات پا با هالتر', muscle: 'چهارسر ران', count: 1420, share: 74 },
    { name: 'ددلیفت رومانیایی', muscle: 'پشت و همسترینگ', count: 1190, share: 62 },
    { name: 'پرس سرشانه دمبل', muscle: 'سرشانه', count: 980, share: 51 },
    { name: 'زیربغل قایقی سیم‌کش', muscle: 'زیربغل و پشت', count: 850, share: 44 },
  ];

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
          <TrendingUp className="w-7 h-7 text-emerald-400" />
          تحلیل عمیق آمار و رفتار ورزشکاران (Analytics & Insights)
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          بررسی شاخص‌های کلیدی تعامل، تناژ هفتگی جابجا شده، محبوب‌ترین حرکات و توزیع اهداف بدنسازی
        </p>
      </div>

      {/* Top Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl">
          <span className="text-xs text-zinc-400 block mb-1">میانگین زمان هر جلسه تمرین</span>
          <div className="text-2xl font-black text-white">۵۲ دقیقه</div>
          <span className="text-xs text-emerald-400 mt-2 block font-medium">+۴ دقیقه نسبت به ماه قبل</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl">
          <span className="text-xs text-zinc-400 block mb-1">حجم کل جابجا شده این هفته</span>
          <div className="text-2xl font-black text-white">۱۴۲ تن</div>
          <span className="text-xs text-cyan-400 mt-2 block font-medium">مجموع تناژ وزنه ورزشکاران</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl">
          <span className="text-xs text-zinc-400 block mb-1">نرخ تکمیل تمرینات</span>
          <div className="text-2xl font-black text-white">۸۷.۴٪</div>
          <span className="text-xs text-emerald-400 mt-2 block font-medium">پایبندی به ست‌های برنامه</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl">
          <span className="text-xs text-zinc-400 block mb-1">میانگین استمرار (Streak)</span>
          <div className="text-2xl font-black text-white">۶.۴ روز</div>
          <span className="text-xs text-amber-400 mt-2 block font-medium">پایداری تمرینی هفتگی</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Completed Exercises */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-amber-400" />
              محبوب‌ترین و پرتکرارترین حرکات ورزشی
            </h2>
            <span className="text-xs text-zinc-400">بر اساس جلسات ثبت‌شده</span>
          </div>

          <div className="space-y-3 pt-2">
            {topExercises.map((ex, idx) => (
              <div key={ex.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-zinc-800 text-amber-400 font-mono font-bold flex items-center justify-center text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="text-white font-bold">{ex.name}</span>
                    <span className="text-zinc-500">({ex.muscle})</span>
                  </div>
                  <span className="text-zinc-400 font-mono">{ex.count} بار اجرا</span>
                </div>
                <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${ex.share}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    className="h-full bg-gradient-to-l from-amber-500 to-orange-400 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Goal Demographics */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-400" />
              توزیع اهداف ورزشی کاربران
            </h2>
            <span className="text-xs text-zinc-400">جامعه ورزشکاران کوچ من</span>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-purple-300 font-bold">عضله‌سازی و هایپرتروفی</span>
                <span className="text-zinc-400 font-mono">۵۸٪</span>
              </div>
              <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '58%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-cyan-300 font-bold">چربی‌سوزی و کات</span>
                <span className="text-zinc-400 font-mono">۲۶٪</span>
              </div>
              <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: '26%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-emerald-300 font-bold">افزایش قدرت و پاورلیفتینگ</span>
                <span className="text-zinc-400 font-mono">۱۲٪</span>
              </div>
              <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '12%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-amber-300 font-bold">سلامت و تندرستی عمومی</span>
                <span className="text-zinc-400 font-mono">۴٪</span>
              </div>
              <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '4%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
