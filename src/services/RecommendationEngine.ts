import { WorkoutProgram, OnboardingAnswers, ProgramMatchResult } from '../types';
import { SEED_5_PROGRAMS } from '../data/seedData';

export class RecommendationEngine {
  /**
   * Deterministic matching algorithm to rank programs based on user onboarding profile.
   * Scoring weights:
   * - Goal Match: +40 pts
   * - Difficulty/Level Match: +25 pts
   * - Days per Week Match: +20 pts
   * - Equipment & Location Match: +10 pts
   * - Duration Match: +5 pts
   * Total Max: 100 pts
   */
  static matchPrograms(
    answers: OnboardingAnswers,
    availablePrograms: WorkoutProgram[] = SEED_5_PROGRAMS
  ): ProgramMatchResult[] {
    const candidatePrograms = availablePrograms.length > 0 ? availablePrograms : SEED_5_PROGRAMS;

    const scored = candidatePrograms.map((prog) => {
      let goalScore = 0;
      let diffScore = 0;
      let daysScore = 0;
      let equipScore = 0;
      let durScore = 0;
      const reasons: string[] = [];

      const pGoal = (prog.goal || '').toLowerCase();
      const pName = (prog.name || '').toLowerCase();
      const pDesc = (prog.description || '').toLowerCase();
      const pDiff = (prog.difficulty || '').toLowerCase();
      const pDays = prog.daysPerWeek || prog.days?.length || 3;
      const pDur = prog.estimatedDuration || 60;

      // 1. Goal Match (Max 40 pts)
      switch (answers.primaryGoal) {
        case 'muscle_gain':
          if (pGoal.includes('عضله') || pGoal.includes('هایپرتروفی') || pName.includes('عضله') || pDesc.includes('هایپرتروفی')) {
            goalScore = 40;
            reasons.push('تطابق کامل با هدف عضله‌سازی و هایپرتروفی عضلات');
          } else if (pGoal.includes('قدرت') || pGoal.includes('تناسب')) {
            goalScore = 30;
            reasons.push('پوشش بهینه رشد عضلانی و تناسب بدنی');
          } else {
            goalScore = 15;
          }
          break;

        case 'fat_loss':
          if (pGoal.includes('چربی') || pGoal.includes('کات') || pName.includes('چربی') || pDesc.includes('متابولیک')) {
            goalScore = 40;
            reasons.push('تمرکز بر کالری‌سوزی بالا و حفظ توده خالص عضلانی');
          } else if (pGoal.includes('فول‌بادی') || pGoal.includes('تناسب')) {
            goalScore = 32;
            reasons.push('کمک به افزایش متابولیسم با حرکات چندمفصلی');
          } else {
            goalScore = 18;
          }
          break;

        case 'strength':
          if (pGoal.includes('قدرت') || pName.includes('قدرت') || pDesc.includes('سه‌گانه') || pDesc.includes('رکورد')) {
            goalScore = 40;
            reasons.push('طراحی اختصاصی برای افزایش رکوردهای قدرتی و توان عضلانی');
          } else if (pGoal.includes('عضله') || pGoal.includes('هایپرتروفی')) {
            goalScore = 32;
            reasons.push('افزایش بار پیش‌رونده برای ارتقای قدرت عضلانی');
          } else {
            goalScore = 15;
          }
          break;

        case 'maintenance':
        case 'endurance':
        default:
          if (pGoal.includes('فیتنس') || pGoal.includes('تناسب') || pGoal.includes('عمومی') || pName.includes('فول‌بادی')) {
            goalScore = 40;
            reasons.push('متوازن برای پایداری آمادگی جسمانی و سلامت عمومی');
          } else if (pGoal.includes('مبتدی') || pGoal.includes('چربی')) {
            goalScore = 32;
            reasons.push('مناسب برای ارتقای استقامت و سلامت بدنی');
          } else {
            goalScore = 20;
          }
          break;
      }

      // 2. Difficulty / Fitness Level (Max 25 pts)
      const userLevel = answers.fitnessLevel || answers.trainingExperience || 'intermediate';
      if (userLevel === 'beginner') {
        if (pDiff.includes('مبتدی')) {
          diffScore = 25;
          reasons.push('سازگار با سطح آمادگی نوآموز با یادگیری اصول بیومکانیک');
        } else if (pDiff.includes('متوسط')) {
          diffScore = 15;
          reasons.push('چالش ملایم و کنترل‌شده برای پیشرفت سریع‌تر');
        } else {
          diffScore = 5;
        }
      } else if (userLevel === 'intermediate') {
        if (pDiff.includes('متوسط') || pDiff.includes('مبتدی / متوسط')) {
          diffScore = 25;
          reasons.push('هماهنگ با تجربه و سطح آمادگی متوسط شما');
        } else if (pDiff.includes('پیشرفته') || pDiff.includes('مبتدی')) {
          diffScore = 18;
          reasons.push('حجم و شدت استاندارد و متناسب با سابقه ورزشی');
        }
      } else {
        // advanced
        if (pDiff.includes('پیشرفته')) {
          diffScore = 25;
          reasons.push('برنامه سنگین و تخصصی برای ورزشکاران حرفه‌ای');
        } else if (pDiff.includes('متوسط')) {
          diffScore = 18;
          reasons.push('قابلیت افزایش وزنه‌ها و شدت تا سطح بیشینه');
        } else {
          diffScore = 8;
        }
      }

      // 3. Days per Week (Max 20 pts)
      const daysDiff = Math.abs(pDays - answers.daysPerWeek);
      if (daysDiff === 0) {
        daysScore = 20;
        reasons.push(`تطابق دقیق برای ${pDays} روز تمرین در هفته`);
      } else if (daysDiff === 1) {
        daysScore = 15;
        reasons.push(`برنامه‌ریزی ${pDays} روزه بسیار نزدیک به زمان‌بندی هفتگی شما`);
      } else if (daysDiff === 2) {
        daysScore = 8;
      } else {
        daysScore = 4;
      }

      // 4. Equipment & Location Match (Max 10 pts)
      if (answers.workoutLocation === 'gym') {
        equipScore = 10;
        reasons.push('بهره‌گیری کامل از تجهیزات مجهز باشگاه');
      } else if (answers.workoutLocation === 'home_equipment') {
        if (answers.availableEquipment?.includes('دمبل') || answers.availableEquipment?.length > 1) {
          equipScore = 9;
          reasons.push('قابل اجرا با دمبل و تجهیزات خانگی در دسترس');
        } else {
          equipScore = 7;
        }
      } else {
        // home_bodyweight or outdoor
        if (pDesc.includes('وزن بدن') || pName.includes('فول‌بادی') || pDays <= 3) {
          equipScore = 8;
          reasons.push('تمرینات کاربردی با قابلیت اجرا با تجهیزات سبک');
        } else {
          equipScore = 5;
        }
      }

      // 5. Duration Match (Max 5 pts)
      if (answers.workoutDuration === '30_45' && pDur <= 50) {
        durScore = 5;
        reasons.push('جلسات بهینه و فشرده متناسب با وقت شما');
      } else if (answers.workoutDuration === '45_60' && pDur >= 45 && pDur <= 65) {
        durScore = 5;
        reasons.push('طول جلسات متعادل بین ۴۵ تا ۶۰ دقیقه');
      } else if (answers.workoutDuration === '60_90' && pDur >= 60) {
        durScore = 5;
        reasons.push('حجم کامل و جلسات عمیق تخصصی');
      } else {
        durScore = 3;
      }

      const totalScore = Math.min(100, Math.max(30, goalScore + diffScore + daysScore + equipScore + durScore));

      return {
        program: prog,
        matchScore: totalScore,
        matchPercentage: totalScore,
        reasons,
        isTopMatch: false,
      };
    });

    // Sort descending by score
    scored.sort((a, b) => b.matchScore - a.matchScore);

    if (scored.length > 0) {
      scored[0].isTopMatch = true;
    }

    return scored;
  }
}
