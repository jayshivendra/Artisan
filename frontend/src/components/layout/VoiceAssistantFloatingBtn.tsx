import React from 'react';
import { useVoice } from '../../context/VoiceContext.js';
import { useAppState } from '../../context/AppStateContext.js';
import { Mic } from 'lucide-react';

export const VoiceAssistantFloatingBtn: React.FC = () => {
  const { setIsAssistantModalOpen, isListening, playChime } = useVoice();
  const { currentScreen } = useAppState();

  const isExcluded = ['welcome', 'language_select', 'category_select', 'profile_setup'].includes(currentScreen);
  if (isExcluded) return null;

  const handleClick = () => {
    playChime('tap');
    setIsAssistantModalOpen(true);
  };

  return (
    <div className="absolute bottom-20 right-4 z-40">
      <button
        onClick={handleClick}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-artisan-indigo via-blue-700 to-indigo-500 text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
        title="Ask AI Virtual Assistant"
      >
        {/* Pulsating Halo Rings */}
        <span className="absolute -inset-1 rounded-full bg-blue-500/30 animate-ping pointer-events-none opacity-75"></span>
        <span className="absolute -inset-2 rounded-full bg-indigo-400/20 animate-pulse pointer-events-none"></span>

        <Mic className="w-6 h-6 stroke-[2.5] relative z-10 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
};
