import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { WaterLog } from '../types';
import { AchievementService } from './AchievementService';
import { NotificationService } from './NotificationService';

export class WaterService {
  private static LOCAL_WATER_PREFIX = 'polad_water_';

  static getTodayDateStr(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  static getLocalWaterLog(userId: string, dateStr: string = this.getTodayDateStr()): WaterLog {
    const key = `${this.LOCAL_WATER_PREFIX}${userId}_${dateStr}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return {
      userId,
      date: dateStr,
      glasses: 5, // initial friendly starting state for user demo
      targetGlasses: 8,
      updatedAt: new Date().toISOString(),
    };
  }

  static saveLocalWaterLog(log: WaterLog): void {
    const key = `${this.LOCAL_WATER_PREFIX}${log.userId}_${log.date}`;
    try {
      localStorage.setItem(key, JSON.stringify(log));
    } catch (e) {
      console.warn('Could not save local water log:', e);
    }
  }

  /**
   * Fetch today's water log from Firestore or local storage
   */
  static async getWaterLog(userId: string, dateStr: string = this.getTodayDateStr()): Promise<WaterLog> {
    const local = this.getLocalWaterLog(userId, dateStr);
    if (!userId || userId === 'guest') return local;

    try {
      // Check top-level waterLogs collection
      const ref = doc(db, `waterLogs/${userId}_${dateStr}`);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as WaterLog;
        this.saveLocalWaterLog(data);
        return data;
      }
    } catch (e) {
      console.warn('Error fetching water log from Firestore:', e);
    }

    return local;
  }

  /**
   * Update water glasses count
   */
  static async updateWaterGlasses(
    userId: string,
    delta: number,
    targetGlasses: number = 8,
    dateStr: string = this.getTodayDateStr()
  ): Promise<WaterLog> {
    const current = await this.getWaterLog(userId, dateStr);
    const newCount = Math.max(0, current.glasses + delta);
    const updated: WaterLog = {
      ...current,
      glasses: newCount,
      targetGlasses: targetGlasses || current.targetGlasses || 8,
      updatedAt: new Date().toISOString(),
    };

    // Save locally
    this.saveLocalWaterLog(updated);

    // Save to Firestore
    if (userId && userId !== 'guest') {
      try {
        await setDoc(doc(db, `waterLogs/${userId}_${dateStr}`), updated, { merge: true });
        // Also sync to user subcollection
        await setDoc(doc(db, `users/${userId}/waterLogs/${dateStr}`), updated, { merge: true });
      } catch (e) {
        console.warn('Error saving water log to Firestore:', e);
      }
    }

    // Check achievement if target reached
    if (updated.glasses >= updated.targetGlasses) {
      this.evaluateWaterAchievements(userId);
    }

    return updated;
  }

  /**
   * Set target glasses
   */
  static async setTargetGlasses(
    userId: string,
    target: number,
    dateStr: string = this.getTodayDateStr()
  ): Promise<WaterLog> {
    const current = await this.getWaterLog(userId, dateStr);
    const updated: WaterLog = {
      ...current,
      targetGlasses: Math.max(4, Math.min(20, target)),
      updatedAt: new Date().toISOString(),
    };

    this.saveLocalWaterLog(updated);

    if (userId && userId !== 'guest') {
      try {
        await setDoc(doc(db, `waterLogs/${userId}_${dateStr}`), updated, { merge: true });
      } catch (e) {
        console.warn('Error saving water target:', e);
      }
    }

    return updated;
  }

  private static async evaluateWaterAchievements(userId: string) {
    try {
      const stats = JSON.parse(localStorage.getItem('alireza_workout_stats') || '{}');
      const streakDays = stats.streakDays || 7;
      const res = await AchievementService.evaluateAchievements(userId, {
        totalWorkouts: stats.totalWorkoutsDone || 10,
        streakDays,
        totalVolumeKg: stats.totalVolumeLiftedKg || 5000,
        prCount: 2,
        waterStreakDays: Math.min(streakDays, 7),
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
