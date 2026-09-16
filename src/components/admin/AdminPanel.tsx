import React, { useState, useEffect } from 'react';
import { AdminAuthService } from '../../services/AdminAuthService';
import { AdminRepository, DashboardOverviewStats } from '../../repositories/AdminRepository';
import {
  AdminUser,
  Exercise,
  WorkoutProgram,
  ArticleItem,
  VideoItem,
  FoodItem,
  AchievementItem,
  ContentCategory,
  MediaItem,
  UserProfile,
  AuditLog,
  AppSetting,
} from '../../types';

import { AdminLoginPage } from './AdminLoginPage';
import { AdminLayout } from './AdminLayout';
import { AdminDashboard } from './AdminDashboard';
import { AdminUsers } from './AdminUsers';
import { AdminExercises } from './AdminExercises';
import { AdminWorkoutPrograms } from './AdminWorkoutPrograms';
import { AdminArticles } from './AdminArticles';
import { AdminVideos } from './AdminVideos';
import { AdminNutrition } from './AdminNutrition';
import { AdminNotifications } from './AdminNotifications';
import { AdminAchievements } from './AdminAchievements';
import { AdminCategories } from './AdminCategories';
import { AdminMediaLibrary } from './AdminMediaLibrary';
import { AdminAuditLog } from './AdminAuditLog';
import { AdminAnalytics } from './AdminAnalytics';
import { AdminSettings } from './AdminSettings';
import { AdminSeed } from './AdminSeed';
import { AdminProgramRequests } from './AdminProgramRequests';

interface AdminPanelProps {
  onSwitchToUserApp: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onSwitchToUserApp }) => {
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [loading, setLoading] = useState(true);

  // Data States
  const [stats, setStats] = useState<DashboardOverviewStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalExercises: 0,
    totalPrograms: 0,
    totalArticles: 0,
    totalVideos: 0,
    totalFoods: 0,
    totalWorkoutsCompleted: 0,
    totalMediaFiles: 0,
    userGrowthTrend: [],
    workoutCompletionsTrend: [],
    categoryDistribution: [],
  });

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [settings, setSettings] = useState<AppSetting | null>(null);

  // Check current session
  useEffect(() => {
    const admin = AdminAuthService.getStoredAdmin();
    if (admin) {
      setCurrentAdmin(admin);
      loadAllAdminData();
    } else {
      setLoading(false);
    }
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [
        dashStats,
        allUsers,
        allExercises,
        allPrograms,
        allArticles,
        allVideos,
        allFoods,
        allAchievements,
        allCategories,
        allMedia,
        allLogs,
        appSettings,
      ] = await Promise.all([
        AdminRepository.getDashboardOverview(),
        AdminRepository.getAllUsers(),
        AdminRepository.getAllExercises(),
        AdminRepository.getWorkoutPrograms(),
        AdminRepository.getArticles(),
        AdminRepository.getVideos(),
        AdminRepository.getFoods(),
        AdminRepository.getAchievements(),
        AdminRepository.getCategories(),
        AdminRepository.getMediaItems(),
        AdminRepository.getAuditLogs(50),
        AdminRepository.getAppSettings(),
      ]);

      setStats(dashStats);
      setUsers(allUsers);
      setExercises(allExercises);
      setPrograms(allPrograms);
      setArticles(allArticles);
      setVideos(allVideos);
      setFoods(allFoods);
      setAchievements(allAchievements);
      setCategories(allCategories);
      setMedia(allMedia);
      setAuditLogs(allLogs);
      setSettings(appSettings);
    } catch (e) {
      console.error('Error loading admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (admin: AdminUser) => {
    setCurrentAdmin(admin);
    loadAllAdminData();
  };

  const handleLogout = async () => {
    await AdminAuthService.logout();
    setCurrentAdmin(null);
  };

  if (!currentAdmin) {
    return (
      <AdminLoginPage
        onLoginSuccess={handleLoginSuccess}
        onBackToApp={onSwitchToUserApp}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white" dir="rtl">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-lg font-bold">در حال همگام‌سازی اطلاعات پنل مدیریت با Firebase...</h2>
        <p className="text-xs text-zinc-500 mt-1">بارگذاری امن داده‌های پایگاه داده</p>
      </div>
    );
  }

  return (
    <AdminLayout
      currentAdmin={currentAdmin}
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      onLogout={handleLogout}
      onSwitchToApp={onSwitchToUserApp}
    >
      {activeTab === 'dashboard' && (
        <AdminDashboard
          stats={stats}
          auditLogs={auditLogs}
          onNavigateTab={setActiveTab}
          onOpenCreateModal={(type) => {
            if (type === 'exercise') setActiveTab('exercises');
            if (type === 'program') setActiveTab('programs');
            if (type === 'notification') setActiveTab('notifications');
          }}
        />
      )}

      {activeTab === 'programRequests' && (
        <AdminProgramRequests
          programs={programs}
          currentAdmin={currentAdmin}
        />
      )}

      {activeTab === 'users' && (
        <AdminUsers users={users} onRefresh={loadAllAdminData} />
      )}

      {activeTab === 'exercises' && (
        <AdminExercises exercises={exercises} onRefresh={loadAllAdminData} />
      )}

      {activeTab === 'programs' && (
        <AdminWorkoutPrograms
          programs={programs}
          exercises={exercises}
          onRefresh={loadAllAdminData}
        />
      )}

      {activeTab === 'articles' && (
        <AdminArticles articles={articles} onRefresh={loadAllAdminData} />
      )}

      {activeTab === 'videos' && (
        <AdminVideos videos={videos} onRefresh={loadAllAdminData} />
      )}

      {activeTab === 'nutrition' && (
        <AdminNutrition foods={foods} onRefresh={loadAllAdminData} />
      )}

      {activeTab === 'notifications' && <AdminNotifications />}

      {activeTab === 'achievements' && (
        <AdminAchievements achievements={achievements} onRefresh={loadAllAdminData} />
      )}

      {activeTab === 'categories' && (
        <AdminCategories categories={categories} onRefresh={loadAllAdminData} />
      )}

      {activeTab === 'media' && (
        <AdminMediaLibrary media={media} onRefresh={loadAllAdminData} />
      )}

      {activeTab === 'audit' && <AdminAuditLog logs={auditLogs} />}

      {activeTab === 'analytics' && <AdminAnalytics stats={stats} />}

      {activeTab === 'seed' && <AdminSeed onRefresh={loadAllAdminData} />}

      {activeTab === 'settings' && (
        <AdminSettings
          currentAdmin={currentAdmin}
          settings={settings}
          onRefresh={loadAllAdminData}
        />
      )}
    </AdminLayout>
  );
};
