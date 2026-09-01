import React from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useVoice } from '../../context/VoiceContext.js';
import { Sparkles, ArrowRight, Volume2 } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { navigateTo } = useAppState();
  const { t } = useLanguage();
  const { playChime, speak } = useVoice();

  const handleStart = () => {
    playChime('success');
    navigateTo('language_select');
  };

  const handleAudioIntro = () => {
    speak('Welcome to KarigarAI. We help traditional artisans and handicraft makers price and sell products online using simple AI. Tap Get Started to choose your language.');
  };

  return (
    <div className="min-h-full flex flex-col justify-between p-6 bg-gradient-to-b from-amber-50 via-stone-50 to-orange-50/40 select-none">
      {/* Top Bar with Audio Guidance */}
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center space-x-1.5 bg-artisan-terracottaLight text-artisan-terracotta px-3 py-1 rounded-full text-xs font-black">
          <Sparkles className="w-3.5 h-3.5" />
          <span>KarigarAI Virtual Manager</span>
        </div>

        <button
          onClick={handleAudioIntro}
          className="p-2 rounded-full bg-artisan-marigoldLight text-artisan-marigold hover:bg-amber-200 transition-colors shadow-sm"
          title="Listen in English"
        >
          <Volume2 className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Hero Artisan Illustration Card */}
      <div className="my-auto py-4 flex flex-col items-center text-center">
        <div className="relative w-full max-w-xs aspect-square rounded-[36px] overflow-hidden shadow-2xl border-4 border-white mb-6 group">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80"
            alt="Artisan Crafting Handloom Saree"
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5 text-left">
            <span className="text-amber-300 text-xs font-black uppercase tracking-wider">
              Handcrafted in India
            </span>
            <p className="text-white text-sm font-bold mt-0.5">
              Empowering 100,000+ Master Weavers & Artisans
            </p>
          </div>
        </div>

        {/* Headlines */}
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 leading-tight tracking-tight">
          “Take your craft <br />
          <span className="text-artisan-terracotta underline decoration-amber-400 decoration-wavy decoration-2">
            to the world.
          </span>”
        </h1>

        <p className="text-stone-700 text-sm font-medium mt-3 max-w-xs leading-relaxed">
          {t('welcome_sub')}
        </p>
      </div>

      {/* Action Button */}
      <div className="pt-4 pb-2">
        <button
          onClick={handleStart}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-artisan-terracotta to-orange-500 text-white font-black text-base shadow-elevated flex items-center justify-center space-x-2 transition-all transform active:scale-95 hover:shadow-2xl"
        >
          <span>{t('btn_get_started')}</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
        <p className="text-center text-[11px] text-stone-700 font-semibold mt-2.5">
          ✓ 100% Free for Artisans • Voice & Regional Language Support
        </p>
      </div>
    </div>
  );
};
