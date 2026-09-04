import React, { useEffect, useRef } from 'react';
import { useVoice } from '../../context/VoiceContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { Volume2, VolumeX, Sparkles, HelpCircle } from 'lucide-react';

interface StepGuidanceBannerProps {
  stepNumber?: number;
  totalSteps?: number;
  title: string;
  guidanceText: string;
  autoSpeak?: boolean;
}

export const StepGuidanceBanner: React.FC<StepGuidanceBannerProps> = ({
  stepNumber,
  totalSteps,
  title,
  guidanceText,
  autoSpeak = true
}) => {
  const { speak, isSpeaking, stopSpeaking, playChime, isVoiceEnabled, toggleVoice } = useVoice();
  const { currentLanguageOption, t } = useLanguage();
  const hasAutoSpokenRef = useRef<boolean>(false);

  // Auto-speak on mount if voice guidance is enabled
  useEffect(() => {
    if (autoSpeak && isVoiceEnabled && !hasAutoSpokenRef.current && guidanceText) {
      hasAutoSpokenRef.current = true;
      const timer = setTimeout(() => {
        speak(guidanceText, currentLanguageOption.voiceLang);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [guidanceText, isVoiceEnabled, autoSpeak, currentLanguageOption, speak]);

  const handleToggleGuide = (e: React.MouseEvent) => {
    e.stopPropagation();
    playChime('tap');
    if (isVoiceEnabled) {
      stopSpeaking();
      toggleVoice();
    } else {
      toggleVoice();
      speak(guidanceText, currentLanguageOption.voiceLang, true);
    }
  };

  const handleListen = (e: React.MouseEvent) => {
    e.stopPropagation();
    playChime('tap');
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(guidanceText, currentLanguageOption.voiceLang, true);
    }
  };

  const stepLabel = stepNumber && totalSteps 
    ? `${t('step_prefix') || 'Step'} ${stepNumber} ${t('of_steps') || 'of'} ${totalSteps}`
    : null;

  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50/80 to-amber-100/60 border border-amber-200/90 rounded-2xl p-3.5 shadow-sm my-2 select-none transition-all">
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start space-x-2.5 flex-1 min-w-0">
          <button
            onClick={handleListen}
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-sm ${
              isSpeaking
                ? 'bg-artisan-terracotta text-white animate-pulse'
                : 'bg-artisan-marigold text-stone-900 hover:bg-amber-400'
            }`}
            title="Listen to this step guidance"
          >
            {isSpeaking ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              {stepLabel && (
                <span className="px-2 py-0.5 rounded-md bg-artisan-terracotta/10 text-artisan-terracotta text-[10px] font-black uppercase tracking-wider">
                  {stepLabel}
                </span>
              )}
              <h4 className="text-xs font-black text-stone-900 leading-tight">
                {title}
              </h4>
            </div>

            <p className="text-[11px] text-stone-700 font-medium leading-relaxed mt-1">
              {guidanceText}
            </p>
          </div>
        </div>

        {/* 1-Tap Voice Guide ON / OFF Switch */}
        <div className="flex flex-col items-end space-y-1 shrink-0">
          <button
            onClick={handleToggleGuide}
            className={`px-2.5 py-1 rounded-full text-[10px] font-black transition-all flex items-center space-x-1 shadow-sm active:scale-95 ${
              isVoiceEnabled
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-stone-200 hover:bg-stone-300 text-stone-700'
            }`}
            title={isVoiceEnabled ? 'Voice Guide is ON (Tap to Disable)' : 'Voice Guide is OFF (Tap to Enable)'}
          >
            {isVoiceEnabled ? (
              <>
                <Volume2 className="w-3 h-3" />
                <span>{t('guide_on') || 'Guide ON'}</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3 h-3 text-stone-500" />
                <span>{t('guide_off') || 'Guide OFF'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleListen}
            className="text-[10px] font-extrabold text-artisan-terracotta hover:underline pr-1"
          >
            {isSpeaking ? '⏹️ Stop' : `🔊 ${t('listen_guide') || 'Listen'}`}
          </button>
        </div>
      </div>
    </div>
  );
};
