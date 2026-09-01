import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useVoice } from '../../context/VoiceContext.js';
import { Globe, Bell, Volume2, VolumeX, Sparkles, ChevronLeft } from 'lucide-react';
import { LanguageCode } from '../../types/index.js';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  audioGuideText?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, showBack, onBack, audioGuideText }) => {
  const { navigateTo, unreadNotifsCount, currentScreen } = useAppState();
  const { currentLanguageOption, supportedLanguages, setLanguage, language } = useLanguage();
  const { speak, isSpeaking, stopSpeaking, playChime } = useVoice();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const handleAudioHelp = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const defaultText = audioGuideText || `Welcome to KarigarAI. You are on the ${currentScreen} screen. Speak or tap to manage your products and orders easily.`;
      speak(defaultText);
    }
  };

  const handleSelectLanguage = (code: LanguageCode) => {
    playChime('tap');
    setLanguage(code);
    setIsLangMenuOpen(false);
  };

  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-stone-200/70 px-4 py-3 z-30 flex items-center justify-between shadow-sm">
      {/* Left section: Logo or Back Button */}
      <div className="flex items-center space-x-2">
        {showBack ? (
          <button
            onClick={onBack || (() => navigateTo('home'))}
            className="p-2 -ml-1.5 rounded-full hover:bg-stone-100 active:scale-95 text-stone-700 transition-colors"
            title="Go Back"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
        ) : (
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center space-x-2 text-left group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-artisan-terracotta to-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-extrabold text-stone-900 text-base leading-none tracking-tight">
                Karigar<span className="text-artisan-terracotta font-black">AI</span>
              </h1>
              <p className="text-[10px] text-stone-700 font-medium leading-tight">
                Virtual Business Manager
              </p>
            </div>
          </button>
        )}

        {title && showBack && (
          <h2 className="font-bold text-stone-900 text-base line-clamp-1">{title}</h2>
        )}
      </div>

      {/* Right section: Language Pill, Audio Help, Notification Bell */}
      <div className="flex items-center space-x-2">
        {/* Spoken Audio Helper Button for low digital literacy */}
        <button
          onClick={handleAudioHelp}
          className={`p-2 rounded-full transition-all active:scale-95 flex items-center justify-center ${
            isSpeaking
              ? 'bg-artisan-marigold text-white animate-pulse shadow-md'
              : 'bg-artisan-marigoldLight text-artisan-marigold hover:bg-amber-200'
          }`}
          title="Listen to Spoken Instructions"
        >
          {isSpeaking ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4 stroke-[2.5]" />
          )}
        </button>

        {/* Quick Language Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="flex items-center space-x-1 py-1.5 px-2.5 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-200 text-xs font-bold text-stone-700 active:scale-95 transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-artisan-indigo" />
            <span>{currentLanguageOption.nativeName}</span>
          </button>

          {isLangMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-stone-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1 text-[11px] font-bold text-stone-700 uppercase tracking-wider border-b border-stone-100">
                Choose Language
              </div>
              <div className="max-h-60 overflow-y-auto">
                {supportedLanguages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-artisan-terracottaLight transition-colors ${
                      language === lang.code ? 'font-bold text-artisan-terracotta bg-artisan-terracottaLight/50' : 'text-stone-700'
                    }`}
                  >
                    <span>{lang.nativeName}</span>
                    <span className="text-[10px] text-stone-700">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Icon with Badge */}
        <button
          onClick={() => {
            playChime('tap');
            navigateTo('notifications');
          }}
          className="relative p-2 rounded-full hover:bg-stone-100 text-stone-600 active:scale-95 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadNotifsCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-white"></span>
          )}
        </button>
      </div>
    </header>
  );
};
