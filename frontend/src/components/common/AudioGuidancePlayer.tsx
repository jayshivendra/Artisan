import React from 'react';
import { useVoice } from '../../context/VoiceContext.js';
import { Volume2, VolumeX, Play, Sparkles } from 'lucide-react';

interface AudioGuidancePlayerProps {
  title: string;
  speechText: string;
  hintText?: string;
}

export const AudioGuidancePlayer: React.FC<AudioGuidancePlayerProps> = ({
  title,
  speechText,
  hintText
}) => {
  const { speak, isSpeaking, stopSpeaking, playChime } = useVoice();

  const toggleSpeak = () => {
    playChime('tap');
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(speechText);
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-3.5 flex items-center justify-between shadow-sm my-2 select-none">
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleSpeak}
          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
            isSpeaking
              ? 'bg-artisan-terracotta text-white shadow-md animate-pulse'
              : 'bg-artisan-marigold text-stone-900 shadow-sm hover:scale-105 active:scale-95'
          }`}
          title="Play voice guide"
        >
          {isSpeaking ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5 stroke-[2.5]" />
          )}
        </button>

        <div>
          <div className="flex items-center space-x-1">
            <span className="font-bold text-stone-900 text-xs">{title}</span>
            <Sparkles className="w-3 h-3 text-amber-600" />
          </div>
          <p className="text-[11px] text-stone-700 font-medium line-clamp-1 mt-0.5">
            {hintText || speechText}
          </p>
        </div>
      </div>

      <button
        onClick={toggleSpeak}
        className="text-[11px] font-bold text-artisan-terracotta bg-white px-2.5 py-1 rounded-full border border-amber-200 shadow-sm hover:bg-amber-50 active:scale-95"
      >
        {isSpeaking ? 'Stop' : 'Listen 🔊'}
      </button>
    </div>
  );
};
