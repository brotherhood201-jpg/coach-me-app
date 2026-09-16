import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Dumbbell, BookOpen, Video, Trash2, ArrowLeft } from 'lucide-react';
import { FavoritesRepository, FavoriteItem } from '../repositories/FavoritesRepository';

interface SavedFavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  onSelectExercise?: (exerciseId: string) => void;
  onSelectArticle?: (articleId: string) => void;
  onSelectVideo?: (videoId: string) => void;
}

export const SavedFavoritesModal: React.FC<SavedFavoritesModalProps> = ({
  isOpen,
  onClose,
  userId,
  onSelectExercise,
  onSelectArticle,
  onSelectVideo,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'exercise' | 'article' | 'video'>('all');
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const loadFavorites = () => {
    FavoritesRepository.getAllFavorites(userId).then(setFavorites);
  };

  useEffect(() => {
    if (isOpen) {
      loadFavorites();
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const handleRemove = async (item: FavoriteItem, e: React.MouseEvent) => {
    e.stopPropagation();
    await FavoritesRepository.toggleFavorite(userId, {
      id: item.id,
      type: item.type,
      title: item.title,
      subtitle: item.subtitle,
      category: item.category,
    });
    loadFavorites();
  };

  const filtered = favorites.filter((f) => (activeTab === 'all' ? true : f.type === activeTab));

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
          className="relative w-full max-w-2xl max-h-[88vh] bg-[#0c0c0c] border border-white/10 rounded-[36px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden z-10 text-right backdrop-blur-2xl"
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-zinc-950/80 sticky top-0 z-10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Heart className="w-5 h-5 fill-rose-500" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">نشان‌شده‌ها و علاقه‌مندی‌ها</h3>
                <p className="text-xs text-zinc-400">دسترسی سریع به حرکات، مقالات و ویدیوهای منتخب</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-white/[0.05] text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 p-3 px-6 border-b border-white/5 bg-white/[0.01]">
            {[
              { id: 'all', label: 'همه موارد' },
              { id: 'exercise', label: 'حرکات ورزشی', icon: Dumbbell },
              { id: 'article', label: 'مقالات', icon: BookOpen },
              { id: 'video', label: 'ویدیوها', icon: Video },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-white/[0.02] text-zinc-400 hover:text-white border border-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {filtered.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-14 h-14 rounded-3xl bg-white/[0.02] border border-white/5 mx-auto flex items-center justify-center text-zinc-500">
                  <Heart className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-zinc-300">موردی ذخیره نشده است</h4>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  با فشردن آیکون قلب روی هر حرکت، مقاله یا ویدیو، آن را به این بخش اضافه کنید.
                </p>
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={`${item.type}_${item.id}`}
                  onClick={() => {
                    if (item.type === 'exercise' && onSelectExercise) onSelectExercise(item.id);
                    if (item.type === 'article' && onSelectArticle) onSelectArticle(item.id);
                    if (item.type === 'video' && onSelectVideo) onSelectVideo(item.id);
                  }}
                  className="p-4 rounded-3xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 transition-all flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/5 flex items-center justify-center text-orange-400">
                      {item.type === 'exercise' && <Dumbbell className="w-5 h-5" />}
                      {item.type === 'article' && <BookOpen className="w-5 h-5" />}
                      {item.type === 'video' && <Video className="w-5 h-5" />}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                        {item.subtitle && <span className="font-mono">{item.subtitle}</span>}
                        {item.category && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-zinc-400">
                            {item.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleRemove(item, e)}
                      className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="حذف از نشان‌شده‌ها"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ArrowLeft className="w-4 h-4 text-zinc-600" />
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
