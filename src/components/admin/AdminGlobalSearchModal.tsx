import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Dumbbell, Users, FileText, Video, Apple, Calendar, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Exercise, ArticleItem, VideoItem, FoodItem, UserProfile } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tabId: string, itemId?: string) => void;
  exercises: Exercise[];
  articles: ArticleItem[];
  videos: VideoItem[];
  foods: FoodItem[];
  users: UserProfile[];
}

export const AdminGlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  exercises,
  articles,
  videos,
  foods,
  users,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase().trim();

    const matchedExercises = exercises
      .filter((e) => e.nameFa.toLowerCase().includes(term) || e.nameEn.toLowerCase().includes(term) || (e.primaryMuscle && e.primaryMuscle.includes(term)))
      .slice(0, 4)
      .map((e) => ({
        id: e.id,
        title: e.nameFa,
        subtitle: `${e.nameEn} • ${e.primaryMuscle || e.targetMuscle}`,
        type: 'exercises',
        icon: Dumbbell,
        badge: 'حرکت',
        badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      }));

    const matchedArticles = articles
      .filter((a) => a.title.toLowerCase().includes(term) || (a.summary && a.summary.toLowerCase().includes(term)))
      .slice(0, 4)
      .map((a) => ({
        id: a.id,
        title: a.title,
        subtitle: `${a.category} • ${a.readingTime} دقیقه مطالعه`,
        type: 'articles',
        icon: FileText,
        badge: 'مقاله',
        badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      }));

    const matchedVideos = videos
      .filter((v) => v.title.toLowerCase().includes(term) || (v.description && v.description.toLowerCase().includes(term)))
      .slice(0, 4)
      .map((v) => ({
        id: v.id,
        title: v.title,
        subtitle: `${v.category} • ${Math.round(v.duration / 60)} دقیقه`,
        type: 'videos',
        icon: Video,
        badge: 'ویدیو',
        badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      }));

    const matchedFoods = foods
      .filter((f) => f.nameFa.toLowerCase().includes(term) || (f.nameEn && f.nameEn.toLowerCase().includes(term)))
      .slice(0, 4)
      .map((f) => ({
        id: f.id,
        title: f.nameFa,
        subtitle: `${f.calories} کالری • ${f.protein}g پروتئین`,
        type: 'nutrition',
        icon: Apple,
        badge: 'تغذیه',
        badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      }));

    const matchedUsers = users
      .filter((u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term))
      .slice(0, 4)
      .map((u) => ({
        id: u.userId,
        title: u.name,
        subtitle: `${u.email} • ${u.totalWorkoutsDone} تمرین`,
        type: 'users',
        icon: Users,
        badge: 'کاربر',
        badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      }));

    return [...matchedExercises, ...matchedArticles, ...matchedVideos, ...matchedFoods, ...matchedUsers];
  }, [searchTerm, exercises, articles, videos, foods, users]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden z-10 text-right"
            dir="rtl"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 border-b border-zinc-800 bg-zinc-900/90">
              <Search className="w-5 h-5 text-zinc-400 ml-3" />
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="جستجو در کاربران، حرکات، مقالات، ویدیوها و تغذیه..."
                className="w-full py-4 bg-transparent text-white placeholder-zinc-500 text-sm focus:outline-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="p-1 text-zinc-400 hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <span className="hidden sm:inline-block mr-3 text-xs bg-zinc-800 text-zinc-400 border border-zinc-700 px-2 py-0.5 rounded font-mono">
                ESC
              </span>
            </div>

            {/* Results Area */}
            <div className="max-h-96 overflow-y-auto p-3 divide-y divide-zinc-800/40">
              {!searchTerm.trim() ? (
                <div className="py-12 text-center text-zinc-500 text-sm">
                  <p>عبارت مورد نظر خود را برای جستجوی سریع تایپ کنید...</p>
                  <div className="flex items-center justify-center gap-2 mt-3 text-xs text-zinc-600">
                    <span>حرکات</span> • <span>مقالات</span> • <span>ویدیوها</span> • <span>کاربران</span> • <span>برنامه‌ها</span>
                  </div>
                </div>
              ) : results.length === 0 ? (
                <div className="py-12 text-center text-zinc-400 text-sm">
                  موردی مطابق با عبارت «{searchTerm}» پیدا نشد.
                </div>
              ) : (
                results.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={`${item.type}-${item.id}`}
                      onClick={() => {
                        onNavigate(item.type, item.id);
                        onClose();
                      }}
                      className="group flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800/70 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-zinc-800 text-zinc-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-zinc-200 group-hover:text-white transition">
                              {item.title}
                            </span>
                            <span className={`text-[11px] px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-0.5">{item.subtitle}</p>
                        </div>
                      </div>
                      <ArrowLeft className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition transform group-hover:-translate-x-1" />
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
