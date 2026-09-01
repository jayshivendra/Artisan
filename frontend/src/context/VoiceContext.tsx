import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from './LanguageContext.js';

interface VoiceContextType {
  isListening: boolean;
  transcript: string;
  isSpeaking: boolean;
  startListening: (onResult?: (text: string) => void) => void;
  stopListening: () => void;
  speak: (text: string, langCode?: string) => void;
  stopSpeaking: () => void;
  playChime: (type?: 'success' | 'tap' | 'alert') => void;
  isAssistantModalOpen: boolean;
  setIsAssistantModalOpen: (open: boolean) => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentLanguageOption, language } = useLanguage();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isAssistantModalOpen, setIsAssistantModalOpen] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play pleasant acoustic feedback chimes for low literacy reassurance
  const playChime = useCallback((type: 'success' | 'tap' | 'alert' = 'tap') => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx();
        }
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        // Joyful ascending major chord chime
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.35); // C6
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === 'alert') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(330, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else {
        // Soft button tap
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (e) {
      console.warn('Audio chime warning:', e);
    }
  }, []);

  // Text-To-Speech
  const speak = useCallback((text: string, langCode?: string) => {
    if (!('speechSynthesis' in window) || !text) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voiceLang = langCode || currentLanguageOption.voiceLang || 'hi-IN';
      utterance.lang = voiceLang;
      utterance.rate = 0.95; // slightly slower for maximum clarity
      utterance.pitch = 1.05;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      setIsSpeaking(false);
    }
  }, [currentLanguageOption]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Speech Recognition (Voice-to-Text)
  const startListening = useCallback((onResult?: (text: string) => void) => {
    playChime('tap');
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech recognition not available in this browser. Using simulation fallback.');
      setIsListening(true);
      setTranscript('Processing voice...');
      setTimeout(() => {
        const samplePhrases: Record<string, string> = {
          te: 'ఇది స్వచ్ఛమైన చేనేత పోచంపల్లి పట్టు చీర. తయారు చేయడానికి 6 రోజులు పట్టింది. సహజ రంగులు మరియు జరీ అంచుతో నేయబడింది.',
          hi: 'यह शुद्ध हथकरघा पोचमपल्ली रेशम साड़ी है। इसे बनाने में 6 दिन का समय लगा है।',
          en: 'This is a handwoven pure silk Pochampally saree with natural dyes. Took 6 days to make on a traditional pit loom.'
        };
        const sampleText = samplePhrases[language] || samplePhrases.en;
        setTranscript(sampleText);
        setIsListening(false);
        if (onResult) onResult(sampleText);
      }, 2000);
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = currentLanguageOption.voiceLang || 'te-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
        if (event.results[0].isFinal && onResult) {
          onResult(currentText);
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn('Recognition start exception:', e);
      setIsListening(false);
    }
  }, [currentLanguageOption, language, playChime]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return (
    <VoiceContext.Provider
      value={{
        isListening,
        transcript,
        isSpeaking,
        startListening,
        stopListening,
        speak,
        stopSpeaking,
        playChime,
        isAssistantModalOpen,
        setIsAssistantModalOpen
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};
