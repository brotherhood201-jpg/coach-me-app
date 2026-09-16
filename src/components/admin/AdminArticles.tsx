import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Upload,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  X,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ArticleItem } from '../../types';
import { AdminRepository } from '../../repositories/AdminRepository';
import { StorageService } from '../../services/StorageService';
import { AdminConfirmationModal } from './AdminConfirmationModal';

interface AdminArticlesProps {
  articles: ArticleItem[];
  onRefresh: () => void;
}

export const AdminArticles: React.FC<AdminArticlesProps> = ({ articles, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Edit / Create Modal State
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    article: Partial<ArticleItem> | null;
    isNew: boolean;
  }>({
    isOpen: false,
    article: null,
    isNew: true,
  });

  // Preview Modal
  const [previewArticle, setPreviewArticle] = useState<ArticleItem | null>(null);

  // Delete Confirmation
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    article: ArticleItem | null;
  }>({
    isOpen: false,
    article: null,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState<'editor' | 'preview'>('editor');

  const filteredArticles = articles.filter((art) => {
    const matchSearch =
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (art.summary && art.summary.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCat = selectedCategory === 'all' || art.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleOpenCreate = () => {
    setEditModal({
      isOpen: true,
      isNew: true,
      article: {
        title: '',
        summary: '',
        content: `## مقدمه\n\nنکات علمی برای افزایش بازدهی تمرین...\n\n### ۱. متغیرهای کلیدی\n- بار تمرینی بهینه\n- زمان استراحت کافی\n\n### ۲. توصیه مربی\nهمواره به ریکاوری توجه کنید.`,
        category: 'تمرین',
        readingTime: 4,
        coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80',
        published: true,
        status: 'published',
      },
    });
    setActiveEditorTab('editor');
  };

  const handleOpenEdit = (art: ArticleItem) => {
    setEditModal({
      isOpen: true,
      isNew: false,
      article: { ...art },
    });
    setActiveEditorTab('editor');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await StorageService.uploadFile(file, 'articles');
      setEditModal((prev) => ({
        ...prev,
        article: { ...prev.article, coverImage: res.downloadUrl },
      }));
    } catch (err) {
      console.error('Error uploading article cover:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal.article?.title) return;

    setIsSaving(true);
    try {
      const payload: ArticleItem = {
        id: editModal.article.id || `art_${Date.now()}`,
        title: editModal.article.title,
        summary: editModal.article.summary || '',
        content: editModal.article.content || '',
        category: editModal.article.category || 'تمرین',
        readingTime: Number(editModal.article.readingTime) || 4,
        coverImage: editModal.article.coverImage || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80',
        published: editModal.article.published ?? true,
        status: editModal.article.published ? 'published' : 'draft',
        createdAt: editModal.article.createdAt || new Date().toISOString(),
      };

      await AdminRepository.saveArticle(payload, editModal.isNew);
      setEditModal({ isOpen: false, article: null, isNew: true });
      onRefresh();
    } catch (e) {
      console.error('Error saving article:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.article) return;
    setIsSaving(true);
    try {
      await AdminRepository.deleteArticle(deleteModal.article.id, deleteModal.article.title);
      setDeleteModal({ isOpen: false, article: null });
      onRefresh();
    } catch (e) {
      console.error('Error deleting article:', e);
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
            <FileText className="w-7 h-7 text-blue-400" />
            مدیریت مقالات و وبلاگ بدنسازی
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            نگارش مقالات علمی، هایپرتروفی، راهنماهای رژیم غذایی و انتشار زنده در اپلیکیشن
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>نگارش مقاله جدید</span>
        </button>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArticles.map((art) => (
          <motion.div
            key={art.id}
            whileHover={{ y: -3 }}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group"
          >
            <div>
              {/* Image Banner */}
              <div className="relative h-44 bg-zinc-950">
                <img
                  src={art.coverImage || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80'}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md text-blue-400 border border-blue-500/30 text-xs font-bold">
                    {art.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md text-zinc-300 border border-zinc-700 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {art.readingTime} دقیقه
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <h3 className="text-base font-black text-white group-hover:text-blue-400 transition leading-snug">
                  {art.title}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {art.summary || art.content.slice(0, 100)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-zinc-950/60 border-t border-zinc-800/80 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPreviewArticle(art)}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <Eye className="w-4 h-4" />
                <span>مشاهده متن کامل</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(art)}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                  title="ویرایش مقاله"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteModal({ isOpen: true, article: art })}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400"
                  title="حذف مقاله"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add / Edit Article Modal */}
      <AnimatePresence>
        {editModal.isOpen && editModal.article && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditModal({ isOpen: false, article: null, isNew: true })}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[92vh] flex flex-col overflow-hidden text-right"
              dir="rtl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-400" />
                  {editModal.isNew ? 'نگارش مقاله جدید' : `ویرایش مقاله: ${editModal.article.title}`}
                </h2>
                <button
                  type="button"
                  onClick={() => setEditModal({ isOpen: false, article: null, isNew: true })}
                  className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveArticle} className="flex-1 overflow-y-auto py-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">عنوان مقاله *</label>
                  <input
                    type="text"
                    required
                    value={editModal.article.title || ''}
                    onChange={(e) =>
                      setEditModal({
                        ...editModal,
                        article: { ...editModal.article, title: e.target.value },
                      })
                    }
                    className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">دسته‌بندی</label>
                    <select
                      value={editModal.article.category || 'تمرین'}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          article: { ...editModal.article, category: e.target.value },
                        })
                      }
                      className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:border-blue-500 focus:outline-none"
                    >
                      <option value="تمرین">آموزش تمرین و هایپرتروفی</option>
                      <option value="تغذیه">تغذیه و مکمل‌ها</option>
                      <option value="ریکاوری">ریکاوری و خواب</option>
                      <option value="انگیزه">انگیزش و ذهنیت</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">مدت زمان مطالعه (دقیقه)</label>
                    <input
                      type="number"
                      value={editModal.article.readingTime || 4}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          article: { ...editModal.article, readingTime: Number(e.target.value) },
                        })
                      }
                      className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Cover Image */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">تصویر کاور مقاله</label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white rounded-xl border border-zinc-700 flex items-center gap-2 transition">
                      <Upload className="w-4 h-4 text-blue-400" />
                      <span>{uploadingImage ? 'در حال آپلود...' : 'آپلود در Storage'}</span>
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
                      value={editModal.article.coverImage || ''}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          article: { ...editModal.article, coverImage: e.target.value },
                        })
                      }
                      placeholder="لینک تصویر کاور..."
                      dir="ltr"
                      className="flex-1 p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs"
                    />
                  </div>
                </div>

                {/* Content Editor */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-zinc-300">متن مقاله (پشتیبانی از Markdown)</label>
                    <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setActiveEditorTab('editor')}
                        className={`px-3 py-1 text-xs rounded-md ${activeEditorTab === 'editor' ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}
                      >
                        ویرایشگر
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveEditorTab('preview')}
                        className={`px-3 py-1 text-xs rounded-md ${activeEditorTab === 'preview' ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}
                      >
                        پیش‌نمایش
                      </button>
                    </div>
                  </div>

                  {activeEditorTab === 'editor' ? (
                    <textarea
                      rows={10}
                      value={editModal.article.content || ''}
                      onChange={(e) =>
                        setEditModal({
                          ...editModal,
                          article: { ...editModal.article, content: e.target.value },
                        })
                      }
                      className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs leading-relaxed font-mono focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl min-h-[240px] text-zinc-200 text-xs leading-relaxed whitespace-pre-line">
                      {editModal.article.content}
                    </div>
                  )}
                </div>

                {/* Submit Actions */}
                <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditModal({ isOpen: false, article: null, isNew: true })}
                    className="px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 text-xs"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black rounded-xl"
                  >
                    {isSaving ? 'در حال ذخیره‌سازی...' : 'انتشار مقاله در اپلیکیشن'}
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
        title="حذف مقاله"
        message={`آیا مطمئن هستید که می‌خواهید مقاله «${deleteModal.article?.title}» را حذف نمایید؟`}
        confirmLabel="حذف مقاله"
        isLoading={isSaving}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModal({ isOpen: false, article: null })}
      />
    </div>
  );
};
