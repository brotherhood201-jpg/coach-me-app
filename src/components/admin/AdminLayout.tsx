import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Dumbbell,
  Calendar,
  FileText,
  Video,
  Apple,
  Bell,
  Award,
  Tag,
  Image as ImageIcon,
  Clock,
  TrendingUp,
  Settings,
  Search,
  LogOut,
  Smartphone,
  Menu,
  X,
  Shield,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Database,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminUser } from '../../types';
import { AdminGlobalSearchModal } from './AdminGlobalSearchModal';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

interface AdminLayoutProps {
  currentAdmin: AdminUser;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onLogout: () => void;
  onSwitchToApp: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentAdmin,
  activeTab,
  onSelectTab,
  onLogout,
  onSwitchToApp,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  // Keyboard shortcut for Command/Ctrl + K to open search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'داشبورد فرماندهی', icon: LayoutDashboard },
    { id: 'programRequests', label: 'درخواست‌های برنامه', icon: ClipboardList, badge: 'کوچینگ' },
    { id: 'users', label: 'مدیریت کاربران', icon: Users },
    { id: 'exercises', label: 'بانک حرکات ورزشی', icon: Dumbbell },
    { id: 'programs', label: 'برنامه‌های تمرینی', icon: Calendar },
    { id: 'articles', label: 'مقالات و وبلاگ', icon: FileText },
    { id: 'videos', label: 'ویدیوهای آموزشی', icon: Video },
    { id: 'nutrition', label: 'بانک اطلاعات تغذیه', icon: Apple },
    { id: 'notifications', label: 'مرکز ارسال اعلان‌ها', icon: Bell },
    { id: 'achievements', label: 'دستاوردها و نشان‌ها', icon: Award },
    { id: 'categories', label: 'دسته‌بندی‌ها و عضلات', icon: Tag },
    { id: 'media', label: 'کتابخانه رسانه‌ها', icon: ImageIcon },
    { id: 'audit', label: 'رویدادها و ردپای امنیتی', icon: Clock },
    { id: 'analytics', label: 'تحلیل داده‌ها و آمار', icon: TrendingUp },
    { id: 'seed', label: 'داده‌های اولیه و سیدر', icon: Database, badge: 'پکیج ۵۰+۵' },
    { id: 'settings', label: 'تنظیمات سامانه', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col selection:bg-emerald-500 selection:text-black" dir="rtl">
      {/* Search Modal */}
      <AdminGlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onNavigate={(tabId) => {
          onSelectTab(tabId);
          setSearchModalOpen(false);
        }}
      />

      <div className="flex flex-1 relative overflow-hidden">
        {/* Mobile Sidebar Backdrop */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar Navigation */}
        <aside
          className={`fixed top-0 right-0 bottom-0 z-50 w-72 bg-zinc-900 border-l border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Logo & Brand Header */}
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-zinc-900 rounded-[14px] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <h1 className="font-black text-white text-base tracking-tight">کوچ من</h1>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  پنل مدیریت مرکزی
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20 font-black'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-zinc-950' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] rounded-full bg-zinc-800 text-zinc-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick switch to App & Admin Session Footer */}
          <div className="p-4 border-t border-zinc-800 space-y-3 bg-zinc-950/40">
            <button
              type="button"
              onClick={onSwitchToApp}
              className="w-full py-2.5 px-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 border border-zinc-700"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>مشاهده اپلیکیشن بدنسازی</span>
            </button>

            <div className="flex items-center justify-between pt-2 text-xs">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs flex-shrink-0">
                  {currentAdmin.name ? currentAdmin.name[0] : 'A'}
                </div>
                <div className="truncate">
                  <div className="font-bold text-white text-xs truncate">{currentAdmin.name}</div>
                  <div className="text-[10px] text-zinc-500 truncate" dir="ltr">{currentAdmin.email}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="p-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition"
                title="خروج از پنل مدیریت"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar */}
          <header className="h-16 border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-xl sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Global Search Button */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="flex items-center gap-3 px-4 py-2 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-2xl text-zinc-400 text-xs transition"
              >
                <Search className="w-4 h-4 text-zinc-500" />
                <span className="hidden sm:inline">جستجوی سریع در کل سامانه...</span>
                <span className="sm:hidden">جستجو</span>
                <kbd className="hidden sm:inline-block px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-500 font-mono">
                  Ctrl + K
                </kbd>
              </button>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onSwitchToApp}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700 transition"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>اپلیکیشن موبایل</span>
              </button>

              {/* Admin Profile Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-800 text-right transition"
                >
                  <div className="w-7 h-7 rounded-xl bg-emerald-500 text-zinc-950 font-black text-xs flex items-center justify-center">
                    {currentAdmin.name ? currentAdmin.name[0] : 'A'}
                  </div>
                  <span className="text-xs font-bold text-zinc-200 hidden md:inline">{currentAdmin.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                </button>

                <AnimatePresence>
                  {adminMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute left-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl p-2 shadow-2xl z-50 text-right space-y-1"
                    >
                      <div className="p-3 border-b border-zinc-800">
                        <div className="font-bold text-white text-xs">{currentAdmin.name}</div>
                        <div className="text-[10px] text-zinc-400 font-mono mt-0.5" dir="ltr">{currentAdmin.email}</div>
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                          نقش: {currentAdmin.role === 'super_admin' ? 'مدیر کل (SuperAdmin)' : 'مدیر محتوا'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setAdminMenuOpen(false);
                          onSelectTab('settings');
                        }}
                        className="w-full p-2 rounded-xl text-zinc-300 hover:bg-zinc-800 text-xs font-medium flex items-center gap-2 transition"
                      >
                        <Settings className="w-4 h-4 text-zinc-400" />
                        <span>تنظیمات سامانه</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAdminMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full p-2 rounded-xl text-red-400 hover:bg-red-500/10 text-xs font-bold flex items-center gap-2 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>خروج از حساب</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>

          {/* Main View Container */}
          <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
