import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Video, Clock, Play, ChevronLeft } from 'lucide-react';
import { GlassCard } from './common/GlassCard';
import { toPersianDigits } from '../utils/persian';
import { AdminRepository } from '../repositories/AdminRepository';

interface RecommendedContentProps {
  onOpenArticles: () => void;
  onOpenVideos: () => void;
}

export const RecommendedContent: React.FC<RecommendedContentProps> = ({
  onOpenArticles,
  onOpenVideos,
}) => {
  const [articles, setArticles] = useState<any[]>([
    {
      id: 'art-1',
      title: 'اصول علمی هایپرتروفی و افزایش حجم عضلانی',
      category: 'هایپرتروفی',
      readingTime: 5,
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'art-2',
      title: 'تغذیه بهینه برای عضله‌سازی: زمان‌بندی پروتئین',
      category: 'تغذیه',
      readingTime: 4,
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop',
    },
  ]);

  const [videos, setVideos] = useState<any[]>([
    {
      id: 'vid-1',
      title: 'آموزش ویدیویی تکنیک بیومکانیک پرس سینه هالتر',
      category: 'تکنیک سینه',
      durationMinutes: 3,
      image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'vid-2',
      title: 'حرکات گرم کردن تخصصی و موبیلیتی مفصل شانه',
      category: 'گرم کردن',
      durationMinutes: 4,
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
    },
  ]);

  useEffect(() => {
    AdminRepository.getArticles().then((arts) => {
      if (arts && arts.length > 0) {
        setArticles(
          arts.slice(0, 2).map((a) => ({
            id: a.id,
            title: a.title,
            category: a.category || 'تناسب اندام',
            readingTime: a.readingTime || 5,
            image: a.coverImage || 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',
          }))
        );
      }
    });

    AdminRepository.getVideos().then((vids) => {
      if (vids && vids.length > 0) {
        setVideos(
          vids.slice(0, 2).map((v) => ({
            id: v.id,
            title: v.title,
            category: v.category || 'آموزش',
            durationMinutes: Math.round((v.duration || 180) / 60),
            image: v.thumbnailUrl || 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop',
          }))
        );
      }
    });
  }, []);

  return (
    <div className="space-y-4">
      {/* Articles Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.2)]">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black text-white">مقالات و دانش تخصصی</h3>
        </div>
        <button
          onClick={onOpenArticles}
          className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1 cursor-pointer bg-violet-500/10 hover:bg-violet-500/20 px-3 py-1 rounded-xl border border-violet-500/20"
        >
          <span>مشاهده همه</span>
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Articles Horizontal List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {articles.map((art) => (
          <GlassCard
            key={art.id}
            interactive
            onClick={onOpenArticles}
            className="p-3.5 flex gap-3.5 items-center group"
          >
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-white/10">
              <img
                src={art.image}
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                {art.category}
              </span>
              <h4 className="text-xs font-bold text-white mt-1.5 line-clamp-2 leading-relaxed group-hover:text-violet-300 transition">
                {art.title}
              </h4>
              <div className="flex items-center gap-1 text-[10px] text-zinc-400 mt-1">
                <Clock className="w-3 h-3 text-zinc-500" />
                <span>{toPersianDigits(art.readingTime)} دقیقه مطالعه</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Videos Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.2)]">
            <Video className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black text-white">ویدیوهای تکنیک و اجرا</h3>
        </div>
        <button
          onClick={onOpenVideos}
          className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1 cursor-pointer bg-violet-500/10 hover:bg-violet-500/20 px-3 py-1 rounded-xl border border-violet-500/20"
        >
          <span>مشاهده همه</span>
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Videos Horizontal List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {videos.map((vid) => (
          <GlassCard
            key={vid.id}
            interactive
            onClick={onOpenVideos}
            className="p-3.5 flex gap-3.5 items-center group"
          >
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-white/10">
              <img
                src={vid.image}
                alt={vid.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white flex items-center justify-center shadow-[0_0_12px_#a855f7]">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-violet-300 bg-violet-500/15 border border-violet-500/30 px-2 py-0.5 rounded-full">
                {vid.category}
              </span>
              <h4 className="text-xs font-bold text-white mt-1.5 line-clamp-2 leading-relaxed group-hover:text-violet-300 transition">
                {vid.title}
              </h4>
              <div className="flex items-center gap-1 text-[10px] text-zinc-400 mt-1">
                <Clock className="w-3 h-3 text-zinc-500" />
                <span>{toPersianDigits(vid.durationMinutes)} دقیقه ویدیو</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
