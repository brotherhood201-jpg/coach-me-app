import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Layers,
  Dumbbell,
  FileText,
  Apple,
  X,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ContentCategory } from '../../types';
import { AdminRepository } from '../../repositories/AdminRepository';
import { AdminConfirmationModal } from './AdminConfirmationModal';

interface AdminCategoriesProps {
  categories: ContentCategory[];
  onRefresh: () => void;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({
  categories,
  onRefresh,
}) => {
  const [selectedType, setSelectedType] = useState<'all' | 'exercise' | 'article' | 'video' | 'nutrition'>('all');
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    category: Partial<ContentCategory> | null;
    isNew: boolean;
  }>({
    isOpen: false,
    category: null,
    isNew: true,
  });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    category: ContentCategory | null;
  }>({
    isOpen: false,
    category: null,
  });

  const [isSaving, setIsSaving] = useState(false);

  const filteredCategories = categories.filter(
    (c) => selectedType === 'all' || c.type === selectedType
  );

  const handleOpenCreate = () => {
    setEditModal({
      isOpen: true,
      isNew: true,
      category: {
        nameFa: '',
        nameEn: '',
        type: 'exercise',
        sortOrder: 1,
        active: true,
      },
    });
  };

  const handleOpenEdit = (cat: ContentCategory) => {
    setEditModal({
      isOpen: true,
      isNew: false,
      category: { ...cat },
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal.category?.nameFa) return;

    setIsSaving(true);
    try {
      const payload: ContentCategory = {
        id: editModal.category.id || `cat_${Date.now()}`,
        nameFa: editModal.category.nameFa,
        nameEn: editModal.category.nameEn || '',
        type: editModal.category.type || 'exercise',
        sortOrder: Number(editModal.category.sortOrder) || 1,
        active: editModal.category.active !== undefined ? editModal.category.active : true,
      };

      await AdminRepository.saveCategory(payload, editModal.isNew);
      setEditModal({ isOpen: false, category: null, isNew: true });
      onRefresh();
    } catch (e) {
      console.error('Error saving category:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.category) return;
    setIsSaving(true);
    try {
      await AdminRepository.deleteCategory(deleteModal.category.id, deleteModal.category.nameFa);
      setDeleteModal({ isOpen: false, category: null });
      onRefresh();
    } catch (e) {
      console.error('Error deleting category:', e);
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
            <Tag className="w-7 h-7 text-emerald-400" />
            مدیریت دسته‌بندی‌ها و ساختار محتوا (Categories)
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            تعریف عضلات هدف، دسته‌های مقالات، منابع غذایی و ویدیوهای آموزشی در اپلیکیشن
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن دسته‌بندی جدید</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 w-fit text-xs font-bold overflow-x-auto">
        <button
          type="button"
          onClick={() => setSelectedType('all')}
          className={`px-4 py-2 rounded-xl transition ${selectedType === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
        >
          همه ({categories.length})
        </button>
        <button
          type="button"
          onClick={() => setSelectedType('exercise')}
          className={`px-4 py-2 rounded-xl transition ${selectedType === 'exercise' ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-400'}`}
        >
          حرکات ورزشی
        </button>
        <button
          type="button"
          onClick={() => setSelectedType('article')}
          className={`px-4 py-2 rounded-xl transition ${selectedType === 'article' ? 'bg-zinc-800 text-blue-400' : 'text-zinc-400'}`}
        >
          مقالات
        </button>
        <button
          type="button"
          onClick={() => setSelectedType('video')}
          className={`px-4 py-2 rounded-xl transition ${selectedType === 'video' ? 'bg-zinc-800 text-rose-400' : 'text-zinc-400'}`}
        >
          ویدیوها
        </button>
        <button
          type="button"
          onClick={() => setSelectedType('nutrition')}
          className={`px-4 py-2 rounded-xl transition ${selectedType === 'nutrition' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-400'}`}
        >
          بانک تغذیه
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCategories.map((cat) => (
          <motion.div
            key={cat.id}
            whileHover={{ y: -2 }}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shadow-lg border border-emerald-500/20">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">{cat.nameFa}</h3>
                {cat.nameEn && <p className="text-xs text-zinc-400 font-mono mt-0.5" dir="ltr">{cat.nameEn}</p>}
                <span className="inline-block mt-1 text-[11px] text-zinc-500 font-mono">
                  ترتیب: {cat.sortOrder} | {cat.active ? 'فعال' : 'غیرفعال'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleOpenEdit(cat)}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeleteModal({ isOpen: true, category: cat })}
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
        {editModal.isOpen && editModal.category && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditModal({ isOpen: false, category: null, isNew: true })}
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
                  <Tag className="w-6 h-6 text-emerald-400" />
                  {editModal.isNew ? 'افزودن دسته‌بندی جدید' : `ویرایش: ${editModal.category.nameFa}`}
                </h2>
                <button
                  type="button"
                  onClick={() => setEditModal({ isOpen: false, category: null, isNew: true })}
                  className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="py-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">نام فارسی دسته *</label>
                  <input
                    type="text"
                    required
                    value={editModal.category.nameFa || ''}
                    onChange={(e) =>
                      setEditModal({ ...editModal, category: { ...editModal.category, nameFa: e.target.value } })
                    }
                    className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">نام انگلیسی دسته</label>
                  <input
                    type="text"
                    value={editModal.category.nameEn || ''}
                    onChange={(e) =>
                      setEditModal({ ...editModal, category: { ...editModal.category, nameEn: e.target.value } })
                    }
                    dir="ltr"
                    className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">نوع دسته‌بندی</label>
                    <select
                      value={editModal.category.type || 'exercise'}
                      onChange={(e) =>
                        setEditModal({ ...editModal, category: { ...editModal.category, type: e.target.value as any } })
                      }
                      className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs"
                    >
                      <option value="exercise">حرکات ورزشی</option>
                      <option value="article">مقالات علمی</option>
                      <option value="video">ویدیوهای آموزشی</option>
                      <option value="nutrition">بانک تغذیه</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">ترتیب اولویت نمایش</label>
                    <input
                      type="number"
                      value={editModal.category.sortOrder || 1}
                      onChange={(e) =>
                        setEditModal({ ...editModal, category: { ...editModal.category, sortOrder: Number(e.target.value) } })
                      }
                      className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditModal({ isOpen: false, category: null, isNew: true })}
                    className="px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 text-xs"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black rounded-xl"
                  >
                    {isSaving ? 'در حال ذخیره‌سازی...' : 'ذخیره دسته‌بندی'}
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
        title="حذف دسته‌بندی"
        message={`آیا مطمئن هستید که می‌خواهید دسته‌بندی «${deleteModal.category?.nameFa}» را حذف نمایید؟`}
        confirmLabel="حذف دسته"
        isLoading={isSaving}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModal({ isOpen: false, category: null })}
      />
    </div>
  );
};
