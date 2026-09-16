import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  orderBy,
  limit,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { WorkoutSession, PersonalRecord, PreviousPerformance } from '../types';
import { PersonalRecordService } from '../services/PersonalRecordService';
import { AchievementService } from '../services/AchievementService';
import { StreakService } from '../services/StreakService';
import { NotificationService } from '../services/NotificationService';

export class WorkoutRepository {
  private static SESSIONS_LOCAL_KEY = 'polad_workout_sessions_history';

  static getLocalSessions(): WorkoutSession[] {
    try {
      const saved = localStorage.getItem(this.SESSIONS_LOCAL_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }

    // Default rich sample sessions for offline & presentation
    const now = Date.now();
    return [
      {
        id: 'session-sample-1',
        sessionId: 'session-sample-1',
        userId: 'guest',
        programId: 'prog-chest-arms',
        workoutName: 'سینه و پشت بازو انفجاری',
        titleFa: 'سینه و پشت بازو انفجاری',
        workoutDay: 'شنبه',
        muscleGroupsFa: 'سینه + پشت بازو',
        totalExercises: 6,
        totalSets: 22,
        totalReps: 218,
        totalVolumeKg: 4680,
        estimatedMinutes: 52,
        durationSeconds: 52 * 60,
        targetCalories: 420,
        intensity: 'سنگین',
        status: 'completed',
        startedAt: new Date(now - 86400000 * 2 - 3600000).toISOString(),
        completedAt: new Date(now - 86400000 * 2).toISOString(),
        exercises: [],
        completedSetsSummary: [
          {
            exerciseNameFa: 'پرس سینه هالتر روی نیمکت صاف',
            sets: [
              { weight: 60, reps: 12 },
              { weight: 70, reps: 10 },
              { weight: 80, reps: 8 },
              { weight: 85, reps: 6, isPR: true },
            ],
          },
          {
            exerciseNameFa: 'بالا سینه دمبل موازی',
            sets: [
              { weight: 24, reps: 12 },
              { weight: 28, reps: 10 },
              { weight: 30, reps: 8 },
            ],
          },
          {
            exerciseNameFa: 'پشت بازو سیم‌کش با طناب',
            sets: [
              { weight: 25, reps: 15 },
              { weight: 30, reps: 12 },
              { weight: 35, reps: 10 },
            ],
          },
        ],
      },
      {
        id: 'session-sample-2',
        sessionId: 'session-sample-2',
        userId: 'guest',
        programId: 'prog-legs-core',
        workoutName: 'پا و عضلات میان‌تنه (اسکات و لانج)',
        titleFa: 'پا و عضلات میان‌تنه',
        workoutDay: 'دوشنبه',
        muscleGroupsFa: 'چهارسر ران + همسترینگ + شکم',
        totalExercises: 5,
        totalSets: 18,
        totalReps: 180,
        totalVolumeKg: 5850,
        estimatedMinutes: 58,
        durationSeconds: 58 * 60,
        targetCalories: 490,
        intensity: 'حرفه‌ای',
        status: 'completed',
        startedAt: new Date(now - 86400000 * 4 - 3600000).toISOString(),
        completedAt: new Date(now - 86400000 * 4).toISOString(),
        exercises: [],
        completedSetsSummary: [
          {
            exerciseNameFa: 'اسکات پا هالتر از پشت',
            sets: [
              { weight: 70, reps: 12 },
              { weight: 90, reps: 10 },
              { weight: 105, reps: 8, isPR: true },
            ],
          },
          {
            exerciseNameFa: 'پرس پا دستگاه ۴۵ درجه',
            sets: [
              { weight: 140, reps: 12 },
              { weight: 170, reps: 10 },
              { weight: 190, reps: 8 },
            ],
          },
        ],
      },
      {
        id: 'session-sample-3',
        sessionId: 'session-sample-3',
        userId: 'guest',
        programId: 'prog-back-biceps',
        workoutName: 'زیربغل، پشت و جلوبازو قدرتی',
        titleFa: 'پشت و جلو بازو قدرتی',
        workoutDay: 'چهارشنبه',
        muscleGroupsFa: 'زیربغل + ذوزنقه + جلو بازو',
        totalExercises: 6,
        totalSets: 20,
        totalReps: 200,
        totalVolumeKg: 4200,
        estimatedMinutes: 50,
        durationSeconds: 50 * 60,
        targetCalories: 410,
        intensity: 'سنگین',
        status: 'completed',
        startedAt: new Date(now - 86400000 * 6 - 3600000).toISOString(),
        completedAt: new Date(now - 86400000 * 6).toISOString(),
        exercises: [],
        completedSetsSummary: [
          {
            exerciseNameFa: 'زیربغل سیم‌کش دست باز (لت)',
            sets: [
              { weight: 55, reps: 12 },
              { weight: 65, reps: 10 },
              { weight: 75, reps: 8 },
            ],
          },
          {
            exerciseNameFa: 'جلو بازو هالتر ایستاده EZ',
            sets: [
              { weight: 30, reps: 12 },
              { weight: 35, reps: 10 },
              { weight: 40, reps: 8, isPR: true },
            ],
          },
        ],
      },
    ];
  }

  static saveLocalSessions(sessions: WorkoutSession[]) {
    try {
      localStorage.setItem(this.SESSIONS_LOCAL_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.warn('Error saving local sessions:', e);
    }
  }

  /**
   * Save a completed workout session with full sets into Firestore & LocalStorage
   */
  static async saveWorkoutSession(
    userId: string,
    session: WorkoutSession,
    completedSets: {
      exerciseId: string;
      exerciseNameFa: string;
      setNumber: number;
      weight: number;
      reps: number;
      completed: boolean;
      rpe?: number;
    }[]
  ): Promise<{
    newPRs: PersonalRecord[];
    savedSession: WorkoutSession;
    newAchievements: any[];
  }> {
    const sessionId = session.sessionId || `session_${Date.now()}`;
    const now = new Date().toISOString();

    const validCompletedSets = (completedSets || []).filter((s) => s && s.completed);
    const totalVolume = validCompletedSets.reduce((sum, s) => sum + (Number(s?.weight) || 0) * (Number(s?.reps) || 0), 0);
    const totalReps = validCompletedSets.reduce((sum, s) => sum + (Number(s?.reps) || 0), 0);
    const totalSets = validCompletedSets.length;

    // Check for PRs in completed sets
    const newPRs: PersonalRecord[] = [];
    const exerciseMap = new Map<string, { exerciseNameFa: string; sets: { weight: number; reps: number; isPR?: boolean }[] }>();

    for (const s of validCompletedSets) {
      const prResult = await PersonalRecordService.checkAndUpdatePR(
        userId,
        s.exerciseId,
        s.exerciseNameFa,
        s.weight,
        s.reps
      );

      const isThisPR = prResult.isNewPR && prResult.record !== null;
      if (isThisPR && prResult.record) {
        if (!newPRs.some((p) => p.exerciseId === s.exerciseId)) {
          newPRs.push(prResult.record);
          // Trigger In-app PR notification
          await NotificationService.notifyPR(userId, prResult.record, prResult.deltaKg);
        }
      }

      if (!exerciseMap.has(s.exerciseId)) {
        exerciseMap.set(s.exerciseId, {
          exerciseNameFa: s.exerciseNameFa,
          sets: [],
        });
      }
      exerciseMap.get(s.exerciseId)!.sets.push({
        weight: s.weight,
        reps: s.reps,
        isPR: isThisPR,
      });
    }

    const completedSetsSummary: { exerciseNameFa: string; sets: { weight: number; reps: number; isPR?: boolean }[] }[] = [];
    exerciseMap.forEach((val) => completedSetsSummary.push(val));

    const savedSessionRecord: WorkoutSession = {
      ...session,
      id: sessionId,
      sessionId,
      userId: userId || 'guest',
      workoutName: session.workoutName || session.titleFa,
      titleFa: session.titleFa,
      durationSeconds: session.durationSeconds || 52 * 60,
      totalExercises: session.totalExercises || exerciseMap.size,
      totalSets,
      totalReps,
      totalVolumeKg: totalVolume,
      targetCalories: session.targetCalories || Math.round(totalVolume * 0.08 + (session.durationSeconds || 3120) * 0.08),
      status: 'completed',
      startedAt: session.startedAt || now,
      completedAt: now,
      completedSetsSummary,
    };

    // Update Local Storage history immediately
    const localSessions = this.getLocalSessions();
    const updatedSessions = [savedSessionRecord, ...localSessions.filter((s) => s.id !== sessionId)];
    this.saveLocalSessions(updatedSessions);

    // Update Streak calculation
    const currentStreakState = StreakService.calculateStreak(updatedSessions);
    if (currentStreakState.currentStreak % 7 === 0 || currentStreakState.currentStreak === 3) {
      await NotificationService.notifyStreak(userId, currentStreakState.currentStreak);
    }

    // Trigger workout session completed notification
    await NotificationService.notifyWorkoutCompleted(userId, savedSessionRecord);

    // Calculate total lifetime volume
    const lifetimeVolume = updatedSessions.reduce((acc, s) => acc + (s.totalVolumeKg || 0), 0);
    const allPRs = await PersonalRecordService.getUserPRs(userId);

    // Evaluate Achievements
    const { newlyUnlocked } = await AchievementService.evaluateAchievements(userId, {
      totalWorkouts: updatedSessions.length,
      streakDays: currentStreakState.currentStreak,
      totalVolumeKg: lifetimeVolume,
      prCount: allPRs.length,
      sessions: updatedSessions,
    });

    for (const ach of newlyUnlocked) {
      await NotificationService.notifyAchievement(userId, ach);
    }

    // Save to Firestore
    if (userId && userId !== 'guest') {
      try {
        const sessionDocRef = doc(db, `users/${userId}/workoutSessions`, sessionId);
        await setDoc(sessionDocRef, savedSessionRecord);

        // Save subcollection sets
        for (let i = 0; i < completedSets.length; i++) {
          const s = completedSets[i];
          const setId = `set_${i + 1}_${Date.now()}`;
          const setRef = doc(db, `users/${userId}/workoutSessions/${sessionId}/sets`, setId);

          await setDoc(setRef, {
            setId,
            exerciseId: s.exerciseId,
            exerciseNameFa: s.exerciseNameFa,
            setNumber: s.setNumber,
            weight: s.weight,
            reps: s.reps,
            completed: s.completed,
            rpe: s.rpe || null,
            timestamp: now,
          });
        }
      } catch (e) {
        console.warn('Error saving workout session to Firestore:', e);
      }
    }

    return {
      newPRs,
      savedSession: savedSessionRecord,
      newAchievements: newlyUnlocked,
    };
  }

  /**
   * Get user previous performance for a specific exercise
   */
  static async getPreviousPerformance(userId: string, exerciseId: string): Promise<PreviousPerformance | null> {
    try {
      const prList = await PersonalRecordService.getUserPRs(userId);
      const pr = prList.find((p) => p.exerciseId === exerciseId);
      if (pr) {
        return {
          exerciseId,
          lastSessionDate: pr.achievedAt,
          lastBestWeightKg: pr.maxWeightKg,
          lastBestReps: pr.maxRepsAtWeight,
          summaryFa: `${pr.maxWeightKg} کیلوگرم × ${pr.maxRepsAtWeight} تکرار`,
        };
      }
    } catch (e) {
      console.warn('Error fetching previous performance:', e);
    }
    return null;
  }

  /**
   * Get all user workout sessions
   */
  static async getUserSessions(userId: string): Promise<WorkoutSession[]> {
    const local = this.getLocalSessions();
    if (!userId || userId === 'guest') {
      return local;
    }

    try {
      const q = query(
        collection(db, `users/${userId}/workoutSessions`),
        orderBy('completedAt', 'desc'),
        limit(50)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        const remote = snap.docs.map((d) => d.data() as WorkoutSession);
        this.saveLocalSessions(remote);
        return remote;
      }
    } catch (e) {
      console.warn('Error fetching user sessions from Firestore:', e);
    }
    return local;
  }

  /**
   * Delete workout session
   */
  static async deleteWorkoutSession(userId: string, sessionId: string): Promise<void> {
    const local = this.getLocalSessions().filter((s) => s.id !== sessionId && s.sessionId !== sessionId);
    this.saveLocalSessions(local);

    if (userId && userId !== 'guest') {
      try {
        await deleteDoc(doc(db, `users/${userId}/workoutSessions`, sessionId));
      } catch (e) {
        console.warn('Error deleting workout session from Firestore:', e);
      }
    }
  }
}
