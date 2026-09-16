import { collection, doc, getDocs, setDoc, getDoc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { PersonalRecord } from '../types';
import { calculate1RM } from '../utils/persian';

export class PersonalRecordService {
  private static LOCAL_PRS_KEY = 'polad_user_personal_records';

  static getLocalPRs(): PersonalRecord[] {
    try {
      const saved = localStorage.getItem(this.LOCAL_PRS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Default initial seeded PRs
    return [
      {
        id: 'ex-1',
        userId: 'guest',
        exerciseId: 'ex-1',
        exerciseNameFa: 'پرس سینه هالتر روی نیمکت صاف',
        maxWeightKg: 85,
        maxRepsAtWeight: 6,
        estimated1RM: 102,
        achievedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        previousRecordKg: 80,
      },
      {
        id: 'ex-2',
        userId: 'guest',
        exerciseId: 'ex-2',
        exerciseNameFa: 'بالا سینه دمبل موازی',
        maxWeightKg: 30,
        maxRepsAtWeight: 8,
        estimated1RM: 38,
        achievedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        previousRecordKg: 28,
      },
      {
        id: 'ex-4',
        userId: 'guest',
        exerciseId: 'ex-4',
        exerciseNameFa: 'پشت بازو سیم‌کش با طناب',
        maxWeightKg: 35,
        maxRepsAtWeight: 10,
        estimated1RM: 47,
        achievedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        previousRecordKg: 30,
      },
    ];
  }

  static saveLocalPRs(records: PersonalRecord[]) {
    try {
      localStorage.setItem(this.LOCAL_PRS_KEY, JSON.stringify(records));
    } catch (e) {
      console.warn('Could not save local PRs:', e);
    }
  }

  /**
   * Fetch all user personal records
   */
  static async getUserPRs(userId: string): Promise<PersonalRecord[]> {
    const local = this.getLocalPRs();
    if (!userId || userId === 'guest') return local;

    try {
      const snap = await getDocs(collection(db, `users/${userId}/personalRecords`));
      if (!snap.empty) {
        const records = snap.docs.map((d) => d.data() as PersonalRecord);
        this.saveLocalPRs(records);
        return records;
      }
    } catch (e) {
      console.warn('Error loading PRs from Firestore:', e);
    }
    return local;
  }

  /**
   * Check a single set execution and update PR if it sets a new high
   */
  static async checkAndUpdatePR(
    userId: string,
    exerciseId: string,
    exerciseNameFa: string,
    weightKg: number,
    reps: number
  ): Promise<{ isNewPR: boolean; record: PersonalRecord | null; deltaKg: number }> {
    if (weightKg <= 0 || reps <= 0) {
      return { isNewPR: false, record: null, deltaKg: 0 };
    }

    const { average: estimated1RM } = calculate1RM(weightKg, reps);
    const existingList = this.getLocalPRs();
    const currentPR = existingList.find((p) => p.exerciseId === exerciseId);

    const now = new Date().toISOString();
    let isNewPR = false;
    let deltaKg = 0;
    let newRecord: PersonalRecord;

    if (!currentPR) {
      isNewPR = true;
      deltaKg = weightKg;
      newRecord = {
        id: exerciseId,
        userId: userId || 'guest',
        exerciseId,
        exerciseNameFa,
        maxWeightKg: weightKg,
        maxRepsAtWeight: reps,
        estimated1RM,
        achievedAt: now,
      };
    } else {
      const isHigherWeight = weightKg > currentPR.maxWeightKg;
      const isMoreRepsAtSameWeight = weightKg === currentPR.maxWeightKg && reps > currentPR.maxRepsAtWeight;
      const isHigher1RM = estimated1RM > currentPR.estimated1RM && weightKg >= currentPR.maxWeightKg * 0.9;

      if (isHigherWeight || isMoreRepsAtSameWeight || isHigher1RM) {
        isNewPR = true;
        deltaKg = Math.max(0, weightKg - currentPR.maxWeightKg);
        newRecord = {
          id: exerciseId,
          userId: userId || 'guest',
          exerciseId,
          exerciseNameFa,
          maxWeightKg: Math.max(weightKg, currentPR.maxWeightKg),
          maxRepsAtWeight: weightKg >= currentPR.maxWeightKg ? reps : currentPR.maxRepsAtWeight,
          estimated1RM: Math.max(estimated1RM, currentPR.estimated1RM),
          achievedAt: now,
          previousRecordKg: currentPR.maxWeightKg,
        };
      } else {
        return { isNewPR: false, record: null, deltaKg: 0 };
      }
    }

    if (isNewPR) {
      const updatedList = [
        newRecord,
        ...existingList.filter((p) => p.exerciseId !== exerciseId),
      ];
      this.saveLocalPRs(updatedList);

      if (userId && userId !== 'guest') {
        try {
          const prRef = doc(db, `users/${userId}/personalRecords`, exerciseId);
          await setDoc(prRef, newRecord);
        } catch (e) {
          console.warn('Error saving PR to Firestore:', e);
        }
      }

      return { isNewPR: true, record: newRecord, deltaKg };
    }

    return { isNewPR: false, record: null, deltaKg: 0 };
  }
}
