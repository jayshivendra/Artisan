import React from 'react';
import { Mic, MicOff, Sparkles } from 'lucide-react';

interface VoiceButtonProps {
  isListening: boolean;
  onPress: () => void;
  label?: string;
  subLabel?: string;
  size?: 'normal' | 'large';
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isListening,
  onPress,
  label = 'Tap to Speak',
  subLabel = 'AI will listen and understand',
  size = 'large'
}) => {
  return (
    <div className="flex flex-col items-center justify-center my-3 select-none">
      <button
        onClick={onPress}
        type="button"
        className={`relative rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 ${
          size === 'large' ? 'w-24 h-24' : 'w-16 h-16'
        } ${
          isListening
            ? 'bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 text-white shadow-2xl scale-105'
            : 'bg-gradient-to-tr from-artisan-terracotta to-orange-500 text-white shadow-elevated hover:shadow-2xl'
        }`}
      >
        {/* Pulsating animated audio waves when listening */}
        {isListening && (
          <>
            <span className="absolute -inset-3 rounded-full bg-rose-500/40 animate-ping"></span>
            <span className="absolute -inset-6 rounded-full bg-amber-500/20 animate-pulse"></span>
          </>
        )}

        <div className="flex flex-col items-center justify-center relative z-10">
          {isListening ? (
            <Mic className={`${size === 'large' ? 'w-10 h-10' : 'w-7 h-7'} animate-bounce`} />
          ) : (
            <Mic className={`${size === 'large' ? 'w-10 h-10' : 'w-7 h-7'} stroke-[2.5]`} />
          )}
        </div>
      </button>

      <div className="text-center mt-3">
        <h4 className="font-extrabold text-stone-900 text-base flex items-center justify-center space-x-1.5">
          <span>{isListening ? 'Listening to your voice...' : label}</span>
          {!isListening && <Sparkles className="w-4 h-4 text-amber-500" />}
        </h4>
        <p className="text-xs text-stone-700 font-medium max-w-xs mt-0.5">
          {isListening ? 'Speak naturally in Telugu, Hindi, or any language' : subLabel}
        </p>
      </div>
    </div>
  );
};
