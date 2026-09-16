import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { AchievementItem, WorkoutSession, PersonalRecord } from '../types';

export const SYSTEM_ACHIEVEMENTS: AchievementItem[] = [
  {
    achievementId: 'first_workout',
    titleFa: 'اولین تمرین',
    descriptionFa: 'ثبت و تکمیل اولین جلسه ورزشی در کوچ من',
    icon: '🏆',
    targetCount: 1,
    currentCount: 0,
    criteria: 'تکمیل ۱ جلسه تمرین',
    unlocked: false,
  },
  {
    achievementId: 'workouts_10',
    titleFa: '۱۰ تمرین مداوم',
    descriptionFa: 'تکمیل ۱۰ جلسه تمرینی در کارنامه ورزشی',
    icon: '🥇',
    targetCount: 10,
    currentCount: 0,
    criteria: 'تکمیل ۱۰ جلسه تمرین',
    unlocked: false,
  },
  {
    achievementId: 'workouts_50',
    titleFa: '۵۰ تمرین مستمر',
    descriptionFa: 'ثبت ۵۰ جلسه تمرین قدرتی سنگین و مداوم',
    icon: '⭐',
    targetCount: 50,
    currentCount: 0,
    criteria: 'تکمیل ۵۰ جلسه تمرین',
    unlocked: false,
  },
  {
    achievementId: 'workouts_100',
    titleFa: 'باشگاه صدتایی‌ها',
    descriptionFa: 'رسیدن به رکورد خارق‌العاده ۱۰۰ جلسه تمرینی',
    icon: '👑',
    targetCount: 100,
    currentCount: 0,
    criteria: 'تکمیل ۱۰۰ جلسه تمرین',
    unlocked: false,
  },
  {
    achievementId: 'streak_7',
    titleFa: 'پیوستگی ۷ روزه',
    descriptionFa: 'ثبت یک هفته پایبندی مداوم و بدون وقفه به تمرین',
    icon: '🔥',
    targetCount: 7,
    currentCount: 0,
    criteria: 'پیوستگی ۷ روز متوالی',
    unlocked: false,
  },
  {
    achievementId: 'streak_14',
    titleFa: '۲ هفته آتشین',
    descriptionFa: '۱۴ روز حفظ ریتم تمرینی و نظم مستمر',
    icon: '⚡',
    targetCount: 14,
    currentCount: 0,
    criteria: 'پیوستگی ۱۴ روز متوالی',
    unlocked: false,
  },
  {
    achievementId: 'streak_30',
    titleFa: '۳۰ روز تسلیم‌ناپذیر',
    descriptionFa: 'یک ماه کامل تعهد، استمرار و رژیم تمرینی',
    icon: '🛡️',
    targetCount: 30,
    currentCount: 0,
    criteria: 'پیوستگی ۳۰ روز متوالی',
    unlocked: false,
  },
  {
    achievementId: 'volume_5t',
    titleFa: 'بلندکننده ۵ تن',
    descriptionFa: 'مجموع تناژ جابجا شده از مرز ۵,۰۰۰ کیلوگرم گذشت',
    icon: '🏋️‍♂️',
    targetCount: 5000,
    currentCount: 0,
    criteria: 'حجم جابجایی ۵ تن',
    unlocked: false,
  },
  {
    achievementId: 'volume_20t',
    titleFa: 'غول جابجایی ۲۰ تن',
    descriptionFa: 'مجموع تناژ جابجا شده از مرز ۲۰,۰۰۰ کیلوگرم گذشت',
    icon: '💥',
    targetCount: 20000,
    currentCount: 0,
    criteria: 'حجم جابجایی ۲۰ تن',
    unlocked: false,
  },
  {
    achievementId: 'first_pr',
    titleFa: 'اولین رکورد شخصی',
    descriptionFa: 'ثبت اولین رکورد بیشینه (PR) در یکی از حرکات',
    icon: '🎯',
    targetCount: 1,
    currentCount: 0,
    criteria: 'ثبت ۱ رکورد جدید',
    unlocked: false,
  },
  {
    achievementId: 'prs_5',
    titleFa: 'استاد رکوردهای شخصی',
    descriptionFa: 'ثبت ۵ رکورد وزنه جدید در تمرینات مختلف',
    icon: '🎖️',
    targetCount: 5,
    currentCount: 0,
    criteria: 'ثبت ۵ رکورد جدید',
    unlocked: false,
  },
  {
    achievementId: 'water_streak_7',
    titleFa: 'مدال آب',
    descriptionFa: '۷ روز رسیدن به هدف هیدراتاسیون و نوشیدن آب کافی',
    icon: '💧',
    targetCount: 7,
    currentCount: 0,
    criteria: '۷ روز رسیدن به هدف آب',
    unlocked: false,
  },
  {
    achievementId: 'water_streak_30',
    titleFa: 'استاد آب',
    descriptionFa: '۳۰ روز متوالی پایبندی کامل به نوشیدن آب کافی',
    icon: '🌊',
    targetCount: 30,
    currentCount: 0,
    criteria: '۳۰ روز رسیدن به هدف آب',
    unlocked: false,
  },
  {
    achievementId: 'nutrition_checkin_7',
    titleFa: 'مدال تغذیه',
    descriptionFa: '۷ روز ثبت و پایبندی به برنامه غذایی و درشت‌مغذی‌ها',
    icon: '🥗',
    targetCount: 7,
    currentCount: 0,
    criteria: '۷ روز ثبت تغذیه',
    unlocked: false,
  },
  {
    achievementId: 'checkin_streak_7',
    titleFa: 'مدال استمرار',
    descriptionFa: '۷ روز تکمیل موفق چک‌این روزانه و ثبت بازخورد',
    icon: '⭐',
    targetCount: 7,
    currentCount: 0,
    criteria: '۷ روز چک‌این روزانه',
    unlocked: false,
  },
];

export class AchievementService {
  private static LOCAL_ACHIEVEMENTS_KEY = 'polad_user_achievements';

  static getLocalAchievements(): AchievementItem[] {
    try {
      const saved = localStorage.getItem(this.LOCAL_ACHIEVEMENTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Default initial populated achievements
    return SYSTEM_ACHIEVEMENTS.map((a) => {
      if (a.achievementId === 'first_workout' || a.achievementId === 'streak_7') {
        return { ...a, unlocked: true, unlockedAt: new Date(Date.now() - 86400000 * 5).toISOString(), currentCount: a.targetCount };
      }
      return a;
    });
  }

  static saveLocalAchievements(list: AchievementItem[]) {
    try {
      localStorage.setItem(this.LOCAL_ACHIEVEMENTS_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Could not save local achievements:', e);
    }
  }

  /**
   * Fetch achievements from Firestore or local storage
   */
  static async getUserAchievements(userId: string): Promise<AchievementItem[]> {
    const local = this.getLocalAchievements();
    if (!userId || userId === 'guest') return local;

    try {
      const snap = await getDocs(collection(db, `users/${userId}/achievements`));
      if (!snap.empty) {
        const remoteMap = new Map<string, AchievementItem>();
        snap.docs.forEach((d) => remoteMap.set(d.id, d.data() as AchievementItem));

        const merged = SYSTEM_ACHIEVEMENTS.map((sys) => {
          const remote = remoteMap.get(sys.achievementId);
          if (remote) return { ...sys, ...remote };
          return sys;
        });

        this.saveLocalAchievements(merged);
        return merged;
      }
    } catch (e) {
      console.warn('Fallback to local achievements:', e);
    }

    return local;
  }

  /**
   * Evaluate all achievements based on current user stats & return newly unlocked ones
   */
  static async evaluateAchievements(
    userId: string,
    params: {
      totalWorkouts: number;
      streakDays: number;
      totalVolumeKg: number;
      prCount: number;
      sessions?: WorkoutSession[];
      waterStreakDays?: number;
      nutritionDays?: number;
      checkInDays?: number;
    }
  ): Promise<{ newlyUnlocked: AchievementItem[]; allAchievements: AchievementItem[] }> {
    const currentList = await this.getUserAchievements(userId);
    const now = new Date().toISOString();
    const newlyUnlocked: AchievementItem[] = [];

    const updatedList = currentList.map((item) => {
      let isUnlocked = item.unlocked;
      let currentCount = item.currentCount || 0;

      switch (item.achievementId) {
        case 'first_workout':
          currentCount = params.totalWorkouts;
          if (!isUnlocked && params.totalWorkouts >= 1) isUnlocked = true;
          break;
        case 'workouts_10':
          currentCount = params.totalWorkouts;
          if (!isUnlocked && params.totalWorkouts >= 10) isUnlocked = true;
          break;
        case 'workouts_50':
          currentCount = params.totalWorkouts;
          if (!isUnlocked && params.totalWorkouts >= 50) isUnlocked = true;
          break;
        case 'workouts_100':
          currentCount = params.totalWorkouts;
          if (!isUnlocked && params.totalWorkouts >= 100) isUnlocked = true;
          break;
        case 'streak_7':
          currentCount = params.streakDays;
          if (!isUnlocked && params.streakDays >= 7) isUnlocked = true;
          break;
        case 'streak_14':
          currentCount = params.streakDays;
          if (!isUnlocked && params.streakDays >= 14) isUnlocked = true;
          break;
        case 'streak_30':
          currentCount = params.streakDays;
          if (!isUnlocked && params.streakDays >= 30) isUnlocked = true;
          break;
        case 'volume_5t':
          currentCount = params.totalVolumeKg;
          if (!isUnlocked && params.totalVolumeKg >= 5000) isUnlocked = true;
          break;
        case 'volume_20t':
          currentCount = params.totalVolumeKg;
          if (!isUnlocked && params.totalVolumeKg >= 20000) isUnlocked = true;
          break;
        case 'first_pr':
          currentCount = params.prCount;
          if (!isUnlocked && params.prCount >= 1) isUnlocked = true;
          break;
        case 'prs_5':
          currentCount = params.prCount;
          if (!isUnlocked && params.prCount >= 5) isUnlocked = true;
          break;
        case 'water_streak_7':
          currentCount = params.waterStreakDays || 0;
          if (!isUnlocked && currentCount >= 7) isUnlocked = true;
          break;
        case 'water_streak_30':
          currentCount = params.waterStreakDays || 0;
          if (!isUnlocked && currentCount >= 30) isUnlocked = true;
          break;
        case 'nutrition_checkin_7':
          currentCount = params.nutritionDays || 0;
          if (!isUnlocked && currentCount >= 7) isUnlocked = true;
          break;
        case 'checkin_streak_7':
          currentCount = params.checkInDays || 0;
          if (!isUnlocked && currentCount >= 7) isUnlocked = true;
          break;
        default:
          break;
      }

      if (isUnlocked && !item.unlocked) {
        const unlockedItem: AchievementItem = {
          ...item,
          unlocked: true,
          unlockedAt: now,
          currentCount,
        };
        newlyUnlocked.push(unlockedItem);
        return unlockedItem;
      }

      return { ...item, currentCount };
    });

    // Save to local cache
    this.saveLocalAchievements(updatedList);

    // Save newly unlocked to Firestore
    if (userId && userId !== 'guest' && newlyUnlocked.length > 0) {
      for (const ach of newlyUnlocked) {
        try {
          await setDoc(doc(db, `users/${userId}/achievements`, ach.achievementId), ach, { merge: true });
        } catch (e) {
          console.warn('Error saving achievement to Firestore:', e);
        }
      }
    }

    return { newlyUnlocked, allAchievements: updatedList };
  }
}
