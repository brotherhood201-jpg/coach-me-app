import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Video, Play, Clock, Heart, Share2, ArrowRight } from 'lucide-react';
import { VideoItem } from '../types';
import { SAMPLE_VIDEOS } from '../data/workoutData';
import { FavoritesRepository } from '../repositories/FavoritesRepository';
import { AdminRepository } from '../repositories/AdminRepository';
import { DotMatrixNumber } from './common/DotMatrixNumber';

interface VideosModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  initialVideoId?: string | null;
}

export const VideosModal: React.FC<VideosModalProps> = ({
  isOpen,
  onClose,
  userId,
  initialVideoId,
}) => {
  const [videosList, setVideosList] = useState<VideoItem[]>(SAMPLE_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(() => {
    if (initialVideoId) {
      return SAMPLE_VIDEOS.find((v) => v.id === initialVideoId) || null;
    }
    return null;
  });

  useEffect(() => {
    if (isOpen) {
      AdminRepository.getVideos().then((data) => {
        if (data && data.length > 0) {
          const published = data.filter((v) => v.published !== false && v.status !== 'draft');
          setVideosList(published);
          if (initialVideoId) {
            const match = published.find((v) => v.id === initialVideoId);
            if (match) setSelectedVideo(match);
          }
        }
      });
    }
  }, [isOpen, initialVideoId]);

  if (!isOpen) return null;

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
              {selectedVideo ? (
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="p-2 rounded-2xl bg-white/[0.05] text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/5"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-orange-600/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Video className="w-5 h-5" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-black text-white">
                  {selectedVideo ? 'پخش ویدیو آموزشی' : 'ویدیوهای آموزشی و تکنیک حرکات'}
                </h3>
                <p className="text-xs text-zinc-400">
                  {selectedVideo ? selectedVideo.category : 'آموزش‌های ویدیویی بیومکانیک و اجرای بی‌نقص'}
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
          {selectedVideo ? (
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Video Player */}
              <div className="w-full aspect-video rounded-3xl overflow-hidden bg-black border border-white/10 relative shadow-2xl">
                <video
                  src={selectedVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30 text-xs font-bold">
                    {selectedVideo.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <Clock className="w-3.5 h-3.5" />
                    <DotMatrixNumber value={Math.round(selectedVideo.duration / 60)} unit="دقیقه" size="2xs" glow="none" color="muted" />
                  </div>
                </div>

                <h2 className="text-lg font-black text-white leading-relaxed">{selectedVideo.title}</h2>
                <p className="text-xs text-zinc-300 leading-relaxed">{selectedVideo.description}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <button
                  onClick={async () => {
                    await FavoritesRepository.toggleFavorite(userId, {
                      id: selectedVideo.id,
                      type: 'video',
                      title: selectedVideo.title,
                      category: selectedVideo.category,
                      rawItem: selectedVideo,
                    });
                    alert('ویدیو به علاقه‌مندی‌ها اضافه شد.');
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
                        title: selectedVideo.title,
                        url: selectedVideo.videoUrl,
                      });
                    } else {
                      alert('لینک ویدیو در حافظه کپی شد.');
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
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {videosList.map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => setSelectedVideo(vid)}
                    className="rounded-3xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 transition-all overflow-hidden space-y-3 cursor-pointer p-4 group"
                  >
                    <div className="w-full aspect-video rounded-2xl bg-zinc-900 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="w-12 h-12 rounded-full bg-orange-600 group-hover:scale-110 text-white flex items-center justify-center shadow-lg transition-transform z-10">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 text-[10px] text-zinc-300 bg-black/60 px-2 py-0.5 rounded-md z-10">
                        <DotMatrixNumber value={Math.round(vid.duration / 60)} unit="دقیقه" size="2xs" glow="none" color="muted" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-orange-400 bg-orange-600/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                        {vid.category}
                      </span>
                      <h4 className="text-xs font-bold text-white leading-relaxed line-clamp-1">{vid.title}</h4>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">{vid.description}</p>
                    </div>
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
