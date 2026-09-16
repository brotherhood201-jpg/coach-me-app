import React, { useState, useEffect } from 'react';
import {
  Bell,
  Send,
  Trash2,
  CheckCircle,
  Users,
  Target,
  Sparkles,
  Radio,
  Clock,
} from 'lucide-react';
import { motion } from 'motion/react';
import { NotificationItem } from '../../types';
import { AdminRepository } from '../../repositories/AdminRepository';

export const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [titleFa, setTitleFa] = useState('');
  const [bodyFa, setBodyFa] = useState('');
  const [targetAudience, setTargetAudience] = useState<'all' | 'selected'>('all');
  const [notifType, setNotifType] = useState<NotificationItem['type']>('content');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await AdminRepository.getNotifications();
      setNotifications(data);
    } catch (e) {
      console.error('Error fetching notifications:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleFa || !bodyFa) return;

    setSending(true);
    try {
      await AdminRepository.createNotification({
        titleFa,
        bodyFa,
        type: notifType,
        targetAudience,
        read: false,
      });

      setTitleFa('');
      setBodyFa('');
      setSuccessMsg('اعلان با موفقیت برای تمامی کاربران ارسال گردید.');
      setTimeout(() => setSuccessMsg(null), 4000);
      loadNotifications();
    } catch (e) {
      console.error('Error sending notification:', e);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteNotif = async (id: string) => {
    try {
      await AdminRepository.deleteNotification(id);
      loadNotifications();
    } catch (e) {
      console.error('Error deleting notification:', e);
    }
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
          <Bell className="w-7 h-7 text-amber-400" />
          مرکز ارسال اعلان‌ها و پیام‌های همگانی (Broadcast Notifications)
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          ارسال اطلاعیه‌های انگیزشی، به‌روزرسانی برنامه‌های تمرینی و مقالات علمی به نوتیفیکیشن‌سنتر اپلیکیشن
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Compose Form */}
        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h2 className="text-base font-bold text-white">ایجاد و ارسال پیام فوری</h2>
          </div>

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSendNotification} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">عنوان اعلان *</label>
              <input
                type="text"
                required
                value={titleFa}
                onChange={(e) => setTitleFa(e.target.value)}
                placeholder="مثال: برنامه سینه هفته جدید بارگذاری شد 🔥"
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">نوع اعلان</label>
              <select
                value={notifType}
                onChange={(e) => setNotifType(e.target.value as any)}
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs"
              >
                <option value="content">محتوای جدید و مقالات</option>
                <option value="workout_reminder">یادآور زمان تمرین</option>
                <option value="pr_achievement">رکورد و دستاورد جدید</option>
                <option value="general">اطلاعیه عمومی سامانه</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">جامعه مخاطب</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTargetAudience('all')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                    targetAudience === 'all'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>تمام کاربران</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTargetAudience('selected')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                    targetAudience === 'selected'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <Target className="w-4 h-4" />
                  <span>کاربران فعال</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">متن کامل پیام *</label>
              <textarea
                rows={4}
                required
                value={bodyFa}
                onChange={(e) => setBodyFa(e.target.value)}
                placeholder="متن پیام اعلان که در گوشی کاربر نمایش داده می‌شود..."
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs leading-relaxed focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.99]"
            >
              <Send className="w-4 h-4" />
              <span>{sending ? 'در حال ارسال اعلان...' : 'ارسال همگانی اعلان'}</span>
            </button>
          </form>
        </div>

        {/* Sent History */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            تاریخچه اعلان‌های ارسال‌شده
          </h2>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {loading ? (
              <div className="py-12 text-center text-zinc-500 text-sm">در حال بارگذاری...</div>
            ) : notifications.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 text-sm">هنوز اعلانی ثبت نشده است.</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.notificationId}
                  className="p-4 bg-zinc-950 border border-zinc-800/80 rounded-2xl flex items-start justify-between gap-4 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <h4 className="font-bold text-white text-sm">{n.titleFa}</h4>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{n.bodyFa}</p>
                    <span className="text-[10px] text-zinc-500 font-mono block pt-1">
                      {new Date(n.createdAt).toLocaleDateString('fa-IR')} | مخاطب: {n.targetAudience === 'all' ? 'همه' : 'منتخب'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteNotif(n.notificationId)}
                    className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition"
                    title="حذف اعلان"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
