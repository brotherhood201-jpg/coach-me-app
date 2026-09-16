import React, { useState, useMemo } from 'react';
import {
  Dumbbell,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Upload,
  Image as ImageIcon,
  Check,
  X,
  PlayCircle,
  HelpCircle,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Exercise, ContentStatus } from '../../types';
import { AdminRepository } from '../../repositories/AdminRepository';
import { StorageService } from '../../services/StorageService';
import { AdminConfirmationModal } from './AdminConfirmationModal';

interface AdminExercisesProps {
  exercises: Exercise[];
  onRefresh: () => void;
}

export const AdminExercises: React.FC<AdminExercisesProps> = ({ exercises, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [equipmentFilter, setEquipmentFilter] = useState('all');

  // Add / Edit Modal State
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    exercise: Partial<Exercise> | null;
    isNew: boolean;
  }>({
    isOpen: false,
    exercise: null,
    isNew: true,
  });

  // Preview Modal State
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null);

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    exercise: Exercise | null;
  }>({
    isOpen: false,
    exercise: null,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Filtered Exercises
  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const term = searchTerm.toLowerCase().trim();
      const matchSearch =
        (ex.nameFa || '').toLowerCase().includes(term) ||
        (ex.nameEn || '').toLowerCase().includes(term) ||
        (ex.primaryMuscle ? ex.primaryMuscle.toLowerCase().includes(term) : false);

      const matchMuscle =
        muscleFilter === 'all' ||
        (ex.primaryMuscle && ex.primaryMuscle.includes(muscleFilter)) ||
        (ex.targetMuscle && ex.targetMuscle.includes(muscleFilter));

      const matchDiff = difficultyFilter === 'all' || ex.difficulty === difficultyFilter;
      const matchEquip = equipmentFilter === 'all' || (ex.equipment && ex.equipment.includes(equipmentFilter));

      return matchSearch && matchMuscle && matchDiff && matchEquip;
    });
  }, [exercises, searchTerm, muscleFilter, difficultyFilter, equipmentFilter]);

  const handleOpenCreateModal = () => {
    setFormError(null);
    setEditModal({
      isOpen: true,
      isNew: true,
      exercise: {
        nameFa: '',
        nameEn: '',
        primaryMuscle: 'سینه',
        secondaryMuscles: 'پشت‌بازو، دلتوئید قدامی',
        targetMuscle: 'سینه و پشت‌بازو',
        equipment: 'هالتر',
        difficulty: 'متوسط',
        restSeconds: 90,
        instructions: ['روی نیمکت قرار بگیرید.', 'میله را با فاصله کمی بیشتر از عرض شانه بگیرید.', 'میله را با کنترل به سمت سینه پایین بیاورید.', 'با انقباض سینه به نقطه شروع بازگردید.'],
        commonMistakes: ['بلند کردن باسن از روی نیمکت', 'باز شدن بیش از حد آرنج‌ها'],
        tips: ['کمان طبیعی ستون فقرات حفظ شود.'],
        imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        sets: [
          { id: 1, setNumber: 1, targetReps: '10', targetWeightKg: 60, completed: false },
          { id: 2, setNumber: 2, targetReps: '10', targetWeightKg: 70, completed: false },
          { id: 3, setNumber: 3, targetReps: '8', targetWeightKg: 80, completed: false },
          { id: 4, setNumber: 4, targetReps: '6', targetWeightKg: 90, completed: false },
        ],
        status: 'published',
        isActive: true,
      },
    });
  };

  const handleOpenEditModal = (exercise: Exercise) => {
    setFormError(null);
    setEditModal({
      isOpen: true,
      isNew: false,
      exercise: { ...exercise },
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = StorageService.validateFile(file, 'image');
    if (!validation.valid) {
      setFormError(validation.error || 'خطا در اعتبارسنجی تصویر');
      return;
    }

    setUploadingImage(true);
    setFormError(null);
    try {
      const res = await StorageService.uploadFile(file, 'exercises');
      setEditModal((prev) => ({
        ...prev,
        exercise: {
          ...prev.exercise,
          imageUrl: res.downloadUrl,
        },
      }));
    } catch (err: any) {
      setFormError(err.message || 'خطا در بارگذاری تصویر در Storage');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    const ex = editModal.exercise;
    if (!ex?.nameFa?.trim() || !ex?.nameEn?.trim()) {
      setFormError('لطفاً نام فارسی و انگلیسی حرکت را وارد کنید.');
      return;
    }

    setIsSaving(true);
    setFormError(null);
    try {
      const fullExercise: Exercise = {
        id: ex.id || `ex_${Date.now()}`,
        nameFa: ex.nameFa.trim(),
        nameEn: ex.nameEn.trim(),
        primaryMuscle: ex.primaryMuscle || 'سینه',
        secondaryMuscles: ex.secondaryMuscles || '',
        targetMuscle: ex.primaryMuscle || 'سینه',
        equipment: ex.equipment || 'هالتر',
        difficulty: ex.difficulty || 'متوسط',
        description: ex.description || '',
        instructions: ex.instructions || [],
        commonMistakes: ex.commonMistakes || [],
        tips: ex.tips || [],
        imageUrl: ex.imageUrl || 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
        videoUrl: ex.videoUrl || '',
        sets: ex.sets || [
          { id: 1, setNumber: 1, targetReps: '10-12', targetWeightKg: 50, completed: false },
          { id: 2, setNumber: 2, targetReps: '8-10', targetWeightKg: 60, completed: false },
          { id: 3, setNumber: 3, targetReps: '8', targetWeightKg: 70, completed: false },
        ],
        restSeconds: Number(ex.restSeconds) || 90,
        status: ex.status || 'published',
        isActive: ex.isActive !== undefined ? ex.isActive : true,
      };

      await AdminRepository.saveExercise(fullExercise, editModal.isNew);
      setEditModal({ isOpen: false, exercise: null, isNew: true });
      onRefresh();
    } catch (err: any) {
      setFormError(err.message || 'خطا در ذخیره‌سازی حرکت در Firestore');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (exercise: Exercise) => {
    try {
      await AdminRepository.toggleExerciseActive(exercise.id, exercise.isActive ?? true);
      onRefresh();
    } catch (e) {
      console.error('Error toggling active state:', e);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.exercise) return;
    setIsSaving(true);
    try {
      await AdminRepository.deleteExercise(deleteModal.exercise.id, deleteModal.exercise.nameFa);
      setDeleteModal({ isOpen: false, exercise: null });
      onRefresh();
    } catch (e) {
      console.error('Error deleting exercise:', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Dumbbell className="w-7 h-7 text-amber-400" />
            مدیریت بانک حرکات ورزشی (Exercises)
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            تعریف و ویرایش حرکات، آموزش گام‌به‌گام بیومکانیک، اشتباهات رایج، آپلود تصاویر و ویدیوها
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن حرکت جدید</span>
        </button>
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
            placeholder="جستجوی نام فارسی، انگلیسی یا عضله هدف..."
            className="w-full pl-4 pr-12 py-3 bg-zinc-950 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        {/* Muscle Filter */}
        <select
          value={muscleFilter}
          onChange={(e) => setMuscleFilter(e.target.value)}
          className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-2xl px-3 py-3 focus:outline-none focus:border-amber-500 w-full md:w-auto"
        >
          <option value="all">همه گروه‌های عضلانی</option>
          <option value="سینه">سینه</option>
          <option value="پشت">پشت و زیربغل</option>
          <option value="سرشانه">سرشانه و دلتوئید</option>
          <option value="پا">پا و باسن</option>
          <option value="بازو">دست و بازو</option>
          <option value="شکم">شکم و هسته بدن</option>
        </select>

        {/* Equipment Filter */}
        <select
          value={equipmentFilter}
          onChange={(e) => setEquipmentFilter(e.target.value)}
          className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-2xl px-3 py-3 focus:outline-none focus:border-amber-500 w-full md:w-auto"
        >
          <option value="all">همه تجهیزات</option>
          <option value="هالتر">هالتر</option>
          <option value="دمبل">دمبل</option>
          <option value="دستگاه">دستگاه</option>
          <option value="کابل">سیم‌کش / کابل</option>
          <option value="وزن بدن">وزن بدن</option>
        </select>

        {/* Difficulty Filter */}
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-2xl px-3 py-3 focus:outline-none focus:border-amber-500 w-full md:w-auto"
        >
          <option value="all">همه سطوح</option>
          <option value="مبتدی">مبتدی</option>
          <option value="متوسط">متوسط</option>
          <option value="پیشرفته">پیشرفته</option>
        </select>
      </div>

      {/* Exercises Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExercises.length === 0 ? (
          <div className="col-span-full py-16 text-center text-zinc-500 text-sm bg-zinc-900 border border-zinc-800 rounded-3xl">
            هیچ حرکتی با فیلترهای مشخص‌شده یافت نشد.
          </div>
        ) : (
          filteredExercises.map((exercise) => (
            <motion.div
              key={exercise.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group"
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-44 w-full bg-zinc-950 overflow-hidden">
                  {exercise.imageUrl ? (
                    <img
                      src={exercise.imageUrl}
                      alt={exercise.nameFa}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <ImageIcon className="w-10 h-10" />
                    </div>
                  )}

                  {/* Badges Overlay */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md text-amber-400 border border-amber-500/30 text-[11px] font-bold">
                      {exercise.primaryMuscle || exercise.targetMuscle}
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md text-zinc-300 border border-zinc-700 text-[11px]">
                      {exercise.difficulty || 'متوسط'}
                    </span>
                  </div>

                  {/* Active / Inactive Status */}
                  <div className="absolute bottom-3 left-3">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(exercise)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md flex items-center gap-1 border ${
                        exercise.isActive !== false
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                          : 'bg-red-950/80 text-red-400 border-red-500/40'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${exercise.isActive !== false ? 'bg-emerald-400' : 'bg-red-400'}`} />
                      {exercise.isActive !== false ? 'فعال در اپلیکیشن' : 'غیرفعال'}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-black text-white group-hover:text-amber-400 transition">
                      {exercise.nameFa}
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5" dir="ltr">{exercise.nameEn}</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className="bg-zinc-800/80 px-2.5 py-1 rounded-lg border border-zinc-700/60">
                      تجهیز: {exercise.equipment || 'هالتر'}
                    </span>
                    <span className="bg-zinc-800/80 px-2.5 py-1 rounded-lg border border-zinc-700/60 font-mono">
                      استراحت: {exercise.restSeconds || 90}s
                    </span>
                  </div>

                  {exercise.instructions && exercise.instructions.length > 0 && (
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {exercise.instructions[0]}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Controls */}
              <div className="p-4 bg-zinc-950/60 border-t border-zinc-800/80 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setPreviewExercise(exercise)}
                  className="text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-1.5 transition"
                >
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span>پیش‌نمایش در اپلیکیشن</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(exercise)}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                    title="ویرایش حرکت"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteModal({ isOpen: true, exercise })}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition"
                    title="حذف حرکت"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {editModal.isOpen && editModal.exercise && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditModal({ isOpen: false, exercise: null, isNew: true })}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] flex flex-col overflow-hidden text-right"
              dir="rtl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Dumbbell className="w-6 h-6 text-amber-400" />
                  {editModal.isNew ? 'افزودن حرکت ورزشی جدید' : `ویرایش حرکت: ${editModal.exercise.nameFa}`}
                </h2>
                <button
                  type="button"
                  onClick={() => setEditModal({ isOpen: false, exercise: null, isNew: true })}
                  className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Form Content */}
              <form onSubmit={handleSaveExercise} className="flex-1 overflow-y-auto py-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">نام فارسی حرکت *</label>
                    <input
                      type="text"
                      required
                      value={editModal.exercise.nameFa || ''}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          exercise: { ...editModal.exercise, nameFa: e.target.value },
                        })
                      }
                      placeholder="مثال: پرس سینه هالتر"
                      className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">نام انگلیسی حرکت *</label>
                    <input
                      type="text"
                      required
                      value={editModal.exercise.nameEn || ''}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          exercise: { ...editModal.exercise, nameEn: e.target.value },
                        })
                      }
                      placeholder="Barbell Bench Press"
                      dir="ltr"
                      className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">عضله اصلی</label>
                    <select
                      value={editModal.exercise.primaryMuscle || 'سینه'}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          exercise: { ...editModal.exercise, primaryMuscle: e.target.value, targetMuscle: e.target.value },
                        })
                      }
                      className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none"
                    >
                      <option value="سینه">سینه</option>
                      <option value="پشت و زیربغل">پشت و زیربغل</option>
                      <option value="سرشانه">سرشانه</option>
                      <option value="پا">پا و چهارسر</option>
                      <option value="جلو بازو">جلو بازو</option>
                      <option value="پشت بازو">پشت بازو</option>
                      <option value="شکم">شکم و هسته</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">تجهیزات مورد نیاز</label>
                    <select
                      value={editModal.exercise.equipment || 'هالتر'}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          exercise: { ...editModal.exercise, equipment: e.target.value },
                        })
                      }
                      className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none"
                    >
                      <option value="هالتر">هالتر</option>
                      <option value="دمبل">دمبل</option>
                      <option value="دستگاه">دستگاه</option>
                      <option value="سیم‌کش">سیم‌کش</option>
                      <option value="وزن بدن">وزن بدن</option>
                      <option value="کش تمرینی">کش تمرینی</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">سطح دشواری</label>
                    <select
                      value={editModal.exercise.difficulty || 'متوسط'}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          exercise: { ...editModal.exercise, difficulty: e.target.value as any },
                        })
                      }
                      className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none"
                    >
                      <option value="مبتدی">مبتدی</option>
                      <option value="متوسط">متوسط</option>
                      <option value="پیشرفته">پیشرفته</option>
                    </select>
                  </div>
                </div>

                {/* Image Upload / URL */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">تصویر حرکت</label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white rounded-xl border border-zinc-700 flex items-center gap-2 transition">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>{uploadingImage ? 'در حال آپلود...' : 'آپلود تصویر در Storage'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingImage}
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="url"
                      value={editModal.exercise.imageUrl || ''}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          exercise: { ...editModal.exercise, imageUrl: e.target.value },
                        })
                      }
                      placeholder="یا لینک تصویر را وارد نمایید..."
                      dir="ltr"
                      className="flex-1 p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">مراحل اجرای صحیح (هر خط یک مرحله)</label>
                  <textarea
                    rows={3}
                    value={editModal.exercise.instructions?.join('\n') || ''}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        exercise: {
                          ...editModal.exercise,
                          instructions: e.target.value.split('\n').filter((l) => l.trim()),
                        },
                      })
                    }
                    placeholder="مرحله اول: قرارگیری روی نیمکت&#10;مرحله دوم: گرفتن میله..."
                    className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs leading-relaxed focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Common Mistakes */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">اشتباهات رایج حرکتی (هر خط یک مورد)</label>
                  <textarea
                    rows={2}
                    value={editModal.exercise.commonMistakes?.join('\n') || ''}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        exercise: {
                          ...editModal.exercise,
                          commonMistakes: e.target.value.split('\n').filter((l) => l.trim()),
                        },
                      })
                    }
                    placeholder="بلند کردن باسن از روی میز&#10;حرکت دادن غیرعادی مچ..."
                    className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs leading-relaxed focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditModal({ isOpen: false, exercise: null, isNew: true })}
                    className="px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 text-xs font-medium"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black rounded-xl transition shadow-lg shadow-emerald-500/20"
                  >
                    {isSaving ? 'در حال ذخیره‌سازی...' : 'ذخیره در دیتابیس'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Live Mobile Exercise Preview Modal */}
      <AnimatePresence>
        {previewExercise && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewExercise(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-zinc-950 border-2 border-emerald-500/40 rounded-3xl overflow-hidden shadow-2xl z-10 text-right"
              dir="rtl"
            >
              <div className="relative h-48 bg-zinc-900">
                <img src={previewExercise.imageUrl} alt={previewExercise.nameFa} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPreviewExercise(null)}
                  className="absolute top-3 left-3 p-1.5 rounded-full bg-black/60 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      {previewExercise.primaryMuscle}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {previewExercise.restSeconds}s استراحت
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white">{previewExercise.nameFa}</h3>
                  <p className="text-xs text-zinc-400 font-mono" dir="ltr">{previewExercise.nameEn}</p>
                </div>

                <div className="bg-zinc-900 p-3 rounded-2xl border border-zinc-800 space-y-2 text-xs">
                  <span className="font-bold text-amber-400 block">دستورالعمل اجرا:</span>
                  <ul className="space-y-1 text-zinc-300 list-disc list-inside">
                    {previewExercise.instructions?.slice(0, 3).map((inst, i) => (
                      <li key={i}>{inst}</li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewExercise(null)}
                  className="w-full py-3 bg-emerald-500 text-zinc-950 text-xs font-black rounded-xl"
                >
                  بستن پیش‌نمایش
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Exercise Confirmation Modal */}
      <AdminConfirmationModal
        isOpen={deleteModal.isOpen}
        title="حذف حرکت ورزشی"
        message={`آیا مطمئن هستید که می‌خواهید حرکت «${deleteModal.exercise?.nameFa}» (${deleteModal.exercise?.nameEn}) را حذف نمایید؟ این تغییر در اپلیکیشن موبایل اعمال خواهد شد.`}
        confirmLabel="حذف حرکت"
        isLoading={isSaving}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModal({ isOpen: false, exercise: null })}
      />
    </div>
  );
};
