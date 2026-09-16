import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Header } from './components/Header';
import { GlassBottomNavigation, TabType } from './components/common/GlassBottomNavigation';
import { HomeView } from './components/views/HomeView';
import { WorkoutView } from './components/views/WorkoutView';
import { ExercisesView } from './components/views/ExercisesView';
import { DietView } from './components/views/DietView';
import { ProgressView } from './components/views/ProgressView';
import { ProfileView } from './components/views/ProfileView';
import { ExerciseListDrawer } from './components/ExerciseListDrawer';
import { ActiveWorkoutModal } from './components/ActiveWorkoutModal';
import { AuthModal } from './components/AuthModal';
import { DetailedHubModal } from './components/DetailedHubModal';
import { SplashScreen } from './components/SplashScreen';
import { FitnessOnboardingFlow } from './components/onboarding/FitnessOnboardingFlow';
import { WorkoutHistoryModal } from './components/WorkoutHistoryModal';
import { WorkoutCalendarModal } from './components/WorkoutCalendarModal';
import { PersonalRecordsModal } from './components/PersonalRecordsModal';
import { WorkoutEditorModal } from './components/WorkoutEditorModal';
import { ExerciseDetailModal } from './components/ExerciseDetailModal';
import { SavedFavoritesModal } from './components/SavedFavoritesModal';
import { ArticlesModal } from './components/ArticlesModal';
import { VideosModal } from './components/VideosModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { SettingsModal } from './components/SettingsModal';
import { DailyCheckInModal } from './components/checkin/DailyCheckInModal';
import { NotificationSettingsModal } from './components/nutrition/NotificationSettingsModal';
import { FoodPreferencesModal } from './components/nutrition/FoodPreferencesModal';
import { DetailedProfileWizard } from './components/profile/DetailedProfileWizard';
import { ProgramRequestStatusModal } from './components/profile/ProgramRequestStatusModal';
import { AdminPanel } from './components/admin/AdminPanel';
import { TODAY_WORKOUT, INITIAL_WEEKLY_DAYS, INITIAL_STATS, COMPREHENSIVE_EXERCISE_LIBRARY } from './data/workoutData';
import { DayProgress, UserFitnessStats, WorkoutSession, PersonalRecord, UserProfile, Exercise, NutritionLog, DailyCheckIn, ProgramRequest } from './types';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import { toPersianDigits, playWorkoutSound } from './utils/persian';
import { AuthRepository } from './repositories/AuthRepository';
import { UserRepository } from './repositories/UserRepository';
import { ExerciseRepository } from './repositories/ExerciseRepository';
import { WorkoutRepository } from './repositories/WorkoutRepository';
import { PersonalRecordService } from './services/PersonalRecordService';
import { StreakService } from './services/StreakService';
import { NotificationService } from './services/NotificationService';
import { WaterService } from './services/WaterService';
import { NutritionService } from './services/NutritionService';
import { DailyCheckInService } from './services/DailyCheckInService';
import { ProgramRequestService } from './services/ProgramRequestService';

export default function App() {
  // Navigation Active Tab State
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Admin Mode Toggle
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return window.location.hash === '#admin' || new URLSearchParams(window.location.search).get('admin') === 'true';
  });

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminMode(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // App Lifecycle States
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('polad_onboarding_completed') !== 'true';
  });
  const [showProfileSetup, setShowProfileSetup] = useState<boolean>(false);

  // User Profile & Auth
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const defaultProfile: UserProfile = {
      userId: 'guest',
      name: 'علیرضا',
      email: 'alireza@mycoach.app',
      age: 24,
      height: 180,
      weight: 79.5,
      gender: 'male',
      fitnessLevel: 'intermediate',
      goal: 'muscle_gain',
      trainingDaysPerWeek: 5,
      streakDays: 12,
      totalWorkoutsDone: 84,
      isProfileComplete: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const saved = localStorage.getItem('polad_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...defaultProfile,
            ...parsed,
            name: parsed.name || defaultProfile.name,
            weight: Number(parsed.weight || parsed.weightKg) || defaultProfile.weight,
            height: Number(parsed.height || parsed.heightCm) || defaultProfile.height,
            age: Number(parsed.age) || defaultProfile.age,
          };
        }
      } catch (e) {
        // fallback
      }
    }
    return defaultProfile;
  });

  // Modal Controllers
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isHubOpen, setIsHubOpen] = useState<boolean>(false);
  const [hubTab, setHubTab] = useState<'progress' | 'nutrition' | 'achievements' | 'ai' | 'notifications'>('progress');
  const [isExerciseDrawerOpen, setIsExerciseDrawerOpen] = useState<boolean>(false);
  const [isActiveWorkoutOpen, setIsActiveWorkoutOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [isPRsOpen, setIsPRsOpen] = useState<boolean>(false);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);
  const [isArticlesOpen, setIsArticlesOpen] = useState<boolean>(false);
  const [isVideosOpen, setIsVideosOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isDailyCheckInOpen, setIsDailyCheckInOpen] = useState<boolean>(false);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState<boolean>(false);
  const [isFoodPreferencesOpen, setIsFoodPreferencesOpen] = useState<boolean>(false);
  const [selectedExerciseForDetail, setSelectedExerciseForDetail] = useState<Exercise | null>(null);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState<number>(2);

  // Water & Nutrition & Daily Check-in States
  const [waterGlasses, setWaterGlasses] = useState<number>(5);
  const [targetWaterGlasses, setTargetWaterGlasses] = useState<number>(8);
  const [nutritionLog, setNutritionLog] = useState<NutritionLog | null>(null);
  const [todayCheckIn, setTodayCheckIn] = useState<DailyCheckIn | null>(null);

  // Exercises & Favorites
  const [allExercises, setAllExercises] = useState<Exercise[]>(COMPREHENSIVE_EXERCISE_LIBRARY);
  const [favoriteExerciseIds, setFavoriteExerciseIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('polad_favorites');
    return saved ? JSON.parse(saved) : ['ex-1', 'ex-4', 'ex-6'];
  });

  // Sessions and PRs Data
  const [userSessions, setUserSessions] = useState<WorkoutSession[]>(() => WorkoutRepository.getLocalSessions());
  const [userPRs, setUserPRs] = useState<PersonalRecord[]>(() => PersonalRecordService.getLocalPRs());

  // Workout and Tracker Data
  const [stats, setStats] = useState<UserFitnessStats>(() => {
    const saved = localStorage.getItem('alireza_workout_stats');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  const [weeklyDays, setWeeklyDays] = useState<DayProgress[]>(() => {
    const saved = localStorage.getItem('alireza_weekly_days');
    return saved ? JSON.parse(saved) : INITIAL_WEEKLY_DAYS;
  });

  const [workout, setWorkout] = useState<WorkoutSession>(() => {
    const saved = localStorage.getItem('alireza_today_workout');
    return saved ? JSON.parse(saved) : TODAY_WORKOUT;
  });

  const [showToast, setShowToast] = useState<string | null>(null);

  // Detailed Profile & Coach Program Request States (Phase 3)
  const [programRequest, setProgramRequest] = useState<ProgramRequest | null>(null);
  const [showDetailedProfileWizard, setShowDetailedProfileWizard] = useState<boolean>(false);
  const [showProgramRequestStatusModal, setShowProgramRequestStatusModal] = useState<boolean>(false);

  const loadProgramRequest = async (userId: string) => {
    try {
      const req = await ProgramRequestService.getUserProgramRequest(userId);
      setProgramRequest(req);

      if (req?.status === 'plan_ready' && req.assignedNutritionPlan) {
        setNutritionLog((prev) => {
          if (!prev) {
            return {
              id: `${userId}_today`,
              userId,
              date: new Date().toISOString().split('T')[0],
              calories: 0,
              protein: 0,
              carbs: 0,
              fat: 0,
              targetCalories: req.assignedNutritionPlan!.dailyCalorieTarget,
              meals: [],
            };
          }
          return {
            ...prev,
            targetCalories: req.assignedNutritionPlan!.dailyCalorieTarget,
          };
        });
      }
    } catch (e) {
      console.warn('Error loading program request:', e);
    }
  };

  // Fetch all exercises from repository on mount
  useEffect(() => {
    ExerciseRepository.getExercises().then((exs) => {
      if (exs && exs.length > 0) {
        setAllExercises(exs);
      }
    });

    const activeId = currentUser?.uid || userProfile?.id || 'guest';
    WaterService.getWaterLog(activeId).then((w) => {
      setWaterGlasses(w.glasses);
      setTargetWaterGlasses(w.targetGlasses || 8);
    });
    NutritionService.getNutritionLog(activeId).then((n) => setNutritionLog(n));
    DailyCheckInService.getTodayCheckIn(activeId).then((c) => setTodayCheckIn(c));
    loadProgramRequest(activeId);
  }, [currentUser]);

  // Refresh backend and user collections
  const refreshUserData = async (userId: string) => {
    try {
      const [sessions, prs, notifs, water, nutr, checkin] = await Promise.all([
        WorkoutRepository.getUserSessions(userId),
        PersonalRecordService.getUserPRs(userId),
        NotificationService.getNotifications(userId),
        WaterService.getWaterLog(userId),
        NutritionService.getNutritionLog(userId),
        DailyCheckInService.getTodayCheckIn(userId),
      ]);
      setUserSessions(sessions);
      setUserPRs(prs);
      setUnreadNotifsCount(notifs.filter((n) => !n.read).length);
      setWaterGlasses(water.glasses);
      setTargetWaterGlasses(water.targetGlasses || 8);
      setNutritionLog(nutr);
      setTodayCheckIn(checkin);
      loadProgramRequest(userId);

      const streakState = StreakService.calculateStreak(sessions);
      setStats((prev) => ({
        ...prev,
        streakDays: streakState.currentStreak,
        totalWorkoutsDone: sessions.length,
      }));
    } catch (e) {
      console.warn('Error refreshing user data:', e);
    }
  };

  const handleAddWaterQuick = async () => {
    playWorkoutSound('tick');
    const activeId = currentUser?.uid || 'guest';
    const updated = await WaterService.updateWaterGlasses(activeId, 1, targetWaterGlasses);
    setWaterGlasses(updated.glasses);
    setShowToast('یک لیوان آب ثبت شد 💧 نوش جان!');
    setTimeout(() => setShowToast(null), 2500);
  };

  // Auth Listener
  useEffect(() => {
    const unsubscribe = AuthRepository.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        const profile = await UserRepository.getUserProfile(user.uid);
        if (profile) {
          setUserProfile(profile);
          setStats((prev) => ({ ...prev, userName: profile.name }));
        }
        await refreshUserData(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('alireza_workout_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('alireza_weekly_days', JSON.stringify(weeklyDays));
  }, [weeklyDays]);

  useEffect(() => {
    localStorage.setItem('alireza_today_workout', JSON.stringify(workout));
  }, [workout]);

  useEffect(() => {
    localStorage.setItem('polad_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('polad_favorites', JSON.stringify(favoriteExerciseIds));
  }, [favoriteExerciseIds]);

  // Toggle favorite exercise
  const handleToggleFavorite = (exerciseId: string) => {
    setFavoriteExerciseIds((prev) => {
      if (prev.includes(exerciseId)) {
        return prev.filter((id) => id !== exerciseId);
      } else {
        return [...prev, exerciseId];
      }
    });
  };

  // Toggle Day
  const handleToggleDay = (index: number) => {
    playWorkoutSound('success');
    setWeeklyDays((prev) => {
      const updated = [...prev];
      const target = updated[index];
      const newStatus = !target.completed;
      updated[index] = { ...target, completed: newStatus };

      const completedCount = updated.filter((d) => d.completed).length;
      setStats((s) => ({
        ...s,
        weeklyCompletedDays: completedCount,
        weeklyProgressPercent: Math.round((completedCount / s.weeklyTargetDays) * 100),
      }));

      return updated;
    });
  };

  // Finish Workout
  const handleFinishWorkout = (results?: { totalVolume: number; prList: PersonalRecord[] }) => {
    setIsActiveWorkoutOpen(false);

    setWeeklyDays((prev) =>
      prev.map((day) => (day.isToday ? { ...day, completed: true } : day))
    );

    setStats((prev) => {
      const newCompleted = Math.min(prev.weeklyTargetDays, prev.weeklyCompletedDays + 1);
      const newStreak = prev.streakDays + 1;
      const newTotalDone = prev.totalWorkoutsDone + 1;

      return {
        ...prev,
        weeklyCompletedDays: newCompleted,
        weeklyProgressPercent: Math.round((newCompleted / prev.weeklyTargetDays) * 100),
        streakDays: newStreak,
        totalWorkoutsDone: newTotalDone,
        totalVolumeLiftedKg: prev.totalVolumeLiftedKg + (results?.totalVolume || 4800),
      };
    });

    if (currentUser) {
      refreshUserData(currentUser.uid);
    }

    setShowToast('تمرین امروز با موفقیت تکمیل و ثبت شد! عالی بود 🏆');
    setTimeout(() => setShowToast(null), 4000);
  };

  // Reset Data
  const handleResetData = () => {
    if (window.confirm('آیا از بازنشانی داده‌های موقت به حالت اولیه مطمئن هستید؟')) {
      setStats(INITIAL_STATS);
      setWeeklyDays(INITIAL_WEEKLY_DAYS);
      setWorkout(TODAY_WORKOUT);
      setShowToast('داده‌های تمرینی بازنشانی شدند.');
      setTimeout(() => setShowToast(null), 3000);
    }
  };

  const isTodayCompleted = weeklyDays.find((d) => d.isToday)?.completed || false;
  const recentPR = userPRs.length > 0 ? userPRs[userPRs.length - 1] : null;

  // View: Admin Panel
  if (isAdminMode) {
    return (
      <AdminPanel
        onSwitchToUserApp={() => {
          setIsAdminMode(false);
          window.location.hash = '';
          const url = new URL(window.location.href);
          url.searchParams.delete('admin');
          window.history.replaceState({}, '', url.pathname + url.hash);
        }}
      />
    );
  }

  // View: Splash / Loading Screen (App Start)
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // View: Onboarding Flow (Initial Setup)
  if (showOnboarding) {
    return (
      <FitnessOnboardingFlow
        userId={currentUser?.uid || 'guest'}
        initialProfile={userProfile}
        isEditMode={false}
        initialStep={1}
        onClose={() => setShowOnboarding(false)}
        onComplete={(updatedProfile, recommendedProgram) => {
          setUserProfile(updatedProfile);
          setStats((prev) => ({ ...prev, userName: updatedProfile.name }));
          localStorage.setItem('polad_onboarding_completed', 'true');
          setShowOnboarding(false);
          setShowToast(
            `خوش آمدید ${updatedProfile.name}! برنامه تمرینی «${recommendedProgram?.title || 'پیشنهادی'}» برای شما آماده شد 🚀`
          );
          setTimeout(() => setShowToast(null), 4500);
        }}
      />
    );
  }

  // View: Fitness Profile Re-calibration / Setup Wizard
  if (showProfileSetup) {
    return (
      <FitnessOnboardingFlow
        userId={currentUser?.uid || 'guest'}
        initialProfile={userProfile}
        isEditMode={true}
        onComplete={(updatedProfile, recommendedProgram) => {
          setUserProfile(updatedProfile);
          setStats((prev) => ({ ...prev, userName: updatedProfile.name }));
          setShowProfileSetup(false);
          setShowToast(
            `پروفایل و برنامه «${recommendedProgram?.title || 'تمرینی'}» با موفقیت به‌روزرسانی شد 🏆`
          );
          setTimeout(() => setShowToast(null), 4000);
        }}
        onClose={() => setShowProfileSetup(false)}
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-[#05070D] text-zinc-100 flex flex-col items-center justify-start p-4 sm:p-6 md:p-10 lg:p-12 relative overflow-hidden font-['Vazirmatn',system-ui,sans-serif] selection:bg-[#0066ff] selection:text-white"
      dir="rtl"
    >
      {/* Cinematic Deep Navy & Electric Blue Ambient Lighting */}
      <div className="fixed top-[-15%] right-[-10%] w-[650px] h-[650px] bg-[#0066ff]/10 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed bottom-[-15%] left-[-10%] w-[600px] h-[600px] bg-[#0d1b35]/30 rounded-full blur-[180px] pointer-events-none z-0" />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 z-50 animate-bounce max-w-md px-4">
          <div className="bg-[#081326]/95 border border-sky-400/40 text-white font-bold px-5 py-3.5 rounded-2xl shadow-[0_12px_35px_rgba(56,189,248,0.3)] flex items-center gap-2.5 text-xs sm:text-sm backdrop-blur-xl">
            <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" />
            <span>{showToast}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-2xl lg:max-w-3xl mx-auto flex flex-col relative z-10">
        {/* Top Header */}
        <Header
          userName={stats.userName}
          streakDays={stats.streakDays}
          isLoggedIn={!!currentUser}
          unreadNotificationsCount={unreadNotifsCount}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenFavorites={() => setIsFavoritesOpen(true)}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenCalendar={() => setIsCalendarOpen(true)}
          onOpenPRs={() => setIsPRsOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAdmin={() => {
            setIsAdminMode(true);
            window.location.hash = 'admin';
          }}
        />

        {/* 5 Bottom Views Content Routing */}
        <main className="mt-4">
          {activeTab === 'home' && (
            <HomeView
              workout={workout}
              isTodayDone={isTodayCompleted}
              onStartWorkout={() => setIsActiveWorkoutOpen(true)}
              onViewExercises={() => setIsExerciseDrawerOpen(true)}
              onNavigateToDiet={() => {
                playWorkoutSound('tick');
                setActiveTab('diet');
              }}
              waterGlasses={waterGlasses}
              targetWaterGlasses={targetWaterGlasses}
              onAddWater={handleAddWaterQuick}
              streakDays={stats.streakDays}
              nutritionLog={nutritionLog}
              dailyCheckIn={todayCheckIn}
              onOpenCheckIn={() => setIsDailyCheckInOpen(true)}
              onOpenArticles={() => setIsArticlesOpen(true)}
              onOpenVideos={() => setIsVideosOpen(true)}
              programRequest={programRequest}
              onOpenDetailedProfile={() => setShowDetailedProfileWizard(true)}
              onOpenRequestStatus={() => setShowProgramRequestStatusModal(true)}
            />
          )}

          {activeTab === 'workouts' && (
            <WorkoutView
              currentWorkout={workout}
              onStartWorkout={() => setIsActiveWorkoutOpen(true)}
              onStartFreeWorkout={() => setIsActiveWorkoutOpen(true)}
              onOpenHistory={() => setIsHistoryOpen(true)}
              onOpenCalendar={() => setIsCalendarOpen(true)}
              onOpenPRs={() => setIsPRsOpen(true)}
              onOpenEditor={() => setIsEditorOpen(true)}
              onViewExercises={() => setIsExerciseDrawerOpen(true)}
              onSelectExercise={(ex) => setSelectedExerciseForDetail(ex)}
            />
          )}

          {activeTab === 'diet' && (
            <DietView
              userId={currentUser?.uid || 'guest'}
              userGoal={userProfile?.goal === 'muscle_gain' ? 'افزایش حجم عضلانی' : 'کاهش وزن و تناسب'}
              onOpenPreferences={() => setIsFoodPreferencesOpen(true)}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressView
              onOpenPRs={() => setIsPRsOpen(true)}
              onOpenAchievements={() => {
                setHubTab('achievements');
                setIsHubOpen(true);
              }}
              totalWorkouts={stats.totalWorkoutsDone}
              streakDays={stats.streakDays}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              userProfile={userProfile}
              isLoggedIn={!!currentUser}
              onOpenAuth={() => setIsAuthOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenFavorites={() => setIsFavoritesOpen(true)}
              onOpenAchievements={() => {
                setHubTab('achievements');
                setIsHubOpen(true);
              }}
              onOpenNutrition={() => {
                setActiveTab('diet');
              }}
              onOpenFoodPreferences={() => setIsFoodPreferencesOpen(true)}
              onOpenNotificationSettings={() => setIsNotificationSettingsOpen(true)}
              onOpenTrainingProfile={() => setShowProfileSetup(true)}
              onOpenDetailedProfile={() => setShowDetailedProfileWizard(true)}
              onOpenRequestStatus={() => setShowProgramRequestStatusModal(true)}
              programRequest={programRequest}
              onLogout={async () => {
                await AuthRepository.logout();
                setCurrentUser(null);
                setShowToast('از حساب کاربری خارج شدید.');
                setTimeout(() => setShowToast(null), 3000);
              }}
              onOpenAdmin={() => {
                setIsAdminMode(true);
                window.location.hash = 'admin';
              }}
            />
          )}
        </main>
      </div>

      {/* Floating Glass Bottom Navigation */}
      <GlassBottomNavigation
        activeTab={activeTab}
        onChangeTab={(tab) => {
          playWorkoutSound('tick');
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 1. Exercise List Drawer */}
      <ExerciseListDrawer
        isOpen={isExerciseDrawerOpen}
        onClose={() => setIsExerciseDrawerOpen(false)}
        workout={workout}
        onStartWorkout={() => {
          setIsExerciseDrawerOpen(false);
          setIsActiveWorkoutOpen(true);
        }}
        onSelectExercise={(ex) => setSelectedExerciseForDetail(ex)}
        onOpenEditor={() => setIsEditorOpen(true)}
      />

      {/* 2. Active Workout Live Execution Modal */}
      <ActiveWorkoutModal
        isOpen={isActiveWorkoutOpen}
        onClose={() => setIsActiveWorkoutOpen(false)}
        workout={workout}
        userId={currentUser?.uid}
        onFinishWorkout={handleFinishWorkout}
      />

      {/* 3. Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(userName) => {
          setStats((prev) => ({ ...prev, userName }));
          setShowToast(`خوش آمدید، ${userName}! همگام‌سازی ابری برقرار شد.`);
          setTimeout(() => setShowToast(null), 3500);
        }}
      />

      {/* 4. Detailed Hub Modal (Progress, Nutrition, Achievements, AI) */}
      <DetailedHubModal
        isOpen={isHubOpen}
        onClose={() => setIsHubOpen(false)}
        userId={currentUser?.uid || 'guest'}
        defaultTab={hubTab}
      />

      {/* 5. Workout History Modal */}
      <WorkoutHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        userId={currentUser?.uid}
        onStartNewWorkout={() => {
          setIsHistoryOpen(false);
          setIsActiveWorkoutOpen(true);
        }}
      />

      {/* 6. Workout Calendar Modal */}
      <WorkoutCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        sessions={userSessions}
        onStartTodayWorkout={() => {
          setIsCalendarOpen(false);
          setIsActiveWorkoutOpen(true);
        }}
      />

      {/* 7. Personal Records (PR) Modal */}
      <PersonalRecordsModal
        isOpen={isPRsOpen}
        onClose={() => setIsPRsOpen(false)}
        personalRecords={userPRs}
      />

      {/* 8. Workout Routine Editor Modal */}
      <WorkoutEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        initialWorkout={workout}
        onSave={(updated) => {
          setWorkout(updated);
          setShowToast('برنامه تمرین با موفقیت به‌روزرسانی شد.');
          setTimeout(() => setShowToast(null), 3000);
        }}
      />

      {/* 9. Exercise Detail / Biomechanics Modal */}
      <ExerciseDetailModal
        isOpen={!!selectedExerciseForDetail}
        onClose={() => setSelectedExerciseForDetail(null)}
        exercise={selectedExerciseForDetail}
        userId={currentUser?.uid}
      />

      {/* 10. Saved Favorites Modal */}
      <SavedFavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        userId={currentUser?.uid}
        onSelectExercise={(exId) => {
          const ex = allExercises.find((e) => e.id === exId) || workout.exercises.find((e) => e.id === exId);
          if (ex) {
            setIsFavoritesOpen(false);
            setSelectedExerciseForDetail(ex);
          }
        }}
        onSelectArticle={() => {
          setIsFavoritesOpen(false);
          setIsArticlesOpen(true);
        }}
        onSelectVideo={() => {
          setIsFavoritesOpen(false);
          setIsVideosOpen(true);
        }}
      />

      {/* 11. Articles Modal */}
      <ArticlesModal
        isOpen={isArticlesOpen}
        onClose={() => setIsArticlesOpen(false)}
        userId={currentUser?.uid}
      />

      {/* 12. Videos Modal */}
      <VideosModal
        isOpen={isVideosOpen}
        onClose={() => setIsVideosOpen(false)}
        userId={currentUser?.uid}
      />

      {/* 13. Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        userId={currentUser?.uid}
        onClearUnreadCount={() => setUnreadNotifsCount(0)}
      />

      {/* 14. Settings & Account Management Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userProfile={userProfile}
        onLogout={async () => {
          await AuthRepository.logout();
          setCurrentUser(null);
          setIsSettingsOpen(false);
          setShowToast('از حساب کاربری خارج شدید.');
          setTimeout(() => setShowToast(null), 3000);
        }}
        onEditProfile={() => {
          setIsSettingsOpen(false);
          setShowProfileSetup(true);
        }}
        onAccountDeleted={() => {
          setCurrentUser(null);
          setIsSettingsOpen(false);
          setShowSplash(true);
          setShowOnboarding(true);
          setShowToast('حساب کاربری و کلیه اطلاعات با موفقیت حذف گردید.');
          setTimeout(() => setShowToast(null), 4000);
        }}
      />

      {/* 15. Daily Check-in Modal */}
      <DailyCheckInModal
        isOpen={isDailyCheckInOpen}
        onClose={() => setIsDailyCheckInOpen(false)}
        userId={currentUser?.uid || 'guest'}
        onCheckInSaved={(c) => {
          setTodayCheckIn(c);
          setShowToast('گزارش روزانه با موفقیت ثبت شد ⭐');
          setTimeout(() => setShowToast(null), 3000);
        }}
        waterAchieved={waterGlasses >= targetWaterGlasses}
        workoutDone={isTodayCompleted}
        existingCheckIn={todayCheckIn}
      />

      {/* 16. Notification Settings Modal */}
      <NotificationSettingsModal
        isOpen={isNotificationSettingsOpen}
        onClose={() => setIsNotificationSettingsOpen(false)}
        userId={currentUser?.uid || 'guest'}
        waterGlasses={waterGlasses}
        targetWaterGlasses={targetWaterGlasses}
        onSaved={() => {
          setShowToast('تنظیمات یادآورها به‌روزرسانی شد 🔔');
          setTimeout(() => setShowToast(null), 3000);
        }}
      />

      {/* 17. Food Preferences Modal */}
      <FoodPreferencesModal
        isOpen={isFoodPreferencesOpen}
        onClose={() => setIsFoodPreferencesOpen(false)}
        userId={currentUser?.uid || 'guest'}
        onSaved={() => {
          setShowToast('ترجیحات و آلرژی‌های غذایی ذخیره شد 🥗');
          setTimeout(() => setShowToast(null), 3000);
        }}
      />

      {/* 18. Detailed Profile Wizard (Phase 3) */}
      {showDetailedProfileWizard && (
        <DetailedProfileWizard
          isOpen={showDetailedProfileWizard}
          onClose={() => setShowDetailedProfileWizard(false)}
          userId={currentUser?.uid || userProfile?.userId || 'guest'}
          userProfile={userProfile}
          initialProfile={userProfile?.detailedProfile}
          initialUserData={{
            name: userProfile?.name,
            email: userProfile?.email,
            weightKg: userProfile?.weight,
            heightCm: userProfile?.height,
            age: userProfile?.age,
            gender: userProfile?.gender,
            fitnessLevel: userProfile?.fitnessLevel,
            goal: userProfile?.goal,
          }}
          onSubmitted={async (submittedProfile) => {
            setUserProfile((prev) => {
              const next = {
                ...prev,
                detailedProfile: submittedProfile,
              };
              localStorage.setItem('polad_user_profile', JSON.stringify(next));
              return next;
            });
            const activeId = currentUser?.uid || userProfile?.userId || 'guest';
            await loadProgramRequest(activeId);
            setShowDetailedProfileWizard(false);
            setShowToast('پرونده تکمیلی با موفقیت ثبت و برای مربی ارسال شد 💜');
            setTimeout(() => setShowToast(null), 3500);
          }}
          onProfileSubmitted={async (submittedProfile) => {
            setUserProfile((prev) => {
              const next = {
                ...prev,
                detailedProfile: submittedProfile,
              };
              localStorage.setItem('polad_user_profile', JSON.stringify(next));
              return next;
            });
            const activeId = currentUser?.uid || userProfile?.userId || 'guest';
            await loadProgramRequest(activeId);
            setShowDetailedProfileWizard(false);
            setShowToast('پرونده تکمیلی با موفقیت ثبت و برای مربی ارسال شد 💜');
            setTimeout(() => setShowToast(null), 3500);
          }}
        />
      )}

      {/* 19. Program Request Status Modal (Phase 3) */}
      {showProgramRequestStatusModal && (
        <ProgramRequestStatusModal
          isOpen={showProgramRequestStatusModal}
          onClose={() => setShowProgramRequestStatusModal(false)}
          request={programRequest}
          onEditProfile={() => {
            setShowProgramRequestStatusModal(false);
            setShowDetailedProfileWizard(true);
          }}
          onOpenWorkoutProgram={() => {
            setShowProgramRequestStatusModal(false);
            setActiveTab('workouts');
          }}
          onRefresh={() => {
            const activeId = currentUser?.uid || userProfile?.id || 'guest';
            loadProgramRequest(activeId);
          }}
        />
      )}
    </div>
  );
}
