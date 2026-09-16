import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Dumbbell } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
  duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  duration = 2000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, duration);

    return () => clearTimeout(timer);
  }, [onFinish, duration]);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#050811] text-zinc-100 flex flex-col items-center justify-center p-4 font-['Vazirmatn',system-ui,sans-serif] selection:bg-purple-500 selection:text-white select-none overflow-hidden"
      dir="rtl"
    >
      {/* Ambient background glows */}
      <div className="fixed top-[-15%] right-[-10%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-15%] left-[-10%] w-[550px] h-[550px] bg-violet-800/15 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Brand Container */}
      <div className="flex flex-col items-center text-center relative z-10 space-y-6">
        {/* App Logo Icon */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative"
        >
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-violet-600 to-purple-500 p-[2px] shadow-[0_0_50px_rgba(139,92,246,0.35)] flex items-center justify-center">
            <div className="w-full h-full bg-[#0e0a1c] rounded-[22px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />
              <Dumbbell className="w-12 h-12 sm:w-14 sm:h-14 text-purple-400" />
            </div>
          </div>
        </motion.div>

        {/* Brand Name & Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="space-y-2"
        >
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            کوچ من
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium tracking-wide">
            سامانه هوشمند بدنسازی و مربیگری
          </p>
        </motion.div>
      </div>

      {/* Bottom Loading Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="absolute bottom-12 flex flex-col items-center gap-3 z-10"
      >
        <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-400 rounded-full animate-spin" />
        <span className="text-xs text-zinc-400 font-medium">در حال بارگذاری...</span>
      </motion.div>
    </div>
  );
};
