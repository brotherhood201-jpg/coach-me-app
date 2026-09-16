import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { DailyCheckIn } from '../types';
import { AchievementService } from './AchievementService';
import { NotificationService } from './NotificationService';

export class DailyCheckInService {
  private static LOCAL_CHECKIN_PREFIX = 'polad_checkin_';

  static getTodayDateStr(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  static getLocalCheckIn(userId: string, dateStr: string = this.getTodayDateStr()): DailyCheckIn | null {
    const key = `${this.LOCAL_CHECKIN_PREFIX}${userId}_${dateStr}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return null;
  }

  static saveLocalCheckIn(checkIn: DailyCheckIn): void {
    const key = `${this.LOCAL_CHECKIN_PREFIX}${checkIn.userId}_${checkIn.date}`;
    try {
      localStorage.setItem(key, JSON.stringify(checkIn));
    } catch (e) {
      console.warn('Could not save local checkin:', e);
    }
  }

  /**
   * Fetch today's check-in
   */
  static async getTodayCheckIn(userId: string, dateStr: string = this.getTodayDateStr()): Promise<DailyCheckIn | null> {
    const local = this.getLocalCheckIn(userId, dateStr);
    if (local) return local;

    if (!userId || userId === 'guest') return null;

    try {
      const ref = doc(db, `dailyCheckIns/${userId}_${dateStr}`);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as DailyCheckIn;
        this.saveLocalCheckIn(data);
        return data;
      }
    } catch (e) {
      console.warn('Error fetching daily check-in from Firestore:', e);
    }

    return null;
  }

  /**
   * Calculate daily score out of 10 and generate supportive feedback
   */
  static calculateScoreAndFeedback(params: {
    dietAdherence: 'very_low' | 'medium' | 'good' | 'great';
    workoutFeeling?: 'hard' | 'good' | 'great' | 'very_easy' | 'rest_day';
    energy: 'low' | 'normal' | 'good' | 'super';
    waterAchieved?: boolean;
    workoutDone?: boolean;
  }): { score: number; feedback: string } {
    let score = 5.0;

    // Diet adherence contribution (up to 3.0 points)
    if (params.dietAdherence === 'great') score += 3.0;
    else if (params.dietAdherence === 'good') score += 2.3;
    else if (params.dietAdherence === 'medium') score += 1.4;
    else score += 0.5;

    // Workout feeling contribution (up to 1.5 points)
    if (params.workoutFeeling === 'great' || params.workoutFeeling === 'good') score += 1.5;
    else if (params.workoutFeeling === 'hard' || params.workoutFeeling === 'rest_day') score += 1.2;
    else score += 0.8;

    // Energy contribution (up to 1.0 points)
    if (params.energy === 'super' || params.energy === 'good') score += 1.0;
    else if (params.energy === 'normal') score += 0.6;
    else score += 0.3;

    // Water bonus
    if (params.waterAchieved) score += 0.5;

    // Normalize between 1 and 10 with 1 decimal place
    const finalScore = Math.min(10, Math.max(1, Math.round(score * 10) / 10));

    let feedback = 'امروز تلاش ارزشمندی داشتی؛ هر روز یک قدم به جلو! 👏';
    if (finalScore >= 9.0) {
      feedback = 'امروز فوق‌العاده و بی‌نقص بودی! تعهد و استمرارت نتیجه میده 🏆';
    } else if (finalScore >= 7.5) {
      feedback = 'امروز خیلی خوب پیش رفتی؛ به ریتمت افتخار کن و با انرژی ادامه بده 💜';
    } else if (finalScore >= 6.0) {
      feedback = 'روز خوبی رو پشت سر گذاشتی؛ فردا یه قدم کوچیک بهترش می‌کنیم 🌱';
    } else {
      feedback = 'روزهای سخت هم بخشی از مسیره؛ استراحت کن، فردا پرقدرت‌تر از نو شروع می‌کنیم 💪';
    }

    return { score: finalScore, feedback };
  }

  /**
   * Save daily check-in
   */
  static async saveDailyCheckIn(
    userId: string,
    data: {
      dietAdherence: 'very_low' | 'medium' | 'good' | 'great';
      workoutFeeling?: 'hard' | 'good' | 'great' | 'very_easy' | 'rest_day';
      energy: 'low' | 'normal' | 'good' | 'super';
      notes?: string;
      waterAchieved?: boolean;
      workoutDone?: boolean;
    },
    dateStr: string = this.getTodayDateStr()
  ): Promise<DailyCheckIn> {
    const { score, feedback } = this.calculateScoreAndFeedback({
      dietAdherence: data.dietAdherence,
      workoutFeeling: data.workoutFeeling,
      energy: data.energy,
      waterAchieved: data.waterAchieved,
      workoutDone: data.workoutDone,
    });

    const adherenceScores = {
      very_low: 1,
      medium: 2,
      good: 3,
      great: 4,
    };

    const record: DailyCheckIn = {
      userId,
      date: dateStr,
      dietAdherence: data.dietAdherence,
      dietAdherenceScore: adherenceScores[data.dietAdherence] || 3,
      workoutFeeling: data.workoutFeeling || 'good',
      energy: data.energy,
      dailyScore: score,
      feedbackMessage: feedback,
      notes: data.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.saveLocalCheckIn(record);

    if (userId && userId !== 'guest') {
      try {
        await setDoc(doc(db, `dailyCheckIns/${userId}_${dateStr}`), record, { merge: true });
        await setDoc(doc(db, `users/${userId}/dailyCheckIns/${dateStr}`), record, { merge: true });
      } catch (e) {
        console.warn('Error saving daily checkin to Firestore:', e);
      }
    }

    // Trigger gamification
    this.evaluateCheckInAchievements(userId);

    return record;
  }

  private static async evaluateCheckInAchievements(userId: string) {
    try {
      const stats = JSON.parse(localStorage.getItem('alireza_workout_stats') || '{}');
      const streakDays = stats.streakDays || 7;
      const res = await AchievementService.evaluateAchievements(userId, {
        totalWorkouts: stats.totalWorkoutsDone || 10,
        streakDays,
        totalVolumeKg: stats.totalVolumeLiftedKg || 5000,
        prCount: 2,
        checkInDays: 7,
        nutritionDays: 7,
      });

      if (res.newlyUnlocked.length > 0) {
        for (const ach of res.newlyUnlocked) {
          await NotificationService.notifyAchievement(userId, ach);
        }
      }
    } catch {
      // fallback
    }
  }
}
