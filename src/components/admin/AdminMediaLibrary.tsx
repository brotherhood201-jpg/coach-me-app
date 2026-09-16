import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Search,
  Folder,
  Copy,
  Check,
  Trash2,
  Eye,
  FileText,
  Video,
  X,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaItem } from '../../types';
import { StorageService } from '../../services/StorageService';
import { AdminRepository } from '../../repositories/AdminRepository';
import { AdminConfirmationModal } from './AdminConfirmationModal';

interface AdminMediaLibraryProps {
  media: MediaItem[];
  onRefresh: () => void;
}

export const AdminMediaLibrary: React.FC<AdminMediaLibraryProps> = ({
  media,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; item: MediaItem | null }>({
    isOpen: false,
    item: null,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFolderForUpload, setSelectedFolderForUpload] = useState<
    'exercises' | 'articles' | 'videos' | 'nutrition' | 'media' | 'profiles'
  >('exercises');

  const filteredMedia = media.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isVideo = file.type.startsWith('video/');
        const validation = StorageService.validateFile(file, isVideo ? 'video' : 'image');
        if (!validation.valid) {
          throw new Error(validation.error || 'فایل نامعتبر است');
        }
        const result = await StorageService.uploadFile(file, selectedFolderForUpload);
        const newMedia: MediaItem = {
          id: `med_${Date.now()}_${i}`,
          name: file.name,
          type: isVideo ? 'video' : 'image',
          storageUrl: result.downloadUrl,
          storagePath: result.storagePath,
          sizeBytes: result.sizeBytes,
          mimeType: result.mimeType,
          createdAt: new Date().toISOString(),
        };
        await AdminRepository.saveMediaItem(newMedia);
      }
      onRefresh();
    } catch (err: any) {
      setUploadError(err.message || 'خطا در بارگذاری فایل در Storage');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.item) return;
    try {
      if (deleteModal.item.storagePath) {
        await StorageService.deleteFile(deleteModal.item.storagePath);
      }
      await AdminRepository.deleteMediaItem(deleteModal.item.id, deleteModal.item.name);
      setDeleteModal({ isOpen: false, item: null });
      onRefresh();
    } catch (e) {
      console.error('Error deleting media:', e);
    }
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <ImageIcon className="w-7 h-7 text-teal-400" />
            کتابخانه رسانه‌ها و فایل‌های ابری (Media Library)
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            مدیریت تصاویر تمرینات، کاور مقالات، ویدیوهای آموزشی و آواتارها در Cloud Storage
          </p>
        </div>

        {/* Upload Control */}
        <div className="flex items-center gap-2">
          <select
            value={selectedFolderForUpload}
            onChange={(e) => setSelectedFolderForUpload(e.target.value as any)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-2xl px-3 py-3"
          >
            <option value="exercises">پوشه حرکات (exercises)</option>
            <option value="articles">پوشه مقالات (articles)</option>
            <option value="videos">پوشه ویدیوها (videos)</option>
            <option value="nutrition">پوشه تغذیه (nutrition)</option>
            <option value="media">پوشه عمومی (media)</option>
          </select>

          <label className="cursor-pointer px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black rounded-2xl transition flex items-center gap-2 shadow-lg shadow-emerald-500/20">
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'در حال آپلود...' : 'آپلود فایل جدید'}</span>
            <input
              type="file"
              multiple
              disabled={isUploading}
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {uploadError && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {uploadError}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 sm:p-5 shadow-xl flex items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجوی نام فایل یا تصویر..."
            className="w-full pl-4 pr-12 py-3 bg-zinc-950 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:border-teal-500 transition"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredMedia.length === 0 ? (
          <div className="col-span-full py-16 text-center text-zinc-500 text-sm">
            هیچ فایلی یافت نشد. می‌توانید با دکمه بالا فایل جدید آپلود نمایید.
          </div>
        ) : (
          filteredMedia.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -2 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group"
            >
              {/* Preview Box */}
              <div
                className="relative aspect-square bg-zinc-950 overflow-hidden cursor-pointer"
                onClick={() => setPreviewMedia(item)}
              >
                {item.type === 'video' ? (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-rose-400">
                    <Video className="w-10 h-10" />
                  </div>
                ) : (
                  <img
                    src={item.storageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                )}
              </div>

              {/* Meta & Actions */}
              <div className="p-3 space-y-2">
                <div className="text-[11px] font-bold text-zinc-200 truncate" title={item.name}>
                  {item.name}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60 text-[10px]">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(item.storageUrl, item.id)}
                    className="text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 transition"
                    title="کپی لینک مستقیم فایل"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>کپی شد!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>کپی لینک</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteModal({ isOpen: true, item })}
                    className="text-zinc-500 hover:text-red-400"
                    title="حذف فایل از Storage"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Media Fullscreen Preview Modal */}
      <AnimatePresence>
        {previewMedia && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewMedia(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl z-10 text-right"
              dir="rtl"
            >
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-bold text-white truncate max-w-md">{previewMedia.name}</span>
                <button
                  type="button"
                  onClick={() => setPreviewMedia(null)}
                  className="p-1.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-[60vh] flex items-center justify-center bg-black p-4">
                {previewMedia.type === 'video' ? (
                  <video src={previewMedia.storageUrl} controls className="max-h-full max-w-full rounded-xl" />
                ) : (
                  <img
                    src={previewMedia.storageUrl}
                    alt={previewMedia.name}
                    className="max-h-full max-w-full object-contain rounded-xl"
                  />
                )}
              </div>

              <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-400">
                  اندازه: {previewMedia.sizeBytes ? (previewMedia.sizeBytes / 1024).toFixed(1) + ' KB' : 'مشخص نیست'}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyUrl(previewMedia.storageUrl, previewMedia.id)}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>کپی لینک مستقیم CDN</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AdminConfirmationModal
        isOpen={deleteModal.isOpen}
        title="حذف فایل از Storage"
        message={`آیا مطمئن هستید که می‌خواهید فایل «${deleteModal.item?.name}» را از فضای ابری حذف کنید؟`}
        confirmLabel="حذف فایل"
        isLoading={false}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
      />
    </div>
  );
};
