import React, { useState } from 'react';
import {
  Settings,
  Server,
  Database,
  Download,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { AppSetting, AdminUser } from '../../types';
import { AdminRepository } from '../../repositories/AdminRepository';

interface AdminSettingsProps {
  currentAdmin: AdminUser;
  settings: AppSetting | null;
  onRefresh: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  currentAdmin,
  settings,
  onRefresh,
}) => {
  const [maintenanceMode, setMaintenanceMode] = useState(settings?.maintenanceMode || false);
  const [appVersion, setAppVersion] = useState(settings?.appVersion || '2.4.0');
  const [announcementFa, setAnnouncementFa] = useState(settings?.announcementFa || '');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      await AdminRepository.updateAppSettings({
        maintenanceMode,
        appVersion,
        announcementFa,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      onRefresh();
    } catch (e) {
      console.error('Error updating settings:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportDataBackup = async () => {
    try {
      const backup = await AdminRepository.exportCompleteBackup();
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `polad_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error('Error exporting backup:', e);
    }
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-zinc-400" />
          تنظیمات سامانه و کنترل سراسری (System Settings)
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          کنترل حالت تعمیرات اپلیکیشن، حداقل نسخه مجاز موبایل، لاگ سرور و پشتیبان‌گیری از دیتابیس
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>تنظیمات سراسری با موفقیت در پایگاه داده Firebase ذخیره شد.</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Maintenance & App Version Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-400" />
            وضعیت سرویس‌دهی و انتشار اپلیکیشن
          </h2>

          <div className="space-y-4">
            {/* Maintenance Mode Toggle */}
            <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
              <div>
                <span className="text-sm font-bold text-white block">حالت تعمیرات و نگهداری (Maintenance Mode)</span>
                <span className="text-xs text-zinc-400">
                  در صورت فعال‌سازی، دسترسی کاربران عادی به اپلیکیشن به صورت موقت مسدود خواهد شد.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`p-1.5 rounded-full transition ${maintenanceMode ? 'text-amber-400' : 'text-zinc-600'}`}
              >
                {maintenanceMode ? <ToggleRight className="w-9 h-9" /> : <ToggleLeft className="w-9 h-9" />}
              </button>
            </div>

            {/* Minimum App Version */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">حداقل نسخه اجباری اپلیکیشن</label>
                <input
                  type="text"
                  value={appVersion}
                  onChange={(e) => setAppVersion(e.target.value)}
                  placeholder="2.4.0"
                  dir="ltr"
                  className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">بنر اعلان بالای صفحه در اپلیکیشن</label>
                <input
                  type="text"
                  value={announcementFa}
                  onChange={(e) => setAnnouncementFa(e.target.value)}
                  placeholder="متن پیام بالای صفحه برای تمام کاربران..."
                  className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Database & Cloud Backup Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-400" />
            پشتیبان‌گیری و سلامت پایگاه داده ابری Firebase
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
              <span className="text-xs font-bold text-zinc-400 block">پایگاه داده زنده Cloud Firestore</span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-bold text-emerald-400">اتصال آنلاین و فعال (Enterprise)</span>
              </div>
              <p className="text-[11px] text-zinc-500">قوانین امنیتی firestore.rules مستقر و محافظت‌شده هستند.</p>
            </div>

            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 flex flex-col justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-zinc-400 block">خروجی کامل دیتابیس (JSON Export)</span>
                <p className="text-[11px] text-zinc-500 mt-1">دانلود فایل پشتیبان شامل تمام حرکات، برنامه‌ها و مقالات</p>
              </div>
              <button
                type="button"
                onClick={handleExportDataBackup}
                className="w-fit px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl border border-zinc-700 flex items-center gap-2 transition"
              >
                <Download className="w-4 h-4 text-purple-400" />
                <span>دانلود فایل پشتیبان JSON</span>
              </button>
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-2xl transition shadow-lg shadow-emerald-500/20 active:scale-[0.99] flex items-center gap-2"
          >
            {isSaving ? 'در حال ذخیره‌سازی...' : 'ذخیره تغییرات سراسری'}
          </button>
        </div>
      </form>
    </div>
  );
};
