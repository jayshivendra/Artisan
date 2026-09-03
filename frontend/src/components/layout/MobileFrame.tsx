import React from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const { isMobileDeviceView, setIsMobileDeviceView } = useAppState();

  return (
    <div className="h-[100dvh] w-full bg-stone-950 sm:bg-stone-900 flex flex-col items-center justify-center p-0 sm:p-4 transition-colors duration-300 overflow-hidden">
      {/* Top Utility Bar (Desktop only, hidden on mobile) */}
      <header className="w-full max-w-md hidden sm:flex items-center justify-between py-1.5 px-3 mb-2 bg-stone-800/90 backdrop-blur rounded-xl text-stone-300 text-xs border border-stone-700/50 shadow-lg">
        <div className="flex items-center space-x-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-stone-200 font-bold">KarigarConnect AI</span>
        </div>
        <div className="flex items-center space-x-1 bg-stone-900/60 p-0.5 rounded-lg">
          <button
            onClick={() => setIsMobileDeviceView(true)}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
              isMobileDeviceView
                ? 'bg-artisan-terracotta text-white shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>Mobile App</span>
          </button>
          <button
            onClick={() => setIsMobileDeviceView(false)}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
              !isMobileDeviceView
                ? 'bg-artisan-terracotta text-white shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Monitor className="w-3 h-3" />
            <span>Expanded</span>
          </button>
        </div>
      </header>

      {/* Main Container - Fullscreen on mobile, phone-framed on desktop */}
      <main
        className={`w-full bg-stone-50 text-stone-900 transition-all duration-300 shadow-2xl relative flex flex-col overflow-hidden ${
          isMobileDeviceView
            ? 'h-full sm:h-[860px] sm:max-w-[420px] sm:rounded-[44px] sm:border-[8px] sm:border-stone-800'
            : 'h-full sm:h-[860px] max-w-4xl sm:rounded-2xl border border-stone-200'
        }`}
      >
        {/* Desktop Virtual Status Bar (hidden on real mobile) */}
        {isMobileDeviceView && (
          <aside aria-label="Device Status Bar" className="hidden sm:flex items-center justify-between px-7 pt-2.5 pb-1 text-stone-800 text-[11px] font-bold tracking-tight z-50 bg-inherit select-none">
            <span>9:41</span>
            {/* Speaker Pill */}
            <div className="w-20 h-3.5 bg-stone-800 rounded-full mx-auto -mt-0.5 shadow-inner"></div>
            <div className="flex items-center space-x-1.5 text-stone-700">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-4 h-4" />
            </div>
          </aside>
        )}

        {/* Screen Content Area - Perfectly scrollable with bottom padding for BottomNav */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative pb-20 scroll-smooth">
          {children}
        </div>

        {/* Desktop Home Bar indicator */}
        {isMobileDeviceView && (
          <div className="hidden sm:block absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-stone-300 rounded-full pointer-events-none z-50"></div>
        )}
      </main>
    </div>
  );
};
