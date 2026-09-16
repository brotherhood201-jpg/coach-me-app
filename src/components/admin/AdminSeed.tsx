import React, { useState, useEffect } from 'react';
import {
  Database,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Dumbbell,
  Calendar,
  Layers,
  ShieldCheck,
  Zap,
  Info,
  ChevronLeft,
  Search,
  Check,
  Eye,
} from 'lucide-react';
import { SeedService, SeedStatus, SeedResult } from '../../services/SeedService';
import { SEED_50_EXERCISES, SEED_5_PROGRAMS } from '../../data/seedData';

interface AdminSeedProps {
  onRefresh?: () => void;
}

export const AdminSeed: React.FC<AdminSeedProps> = ({ onRefresh }) => {
  const [status, setStatus] = useState<SeedStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [result, setResult] = useState<SeedResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<'exercises' | 'programs'>('exercises');
  const [searchTerm, setSearchTerm] = useState('');

  const loadStatus = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const currentStatus = await SeedService.getSeedStatus();
      setStatus(currentStatus);
    } catch (e: any) {
      setErrorMsg(e.message || 'خطا در دریافت وضعیت پایگاه داده');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleStartSeed = async () => {
    setConfirmModalOpen(false);
    setSeeding(true);
    setProgressPercent(5);
    setProgressText('در حال آماده‌سازی عملیات...');
    setErrorMsg(null);
    setResult(null);

    try {
      const res = await SeedService.executeSeed((text, pct) => {
        setProgressText(text);
        setProgressPercent(pct);
      });
      setResult(res);
      await loadStatus();
      if (onRefresh) {
        onRefresh();
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'خطا در اجرای عملیات بارگذاری اولیه');
    } finally {
      setSeeding(false);
    }
  };

  const filteredExercises = SEED_50_EXERCISES.filter(
    (e) =>
      e.nameFa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.primaryMuscle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPrograms = SEED_5_PROGRAMS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.goal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.difficulty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-6" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-zinc-900 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/10">
              <Database className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight">
                  بارگذاری داده‌های اولیه (سیدر محتوا)
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Idempotent & Safe
                </span>
              </div>
              <p className="text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                تزریق پکیج جامع ۵۰ حرکت تخصصی، ۵ برنامه تمرینی استاندارد و ساختار رده‌بندی عضلات و تجهیزات به پایگاه داده Firebase بدون ایجاد داده تکراری.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={loadStatus}
              disabled={loading || seeding}
              className="px-4 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition flex items-center gap-2 border border-zinc-700/60 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
              بروزرسانی وضعیت
            </button>
            <button
              onClick={() => setConfirmModalOpen(true)}
              disabled={seeding || loading}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {status?.isSeeded ? 'اجرای دوباره (همگام‌سازی)' : 'شروع بارگذاری داده‌های اولیه'}
            </button>
          </div>
        </div>
      </div>

      {/* Seeding Progress Bar */}
      {seeding && (
        <div className="bg-zinc-900 border border-emerald-500/40 rounded-2xl p-6 shadow-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-emerald-400 font-bold flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              {progressText || 'در حال انجام عملیات...'}
            </span>
            <span className="text-zinc-400 font-mono font-bold">{progressPercent}٪</span>
          </div>
          <div className="w-full bg-zinc-950 h-3 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500">
            لطفاً تا پایان ثبت داده‌ها در Firestore پنجره را نبندید. اطلاعات با شناسه‌های یکتا و به‌صورت امن ثبت می‌شوند.
          </p>
        </div>
      )}

      {/* Success Notification */}
      {result && (
        <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="text-emerald-300 font-bold text-base">عملیات با موفقیت انجام شد</h4>
            <p className="text-emerald-100/80 text-sm mt-1">{result.message}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-emerald-300/90 font-medium">
              <span>✓ {result.exercisesCount} حرکت ورزشی</span>
              <span>✓ {result.programsCount} برنامه تمرینی</span>
              <span>✓ {result.categoriesCount + result.musclesCount + result.equipmentCount} دسته‌بندی و تجهیزات</span>
              <span className="text-zinc-400 font-mono">
                {new Date(result.timestamp).toLocaleTimeString('fa-IR')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="bg-rose-950/40 border border-rose-500/50 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="text-rose-300 font-bold text-base">خطا در فرآیند بارگذاری</h4>
            <p className="text-rose-100/80 text-sm mt-1">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">وضعیت دیتابیس</span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  status?.isSeeded ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="text-lg font-bold text-white">
                {status?.isSeeded ? 'داده‌ها وارد شده‌اند' : 'در انتظار بارگذاری'}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              {status?.lastSeededAt
                ? `آخرین اجرا: ${new Date(status.lastSeededAt).toLocaleDateString('fa-IR')}`
                : 'نسخه اولیه آماده تزریق'}
            </p>
          </div>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">حرکات ورزشی تخصصی</span>
            <Dumbbell className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <span className="text-2xl font-black text-white">
              {status?.firestoreExerciseCount || 0}
              <span className="text-xs font-normal text-zinc-400 mr-1.5">
                / {status?.totalPresetExercises || 50} حرکت
              </span>
            </span>
            <p className="text-xs text-zinc-500 mt-1">پوشش کامل تمام زوایای عضلانی</p>
          </div>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">برنامه‌های تمرینی استاندارد</span>
            <Calendar className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <span className="text-2xl font-black text-white">
              {status?.firestoreProgramCount || 0}
              <span className="text-xs font-normal text-zinc-400 mr-1.5">
                / {status?.totalPresetPrograms || 5} برنامه
              </span>
            </span>
            <p className="text-xs text-zinc-500 mt-1">هایپرتروفی، قدرتی، تفکیکی و بانوان</p>
          </div>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-semibold">رده‌بندی‌ها و تجهیزات</span>
            <Layers className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <span className="text-2xl font-black text-white">
              {(status?.totalPresetCategories || 0) +
                (status?.totalPresetMuscles || 0) +
                (status?.totalPresetEquipment || 0)}
            </span>
            <p className="text-xs text-zinc-500 mt-1">آرایه‌بندی عضلات، دسته‌ها و ابزارها</p>
          </div>
        </div>
      </div>

      {/* Dataset Details & Preview Section */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-400" />
              پیش‌نمایش محتوای پکیج اولیه کوچ من
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              مجموعه کامل ۵۰ تمرین علمی و ۵ برنامه آماده انتشار در اپلیکیشن
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="جستجو در محتوای پکیج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-xl pr-9 pl-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 transition w-56"
              />
            </div>

            <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              <button
                onClick={() => setPreviewTab('exercises')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  previewTab === 'exercises'
                    ? 'bg-emerald-500 text-zinc-950 shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" />
                حرکات (۵۰)
              </button>
              <button
                onClick={() => setPreviewTab('programs')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  previewTab === 'programs'
                    ? 'bg-emerald-500 text-zinc-950 shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                برنامه‌ها (۵)
              </button>
            </div>
          </div>
        </div>

        {/* Exercises Preview Table/Grid */}
        {previewTab === 'exercises' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[480px] overflow-y-auto pr-1">
            {filteredExercises.map((ex, idx) => (
              <div
                key={ex.id}
                className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-3.5 hover:border-zinc-700 transition space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-white line-clamp-1">{ex.nameFa}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-mono shrink-0">
                      #{idx + 1}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-mono mt-0.5 line-clamp-1">{ex.nameEn}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-900">
                  <span className="px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-900/40">
                    {ex.primaryMuscle}
                  </span>
                  <span className="text-zinc-400">{ex.equipment}</span>
                  <span className="text-zinc-500">{ex.difficulty}</span>
                </div>
              </div>
            ))}
            {filteredExercises.length === 0 && (
              <div className="col-span-full py-12 text-center text-zinc-500 text-xs">
                حرکتی منطبق با جستجوی شما یافت نشد.
              </div>
            )}
          </div>
        )}

        {/* Programs Preview Cards */}
        {previewTab === 'programs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPrograms.map((prog) => (
              <div
                key={prog.id}
                className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-4 hover:border-zinc-700 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">{prog.name}</h4>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{prog.description}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    {prog.daysPerWeek} روز در هفته
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">هدف: {prog.goal}</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">سطح: {prog.difficulty}</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    تعداد روزهای طراحی شده: {prog.days.length} جلسه
                  </span>
                </div>

                <div className="space-y-1 pt-2 border-t border-zinc-900 text-xs text-zinc-400">
                  {prog.days.map((day) => (
                    <div key={day.dayNumber} className="flex items-center justify-between text-[11px]">
                      <span>
                        روز {day.dayNumber}: {day.titleFa}
                      </span>
                      <span className="text-zinc-500">{day.exercises.length} حرکت</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {filteredPrograms.length === 0 && (
              <div className="col-span-full py-12 text-center text-zinc-500 text-xs">
                برنامه‌ای منطبق با جستجوی شما یافت نشد.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Safety & Architecture Note */}
      <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-5 flex items-start gap-4">
        <Info className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-400 leading-relaxed space-y-1">
          <p className="font-bold text-zinc-300">اطمینان از ایمنی داده‌ها و پایداری سامانه:</p>
          <p>
            عملیات سیدر دیتابیس به‌صورت کاملاً نامتقارن و غیرمخرب (Idempotent) با متد <code className="text-emerald-400">merge: true</code> اجرا می‌شود. این عملیات سوابق کاربران، جلسات تمرینی و حساب‌های کاربری را دستخوش تغییر قرار نمی‌دهد.
          </p>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">تأیید بارگذاری محتوای اولیه</h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                این عملیات محتوای اولیه کوچ من را به دیتابیس اضافه میکند. ادامه میدهید؟
              </p>
            </div>

            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-xs text-zinc-400 space-y-1.5">
              <div className="flex items-center justify-between">
                <span>حرکات استاندارد بدنسازی:</span>
                <span className="font-bold text-white">۵۰ حرکت کامل</span>
              </div>
              <div className="flex items-center justify-between">
                <span>برنامه‌های تمرینی علمی:</span>
                <span className="font-bold text-white">۵ برنامه چندروزه</span>
              </div>
              <div className="flex items-center justify-between">
                <span>دسته‌بندی‌ها و تجهیزات:</span>
                <span className="font-bold text-white">کامل و متقارن</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition"
              >
                انصراف
              </button>
              <button
                onClick={handleStartSeed}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                بله، ادامه بده
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
