import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useVoice } from '../../context/VoiceContext.js';
import { Globe, Bell, Volume2, VolumeX, Sparkles, ChevronLeft, ShoppingBag, Store } from 'lucide-react';
import { LanguageCode } from '../../types/index.js';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  audioGuideText?: string;
}

import { AUDIO_GUIDANCE_BY_LANG } from '../../context/VoiceContext.js';

export const Header: React.FC<HeaderProps> = ({ title, showBack, onBack, audioGuideText }) => {
  const { navigateTo, goBack, unreadNotifsCount, currentScreen, userRole, setUserRole, setIsLiveDemoOpen } = useAppState();
  const { currentLanguageOption, supportedLanguages, setLanguage, language } = useLanguage();
  const { speak, isSpeaking, stopSpeaking, playChime } = useVoice();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const handleAudioHelp = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const guidanceCategory = currentScreen === 'find_buyers' ? 'buyers' :
                               currentScreen === 'add_product' ? 'step1' : 'home';
      const nativeGuidance = AUDIO_GUIDANCE_BY_LANG[guidanceCategory]?.[language] ||
                             audioGuideText ||
                             `Welcome to KarigarConnect AI. You are on the ${currentScreen} screen.`;
      speak(nativeGuidance, currentLanguageOption.voiceLang);
    }
  };

  const handleSelectLanguage = (code: LanguageCode) => {
    playChime('tap');
    setLanguage(code);
    setIsLangMenuOpen(false);
  };

  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-stone-200/70 px-4 py-2.5 z-30 flex items-center justify-between shadow-sm select-none">
      {/* Left section: Logo or Back Button */}
      <div className="flex items-center space-x-2">
        {showBack ? (
          <button
            onClick={onBack || goBack}
            className="p-1.5 -ml-1 rounded-full hover:bg-stone-100 active:scale-95 text-stone-700 transition-colors"
            title="Go Back"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
        ) : (
          <button
            onClick={() => navigateTo(userRole === 'buyer' ? 'buyer_marketplace' : 'home')}
            className="flex items-center space-x-2 text-left group"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-artisan-terracotta to-orange-500 text-white flex items-center justify-center font-black text-xs shadow-sm group-hover:scale-105 transition-transform">
              ✦
            </div>
            <div>
              <h1 className="font-extrabold text-stone-900 text-sm leading-none tracking-tight">
                Karigar<span className="text-artisan-terracotta font-black">Connect</span> AI
              </h1>
              <p className="text-[9px] text-stone-500 font-bold leading-tight">
                {userRole === 'buyer' ? 'Craft Marketplace' : 'AI Business Manager'}
              </p>
            </div>
          </button>
        )}

        {title && showBack && (
          <h2 className="font-bold text-stone-900 text-sm line-clamp-1">{title}</h2>
        )}
      </div>

      {/* Center/Right section: Role Switcher, Audio, Lang, Notifications */}
      <div className="flex items-center space-x-1.5">
        
        {/* Role Toggle Pill (Buyer vs Seller) */}
        <div className="bg-stone-100 p-0.5 rounded-full border border-stone-200 flex items-center">
          <button
            onClick={() => {
              playChime('tap');
              setUserRole('buyer');
            }}
            className={`px-2 py-1 rounded-full text-[10px] font-extrabold transition-all flex items-center space-x-1 ${
              userRole === 'buyer'
                ? 'bg-artisan-terracotta text-white shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
            title="Switch to Buyer Marketplace"
          >
            <ShoppingBag className="w-3 h-3" />
            <span className="hidden sm:inline">Buyer</span>
          </button>
          
          <button
            onClick={() => {
              playChime('tap');
              setUserRole('seller');
            }}
            className={`px-2 py-1 rounded-full text-[10px] font-extrabold transition-all flex items-center space-x-1 ${
              userRole === 'seller'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
            title="Switch to Artisan Seller Studio"
          >
            <Store className="w-3 h-3" />
            <span className="hidden sm:inline">Seller</span>
          </button>
        </div>

        {/* SIH Live Demo Button */}
        <button
          onClick={() => {
            playChime('success');
            setIsLiveDemoOpen(true);
          }}
          className="px-2 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-black text-[10px] shadow-sm flex items-center space-x-1 active:scale-95 transition-transform"
          title="Launch SIH 3-Minute Live Judge Demo"
        >
          <span>🏆</span>
          <span className="hidden sm:inline">Demo</span>
        </button>

        {/* Spoken Audio Helper Button */}
        <button
          onClick={handleAudioHelp}
          className={`p-1.5 rounded-full transition-all active:scale-95 flex items-center justify-center ${
            isSpeaking
              ? 'bg-artisan-marigold text-white animate-pulse shadow-md'
              : 'bg-amber-100/70 text-amber-800 hover:bg-amber-200'
          }`}
          title="Listen to Spoken Instructions"
        >
          {isSpeaking ? (
            <VolumeX className="w-3.5 h-3.5" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 stroke-[2.5]" />
          )}
        </button>

        {/* Quick Language Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="flex items-center space-x-1 py-1 px-2 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-200 text-[10px] font-bold text-stone-700 active:scale-95 transition-all"
          >
            <Globe className="w-3 h-3 text-artisan-indigo" />
            <span>{currentLanguageOption.code.toUpperCase()}</span>
          </button>

          {isLangMenuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-2xl border border-stone-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1 text-[10px] font-bold text-stone-500 uppercase tracking-wider border-b border-stone-100">
                Choose Language
              </div>
              <div className="max-h-56 overflow-y-auto">
                {supportedLanguages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between text-xs hover:bg-artisan-terracottaLight transition-colors ${
                      language === lang.code ? 'font-bold text-artisan-terracotta bg-artisan-terracottaLight/50' : 'text-stone-700'
                    }`}
                  >
                    <span>{lang.nativeName}</span>
                    <span className="text-[10px] text-stone-400">{lang.name}</span>
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
          className="relative p-1.5 rounded-full hover:bg-stone-100 text-stone-600 active:scale-95 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white"></span>
          )}
        </button>
      </div>
    </header>
  );
};
