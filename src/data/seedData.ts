import { Exercise, WorkoutProgram, ContentCategory } from '../types';

export interface SeedTaxonomyItem {
  id: string;
  nameFa: string;
  nameEn: string;
  type: 'category' | 'muscle' | 'equipment';
  icon?: string;
  descriptionFa?: string;
}

export const SEED_CATEGORIES: SeedTaxonomyItem[] = [
  { id: 'cat_chest', nameFa: 'سینه', nameEn: 'Chest', type: 'category', icon: '🫁', descriptionFa: 'عضلات پکتورالیس ماژور و مینور' },
  { id: 'cat_back', nameFa: 'پشت', nameEn: 'Back', type: 'category', icon: '🦅', descriptionFa: 'عضلات لاتیسیموس، ذوزنقه و راست‌کننده ستون فقرات' },
  { id: 'cat_shoulders', nameFa: 'سرشانه', nameEn: 'Shoulders', type: 'category', icon: '🛡️', descriptionFa: 'دلتوئید قدامی، میانی و خلفی' },
  { id: 'cat_biceps', nameFa: 'جلو بازو', nameEn: 'Biceps', type: 'category', icon: '💪', descriptionFa: 'دو سر بازویی و براکیالیس' },
  { id: 'cat_triceps', nameFa: 'پشت بازو', nameEn: 'Triceps', type: 'category', icon: '⚡', descriptionFa: 'سه سر بازویی سر بلند، جانبی و میانی' },
  { id: 'cat_legs', nameFa: 'پا', nameEn: 'Legs', type: 'category', icon: '🦵', descriptionFa: 'چهارسر ران، همسترینگ، سرینی و ساق' },
  { id: 'cat_abs', nameFa: 'شکم و عضلات مرکزی', nameEn: 'Abs & Core', type: 'category', icon: '🎯', descriptionFa: 'راست شکمی، مایل‌ها و ترنسورس' },
  { id: 'cat_fullbody', nameFa: 'تمام بدن و فانکشنال', nameEn: 'Full Body & Functional', type: 'category', icon: '🔥', descriptionFa: 'حرکات ترکیبی چند مفصلی و زنجیره حرکتی' },
];

export const SEED_MUSCLE_GROUPS: SeedTaxonomyItem[] = [
  { id: 'muscle_chest', nameFa: 'سینه', nameEn: 'Pectorals', type: 'muscle' },
  { id: 'muscle_upper_chest', nameFa: 'بالاسینه', nameEn: 'Upper Chest', type: 'muscle' },
  { id: 'muscle_back', nameFa: 'پشت و زیربغل', nameEn: 'Latissimus & Upper Back', type: 'muscle' },
  { id: 'muscle_shoulders', nameFa: 'سرشانه', nameEn: 'Deltoids', type: 'muscle' },
  { id: 'muscle_lateral_delts', nameFa: 'سرشانه میانی', nameEn: 'Lateral Deltoids', type: 'muscle' },
  { id: 'muscle_rear_delts', nameFa: 'سرشانه خلفی', nameEn: 'Rear Deltoids', type: 'muscle' },
  { id: 'muscle_biceps', nameFa: 'جلو بازو', nameEn: 'Biceps', type: 'muscle' },
  { id: 'muscle_triceps', nameFa: 'پشت بازو', nameEn: 'Triceps', type: 'muscle' },
  { id: 'muscle_quads', nameFa: 'چهارسر ران', nameEn: 'Quadriceps', type: 'muscle' },
  { id: 'muscle_hamstrings', nameFa: 'همسترینگ', nameEn: 'Hamstrings', type: 'muscle' },
  { id: 'muscle_glutes', nameFa: 'سرینی', nameEn: 'Glutes', type: 'muscle' },
  { id: 'muscle_calves', nameFa: 'ساق', nameEn: 'Calves', type: 'muscle' },
  { id: 'muscle_abs', nameFa: 'شکم', nameEn: 'Abdominals', type: 'muscle' },
  { id: 'muscle_core', nameFa: 'عضلات مرکزی (Core)', nameEn: 'Core', type: 'muscle' },
  { id: 'muscle_posterior_chain', nameFa: 'زنجیره خلفی', nameEn: 'Posterior Chain', type: 'muscle' },
];

export const SEED_EQUIPMENT: SeedTaxonomyItem[] = [
  { id: 'equip_bodyweight', nameFa: 'بدون تجهیزات (وزن بدن)', nameEn: 'Bodyweight', type: 'equipment' },
  { id: 'equip_dumbbell', nameFa: 'دمبل', nameEn: 'Dumbbell', type: 'equipment' },
  { id: 'equip_barbell', nameFa: 'هالتر', nameEn: 'Barbell', type: 'equipment' },
  { id: 'equip_machine', nameFa: 'دستگاه', nameEn: 'Machine', type: 'equipment' },
  { id: 'equip_cable', nameFa: 'کابل / سیمکش', nameEn: 'Cable', type: 'equipment' },
  { id: 'equip_bench', nameFa: 'نیمکت', nameEn: 'Bench', type: 'equipment' },
  { id: 'equip_pullup_bar', nameFa: 'میله بارفیکس', nameEn: 'Pull-up Bar', type: 'equipment' },
  { id: 'equip_kettlebell', nameFa: 'کتلبل', nameEn: 'Kettlebell', type: 'equipment' },
  { id: 'equip_tbar', nameFa: 'تی‌بار (T-Bar)', nameEn: 'T-Bar', type: 'equipment' },
];

export const SEED_50_EXERCISES: Exercise[] = [
  // CHEST (1-7)
  {
    id: 'exercise_bench_press_barbell',
    nameFa: 'پرس سینه هالتر',
    nameEn: 'Barbell Bench Press',
    targetMuscle: 'سینه',
    primaryMuscle: 'سینه',
    equipment: 'هالتر + نیمکت',
    difficulty: 'متوسط',
    restSeconds: 90,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
    notesFa: 'پایه‌ای‌ترین حرکت قدرتی و هایپرتروفی برای بخش میانی و کل عضلات سینه با درگیری پشت‌بازو و سرشانه قدامی.',
    techniqueTipFa: 'کتف‌ها را به سمت عقب و پایین قفل کنید (Retraction) و قوس طبیعی کمر را در طول ست حفظ نمایید.',
    instructions: [
      'روی نیمکت دراز بکشید به گونه‌ای که چشمانتان مستقیماً زیر هالتر قرار گیرد.',
      'هالتر را با فاصله‌ای کمی بازتر از عرض شانه بگیرید و مچ‌ها را صاف نگه دارید.',
      'هالتر را از رک بردارید و روی خط میانی سینه ثابت کنید.',
      'با کنترل کامل هالتر را تا روی خط نوک سینه پایین آورده و به آرامی لمس کنید.',
      'با انقباض قدرتی عضلات سینه هالتر را به نقطه شروع پرتاب نکرده و با تمرکز بالا ببرید.'
    ],
    commonMistakes: ['بلند شدن باسن از روی نیمکت', 'خم شدن مچ‌ها به عقب زیر وزنه سنگین', 'کوبیدن هالتر روی قفسه سینه'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '10', targetWeightKg: 50, completed: false },
      { id: 2, setNumber: 2, targetReps: '8', targetWeightKg: 60, completed: false },
      { id: 3, setNumber: 3, targetReps: '8', targetWeightKg: 65, completed: false },
      { id: 4, setNumber: 4, targetReps: '6', targetWeightKg: 70, completed: false }
    ]
  },
  {
    id: 'exercise_bench_press_dumbbell',
    nameFa: 'پرس سینه دمبل',
    nameEn: 'Dumbbell Bench Press',
    targetMuscle: 'سینه',
    primaryMuscle: 'سینه',
    equipment: 'دمبل + نیمکت',
    difficulty: 'متوسط',
    restSeconds: 75,
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop',
    notesFa: 'ایجاد دامنه حرکتی وسیع‌تر نسبت به هالتر و فعال‌سازی متقارن فیبرهای عضلانی سینه چپ و راست.',
    techniqueTipFa: 'در بالای حرکت دمبل‌ها را به هم نکوبید؛ تنش مداوم روی عضلات سینه را در بالاترین نقطه حفظ کنید.',
    instructions: [
      'دمبل‌ها را برداشته و روی زانوها قرار دهید و همزمان به پشت روی نیمکت تخت بخوابید.',
      'دمبل‌ها را در امتداد سینه نگه داشته و آرنج‌ها را با زاویه ۴۵ تا ۶۰ درجه نسبت به تنه قرار دهید.',
      'با نفس عمیق دمبل‌ها را با کنترل به آرامی پایین بیاورید تا کشش کامل در پکتورالیس ایجاد شود.',
      'با بازدم و انقباض سینه، دمبل‌ها را در یک مسیر کمانی کنترل‌شده بالا ببرید.'
    ],
    commonMistakes: ['باز کردن بیش از حد آرنج‌ها به موازات شانه‌ها (۹۰ درجه)', 'عدم کنترل در فاز منفی'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '12', targetWeightKg: 20, completed: false },
      { id: 2, setNumber: 2, targetReps: '10', targetWeightKg: 24, completed: false },
      { id: 3, setNumber: 3, targetReps: '8', targetWeightKg: 28, completed: false }
    ]
  },
  {
    id: 'exercise_incline_bench_press_barbell',
    nameFa: 'پرس بالا سینه هالتر',
    nameEn: 'Incline Barbell Bench Press',
    targetMuscle: 'سینه',
    primaryMuscle: 'بالاسینه',
    equipment: 'هالتر + نیمکت شیبدار',
    difficulty: 'متوسط',
    restSeconds: 90,
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop',
    notesFa: 'تمرکز اختصاصی بر سر ترقوه‌ای (Clavicular Head) عضله سینه جهت ایجاد حجم و برجستگی بالای سینه.',
    techniqueTipFa: 'زاویه نیمکت را بین ۳۰ تا ۴۵ درجه تنظیم کنید تا فشار بیش از حد به سرشانه قدامی منتقل نشود.',
    instructions: [
      'روی نیمکت با شیب مناسب بنشینید و کف پاها را محکم روی زمین قرار دهید.',
      'میله را کمی بازتر از عرض شانه بگیرید و از رک جدا کنید.',
      'هالتر را به آرامی به سمت بالای قفسه سینه (زیر استخوان ترقوه) فرود آورید.',
      'با انقباض فیبرهای بالاسینه، هالتر را مستقیماً به نقطه اوج بازگردانید.'
    ],
    commonMistakes: ['استفاده از شیب‌های بیش از ۴۵ درجه', 'پایین آوردن هالتر روی شکم به جای بالاسینه'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '10', targetWeightKg: 40, completed: false },
      { id: 2, setNumber: 2, targetReps: '8', targetWeightKg: 50, completed: false },
      { id: 3, setNumber: 3, targetReps: '8', targetWeightKg: 55, completed: false }
    ]
  },
  {
    id: 'exercise_incline_dumbbell_press',
    nameFa: 'پرس بالا سینه دمبل',
    nameEn: 'Incline Dumbbell Press',
    targetMuscle: 'سینه',
    primaryMuscle: 'بالاسینه',
    equipment: 'دمبل + نیمکت شیبدار',
    difficulty: 'متوسط',
    restSeconds: 75,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',
    notesFa: 'ترکیب آزادی دامنه حرکتی دمبل با شیب بالاسینه جهت بیشترین رشد هایپرتروفی در قسمت فوقانی سینه.',
    techniqueTipFa: 'در انتهای فاز مثبت، مچ‌ها را به هم نزدیک کنید تا انقباض ایزومتریک بالاسینه به اوج برسد.',
    instructions: [
      'روی میز شیبدار ۳۰ درجه قرار گرفته و دمبل‌ها را در امتداد شانه نگه‌دارید.',
      'آرنج‌ها را به نرمی خم کرده و دمبل‌ها را تا کنار سینه پایین بیاورید.',
      'با تمرکز بر انقباض بالاسینه، وزنه‌ها را در مسیری منحنی به سمت بالا هدایت کنید.'
    ],
    commonMistakes: ['قوس دادن مفرط به کمر برای شبیه‌سازی پرس تخت', 'افتادن کنترل‌نشده دمبل‌ها در انتهای ست'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '12', targetWeightKg: 18, completed: false },
      { id: 2, setNumber: 2, targetReps: '10', targetWeightKg: 22, completed: false },
      { id: 3, setNumber: 3, targetReps: '8', targetWeightKg: 26, completed: false }
    ]
  },
  {
    id: 'exercise_dumbbell_fly',
    nameFa: 'فلای دمبل',
    nameEn: 'Dumbbell Fly',
    targetMuscle: 'سینه',
    primaryMuscle: 'سینه',
    equipment: 'دمبل + نیمکت',
    difficulty: 'متوسط',
    restSeconds: 60,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
    notesFa: 'حرکت تک‌مفصلی ایزوله برای ایجاد کشش عمیق فاشیای عضلات سینه در نقطه انتهایی فاز اکسنتریک.',
    techniqueTipFa: 'زاویه آرنج‌ها را در حالت خمیدگی ملایم (۱۰ تا ۱۵ درجه) ثابت نگه دارید و آرنج‌ها را صاف و قفل نکنید.',
    instructions: [
      'روی نیمکت بخوابید و دمبل‌ها را با کف دست‌های رو به هم بالای سینه نگه‌دارید.',
      'دست‌ها را در یک مسیر قوسی باز کنید تا جایی که کشش مطبوعی در قفسه سینه احساس شود.',
      'مثل این که درختی را در آغوش می‌کشید، دمبل‌ها را به آرامی به نقطه آغاز بازگردانید.'
    ],
    commonMistakes: ['پایین بردن بیش از حد دمبل‌ها و آسیب به کپسول قدامی شانه', 'تبدیل کردن حرکت به پرس'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '15', targetWeightKg: 12, completed: false },
      { id: 2, setNumber: 2, targetReps: '12', targetWeightKg: 14, completed: false },
      { id: 3, setNumber: 3, targetReps: '12', targetWeightKg: 16, completed: false }
    ]
  },
  {
    id: 'exercise_cable_crossover',
    nameFa: 'کراس اور کابل',
    nameEn: 'Cable Crossover',
    targetMuscle: 'سینه',
    primaryMuscle: 'سینه',
    equipment: 'کابل',
    difficulty: 'مبتدی',
    restSeconds: 60,
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop',
    notesFa: 'تأمین تنش پیوسته و یکنواخت در تمام دامنه انقباضی عضلات سینه و پمپ خون فوق‌العاده.',
    techniqueTipFa: 'تنه را ثابت نگه داشته و از پرتاب بالاتنه به جلو خودداری فرمایید.',
    instructions: [
      'دستگیره‌های سیمکش را در ارتفاع بالا تنظیم کرده و یک گام به جلو بردارید.',
      'با اندکی خمیدگی در زانو و آرنج، دست‌ها را به سمت پایین و جلو هدایت کنید تا دستگیره‌ها به هم برسند.',
      'در نقطه اوج انقباض، عضلات سینه را ۱ ثانیه منقبض کرده سپس به آرامی باز شوید.'
    ],
    commonMistakes: ['تکان دادن بالاتنه و استفاده از اینرسی', 'خم و راست کردن مداوم مفصل آرنج'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '15', targetWeightKg: 15, completed: false },
      { id: 2, setNumber: 2, targetReps: '12', targetWeightKg: 20, completed: false },
      { id: 3, setNumber: 3, targetReps: '12', targetWeightKg: 20, completed: false }
    ]
  },
  {
    id: 'exercise_machine_chest_press',
    nameFa: 'پرس سینه دستگاه',
    nameEn: 'Machine Chest Press',
    targetMuscle: 'سینه',
    primaryMuscle: 'سینه',
    equipment: 'دستگاه',
    difficulty: 'مبتدی',
    restSeconds: 60,
    imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=600&auto=format&fit=crop',
    notesFa: 'تمرین با الگوی حرکتی هدایت‌شده و ایمن، بسیار ایده‌آل برای تمرکز محض بر پکتورالیس بدون دغدغه تثبیت تعادل.',
    techniqueTipFa: 'ارتفاع صندلی را به گونه‌ای تنظیم کنید که دستگیره‌ها درست هم‌سطح وسط قفسه سینه باشند.',
    instructions: [
      'پشت خود را کاملاً به تکیه‌گاه بچسبانید و دستگیره‌ها را بگیرید.',
      'دستگیره‌ها را به سمت جلو فشار دهید تا دست‌ها صاف شوند اما آرنج‌ها قفل نشوند.',
      'با کنترل سرعت به حالت اولیه برگردید تا پلاک‌های وزنه با هم برخورد نکنند.'
    ],
    commonMistakes: ['بلند شدن کتف‌ها از تکیه‌گاه صندلی', 'قفل کردن ناگهانی مفصل آرنج در انتهای حرکت'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '12', targetWeightKg: 40, completed: false },
      { id: 2, setNumber: 2, targetReps: '10', targetWeightKg: 50, completed: false },
      { id: 3, setNumber: 3, targetReps: '10', targetWeightKg: 55, completed: false }
    ]
  },

  // BACK (8-14)
  {
    id: 'exercise_pull_up',
    nameFa: 'بارفیکس',
    nameEn: 'Pull Up',
    targetMuscle: 'پشت',
    primaryMuscle: 'زیربغل',
    equipment: 'میله بارفیکس',
    difficulty: 'پیشرفته',
    restSeconds: 90,
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=600&auto=format&fit=crop',
    notesFa: 'شاهکار تمرینات وزن بدن برای عریض کردن عضلات پشتی بزرگ (Lats) و تقویت قدرت گریپ و بازوها.',
    techniqueTipFa: 'قبل از خم کردن بازوها، کتف‌ها را به سمت پایین بکشید (Depression) تا عضلات زیربغل درگیر شوند.',
    instructions: [
      'میله بارفیکس را با دست‌هایی کمی بازتر از عرض شانه و کف دست رو به جلو بگیرید.',
      'از میله آویزان شوید و عضلات مرکزی را سفت کنید.',
      'با کشیدن آرنج‌ها به سمت پایین و عقب، قفسه سینه را به میله نزدیک کنید تا چانه از میله عبور کند.',
      'با کنترل کامل و بدون تاب خوردن بدن به وضعیت کشش کامل برگردید.'
    ],
    commonMistakes: ['کیپینگ و ضربه زدن با پاها', 'نیمه‌کاره انجام دادن دامنه و نرسیدن به کشش کامل'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '8', targetWeightKg: 0, completed: false },
      { id: 2, setNumber: 2, targetReps: '8', targetWeightKg: 0, completed: false },
      { id: 3, setNumber: 3, targetReps: '6', targetWeightKg: 0, completed: false }
    ]
  },
  {
    id: 'exercise_lat_pulldown',
    nameFa: 'لت پولداون',
    nameEn: 'Lat Pulldown',
    targetMuscle: 'پشت',
    primaryMuscle: 'زیربغل',
    equipment: 'دستگاه کابل',
    difficulty: 'مبتدی',
    restSeconds: 75,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
    notesFa: 'جایگزین عالی و قابل تنظیم بارفیکس با امکان بارگذاری دقیق جهت پهن شدن عضلات لت.',
    techniqueTipFa: 'میله را به سمت بالای سینه بکشید نه پشت گردن؛ بالاتنه را تنها ۱۰ تا ۱۵ درجه به عقب متمایل کنید.',
    instructions: [
      'زانوها را زیر پد محکم فیکس کنید و میله عریض را بگیرید.',
      'با هدایت آرنج‌ها به سمت پهلوها، میله را به آرامی تا استخوان جناغ سینه پایین بیاورید.',
      'در نقطه پایین یک ثانیه مکث کرده و عضلات پشتی را منقبض کنید سپس با کنترل به بالا برگردید.'
    ],
    commonMistakes: ['تاب خوردن شدید کمر به عقب', 'پایین کشیدن میله با قدرت مچ و ساعد به جای زیربغل'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '12', targetWeightKg: 40, completed: false },
      { id: 2, setNumber: 2, targetReps: '10', targetWeightKg: 45, completed: false },
      { id: 3, setNumber: 3, targetReps: '10', targetWeightKg: 50, completed: false }
    ]
  },
  {
    id: 'exercise_seated_cable_row',
    nameFa: 'قایقی سیمکش',
    nameEn: 'Seated Cable Row',
    targetMuscle: 'پشت',
    primaryMuscle: 'پشت',
    equipment: 'کابل',
    difficulty: 'مبتدی',
    restSeconds: 75,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
    notesFa: 'ایجاد ضخامت و جزئیات عمیق در عضلات میانی پشت، متوازی‌الاضلاع (Rhomboids) و فیله کمر.',
    techniqueTipFa: 'ستون فقرات را کاملاً خنثی نگه دارید و در انتهای کشش اجازه دهید کتف‌ها به جلو باز شوند.',
    instructions: [
      'روی دستگاه بنشینید و پاها را روی رک قرار دهید به طوری که زانوها اندکی خم باشند.',
      'دستگیره V شکل را بگیرید و بالاتنه را صاف و عمود بر نشیمنگاه قرار دهید.',
      'دستگیره را به سمت ناف بکشید و تیغه‌های کتف را به یکدیگر بفشارید.',
      'با فاز منفی کنترل‌شده، دست‌ها را به جلو رها کنید.'
    ],
    commonMistakes: ['قوز کردن پشت', 'پرتاب تنه به جلو و عقب در حین اجرا'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '12', targetWeightKg: 35, completed: false },
      { id: 2, setNumber: 2, targetReps: '10', targetWeightKg: 40, completed: false },
      { id: 3, setNumber: 3, targetReps: '10', targetWeightKg: 45, completed: false }
    ]
  },
  {
    id: 'exercise_one_arm_dumbbell_row',
    nameFa: 'پارویی دمبل تک دست',
    nameEn: 'One Arm Dumbbell Row',
    targetMuscle: 'پشت',
    primaryMuscle: 'زیربغل',
    equipment: 'دمبل',
    difficulty: 'مبتدی',
    restSeconds: 60,
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop',
    notesFa: 'اصلاح ناهماهنگی عضلانی بین دو سمت بدن با تمرکز بی‌نظیر بر عضلات لت و پشت.',
    techniqueTipFa: 'دمبل را به سمت استخوان لگن هدایت کنید نه به سمت سینه، تا بیشترین درگیری در لت پایینی رخ دهد.',
    instructions: [
      'یک دست و یک زانو را روی نیمکت قرار داده و پای دیگر را محکم روی زمین تکیه دهید.',
      'دمبل را با دست آزاد بگیرید در حالی که پشت کاملاً صاف و موازی زمین است.',
      'دمبل را با حرکت دادن آرنج به سمت بالا و عقب بکشید.',
      'با انقباض شدید زیربغل در نقطه اوج، به آرامی دمبل را پایین بیاورید.'
    ],
    commonMistakes: ['چرخاندن تنه به سمت بالا', 'خم کردن بیش از حد مچ دست'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '12', targetWeightKg: 16, completed: false },
      { id: 2, setNumber: 2, targetReps: '10', targetWeightKg: 20, completed: false },
      { id: 3, setNumber: 3, targetReps: '10', targetWeightKg: 22, completed: false }
    ]
  },
  {
    id: 'exercise_barbell_row',
    nameFa: 'پارویی هالتر',
    nameEn: 'Barbell Row',
    targetMuscle: 'پشت',
    primaryMuscle: 'پشت',
    equipment: 'هالتر',
    difficulty: 'متوسط',
    restSeconds: 90,
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop',
    notesFa: 'حرکت سنگین کامپاند برای ایجاد ضخامت همه‌جانبه در عضلات پشتی و تقویت عضلات پایدارکننده تنه.',
    techniqueTipFa: 'زاویه بالاتنه را در حدود ۴۵ درجه نسبت به افق نگه دارید و زانوها را اندکی خم کنید.',
    instructions: [
      'پشت هالتر بایستید، باسن را به عقب بفرستید و هالتر را با دست‌هایی به عرض شانه بگیرید.',
      'پشت را صاف و شکم را سفت کنید.',
      'هالتر را در مسیر ران‌ها به سمت بالای ناف هدایت کنید.',
      'در نقطه بالا کتف‌ها را جمع کرده و با تمرکز به نقطه زیر زانو پایین بیاورید.'
    ],
    commonMistakes: ['قوز کردن در ناحیه کمری', 'بالا انداختن تنه برای بالا کشیدن وزنه'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '10', targetWeightKg: 40, completed: false },
      { id: 2, setNumber: 2, targetReps: '8', targetWeightKg: 50, completed: false },
      { id: 3, setNumber: 3, targetReps: '8', targetWeightKg: 55, completed: false }
    ]
  },
  {
    id: 'exercise_conventional_deadlift',
    nameFa: 'ددلیفت',
    nameEn: 'Conventional Deadlift',
    targetMuscle: 'پشت',
    primaryMuscle: 'پشت و زنجیره خلفی',
    equipment: 'هالتر',
    difficulty: 'پیشرفته',
    restSeconds: 120,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
    notesFa: 'پادشاه حرکات زنجیره خلفی؛ درگیرکننده عضلات فیله، باسن، همسترینگ، زیربغل، ذوزنقه و ساعد.',
    techniqueTipFa: 'میله هالتر باید در تمام طول حرکت به ساق‌ها و ران‌ها مماس باشد و هرگز از بدن فاصله نگیرد.',
    instructions: [
      'پاها را به عرض لگن باز کنید به طوری که میله از وسط بند کفش‌ها عبور کند.',
      'باسن را عقب داده، میله را بگیرید و سینه را بالا و مغرور نگه‌دارید.',
      'با فشار پاشنه‌ها به زمین و اکستنشن همزمان زانو و لگن، میله را تا صاف شدن کامل بدن بالا بکشید.',
      'در بالای حرکت بیش از حد به عقب خم نشوید؛ با هدایت لگن به عقب وزنه را فرود آورید.'
    ],
    commonMistakes: ['قوس دادن رو به بیرون به مهره‌های کمری', 'کشیدن هالتر با دست‌های خمیده'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '6', targetWeightKg: 70, completed: false },
      { id: 2, setNumber: 2, targetReps: '5', targetWeightKg: 90, completed: false },
      { id: 3, setNumber: 3, targetReps: '5', targetWeightKg: 100, completed: false }
    ]
  },
  {
    id: 'exercise_tbar_row',
    nameFa: 'تی‌بار رو',
    nameEn: 'T-Bar Row',
    targetMuscle: 'پشت',
    primaryMuscle: 'پشت',
    equipment: 'T-Bar',
    difficulty: 'متوسط',
    restSeconds: 80,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',
    notesFa: 'امکان اعمال بار سنگین‌تر با گریپ خنثی جهت هایپرتروفی عضلات پشتی میانی و بالایی.',
    techniqueTipFa: 'باسن را عقب نگه دارید و از باز شدن ناگهانی زاویه تنه اجتناب کنید.',
    instructions: [
      'روی دستگاه یا لندماین قرار بگیرید و دستگیره دوبل را بگیرید.',
      'پشت را صاف کنید و زانوها را اندکی خم نگه دارید.',
      'میله را به سمت سینه بالا بکشید و در اوج کتف‌ها را منقبض کنید.',
      'به آرامی به وضعیت کشش عمیق بازگردید.'
    ],
    commonMistakes: ['استفاده از ضربه زدن با زانو', 'عدم انقباض کامل عضلات میانی پشت'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '10', targetWeightKg: 30, completed: false },
      { id: 2, setNumber: 2, targetReps: '8', targetWeightKg: 40, completed: false },
      { id: 3, setNumber: 3, targetReps: '8', targetWeightKg: 45, completed: false }
    ]
  },

  // SHOULDERS (15-20)
  {
    id: 'exercise_dumbbell_shoulder_press',
    nameFa: 'پرس سرشانه دمبل',
    nameEn: 'Dumbbell Shoulder Press',
    targetMuscle: 'سرشانه',
    primaryMuscle: 'سرشانه',
    equipment: 'دمبل',
    difficulty: 'متوسط',
    restSeconds: 75,
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop',
    notesFa: 'تمرین کلیدی برای ساخت حجم و عرض سرشانه‌ها با تمرکز بر دلتوئید قدامی و میانی.',
    techniqueTipFa: 'آرنج‌ها را کمی به سمت داخل (صفحه اسکاپولار) متمایل کنید تا مفصل شانه در ایمنی کامل باشد.',
    instructions: [
      'روی نیمکت با تکیه‌گاه عمود بنشینید و دمبل‌ها را در سطح گوش‌ها نگه‌دارید.',
      'با انقباض سرشانه‌ها، دمبل‌ها را به سمت بالای سر پرس کنید بدون قفل کردن آرنج.',
      'با کنترل سرعت دمبل‌ها را تا کنار گوش‌ها فرود آورید.'
    ],
    commonMistakes: ['کمان کردن بیش از حد کمر', 'پایین آوردن دمبل‌ها پایین‌تر از حد مجاز مفصل شانه'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '12', targetWeightKg: 14, completed: false },
      { id: 2, setNumber: 2, targetReps: '10', targetWeightKg: 18, completed: false },
      { id: 3, setNumber: 3, targetReps: '8', targetWeightKg: 20, completed: false }
    ]
  },
  {
    id: 'exercise_barbell_overhead_press',
    nameFa: 'پرس سرشانه هالتر',
    nameEn: 'Barbell Overhead Press',
    targetMuscle: 'سرشانه',
    primaryMuscle: 'سرشانه',
    equipment: 'هالتر',
    difficulty: 'پیشرفته',
    restSeconds: 90,
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop',
    notesFa: 'آزمون اصیل قدرت بالاتنه به صورت ایستاده با درگیری شدید عضلات مرکزی و دلتوئیدها.',
    techniqueTipFa: 'باسن و عضلات شکم را سفت منقبض کنید تا ستون فقرات در وضعیتی پایدار قفل شود.',
    instructions: [
      'هالتر را در سطح ترقوه با دست‌هایی به عرض شانه بگیرید.',
      'سر را کمی عقب ببرید تا مسیر میله باز شود و هالتر را مستقیم بالای سر پرس کنید.',
      'پس از عبور میله از سر، سر را به جلو برگردانید و میله را تثبیت نمایید.',
      'با کنترل کامل هالتر را روی سینه فرود آورید.'
    ],
    commonMistakes: ['خم شدن به عقب برای شبیه‌سازی پرس سینه', 'شل کردن عضلات کور و شکم'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '8', targetWeightKg: 35, completed: false },
      { id: 2, setNumber: 2, targetReps: '6', targetWeightKg: 40, completed: false },
      { id: 3, setNumber: 3, targetReps: '6', targetWeightKg: 45, completed: false }
    ]
  },
  {
    id: 'exercise_dumbbell_lateral_raise',
    nameFa: 'نشر جانب دمبل',
    nameEn: 'Dumbbell Lateral Raise',
    targetMuscle: 'سرشانه',
    primaryMuscle: 'سرشانه میانی',
    equipment: 'دمبل',
    difficulty: 'مبتدی',
    restSeconds: 60,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
    notesFa: 'مهم‌ترین حرکت برای ساخت پهنای سرشانه و فرم ساعت شنی در بالاتنه.',
    techniqueTipFa: 'حرکت را با بالا بردن آرنج‌ها هدایت کنید و شست‌ها را کمی متمایل به پایین نگه‌دارید.',
    instructions: [
      'دمبل‌ها را در کنار پهلوها نگه‌دارید و کمی بالاتنه را به جلو متمایل کنید.',
      'دست‌ها را از طرفین تا ارتفاع شانه بالا بیاورید در حالی که آرنج اندکی خم است.',
      'در نقطه اوج یک ثانیه مکث کنید و با فاز منفی آرام فرود آورید.'
    ],
    commonMistakes: ['پرتاب کردن وزنه‌های سنگین با تکان دادن بالاتنه', 'بالا بردن مچ‌ها بالاتر از آرنج'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '15', targetWeightKg: 7, completed: false },
      { id: 2, setNumber: 2, targetReps: '15', targetWeightKg: 8, completed: false },
      { id: 3, setNumber: 3, targetReps: '12', targetWeightKg: 10, completed: false }
    ]
  },
  {
    id: 'exercise_dumbbell_front_raise',
    nameFa: 'نشر جلو دمبل',
    nameEn: 'Dumbbell Front Raise',
    targetMuscle: 'سرشانه',
    primaryMuscle: 'سرشانه جلو',
    equipment: 'دمبل',
    difficulty: 'مبتدی',
    restSeconds: 60,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',
    notesFa: 'ایزوله کردن بخش قدامی دلتوئید جهت ایجاد تفکیک عضلانی خط شانه.',
    techniqueTipFa: 'حرکت را بدون تکانه انجام دهید و دمبل را تا سطح چشم‌ها بالا ببرید.',
    instructions: [
      'بایستید و دمبل‌ها را در جلوی ران‌ها نگه‌دارید.',
      'یکی پس از دیگری یا همزمان، دمبل را تا سطح افق بالا بیاورید.',
      'با کنترل ملایم به نقطه آغازین بازگردانید.'
    ],
    commonMistakes: ['تکان دادن لگن به جلو برای پرتاب دمبل', 'بالا بردن بیش از حد و فشار به گردن'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '12', targetWeightKg: 8, completed: false },
      { id: 2, setNumber: 2, targetReps: '12', targetWeightKg: 9, completed: false },
      { id: 3, setNumber: 3, targetReps: '10', targetWeightKg: 10, completed: false }
    ]
  },
  {
    id: 'exercise_reverse_dumbbell_fly',
    nameFa: 'فلای معکوس',
    nameEn: 'Reverse Dumbbell Fly',
    targetMuscle: 'سرشانه',
    primaryMuscle: 'سرشانه خلفی',
    equipment: 'دمبل',
    difficulty: 'مبتدی',
    restSeconds: 60,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
    notesFa: 'تقویت دلتوئید خلفی و بهبود پاسچر و جلوگیری از افتادگی شانه‌ها به جلو.',
    techniqueTipFa: 'تنه را تا نزدیکی موازی با زمین خم کرده و تمرکز را روی کشیدن دست‌ها به عقب با سرشانه پشت بگذارید.',
    instructions: [
      'از ناحیه لگن خم شوید و پشت را صاف نگه‌دارید.',
      'دمبل‌ها را با آرنج‌های کمی خمیده به طرفین و عقب باز کنید.',
      'در نقطه انقباض سرشانه خلفی مکث کرده و به نرمی پایین بیاورید.'
    ],
    commonMistakes: ['استفاده از عضلات ذوزنقه به جای دلتوئید خلفی', 'قوز کردن گردن و پشت'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '15', targetWeightKg: 6, completed: false },
      { id: 2, setNumber: 2, targetReps: '15', targetWeightKg: 7, completed: false },
      { id: 3, setNumber: 3, targetReps: '12', targetWeightKg: 8, completed: false }
    ]
  },
  {
    id: 'exercise_face_pull',
    nameFa: 'فیس پول',
    nameEn: 'Face Pull',
    targetMuscle: 'سرشانه',
    primaryMuscle: 'سرشانه خلفی',
    equipment: 'کابل',
    difficulty: 'مبتدی',
    restSeconds: 60,
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop',
    notesFa: 'بهترین حرکت سلامت مفصل شانه و عضلات چرخاننده کاف (Rotator Cuff) و دلتوئید پشتی.',
    techniqueTipFa: 'طناب را در ارتفاع چشم یا پیشانی تنظیم کنید و در انتهای حرکت چرخش خارجی مچ‌ها را اعمال کنید.',
    instructions: [
      'طناب متصل به کابل را با دو دست بگیرید به طوری که شست‌ها رو به عقب باشد.',
      'طناب را به سمت پیشانی بکشید و همزمان دست‌ها را به طرفین باز کنید.',
      'در انتهای حرکت عضلات پشتی شانه را منقبض کرده و به آرامی باز شوید.'
    ],
    commonMistakes: ['انتخاب وزنه‌های سنگین و از دست دادن فرم ارگونومیک', 'کشیدن به سمت چانه به جای پیشانی'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '15', targetWeightKg: 15, completed: false },
      { id: 2, setNumber: 2, targetReps: '15', targetWeightKg: 20, completed: false },
      { id: 3, setNumber: 3, targetReps: '15', targetWeightKg: 20, completed: false }
    ]
  },

  // BICEPS (21-25)
  {
    id: 'exercise_barbell_curl',
    nameFa: 'جلو بازو هالتر',
    nameEn: 'Barbell Curl',
    targetMuscle: 'جلو بازو',
    primaryMuscle: 'جلو بازو',
    equipment: 'هالتر',
    difficulty: 'مبتدی',
    restSeconds: 60,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',
    notesFa: 'پایه‌ای‌ترین تمرین برای افزایش حجم کلی دو سر بازویی.',
    techniqueTipFa: 'آرنج‌ها را به پهلوها بچسبانید و از جلو آمدن آرنج در حین بالا بردن میله خودداری کنید.',
    instructions: [
      'صاف بایستید و میله را با دست‌هایی به عرض شانه و کف دست رو به بالا بگیرید.',
      'با انقباض جلو بازو، میله را در یک کمان کنترل‌شده به سمت سینه بالا بیاورید.',
      'در بالاترین نقطه انقباض را حس کرده و با فاز منفی ۳ ثانیه‌ای پایین بیاورید.'
    ],
    commonMistakes: ['استفاده از ضربه کمر و پرتاب میله', 'جلو بردن آرنج‌ها برای راحت‌تر کردن وزنه'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '12', targetWeightKg: 20, completed: false },
      { id: 2, setNumber: 2, targetReps: '10', targetWeightKg: 25, completed: false },
      { id: 3, setNumber: 3, targetReps: '8', targetWeightKg: 30, completed: false }
    ]
  },
  {
    id: 'exercise_alternating_dumbbell_curl',
    nameFa: 'جلو بازو دمبل تناوبی',
    nameEn: 'Alternating Dumbbell Curl',
    targetMuscle: 'جلو بازو',
    primaryMuscle: 'جلو بازو',
    equipment: 'دمبل',
    difficulty: 'مبتدی',
    restSeconds: 60,
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop',
    notesFa: 'بهره‌گیری از سوپینیشن (چرخش مچ به خارج) برای اوج انقباض سر بلند و کوتاه بازو.',
    techniqueTipFa: 'در نیمه راه بالا آمدن دمبل، مچ را به سمت خارج بچرخانید تا انگشت کوچک بالاتر از شست قرار گیرد.',
    instructions: [
      'بایستید یا بنشینید و دمبل‌ها را در کنار بدن با کف دست رو به داخل نگه‌دارید.',
      'یک دست را بالا آورده و همزمان مچ را به سمت بالا بچرخانید.',
      'در نقطه اوج انقباض ۱ ثانیه مکث کرده و سپس با دست دیگر تکرار کنید.'
    ],
    commonMistakes: ['چرخاندن ناقص مچ دست', 'حرکت دادن آرنج به عقب'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '12', targetWeightKg: 10, completed: false },
      { id: 2, setNumber: 2, targetReps: '10', targetWeightKg: 12, completed: false },
      { id: 3, setNumber: 3, targetReps: '10', targetWeightKg: 14, completed: false }
    ]
  },
  {
    id: 'exercise_hammer_curl',
    nameFa: 'جلو بازو چکشی',
    nameEn: 'Hammer Curl',
    targetMuscle: 'جلو بازو',
    primaryMuscle: 'جلو بازو',
    equipment: 'دمبل',
    difficulty: 'مبتدی',
    restSeconds: 60,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
    notesFa: 'تمرکز ویژه بر عضله براکیالیس (Brachialis) و براکیورادیالیس جهت ضخامت بازو از نمای روبرو و ساعد.',
    techniqueTipFa: 'کف دست‌ها را در تمام طول دامنه حرکت رو به روی یکدیگر ثابت نگه‌دارید.',
    instructions: [
      'دمبل‌ها را با وضعیت خنثی در کنار بدن بگیرید.',
      'دمبل را مستقیماً به سمت بالا جمع کنید مثل کوبیدن چکش.',
      'با انقباض ساعد و بازو در بالا مکث نموده و به آرامی فرود آورید.'
    ],
    commonMistakes: ['تاب دادن بالاتنه', 'کج کردن مچ‌ها به طرفین'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '12', targetWeightKg: 12, completed: false },
      { id: 2, setNumber: 2, targetReps: '10', targetWeightKg: 14, completed: false },
      { id: 3, setNumber: 3, targetReps: '10', targetWeightKg: 16, completed: false }
    ]
  },
  {
    id: 'exercise_preacher_curl',
    nameFa: 'جلو بازو لاری',
    nameEn: 'Preacher Curl',
    targetMuscle: 'جلو بازو',
    primaryMuscle: 'جلو بازو',
    equipment: 'دستگاه/هالتر + میز لاری',
    difficulty: 'متوسط',
    restSeconds: 60,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',
    notesFa: 'حذف کامل هرگونه تقلب و کمک عضلات پشتی با قفل شدن بازوها روی میز لاری.',
    techniqueTipFa: 'در انتهای فاز منفی آرنج‌ها را به طور کامل قفل نکنید تا از فشار نامتعارف روی تاندون بی سپس جلوگیری شود.',
    instructions: [
      'پشت میز لاری بنشینید و زیربغل‌ها را کاملاً روی لبه بالایی پد فیکس کنید.',
      'هالتر EZ را بگیرید و وزنه را به سمت چانه جمع کنید.',
      'با کنترل شدید و کشش ملایم وزنه را پایین ببرید.'
    ],
    commonMistakes: ['بلند شدن باسن از روی صندلی', 'رها کردن ناگهانی وزنه در پایین‌ترین نقطه'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '12', targetWeightKg: 15, completed: false },
      { id: 2, setNumber: 2, targetReps: '10', targetWeightKg: 20, completed: false },
      { id: 3, setNumber: 3, targetReps: '8', targetWeightKg: 25, completed: false }
    ]
  },
  {
    id: 'exercise_cable_curl',
    nameFa: 'جلو بازو سیمکش',
    nameEn: 'Cable Curl',
    targetMuscle: 'جلو بازو',
    primaryMuscle: 'جلو بازو',
    equipment: 'کابل',
    difficulty: 'مبتدی',
    restSeconds: 60,
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop',
    notesFa: 'تنش خطی مداوم در سرتاسر دامنه حرکتی حتی در بالاترین نقطه اوج انقباض.',
    techniqueTipFa: 'صاف بایستید و به سیمکش خیلی نزدیک یا خیلی دور نشوید.',
    instructions: [
      'میله صاف یا خمیده سیمکش را بگیرید و یک قدم عقب بروید.',
      'با ثبات کامل آرنج‌ها، میله را به سمت سینه جمع کنید.',
      'در نقطه اوج مکث کرده و به آرامی باز شوید.'
    ],
    commonMistakes: ['عقب رفتن شانه در حین بالا کشیدن میله', 'سرعت زیاد در فاز بازگشت'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '15', targetWeightKg: 20, completed: false },
      { id: 2, setNumber: 2, targetReps: '12', targetWeightKg: 25, completed: false },
      { id: 3, setNumber: 3, targetReps: '10', targetWeightKg: 30, completed: false }
    ]
  },

  // TRICEPS (26-30)
  {
    id: 'exercise_cable_triceps_pushdown',
    nameFa: 'پشت بازو سیمکش',
    nameEn: 'Cable Triceps Pushdown',
    targetMuscle: 'پشت بازو',
    primaryMuscle: 'پشت بازو',
    equipment: 'کابل',
    difficulty: 'مبتدی',
    restSeconds: 60,
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop',
    notesFa: 'اصلی‌ترین حرکت برای درگیری سر جانبی و میانی سه سر بازویی با تنش پایدار.',
    techniqueTipFa: 'آرنج‌ها را در کنار پهلوها قفل کنید؛ تنها ساعدها باید حرکت کنند.',
    instructions: [
      'میله صاف یا زاویه‌دار را بگیرید و اندکی از بالاتنه به جلو متمایل شوید.',
      'با صاف کردن آرنج‌ها میله را به سمت پایین هدایت کنید.',
      'در انتهای حرکت دست‌ها را کاملاً صاف کرده و پشت بازو را فشرده کنید.',
      'با کنترل ساعدها را تا زاویه ۹۰ درجه بالا بیاورید.'
    ],
    commonMistakes: ['حرکت دادن آرنج‌ها به جلو و عقب', 'قوس دادن به مچ دست'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '15', targetWeightKg: 25, completed: false },
      { id: 2, setNumber: 2, targetReps: '12', targetWeightKg: 30, completed: false },
      { id: 3, setNumber: 3, targetReps: '10', targetWeightKg: 35, completed: false }
    ]
  },
  {
    id: 'exercise_overhead_dumbbell_triceps_extension',
    nameFa: 'پشت بازو بالای سر دمبل',
    nameEn: 'Overhead Dumbbell Triceps Extension',
    targetMuscle: 'پشت بازو',
    primaryMuscle: 'پشت بازو',
    equipment: 'دمبل',
    difficulty: 'مبتدی',
    restSeconds: 60,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
    notesFa: 'کشش عمیق سر بلند پشت بازو (Long Head) به دلیل وضعیت قرارگیری بازو بالای سر.',
    techniqueTipFa: 'آرنج‌ها را به سمت طرفین بیش از حد باز نکنید و آن‌ها را رو به جلو و سقف نگه دارید.',
    instructions: [
      'روی صندلی بنشینید و یک دمبل سنگین را با دو دست بالای سر ببرید.',
      'دمبل را به آرامی پشت سر پایین بیاورید تا کشش کامل در پشت بازو ایجاد شود.',
      'با تمرکز بر انقباض سه سر، دمبل را مجدداً به بالای سر هدایت نمایید.'
    ],
    commonMistakes: ['برخورد دمبل به پشت سر یا گردن', 'خم شدن مفرط کمر'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '12', targetWeightKg: 18, completed: false },
      { id: 2, setNumber: 2, targetReps: '10', targetWeightKg: 22, completed: false },
      { id: 3, setNumber: 3, targetReps: '10', targetWeightKg: 24, completed: false }
    ]
  },
  {
    id: 'exercise_ez_bar_skull_crusher',
    nameFa: 'پشت بازو خوابیده هالتر',
    nameEn: 'EZ Bar Skull Crusher',
    targetMuscle: 'پشت بازو',
    primaryMuscle: 'پشت بازو',
    equipment: 'هالتر EZ',
    difficulty: 'متوسط',
    restSeconds: 75,
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop',
    notesFa: 'تمرین عالی برای توسعه حجم بازو و بارگذاری بهینه روی سر بلند و جانبی.',
    techniqueTipFa: 'میله را به سمت پیشانی یا بالای سر هدایت کنید و بازوها را با زاویه کمی مایل به عقب نگه دارید.',
    instructions: [
      'روی نیمکت تخت دراز بکشید و هالتر EZ را با دست‌های جمع بالای سینه نگه دارید.',
      'با خم کردن آرنج‌ها، میله را با کنترل به سمت بالای پیشانی پایین ببرید.',
      'با انقباض پشت بازو، میله را به وضعیت اولیه برگردانید.'
    ],
    commonMistakes: ['باز شدن بیش از حد آرنج‌ها به طرفین', 'افتادن سریع میله روی صورت'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '12', targetWeightKg: 20, completed: false },
      { id: 2, setNumber: 2, targetReps: '10', targetWeightKg: 25, completed: false },
      { id: 3, setNumber: 3, targetReps: '8', targetWeightKg: 30, completed: false }
    ]
  },
  {
    id: 'exercise_bench_dips',
    nameFa: 'دیپ پشت بازو',
    nameEn: 'Bench Dips',
    targetMuscle: 'پشت بازو',
    primaryMuscle: 'پشت بازو',
    equipment: 'نیمکت',
    difficulty: 'مبتدی',
    restSeconds: 60,
    imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=600&auto=format&fit=crop',
    notesFa: 'حرکت موثر با وزن بدن برای تقویت عضلات سه سر و سرشانه قدامی.',
    techniqueTipFa: 'پشت خود را نزدیک به لبه نیمکت نگه دارید و از دور شدن باسن از نیمکت بپرهیزید.',
    instructions: [
      'دست‌ها را روی لبه نیمکت بگذارید و پاها را در جلو صاف یا نیمه‌خم قرار دهید.',
      'با خم کردن آرنج‌ها، بدن را تا زاویه ۹۰ درجه آرنج پایین بیاورید.',
      'با فشار کف دست‌ها به نیمکت، بدن را بالا ببرید.'
    ],
    commonMistakes: ['پایین رفتن بیش از ۹۰ درجه و کشیدگی خطرناک مفصل شانه'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '15', targetWeightKg: 0, completed: false },
      { id: 2, setNumber: 2, targetReps: '12', targetWeightKg: 0, completed: false },
      { id: 3, setNumber: 3, targetReps: '12', targetWeightKg: 0, completed: false }
    ]
  },
  {
    id: 'exercise_rope_triceps_pushdown',
    nameFa: 'پشت بازو طناب',
    nameEn: 'Rope Triceps Pushdown',
    targetMuscle: 'پشت بازو',
    primaryMuscle: 'پشت بازو',
    equipment: 'کابل + طناب',
    difficulty: 'مبتدی',
    restSeconds: 60,
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop',
    notesFa: 'امکان باز کردن انتهای طناب برای دستیابی به حداکثر انقباض سر خارجی پشت بازو.',
    techniqueTipFa: 'در انتهای فاز مثبت دست‌ها را از هم باز کنید و مچ‌ها را به سمت خارج قفل کنید.',
    instructions: [
      'طناب را با دستگیره خنثی بگیرید و آرنج‌ها را کنار بدن ثابت کنید.',
      'طناب را به سمت پایین بکشید و در انتها دو سر طناب را به طرفین مایل کنید.',
      '۱ ثانیه انقباض را حفظ کرده و به آرامی بالا بیایید.'
    ],
    commonMistakes: ['استفاده از سرشانه برای کشیدن طناب', 'عدم باز کردن دست‌ها در انتهای حرکت'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '15', targetWeightKg: 15, completed: false },
      { id: 2, setNumber: 2, targetReps: '12', targetWeightKg: 20, completed: false },
      { id: 3, setNumber: 3, targetReps: '12', targetWeightKg: 20, completed: false }
    ]
  },

  // LEGS (31-40)
  {
    id: 'exercise_barbell_back_squat',
    nameFa: 'اسکوات هالتر',
    nameEn: 'Barbell Back Squat',
    targetMuscle: 'پا',
    primaryMuscle: 'چهارسر ران',
    equipment: 'هالتر',
    difficulty: 'پیشرفته',
    restSeconds: 120,
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop',
    notesFa: 'مادر تمام حرکات بدنسازی برای ساخت قدرت انفجاری، هایپرتروفی پایین‌تنه و ترشح هورمون‌های آنابولیک.',
    techniqueTipFa: 'زانوها را در راستای انگشتان شست پا هدایت کنید و سینه را بالا و ستون فقرات را خنثی نگه دارید.',
    instructions: [
      'میله را روی عضلات کول (تراپزیوس) قرار دهید و پاها را کمی بازتر از عرض شانه بگذارید.',
      'با عقب فرستادن لگن و خم کردن زانوها، تا جایی پایین بروید که ران‌ها با زمین موازی شوند.',
      'با فشار محکم پاشنه‌ها به زمین، به وضعیت ایستاده بازگردید.'
    ],
    commonMistakes: ['داخل آمدن زانوها به سمت یکدیگر (Knee Valgus)', 'بلند شدن پاشنه پا از زمین'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '10', targetWeightKg: 60, completed: false },
      { id: 2, setNumber: 2, targetReps: '8', targetWeightKg: 80, completed: false },
      { id: 3, setNumber: 3, targetReps: '8', targetWeightKg: 90, completed: false },
      { id: 4, setNumber: 4, targetReps: '6', targetWeightKg: 100, completed: false }
    ]
  },
  {
    id: 'exercise_goblet_squat',
    nameFa: 'اسکوات جام',
    nameEn: 'Goblet Squat',
    targetMuscle: 'پا',
    primaryMuscle: 'چهارسر ران',
    equipment: 'دمبل/کتلبل',
    difficulty: 'مبتدی',
    restSeconds: 60,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',
    notesFa: 'ایده‌آل‌ترین اسکوات برای یادگیری عمق حرکت و ارگونومی صحیح بدون فشار محوری به ستون فقرات.',
    techniqueTipFa: 'دمبل را مانند جام در جلوی قفسه سینه نگه‌دارید و آرنج‌ها را به داخل هدایت کنید.',
    instructions: [
      'یک دمبل یا کتلبل را جلوی سینه نگه دارید و پاها را به عرض شانه باز کنید.',
      'به آرامی اسکوات بزنید به طوری که آرنج‌ها بین زانوها قرار گیرند.',
      'با سینه بالا و پشت صاف به نقطه شروع بازگردید.'
    ],
    commonMistakes: ['افتادن تنه به جلو', 'قوس دادن به کمر'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '12', targetWeightKg: 16, completed: false },
      { id: 2, setNumber: 2, targetReps: '12', targetWeightKg: 20, completed: false },
      { id: 3, setNumber: 3, targetReps: '10', targetWeightKg: 24, completed: false }
    ]
  },
  {
    id: 'exercise_leg_press',
    nameFa: 'پرس پا',
    nameEn: 'Leg Press',
    targetMuscle: 'پا',
    primaryMuscle: 'چهارسر ران',
    equipment: 'دستگاه',
    difficulty: 'مبتدی',
    restSeconds: 90,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
    notesFa: 'بارگذاری سنگین و امن روی چهارسر و باسن با پشتیبان کامل کمر.',
    techniqueTipFa: 'در بالای حرکت زانوها را به هیچ وجه قفل نکنید؛ باسن نباید از صندلی بلند شود.',
    instructions: [
      'روی صندلی بنشینید و پاها را به عرض شانه در مرکز صفحه قرار دهید.',
      'ضامن دستگاه را آزاد کرده و صفحه را تا زاویه ۹۰ درجه زانو پایین بیاورید.',
      'با فشار پاشنه‌ها و سینه پا، صفحه را بدون ضربه به بالا برانید.'
    ],
    commonMistakes: ['قفل کردن زانوها زیر بار سنگین', 'بلند شدن نشیمنگاه از تکیه‌گاه'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '12', targetWeightKg: 100, completed: false },
      { id: 2, setNumber: 2, targetReps: '10', targetWeightKg: 140, completed: false },
      { id: 3, setNumber: 3, targetReps: '10', targetWeightKg: 160, completed: false }
    ]
  },
  {
    id: 'exercise_leg_extension',
    nameFa: 'جلو پا دستگاه',
    nameEn: 'Leg Extension',
    targetMuscle: 'پا',
    primaryMuscle: 'چهارسر ران',
    equipment: 'دستگاه',
    difficulty: 'مبتدی',
    restSeconds: 60,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
    notesFa: 'ایزوله کردن مستقیم عضلات چهارسر ران به ویژه بخش واستوس مدیالیس.',
    techniqueTipFa: 'پشت زانو را به لبه صندلی مماس کنید و پد را روی مچ پا تنظیم فرمایید.',
    instructions: [
      'روی دستگاه بنشینید و دستگیره‌ها را محکم بگیرید.',
      'پاها را صاف کنید و در بالاترین نقطه ۱ ثانیه چهارسر را منقبض نمایید.',
      'با کنترل سرعت به وضعیت اولیه بازگردید.'
    ],
    commonMistakes: ['پرتاب کردن پاها با شتاب', 'تنظیم نامناسب محور چرخش دستگاه'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '15', targetWeightKg: 35, completed: false },
      { id: 2, setNumber: 2, targetReps: '12', targetWeightKg: 45, completed: false },
      { id: 3, setNumber: 3, targetReps: '12', targetWeightKg: 50, completed: false }
    ]
  },
  {
    id: 'exercise_leg_curl',
    nameFa: 'پشت پا دستگاه',
    nameEn: 'Leg Curl',
    targetMuscle: 'پا',
    primaryMuscle: 'همسترینگ',
    equipment: 'دستگاه',
    difficulty: 'مبتدی',
    restSeconds: 60,
    imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=600&auto=format&fit=crop',
    notesFa: 'تمرکز ایزوله بر عضلات دو سر رانی و همسترینگ جهت پیشگیری از آسیب‌دیدگی زانو.',
    techniqueTipFa: 'لگن را در تمام طول حرکت چسبیده به تشک نگه دارید و باسن را بالا ندهید.',
    instructions: [
      'روی دستگاه به شکم بخوابید و پد را پشت مچ پاها فیکس کنید.',
      'با خم کردن زانوها پد را به سمت باسن بالا بکشید.',
      'در اوج انقباض مکث کرده و به آرامی باز شوید.'
    ],
    commonMistakes: ['بلند شدن لگن از پد', 'استفاده از شتاب به جای انقباض'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '15', targetWeightKg: 30, completed: false },
      { id: 2, setNumber: 2, targetReps: '12', targetWeightKg: 35, completed: false },
      { id: 3, setNumber: 3, targetReps: '10', targetWeightKg: 40, completed: false }
    ]
  },
  {
    id: 'exercise_dumbbell_lunge',
    nameFa: 'لانج دمبل',
    nameEn: 'Dumbbell Lunge',
    targetMuscle: 'پا',
    primaryMuscle: 'چهارسر ران',
    equipment: 'دمبل',
    difficulty: 'متوسط',
    restSeconds: 75,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',
    notesFa: 'تقویت تعادل، هماهنگی عضلانی دو طرفه و درگیری شدید عضلات چهارسر و باسن.',
    techniqueTipFa: 'گام را به اندازه کافی بردارید تا زانوی جلویی از نوک پنجه پا جلوتر نرود.',
    instructions: [
      'دمبل‌ها را در کنار دست‌ها گرفته و یک گام بلند به جلو بردارید.',
      'بدن را پایین بیاورید تا هر دو زانو به زاویه ۹۰ درجه برسند.',
      'با فشار پای جلویی به حالت ایستاده برگردید.'
    ],
    commonMistakes: ['برخورد محکم زانوی عقبی با زمین', 'خم شدن تنه به جلو'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '12', targetWeightKg: 10, completed: false },
      { id: 2, setNumber: 2, targetReps: '10', targetWeightKg: 12, completed: false },
      { id: 3, setNumber: 3, targetReps: '10', targetWeightKg: 14, completed: false }
    ]
  },
  {
    id: 'exercise_bulgarian_split_squat',
    nameFa: 'بلغاری',
    nameEn: 'Bulgarian Split Squat',
    targetMuscle: 'پا',
    primaryMuscle: 'چهارسر ران',
    equipment: 'دمبل + نیمکت',
    difficulty: 'متوسط',
    restSeconds: 75,
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop',
    notesFa: 'شاهکار تمرینات تک‌پایی برای رشد فوق‌العاده گلوت و چهارسر بدون فشار به مهره‌های کمر.',
    techniqueTipFa: 'روی پای جلو تکیه کنید؛ پای پشتی صرفاً برای حفظ تعادل است.',
    instructions: [
      'یک پا را روی نیمکت پشت سر قرار دهید و پای دیگر را جلو بگذارید.',
      'بدن را مستقیم به سمت پایین هدایت کنید تا زانوی عقب به نزدیکی زمین برسد.',
      'با انقباض پای جلو بالا بیایید.'
    ],
    commonMistakes: ['قرار دادن پای جلو خیلی نزدیک به نیمکت', 'خم شدن به طرفین'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '10', targetWeightKg: 8, completed: false },
      { id: 2, setNumber: 2, targetReps: '10', targetWeightKg: 10, completed: false },
      { id: 3, setNumber: 3, targetReps: '8', targetWeightKg: 12, completed: false }
    ]
  },
  {
    id: 'exercise_romanian_deadlift',
    nameFa: 'رومانیان ددلیفت',
    nameEn: 'Romanian Deadlift',
    targetMuscle: 'پا',
    primaryMuscle: 'همسترینگ',
    equipment: 'هالتر',
    difficulty: 'متوسط',
    restSeconds: 90,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
    notesFa: 'ایجاد کشش و اضافه بار بی‌نظیر روی عضلات همسترینگ و باسن در الگوی لولای باسن (Hip Hinge).',
    techniqueTipFa: 'زانوها را نیمه‌خم ثابت نگه دارید و حرکت را فقط با عقب فرستادن باسن اجرا کنید.',
    instructions: [
      'هالتر را در دست گرفته و صاف بایستید.',
      'با عقب راندن لگن و حفظ قوس طبیعی پشت، هالتر را در راستای ساق‌ها تا زیر زانو پایین ببرید.',
      'با احساس کشش شدید در همسترینگ، باسن را منقبض کرده و به جلو برانید.'
    ],
    commonMistakes: ['قوز کردن مهره‌های کمری', 'خم کردن بیش از حد زانوها و تبدیل به اسکوات'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '10', targetWeightKg: 50, completed: false },
      { id: 2, setNumber: 2, targetReps: '8', targetWeightKg: 65, completed: false },
      { id: 3, setNumber: 3, targetReps: '8', targetWeightKg: 75, completed: false }
    ]
  },
  {
    id: 'exercise_barbell_hip_thrust',
    nameFa: 'هیپ تراست',
    nameEn: 'Barbell Hip Thrust',
    targetMuscle: 'پا',
    primaryMuscle: 'سرینی',
    equipment: 'هالتر + نیمکت',
    difficulty: 'متوسط',
    restSeconds: 90,
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop',
    notesFa: 'مؤثرترین تمرین برای فرم‌دهی و رشد عضلات باسن و گلوتئوس ماکسیموس.',
    techniqueTipFa: 'پد نرم روی هالتر بگذارید؛ در نقطه بالا چانه را به سینه نزدیک کنید و باسن را قفل نمایید.',
    instructions: [
      'کتف‌ها را به نیمکت تکیه داده و هالتر را روی لگن قرار دهید.',
      'پاها را به عرض لگن روی زمین فیکس کنید.',
      'با فشار پاشنه‌ها، لگن را تا سطح تنه بالا ببرید و ۱ ثانیه منقبض کنید.',
      'با کنترل لگن را پایین بیاورید.'
    ],
    commonMistakes: ['بیش از حد بالا بردن کمر و ایجاد هایپراکستنشن در ستون فقرات'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '12', targetWeightKg: 40, completed: false },
      { id: 2, setNumber: 2, targetReps: '10', targetWeightKg: 60, completed: false },
      { id: 3, setNumber: 3, targetReps: '10', targetWeightKg: 70, completed: false }
    ]
  },
  {
    id: 'exercise_standing_calf_raise',
    nameFa: 'ساق ایستاده',
    nameEn: 'Standing Calf Raise',
    targetMuscle: 'پا',
    primaryMuscle: 'ساق',
    equipment: 'دستگاه/وزنه',
    difficulty: 'مبتدی',
    restSeconds: 45,
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop',
    notesFa: 'درگیری مستقیم عضله گاستروکنمیوس برای ایجاد ضخامت و تفکیک ساق پا.',
    techniqueTipFa: 'در پایین‌ترین نقطه کشش کامل و در بالاترین نقطه اوج انقباض را تجربه کنید.',
    instructions: [
      'پنجه پا را روی لبه استپ بگذارید.',
      'پاشنه را پایین برده تا کشش احساس شود.',
      'با قدرت روی پنجه بلند شوید و در اوج ۲ ثانیه مکث کنید.'
    ],
    commonMistakes: ['انجام حرکت سرعتی و با جهش'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '20', targetWeightKg: 30, completed: false },
      { id: 2, setNumber: 2, targetReps: '15', targetWeightKg: 40, completed: false },
      { id: 3, setNumber: 3, targetReps: '15', targetWeightKg: 50, completed: false }
    ]
  },

  // ABS & CORE (41-45)
  {
    id: 'exercise_crunch',
    nameFa: 'کرانچ',
    nameEn: 'Crunch',
    targetMuscle: 'شکم',
    primaryMuscle: 'شکم',
    equipment: 'بدون تجهیزات',
    difficulty: 'مبتدی',
    restSeconds: 45,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',
    notesFa: 'تمرین کلاسیک برای تقویت عضله راست شکمی (Six-Pack).',
    techniqueTipFa: 'گردن را نکشید؛ فاصله چانه تا سینه به اندازه یک سیب باشد.',
    instructions: [
      'به پشت بخوابید و زانوها را خم کنید.',
      'دست‌ها را کنار سر بگذارید و با جمع کردن شکم، شانه را چند سانتی‌متر از زمین بلند کنید.',
      'در اوج بازدم کرده و به آرامی برگردید.'
    ],
    commonMistakes: ['کشیدن گردن با دست‌ها', 'بلند کردن کل کمر از زمین'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '20', targetWeightKg: 0, completed: false },
      { id: 2, setNumber: 2, targetReps: '20', targetWeightKg: 0, completed: false },
      { id: 3, setNumber: 3, targetReps: '15', targetWeightKg: 0, completed: false }
    ]
  },
  {
    id: 'exercise_plank',
    nameFa: 'پلانک',
    nameEn: 'Plank',
    targetMuscle: 'شکم',
    primaryMuscle: 'عضلات مرکزی',
    equipment: 'بدون تجهیزات',
    difficulty: 'مبتدی',
    restSeconds: 45,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
    notesFa: 'تمرین ایزومتریک پایه‌ای برای ثبات ستون فقرات و تقویت تمامی لایه‌های عضلات شکم.',
    techniqueTipFa: 'بدن در یک خط مستقیم از سر تا پاشنه پا باشد؛ باسن نباید افتاده یا بیش از حد بالا باشد.',
    instructions: [
      'روی ساعدها و پنجه پاها قرار بگیرید.',
      'شکم، باسن و چهارسر را منقبض کرده و تنفس یکنواخت داشته باشید.',
      'وضعیت را به مدت تعیین‌شده ثابت نگه دارید.'
    ],
    commonMistakes: ['گود افتادن کمر به سمت پایین', 'حبس کردن نفس'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '45 ثانیه', targetWeightKg: 0, completed: false },
      { id: 2, setNumber: 2, targetReps: '45 ثانیه', targetWeightKg: 0, completed: false },
      { id: 3, setNumber: 3, targetReps: '45 ثانیه', targetWeightKg: 0, completed: false }
    ]
  },
  {
    id: 'exercise_leg_raise',
    nameFa: 'بالا آوردن پا',
    nameEn: 'Leg Raise',
    targetMuscle: 'شکم',
    primaryMuscle: 'شکم',
    equipment: 'بدون تجهیزات/میله',
    difficulty: 'متوسط',
    restSeconds: 45,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
    notesFa: 'تمرکز شدید بر بخش تحتانی عضلات شکم و فلکسورهای ران.',
    techniqueTipFa: 'گودی کمر را به زمین بچسبانید تا فشار به ستون فقرات وارد نشود.',
    instructions: [
      'به پشت دراز بکشید و دست‌ها را کنار باسن قرار دهید.',
      'پاها را صاف بالا بیاورید تا زاویه ۹۰ درجه.',
      'با کنترل ملایم پاها را تا نزدیکی زمین پایین بیاورید بدون اینکه زمین را لمس کنند.'
    ],
    commonMistakes: ['جدا شدن کمر از زمین هنگام فرود پاها'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '15', targetWeightKg: 0, completed: false },
      { id: 2, setNumber: 2, targetReps: '15', targetWeightKg: 0, completed: false },
      { id: 3, setNumber: 3, targetReps: '12', targetWeightKg: 0, completed: false }
    ]
  },
  {
    id: 'exercise_cable_crunch',
    nameFa: 'کرانچ کابل',
    nameEn: 'Cable Crunch',
    targetMuscle: 'شکم',
    primaryMuscle: 'شکم',
    equipment: 'کابل',
    difficulty: 'متوسط',
    restSeconds: 60,
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop',
    notesFa: 'امکان اعمال بار اضافه تصاعدی روی عضلات شکم با مقاومت سیمکش.',
    techniqueTipFa: 'خم شدن باید از ناحیه ستون فقرات شکمی باشد نه خم شدن لگن به عقب.',
    instructions: [
      'جلوی سیمکش دو زانو بنشینید و طناب را کنار سر بگیرید.',
      'با جمع کردن تنه، آرنج‌ها را به سمت زانوها هدایت کنید.',
      'در انتها شکم را کاملاً خالی کرده و به نرمی بالا بیایید.'
    ],
    commonMistakes: ['نشستن روی پاشنه‌ها هنگام پایین آمدن'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '15', targetWeightKg: 25, completed: false },
      { id: 2, setNumber: 2, targetReps: '15', targetWeightKg: 30, completed: false },
      { id: 3, setNumber: 3, targetReps: '12', targetWeightKg: 35, completed: false }
    ]
  },
  {
    id: 'exercise_dead_bug',
    nameFa: 'ددباگ',
    nameEn: 'Dead Bug',
    targetMuscle: 'شکم',
    primaryMuscle: 'عضلات مرکزی',
    equipment: 'بدون تجهیزات',
    difficulty: 'مبتدی',
    restSeconds: 45,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',
    notesFa: 'بهترین تمرین ضد اکستنشن (Anti-Extension) برای ایمنی دیسک کمر و ثبات عمقی کور.',
    techniqueTipFa: 'گودی کمر را در تمام طول دامنه حرکت محکم به زمین بفشارید.',
    instructions: [
      'به پشت بخوابید، دست‌ها رو به سقف و زانوها با زاویه ۹۰ درجه در هوا.',
      'همزمان دست راست و پای چپ را به آرامی به سمت زمین دراز کنید.',
      'به حالت اول برگشته و با دست و پای مخالف تکرار نمایید.'
    ],
    commonMistakes: ['بلند شدن کمر از زمین', 'حرکت دادن سریع دست و پا'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '12', targetWeightKg: 0, completed: false },
      { id: 2, setNumber: 2, targetReps: '12', targetWeightKg: 0, completed: false },
      { id: 3, setNumber: 3, targetReps: '12', targetWeightKg: 0, completed: false }
    ]
  },

  // FULL BODY / FUNCTIONAL (46-50)
  {
    id: 'exercise_kettlebell_swing',
    nameFa: 'کتلبل سوئینگ',
    nameEn: 'Kettlebell Swing',
    targetMuscle: 'تمام بدن',
    primaryMuscle: 'زنجیره خلفی',
    equipment: 'کتلبل',
    difficulty: 'متوسط',
    restSeconds: 60,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
    notesFa: 'افزایش توان انفجاری باسن و زنجیره خلفی و کالری‌سوزی متابولیک فوق‌العاده.',
    techniqueTipFa: 'حرکت لولای باسن است نه اسکوات؛ کتلبل را با پرتاب باسن به جلو هدایت کنید نه دست‌ها.',
    instructions: [
      'پاها را بازتر از عرض شانه بگذارید و کتلبل را با دو دست بگیرید.',
      'باسن را به عقب داده و کتلبل را بین پاها تاب دهید.',
      'با اکستنشن انفجاری لگن، کتلبل را تا سطح سینه پرتاب کنید.'
    ],
    commonMistakes: ['اسکوات زدن به جای لولای باسن', 'بالا کشیدن کتلبل با قدرت شانه'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '15', targetWeightKg: 16, completed: false },
      { id: 2, setNumber: 2, targetReps: '15', targetWeightKg: 20, completed: false },
      { id: 3, setNumber: 3, targetReps: '15', targetWeightKg: 24, completed: false }
    ]
  },
  {
    id: 'exercise_burpee',
    nameFa: 'برپی',
    nameEn: 'Burpee',
    targetMuscle: 'تمام بدن',
    primaryMuscle: 'تمام بدن',
    equipment: 'بدون تجهیزات',
    difficulty: 'متوسط',
    restSeconds: 60,
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop',
    notesFa: 'سلطان تمرینات چربی‌سوزی و استقامت قلبی عروقی کل بدن.',
    techniqueTipFa: 'در تمام مراحل فرود و پرش، عضلات مرکزی را منقبض نگه دارید.',
    instructions: [
      'از حالت ایستاده به وضعیت اسکوات بروید و دست‌ها را روی زمین بگذارید.',
      'پاها را به عقب پرتاب کرده و یک شنا بروید.',
      'پاها را جمع کرده و با پرش به بالا دست‌ها را بالای سر ببرید.'
    ],
    commonMistakes: ['افتادن شکم به سمت زمین در حالت شنا'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '10', targetWeightKg: 0, completed: false },
      { id: 2, setNumber: 2, targetReps: '10', targetWeightKg: 0, completed: false },
      { id: 3, setNumber: 3, targetReps: '10', targetWeightKg: 0, completed: false }
    ]
  },
  {
    id: 'exercise_push_up',
    nameFa: 'شنا',
    nameEn: 'Push Up',
    targetMuscle: 'سینه',
    primaryMuscle: 'سینه',
    equipment: 'بدون تجهیزات',
    difficulty: 'مبتدی',
    restSeconds: 60,
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop',
    notesFa: 'تمرین پایه‌ای بالاتنه برای سینه، پشت‌بازو و ثبات شانه‌ها.',
    techniqueTipFa: 'تنه در یک خط مستقیم باشد و آرنج‌ها زاویه ۴۵ درجه با بدن بسازند.',
    instructions: [
      'دست‌ها را کمی بازتر از شانه روی زمین بگذارید.',
      'سینه را تا چند سانتی‌متری زمین پایین بیاورید.',
      'با فشار کف دست‌ها به زمین به نقطه شروع بازگردید.'
    ],
    commonMistakes: ['افتادگی باسن و گود شدن کمر', 'باز شدن بیش از حد آرنج‌ها'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '15', targetWeightKg: 0, completed: false },
      { id: 2, setNumber: 2, targetReps: '12', targetWeightKg: 0, completed: false },
      { id: 3, setNumber: 3, targetReps: '10', targetWeightKg: 0, completed: false }
    ]
  },
  {
    id: 'exercise_mountain_climber',
    nameFa: 'کوهنوردی',
    nameEn: 'Mountain Climber',
    targetMuscle: 'شکم',
    primaryMuscle: 'عضلات مرکزی',
    equipment: 'بدون تجهیزات',
    difficulty: 'متوسط',
    restSeconds: 45,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
    notesFa: 'ترکیب پلانک پویا با کالری‌سوزی بالا و تقویت شکم و شانه.',
    techniqueTipFa: 'شانه‌ها مستقیماً بالای مچ دست‌ها قرار گیرند و باسن بالا نپرد.',
    instructions: [
      'در وضعیت شنا قرار بگیرید.',
      'به تناوب زانوها را با سرعت و کنترل به سمت سینه جمع کنید.',
      'ریتم تنفسی را منظم حفظ نمایید.'
    ],
    commonMistakes: ['بالا رفتن بیش از حد باسن', 'شل کردن شانه‌ها'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '30 ثانیه', targetWeightKg: 0, completed: false },
      { id: 2, setNumber: 2, targetReps: '30 ثانیه', targetWeightKg: 0, completed: false },
      { id: 3, setNumber: 3, targetReps: '30 ثانیه', targetWeightKg: 0, completed: false }
    ]
  },
  {
    id: 'exercise_farmers_walk',
    nameFa: 'راه رفتن کشاورزی',
    nameEn: "Farmer's Walk",
    targetMuscle: 'تمام بدن',
    primaryMuscle: 'کل بدن + گریپ',
    equipment: 'دمبل',
    difficulty: 'متوسط',
    restSeconds: 60,
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop',
    notesFa: 'افزایش قدرت پنجه، کول‌ها، عضلات مرکزی و استقامت کل بدن.',
    techniqueTipFa: 'سینه را بالا و شانه‌ها را عقب نگه دارید و با گام‌های کوتاه و مطمئن حرکت کنید.',
    instructions: [
      'دو دمبل سنگین را در دست گرفته و کاملاً صاف بایستید.',
      'با گام‌های کنترل‌شده به جلو راه بروید بدون تاب خوردن وزنه‌ها.',
      'مسافت یا زمان مشخص را طی کرده و با احتیاط وزنه‌ها را بگذارید.'
    ],
    commonMistakes: ['قوز کردن شانه‌ها به جلو', 'گام‌های لرزان و شل'],
    sets: [
      { id: 1, setNumber: 1, targetReps: '40 متر', targetWeightKg: 20, completed: false },
      { id: 2, setNumber: 2, targetReps: '40 متر', targetWeightKg: 24, completed: false },
      { id: 3, setNumber: 3, targetReps: '40 متر', targetWeightKg: 28, completed: false }
    ]
  }
];

export const SEED_5_PROGRAMS: WorkoutProgram[] = [
  // 1. Beginner 3-Day Program
  {
    id: 'program_beginner_3_day',
    name: 'شروع قدرتمند — برنامه مبتدی ۳ روزه',
    description: 'برنامه استاندارد فول‌بادی طراحی شده برای ایجاد تطابق عصبی عضلانی، یادگیری بیومکانیک حرکات پایه و ساخت پایه‌ای محکم برای افزایش حجم و آمادگی جسمانی.',
    goal: 'تناسب اندام و عضله‌سازی',
    difficulty: 'مبتدی',
    daysPerWeek: 3,
    estimatedDuration: 50,
    coverImage: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
    status: 'published',
    days: [
      {
        dayNumber: 1,
        titleFa: 'روز ۱: فول‌بادی A',
        muscleGroupFa: 'کل بدن (اسکوات، سینه، زیربغل)',
        exercises: [
          { exerciseId: 'exercise_goblet_squat', nameFa: 'اسکوات جام', sets: 3, reps: '10-12', restSeconds: 75 },
          { exerciseId: 'exercise_bench_press_dumbbell', nameFa: 'پرس سینه دمبل', sets: 3, reps: '10-12', restSeconds: 75 },
          { exerciseId: 'exercise_lat_pulldown', nameFa: 'لت پولداون', sets: 3, reps: '10-12', restSeconds: 75 },
          { exerciseId: 'exercise_dumbbell_lateral_raise', nameFa: 'نشر جانب دمبل', sets: 2, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'exercise_cable_triceps_pushdown', nameFa: 'پشت بازو سیمکش', sets: 2, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'exercise_plank', nameFa: 'پلانک', sets: 3, reps: '30-45 ثانیه', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 2,
        titleFa: 'روز ۲: فول‌بادی B',
        muscleGroupFa: 'کل بدن (پرس پا، بالاسینه، پارویی)',
        exercises: [
          { exerciseId: 'exercise_leg_press', nameFa: 'پرس پا', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseId: 'exercise_incline_dumbbell_press', nameFa: 'پرس بالا سینه دمبل', sets: 3, reps: '10-12', restSeconds: 75 },
          { exerciseId: 'exercise_seated_cable_row', nameFa: 'قایقی سیمکش', sets: 3, reps: '10-12', restSeconds: 75 },
          { exerciseId: 'exercise_alternating_dumbbell_curl', nameFa: 'جلو بازو دمبل تناوبی', sets: 2, reps: '10-12', restSeconds: 60 },
          { exerciseId: 'exercise_leg_curl', nameFa: 'پشت پا دستگاه', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseId: 'exercise_dead_bug', nameFa: 'ددباگ', sets: 3, reps: '8-12', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 3,
        titleFa: 'روز ۳: فول‌بادی C',
        muscleGroupFa: 'کل بدن (سرشانه، شنا، هیپ‌تراست)',
        exercises: [
          { exerciseId: 'exercise_goblet_squat', nameFa: 'اسکوات جام', sets: 3, reps: '10-12', restSeconds: 75 },
          { exerciseId: 'exercise_push_up', nameFa: 'شنا', sets: 3, reps: '8-15', restSeconds: 60 },
          { exerciseId: 'exercise_one_arm_dumbbell_row', nameFa: 'پارویی دمبل تک دست', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseId: 'exercise_dumbbell_shoulder_press', nameFa: 'پرس سرشانه دمبل', sets: 2, reps: '10-12', restSeconds: 75 },
          { exerciseId: 'exercise_barbell_hip_thrust', nameFa: 'هیپ تراست', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseId: 'exercise_crunch', nameFa: 'کرانچ', sets: 3, reps: '12-15', restSeconds: 45 }
        ]
      }
    ]
  },

  // 2. Hypertrophy 4-Day Program
  {
    id: 'program_hypertrophy_4_day',
    name: 'عضله‌سازی تخصصی ۴ روزه (Hypertrophy Split)',
    description: 'برنامه تفکیکی ۴ روزه متمرکز بر حجم عضلانی خالص و هایپرتروفی بهینه با بارگذاری تصاعدی روی تک تک عضلات اصلی.',
    goal: 'عضله‌سازی و هایپرتروفی',
    difficulty: 'متوسط',
    daysPerWeek: 4,
    estimatedDuration: 65,
    coverImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop',
    status: 'published',
    days: [
      {
        dayNumber: 1,
        titleFa: 'روز ۱: سینه و پشت‌بازو',
        muscleGroupFa: 'سینه و پشت‌بازو',
        exercises: [
          { exerciseId: 'exercise_bench_press_barbell', nameFa: 'پرس سینه هالتر', sets: 4, reps: '6-10', restSeconds: 90 },
          { exerciseId: 'exercise_incline_dumbbell_press', nameFa: 'پرس بالا سینه دمبل', sets: 3, reps: '8-12', restSeconds: 75 },
          { exerciseId: 'exercise_cable_crossover', nameFa: 'کراس اور کابل', sets: 3, reps: '10-15', restSeconds: 60 },
          { exerciseId: 'exercise_machine_chest_press', nameFa: 'پرس سینه دستگاه', sets: 3, reps: '8-12', restSeconds: 60 },
          { exerciseId: 'exercise_cable_triceps_pushdown', nameFa: 'پشت بازو سیمکش', sets: 3, reps: '10-15', restSeconds: 60 },
          { exerciseId: 'exercise_overhead_dumbbell_triceps_extension', nameFa: 'پشت بازو بالای سر دمبل', sets: 3, reps: '10-12', restSeconds: 60 }
        ]
      },
      {
        dayNumber: 2,
        titleFa: 'روز ۲: پشت و جلوبازو',
        muscleGroupFa: 'زیربغل، پشت و جلو بازو',
        exercises: [
          { exerciseId: 'exercise_conventional_deadlift', nameFa: 'ددلیفت', sets: 3, reps: '5-8', restSeconds: 120 },
          { exerciseId: 'exercise_lat_pulldown', nameFa: 'لت پولداون', sets: 4, reps: '8-12', restSeconds: 75 },
          { exerciseId: 'exercise_barbell_row', nameFa: 'پارویی هالتر', sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseId: 'exercise_seated_cable_row', nameFa: 'قایقی سیمکش', sets: 3, reps: '10-12', restSeconds: 75 },
          { exerciseId: 'exercise_barbell_curl', nameFa: 'جلو بازو هالتر', sets: 3, reps: '8-12', restSeconds: 60 },
          { exerciseId: 'exercise_hammer_curl', nameFa: 'جلو بازو چکشی', sets: 3, reps: '10-12', restSeconds: 60 }
        ]
      },
      {
        dayNumber: 3,
        titleFa: 'روز ۳: پا و پایین‌تنه',
        muscleGroupFa: 'چهارسر، همسترینگ، ساق و سرینی',
        exercises: [
          { exerciseId: 'exercise_barbell_back_squat', nameFa: 'اسکوات هالتر', sets: 4, reps: '6-10', restSeconds: 120 },
          { exerciseId: 'exercise_leg_press', nameFa: 'پرس پا', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseId: 'exercise_romanian_deadlift', nameFa: 'رومانیان ددلیفت', sets: 3, reps: '8-12', restSeconds: 90 },
          { exerciseId: 'exercise_leg_extension', nameFa: 'جلو پا دستگاه', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'exercise_leg_curl', nameFa: 'پشت پا دستگاه', sets: 3, reps: '10-15', restSeconds: 60 },
          { exerciseId: 'exercise_standing_calf_raise', nameFa: 'ساق ایستاده', sets: 4, reps: '12-15', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 4,
        titleFa: 'روز ۴: سرشانه و شکم',
        muscleGroupFa: 'سرشانه، دلتوئید خلفی و شکم',
        exercises: [
          { exerciseId: 'exercise_dumbbell_shoulder_press', nameFa: 'پرس سرشانه دمبل', sets: 4, reps: '8-12', restSeconds: 75 },
          { exerciseId: 'exercise_dumbbell_lateral_raise', nameFa: 'نشر جانب دمبل', sets: 4, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'exercise_reverse_dumbbell_fly', nameFa: 'فلای معکوس', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'exercise_face_pull', nameFa: 'فیس پول', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'exercise_cable_crunch', nameFa: 'کرانچ کابل', sets: 3, reps: '12-15', restSeconds: 45 },
          { exerciseId: 'exercise_plank', nameFa: 'پلانک', sets: 3, reps: '45-60 ثانیه', restSeconds: 45 }
        ]
      }
    ]
  },

  // 3. Fat Loss & Fitness 4-Day Program
  {
    id: 'program_fatloss_fitness_4_day',
    name: 'چربی‌سوزی و تناسب اندام ۴ روزه',
    description: 'ترکیب تمرینات مقاومتی با حجم متوسط و فینیشرهای متابولیک برای به حداکثر رساندن مصرف کالری و حفظ بافت عضلانی در دوره کات.',
    goal: 'چربی‌سوزی و تناسب اندام',
    difficulty: 'متوسط',
    daysPerWeek: 4,
    estimatedDuration: 55,
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    status: 'published',
    days: [
      {
        dayNumber: 1,
        titleFa: 'روز ۱: قدرت و متابولیک پایین‌تنه/بالاتنه',
        muscleGroupFa: 'پا و بالاتنه فشاری',
        exercises: [
          { exerciseId: 'exercise_leg_press', nameFa: 'پرس پا', sets: 3, reps: '10-12', restSeconds: 75 },
          { exerciseId: 'exercise_goblet_squat', nameFa: 'اسکوات جام', sets: 3, reps: '12', restSeconds: 60 },
          { exerciseId: 'exercise_bench_press_dumbbell', nameFa: 'پرس سینه دمبل', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseId: 'exercise_lat_pulldown', nameFa: 'لت پولداون', sets: 3, reps: '12', restSeconds: 60 },
          { exerciseId: 'exercise_plank', nameFa: 'پلانک', sets: 3, reps: '45 ثانیه', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 2,
        titleFa: 'روز ۲: خلفی و کاندیشنینگ',
        muscleGroupFa: 'زنجیره خلفی و سرشانه',
        exercises: [
          { exerciseId: 'exercise_romanian_deadlift', nameFa: 'رومانیان ددلیفت', sets: 3, reps: '10-12', restSeconds: 75 },
          { exerciseId: 'exercise_dumbbell_shoulder_press', nameFa: 'پرس سرشانه دمبل', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseId: 'exercise_seated_cable_row', nameFa: 'قایقی سیمکش', sets: 3, reps: '12', restSeconds: 60 },
          { exerciseId: 'exercise_dumbbell_lateral_raise', nameFa: 'نشر جانب دمبل', sets: 3, reps: '15', restSeconds: 45 },
          { exerciseId: 'exercise_mountain_climber', nameFa: 'کوهنوردی', sets: 3, reps: '30 ثانیه', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 3,
        titleFa: 'روز ۳: لانج و بالاتنه کششی/فشاری',
        muscleGroupFa: 'پا، سینه، زیربغل و بازو',
        exercises: [
          { exerciseId: 'exercise_dumbbell_lunge', nameFa: 'لانج دمبل', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseId: 'exercise_push_up', nameFa: 'شنا', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'exercise_one_arm_dumbbell_row', nameFa: 'پارویی دمبل تک دست', sets: 3, reps: '12', restSeconds: 60 },
          { exerciseId: 'exercise_cable_triceps_pushdown', nameFa: 'پشت بازو سیمکش', sets: 3, reps: '12-15', restSeconds: 45 },
          { exerciseId: 'exercise_crunch', nameFa: 'کرانچ', sets: 3, reps: '20', restSeconds: 30 }
        ]
      },
      {
        dayNumber: 4,
        titleFa: 'روز ۴: فول‌بادی و کتلبل فینیشر',
        muscleGroupFa: 'همسترینگ، سرینی، بالاسینه و کل بدن',
        exercises: [
          { exerciseId: 'exercise_leg_curl', nameFa: 'پشت پا دستگاه', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'exercise_barbell_hip_thrust', nameFa: 'هیپ تراست', sets: 3, reps: '10-12', restSeconds: 75 },
          { exerciseId: 'exercise_incline_dumbbell_press', nameFa: 'پرس بالا سینه دمبل', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseId: 'exercise_lat_pulldown', nameFa: 'لت پولداون', sets: 3, reps: '12', restSeconds: 60 },
          { exerciseId: 'exercise_kettlebell_swing', nameFa: 'کتلبل سوئینگ', sets: 3, reps: '15-20', restSeconds: 60 }
        ]
      }
    ]
  },

  // 4. Strength & Hypertrophy 5-Day Program
  {
    id: 'program_strength_hypertrophy_5_day',
    name: 'قدرت و حجم ۵ روزه (Advanced Split)',
    description: 'برنامه حرفه‌ای ۵ روزه اختصاصی برای ورزشکاران پیشرفته که به دنبال افزایش رکوردهای حرکات سه‌گانه و حداکثر پمپ و تراکم عضلانی هستند.',
    goal: 'افزایش قدرت و حجم',
    difficulty: 'پیشرفته',
    daysPerWeek: 5,
    estimatedDuration: 70,
    coverImage: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop',
    status: 'published',
    days: [
      {
        dayNumber: 1,
        titleFa: 'روز ۱: سینه تخصصی',
        muscleGroupFa: 'سینه و بالاسینه',
        exercises: [
          { exerciseId: 'exercise_bench_press_barbell', nameFa: 'پرس سینه هالتر', sets: 4, reps: '6-8', restSeconds: 120 },
          { exerciseId: 'exercise_incline_bench_press_barbell', nameFa: 'پرس بالا سینه هالتر', sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseId: 'exercise_dumbbell_fly', nameFa: 'فلای دمبل', sets: 3, reps: '12', restSeconds: 60 },
          { exerciseId: 'exercise_machine_chest_press', nameFa: 'پرس سینه دستگاه', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseId: 'exercise_cable_crossover', nameFa: 'کراس اور کابل', sets: 3, reps: '12-15', restSeconds: 60 }
        ]
      },
      {
        dayNumber: 2,
        titleFa: 'روز ۲: پشت و ددلیفت',
        muscleGroupFa: 'پشت، زیربغل و ضخامت عضلانی',
        exercises: [
          { exerciseId: 'exercise_conventional_deadlift', nameFa: 'ددلیفت', sets: 4, reps: '5', restSeconds: 150 },
          { exerciseId: 'exercise_pull_up', nameFa: 'بارفیکس', sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseId: 'exercise_barbell_row', nameFa: 'پارویی هالتر', sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseId: 'exercise_tbar_row', nameFa: 'تی‌بار رو', sets: 3, reps: '10-12', restSeconds: 75 },
          { exerciseId: 'exercise_seated_cable_row', nameFa: 'قایقی سیمکش', sets: 3, reps: '12', restSeconds: 60 }
        ]
      },
      {
        dayNumber: 3,
        titleFa: 'روز ۳: سرشانه و دلتوئید',
        muscleGroupFa: 'سرشانه قدامی، میانی و خلفی',
        exercises: [
          { exerciseId: 'exercise_barbell_overhead_press', nameFa: 'پرس سرشانه هالتر', sets: 4, reps: '6-8', restSeconds: 120 },
          { exerciseId: 'exercise_dumbbell_shoulder_press', nameFa: 'پرس سرشانه دمبل', sets: 3, reps: '8-10', restSeconds: 75 },
          { exerciseId: 'exercise_dumbbell_lateral_raise', nameFa: 'نشر جانب دمبل', sets: 4, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'exercise_reverse_dumbbell_fly', nameFa: 'فلای معکوس', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'exercise_face_pull', nameFa: 'فیس پول', sets: 3, reps: '15', restSeconds: 60 }
        ]
      },
      {
        dayNumber: 4,
        titleFa: 'روز ۴: اسکوات و پا',
        muscleGroupFa: 'چهارسر، همسترینگ، سرینی و ساق',
        exercises: [
          { exerciseId: 'exercise_barbell_back_squat', nameFa: 'اسکوات هالتر', sets: 4, reps: '6-8', restSeconds: 150 },
          { exerciseId: 'exercise_leg_press', nameFa: 'پرس پا', sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseId: 'exercise_romanian_deadlift', nameFa: 'رومانیان ددلیفت', sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseId: 'exercise_leg_extension', nameFa: 'جلو پا دستگاه', sets: 3, reps: '12', restSeconds: 60 },
          { exerciseId: 'exercise_leg_curl', nameFa: 'پشت پا دستگاه', sets: 3, reps: '12', restSeconds: 60 },
          { exerciseId: 'exercise_standing_calf_raise', nameFa: 'ساق ایستاده', sets: 4, reps: '15', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 5,
        titleFa: 'روز ۵: بازو و عضلات شکم',
        muscleGroupFa: 'جلو بازو، پشت بازو و شکم',
        exercises: [
          { exerciseId: 'exercise_barbell_curl', nameFa: 'جلو بازو هالتر', sets: 3, reps: '8-10', restSeconds: 60 },
          { exerciseId: 'exercise_hammer_curl', nameFa: 'جلو بازو چکشی', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseId: 'exercise_preacher_curl', nameFa: 'جلو بازو لاری', sets: 3, reps: '10', restSeconds: 60 },
          { exerciseId: 'exercise_cable_triceps_pushdown', nameFa: 'پشت بازو سیمکش', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseId: 'exercise_ez_bar_skull_crusher', nameFa: 'پشت بازو خوابیده هالتر', sets: 3, reps: '8-10', restSeconds: 75 },
          { exerciseId: 'exercise_cable_crunch', nameFa: 'کرانچ کابل', sets: 3, reps: '15', restSeconds: 45 },
          { exerciseId: 'exercise_plank', nameFa: 'پلانک', sets: 3, reps: '60 ثانیه', restSeconds: 45 }
        ]
      }
    ]
  },

  // 5. Full Body 3-Day Program
  {
    id: 'program_fullbody_3_day',
    name: 'فول‌بادی کاربردی ۳ روزه',
    description: 'برنامه بهینه و متوازن ۳ روز در هفته برای ورزشکارانی که زمان محدودی دارند اما خواهان حداکثر راندمان تمرینی و تقویت متقارن کل بدن هستند.',
    goal: 'فیتنس عمومی و عضله‌سازی',
    difficulty: 'مبتدی / متوسط',
    daysPerWeek: 3,
    estimatedDuration: 55,
    coverImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop',
    status: 'published',
    days: [
      {
        dayNumber: 1,
        titleFa: 'روز ۱: قدرت مرکزی و پایه',
        muscleGroupFa: 'اسکوات، پرس سینه، لت و سرشانه',
        exercises: [
          { exerciseId: 'exercise_barbell_back_squat', nameFa: 'اسکوات هالتر', sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseId: 'exercise_bench_press_barbell', nameFa: 'پرس سینه هالتر', sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseId: 'exercise_lat_pulldown', nameFa: 'لت پولداون', sets: 3, reps: '10-12', restSeconds: 75 },
          { exerciseId: 'exercise_dumbbell_shoulder_press', nameFa: 'پرس سرشانه دمبل', sets: 2, reps: '10-12', restSeconds: 60 },
          { exerciseId: 'exercise_plank', nameFa: 'پلانک', sets: 3, reps: '45 ثانیه', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 2,
        titleFa: 'روز ۲: لولا، شیبدار و کششی',
        muscleGroupFa: 'رومانیان ددلیفت، بالاسینه، قایقی و نشر',
        exercises: [
          { exerciseId: 'exercise_romanian_deadlift', nameFa: 'رومانیان ددلیفت', sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseId: 'exercise_incline_dumbbell_press', nameFa: 'پرس بالا سینه دمبل', sets: 3, reps: '10-12', restSeconds: 75 },
          { exerciseId: 'exercise_seated_cable_row', nameFa: 'قایقی سیمکش', sets: 3, reps: '10-12', restSeconds: 75 },
          { exerciseId: 'exercise_dumbbell_lateral_raise', nameFa: 'نشر جانب دمبل', sets: 2, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'exercise_crunch', nameFa: 'کرانچ', sets: 3, reps: '12-15', restSeconds: 45 }
        ]
      },
      {
        dayNumber: 3,
        titleFa: 'روز ۳: هایپرتروفی و بازوها',
        muscleGroupFa: 'پرس پا، شنا، پارویی دمبل و دست‌ها',
        exercises: [
          { exerciseId: 'exercise_leg_press', nameFa: 'پرس پا', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseId: 'exercise_push_up', nameFa: 'شنا', sets: 3, reps: '10-15', restSeconds: 60 },
          { exerciseId: 'exercise_one_arm_dumbbell_row', nameFa: 'پارویی دمبل تک دست', sets: 3, reps: '10-12', restSeconds: 60 },
          { exerciseId: 'exercise_alternating_dumbbell_curl', nameFa: 'جلو بازو دمبل تناوبی', sets: 2, reps: '10-12', restSeconds: 60 },
          { exerciseId: 'exercise_cable_triceps_pushdown', nameFa: 'پشت بازو سیمکش', sets: 2, reps: '10-12', restSeconds: 60 },
          { exerciseId: 'exercise_dead_bug', nameFa: 'ددباگ', sets: 3, reps: '10-12', restSeconds: 45 }
        ]
      }
    ]
  }
];
