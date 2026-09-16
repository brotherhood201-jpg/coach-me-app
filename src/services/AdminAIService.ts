/**
 * AdminAIService
 *
 * Prepares the Admin Panel architecture for future AI enhancements (Server-side Gemini Integration).
 * As per guidelines, this abstraction isolates all AI logic without exposing client keys.
 */

export interface GeneratedArticleDraft {
  title: string;
  summary: string;
  content: string;
  category: string;
  readingTime: number;
  suggestedTags: string[];
}

export interface GeneratedWorkoutPlan {
  programName: string;
  goal: string;
  difficulty: string;
  daysPerWeek: number;
  days: {
    titleFa: string;
    muscleGroupFa: string;
    exercises: {
      nameFa: string;
      sets: number;
      reps: string;
      restSeconds: number;
      notes: string;
    }[];
  }[];
}

export class AdminAIService {
  /**
   * Future capability: Generate article draft based on fitness topic
   */
  static async generateArticleDraft(topic: string, targetCategory: string): Promise<GeneratedArticleDraft> {
    // Abstraction placeholder: will connect to server-side /api/gemini/article-draft
    return {
      title: `راهنمای علمی و کاربردی: ${topic}`,
      summary: `بررسی جدیدترین متدهای هایپرتروفی و بیومکانیک مرتبط با ${topic} برای افزایش کارایی تمرین.`,
      content: `## مقدمه و مبانی فیزیولوژیک\n\nتمرینات مرتبط با **${topic}** نیازمند درک دقیقی از بار مکانیکی، زمان تحت تنش و ریکاوری بهینه هستند.\n\n### ۱. متغیرهای تمرینی کلیدی\n- حجم هفتگی متناسب با سطح تمرینی\n- کنترل فاز اکسنتریک (منفی حرکت)\n- رعایت زمان استراحت بین ست‌ها\n\n### ۲. نکات کاربردی\nهمواره قبل از شروع، گرم کردن اختصاصی مفاصل درگیر را در اولویت قرار دهید.`,
      category: targetCategory || 'تمرین',
      readingTime: 5,
      suggestedTags: ['هایپرتروفی', 'بیومکانیک', 'علم_تمرین'],
    };
  }

  /**
   * Future capability: Generate automated workout routine based on goal and days
   */
  static async generateWorkoutRoutine(goal: string, daysCount: number, level: string): Promise<GeneratedWorkoutPlan> {
    return {
      programName: `برنامه هوشمند ${goal === 'fat_loss' ? 'چربی‌سوزی' : 'عضله‌سازی'} (${daysCount} روزه)`,
      goal,
      difficulty: level,
      daysPerWeek: daysCount,
      days: [
        {
          titleFa: 'روز اول: بالاتنه (سینه، سرشانه و پشت‌بازو)',
          muscleGroupFa: 'سینه و سرشانه',
          exercises: [
            { nameFa: 'پرس سینه هالتر', sets: 4, reps: '8-10', restSeconds: 90, notes: 'کمان طبیعی کمر حفظ شود' },
            { nameFa: 'پرس بالا سینه دمبل', sets: 3, reps: '10-12', restSeconds: 75, notes: 'انقباض کامل در اوج حرکت' },
            { nameFa: 'نشر جانب دمبل', sets: 4, reps: '12-15', restSeconds: 60, notes: 'کنترل بدون تکان دادن بالاتنه' },
          ],
        },
        {
          titleFa: 'روز دوم: پایین‌تنه (چهارسر و همسترینگ)',
          muscleGroupFa: 'پا و زیربغل',
          exercises: [
            { nameFa: 'اسکات با هالتر', sets: 4, reps: '8-10', restSeconds: 120, notes: 'تمرکز بر عمق و ثبات زانوها' },
            { nameFa: 'پرس پا دستگاه', sets: 3, reps: '10-12', restSeconds: 90, notes: 'قفل نکردن کامل زانوها در بالا' },
            { nameFa: 'پشت پا دستگاه خوابیده', sets: 4, reps: '12-15', restSeconds: 60, notes: 'مکث یک ثانیه‌ای در انقباض' },
          ],
        },
      ],
    };
  }

  /**
   * Future capability: Generate biomechanics tip for an exercise
   */
  static async generateBiomechanicsTip(exerciseNameFa: string, targetMuscle: string): Promise<string> {
    return `برای حرکت ${exerciseNameFa}، تمرکز اصلی را بر ثبات کمربند شانه‌ای و مسیر عمودی میله بگذارید تا حداکثر تحریک در عضله ${targetMuscle} ایجاد شود.`;
  }
}
