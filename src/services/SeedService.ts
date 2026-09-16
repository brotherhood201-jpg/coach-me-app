import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import {
  SEED_50_EXERCISES,
  SEED_5_PROGRAMS,
  SEED_CATEGORIES,
  SEED_MUSCLE_GROUPS,
  SEED_EQUIPMENT,
} from '../data/seedData';
import { AdminRepository } from '../repositories/AdminRepository';

export interface SeedStatus {
  isSeeded: boolean;
  lastSeededAt: string | null;
  seededVersion: string | null;
  totalPresetExercises: number;
  totalPresetPrograms: number;
  totalPresetCategories: number;
  totalPresetMuscles: number;
  totalPresetEquipment: number;
  firestoreExerciseCount: number;
  firestoreProgramCount: number;
  firestoreCategoryCount: number;
}

export interface SeedResult {
  success: boolean;
  message: string;
  exercisesCount: number;
  programsCount: number;
  categoriesCount: number;
  musclesCount: number;
  equipmentCount: number;
  timestamp: string;
}

export class SeedService {
  private static readonly SEED_META_DOC = 'initial_content_v1';

  /**
   * Get the current status of the database regarding initial seed data
   */
  static async getSeedStatus(): Promise<SeedStatus> {
    try {
      const [seedMetaSnap, exercisesSnap, programsSnap, categoriesSnap] = await Promise.all([
        getDoc(doc(db, 'appSettings', this.SEED_META_DOC)).catch(() => null),
        getDocs(collection(db, 'exercises')).catch(() => ({ size: 0 })),
        getDocs(collection(db, 'workoutPrograms')).catch(() => ({ size: 0 })),
        getDocs(collection(db, 'categories')).catch(() => ({ size: 0 })),
      ]);

      const seedData = seedMetaSnap && seedMetaSnap.exists() ? seedMetaSnap.data() : null;

      const isSeeded = Boolean(
        seedData?.isSeeded ||
        (exercisesSnap.size >= 10 && programsSnap.size >= 2)
      );

      return {
        isSeeded,
        lastSeededAt: seedData?.lastSeededAt || null,
        seededVersion: seedData?.version || (isSeeded ? '1.0.0' : null),
        totalPresetExercises: SEED_50_EXERCISES.length,
        totalPresetPrograms: SEED_5_PROGRAMS.length,
        totalPresetCategories: SEED_CATEGORIES.length,
        totalPresetMuscles: SEED_MUSCLE_GROUPS.length,
        totalPresetEquipment: SEED_EQUIPMENT.length,
        firestoreExerciseCount: exercisesSnap.size,
        firestoreProgramCount: programsSnap.size,
        firestoreCategoryCount: categoriesSnap.size,
      };
    } catch (error) {
      console.warn('Error checking seed status:', error);
      return {
        isSeeded: false,
        lastSeededAt: null,
        seededVersion: null,
        totalPresetExercises: SEED_50_EXERCISES.length,
        totalPresetPrograms: SEED_5_PROGRAMS.length,
        totalPresetCategories: SEED_CATEGORIES.length,
        totalPresetMuscles: SEED_MUSCLE_GROUPS.length,
        totalPresetEquipment: SEED_EQUIPMENT.length,
        firestoreExerciseCount: 0,
        firestoreProgramCount: 0,
        firestoreCategoryCount: 0,
      };
    }
  }

  /**
   * Safe, Idempotent Database Seed Operation
   * Uses setDoc with merge: true to avoid duplication and safely update.
   */
  static async executeSeed(onProgress?: (progressText: string, percentage: number) => void): Promise<SeedResult> {
    const now = new Date().toISOString();
    let seededExercises = 0;
    let seededPrograms = 0;
    let seededCategories = 0;
    let seededMuscles = 0;
    let seededEquipment = 0;

    try {
      // 1. Seed Categories & Taxonomy
      onProgress?.('در حال بارگذاری دسته‌بندی‌ها و ساختار عضلانی...', 10);
      for (const cat of SEED_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), cat, { merge: true });
        seededCategories++;
      }

      for (const muscle of SEED_MUSCLE_GROUPS) {
        await setDoc(doc(db, 'categories', muscle.id), muscle, { merge: true });
        seededMuscles++;
      }

      for (const eq of SEED_EQUIPMENT) {
        await setDoc(doc(db, 'categories', eq.id), eq, { merge: true });
        seededEquipment++;
      }

      // 2. Seed 50 Exercises (Batched in chunks for smooth network handling)
      const totalExercises = SEED_50_EXERCISES.length;
      for (let i = 0; i < totalExercises; i++) {
        const ex = SEED_50_EXERCISES[i];
        const progressPct = 20 + Math.round((i / totalExercises) * 50);
        onProgress?.(`در حال بارگذاری حرکت ${i + 1} از ${totalExercises}: ${ex.nameFa}`, progressPct);
        
        await setDoc(doc(db, 'exercises', ex.id), {
          ...ex,
          updatedAt: now,
        }, { merge: true });
        seededExercises++;
      }

      // 3. Seed 5 Workout Programs
      const totalPrograms = SEED_5_PROGRAMS.length;
      for (let i = 0; i < totalPrograms; i++) {
        const prog = SEED_5_PROGRAMS[i];
        const progressPct = 70 + Math.round((i / totalPrograms) * 20);
        onProgress?.(`در حال بارگذاری برنامه تمرینی ${i + 1} از ${totalPrograms}: ${prog.name}`, progressPct);

        await setDoc(doc(db, 'workoutPrograms', prog.id), {
          ...prog,
          updatedAt: now,
        }, { merge: true });
        seededPrograms++;
      }

      // 4. Save Seed Metadata in appSettings
      onProgress?.('در حال ثبت فراداده‌ها و مستندسازی سیستمی...', 95);
      await setDoc(doc(db, 'appSettings', this.SEED_META_DOC), {
        id: this.SEED_META_DOC,
        isSeeded: true,
        version: '1.0.0',
        lastSeededAt: now,
        stats: {
          exercises: seededExercises,
          programs: seededPrograms,
          categories: seededCategories,
          muscles: seededMuscles,
          equipment: seededEquipment,
        },
      }, { merge: true });

      // 5. Audit Log
      await AdminRepository.logAction(
        `بارگذاری موفقیت‌آمیز داده‌های اولیه شامل ${seededExercises} حرکت، ${seededPrograms} برنامه و ${seededCategories + seededMuscles + seededEquipment} رده آرایه‌بندی`,
        'settings',
        this.SEED_META_DOC
      );

      onProgress?.('عملیات با موفقیت پایان یافت.', 100);

      return {
        success: true,
        message: `بارگذاری ۵۰ حرکت تخصصی و ۵ برنامه استاندارد با موفقیت در دیتابیس ثبت شد.`,
        exercisesCount: seededExercises,
        programsCount: seededPrograms,
        categoriesCount: seededCategories,
        musclesCount: seededMuscles,
        equipmentCount: seededEquipment,
        timestamp: now,
      };
    } catch (error: any) {
      console.error('Error during database seed:', error);
      throw new Error(error.message || 'خطا در بارگذاری داده‌های اولیه در دیتابیس.');
    }
  }
}
