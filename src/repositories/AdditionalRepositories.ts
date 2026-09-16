import { collection, doc, getDocs, setDoc, query, orderBy, limit } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../services/firebase';
import { BodyMeasurement, ProgressPhoto, NutritionLog, AchievementItem, NotificationItem, ArticleItem, VideoItem } from '../types';

export class ProgressRepository {
  static async saveBodyMeasurement(userId: string, measurement: Omit<BodyMeasurement, 'id' | 'userId'>): Promise<BodyMeasurement> {
    const id = `measure_${Date.now()}`;
    const item: BodyMeasurement = {
      id,
      userId,
      ...measurement,
    };
    await setDoc(doc(db, `users/${userId}/bodyMeasurements`, id), item);
    return item;
  }

  static async getBodyMeasurements(userId: string): Promise<BodyMeasurement[]> {
    try {
      const q = query(collection(db, `users/${userId}/bodyMeasurements`), orderBy('date', 'desc'), limit(30));
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data() as BodyMeasurement);
    } catch (e) {
      console.warn('Error fetching measurements:', e);
      return [];
    }
  }

  static async uploadProgressPhoto(userId: string, file: File | Blob, category: 'front' | 'side' | 'back'): Promise<ProgressPhoto> {
    const photoId = `photo_${Date.now()}`;
    const storagePath = `users/${userId}/progressPhotos/${photoId}.jpg`;
    const storageRef = ref(storage, storagePath);

    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);

    const record: ProgressPhoto = {
      photoId,
      userId,
      storageUrl: downloadUrl,
      date: new Date().toISOString(),
      category,
    };

    await setDoc(doc(db, `users/${userId}/progressPhotos`, photoId), record);
    return record;
  }
}

export class NutritionRepository {
  static async saveDailyLog(userId: string, log: Omit<NutritionLog, 'id' | 'userId'>): Promise<NutritionLog> {
    const id = `nutrition_${log.date.replace(/\//g, '_')}`;
    const item: NutritionLog = {
      id,
      userId,
      ...log,
    };
    await setDoc(doc(db, `users/${userId}/nutritionLogs`, id), item);
    return item;
  }

  static async getDailyLog(userId: string, date: string): Promise<NutritionLog | null> {
    try {
      const id = `nutrition_${date.replace(/\//g, '_')}`;
      const snap = await getDocs(collection(db, `users/${userId}/nutritionLogs`));
      const found = snap.docs.find((d) => d.id === id);
      return found ? (found.data() as NutritionLog) : null;
    } catch (e) {
      console.warn('Error fetching nutrition log:', e);
      return null;
    }
  }
}

export class NotificationRepository {
  static async getNotifications(userId: string): Promise<NotificationItem[]> {
    try {
      const snap = await getDocs(collection(db, `users/${userId}/notifications`));
      return snap.docs.map((d) => d.data() as NotificationItem);
    } catch (e) {
      return [
        {
          notificationId: 'notif-1',
          userId,
          titleFa: 'وقت تمرین امروزته 💪',
          bodyFa: 'جلسه سینه و پشت‌بازو آماده شده است.',
          type: 'workout_reminder',
          read: false,
          createdAt: new Date().toISOString(),
        },
      ];
    }
  }

  static async addNotification(userId: string, notif: Omit<NotificationItem, 'notificationId' | 'userId' | 'createdAt'>): Promise<void> {
    const notificationId = `notif_${Date.now()}`;
    await setDoc(doc(db, `users/${userId}/notifications`, notificationId), {
      notificationId,
      userId,
      ...notif,
      createdAt: new Date().toISOString(),
    });
  }
}

export class AchievementRepository {
  static async getUserAchievements(userId: string): Promise<AchievementItem[]> {
    const DEFAULT_ACHIEVEMENTS: AchievementItem[] = [
      { achievementId: 'ach-1', titleFa: 'اولین تمرین', descriptionFa: 'ثبت اولین جلسه ورزشی', icon: '🏆', unlocked: true },
      { achievementId: 'ach-2', titleFa: '۷ روز پیوسته', descriptionFa: 'ثبت یک هفته پایبندی مداوم به تمرین', icon: '🔥', unlocked: true },
      { achievementId: 'ach-3', titleFa: 'رکورد ۱۰۰ کیلوگرم', descriptionFa: 'رسیدن به رکورد ۱۰۰ کیلوگرم در پرس سینه', icon: '⚡', unlocked: false },
      { achievementId: 'ach-4', titleFa: '۵۰ تمرین فعال', descriptionFa: 'تکمیل ۵۰ جلسه تمرینی سنگین', icon: '🥇', unlocked: true },
    ];

    try {
      const snap = await getDocs(collection(db, `users/${userId}/achievements`));
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as AchievementItem);
      }
    } catch (e) {
      console.warn('Fallback to local achievements:', e);
    }
    return DEFAULT_ACHIEVEMENTS;
  }
}

export class ContentRepository {
  static async getArticles(): Promise<ArticleItem[]> {
    try {
      const snap = await getDocs(collection(db, 'articles'));
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as ArticleItem);
      }
    } catch (e) {}
    return [
      {
        id: 'art-1',
        title: 'اصول هایپرتروفی و حجم عضلانی در سیستم تفکیکی سینه',
        content: 'راهنمای کامل زمان‌بندی استراحت و افزایش حجم تمرینی...',
        category: 'آموزش تمرین',
        readingTime: 4,
        createdAt: new Date().toISOString(),
        published: true,
      },
    ];
  }

  static async getVideos(): Promise<VideoItem[]> {
    try {
      const snap = await getDocs(collection(db, 'videos'));
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as VideoItem);
      }
    } catch (e) {}
    return [
      {
        id: 'vid-1',
        title: 'تکنیک صحیح اجرای پرس سینه هالتر برای حداکثر انقباض',
        description: 'تحلیل بیومکانیک مچ، آرنج و زاویه شانه',
        category: 'تکنیک حرکات',
        videoUrl: 'https://example.com/video1.mp4',
        duration: 320,
        createdAt: new Date().toISOString(),
        published: true,
      },
    ];
  }
}
