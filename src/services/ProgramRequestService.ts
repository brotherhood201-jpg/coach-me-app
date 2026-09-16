import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  ProgramRequest,
  ProgramRequestStatus,
  DetailedClientProfile,
  UserProfile,
  AssignedNutritionPlan,
} from '../types';
import { UserRepository } from '../repositories/UserRepository';
import { AdminRepository } from '../repositories/AdminRepository';
import { NotificationService } from './NotificationService';

const LOCAL_STORAGE_KEY_PREFIX = 'polad_program_request_';

export class ProgramRequestService {
  /**
   * Helper: compute review flags from detailed profile
   */
  static computeFlags(detailedProfile: DetailedClientProfile) {
    const health = detailedProfile.healthInfo;
    const nutrition = detailedProfile.nutritionProfile;

    const isPregnancyOrPostpartum =
      health?.specialCondition === 'pregnancy' || health?.specialCondition === 'postpartum';
    const hasMedicalCondition = !!health?.hasMedicalConditionOrMedication;
    const hasInjury = !!health?.hasInjuryOrLimitation;
    const hasAllergy = !!(nutrition?.allergies && nutrition.allergies.length > 0);

    const specialReviewRequired = isPregnancyOrPostpartum || hasMedicalCondition;
    const healthFlag = hasMedicalCondition || isPregnancyOrPostpartum;
    const injuryFlag = hasInjury;
    const allergyFlag = hasAllergy;

    return {
      specialReviewRequired,
      healthFlag,
      injuryFlag,
      allergyFlag,
    };
  }

  /**
   * Get user's current program request
   */
  static async getUserProgramRequest(userId: string): Promise<ProgramRequest | null> {
    if (!userId || userId === 'guest') {
      const local = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}guest`);
      return local ? JSON.parse(local) : null;
    }

    try {
      const reqRef = doc(db, 'programRequests', userId);
      const snap = await getDoc(reqRef);
      if (snap.exists()) {
        const data = snap.data() as ProgramRequest;
        localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn('Could not fetch program request from Firestore, checking local storage:', e);
    }

    const local = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${userId}`);
    return local ? JSON.parse(local) : null;
  }

  /**
   * Listen to real-time updates for user's request
   */
  static subscribeToUserRequest(
    userId: string,
    callback: (request: ProgramRequest | null) => void
  ): () => void {
    if (!userId || userId === 'guest') {
      const local = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}guest`);
      callback(local ? JSON.parse(local) : null);
      return () => {};
    }

    try {
      const reqRef = doc(db, 'programRequests', userId);
      const unsubscribe = onSnapshot(
        reqRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data() as ProgramRequest;
            localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(data));
            callback(data);
          } else {
            callback(null);
          }
        },
        (err) => {
          console.warn('Realtime request subscription fallback:', err);
        }
      );
      return unsubscribe;
    } catch (e) {
      return () => {};
    }
  }

  /**
   * Submit or update a program request (from user)
   */
  static async submitProgramRequest(
    userId: string,
    detailedProfile: DetailedClientProfile,
    userProfile: UserProfile
  ): Promise<ProgramRequest> {
    const flags = this.computeFlags(detailedProfile);
    const now = new Date().toISOString();

    const existing = await this.getUserProgramRequest(userId);

    const request: ProgramRequest = {
      requestId: userId,
      userId: userId,
      userName: userProfile?.name || 'کاربر گرامی',
      userEmail: userProfile?.email || '',
      status: 'submitted',
      submittedAt: existing?.submittedAt || now,
      updatedAt: now,
      specialReviewRequired: flags.specialReviewRequired,
      healthFlag: flags.healthFlag,
      allergyFlag: flags.allergyFlag,
      injuryFlag: flags.injuryFlag,
      detailedProfileSnapshot: detailedProfile,
      userProfileSnapshot: {
        age: userProfile?.age ?? 24,
        gender: userProfile?.gender ?? 'male',
        height: userProfile?.height ?? userProfile?.heightCm ?? 180,
        weight: userProfile?.weight ?? userProfile?.weightKg ?? 79.5,
        goal: userProfile?.goal || userProfile?.primaryGoal || 'muscle_gain',
        fitnessLevel: userProfile?.fitnessLevel || 'intermediate',
        trainingDaysPerWeek: userProfile?.trainingDaysPerWeek || userProfile?.daysPerWeek || 4,
        availableEquipment: userProfile?.availableEquipment || [],
      },
      coachQuestion: existing?.coachQuestion,
      coachNotes: existing?.coachNotes,
      assignedProgramId: existing?.assignedProgramId,
      assignedProgramName: existing?.assignedProgramName,
      assignedNutritionPlan: existing?.assignedNutritionPlan,
    };

    // Cache locally
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(request));

    // Save to Firestore
    try {
      await setDoc(doc(db, 'programRequests', userId), request, { merge: true });

      // Update user document
      await UserRepository.saveUserProfile({
        ...userProfile,
        detailedProfile,
        isProfileComplete: true,
        programRequestStatus: 'submitted',
        activeProgramRequestId: userId,
        updatedAt: now,
      });

      // Log in audit log
      await AdminRepository.logAction(
        'ارسال پرونده و درخواست برنامه اختصاصی',
        'programRequest',
        userId,
        `کاربر ${userProfile.name} پرونده تکمیلی خود را ارسال کرد.`
      );
    } catch (e) {
      console.warn('Firestore program request save error:', e);
    }

    return request;
  }

  /**
   * User replies to coach's question for more info
   */
  static async replyToCoachQuestion(
    userId: string,
    userReply: string,
    updatedProfile?: Partial<DetailedClientProfile>
  ): Promise<ProgramRequest | null> {
    const existing = await this.getUserProgramRequest(userId);
    if (!existing) return null;

    const mergedProfile: DetailedClientProfile = {
      ...existing.detailedProfileSnapshot,
      ...(updatedProfile || {}),
      updatedAt: new Date().toISOString(),
    };

    const flags = this.computeFlags(mergedProfile);
    const now = new Date().toISOString();

    const updated: ProgramRequest = {
      ...existing,
      status: 'submitted',
      userReply,
      updatedAt: now,
      detailedProfileSnapshot: mergedProfile,
      specialReviewRequired: flags.specialReviewRequired,
      healthFlag: flags.healthFlag,
      allergyFlag: flags.allergyFlag,
      injuryFlag: flags.injuryFlag,
    };

    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(updated));

    try {
      await updateDoc(doc(db, 'programRequests', userId), {
        status: 'submitted',
        userReply,
        updatedAt: now,
        detailedProfileSnapshot: mergedProfile,
        specialReviewRequired: flags.specialReviewRequired,
        healthFlag: flags.healthFlag,
        allergyFlag: flags.allergyFlag,
        injuryFlag: flags.injuryFlag,
      });

      await AdminRepository.logAction(
        'پاسخ کاربر به استعلام اطلاعات مربی',
        'programRequest',
        userId,
        `کاربر به سؤال مربی پاسخ داد و پرونده مجدداً در وضعیت بررسی قرار گرفت.`
      );
    } catch (e) {
      console.warn('Update request reply error:', e);
    }

    return updated;
  }

  // ==========================================
  // COACH / ADMIN WORKFLOW METHODS
  // ==========================================

  /**
   * Get all program requests for admin dashboard
   */
  static async getAllProgramRequests(): Promise<ProgramRequest[]> {
    try {
      const q = query(collection(db, 'programRequests'), orderBy('updatedAt', 'desc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as ProgramRequest);
      }
    } catch (e) {
      console.warn('Could not fetch all program requests from Firestore:', e);
    }

    // Return cached/guest if any
    const guest = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}guest`);
    return guest ? [JSON.parse(guest)] : [];
  }

  /**
   * Admin/Coach: Start review
   */
  static async startReview(requestId: string, reviewerName: string): Promise<void> {
    const now = new Date().toISOString();
    try {
      await updateDoc(doc(db, 'programRequests', requestId), {
        status: 'under_review',
        reviewedAt: now,
        reviewedBy: reviewerName,
        updatedAt: now,
      });

      await AdminRepository.logAction(
        'شروع بررسی پرونده توسط مربی',
        'programRequest',
        requestId,
        `مربی ${reviewerName} بررسی پرونده را آغاز کرد.`
      );
    } catch (e) {
      console.warn('Start review error:', e);
    }
  }

  /**
   * Admin/Coach: Request more info from user
   */
  static async requestMoreInfo(
    requestId: string,
    coachQuestion: string,
    reviewerName: string
  ): Promise<void> {
    const now = new Date().toISOString();
    try {
      await updateDoc(doc(db, 'programRequests', requestId), {
        status: 'needs_more_info',
        coachQuestion,
        reviewedAt: now,
        reviewedBy: reviewerName,
        updatedAt: now,
      });

      // Send in-app notification to user
      await NotificationService.createNotification(requestId, {
        titleFa: 'استعلام تکمیلی از طرف مربی 💬',
        bodyFa: `مربی پیامی برای شما ثبت کرده: "${coachQuestion.substring(0, 60)}..."`,
        type: 'general',
        read: false,
      });

      await AdminRepository.logAction(
        'درخواست اطلاعات بیشتر از کاربر',
        'programRequest',
        requestId,
        `سوال مربی: ${coachQuestion}`
      );
    } catch (e) {
      console.warn('Request more info error:', e);
    }
  }

  /**
   * Admin/Coach: Assign Workout Program and optional Nutrition Plan, then publish
   */
  static async assignProgramAndPublish(
    requestId: string,
    assignedProgramId: string,
    assignedProgramName: string,
    nutritionPlan: AssignedNutritionPlan | null,
    coachNotes: string,
    reviewerName: string
  ): Promise<void> {
    const now = new Date().toISOString();

    try {
      // 1. Update programRequests document
      await updateDoc(doc(db, 'programRequests', requestId), {
        status: 'plan_ready',
        assignedProgramId,
        assignedProgramName,
        assignedNutritionPlan: nutritionPlan || undefined,
        coachNotes,
        publishedAt: now,
        reviewedAt: now,
        reviewedBy: reviewerName,
        updatedAt: now,
      });

      // 2. Update user profile to activate program & coach notes
      const userRef = doc(db, 'users', requestId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const updatePayload: Record<string, any> = {
          activeProgramId: assignedProgramId,
          assignedCoachNotes: coachNotes || '',
          programRequestStatus: 'plan_ready',
          updatedAt: now,
        };
        await updateDoc(userRef, updatePayload);
      }

      // 3. If nutrition plan is provided, update or log it for user
      if (nutritionPlan && nutritionPlan.dailyCalorieTarget > 0) {
        const dateStr = new Date().toISOString().split('T')[0];
        const nutrRef = doc(db, 'users', requestId, 'nutritionLogs', dateStr);
        await setDoc(
          nutrRef,
          {
            targetCalories: nutritionPlan.dailyCalorieTarget,
            proteinGrams: 0,
            carbsGrams: 0,
            fatGrams: 0,
            proteinTarget: nutritionPlan.proteinTarget,
            carbsTarget: nutritionPlan.carbTarget,
            fatTarget: nutritionPlan.fatTarget,
            nutritionNotes: nutritionPlan.nutritionNotes || '',
            updatedAt: now,
          },
          { merge: true }
        );
      }

      // 4. Send official celebratory notification to user
      await NotificationService.createNotification(requestId, {
        titleFa: 'برنامه‌ات آماده‌ست 🎉',
        bodyFa: `مربی برنامه جدیدت (${assignedProgramName}) رو برات آماده کرده. وارد برنامه شو و تمرین رو شروع کن!`,
        type: 'workout_reminder',
        read: false,
      });

      // 5. Audit log
      await AdminRepository.logAction(
        'انتشار و تخصیص برنامه اختصاصی',
        'programRequest',
        requestId,
        `برنامه "${assignedProgramName}" با موفقیت برای کاربر منتشر و فعال شد.`
      );
    } catch (e) {
      console.warn('Assign and publish plan error:', e);
      throw e;
    }
  }
}
