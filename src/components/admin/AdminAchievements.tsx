import React, { useState } from 'react';
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  Flame,
  Zap,
  Dumbbell,
  Shield,
  X,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AchievementItem } from '../../types';
import { AdminRepository } from '../../repositories/AdminRepository';
import { AdminConfirmationModal } from './AdminConfirmationModal';

interface AdminAchievementsProps {
  achievements: AchievementItem[];
  onRefresh: () => void;
}

export const AdminAchievements: React.FC<AdminAchievementsProps> = ({
  achievements,
  onRefresh,
}) => {
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    achievement: Partial<AchievementItem> | null;
    isNew: boolean;
  }>({
    isOpen: false,
    achievement: null,
    isNew: true,
  });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    achievement: AchievementItem | null;
  }>({
    isOpen: false,
    achievement: null,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleOpenCreate = () => {
    setEditModal({
      isOpen: true,
      isNew: true,
      achievement: {
        titleFa: '',
        descriptionFa: '',
        icon: '🏆',
        criteria: '',
        active: true,
      },
    });
  };

  const handleOpenEdit = (ach: AchievementItem) => {
    setEditModal({
      isOpen: true,
      isNew: false,
      achievement: { ...ach },
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal.achievement?.titleFa) return;

    setIsSaving(true);
    try {
      const payload: AchievementItem = {
        achievementId: editModal.achievement.achievementId || `ach_${Date.now()}`,
        titleFa: editModal.achievement.titleFa,
        descriptionFa: editModal.achievement.descriptionFa || '',
        icon: editModal.achievement.icon || '🏆',
        criteria: editModal.achievement.criteria || '',
        active: editModal.achievement.active !== undefined ? editModal.achievement.active : true,
      };

      await AdminRepository.saveAchievement(payload, editModal.isNew);
      setEditModal({ isOpen: false, achievement: null, isNew: true });
      onRefresh();
    } catch (e) {
      console.error('Error saving achievement:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.achievement) return;
    setIsSaving(true);
    try {
      await AdminRepository.deleteAchievement(deleteModal.achievement.achievementId, deleteModal.achievement.titleFa);
      setDeleteModal({ isOpen: false, achievement: null });
      onRefresh();
    } catch (e) {
      console.error('Error deleting achievement:', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Award className="w-7 h-7 text-yellow-400" />
            مدیریت دستاوردها و نشان‌های افتخار (Achievements)
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            تنظیم نشان‌های انگیزشی، شرایط آنلاک برای استمرار، حجم تمرین و ثبت رکوردهای بدنسازی
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>تعریف دستاورد جدید</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {achievements.map((ach) => (
          <motion.div
            key={ach.achievementId}
            whileHover={{ y: -3 }}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 flex items-center justify-center text-2xl group-hover:scale-110 transition shadow-lg">
                  {ach.icon || '🏆'}
                </div>
                <span className={`px-3 py-1 font-bold text-[11px] rounded-full border ${ach.active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
                  {ach.active ? 'فعال در اپ' : 'غیرفعال'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-white group-hover:text-yellow-400 transition">
                  {ach.titleFa}
                </h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{ach.descriptionFa}</p>
                {ach.criteria && (
                  <div className="mt-3 p-2 bg-zinc-950 rounded-xl border border-zinc-800 text-[11px] text-zinc-400">
                    شرط کسب: {ach.criteria}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleOpenEdit(ach)}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeleteModal({ isOpen: true, achievement: ach })}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editModal.isOpen && editModal.achievement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditModal({ isOpen: false, achievement: null, isNew: true })}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-right"
              dir="rtl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-400" />
                  {editModal.isNew ? 'تعریف دستاورد جدید' : `ویرایش دستاورد: ${editModal.achievement.titleFa}`}
                </h2>
                <button
                  type="button"
                  onClick={() => setEditModal({ isOpen: false, achievement: null, isNew: true })}
                  className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="py-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">عنوان فارسی نشان *</label>
                  <input
                    type="text"
                    required
                    value={editModal.achievement.titleFa || ''}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        achievement: { ...editModal.achievement, titleFa: e.target.value },
                      })
                    }
                    placeholder="مثال: فرمانروای تناژ"
                    className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:border-yellow-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">ایموجی / آیکون</label>
                    <input
                      type="text"
                      value={editModal.achievement.icon || '🏆'}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          achievement: { ...editModal.achievement, icon: e.target.value },
                        })
                      }
                      className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm text-center"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">وضعیت فعال بودن</label>
                    <select
                      value={editModal.achievement.active ? 'true' : 'false'}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          achievement: { ...editModal.achievement, active: e.target.value === 'true' },
                        })
                      }
                      className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs"
                    >
                      <option value="true">فعال</option>
                      <option value="false">غیرفعال</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">توضیحات و شرح نشان</label>
                  <textarea
                    rows={2}
                    value={editModal.achievement.descriptionFa || ''}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        achievement: { ...editModal.achievement, descriptionFa: e.target.value },
                      })
                    }
                    placeholder="مثال: مجموع تناژ تمرینی را به بیش از ۵۰,۰۰۰ کیلوگرم برسانید."
                    className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">شرط باز شدن (معیار خودکار)</label>
                  <input
                    type="text"
                    value={editModal.achievement.criteria || ''}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        achievement: { ...editModal.achievement, criteria: e.target.value },
                      })
                    }
                    placeholder="مثال: workout_count >= 50"
                    className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs font-mono"
                  />
                </div>

                <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditModal({ isOpen: false, achievement: null, isNew: true })}
                    className="px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 text-xs"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black rounded-xl"
                  >
                    {isSaving ? 'در حال ذخیره‌سازی...' : 'ذخیره دستاورد'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AdminConfirmationModal
        isOpen={deleteModal.isOpen}
        title="حذف نشان دستاورد"
        message={`آیا مطمئن هستید که می‌خواهید نشان «${deleteModal.achievement?.titleFa}» را حذف نمایید؟`}
        confirmLabel="حذف دستاورد"
        isLoading={isSaving}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModal({ isOpen: false, achievement: null })}
      />
    </div>
  );
};
