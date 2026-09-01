import React from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const { isMobileDeviceView, setIsMobileDeviceView } = useAppState();

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 transition-colors duration-300">
      {/* Top Utility Controls Bar */}
      <header className="w-full max-w-md hidden sm:flex items-center justify-between py-2 px-3 mb-2 bg-stone-800/80 backdrop-blur rounded-xl text-stone-300 text-xs border border-stone-700/50 shadow-lg">
        <div className="flex items-center space-x-2 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-stone-200">KarigarAI Mobile Studio</span>
        </div>
        <div className="flex items-center space-x-1 bg-stone-900/60 p-1 rounded-lg">
          <button
            onClick={() => setIsMobileDeviceView(true)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              isMobileDeviceView
                ? 'bg-artisan-terracotta text-white shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile App</span>
          </button>
          <button
            onClick={() => setIsMobileDeviceView(false)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              !isMobileDeviceView
                ? 'bg-artisan-terracotta text-white shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Expanded</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main
        className={`w-full bg-stone-50 text-stone-900 transition-all duration-300 shadow-2xl relative flex flex-col overflow-hidden ${
          isMobileDeviceView
            ? 'max-w-[420px] h-[890px] sm:rounded-[44px] sm:border-[8px] sm:border-stone-800'
            : 'max-w-4xl min-h-[850px] sm:rounded-2xl border border-stone-200'
        }`}
      >
        {/* Mobile Device Status Bar (only in mobile device view) */}
        {isMobileDeviceView && (
          <aside aria-label="Device Status Bar" className="hidden sm:flex items-center justify-between px-7 pt-3 pb-1 text-stone-800 text-[11px] font-semibold tracking-tight z-50 bg-inherit select-none">
            <span>9:41</span>
            {/* Dynamic Island / Speaker Pill */}
            <div className="w-24 h-4 bg-stone-800 rounded-full mx-auto -mt-1 shadow-inner"></div>
            <div className="flex items-center space-x-1.5 text-stone-700">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-4 h-4" />
            </div>
          </aside>
        )}

        {/* Scrollable Screen Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative pb-20">
          {children}
        </div>

        {/* iOS / Android Home Indicator Pill */}
        {isMobileDeviceView && (
          <div className="hidden sm:block absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-stone-300 rounded-full pointer-events-none z-50"></div>
        )}
      </main>
    </div>
  );
};
