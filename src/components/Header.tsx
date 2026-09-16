import React from 'react';
import { motion } from 'motion/react';
import { Bell, Shield, Flame } from 'lucide-react';
import { DotMatrixNumber } from './common/DotMatrixNumber';

interface HeaderProps {
  userName: string;
  energyLevel?: number;
  streakDays: number;
  isLoggedIn?: boolean;
  unreadNotificationsCount?: number;
  onOpenAuth: () => void;
  onOpenNotifications?: () => void;
  onOpenFavorites?: () => void;
  onOpenHistory?: () => void;
  onOpenCalendar?: () => void;
  onOpenPRs?: () => void;
  onOpenSettings?: () => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName,
  streakDays,
  isLoggedIn = false,
  unreadNotificationsCount = 0,
  onOpenAuth,
  onOpenNotifications,
  onOpenAdmin,
}) => {
  return (
    <header className="w-full pt-1 pb-3" dir="rtl">
      <div className="flex items-center justify-between gap-3">
        {/* User Greeting & Subtitle */}
        <div className="space-y-0.5">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-1.5"
          >
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
              <span>{userName ? `سلام ${userName}` : 'سلام، علیرضا'}</span>
              <motion.span
                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 3 }}
                className="inline-block origin-bottom-right"
              >
                👋
              </motion.span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08 }}
            className="text-zinc-400 text-xs sm:text-sm font-normal"
          >
            آماده‌ای امروز رو بسازی؟
          </motion.p>
        </div>

        {/* Left Controls: Streak Pill, Notifications & Profile Avatar */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Admin Panel Link (if coach) */}
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-violet-600/15 hover:bg-violet-600/25 text-violet-300 border border-violet-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(139,92,246,0.15)]"
              title="ورود به پنل مدیریت"
            >
              <Shield className="w-3.5 h-3.5 text-violet-400" />
              <span className="hidden sm:inline">پنل مربی</span>
            </button>
          )}

          {/* Streak pill badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#100b24]/85 border border-violet-500/35 text-violet-200 text-xs font-bold shadow-[0_0_15px_rgba(139,92,246,0.2)] backdrop-blur-xl">
            <Flame className="w-3.5 h-3.5 text-rose-400 fill-rose-400/20" />
            <DotMatrixNumber value={streakDays || 5} size="xs" glow="violet" color="violet" />
            <span className="text-[11px] font-normal text-zinc-300">روز استریک</span>
          </div>

          {/* Notifications button */}
          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              className="relative w-9 h-9 rounded-full bg-[#0d1224]/80 hover:bg-[#131b36] text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer flex items-center justify-center backdrop-blur-xl shadow-md"
              title="مرکز اعلان‌ها"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_#a855f7] animate-pulse" />
              )}
            </button>
          )}

          {/* Minimal Profile Avatar Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenAuth}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 p-[1.5px] shadow-[0_0_15px_rgba(139,92,246,0.3)] cursor-pointer flex items-center justify-center shrink-0"
            title={isLoggedIn ? userName : 'ورود / عضویت'}
          >
            <div className="w-full h-full bg-[#0a0f20] rounded-full flex items-center justify-center text-white text-xs font-black">
              {userName ? userName.slice(0, 1) : 'ع'}
            </div>
          </motion.button>
        </div>
      </div>
    </header>
  );
};

