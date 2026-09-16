import { collection, doc, getDocs, getDoc, setDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Exercise } from '../types';
import { TODAY_WORKOUT } from '../data/workoutData';

export class ExerciseRepository {
  static async getExercises(): Promise<Exercise[]> {
    try {
      const snap = await getDocs(collection(db, 'exercises'));
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as Exercise);
      }
      // Return default exercises if empty
      return TODAY_WORKOUT.exercises;
    } catch (e) {
      console.warn('Fallback to local exercises:', e);
      return TODAY_WORKOUT.exercises;
    }
  }

  static async getExerciseById(id: string): Promise<Exercise | null> {
    try {
      const snap = await getDoc(doc(db, 'exercises', id));
      if (snap.exists()) {
        return snap.data() as Exercise;
      }
    } catch (e) {
      console.warn('Error fetching exercise by ID:', e);
    }
    return TODAY_WORKOUT.exercises.find((e) => e.id === id) || null;
  }

  static async searchExercises(searchTerm: string): Promise<Exercise[]> {
    const all = await this.getExercises();
    const term = searchTerm.toLowerCase().trim();
    return all.filter(
      (e) =>
        e.nameFa.toLowerCase().includes(term) ||
        e.nameEn.toLowerCase().includes(term) ||
        (e.primaryMuscle && e.primaryMuscle.toLowerCase().includes(term))
    );
  }

  static async filterExercisesByMuscle(muscle: string): Promise<Exercise[]> {
    const all = await this.getExercises();
    return all.filter((e) => (e.primaryMuscle || e.targetMuscle || '').includes(muscle));
  }

  // Seed default sample exercises into Firestore if not present
  static async seedSampleExercises(): Promise<void> {
    try {
      const snap = await getDocs(collection(db, 'exercises'));
      if (snap.empty) {
        for (const ex of TODAY_WORKOUT.exercises) {
          await setDoc(doc(db, 'exercises', ex.id), {
            ...ex,
            primaryMuscle: ex.targetMuscle || 'سینه و پشت‌بازو',
            difficulty: 'متوسط',
            createdAt: new Date().toISOString(),
          });
        }
      }
    } catch (e) {
      console.warn('Seeding exercises skipped or handled offline:', e);
    }
  }
}
