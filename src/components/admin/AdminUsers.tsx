import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Eye,
  Trash2,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Calendar,
  Flame,
  Activity,
  Award,
  Scale,
  Apple,
  X,
  UserCheck,
  UserX,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, WorkoutSession, PersonalRecord, BodyMeasurement, NutritionLog } from '../../types';
import { AdminRepository } from '../../repositories/AdminRepository';
import { AdminConfirmationModal } from './AdminConfirmationModal';

interface AdminUsersProps {
  users: UserProfile[];
  onRefresh: () => void;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ users, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [goalFilter, setGoalFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Selected User Detail Modal State
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userDetails, setUserDetails] = useState<{
    sessions: WorkoutSession[];
    prs: PersonalRecord[];
    measurements: BodyMeasurement[];
    nutrition: NutritionLog[];
  } | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'info' | 'sessions' | 'prs' | 'measurements' | 'nutrition'>('info');

  // Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; user: UserProfile | null }>({
    isOpen: false,
    user: null,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchGoal = goalFilter === 'all' || u.goal === goalFilter;
      const matchLevel = levelFilter === 'all' || u.fitnessLevel === levelFilter;
      const matchStatus = statusFilter === 'all' || (u.accountStatus || 'active') === statusFilter;
      return matchSearch && matchGoal && matchLevel && matchStatus;
    });
  }, [users, searchTerm, goalFilter, levelFilter, statusFilter]);

  const handleOpenUserDetail = async (user: UserProfile) => {
    setSelectedUser(user);
    setActiveDetailTab('info');
    setLoadingDetails(true);
    try {
      const details = await AdminRepository.getUserFullDetails(user.userId);
      setUserDetails(details);
    } catch (e) {
      console.warn('Error loading user details:', e);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleToggleStatus = async (user: UserProfile, newStatus: 'active' | 'suspended' | 'banned') => {
    try {
      await AdminRepository.updateUserAccountStatus(user.userId, newStatus);
      if (selectedUser && selectedUser.userId === user.userId) {
        setSelectedUser({ ...selectedUser, accountStatus: newStatus });
      }
      onRefresh();
    } catch (e) {
      console.error('Error updating status:', e);
    }
  };

  const handleConfirmDeleteUser = async () => {
    if (!deleteModal.user) return;
    setIsProcessing(true);
    try {
      await AdminRepository.deleteUserAccount(deleteModal.user.userId);
      setDeleteModal({ isOpen: false, user: null });
      if (selectedUser?.userId === deleteModal.user.userId) {
        setSelectedUser(null);
      }
      onRefresh();
    } catch (e) {
      console.error('Error deleting user:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const getGoalNameFa = (goal?: string) => {
    switch (goal) {
      case 'muscle_gain':
        return 'عضله‌سازی و هایپرتروفی';
      case 'fat_loss':
        return 'چربی‌سوزی و کات';
      case 'strength':
        return 'افزایش قدرت';
      default:
        return 'تثبیت و سلامت عمومی';
    }
  };

  const getLevelNameFa = (level?: string) => {
    switch (level) {
      case 'beginner':
        return 'مبتدی';
      case 'advanced':
        return 'پیشرفته';
      default:
        return 'متوسط';
    }
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Users className="w-7 h-7 text-purple-400" />
            مدیریت کاربران و ورزشکاران
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            مشاهده پرونده ورزشی، تاریخچه جلسات تمرینی، رکوردهای وزنه و کنترل وضعیت حساب‌ها
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-4 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-2xl text-xs font-bold">
            {users.length} کاربر ثبت‌شده
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجوی نام یا ایمیل کاربر..."
            className="w-full pl-4 pr-12 py-3 bg-zinc-950 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:border-purple-500 transition"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={goalFilter}
            onChange={(e) => setGoalFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-2xl px-3 py-3 focus:outline-none focus:border-purple-500"
          >
            <option value="all">همه اهداف تمرینی</option>
            <option value="muscle_gain">عضله‌سازی</option>
            <option value="fat_loss">چربی‌سوزی</option>
            <option value="strength">افزایش قدرت</option>
          </select>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-2xl px-3 py-3 focus:outline-none focus:border-purple-500"
          >
            <option value="all">همه سطوح</option>
            <option value="beginner">مبتدی</option>
            <option value="intermediate">متوسط</option>
            <option value="advanced">پیشرفته</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-2xl px-3 py-3 focus:outline-none focus:border-purple-500"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="active">فعال</option>
            <option value="suspended">تعلیق شده</option>
            <option value="banned">مسدود</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        {filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 text-sm">
            هیچ کاربری با فیلترهای مشخص‌شده یافت نشد.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-zinc-950/80 text-zinc-400 text-xs font-bold border-b border-zinc-800">
                <tr>
                  <th className="py-4 px-6">کاربر</th>
                  <th className="py-4 px-4">هدف / سطح</th>
                  <th className="py-4 px-4">استمرار تمرین</th>
                  <th className="py-4 px-4">تمرین‌های ثبت‌شده</th>
                  <th className="py-4 px-4">وضعیت حساب</th>
                  <th className="py-4 px-6 text-left">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredUsers.map((user) => (
                  <tr key={user.userId} className="hover:bg-zinc-800/40 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-black text-white text-base shadow-md">
                          {user.name ? user.name[0] : 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{user.name || 'ورزشکار'}</div>
                          <div className="text-xs text-zinc-400 font-mono mt-0.5" dir="ltr">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-xs font-semibold text-zinc-200">{getGoalNameFa(user.goal)}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">سطح {getLevelNameFa(user.fitnessLevel)}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                        <Flame className="w-3.5 h-3.5" />
                        {user.streakDays || 1} روز استمرار
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-zinc-300">
                      {user.totalWorkoutsDone || 0} جلسه
                    </td>
                    <td className="py-4 px-4">
                      {user.accountStatus === 'banned' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                          <XCircle className="w-3.5 h-3.5" /> مسدود
                        </span>
                      ) : user.accountStatus === 'suspended' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                          <ShieldAlert className="w-3.5 h-3.5" /> تعلیق
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          <CheckCircle className="w-3.5 h-3.5" /> فعال
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-left">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenUserDetail(user)}
                          className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                          title="مشاهده پرونده کامل کاربر"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteModal({ isOpen: true, user })}
                          className="p-2 rounded-xl bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition"
                          title="حذف حساب کاربر"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Full Detail Modal / Drawer */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] flex flex-col overflow-hidden text-right"
              dir="rtl"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-6 border-b border-zinc-800">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-black text-white text-2xl shadow-xl">
                    {selectedUser.name ? selectedUser.name[0] : 'U'}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">{selectedUser.name}</h2>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5" dir="ltr">{selectedUser.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
                        {getGoalNameFa(selectedUser.goal)}
                      </span>
                      <span className="text-xs text-zinc-500">
                        ثبت‌نام: {new Date(selectedUser.createdAt).toLocaleDateString('fa-IR')}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Tabs inside modal */}
              <div className="flex items-center gap-2 py-3 border-b border-zinc-800 overflow-x-auto text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveDetailTab('info')}
                  className={`px-4 py-2 rounded-xl transition ${activeDetailTab === 'info' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
                >
                  مشخصات فیزیکی و حساب
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDetailTab('sessions')}
                  className={`px-4 py-2 rounded-xl transition ${activeDetailTab === 'sessions' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
                >
                  جلسات تمرینی ({userDetails?.sessions.length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDetailTab('prs')}
                  className={`px-4 py-2 rounded-xl transition ${activeDetailTab === 'prs' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
                >
                  رکوردهای شخصی ({userDetails?.prs.length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDetailTab('measurements')}
                  className={`px-4 py-2 rounded-xl transition ${activeDetailTab === 'measurements' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
                >
                  سنجش ابعاد بدن
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto py-6 space-y-6">
                {loadingDetails ? (
                  <div className="py-16 text-center text-zinc-400 flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <span>در حال فراخوانی داده‌های کاربر از دیتابیس...</span>
                  </div>
                ) : (
                  <>
                    {activeDetailTab === 'info' && (
                      <div className="space-y-6">
                        {/* Physical Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                            <span className="text-xs text-zinc-500 block mb-1">قد</span>
                            <span className="text-base font-bold text-white">{selectedUser?.height || 180} سانتی‌متر</span>
                          </div>
                          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                            <span className="text-xs text-zinc-500 block mb-1">وزن فعلی</span>
                            <span className="text-base font-bold text-white">{selectedUser?.weight || 79.5} کیلوگرم</span>
                          </div>
                          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                            <span className="text-xs text-zinc-500 block mb-1">سن</span>
                            <span className="text-base font-bold text-white">{selectedUser?.age || 24} سال</span>
                          </div>
                          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                            <span className="text-xs text-zinc-500 block mb-1">روزهای تمرین</span>
                            <span className="text-base font-bold text-white">{selectedUser?.trainingDaysPerWeek || 5} روز در هفته</span>
                          </div>
                        </div>

                        {/* Account Controls */}
                        <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800">
                          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-purple-400" />
                            کنترل وضعیت دسترسی حساب کاربری
                          </h4>
                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(selectedUser, 'active')}
                              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${selectedUser.accountStatus === 'active' || !selectedUser.accountStatus ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                            >
                              <UserCheck className="w-4 h-4" />
                              <span>فعال کردن کاربر</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(selectedUser, 'suspended')}
                              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${selectedUser.accountStatus === 'suspended' ? 'bg-amber-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                            >
                              <ShieldAlert className="w-4 h-4" />
                              <span>تعلیق موقت</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(selectedUser, 'banned')}
                              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${selectedUser.accountStatus === 'banned' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                            >
                              <UserX className="w-4 h-4" />
                              <span>مسدود کردن کاربر</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeDetailTab === 'sessions' && (
                      <div className="space-y-3">
                        {!userDetails?.sessions || userDetails.sessions.length === 0 ? (
                          <div className="py-8 text-center text-zinc-500 text-sm">
                            جلسه تمرینی از این کاربر ثبت نشده است.
                          </div>
                        ) : (
                          userDetails.sessions.map((sess) => (
                            <div key={sess.id} className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between">
                              <div>
                                <h4 className="text-sm font-bold text-white">{sess.titleFa}</h4>
                                <span className="text-xs text-zinc-400">{sess.muscleGroupsFa} • {sess.totalExercises} حرکت</span>
                              </div>
                              <div className="text-left font-mono text-xs">
                                <span className="text-emerald-400 font-bold block">{sess.totalVolumeKg?.toLocaleString('fa-IR')} کیلوگرم حجم</span>
                                <span className="text-zinc-500 text-[11px]">{new Date(sess.completedAt || sess.startedAt || '').toLocaleDateString('fa-IR')}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {activeDetailTab === 'prs' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {!userDetails?.prs || userDetails.prs.length === 0 ? (
                          <div className="col-span-2 py-8 text-center text-zinc-500 text-sm">
                            رکورد شخصی ثبت نشده است.
                          </div>
                        ) : (
                          userDetails.prs.map((pr) => (
                            <div key={pr.id} className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between">
                              <div>
                                <h4 className="text-sm font-bold text-white">{pr.exerciseNameFa}</h4>
                                <span className="text-xs text-zinc-400">تخمین 1RM: {pr.estimated1RM} کیلوگرم</span>
                              </div>
                              <span className="text-base font-black text-amber-400 font-mono">
                                {pr.maxWeightKg} KG × {pr.maxRepsAtWeight}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {activeDetailTab === 'measurements' && (
                      <div className="space-y-3">
                        {!userDetails?.measurements || userDetails.measurements.length === 0 ? (
                          <div className="py-8 text-center text-zinc-500 text-sm">
                            سنجش ابعاد بدنی ثبت نشده است.
                          </div>
                        ) : (
                          userDetails.measurements.map((m) => (
                            <div key={m.id} className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                              <div><span className="text-zinc-500">تاریخ:</span> <span className="text-white font-mono">{m.date}</span></div>
                              <div><span className="text-zinc-500">وزن:</span> <span className="text-white font-bold">{m?.weight ?? '-'} kg</span></div>
                              <div><span className="text-zinc-500">دور سینه:</span> <span className="text-white font-bold">{m.chest || '-'} cm</span></div>
                              <div><span className="text-zinc-500">دور بازو:</span> <span className="text-white font-bold">{m.arm || '-'} cm</span></div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete User Confirmation Modal */}
      <AdminConfirmationModal
        isOpen={deleteModal.isOpen}
        title="حذف دائمی حساب کاربر"
        message={`آیا مطمئن هستید که می‌خواهید حساب کاربری «${deleteModal.user?.name}» (${deleteModal.user?.email}) را به صورت دائمی حذف کنید؟ کلیه تاریخچه تمرینات و رکوردهای او پاک خواهند شد.`}
        confirmLabel="حذف دائمی کاربر"
        isLoading={isProcessing}
        onConfirm={handleConfirmDeleteUser}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
      />
    </div>
  );
};
