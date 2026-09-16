import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, CheckCircle, Trash2, Dumbbell, Trophy, Sparkles, CheckCheck } from 'lucide-react';
import { NotificationItem } from '../types';
import { NotificationRepository } from '../repositories/AdditionalRepositories';
import { DotMatrixNumber } from './common/DotMatrixNumber';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  onClearUnreadCount?: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  userId = 'guest',
  onClearUnreadCount,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      NotificationRepository.getNotifications(userId).then((list) => {
        if (list.length > 0) {
          setNotifications(list);
        } else {
          setNotifications([
            {
              notificationId: 'notif-1',
              userId,
              titleFa: 'وقت تمرین امروزته 💪',
              bodyFa: 'برنامه سینه و پشت‌بازو با ۶ حرکت آماده اجرای شماست.',
              type: 'workout_reminder',
              read: false,
              createdAt: 'امروز، ساعت ۱۸:۳۰',
            },
            {
              notificationId: 'notif-2',
              userId,
              titleFa: 'پیوستگی ۱۲ روزه ثبت شد 🔥',
              bodyFa: 'فقط ۲ روز تا رسیدن به نشان ۲ هفته پایبندی مداوم فاصله داری!',
              type: 'streak_milestone',
              read: true,
              createdAt: 'دیروز',
            },
            {
              notificationId: 'notif-3',
              userId,
              titleFa: 'مقاله جدید هایپرتروفی منتشر شد 📚',
              bodyFa: 'اصول علمی زمان‌بندی پروتئین و ریکاوری خواب را در بخش مقالات مطالعه کنید.',
              type: 'content',
              read: true,
              createdAt: '۳ روز پیش',
            },
          ]);
        }
      });
      if (onClearUnreadCount) onClearUnreadCount();
    }
  }, [isOpen, userId, onClearUnreadCount]);

  if (!isOpen) return null;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.notificationId !== id));
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
              <div className="w-10 h-10 rounded-2xl bg-orange-600/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">مرکز اعلان‌ها و یادآورها</h3>
                <p className="text-xs text-zinc-400">یادآورهای تمرینی، پیام‌های سیستم و رکوردها</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-white/[0.05] text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action toolbar */}
          <div className="p-3 px-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">
              {notifications.filter((n) => !n.read).length} اعلان خوانده‌نشده
            </span>
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
              <span>علامت‌گذاری همه به‌عنوان خوانده‌شده</span>
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {notifications.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-14 h-14 rounded-3xl bg-white/[0.02] border border-white/5 mx-auto flex items-center justify-center text-zinc-500">
                  <Bell className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-zinc-300">اعلانی وجود ندارد</h4>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  پیام‌های یادآوری تمرین و رکوردها در این بخش نمایش داده می‌شوند.
                </p>
              </div>
            ) : (
              notifications.map((notif) => {
                return (
                  <div
                    key={notif.notificationId}
                    className={`p-4 rounded-3xl border transition-all flex items-start justify-between gap-3 ${
                      notif.read
                        ? 'bg-white/[0.01] border-white/5 opacity-70'
                        : 'bg-orange-600/10 border-orange-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-2xl bg-white/[0.05] text-orange-400 shrink-0 mt-0.5">
                        {notif.type === 'workout_reminder' && <Dumbbell className="w-4 h-4" />}
                        {notif.type === 'pr_achievement' && <Trophy className="w-4 h-4" />}
                        {notif.type === 'streak_milestone' && <Sparkles className="w-4 h-4" />}
                        {notif.type === 'content' && <Bell className="w-4 h-4" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">{notif.titleFa}</h4>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed">{notif.bodyFa}</p>
                        <span className="text-[10px] text-zinc-500 block font-mono">
                          {notif.createdAt}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(notif.notificationId)}
                      className="p-1.5 rounded-xl text-zinc-500 hover:text-red-400 transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
