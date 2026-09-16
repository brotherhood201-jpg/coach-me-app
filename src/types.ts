export interface FoodPreferences {
  favoriteFoods: string[];
  dislikedFoods: string[];
  allergies: string[];
  restrictions: string[];
  allergyNoticeAcknowledged?: boolean;
}

export interface NotificationPreferences {
  waterReminder: boolean;
  waterStartTime: string;
  waterEndTime: string;
  waterIntervalHours: number;
  dietReminders: boolean;
  breakfastReminderTime: string;
  snackReminderTime: string;
  dinnerReminderTime: string;
  sleepReminder: boolean;
  sleepReminderTime: string;
  workoutReminder: boolean;
  workoutReminderTime: string;
  checkInReminder: boolean;
  checkInReminderTime: string;
}

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  profileImage?: string;
  age?: number;
  height?: number; // cm
  heightCm?: number; // cm
  weight?: number; // kg
  weightKg?: number; // kg
  gender?: 'male' | 'female' | 'other';
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
  trainingExperience?: 'beginner' | 'intermediate' | 'advanced';
  primaryGoal?: 'muscle_gain' | 'fat_loss' | 'strength' | 'maintenance' | 'endurance';
  goal?: 'muscle_gain' | 'fat_loss' | 'strength' | 'maintenance' | string;
  trainingDaysPerWeek?: number;
  daysPerWeek?: number;
  workoutLocation?: 'gym' | 'home_equipment' | 'home_bodyweight' | 'outdoor' | string;
  availableEquipment?: string[] | string;
  workoutDuration?: '30_45' | '45_60' | '60_90' | number | string;
  trainingPreferences?: string[];
  priorityMuscles?: string[];
  recommendedProgramId?: string;
  activeProgramId?: string;
  onboardingCompleted?: boolean;
  streakDays: number;
  totalWorkoutsDone: number;
  isProfileComplete?: boolean;
  foodPreferences?: FoodPreferences;
  notificationPreferences?: NotificationPreferences;
  detailedProfile?: DetailedClientProfile;
  activeProgramRequestId?: string;
  programRequestStatus?: ProgramRequestStatus;
  assignedCoachNotes?: string;
  accountStatus?: 'active' | 'suspended' | 'banned';
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingAnswers {
  primaryGoal: 'muscle_gain' | 'fat_loss' | 'strength' | 'maintenance' | 'endurance';
  trainingExperience: 'beginner' | 'intermediate' | 'advanced';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  daysPerWeek: number;
  workoutLocation: 'gym' | 'home_equipment' | 'home_bodyweight' | 'outdoor';
  availableEquipment: string[];
  workoutDuration: '30_45' | '45_60' | '60_90';
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  priorityMuscles: string[];
  trainingPreferences: string[];
}

export interface ProgramMatchResult {
  program: WorkoutProgram;
  matchScore: number; // 0 to 100
  matchPercentage: number;
  reasons: string[];
  isTopMatch: boolean;
}

export type AdminRole = 'superAdmin' | 'contentAdmin' | 'moderator';

export interface AdminUser {
  adminId: string;
  email: string;
  name: string;
  role: AdminRole;
  active: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export type ContentStatus = 'draft' | 'published' | 'archived';

export interface ExerciseSet {
  id: number;
  setNumber: number;
  targetReps: string;
  targetWeightKg: number;
  completed: boolean;
  actualReps?: number;
  actualWeightKg?: number;
  rpe?: number;
  isPR?: boolean;
}

export interface WorkoutSetRecord {
  setId: string;
  exerciseId: string;
  exerciseNameFa: string;
  setNumber: number;
  weight: number;
  reps: number;
  rpe?: number;
  completed: boolean;
  timestamp: string;
  isPR?: boolean;
}

export interface Exercise {
  id: string;
  nameFa: string;
  nameEn: string;
  primaryMuscle?: string;
  secondaryMuscles?: string;
  targetMuscle: string;
  equipment?: string;
  difficulty?: 'مبتدی' | 'متوسط' | 'پیشرفته';
  description?: string;
  instructions?: string[];
  commonMistakes?: string[];
  tips?: string[];
  imageUrl?: string;
  videoUrl?: string;
  sets: ExerciseSet[];
  restSeconds: number;
  iconName?: string;
  notesFa?: string;
  techniqueTipFa?: string;
  isFavorite?: boolean;
  status?: ContentStatus;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkoutProgramExercise {
  exerciseId: string;
  nameFa: string;
  sets: number;
  reps: string;
  restSeconds: number;
  notes?: string;
}

export interface WorkoutProgramDay {
  dayNumber: number;
  titleFa: string;
  muscleGroupFa: string;
  exercises: WorkoutProgramExercise[];
}

export interface WorkoutProgram {
  id: string;
  name: string;
  description?: string;
  goal?: string;
  difficulty?: string;
  daysPerWeek?: number;
  estimatedDuration?: number;
  coverImage?: string;
  status?: ContentStatus;
  days?: WorkoutProgramDay[];
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkoutSession {
  id: string;
  sessionId?: string;
  userId?: string;
  programId?: string;
  workoutName?: string;
  workoutDay?: string;
  titleFa: string;
  muscleGroupsFa?: string;
  totalExercises: number;
  totalSets?: number;
  totalReps?: number;
  estimatedMinutes?: number;
  targetCalories?: number;
  intensity?: 'سبک' | 'متوسط' | 'سنگین' | 'حرفه‌ای';
  exercises?: Exercise[];
  startedAt?: string;
  completedAt?: string;
  durationSeconds?: number;
  status?: 'in_progress' | 'completed' | 'cancelled' | 'inProgress';
  totalVolumeKg?: number;
  completedSetsSummary?: {
    exerciseNameFa: string;
    sets: { weight: number; reps: number; isPR?: boolean }[];
  }[];
}

export interface PersonalRecord {
  id: string;
  userId: string;
  exerciseId: string;
  exerciseNameFa: string;
  maxWeightKg: number;
  maxRepsAtWeight: number;
  estimated1RM: number;
  achievedAt: string;
  previousRecordKg?: number;
}

export interface PreviousPerformance {
  exerciseId: string;
  lastSessionDate: string;
  lastBestWeightKg: number;
  lastBestReps: number;
  summaryFa: string;
}

export interface DayProgress {
  dayNameFa: string;
  dayShortFa: string;
  dateStr: string;
  completed: boolean;
  isToday: boolean;
  workoutTitle?: string;
}

export interface UserFitnessStats {
  userName: string;
  weeklyTargetDays: number;
  weeklyCompletedDays: number;
  streakDays: number;
  totalWorkoutsDone: number;
  weeklyProgressPercent: number;
  totalVolumeLiftedKg?: number;
  caloriesBurnedThisWeek?: number;
  readinessScore?: number;
}

export interface BodyMeasurement {
  id: string;
  userId: string;
  date: string;
  weight: number;
  chest?: number;
  waist?: number;
  arm?: number;
  thigh?: number;
  bodyFatPercentage?: number;
  notes?: string;
}

export interface ProgressPhoto {
  photoId: string;
  userId: string;
  storageUrl: string;
  date: string;
  category: 'front' | 'side' | 'back';
  weightKg?: number;
}

export interface MealItem {
  id: string;
  foodId?: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  amountGrams?: number;
  time: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface WaterLog {
  id?: string;
  userId: string;
  date: string;
  glasses: number;
  targetGlasses: number;
  updatedAt: string;
}

export interface DailyCheckIn {
  id?: string;
  userId: string;
  date: string;
  dietAdherence: 'very_low' | 'medium' | 'good' | 'great';
  dietAdherenceScore: number;
  workoutFeeling?: 'hard' | 'good' | 'great' | 'very_easy' | 'rest_day';
  energy: 'low' | 'normal' | 'good' | 'super';
  dailyScore: number; // out of 10
  feedbackMessage?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NutritionLog {
  id: string;
  userId: string;
  date: string;
  calories: number;
  targetCalories?: number;
  protein: number;
  targetProtein?: number;
  carbs: number;
  targetCarbs?: number;
  fat: number;
  targetFat?: number;
  water: number;
  targetWater?: number;
  meals?: MealItem[];
}

export interface FoodItem {
  id: string;
  nameFa: string;
  nameEn?: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize?: string;
  imageUrl?: string;
  createdAt?: string;
}

export interface ContentCategory {
  id: string;
  nameFa: string;
  nameEn?: string;
  type: 'exercise' | 'article' | 'video' | 'nutrition';
  sortOrder: number;
  active: boolean;
}

export interface NotificationItem {
  notificationId: string;
  userId?: string;
  titleFa: string;
  bodyFa: string;
  type: 'workout_reminder' | 'pr_achievement' | 'streak_milestone' | 'general' | 'content' | 'workout' | 'record' | 'system';
  read: boolean;
  targetAudience?: 'all' | 'selected';
  imageUrl?: string;
  actionUrl?: string;
  scheduledFor?: string;
  createdAt: string;
}

export interface AchievementItem {
  achievementId: string;
  userId?: string;
  titleFa: string;
  descriptionFa: string;
  icon: string;
  unlocked?: boolean;
  unlockedAt?: string;
  targetCount?: number;
  currentCount?: number;
  criteria?: string;
  active?: boolean;
}

export interface ArticleItem {
  id: string;
  title: string;
  summary?: string;
  content: string;
  category: string;
  coverImage?: string;
  readingTime: number;
  createdAt: string;
  updatedAt?: string;
  status?: ContentStatus;
  published: boolean;
  isFavorite?: boolean;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl?: string;
  videoUrl: string;
  duration: number; // in seconds
  createdAt: string;
  status?: ContentStatus;
  published: boolean;
  isFavorite?: boolean;
}

export interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'thumbnail';
  storageUrl: string;
  storagePath?: string;
  sizeBytes?: number;
  mimeType?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  entityType: 'user' | 'exercise' | 'workoutProgram' | 'article' | 'video' | 'food' | 'category' | 'notification' | 'achievement' | 'media' | 'settings' | 'auth' | 'programRequest';
  entityId: string;
  timestamp: string;
  details?: string;
}

export interface AppSetting {
  id: string;
  maintenanceMode: boolean;
  appVersion: string;
  announcementFa?: string;
  updatedAt: string;
}

export interface SubscriptionInfo {
  status: 'free' | 'premium';
  plan?: 'monthly' | 'annual' | 'lifetime';
  startDate?: string;
  expirationDate?: string;
}

// ==========================================
// Phase 3 — Detailed Client Profile & Coaching
// ==========================================

export interface BodyMeasurements {
  weightKg?: number;
  heightCm?: number;
  waistCm?: number;
  chestCm?: number;
  armCm?: number;
  thighCm?: number;
  hipCm?: number;
  updatedAt?: string;
}

export interface ProgressPhotoItem {
  id: string;
  type: 'front' | 'side' | 'back';
  storagePath: string;
  downloadUrl: string;
  uploadedAt: string;
}

export interface HealthInfo {
  hasInjuryOrLimitation: boolean;
  injuryCategories?: string[]; // e.g. 'knee' | 'back' | 'shoulder' | 'wrist' | 'other'
  injuryDescription?: string;
  hasMedicalConditionOrMedication: boolean;
  medicalConditionDescription?: string;
  specialCondition: 'none' | 'pregnancy' | 'postpartum' | 'other';
  specialConditionNotes?: string;
}

export interface LifestyleInfo {
  dailyActivityLevel: 'sedentary' | 'moderate' | 'active' | 'very_active';
  jobType?: 'desk' | 'active' | 'hybrid';
  dailyMovement?: 'low' | 'medium' | 'high';
  sleepSchedule?: string;
}

export interface NutritionProfile {
  favoriteFoods: string[];
  dislikedFoods: string[];
  allergies: string[];
  dietPreference: 'omnivore' | 'vegetarian' | 'vegan' | 'other';
  mealFrequency: '2' | '3' | '4' | '5';
  customNotes?: string;
}

export interface GoalDetails {
  primaryGoal: 'fat_loss' | 'muscle_gain' | 'strength' | 'maintenance' | 'endurance' | string;
  specificFocus?: string;
}

export interface TrainingPreferencesDetails {
  preferredStyles: string[];
  dislikedExercises?: string;
  restrictedExercises?: string;
}

export interface DetailedClientProfile {
  bodyMeasurements?: BodyMeasurements;
  progressPhotos?: ProgressPhotoItem[];
  healthInfo?: HealthInfo;
  lifestyle?: LifestyleInfo;
  nutritionProfile?: NutritionProfile;
  goalDetails?: GoalDetails;
  trainingPreferences?: TrainingPreferencesDetails;
  coachNotes?: string;
  completionPercentage: number;
  completedAt?: string;
  updatedAt?: string;
}

export type ProgramRequestStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'needs_more_info'
  | 'approved'
  | 'plan_ready'
  | 'rejected';

export interface AssignedNutritionPlan {
  dailyCalorieTarget: number;
  proteinTarget: number;
  carbTarget: number;
  fatTarget: number;
  nutritionNotes?: string;
}

export interface ProgramRequest {
  requestId: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: ProgramRequestStatus;
  submittedAt: string;
  updatedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  specialReviewRequired: boolean;
  healthFlag: boolean;
  allergyFlag: boolean;
  injuryFlag: boolean;
  detailedProfileSnapshot: DetailedClientProfile;
  userProfileSnapshot?: Partial<UserProfile>;
  coachQuestion?: string;
  userReply?: string;
  assignedProgramId?: string;
  assignedProgramName?: string;
  assignedNutritionPlan?: AssignedNutritionPlan;
  coachNotes?: string;
  adminNotes?: string;
  publishedAt?: string;
}

