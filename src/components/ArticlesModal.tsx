import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Clock, Heart, Share2, ArrowRight } from 'lucide-react';
import { ArticleItem } from '../types';
import { SAMPLE_ARTICLES } from '../data/workoutData';
import { FavoritesRepository } from '../repositories/FavoritesRepository';
import { AdminRepository } from '../repositories/AdminRepository';

interface ArticlesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  initialArticleId?: string | null;
}

export const ArticlesModal: React.FC<ArticlesModalProps> = ({
  isOpen,
  onClose,
  userId,
  initialArticleId,
}) => {
  const [articlesList, setArticlesList] = useState<ArticleItem[]>(SAMPLE_ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(() => {
    if (initialArticleId) {
      return SAMPLE_ARTICLES.find((a) => a.id === initialArticleId) || null;
    }
    return null;
  });
  const [activeCategory, setActiveCategory] = useState<string>('همه');

  useEffect(() => {
    if (isOpen) {
      AdminRepository.getArticles().then((data) => {
        if (data && data.length > 0) {
          const published = data.filter((a) => a.published !== false && a.status !== 'draft');
          setArticlesList(published);
          if (initialArticleId) {
            const found = published.find((a) => a.id === initialArticleId);
            if (found) setSelectedArticle(found);
          }
        }
      });
    }
  }, [isOpen, initialArticleId]);

  if (!isOpen) return null;

  const categories = ['همه', 'تمرین', 'هایپرتروفی و تمرین', 'تغذیه', 'تغذیه و مکمل', 'ریکاوری و خواب'];

  const filtered = articlesList.filter((a) =>
    activeCategory === 'همه' ? true : a.category === activeCategory || a.category.includes(activeCategory)
  );

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
              {selectedArticle ? (
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-2 rounded-2xl bg-white/[0.05] text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/5"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-orange-600/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <BookOpen className="w-5 h-5" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-black text-white">
                  {selectedArticle ? 'مطالعه مقاله علمی' : 'پایگاه دانش و مقالات ورزشی'}
                </h3>
                <p className="text-xs text-zinc-400">
                  {selectedArticle ? selectedArticle.category : 'راهنماهای علمی هایپرتروفی، تغذیه و ریکاوری'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-white/[0.05] text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          {selectedArticle ? (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30 text-xs font-bold">
                    {selectedArticle.category}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{selectedArticle.readingTime} دقیقه مطالعه</span>
                  </div>
                </div>

                <h2 className="text-xl font-black text-white leading-relaxed">{selectedArticle.title}</h2>
              </div>

              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4 text-sm text-zinc-300 leading-loose whitespace-pre-line">
                {selectedArticle.content}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <button
                  onClick={async () => {
                    await FavoritesRepository.toggleFavorite(userId, {
                      id: selectedArticle.id,
                      type: 'article',
                      title: selectedArticle.title,
                      category: selectedArticle.category,
                      rawItem: selectedArticle,
                    });
                    alert('مقاله به علاقه‌مندی‌ها اضافه شد.');
                  }}
                  className="py-2.5 px-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-zinc-300 hover:text-white border border-white/10 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>ذخیره در علاقه‌مندی‌ها</span>
                </button>

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: selectedArticle.title,
                        text: selectedArticle.content,
                      });
                    } else {
                      alert('لینک مقاله در حافظه کپی شد.');
                    }
                  }}
                  className="py-2.5 px-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-zinc-300 hover:text-white border border-white/10 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-zinc-400" />
                  <span>اشتراک‌گذاری</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-orange-600 text-white shadow-sm'
                        : 'bg-white/[0.02] text-zinc-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Article Cards */}
              <div className="space-y-3">
                {filtered.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => setSelectedArticle(art)}
                    className="p-5 rounded-3xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 transition-all space-y-3 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-orange-400 bg-orange-600/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                        {art.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        <span>{art.readingTime} دقیقه</span>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-relaxed">{art.title}</h4>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {art.content.replace(/\n/g, ' ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
