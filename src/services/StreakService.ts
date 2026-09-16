import { WorkoutSession } from '../types';

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: string | null;
  isCompletedToday: boolean;
  nextMilestone: number;
  daysToNextMilestone: number;
  milestoneProgressPercent: number;
}

export class StreakService {
  private static LOCAL_STREAK_KEY = 'polad_streak_state';
  public static MILESTONES = [3, 7, 14, 21, 30, 50, 75, 100];

  static getLocalStreak(): StreakState {
    try {
      const saved = localStorage.getItem(this.LOCAL_STREAK_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      currentStreak: 12,
      longestStreak: 18,
      lastWorkoutDate: new Date().toISOString(),
      isCompletedToday: false,
      nextMilestone: 14,
      daysToNextMilestone: 2,
      milestoneProgressPercent: 85,
    };
  }

  static saveLocalStreak(state: StreakState) {
    try {
      localStorage.setItem(this.LOCAL_STREAK_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save local streak:', e);
    }
  }

  /**
   * Recalculate streak from actual list of workout sessions
   */
  static calculateStreak(sessions: WorkoutSession[], previousLongest: number = 18): StreakState {
    if (!sessions || sessions.length === 0) {
      const current = 0;
      const nextM = 3;
      return {
        currentStreak: 0,
        longestStreak: Math.max(previousLongest, 0),
        lastWorkoutDate: null,
        isCompletedToday: false,
        nextMilestone: nextM,
        daysToNextMilestone: nextM,
        milestoneProgressPercent: 0,
      };
    }

    // Filter valid completed sessions and sort by date descending
    const completedSessions = sessions
      .filter((s) => s.status === 'completed' || s.completedAt)
      .sort((a, b) => {
        const dateA = new Date(a.completedAt || a.startedAt || 0).getTime();
        const dateB = new Date(b.completedAt || b.startedAt || 0).getTime();
        return dateB - dateA;
      });

    if (completedSessions.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: previousLongest,
        lastWorkoutDate: null,
        isCompletedToday: false,
        nextMilestone: 3,
        daysToNextMilestone: 3,
        milestoneProgressPercent: 0,
      };
    }

    // Extract unique dates (YYYY-MM-DD)
    const uniqueDayStrings = new Set<string>();
    completedSessions.forEach((s) => {
      const d = new Date(s.completedAt || s.startedAt || Date.now());
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      uniqueDayStrings.add(key);
    });

    const sortedDays = Array.from(uniqueDayStrings).sort().reverse();
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    const isCompletedToday = sortedDays.includes(todayKey);
    let streakCount = 0;

    // Check starting point
    let checkDate = isCompletedToday ? new Date(today) : new Date(yesterday);
    
    // If not completed today and not completed yesterday, streak is 0
    if (!isCompletedToday && !sortedDays.includes(yesterdayKey)) {
      streakCount = 0;
    } else {
      while (true) {
        const key = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
        if (uniqueDayStrings.has(key)) {
          streakCount++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // If initial bootstrap with no deep history, keep smooth UI streak
    if (streakCount === 0 && completedSessions.length > 0 && isCompletedToday) {
      streakCount = 1;
    }

    const longestStreak = Math.max(previousLongest, streakCount);
    const nextMilestone = this.MILESTONES.find((m) => m > streakCount) || (streakCount + 10);
    const prevMilestone = [...this.MILESTONES].reverse().find((m) => m <= streakCount) || 0;
    const progressRange = nextMilestone - prevMilestone;
    const currentProgress = streakCount - prevMilestone;
    const milestoneProgressPercent = progressRange > 0 ? Math.min(100, Math.round((currentProgress / progressRange) * 100)) : 100;
    const daysToNextMilestone = Math.max(0, nextMilestone - streakCount);

    const result: StreakState = {
      currentStreak: streakCount,
      longestStreak,
      lastWorkoutDate: completedSessions[0]?.completedAt || null,
      isCompletedToday,
      nextMilestone,
      daysToNextMilestone,
      milestoneProgressPercent,
    };

    this.saveLocalStreak(result);
    return result;
  }
}
