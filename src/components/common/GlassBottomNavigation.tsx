import React from 'react';
import { motion } from 'motion/react';
import { Home, Dumbbell, Utensils, TrendingUp, User } from 'lucide-react';

export type TabType = 'home' | 'workouts' | 'diet' | 'progress' | 'profile';

interface GlassBottomNavigationProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onStartWorkoutQuick?: () => void;
}

export const GlassBottomNavigation: React.FC<GlassBottomNavigationProps> = ({
  activeTab,
  onChangeTab,
}) => {
  const tabs = [
    { id: 'home' as TabType, labelFa: 'خانه', icon: Home },
    { id: 'workouts' as TabType, labelFa: 'تمرینات', icon: Dumbbell },
    { id: 'diet' as TabType, labelFa: 'تغذیه', icon: Utensils },
    { id: 'progress' as TabType, labelFa: 'پیشرفت', icon: TrendingUp },
    { id: 'profile' as TabType, labelFa: 'پروفایل', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 pointer-events-none flex justify-center pb-safe">
      <nav
        className="relative pointer-events-auto w-full max-w-md bg-[#08111f]/85 backdrop-blur-2xl border border-white/[0.10] rounded-[36px] p-1.5 sm:p-2 shadow-[0_24px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(0,102,255,0.12)] flex items-center justify-between gap-1 overflow-hidden"
        dir="rtl"
        aria-label="منوی اصلی ناوبری"
      >
        {/* Subtle Specular Top Sheen */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-[22px] transition-all duration-300 cursor-pointer select-none ${
                isActive ? 'text-white font-black' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  className="absolute inset-0 bg-gradient-to-b from-[#0e2454]/95 via-[#0b1c42]/90 to-[#07122b]/95 border border-[#0066ff]/50 rounded-[22px] shadow-[0_0_24px_rgba(0,102,255,0.40),inset_0_1px_0_rgba(255,255,255,0.25)]"
                />
              )}

              <div className="relative z-10 flex flex-col items-center gap-1">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive
                      ? 'scale-110 text-white drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]'
                      : 'text-slate-400'
                  }`}
                />
                <span className="text-[11px] leading-none tracking-tight whitespace-nowrap">
                  {tab.labelFa}
                </span>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

