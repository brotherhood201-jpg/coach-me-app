import React, { useState } from 'react';
import {
  Apple,
  Plus,
  Edit2,
  Trash2,
  Search,
  Scale,
  Flame,
  X,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FoodItem } from '../../types';
import { AdminRepository } from '../../repositories/AdminRepository';
import { AdminConfirmationModal } from './AdminConfirmationModal';

interface AdminNutritionProps {
  foods: FoodItem[];
  onRefresh: () => void;
}

export const AdminNutrition: React.FC<AdminNutritionProps> = ({ foods, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    food: Partial<FoodItem> | null;
    isNew: boolean;
  }>({
    isOpen: false,
    food: null,
    isNew: true,
  });

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; food: FoodItem | null }>({
    isOpen: false,
    food: null,
  });

  const [isSaving, setIsSaving] = useState(false);

  const filteredFoods = foods.filter((f) => {
    const matchSearch =
      f.nameFa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === 'all' || f.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleOpenCreate = () => {
    setEditModal({
      isOpen: true,
      isNew: true,
      food: {
        nameFa: '',
        nameEn: '',
        category: 'منابع پروتئینی',
        servingSize: '۱۰۰ گرم',
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
      },
    });
  };

  const handleOpenEdit = (f: FoodItem) => {
    setEditModal({
      isOpen: true,
      isNew: false,
      food: { ...f },
    });
  };

  const handleSaveFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal.food?.nameFa) return;

    setIsSaving(true);
    try {
      const payload: FoodItem = {
        id: editModal.food.id || `food_${Date.now()}`,
        nameFa: editModal.food.nameFa,
        nameEn: editModal.food.nameEn || '',
        category: editModal.food.category || 'منابع پروتئینی',
        servingSize: editModal.food.servingSize || '۱۰۰ گرم',
        calories: Number(editModal.food.calories) || 0,
        protein: Number(editModal.food.protein) || 0,
        carbs: Number(editModal.food.carbs) || 0,
        fat: Number(editModal.food.fat) || 0,
      };

      await AdminRepository.saveFood(payload, editModal.isNew);
      setEditModal({ isOpen: false, food: null, isNew: true });
      onRefresh();
    } catch (e) {
      console.error('Error saving food item:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.food) return;
    setIsSaving(true);
    try {
      await AdminRepository.deleteFood(deleteModal.food.id, deleteModal.food.nameFa);
      setDeleteModal({ isOpen: false, food: null });
      onRefresh();
    } catch (e) {
      console.error('Error deleting food item:', e);
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
            <Apple className="w-7 h-7 text-emerald-400" />
            بانک اطلاعات تغذیه و ارزش غذایی (Nutrition)
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            مدیریت درشت‌مغذی‌ها (کالری، پروتئین، کربوهیدرات و چربی) برای ثبت در وعده‌های روزانه ورزشکاران
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن ماده غذایی</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجوی نام ماده غذایی (سینه مرغ، جو دوسر، برنج...)"
            className="w-full pl-4 pr-12 py-3 bg-zinc-950 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-2xl px-4 py-3 focus:border-emerald-500 w-full md:w-auto"
        >
          <option value="all">همه دسته‌بندی‌های غذایی</option>
          <option value="منابع پروتئینی">منابع پروتئینی</option>
          <option value="کربوهیدرات و غلات">کربوهیدرات و غلات</option>
          <option value="چربی‌های مفید و مغزها">چربی‌های مفید و مغزها</option>
          <option value="مکمل‌های ورزشی">مکمل‌های ورزشی</option>
          <option value="میوه‌ها و سبزیجات">میوه‌ها و سبزیجات</option>
        </select>
      </div>

      {/* Food Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-zinc-950/80 text-zinc-400 text-xs font-bold border-b border-zinc-800">
              <tr>
                <th className="py-4 px-6">ماده غذایی</th>
                <th className="py-4 px-4">دسته‌بندی</th>
                <th className="py-4 px-4">واحد سنجش</th>
                <th className="py-4 px-4 text-emerald-400">کالری (Kcal)</th>
                <th className="py-4 px-4 text-blue-400">پروتئین (g)</th>
                <th className="py-4 px-4 text-amber-400">کربوهیدرات (g)</th>
                <th className="py-4 px-4 text-rose-400">چربی (g)</th>
                <th className="py-4 px-6 text-left">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredFoods.map((f) => (
                <tr key={f.id} className="hover:bg-zinc-800/40 transition">
                  <td className="py-4 px-6">
                    <div className="font-bold text-white text-sm">{f.nameFa}</div>
                    <div className="text-xs text-zinc-500 font-mono mt-0.5" dir="ltr">{f.nameEn}</div>
                  </td>
                  <td className="py-4 px-4 text-xs text-zinc-300">{f.category}</td>
                  <td className="py-4 px-4 text-xs text-zinc-400 font-mono">{f.servingSize}</td>
                  <td className="py-4 px-4 font-mono font-bold text-emerald-400">{f.calories}</td>
                  <td className="py-4 px-4 font-mono font-bold text-blue-400">{f.protein}g</td>
                  <td className="py-4 px-4 font-mono font-bold text-amber-400">{f.carbs}g</td>
                  <td className="py-4 px-4 font-mono font-bold text-rose-400">{f.fat}g</td>
                  <td className="py-4 px-6 text-left">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(f)}
                        className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteModal({ isOpen: true, food: f })}
                        className="p-2 rounded-xl bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400"
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
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editModal.isOpen && editModal.food && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditModal({ isOpen: false, food: null, isNew: true })}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-right"
              dir="rtl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Apple className="w-6 h-6 text-emerald-400" />
                  {editModal.isNew ? 'افزودن ماده غذایی جدید' : `ویرایش: ${editModal.food.nameFa}`}
                </h2>
                <button
                  type="button"
                  onClick={() => setEditModal({ isOpen: false, food: null, isNew: true })}
                  className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveFood} className="py-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">نام فارسی *</label>
                    <input
                      type="text"
                      required
                      value={editModal.food.nameFa || ''}
                      onChange={(e) => setEditModal({ ...editModal, food: { ...editModal.food, nameFa: e.target.value } })}
                      className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">نام انگلیسی</label>
                    <input
                      type="text"
                      value={editModal.food.nameEn || ''}
                      onChange={(e) => setEditModal({ ...editModal, food: { ...editModal.food, nameEn: e.target.value } })}
                      dir="ltr"
                      className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">دسته‌بندی</label>
                    <select
                      value={editModal.food.category || 'منابع پروتئینی'}
                      onChange={(e) => setEditModal({ ...editModal, food: { ...editModal.food, category: e.target.value } })}
                      className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs"
                    >
                      <option value="منابع پروتئینی">منابع پروتئینی</option>
                      <option value="کربوهیدرات و غلات">کربوهیدرات و غلات</option>
                      <option value="چربی‌های مفید و مغزها">چربی‌های مفید و مغزها</option>
                      <option value="مکمل‌های ورزشی">مکمل‌های ورزشی</option>
                      <option value="میوه‌ها و سبزیجات">میوه‌ها و سبزیجات</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">واحد سنجش</label>
                    <input
                      type="text"
                      value={editModal.food.servingSize || '۱۰۰ گرم'}
                      onChange={(e) => setEditModal({ ...editModal, food: { ...editModal.food, servingSize: e.target.value } })}
                      className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs"
                    />
                  </div>
                </div>

                {/* Macros Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-400 mb-1">کالری (Kcal)</label>
                    <input
                      type="number"
                      value={editModal.food.calories || 0}
                      onChange={(e) => setEditModal({ ...editModal, food: { ...editModal.food, calories: Number(e.target.value) } })}
                      className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-blue-400 mb-1">پروتئین (گرم)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editModal.food.protein || 0}
                      onChange={(e) => setEditModal({ ...editModal, food: { ...editModal.food, protein: Number(e.target.value) } })}
                      className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-amber-400 mb-1">کربوهیدرات (گرم)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editModal.food.carbs || 0}
                      onChange={(e) => setEditModal({ ...editModal, food: { ...editModal.food, carbs: Number(e.target.value) } })}
                      className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-rose-400 mb-1">چربی (گرم)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editModal.food.fat || 0}
                      onChange={(e) => setEditModal({ ...editModal, food: { ...editModal.food, fat: Number(e.target.value) } })}
                      className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditModal({ isOpen: false, food: null, isNew: true })}
                    className="px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 text-xs"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black rounded-xl"
                  >
                    {isSaving ? 'در حال ذخیره‌سازی...' : 'ذخیره در بانک تغذیه'}
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
        title="حذف ماده غذایی"
        message={`آیا مطمئن هستید که می‌خواهید «${deleteModal.food?.nameFa}» را از بانک اطلاعات تغذیه حذف کنید؟`}
        confirmLabel="حذف ماده غذایی"
        isLoading={isSaving}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModal({ isOpen: false, food: null })}
      />
    </div>
  );
};
