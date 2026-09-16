import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Copy,
  CheckCircle,
  Clock,
  Dumbbell,
  Layers,
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WorkoutProgram, WorkoutProgramDay, Exercise } from '../../types';
import { AdminRepository } from '../../repositories/AdminRepository';
import { AdminConfirmationModal } from './AdminConfirmationModal';

interface AdminWorkoutProgramsProps {
  programs: WorkoutProgram[];
  exercises: Exercise[];
  onRefresh: () => void;
}

export const AdminWorkoutPrograms: React.FC<AdminWorkoutProgramsProps> = ({
  programs,
  exercises,
  onRefresh,
}) => {
  const [selectedProgram, setSelectedProgram] = useState<WorkoutProgram | null>(null);

  // Edit / Create Modal State
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    program: Partial<WorkoutProgram> | null;
    isNew: boolean;
  }>({
    isOpen: false,
    program: null,
    isNew: true,
  });

  // Delete Confirmation Modal
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    program: WorkoutProgram | null;
  }>({
    isOpen: false,
    program: null,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const handleOpenCreateModal = () => {
    setEditModal({
      isOpen: true,
      isNew: true,
      program: {
        name: 'برنامه تفکیکی ۴ روزه پیشرفته',
        description: 'طراحی شده بر اساس توزیع بهینه بار تمرینی و ریکاوری هفتگی.',
        goal: 'عضله‌سازی (هایپرتروفی)',
        difficulty: 'متوسط',
        daysPerWeek: 4,
        estimatedDuration: 60,
        coverImage: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80',
        status: 'published',
        days: [
          {
            dayNumber: 1,
            titleFa: 'روز اول: سینه و جلو بازو',
            muscleGroupFa: 'سینه و جلو بازو',
            exercises: [
              { exerciseId: 'bench-press', nameFa: 'پرس سینه هالتر', sets: 4, reps: '8-10', restSeconds: 90 },
              { exerciseId: 'incline-dumbbell-press', nameFa: 'پرس بالا سینه دمبل', sets: 3, reps: '10-12', restSeconds: 75 },
            ],
          },
          {
            dayNumber: 2,
            titleFa: 'روز دوم: پا و همسترینگ',
            muscleGroupFa: 'پا',
            exercises: [
              { exerciseId: 'squat', nameFa: 'اسکات پا با هالتر', sets: 4, reps: '8-10', restSeconds: 120 },
              { exerciseId: 'leg-press', nameFa: 'پرس پا با دستگاه', sets: 3, reps: '12', restSeconds: 90 },
            ],
          },
        ],
      },
    });
    setActiveDayIndex(0);
  };

  const handleOpenEditModal = (prog: WorkoutProgram) => {
    setEditModal({
      isOpen: true,
      isNew: false,
      program: { ...prog, days: prog.days || [] },
    });
    setActiveDayIndex(0);
  };

  const handleAddDay = () => {
    const currentDays = editModal.program?.days || [];
    const newDayNumber = currentDays.length + 1;
    const newDay: WorkoutProgramDay = {
      dayNumber: newDayNumber,
      titleFa: `روز ${newDayNumber}: بالاتنه`,
      muscleGroupFa: 'بالاتنه',
      exercises: [],
    };
    setEditModal({
      ...editModal,
      program: {
        ...editModal.program,
        days: [...currentDays, newDay],
        daysPerWeek: newDayNumber,
      },
    });
    setActiveDayIndex(currentDays.length);
  };

  const handleRemoveDay = (index: number) => {
    const currentDays = editModal.program?.days || [];
    const updated = currentDays.filter((_, i) => i !== index).map((d, i) => ({ ...d, dayNumber: i + 1 }));
    setEditModal({
      ...editModal,
      program: {
        ...editModal.program,
        days: updated,
        daysPerWeek: updated.length,
      },
    });
    if (activeDayIndex >= updated.length) {
      setActiveDayIndex(Math.max(0, updated.length - 1));
    }
  };

  const handleAddExerciseToDay = (exerciseId: string) => {
    const ex = exercises.find((e) => e.id === exerciseId);
    if (!ex) return;
    const currentDays = editModal.program?.days || [];
    if (!currentDays[activeDayIndex]) return;

    const currentDay = currentDays[activeDayIndex];
    const updatedExercises = [
      ...(currentDay.exercises || []),
      {
        exerciseId: ex.id,
        nameFa: ex.nameFa,
        sets: 4,
        reps: '10-12',
        restSeconds: ex.restSeconds || 90,
      },
    ];

    const updatedDays = [...currentDays];
    updatedDays[activeDayIndex] = {
      ...currentDay,
      exercises: updatedExercises,
    };

    setEditModal({
      ...editModal,
      program: {
        ...editModal.program,
        days: updatedDays,
      },
    });
  };

  const handleRemoveExerciseFromDay = (exerciseIndex: number) => {
    const currentDays = editModal.program?.days || [];
    if (!currentDays[activeDayIndex]) return;

    const currentDay = currentDays[activeDayIndex];
    const updatedExercises = (currentDay.exercises || []).filter((_, i) => i !== exerciseIndex);

    const updatedDays = [...currentDays];
    updatedDays[activeDayIndex] = {
      ...currentDay,
      exercises: updatedExercises,
    };

    setEditModal({
      ...editModal,
      program: {
        ...editModal.program,
        days: updatedDays,
      },
    });
  };

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal.program?.name) return;

    setIsSaving(true);
    try {
      const fullProg: WorkoutProgram = {
        id: editModal.program.id || `prog_${Date.now()}`,
        name: editModal.program.name,
        description: editModal.program.description || '',
        goal: editModal.program.goal || 'عضله‌سازی',
        difficulty: editModal.program.difficulty || 'متوسط',
        daysPerWeek: editModal.program.days?.length || 4,
        estimatedDuration: Number(editModal.program.estimatedDuration) || 60,
        coverImage: editModal.program.coverImage || 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80',
        status: editModal.program.status || 'published',
        days: editModal.program.days || [],
      };

      await AdminRepository.saveWorkoutProgram(fullProg, editModal.isNew);
      setEditModal({ isOpen: false, program: null, isNew: true });
      onRefresh();
    } catch (e) {
      console.error('Error saving program:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDuplicate = async (prog: WorkoutProgram) => {
    try {
      await AdminRepository.duplicateWorkoutProgram(prog);
      onRefresh();
    } catch (e) {
      console.error('Error duplicating program:', e);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.program) return;
    setIsSaving(true);
    try {
      await AdminRepository.deleteWorkoutProgram(deleteModal.program.id, deleteModal.program.name);
      setDeleteModal({ isOpen: false, program: null });
      onRefresh();
    } catch (e) {
      console.error('Error deleting program:', e);
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
            <Calendar className="w-7 h-7 text-cyan-400" />
            مدیریت برنامه‌های تمرینی (Workout Programs)
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            طراحی سیستم‌های تفکیکی، زمان‌بندی روزها، انتخاب حرکات و بارگذاری در حساب ورزشکاران
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>طراحی برنامه تمرینی جدید</span>
        </button>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {programs.map((prog) => (
          <motion.div
            key={prog.id}
            whileHover={{ y: -3 }}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group"
          >
            <div>
              {/* Cover Banner */}
              <div className="relative h-44 bg-zinc-950">
                <img
                  src={prog.coverImage || 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80'}
                  alt={prog.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md text-cyan-400 border border-cyan-500/30 text-xs font-bold">
                    {prog.goal || 'عضله‌سازی'}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md text-zinc-300 border border-zinc-700 text-xs">
                    {prog.difficulty || 'متوسط'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <h3 className="text-base font-black text-white group-hover:text-cyan-400 transition leading-snug">
                  {prog.name}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {prog.description || 'برنامه تمرینی استاندارد برای رشد و توسعه عضلات'}
                </p>

                <div className="flex items-center gap-3 text-xs text-zinc-400 pt-2 border-t border-zinc-800/80">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    {prog.days?.length || prog.daysPerWeek || 4} روز در هفته
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {prog.estimatedDuration || 55} دقیقه / جلسه
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 bg-zinc-950/60 border-t border-zinc-800/80 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedProgram(prog)}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
              >
                مشاهده روزها و حرکات
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleDuplicate(prog)}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                  title="کپی کردن برنامه"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(prog)}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                  title="ویرایش برنامه"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteModal({ isOpen: true, program: prog })}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400"
                  title="حذف برنامه"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Routine Builder / Edit Modal */}
      <AnimatePresence>
        {editModal.isOpen && editModal.program && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditModal({ isOpen: false, program: null, isNew: true })}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[92vh] flex flex-col overflow-hidden text-right"
              dir="rtl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-cyan-400" />
                  {editModal.isNew ? 'طراحی برنامه تمرینی جدید' : `ویرایش برنامه: ${editModal.program.name}`}
                </h2>
                <button
                  type="button"
                  onClick={() => setEditModal({ isOpen: false, program: null, isNew: true })}
                  className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form & Day-by-Day Builder */}
              <form onSubmit={handleSaveProgram} className="flex-1 overflow-y-auto py-4 space-y-6">
                {/* Basic Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">عنوان برنامه تمرینی *</label>
                    <input
                      type="text"
                      required
                      value={editModal.program.name || ''}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          program: { ...editModal.program, name: e.target.value },
                        })
                      }
                      className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">هدف تمرین</label>
                    <select
                      value={editModal.program.goal || 'عضله‌سازی'}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          program: { ...editModal.program, goal: e.target.value },
                        })
                      }
                      className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="عضله‌سازی (هایپرتروفی)">عضله‌سازی (هایپرتروفی)</option>
                      <option value="چربی‌سوزی و کات">چربی‌سوزی و کات</option>
                      <option value="افزایش قدرت">افزایش قدرت</option>
                      <option value="آمادگی جسمانی">آمادگی جسمانی</option>
                    </select>
                  </div>
                </div>

                {/* Days Tabs */}
                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-300">روزهای تمرینی و چیدمان حرکات:</span>
                    <button
                      type="button"
                      onClick={handleAddDay}
                      className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>افزودن روز تمرینی</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {editModal.program.days?.map((day, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveDayIndex(idx)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                          activeDayIndex === idx
                            ? 'bg-cyan-600 text-white'
                            : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800'
                        }`}
                      >
                        <span>{day.titleFa || `روز ${idx + 1}`}</span>
                        {editModal.program!.days!.length > 1 && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveDay(idx);
                            }}
                            className="text-zinc-300 hover:text-red-300 text-sm"
                          >
                            ×
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Active Day Exercises List */}
                  {editModal.program.days && editModal.program.days[activeDayIndex] && (
                    <div className="space-y-4 pt-2 border-t border-zinc-800/80">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-zinc-400 mb-1">عنوان این روز:</label>
                          <input
                            type="text"
                            value={editModal.program.days[activeDayIndex].titleFa}
                            onChange={(e) => {
                              const updatedDays = [...editModal.program!.days!];
                              updatedDays[activeDayIndex].titleFa = e.target.value;
                              setEditModal({
                                ...editModal,
                                program: { ...editModal.program, days: updatedDays },
                              });
                            }}
                            className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-zinc-400 mb-1">گروه عضلانی هدف:</label>
                          <input
                            type="text"
                            value={editModal.program.days[activeDayIndex].muscleGroupFa}
                            onChange={(e) => {
                              const updatedDays = [...editModal.program!.days!];
                              updatedDays[activeDayIndex].muscleGroupFa = e.target.value;
                              setEditModal({
                                ...editModal,
                                program: { ...editModal.program, days: updatedDays },
                              });
                            }}
                            className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs"
                          />
                        </div>
                      </div>

                      {/* Add Exercise Selector */}
                      <div className="flex items-center gap-3">
                        <select
                          id="exercise-picker"
                          className="flex-1 p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:border-cyan-500"
                        >
                          <option value="">انتخاب حرکت از بانک حرکات...</option>
                          {exercises.map((ex) => (
                            <option key={ex.id} value={ex.id}>
                              {ex.nameFa} ({ex.primaryMuscle || ex.targetMuscle})
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const selectEl = document.getElementById('exercise-picker') as HTMLSelectElement;
                            if (selectEl?.value) {
                              handleAddExerciseToDay(selectEl.value);
                              selectEl.value = '';
                            }
                          }}
                          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>افزودن حرکت</span>
                        </button>
                      </div>

                      {/* Current Exercises in Day */}
                      <div className="space-y-2">
                        {editModal.program.days[activeDayIndex].exercises.map((ex, exIdx) => (
                          <div
                            key={exIdx}
                            className="p-3 bg-zinc-900 border border-zinc-800/80 rounded-xl flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-lg bg-zinc-800 text-cyan-400 font-black flex items-center justify-center text-xs">
                                {exIdx + 1}
                              </span>
                              <span className="font-bold text-white">{ex.nameFa}</span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-zinc-400">{ex.sets} ست × {ex.reps} تکرار</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveExerciseFromDay(exIdx)}
                                className="p-1 text-zinc-500 hover:text-red-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit */}
                <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditModal({ isOpen: false, program: null, isNew: true })}
                    className="px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 text-xs"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black rounded-xl"
                  >
                    {isSaving ? 'در حال ذخیره‌سازی...' : 'ذخیره برنامه تمرینی'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AdminConfirmationModal
        isOpen={deleteModal.isOpen}
        title="حذف برنامه تمرینی"
        message={`آیا مطمئن هستید که می‌خواهید برنامه تمرینی «${deleteModal.program?.name}» را حذف نمایید؟`}
        confirmLabel="حذف برنامه"
        isLoading={isSaving}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModal({ isOpen: false, program: null })}
      />
    </div>
  );
};
