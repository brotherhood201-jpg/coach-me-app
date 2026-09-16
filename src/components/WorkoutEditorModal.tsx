import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Dumbbell, Clock, Flame, Save, Check } from 'lucide-react';
import { WorkoutSession, Exercise } from '../types';
import { COMPREHENSIVE_EXERCISE_LIBRARY } from '../data/workoutData';
import { toPersianDigits } from '../utils/persian';

interface WorkoutEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialWorkout: WorkoutSession;
  onSave: (updatedWorkout: WorkoutSession) => void;
}

export const WorkoutEditorModal: React.FC<WorkoutEditorModalProps> = ({
  isOpen,
  onClose,
  initialWorkout,
  onSave,
}) => {
  const [title, setTitle] = useState(initialWorkout.titleFa);
  const [muscleGroups, setMuscleGroups] = useState(initialWorkout.muscleGroupsFa);
  const [estimatedMinutes, setEstimatedMinutes] = useState(initialWorkout.estimatedMinutes.toString());
  const [targetCalories, setTargetCalories] = useState(initialWorkout.targetCalories.toString());
  const [intensity, setIntensity] = useState(initialWorkout.intensity);
  const [exercises, setExercises] = useState<Exercise[]>(initialWorkout.exercises);
  const [isAddingExercise, setIsAddingExercise] = useState(false);

  if (!isOpen) return null;

  const handleAddExercise = (exercise: Exercise) => {
    // Clone with fresh sets
    const cloned: Exercise = {
      ...exercise,
      id: `ex_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      sets: [
        { id: 1, setNumber: 1, targetReps: '12', targetWeightKg: 50, completed: false },
        { id: 2, setNumber: 2, targetReps: '10', targetWeightKg: 60, completed: false },
        { id: 3, setNumber: 3, targetReps: '8', targetWeightKg: 70, completed: false },
      ],
    };
    setExercises((prev) => [...prev, cloned]);
    setIsAddingExercise(false);
  };

  const handleRemoveExercise = (idx: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddSet = (exerciseIdx: number) => {
    setExercises((prev) => {
      const updated = [...prev];
      const targetEx = { ...updated[exerciseIdx] };
      const nextSetNumber = targetEx.sets.length + 1;
      const lastSet = targetEx.sets[targetEx.sets.length - 1];
      targetEx.sets = [
        ...targetEx.sets,
        {
          id: nextSetNumber,
          setNumber: nextSetNumber,
          targetReps: lastSet ? lastSet.targetReps : '10',
          targetWeightKg: lastSet ? lastSet.targetWeightKg : 50,
          completed: false,
        },
      ];
      updated[exerciseIdx] = targetEx;
      return updated;
    });
  };

  const handleRemoveSet = (exerciseIdx: number, setIdx: number) => {
    setExercises((prev) => {
      const updated = [...prev];
      const targetEx = { ...updated[exerciseIdx] };
      if (targetEx.sets.length > 1) {
        targetEx.sets = targetEx.sets.filter((_, i) => i !== setIdx);
        targetEx.sets.forEach((s, i) => (s.setNumber = i + 1));
        updated[exerciseIdx] = targetEx;
      }
      return updated;
    });
  };

  const handleSetChange = (exerciseIdx: number, setIdx: number, field: 'targetWeightKg' | 'targetReps', value: any) => {
    setExercises((prev) => {
      const updated = [...prev];
      const targetEx = { ...updated[exerciseIdx] };
      const updatedSets = [...targetEx.sets];
      updatedSets[setIdx] = {
        ...updatedSets[setIdx],
        [field]: value,
      };
      targetEx.sets = updatedSets;
      updated[exerciseIdx] = targetEx;
      return updated;
    });
  };

  const handleSave = () => {
    const updated: WorkoutSession = {
      ...initialWorkout,
      titleFa: title.trim() || 'تمرین سفارشی',
      muscleGroupsFa: muscleGroups.trim() || 'سینه و عضلات کمکی',
      estimatedMinutes: parseInt(estimatedMinutes) || 45,
      targetCalories: parseInt(targetCalories) || 400,
      intensity,
      totalExercises: exercises.length,
      exercises,
    };
    onSave(updated);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 font-['Vazirmatn',system-ui,sans-serif]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] bg-[#0c0c0c] border border-white/10 rounded-[36px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden z-10 text-right backdrop-blur-2xl"
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-zinc-950/80 sticky top-0 z-10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-600/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">ویرایش و شخصی‌سازی برنامه تمرین</h3>
                <p className="text-xs text-zinc-400">تنظیم حرکات، ست‌ها، وزنه‌ها و زمان استراحت</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-white/[0.05] text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* General Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 block">عنوان تمرین</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-sm text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 block">عضلات هدف</label>
                <input
                  type="text"
                  value={muscleGroups}
                  onChange={(e) => setMuscleGroups(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-sm text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 block">مدت تخمینی (دقیقه)</label>
                <input
                  type="number"
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-sm text-white font-mono focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 block">شدت تمرین</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['سبک', 'متوسط', 'سنگین', 'حرفه‌ای'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setIntensity(lvl)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        intensity === lvl
                          ? 'bg-orange-600 text-white border-orange-500'
                          : 'bg-white/[0.02] border-white/5 text-zinc-400'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Exercises List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <span>حرکات ورزشی ({toPersianDigits(exercises.length)} حرکت)</span>
                </h4>

                <button
                  type="button"
                  onClick={() => setIsAddingExercise(true)}
                  className="px-3.5 py-2 rounded-xl bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن حرکت از کتابخانه</span>
                </button>
              </div>

              {/* Add Exercise Modal / Selector Drawer */}
              {isAddingExercise && (
                <div className="p-4 rounded-3xl bg-white/[0.03] border border-orange-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-400">انتخاب حرکت از کتابخانه جامع</span>
                    <button
                      onClick={() => setIsAddingExercise(false)}
                      className="text-xs text-zinc-400 hover:text-white"
                    >
                      بستن
                    </button>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {COMPREHENSIVE_EXERCISE_LIBRARY.map((ex) => (
                      <div
                        key={ex.id}
                        onClick={() => handleAddExercise(ex)}
                        className="p-3 rounded-2xl bg-white/[0.02] hover:bg-orange-600/10 hover:border-orange-500/30 border border-white/5 flex items-center justify-between cursor-pointer transition-all"
                      >
                        <div>
                          <span className="text-xs font-bold text-white block">{ex.nameFa}</span>
                          <span className="text-[10px] text-zinc-400">{ex.targetMuscle}</span>
                        </div>
                        <Plus className="w-4 h-4 text-orange-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exercise Items */}
              <div className="space-y-4">
                {exercises.map((ex, exIdx) => (
                  <div
                    key={ex.id || exIdx}
                    className="p-4 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-orange-600/20 text-orange-400 text-xs font-mono font-bold flex items-center justify-center">
                          {toPersianDigits(exIdx + 1)}
                        </span>
                        <div>
                          <h5 className="text-sm font-bold text-white">{ex.nameFa}</h5>
                          <span className="text-[11px] text-zinc-500">{ex.targetMuscle}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveExercise(exIdx)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                        title="حذف حرکت"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Sets Editor */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <div className="grid grid-cols-4 gap-2 text-[10px] text-zinc-500 font-bold text-center">
                        <span>ست</span>
                        <span>تکرار</span>
                        <span>وزنه (kg)</span>
                        <span>عملیات</span>
                      </div>

                      {ex.sets.map((s, sIdx) => (
                        <div key={sIdx} className="grid grid-cols-4 gap-2 items-center text-center">
                          <span className="text-xs font-mono text-zinc-400">ست {toPersianDigits(sIdx + 1)}</span>
                          <input
                            type="text"
                            value={s.targetReps}
                            onChange={(e) => handleSetChange(exIdx, sIdx, 'targetReps', e.target.value)}
                            className="px-2 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white text-center font-mono focus:border-orange-500 focus:outline-none"
                          />
                          <input
                            type="number"
                            value={s.targetWeightKg}
                            onChange={(e) =>
                              handleSetChange(exIdx, sIdx, 'targetWeightKg', parseFloat(e.target.value) || 0)
                            }
                            className="px-2 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white text-center font-mono focus:border-orange-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSet(exIdx, sIdx)}
                            className="p-1 rounded-lg text-zinc-500 hover:text-red-400 text-xs transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => handleAddSet(exIdx)}
                        className="w-full py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] text-[11px] font-bold text-zinc-400 hover:text-white border border-white/5 transition-all cursor-pointer flex items-center justify-center gap-1 mt-2"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>افزودن ست جدید</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Save */}
          <div className="p-5 border-t border-white/5 bg-zinc-950/80 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-2xl bg-white/[0.03] text-zinc-400 hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              انصراف
            </button>

            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all cursor-pointer border border-orange-400/30"
            >
              <Save className="w-4 h-4" />
              <span>ذخیره تغییرات برنامه</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
