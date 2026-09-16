import React, { useState } from 'react';
import {
  Video,
  Plus,
  Edit2,
  Trash2,
  Play,
  Upload,
  Clock,
  CheckCircle,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VideoItem } from '../../types';
import { AdminRepository } from '../../repositories/AdminRepository';
import { StorageService } from '../../services/StorageService';
import { AdminConfirmationModal } from './AdminConfirmationModal';

interface AdminVideosProps {
  videos: VideoItem[];
  onRefresh: () => void;
}

export const AdminVideos: React.FC<AdminVideosProps> = ({ videos, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    video: Partial<VideoItem> | null;
    isNew: boolean;
  }>({
    isOpen: false,
    video: null,
    isNew: true,
  });

  const [previewVideo, setPreviewVideo] = useState<VideoItem | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; video: VideoItem | null }>({
    isOpen: false,
    video: null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);

  const filteredVideos = videos.filter((v) =>
    v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditModal({
      isOpen: true,
      isNew: true,
      video: {
        title: '',
        description: '',
        category: 'تکنیک حرکات',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
        duration: 320,
        published: true,
      },
    });
  };

  const handleOpenEdit = (v: VideoItem) => {
    setEditModal({
      isOpen: true,
      isNew: false,
      video: { ...v },
    });
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingThumb(true);
    try {
      const res = await StorageService.uploadFile(file, 'videos');
      setEditModal((prev) => ({
        ...prev,
        video: { ...prev.video, thumbnailUrl: res.downloadUrl },
      }));
    } catch (err) {
      console.error('Error uploading video thumb:', err);
    } finally {
      setUploadingThumb(false);
    }
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal.video?.title || !editModal.video?.videoUrl) return;

    setIsSaving(true);
    try {
      const payload: VideoItem = {
        id: editModal.video.id || `vid_${Date.now()}`,
        title: editModal.video.title,
        description: editModal.video.description || '',
        category: editModal.video.category || 'تکنیک حرکات',
        videoUrl: editModal.video.videoUrl,
        thumbnailUrl: editModal.video.thumbnailUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
        duration: Number(editModal.video.duration) || 300,
        published: editModal.video.published ?? true,
        createdAt: editModal.video.createdAt || new Date().toISOString(),
      };

      await AdminRepository.saveVideo(payload, editModal.isNew);
      setEditModal({ isOpen: false, video: null, isNew: true });
      onRefresh();
    } catch (e) {
      console.error('Error saving video:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.video) return;
    setIsSaving(true);
    try {
      await AdminRepository.deleteVideo(deleteModal.video.id, deleteModal.video.title);
      setDeleteModal({ isOpen: false, video: null });
      onRefresh();
    } catch (e) {
      console.error('Error deleting video:', e);
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
            <Video className="w-7 h-7 text-rose-400" />
            مدیریت ویدیوهای آموزشی و بیومکانیک
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            بارگذاری ویدیوهای HD، تحلیل اجرای حرکات، تنظیم کاور و پخش درون برنامه‌ای
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن ویدیوی جدید</span>
        </button>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVideos.map((video) => (
          <motion.div
            key={video.id}
            whileHover={{ y: -3 }}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group"
          >
            <div>
              {/* Thumbnail with Play Overlay */}
              <div className="relative h-44 bg-zinc-950">
                <img
                  src={video.thumbnailUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <button
                  type="button"
                  onClick={() => setPreviewVideo(video)}
                  className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center hover:scale-110 transition shadow-xl"
                >
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </button>
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md text-white text-xs font-mono">
                  {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                </div>
              </div>

              {/* Info */}
              <div className="p-5 space-y-3">
                <h3 className="text-base font-black text-white group-hover:text-rose-400 transition leading-snug">
                  {video.title}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {video.description}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-zinc-950/60 border-t border-zinc-800/80 flex items-center justify-between">
              <span className="text-xs text-zinc-500">{video.category}</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(video)}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteModal({ isOpen: true, video })}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editModal.isOpen && editModal.video && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditModal({ isOpen: false, video: null, isNew: true })}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] flex flex-col overflow-hidden text-right"
              dir="rtl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Video className="w-6 h-6 text-rose-400" />
                  {editModal.isNew ? 'افزودن ویدیوی آموزشی جدید' : `ویرایش ویدیو: ${editModal.video.title}`}
                </h2>
                <button
                  type="button"
                  onClick={() => setEditModal({ isOpen: false, video: null, isNew: true })}
                  className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveVideo} className="flex-1 overflow-y-auto py-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">عنوان ویدیو *</label>
                  <input
                    type="text"
                    required
                    value={editModal.video.title || ''}
                    onChange={(e) =>
                      setEditModal({ ...editModal, video: { ...editModal.video, title: e.target.value } })
                    }
                    className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">آدرس اینترنتی فایل ویدیو (MP4/HLS) *</label>
                  <input
                    type="url"
                    required
                    value={editModal.video.videoUrl || ''}
                    onChange={(e) =>
                      setEditModal({ ...editModal, video: { ...editModal.video, videoUrl: e.target.value } })
                    }
                    dir="ltr"
                    placeholder="https://example.com/video.mp4"
                    className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">دسته‌بندی</label>
                    <select
                      value={editModal.video.category || 'تکنیک حرکات'}
                      onChange={(e) =>
                        setEditModal({ ...editModal, video: { ...editModal.video, category: e.target.value } })
                      }
                      className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs"
                    >
                      <option value="تکنیک حرکات">تکنیک اجرای حرکات</option>
                      <option value="برنامه تمرینی">تشریح سیستم‌های تمرین</option>
                      <option value="آسیب‌شناسی">پیشگیری از آسیب و ریکاوری</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">مدت زمان (ثانیه)</label>
                    <input
                      type="number"
                      value={editModal.video.duration || 300}
                      onChange={(e) =>
                        setEditModal({ ...editModal, video: { ...editModal.video, duration: Number(e.target.value) } })
                      }
                      className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">توضیحات بیومکانیک و نکات ویدیو</label>
                  <textarea
                    rows={3}
                    value={editModal.video.description || ''}
                    onChange={(e) =>
                      setEditModal({ ...editModal, video: { ...editModal.video, description: e.target.value } })
                    }
                    className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs leading-relaxed"
                  />
                </div>

                <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditModal({ isOpen: false, video: null, isNew: true })}
                    className="px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 text-xs"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black rounded-xl"
                  >
                    {isSaving ? 'در حال ذخیره‌سازی...' : 'ذخیره ویدیو'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Video Player Modal */}
      <AnimatePresence>
        {previewVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewVideo(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl z-10 text-right"
              dir="rtl"
            >
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">{previewVideo.title}</h3>
                <button
                  type="button"
                  onClick={() => setPreviewVideo(null)}
                  className="p-1.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="aspect-video bg-black flex items-center justify-center">
                <video
                  src={previewVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AdminConfirmationModal
        isOpen={deleteModal.isOpen}
        title="حذف ویدیوی آموزشی"
        message={`آیا مطمئن هستید که می‌خواهید ویدیوی «${deleteModal.video?.title}» را حذف نمایید؟`}
        confirmLabel="حذف ویدیو"
        isLoading={isSaving}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModal({ isOpen: false, video: null })}
      />
    </div>
  );
};
