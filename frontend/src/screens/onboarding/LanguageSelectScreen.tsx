import React from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useVoice } from '../../context/VoiceContext.js';
import { SUPPORTED_LANGUAGES } from '../../data/translations.js';
import { LanguageCode } from '../../types/index.js';
import { Check, ArrowRight, Volume2, Globe } from 'lucide-react';

export const LanguageSelectScreen: React.FC = () => {
  const { navigateTo } = useAppState();
  const { language, setLanguage, t } = useLanguage();
  const { playChime, speak } = useVoice();

  const handleSelect = (lang: typeof SUPPORTED_LANGUAGES[0]) => {
    playChime('tap');
    setLanguage(lang.code);
    speak(lang.scriptSample, lang.voiceLang);
  };

  const handleContinue = () => {
    playChime('success');
    navigateTo('category_select');
  };

  return (
    <div className="min-h-full flex flex-col justify-between p-6 bg-stone-50 select-none">
      {/* Header */}
      <div className="pt-2">
        <div className="flex items-center space-x-2 text-artisan-indigo font-black text-xs uppercase tracking-wider mb-1">
          <Globe className="w-4 h-4" />
          <span>Step 1 of 3</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
          {t('choose_language')}
        </h2>
        <p className="text-xs text-stone-700 font-medium mt-1">
          {t('choose_language_sub')}
        </p>
      </div>

      {/* Language Selection Grid */}
      <div className="grid grid-cols-2 gap-3 my-4 overflow-y-auto max-h-[520px] pr-1 py-1">
        {SUPPORTED_LANGUAGES.map(lang => {
          const isSelected = language === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang)}
              className={`relative p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all transform active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-br from-artisan-terracottaLight to-orange-50 border-artisan-terracotta shadow-md'
                  : 'bg-white border-stone-200 hover:border-stone-300 shadow-sm'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-artisan-terracotta text-white flex items-center justify-center shadow">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              <div>
                <span className="text-xl font-black text-stone-900 block font-sans">
                  {lang.nativeName}
                </span>
                <span className="text-xs text-stone-700 font-bold block mt-0.5">
                  {lang.name}
                </span>
              </div>

              <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-700">
                <span className="font-semibold line-clamp-1">{lang.scriptSample}</span>
                <Volume2 className="w-3.5 h-3.5 text-artisan-terracotta shrink-0" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Button */}
      <div className="pt-2">
        <button
          onClick={handleContinue}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-artisan-terracotta to-orange-500 text-white font-black text-base shadow-elevated flex items-center justify-center space-x-2 transition-all transform active:scale-95 hover:shadow-2xl"
        >
          <span>{t('btn_continue')}</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
