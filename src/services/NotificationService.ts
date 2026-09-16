import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';
import { NotificationItem, PersonalRecord, AchievementItem, WorkoutSession } from '../types';
import { toPersianDigits } from '../utils/persian';

export class NotificationService {
  private static LOCAL_NOTIFS_KEY = 'polad_user_notifications';

  static getLocalNotifications(): NotificationItem[] {
    try {
      const saved = localStorage.getItem(this.LOCAL_NOTIFS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        notificationId: 'notif-1',
        titleFa: 'وقت تمرین امروزته 💪',
        bodyFa: 'جلسه تمرینی سینه و پشت‌بازو با ۶ حرکت آماده اجراست.',
        type: 'workout_reminder',
        read: false,
        createdAt: new Date().toISOString(),
      },
      {
        notificationId: 'notif-2',
        titleFa: 'پیوستگی ۱۲ روزه ثبت شد 🔥',
        bodyFa: 'فقط ۲ روز تا کسب نشان ۲ هفته استمرار فولادین فاصله داری!',
        type: 'streak_milestone',
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        notificationId: 'notif-3',
        titleFa: 'رکورد جدید در پرس سینه! 🏆',
        bodyFa: 'وزنه ۸۵ کیلوگرم ثبت شد و رکورد قبلی ارتقا یافت.',
        type: 'pr_achievement',
        read: true,
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
    ];
  }

  static saveLocalNotifications(list: NotificationItem[]) {
    try {
      localStorage.setItem(this.LOCAL_NOTIFS_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Could not save local notifications:', e);
    }
  }

  /**
   * Fetch notifications from Firestore or local storage
   */
  static async getNotifications(userId?: string): Promise<NotificationItem[]> {
    const local = this.getLocalNotifications();
    if (!userId || userId === 'guest') return local;

    try {
      const q = query(
        collection(db, `users/${userId}/notifications`),
        orderBy('createdAt', 'desc'),
        limit(40)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        const remote = snap.docs.map((d) => d.data() as NotificationItem);
        this.saveLocalNotifications(remote);
        return remote;
      }
    } catch (e) {
      console.warn('Error fetching notifications from Firestore:', e);
    }

    return local;
  }

  /**
   * Create an in-app notification
   */
  static async createNotification(
    userId: string,
    notif: Omit<NotificationItem, 'notificationId' | 'userId' | 'createdAt'>
  ): Promise<NotificationItem> {
    const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const now = new Date().toISOString();
    const item: NotificationItem = {
      notificationId,
      userId: userId || 'guest',
      ...notif,
      createdAt: now,
    };

    const currentList = this.getLocalNotifications();
    const updated = [item, ...currentList];
    this.saveLocalNotifications(updated);

    if (userId && userId !== 'guest') {
      try {
        await setDoc(doc(db, `users/${userId}/notifications`, notificationId), item);
      } catch (e) {
        console.warn('Error writing notification to Firestore:', e);
      }
    }

    // Try browser push if permission granted
    this.sendBrowserPushNotification(item.titleFa, item.bodyFa);

    return item;
  }

  /**
   * Specific trigger: New Personal Record
   */
  static async notifyPR(userId: string, pr: PersonalRecord, deltaKg?: number): Promise<void> {
    const improvementText = deltaKg && deltaKg > 0 ? ` (+${toPersianDigits(deltaKg)} کیلوگرم افزایش)` : '';
    await this.createNotification(userId, {
      titleFa: `رکورد جدید در ${pr.exerciseNameFa}! 🏆`,
      bodyFa: `شما موفق به جابجایی وزنه ${toPersianDigits(pr.maxWeightKg)} کیلوگرم (${toPersianDigits(pr.maxRepsAtWeight)} تکرار)${improvementText} شدید!`,
      type: 'pr_achievement',
      read: false,
    });
  }

  /**
   * Specific trigger: Unlocked Achievement
   */
  static async notifyAchievement(userId: string, achievement: AchievementItem): Promise<void> {
    await this.createNotification(userId, {
      titleFa: `مدال جدید کسب شد: ${achievement.titleFa} ${achievement.icon}`,
      bodyFa: achievement.descriptionFa,
      type: 'pr_achievement',
      read: false,
    });
  }

  /**
   * Specific trigger: Streak Milestone
   */
  static async notifyStreak(userId: string, streakDays: number): Promise<void> {
    await this.createNotification(userId, {
      titleFa: `پیوستگی ${toPersianDigits(streakDays)} روزه ثبت شد 🔥`,
      bodyFa: `تعهد و استمرار مثال‌زدنی شما به رکورد ${toPersianDigits(streakDays)} روز متوالی تمرین رسید. پرقدرت ادامه دهید!`,
      type: 'streak_milestone',
      read: false,
    });
  }

  /**
   * Specific trigger: Water Reminder
   */
  static async notifyWaterReminder(userId: string, glasses: number = 0, targetGlasses: number = 8): Promise<void> {
    await this.createNotification(userId, {
      titleFa: '💧 وقتشه یه لیوان آب بخوری.',
      bodyFa: 'یه جرعه کوچیک هم از هیچی بهتره 😉 تا الان ' + toPersianDigits(glasses) + ' از ' + toPersianDigits(targetGlasses) + ' لیوان خوردی.',
      type: 'general',
      read: false,
    });
  }

  /**
   * Specific trigger: Diet Reminder
   */
  static async notifyDietReminder(userId: string, mealTime: 'morning' | 'afternoon' | 'evening'): Promise<void> {
    let titleFa = '🍳 صبحانه یادت نره.';
    let bodyFa = 'تأمین سوخت کافی برای روز پرانرژی و حمایت از رشد عضلات!';

    if (mealTime === 'afternoon') {
      titleFa = '🍫 ممکنه الان هوس شیرینی کرده باشی 😄';
      bodyFa = 'یه میان‌وعده پروتئینی یا یه لیوان آب خنک حالتو جا میاره!';
    } else if (mealTime === 'evening') {
      titleFa = '🥗 وقت شامه؛ انتخاب امروزت رو هوشمندانه انجام بده.';
      bodyFa = 'یک وعده متعادل و سبک به خواب باکیفیت و ریکاوری شبانه کمک می‌کنه.';
    }

    await this.createNotification(userId, {
      titleFa,
      bodyFa,
      type: 'general',
      read: false,
    });
  }

  /**
   * Specific trigger: Sleep Reminder
   */
  static async notifySleepReminder(userId: string): Promise<void> {
    await this.createNotification(userId, {
      titleFa: '🌙 کم‌کم وقت خوابه.',
      bodyFa: 'فردای قوی از امشب شروع میشه. استراحت باکیفیت مهم‌ترین فاز رشد و چربی‌سوزیه.',
      type: 'general',
      read: false,
    });
  }

  /**
   * Specific trigger: Daily Check-in Reminder
   */
  static async notifyCheckInReminder(userId: string): Promise<void> {
    await this.createNotification(userId, {
      titleFa: '⭐ امروز چطور گذشت؟',
      bodyFa: 'یه دقیقه وقت بذار و وضعیت امروزت رو ثبت کن تا پرونده امروز بسته بشه!',
      type: 'general',
      read: false,
    });
  }

  /**
   * Specific trigger: Completed Workout Session
   */
  static async notifyWorkoutCompleted(userId: string, session: WorkoutSession): Promise<void> {
    const volumeKg = session.totalVolumeKg || 0;
    await this.createNotification(userId, {
      titleFa: `تمرین ${session.titleFa} با موفقیت ثبت شد ✅`,
      bodyFa: `مجموع حجم وزنه‌های جابجا شده: ${toPersianDigits(volumeKg)} کیلوگرم. خسته نباشی قهرمان!`,
      type: 'workout_reminder',
      read: false,
    });
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(userId: string, notificationId: string): Promise<void> {
    const current = this.getLocalNotifications();
    const updated = current.map((n) => (n.notificationId === notificationId ? { ...n, read: true } : n));
    this.saveLocalNotifications(updated);

    if (userId && userId !== 'guest') {
      try {
        await updateDoc(doc(db, `users/${userId}/notifications`, notificationId), { read: true });
      } catch (e) {
        console.warn('Error marking notification as read in Firestore:', e);
      }
    }
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(userId: string): Promise<void> {
    const current = this.getLocalNotifications();
    const updated = current.map((n) => ({ ...n, read: true }));
    this.saveLocalNotifications(updated);

    if (userId && userId !== 'guest') {
      try {
        for (const n of current.filter((item) => !item.read)) {
          await updateDoc(doc(db, `users/${userId}/notifications`, n.notificationId), { read: true });
        }
      } catch (e) {
        console.warn('Error updating all notifications:', e);
      }
    }
  }

  /**
   * Delete notification
   */
  static async deleteNotification(userId: string, notificationId: string): Promise<void> {
    const current = this.getLocalNotifications();
    const updated = current.filter((n) => n.notificationId !== notificationId);
    this.saveLocalNotifications(updated);

    if (userId && userId !== 'guest') {
      try {
        await deleteDoc(doc(db, `users/${userId}/notifications`, notificationId));
      } catch (e) {
        console.warn('Error deleting notification from Firestore:', e);
      }
    }
  }

  // ==========================================
  // Push Notification Readiness Abstraction
  // ==========================================

  static isPushSupported(): boolean {
    return 'Notification' in window;
  }

  static async requestPushPermission(): Promise<'granted' | 'denied' | 'default'> {
    if (!this.isPushSupported()) return 'denied';
    try {
      const perm = await Notification.requestPermission();
      return perm;
    } catch {
      return 'denied';
    }
  }

  static sendBrowserPushNotification(title: string, body: string, icon: string = '/icon.png') {
    if (this.isPushSupported() && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon,
          dir: 'rtl',
          lang: 'fa',
        });
      } catch {
        // Fallback for sandboxed iframes
      }
    }
  }
}
