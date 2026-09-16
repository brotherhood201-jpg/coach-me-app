import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Heart, Filter, ChevronLeft, Dumbbell, Zap, Sparkles } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { DotMatrixNumber } from '../common/DotMatrixNumber';
import { Exercise } from '../../types';
import { playWorkoutSound } from '../../utils/persian';

interface ExercisesViewProps {
  exercises: Exercise[];
  onSelectExercise: (exercise: Exercise) => void;
  favorites: string[];
  onToggleFavorite: (exerciseId: string) => void;
}

export const ExercisesView: React.FC<ExercisesViewProps> = ({
  exercises,
  onSelectExercise,
  favorites,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('همه');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);

  const muscleCategories = ['همه', 'سینه', 'زیربغل', 'پا', 'سرشانه', 'بازو', 'شکم'];

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch =
        ex.nameFa.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.targetMuscle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMuscle =
        selectedMuscle === 'همه' ||
        ex.targetMuscle.includes(selectedMuscle) ||
        ex.primaryMuscle?.includes(selectedMuscle);

      const matchesFavorite = !showOnlyFavorites || favorites.includes(ex.id);

      return matchesSearch && matchesMuscle && matchesFavorite;
    });
  }, [exercises, searchQuery, selectedMuscle, showOnlyFavorites, favorites]);

  return (
    <div className="space-y-5 pb-28">
      {/* 1. Search and Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی نام فارسی یا انگلیسی حرکت..."
            className="w-full bg-[#100b22]/90 text-white placeholder-zinc-500 text-sm font-medium pr-11 pl-4 py-3.5 rounded-2xl border border-white/10 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/20 transition-all backdrop-blur-xl shadow-lg"
          />
          <Search className="w-5 h-5 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Muscle Categories Horizontal Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => {
              playWorkoutSound('tick');
              setShowOnlyFavorites(!showOnlyFavorites);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
              showOnlyFavorites
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                : 'bg-[#140e26]/70 text-zinc-400 border border-white/5 hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-current' : ''}`} />
            <span>نشان‌شده‌ها</span>
          </button>

          {muscleCategories.map((muscle) => {
            const isSelected = selectedMuscle === muscle && !showOnlyFavorites;
            return (
              <button
                key={muscle}
                onClick={() => {
                  playWorkoutSound('tick');
                  setSelectedMuscle(muscle);
                  setShowOnlyFavorites(false);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-violet-600/25 text-violet-200 border border-violet-400/40 shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                    : 'bg-[#140e26]/70 text-zinc-400 border border-white/5 hover:text-white hover:bg-[#1f153b]/60'
                }`}
              >
                {muscle}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Count info */}
      <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
        <span className="flex items-center gap-1">
          <span>نمایش</span>
          <DotMatrixNumber value={filteredExercises.length} size="2xs" glow="none" color="muted" />
          <span>حرکت تخصصی</span>
        </span>
        {selectedMuscle !== 'همه' && (
          <span className="text-violet-400 font-bold">دسته‌بندی: {selectedMuscle}</span>
        )}
      </div>

      {/* 3. Exercise Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <AnimatePresence>
          {filteredExercises.map((ex, idx) => {
            const isFav = favorites.includes(ex.id);
            return (
              <motion.div
                key={ex.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: idx * 0.03 }}
              >
                <GlassCard
                  interactive
                  onClick={() => onSelectExercise(ex)}
                  className="p-4 flex gap-3.5 items-center group relative overflow-hidden"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-white/10 bg-slate-950">
                    <img
                      src={ex.imageUrl || 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop'}
                      alt={ex.nameFa}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold text-violet-300 bg-violet-500/15 border border-violet-500/30 px-2 py-0.5 rounded-full">
                        {ex.targetMuscle}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {ex.difficulty || 'متوسط'}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-white group-hover:text-violet-300 transition line-clamp-1">
                      {ex.nameFa}
                    </h4>

                    <p className="text-[11px] text-zinc-400 font-mono line-clamp-1 mt-0.5">
                      {ex.nameEn}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-2">
                      <DotMatrixNumber value={ex.sets.length} unit="ست" size="2xs" glow="none" color="muted" />
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span>استراحت</span>
                        <DotMatrixNumber value={ex.restSeconds} unit="ثانیه" size="2xs" glow="none" color="muted" />
                      </span>
                    </div>
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playWorkoutSound('tick');
                      onToggleFavorite(ex.id);
                    }}
                    className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-rose-400 transition cursor-pointer self-start"
                    title="نشان کردن حرکت"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-current' : ''}`} />
                  </button>
                </GlassCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
