import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from './LanguageContext.js';
import { TRANSLATIONS } from '../data/translations.js';

interface VoiceContextType {
  isListening: boolean;
  transcript: string;
  isSpeaking: boolean;
  isVoiceEnabled: boolean;
  setIsVoiceEnabled: (enabled: boolean) => void;
  toggleVoice: () => void;
  startListening: (onResult?: (text: string) => void) => void;
  stopListening: () => void;
  speak: (text: string, langCode?: string, force?: boolean) => void;
  speakLocalizedKey: (translationKey: string, fallbackText?: string, force?: boolean) => void;
  stopSpeaking: () => void;
  playChime: (type?: 'success' | 'tap' | 'alert') => void;
  isAssistantModalOpen: boolean;
  setIsAssistantModalOpen: (open: boolean) => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

// Localized greetings and screen announcements for audio guidance in all languages
export const AUDIO_GUIDANCE_BY_LANG: Record<string, Record<string, string>> = {
  home: {
    en: "Welcome to KarigarConnect AI. You have 24 active products, 17 buyer leads, and total revenue of ₹24,500. Tap Create using Voice or Photo to add crafts.",
    hi: "कारीगर कनेक्ट में आपका स्वागत है। आपके 24 उत्पाद, 17 थोक खरीदार और ₹24,500 की कुल बिक्री है। उत्पाद जोड़ने के लिए फोटो या माइक बटन दबाएं।",
    te: "కారిగర్ కనెక్ట్ కు స్వాగతం. మీ వద్ద 24 ఉత్పత్తులు, 17 మంది కొనుగోలుదారులు మరియు ₹24,500 మొత్తం సేల్స్ ఉన్నాయి. ఫోటో లేదా వాయిస్ తో ప్రారంభించండి.",
    ta: "காரிகர் கனெக்ட்டிற்கு நல்வரவு. உங்களிடம் 24 தயாரிப்புகள், 17 மொத்த வாங்குவோர் மற்றும் ₹24,500 வருமானம் உள்ளது. குரல் அல்லது படம் மூலம் தொடங்கவும்.",
    kn: "ಕಾರಿಗಾರ್ ಕನೆಕ್ಟ್‌ಗೆ ಸುಸ್ವಾಗತ. ನಿಮ್ಮಲ್ಲಿ 24 ಉತ್ಪನ್ನಗಳು, 17 ಬೃಹತ್ ಖರೀದಿದಾರರು ಮತ್ತು ₹24,500 ಒಟ್ಟು ಆದಾಯವಿದೆ. ಧ್ವನಿ ಅಥವಾ ಫೋಟೋ ಬಳಸಿ.",
    bn: "কারিগর কানেক্টে স্বাগতম। আপনার 24টি পণ্য, 17টি ক্রেতার সন্ধান এবং মোট ₹24,500 বিক্রি রয়েছে। ছবি তুলুন বা মুখে বলুন।",
    mr: "कारीगर कनेक्ट मध्ये आपले स्वागत आहे. तुमची 24 उत्पादने, 17 घाऊक खरेदीदार आणि ₹24,500 विक्री आहे. नवीन वस्तू जोडण्यासाठी फोटो किंवा व्हॉइस वापरा.",
    gu: "કારીગર કનેક્ટમાં આપનું સ્વાગત છે. તમારી પાસે 24 પ્રોડક્ટ્સ, 17 ખરીદદારો અને ₹24,500 ની આવક છે. ફોટો અથવા અવાજથી પ્રોડક્ટ ઉમેરો.",
    ml: "കാരിഗർ കണക്റ്റിലേക്ക് സ്വാഗതം. നിങ്ങൾക്ക് 24 ഉൽപ്പന്നങ്ങളും 17 ബൾക്ക് ബയർമാരും ₹24,500 വരുമാനവുമുണ്ട്. ഫോട്ടോയോ ശബ്ദമോ ഉപയോഗിക്കുക.",
    pa: "ਕਾਰੀਗਰ ਕਨੈਕਟ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ। ਤੁਹਾਡੇ ਕੋਲ 24 ਉਤਪਾਦ, 17 ਥੋਕ ਖਰੀਦਦਾਰ ਅਤੇ ₹24,500 ਦੀ ਵਿਕਰੀ ਹੈ। ਫੋਟੋ ਜਾਂ ਆਵਾਜ਼ ਨਾਲ ਸ਼ੁਰੂ ਕਰੋ।"
  },
  step1: {
    en: "Step 1: Take or upload a photo of your craft. Even with a messy domestic room, our AI will clean and enhance it.",
    hi: "पहला चरण: अपने उत्पाद की फोटो खींचें या अपलोड करें। घरेलू बैकग्राउंड को AI अपने आप साफ़ कर देगा।",
    te: "మొదటి దశ: మీ వస్తువు ఫోటో తీయండి లేదా అప్‌లోడ్ చేయండి. సాధారణ బ్యాక్‌గ్రౌండ్‌ను AI తొలగించి అందంగా మారుస్తుంది.",
    ta: "படி 1: உங்கள் தயாரிப்பின் புகைப்படத்தை எடுக்கவும். பின்னணியை AI தானாகவே தூய்மைப்படுத்தி அழகாக்கும்.",
    kn: "ಹಂತ 1: ನಿಮ್ಮ ಕಲೆಯ ಫೋಟೋ ತೆಗೆಯಿರಿ ಅಥವಾ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. ಹಿನ್ನೆಲೆಯನ್ನು AI ಸ್ವಚ್ಛಗೊಳಿಸುತ್ತದೆ.",
    bn: "ধাপ ১: আপনার হস্তশিল্পের ছবি তুলুন বা আপলোড করুন। পেছনের ঘরোয়া পটভূমি AI সুন্দর করে দেবে।",
    mr: "पायरी 1: आपल्या उत्पादनाचा फोटो काढा किंवा अपलोड करा. अस्वच्छ पार्श्वभूमी AI काढून टाकेल.",
    gu: "પગલું 1: તમારા ઉત્પાદનનો ફોટો લો અથવા અપલોડ કરો. સાદો બેકગ્રાઉન્ડ AI સાફ કરી દેશે.",
    ml: "ഘട്ടം 1: നിങ്ങളുടെ ഉൽപ്പന്നത്തിന്റെ ഫോട്ടോ എടുക്കുക. പശ്ചാത്തലം AI സ്വയം വൃത്തിയാക്കും.",
    pa: "ਪੜਾਅ 1: ਆਪਣੇ ਉਤਪਾਦ ਦੀ ਫੋਟੋ ਖਿੱਚੋ ਜਾਂ ਅਪਲੋਡ ਕਰੋ। AI ਪਿਛੋਕੜ ਨੂੰ ਬਿਲਕੁਲ ਸਾਫ਼ ਕਰ ਦੇਵੇਗਾ।"
  },
  step2: {
    en: "Step 2: AI Photo Studio has removed the background, balanced lighting to 5500K daylight, and added realistic soft shadows.",
    hi: "दूसरा चरण: AI स्टूडियो ने बैकग्राउंड हटा दिया है, रोशनी संतुलित की है और प्राकृतिक शैडो जोड़ दी है।",
    te: "రెండవ దశ: AI స్టూడియో బ్యాక్‌గ్రౌండ్‌ను తొలగించి, వెలుతురును సరిచేసి సహజమైన నీడను జోడించింది.",
    ta: "படி 2: AI ஸ்டுடியோ பின்னணியை நீக்கி, ஸ்டுடியோ வெளிச்சத்தை சமன் செய்துள்ளது.",
    kn: "ಹಂತ 2: AI ಸ್ಟುಡಿಯೋ ಹಿನ್ನೆಲೆಯನ್ನು ತೆಗೆದುಹಾಕಿ, ಲೈಟಿಂಗ್ ಸರಿಪಡಿಸಿದೆ.",
    bn: "ধাপ ২: AI স্টুডিও ব্যাকগ্রাউন্ড সরিয়ে পেশাদার আলো ও ছায়া যোগ করেছে।",
    mr: "पायरी 2: AI स्टुडिओने बॅकग्राउंड काढून प्रकाश संतुलित केला आहे.",
    gu: "પગલું 2: AI સ્ટુડિયોએ બેકગ્રાઉન્ડ દૂર કરી સ્ટુડિયો લાઇટિંગ સેટ કર્યું છે.",
    ml: "ഘട്ടം 2: AI സ്റ്റുഡിയോ പശ്ചാത്തലം മാറ്റി സ്റ്റുഡിയോ വെളിച്ചം ക്രമീകരിച്ചു.",
    pa: "ਪੜਾਅ 2: AI ਸਟੂਡੀਓ ਨੇ ਪਿਛੋਕੜ ਹਟਾ ਕੇ ਲਾਈਟਿੰਗ ਠੀਕ ਕਰ ਦਿੱਤੀ ਹੈ।"
  },
  step3: {
    en: "Step 3: Press Speak and describe your product in your mother tongue. Tell us what it is, the material used, and time taken.",
    hi: "तीसरा चरण: माइक दबाएं और अपनी भाषा में उत्पाद के बारे में बताएं। क्या सामग्री है और बनाने में कितने दिन लगे।",
    te: "మూడవ దశ: మైక్ నొక్కి మీ మాతృభాషలో మాట్లాడండి. ఇది ఏమిటి, ఏ పదార్థంతో చేశారు, ఎన్ని రోజులు పట్టిందో చెప్పండి.",
    ta: "படி 3: மைக்கை அழுத்தி உங்கள் மொழியில் பேசுங்கள். இது என்ன, என்ன பொருள், எத்தனை நாட்கள் ஆனது என்று சொல்லுங்கள்.",
    kn: "ಹಂತ 3: ಮೈಕ್ ಒತ್ತಿ ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಿ. ಇದು ಏನು, ಯಾವ ವಸ್ತು ಮತ್ತು ಎಷ್ಟು ದಿನ ಆಯಿತು ಎಂದು ತಿಳಿಸಿ.",
    bn: "ধাপ ৩: মাইক টিপুন এবং নিজের ভাষায় বলুন। এটি কী, কী উপাদান দিয়ে তৈরি এবং কত দিন লেগেছে।",
    mr: "पायरी 3: माइक दाबा आणि आपल्या भाषेत सांगा. काय वस्तू आहे, काय साहित्य लागले आणि किती दिवस लागले.",
    gu: "પગલું 3: માઇક દબાવો અને તમારી ભાષામાં કહો. આ શું છે, કઈ સામગ્રી વપરાઈ અને કેટલા દિવસ લાગ્યા.",
    ml: "ഘട്ടം 3: മൈക്ക് അമർത്തി നിങ്ങളുടെ ഭാഷയിൽ സംസാരിക്കുക. എന്താണ് ഉൽപ്പന്നം, ഉണ്ടാക്കാൻ എത്ര സമയമെടുത്തു എന്ന് പറയുക.",
    pa: "ਪੜਾਅ 3: ਮਾਈਕ ਦਬਾਓ ਅਤੇ ਆਪਣੀ ਬੋਲੀ ਵਿੱਚ ਦੱਸੋ। ਇਹ ਕੀ ਹੈ, ਕਿਹੜਾ ਮਟੀਰੀਅਲ ਹੈ ਅਤੇ ਕਿੰਨੇ ਦਿਨ ਲੱਗੇ।"
  },
  buyers: {
    en: "Find Buyers: 17 bulk buyers looking for handmade crafts. Tap Submit Wholesale Proposal to connect directly.",
    hi: "थोक खरीदार खोजें: 17 थोक खरीदार हस्तशिल्प खोज रहे हैं। सीधे जुड़ने के लिए प्रस्ताव भेजें बटन दबाएं।",
    te: "కొనుగోలుదారులు: మీ హస్తకళల కోసం 17 మంది పెద్ద కొనుగోలుదారులు సిద్ధంగా ఉన్నారు. హోల్‌సేల్ ప్రతిపాదనను పంపండి.",
    ta: "மொத்த வாங்குவோர்: உங்கள் கைவினைப் பொருட்களுக்காக 17 வாங்குவோர் காத்திருக்கிறார்கள். விலைப்பட்டியல் அனுப்பவும்.",
    kn: "ಖರೀದಿದಾರರು: ನಿಮ್ಮ ಕರಕುಶಲ ವಸ್ತುಗಳಿಗೆ 17 ಖರೀದಿದಾರರಿದ್ದಾರೆ. ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಲು ಪ್ರಸ್ತಾಪ ಕಳುಹಿಸಿ.",
    bn: "ক্রেতা খুঁজুন: হস্তশিল্পের জন্য 17টি পাইকারি ক্রেতার চাহিদা রয়েছে। সরাসরি যোগাযোগ করতে প্রস্তাব পাঠান।",
    mr: "घाऊक खरेदीदार: आपल्या हस्तकलेसाठी 17 खरेदीदार तयार आहेत. थेट जोडण्यासाठी कोटेशन पाठवा.",
    gu: "જથ્થાબંધ ખરીદદારો: તમારી હસ્તકલા માટે 17 ખરીદદારો ઉપલબ્ધ છે. સીધો પ્રસ્તાવ મોકલો.",
    ml: "ബൾക്ക് ബയർമാർ: നിങ്ങളുടെ ഉൽപ്പന്നങ്ങൾക്കായി 17 വാങ്ങുന്നവർ തയ്യാറാണ്. നിർദ്ദേശം അയക്കുക.",
    pa: "ਥੋਕ ਖਰੀਦਦਾਰ: ਤੁਹਾਡੇ ਲਈ 17 ਖਰੀਦਦਾਰ ਤਿਆਰ ਹਨ। ਸਿੱਧਾ ਸੰਪਰਕ ਕਰਨ ਲਈ ਪ੍ਰਸਤਾਵ ਭੇਜੋ।"
  }
};

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentLanguageOption, language } = useLanguage();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isAssistantModalOpen, setIsAssistantModalOpen] = useState<boolean>(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const recognitionRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize and load speech synthesis voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          setAvailableVoices(voices);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Play acoustic feedback chimes
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
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1);
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2);
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.35);
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

  // Find best available voice on mobile/desktop for the given language code
  const findBestVoice = useCallback((targetLang: string): SpeechSynthesisVoice | null => {
    if (!availableVoices || availableVoices.length === 0) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        return null;
      }
      return null;
    }

    const langNormalized = targetLang.replace('_', '-').toLowerCase();
    const shortCode = langNormalized.split('-')[0];

    // 1. Exact BCP-47 match (e.g. "te-IN")
    const exact = availableVoices.find(v => v.lang.replace('_', '-').toLowerCase() === langNormalized);
    if (exact) return exact;

    // 2. Language prefix match (e.g. starts with "te")
    const prefixMatch = availableVoices.find(v => v.lang.toLowerCase().startsWith(shortCode));
    if (prefixMatch) return prefixMatch;

    // 3. Indian English / Indian voice fallback
    const indianVoice = availableVoices.find(v => v.lang.toLowerCase().includes('in'));
    if (indianVoice) return indianVoice;

    // 4. Default voice
    return availableVoices[0] || null;
  }, [availableVoices]);

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const [isVoiceEnabled, setIsVoiceEnabledState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('karigar_voice_enabled');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });

  const stopSpeaking = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const setIsVoiceEnabled = useCallback((enabled: boolean) => {
    setIsVoiceEnabledState(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem('karigar_voice_enabled', enabled ? 'true' : 'false');
    }
    if (!enabled) {
      stopSpeaking();
    }
  }, [stopSpeaking]);

  const toggleVoice = useCallback(() => {
    setIsVoiceEnabledState(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('karigar_voice_enabled', next ? 'true' : 'false');
      }
      if (!next) {
        stopSpeaking();
      }
      return next;
    });
  }, [stopSpeaking]);

  const speakWithBrowserSynthesis = useCallback((text: string, targetLang: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSpeaking(false);
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = targetLang;
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      const voice = findBestVoice(targetLang);
      if (voice) utterance.voice = voice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsSpeaking(false);
    }
  }, [findBestVoice]);

  // Robust Text-To-Speech with full mobile compatibility across all Indian languages
  const speak = useCallback((text: string, langCode?: string, force: boolean = false) => {
    if (!text) return;
    if (!isVoiceEnabled && !force) return; // Audio guidance / Voice instructor is muted!

    stopSpeaking();
    setIsSpeaking(true);

    const targetLang = langCode || currentLanguageOption.voiceLang || 'hi-IN';
    const shortLang = targetLang.split('-')[0]; // 'te', 'ta', 'kn', 'bn', 'hi', 'en', etc.

    // 1. Stream high-fidelity native audio (guarantees Telugu, Tamil, Kannada, Bengali, etc. are heard)
    try {
      const cleanText = text.replace(/[\n\r]/g, ' ').trim().slice(0, 200);
      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${shortLang}&q=${encodeURIComponent(cleanText)}`;
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        currentAudioRef.current = null;
      };

      audio.onerror = () => {
        currentAudioRef.current = null;
        speakWithBrowserSynthesis(text, targetLang);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          currentAudioRef.current = null;
          speakWithBrowserSynthesis(text, targetLang);
        });
      }
    } catch (e) {
      speakWithBrowserSynthesis(text, targetLang);
    }
  }, [currentLanguageOption, isVoiceEnabled, stopSpeaking, speakWithBrowserSynthesis]);

  // Localized key announcement helper
  const speakLocalizedKey = useCallback((translationKey: string, fallbackText?: string, force?: boolean) => {
    const translation = TRANSLATIONS[language]?.[translationKey] || fallbackText || '';
    if (translation) {
      speak(translation, currentLanguageOption.voiceLang, force);
    }
  }, [language, currentLanguageOption, speak]);

  // Speech Recognition (Voice-to-Text) with full fallback support
  const startListening = useCallback((onResult?: (text: string) => void) => {
    playChime('tap');
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech recognition not natively supported on this browser. Providing localized fallback.');
      setIsListening(true);
      setTranscript('Listening...');

      setTimeout(() => {
        const samplePhrases: Record<string, string> = {
          te: 'ఇది సహజ వెదురుతో చేసిన నిల్వ బుట్ట. ఇది చేతితో నేయబడింది మరియు 2 రోజులు పట్టింది. బట్టలు మరియు గృహ వస్తువులు దాచడానికి ఉపయోగించవచ్చు.',
          hi: 'यह टोकरी प्राकृतिक बांस से बनी है। यह पूरी तरह से हस्तनिर्मित है और इसे बनाने में दो दिन का समय लगता है। इसका उपयोग कपड़े और घरेलू सामान रखने के लिए किया जा सकता है।',
          ta: 'இந்த கூடை மூங்கிலால் செய்யப்பட்டது. இது கையால் நெய்யப்பட்டு செய்ய 2 நாட்கள் ஆனது. துணிகள் மற்றும் வீட்டு பொருட்களை வைக்க பயன்படுத்தலாம்.',
          kn: 'ಈ ಬುಟ್ಟಿ ನೈಸರ್ಗಿಕ ಬಿದಿರಿನಿಂದ ಮಾಡಲ್ಪಟ್ಟಿದೆ. ಇದು ಕೈಯಿಂದ ನೇಯ್ದಿದ್ದು, ತಯಾರಿಸಲು 2 ದಿನಗಳು ಬೇಕಾಗುತ್ತದೆ.',
          bn: 'এই ঝুড়িটি প্রাকৃতিক বাঁশ দিয়ে তৈরি। এটি হস্তনির্মিত এবং তৈরি করতে দুই দিন সময় লেগেছে।',
          mr: 'ही टोपली नैसर्गिक बांबूपासून बनवली आहे. ही हाताने विणलेली असून बनवायला दोन दिवस लागले आहेत.',
          gu: 'આ ટોપલી કુદરતી વાંસમાંથી બનેલી છે. આ હાથથી વણેલી છે અને બનાવતા બે દિવસ થયા છે.',
          ml: 'ഈ കൊട്ട പ്രകൃതിദത്ത മുള കൊണ്ടാണ് ഉണ്ടാക്കിയത്. ഇത് കൈകൊണ്ട് നിർമ്മിച്ചതാണ്, ഉണ്ടാക്കാൻ 2 ദിവസമെടുത്തു.',
          pa: 'ਇਹ ਟੋਕਰੀ ਕੁਦਰਤੀ ਬਾਂਸ ਤੋਂ ਬਣੀ ਹੈ। ਇਹ ਹੱਥ ਨਾਲ ਬੁਣੀ ਹੋਈ ਹੈ ਅਤੇ ਬਣਾਉਣ ਵਿੱਚ ਦੋ ਦਿਨ ਲੱਗੇ ਹਨ।',
          en: 'This basket is made from natural bamboo. It is 100% handmade and takes two days of weaving. It can be used for storing clothes and household items.'
        };
        const sampleText = samplePhrases[language] || samplePhrases.en;
        setTranscript(sampleText);
        setIsListening(false);
        if (onResult) onResult(sampleText);
      }, 1500);
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = currentLanguageOption.voiceLang || 'hi-IN';

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
        isVoiceEnabled,
        setIsVoiceEnabled,
        toggleVoice,
        startListening,
        stopListening,
        speak,
        speakLocalizedKey,
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
