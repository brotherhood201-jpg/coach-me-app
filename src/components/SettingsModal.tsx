import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Settings,
  User,
  Shield,
  FileText,
  AlertTriangle,
  LogOut,
  Trash2,
  Bell,
  Volume2,
  Smartphone,
  ChevronLeft,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { UserProfile } from '../types';
import { UserRepository } from '../repositories/UserRepository';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onLogout: () => void;
  onEditProfile: () => void;
  onAccountDeleted: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onLogout,
  onEditProfile,
  onAccountDeleted,
}) => {
  const [activeSubView, setActiveSubView] = useState<'main' | 'privacy' | 'terms' | 'disclaimer' | 'about'>('main');

  // Local settings switches
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrateEnabled, setVibrateEnabled] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      if (userProfile.userId && userProfile.userId !== 'guest') {
        await UserRepository.deleteAccount(userProfile.userId);
      }
      localStorage.clear();
      onAccountDeleted();
    } catch (e) {
      console.error('Error deleting account:', e);
      localStorage.clear();
      onAccountDeleted();
    } finally {
      setIsDeletingAccount(false);
    }
  };

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
          className="relative w-full max-w-xl max-h-[88vh] bg-[#0c0c0c] border border-white/10 rounded-[36px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden z-10 text-right backdrop-blur-2xl"
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-zinc-950/80 sticky top-0 z-10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              {activeSubView !== 'main' ? (
                <button
                  onClick={() => setActiveSubView('main')}
                  className="p-2 rounded-2xl bg-white/[0.05] text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/5"
                >
                  <ChevronLeft className="w-5 h-5 rotate-180" />
                </button>
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-orange-600/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Settings className="w-5 h-5" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-black text-white">
                  {activeSubView === 'main' && 'تنظیمات و حساب کاربری'}
                  {activeSubView === 'privacy' && 'سیاست حفظ حریم خصوصی'}
                  {activeSubView === 'terms' && 'قوانین و شرایط استفاده'}
                  {activeSubView === 'disclaimer' && 'سلب مسئولیت پزشکی و ورزشی'}
                  {activeSubView === 'about' && 'درباره اپلیکیشن کوچ من'}
                </h3>
                <p className="text-xs text-zinc-400">
                  {activeSubView === 'main'
                    ? 'شخصی‌سازی، حریم خصوصی و مدیریت اشتراک'
                    : 'اسناد قانونی و استاندارد بین‌المللی'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-white/[0.05] text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub-views content */}
          {activeSubView === 'privacy' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-zinc-300 leading-relaxed">
              <h4 className="text-sm font-bold text-white">سیاست حریم خصوصی (Privacy Policy)</h4>
              <p>
                حفظ امنیت اطلاعات کاربران برای اپلیکیشن کوچ من از بالاترین اولویت برخوردار است.
                داده‌های شخصی شما شامل وزن، قد، برنامه‌های تمرینی و لاگ وزنه‌ها صرفاً جهت شخصی‌سازی
                الگوریتم‌های تمرین و نمایش نمودارهای پیشرفت ذخیره می‌گردند.
              </p>
              <p>
                اطلاعات شما با استفاده از پروتکل‌های امنیتی استاندارد و قوانین سخت‌گیرانه فایربیس
                (Cloud Firestore Security Rules) رمزنگاری شده و تحت هیچ شرایطی به اشخاص ثالث فروخته یا
                واگذار نخواهد شد.
              </p>
              <p>
                شما در هر زمان می‌توانید با مراجعه به بخش تنظیمات، کلیه سوابق و اطلاعات خود را به صورت
                دائمی حذف نمایید.
              </p>
            </div>
          )}

          {activeSubView === 'terms' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-zinc-300 leading-relaxed">
              <h4 className="text-sm font-bold text-white">قوانین و شرایط استفاده (Terms of Service)</h4>
              <p>
                با استفاده از اپلیکیشن کوچ من، شما موافقت می‌نمایید که از محتوا، آموزش‌ها و
                برنامه‌های این سامانه به صورت شخصی و غیرتجاری استفاده فرمایید.
              </p>
              <p>
                کلیه حقوق مادی و معنوی محتوای بصری، بیومکانیک و طرح‌های تمرینی متعلق به سامانه کوچ من
                می‌باشد.
              </p>
            </div>
          )}

          {activeSubView === 'disclaimer' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-zinc-300 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-amber-300">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span className="font-bold">هشدار سلامتی و توصیه پزشکی</span>
              </div>
              <p>
                اطلاعات و تمرینات ارائه شده در این برنامه جنبه آموزشی و عمومی دارند و به هیچ وجه جایگزین
                مشاوره، تشخیص یا درمان توسط پزشک متخصص یا فیزیوتراپیست نیستند.
              </p>
              <p>
                پیش از شروع هرگونه برنامه تمرینی سنگین یا ایجاد تغییر در رژیم غذایی خود، با پزشک معتمد
                مشورت فرمایید. در صورت احساس هرگونه درد غیرطبیعی، تنگی نفس یا سرگیجه بلافاصله تمرین را متوقف
                فرمایید.
              </p>
            </div>
          )}

          {activeSubView === 'about' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-center">
              <div className="w-16 h-16 rounded-3xl bg-orange-600/20 border border-orange-500/30 mx-auto flex items-center justify-center text-orange-400 font-bold text-2xl">
                🏋️‍♂️
              </div>
              <h4 className="text-base font-black text-white">کوچ من (نسخه ۱.۰.۰)</h4>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                سامانه هوشمند مربیگری و بدنسازی طراحی شده برای ورزشکاران حرفه‌ای با پشتیبانی کامل از زبان
                فارسی، تایمر پیشرفته استراحت، پایش بیومتریک و اتصال ابری.
              </p>
              <div className="text-[11px] text-zinc-500 font-mono pt-4 border-t border-white/5">
                توسعه یافته با استانداردهای مدرن PWA و فایربیس
              </div>
            </div>
          )}

          {/* Main Settings List */}
          {activeSubView === 'main' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Profile Card */}
              <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 p-0.5">
                    <div className="w-full h-full rounded-[14px] bg-[#0c0c0c] flex items-center justify-center text-orange-400 font-black text-lg">
                      {userProfile.name?.slice(0, 1) || 'ع'}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{userProfile.name || 'علیرضا'}</h4>
                    <span className="text-xs text-zinc-400 font-mono">
                      {userProfile.email || 'کاربر مهمان'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onEditProfile();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-500/30 text-xs font-bold transition-colors cursor-pointer"
                >
                  ویرایش مشخصات
                </button>
              </div>

              {/* Preferences Section */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-zinc-400">ترجیحات و صدا</h5>

                <div className="space-y-2">
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Volume2 className="w-4 h-4 text-orange-400" />
                      <span className="text-xs font-bold text-white">صدای پایان تایمر استراحت</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={soundEnabled}
                      onChange={(e) => setSoundEnabled(e.target.checked)}
                      className="w-4 h-4 accent-orange-500 cursor-pointer"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-4 h-4 text-orange-400" />
                      <span className="text-xs font-bold text-white">ویبره هنگام ثبت ست</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={vibrateEnabled}
                      onChange={(e) => setVibrateEnabled(e.target.checked)}
                      className="w-4 h-4 accent-orange-500 cursor-pointer"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="w-4 h-4 text-orange-400" />
                      <span className="text-xs font-bold text-white">یادآور روزانه زمان تمرین</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={reminderEnabled}
                      onChange={(e) => setReminderEnabled(e.target.checked)}
                      className="w-4 h-4 accent-orange-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Legal Links */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-zinc-400">قوانین و پشتیبانی</h5>

                <div className="space-y-2">
                  <button
                    onClick={() => setActiveSubView('privacy')}
                    className="w-full p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 flex items-center justify-between cursor-pointer transition-colors text-right"
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-zinc-400" />
                      <span className="text-xs font-bold text-white">سیاست حفظ حریم خصوصی</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-zinc-500" />
                  </button>

                  <button
                    onClick={() => setActiveSubView('terms')}
                    className="w-full p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 flex items-center justify-between cursor-pointer transition-colors text-right"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-zinc-400" />
                      <span className="text-xs font-bold text-white">قوانین و شرایط استفاده</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-zinc-500" />
                  </button>

                  <button
                    onClick={() => setActiveSubView('disclaimer')}
                    className="w-full p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 flex items-center justify-between cursor-pointer transition-colors text-right"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-white">سلب مسئولیت پزشکی</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-zinc-500" />
                  </button>

                  <button
                    onClick={() => setActiveSubView('about')}
                    className="w-full p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 flex items-center justify-between cursor-pointer transition-colors text-right"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-zinc-400" />
                      <span className="text-xs font-bold text-white">درباره اپلیکیشن کوچ من</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-zinc-500" />
                  </button>
                </div>
              </div>

              {/* Account Management Actions */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <button
                  onClick={onLogout}
                  className="w-full p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-xs font-bold text-zinc-300 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>خروج از حساب کاربری</span>
                </button>

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full p-3.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-bold text-red-400 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>حذف کامل حساب کاربری و سوابق</span>
                </button>
              </div>
            </div>
          )}

          {/* Delete Account Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/90 z-20 flex items-center justify-center p-6 text-right">
              <div className="max-w-sm w-full bg-[#121212] border border-red-500/30 rounded-3xl p-6 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="text-center space-y-1">
                  <h4 className="text-base font-black text-white">آیا از حذف حساب اطمینان دارید؟</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    تمامی سوابق تمرین، رکوردها و اطلاعات ابری شما به صورت برگشت‌ناپذیر پاک خواهند شد.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-3 rounded-xl bg-white/[0.05] text-xs font-bold text-zinc-300"
                  >
                    انصراف
                  </button>
                  <button
                    disabled={isDeletingAccount}
                    onClick={handleDeleteAccount}
                    className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                  >
                    {isDeletingAccount ? 'در حال حذف...' : 'بله، حذف کن'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
