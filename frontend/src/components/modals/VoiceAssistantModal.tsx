import React, { useState, useEffect } from 'react';
import { useVoice } from '../../context/VoiceContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useAppState } from '../../context/AppStateContext.js';
import { Mic, X, Sparkles, ArrowRight, Volume2, CheckCircle2 } from 'lucide-react';
import { LanguageCode } from '../../types/index.js';

export const VoiceAssistantModal: React.FC = () => {
  const {
    isAssistantModalOpen,
    setIsAssistantModalOpen,
    isListening,
    startListening,
    stopListening,
    transcript,
    speak,
    playChime
  } = useVoice();
  const { language, setLanguage, currentLanguageOption } = useLanguage();
  const { navigateTo, resetProductDraft, setIsLiveDemoOpen } = useAppState();

  const [assistantText, setAssistantText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [actionExecutedBadge, setActionExecutedBadge] = useState<string | null>(null);

  useEffect(() => {
    if (isAssistantModalOpen) {
      setActionExecutedBadge(null);
      const greetings: Record<string, string> = {
        te: 'నమస్కారం! నేను మీ వ్యాపార సహాయకుడిని. మీరు ఏమి చేయాలనుకుంటున్నారు? "వస్తువు చేర్చు", "కొనుగోలుదారులను వెతుకు", "సేల్స్ చూపించు" అని చెప్పండి.',
        hi: 'नमस्ते! मैं आपका डिजिटल व्यापार सहायक हूँ। आप क्या करना चाहेंगे? "नया उत्पाद जोड़ें", "खरीदार खोजें", या "ऑर्डर दिखाओ" बोलें।',
        ta: 'வணக்கம்! நான் உங்கள் வியாபார உதவியாளர். "தயாரிப்பு சேர்", "வாங்குவோரை தேடு" அல்லது "விற்பனை" என்று சொல்லுங்கள்.',
        kn: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ವ್ಯಾಪಾರ ಸಹಾಯಕ. "ವಸ್ತು ಸೇರಿಸಿ", "ಖರೀದಿದಾರರನ್ನು ಹುಡುಕಿ" ಎಂದು ಹೇಳಿ.',
        bn: 'নমস্কার! আমি আপনার ডিজিটাল সহকারী। "পণ্য যোগ করুন", "পাইকারি ক্রেতা" বা "অর্ডার" বলুন।',
        mr: 'नमस्कार! मी आपला डिजिटल सहाय्यक आहे. "नवीन वस्तू जोडा", "खरेदीदार शोधा" किंवा "ऑर्डर्स" बोला.',
        gu: 'નમસ્તે! હું તમારો વ્યાપાર સહાયક છું. "પ્રોડક્ટ ઉમેરો", "ખરીદદારો શોધો" કહો.',
        ml: 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ സഹായിയാണ്. "ഉൽപ്പന്നം ചേർക്കുക", "ബയർമാരെ കണ്ടെത്തുക" എന്ന് പറയുക.',
        pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਬਿਜ਼ਨੈਸ ਮੈਨੇਜਰ ਹਾਂ। "ਉਤਪਾਦ ਜੋੜੋ", "ਖਰੀਦਦਾਰ ਲੱਭੋ" ਬੋਲੋ।',
        en: "Namaste! I'm your AI Business Manager. Say 'Add Product', 'Find Buyers', 'Show Orders', or 'Check Sales'."
      };
      setAssistantText(greetings[language] || greetings.en);
    }
  }, [isAssistantModalOpen, language]);

  if (!isAssistantModalOpen) return null;

  const executeAction = (queryRaw: string) => {
    setIsProcessing(true);
    const query = queryRaw.toLowerCase().trim();

    // 1. ADD PRODUCT / TAKE PHOTO / CAMERA
    if (
      query.includes('add') || 
      query.includes('product') || 
      query.includes('camera') || 
      query.includes('photo') || 
      query.includes('picture') || 
      query.includes('shoot') ||
      query.includes('फोटो') || 
      query.includes('उत्पाद') || 
      query.includes('जोड़ें') ||
      query.includes('ఫోటో') || 
      query.includes('వస్తువు') || 
      query.includes('చేర్చు') ||
      query.includes('படம்') ||
      query.includes('வಸ್ತು')
    ) {
      const resp: Record<string, string> = {
        te: 'కెమెరా తెరుస్తున్నాము! మీ చేతికళ ఫోటో తీయండి.',
        hi: 'कैमरा खोल रहे हैं! अपने हस्तशिल्प की एक फोटो खींचें।',
        ta: 'கேமரா திறக்கப்படுகிறது! தயாரிப்பின் புகைப்படம் எடுக்கவும்.',
        en: 'Opening camera! Take ONE photo of your craft.'
      };
      const textToSpeak = resp[language] || resp.en;
      setAssistantText(textToSpeak);
      setActionExecutedBadge('Opening Add Product Wizard...');
      playChime('success');
      speak(textToSpeak, currentLanguageOption.voiceLang);

      setTimeout(() => {
        setIsProcessing(false);
        setIsAssistantModalOpen(false);
        resetProductDraft();
        navigateTo('add_product');
      }, 1400);
      return;
    }

    // 2. FIND BUYERS / B2B WHOLESALE
    if (
      query.includes('buyer') || 
      query.includes('buyers') || 
      query.includes('wholesale') || 
      query.includes('b2b') || 
      query.includes('bulk') || 
      query.includes('retailer') ||
      query.includes('hotel') ||
      query.includes('खरीदार') || 
      query.includes('थोक') || 
      query.includes('बायर्स') ||
      query.includes('కొనుగోలు') || 
      query.includes('హోల్‌సేల్') || 
      query.includes('బయ్యర్స్') ||
      query.includes('வாங்குவோர்') ||
      query.includes('ಖರೀದಿದಾರ')
    ) {
      const resp: Record<string, string> = {
        te: 'హోల్‌సేల్ కొనుగోలుదారుల పేజీకి తీసుకెళ్తున్నాము. 17 మంది పెద్ద కొనుగోలుదారులు సిద్ధంగా ఉన్నారు!',
        hi: 'थोक खरीदारों का पेज खोल रहे हैं। 17 सत्यापित बल्क खरीदार तैयार हैं!',
        ta: 'மொத்த வாங்குவோர் பக்கம் திறக்கப்படுகிறது. 17 வாங்குவோர் தயாராக உள்ளனர்!',
        en: 'Opening Wholesale Buyers page! 17 verified bulk buyers ready to order.'
      };
      const textToSpeak = resp[language] || resp.en;
      setAssistantText(textToSpeak);
      setActionExecutedBadge('Navigating to B2B Buyers...');
      playChime('success');
      speak(textToSpeak, currentLanguageOption.voiceLang);

      setTimeout(() => {
        setIsProcessing(false);
        setIsAssistantModalOpen(false);
        navigateTo('find_buyers');
      }, 1400);
      return;
    }

    // 3. SHOW MY PRODUCTS / CATALOG
    if (
      query.includes('my products') || 
      query.includes('catalog') || 
      query.includes('inventory') || 
      query.includes('stock') ||
      query.includes('मेरे उत्पाद') || 
      query.includes('कैटलॉग') ||
      query.includes('నా వస్తువులు') || 
      query.includes('వస్తువుల జాబితా') ||
      query.includes('தயாரிப்புகள்')
    ) {
      const resp: Record<string, string> = {
        te: 'మీ ఉత్పత్తుల జాబితాను చూపిస్తున్నాము. మీ వద్ద 24 ఉత్పత్తులు లైవ్ ఉన్నాయి.',
        hi: 'आपके सभी उत्पादों की सूची दिखा रहे हैं। आपके 24 उत्पाद लाइव हैं।',
        en: 'Showing your product catalog! You have 24 live products.'
      };
      const textToSpeak = resp[language] || resp.en;
      setAssistantText(textToSpeak);
      setActionExecutedBadge('Opening My Products...');
      playChime('success');
      speak(textToSpeak, currentLanguageOption.voiceLang);

      setTimeout(() => {
        setIsProcessing(false);
        setIsAssistantModalOpen(false);
        navigateTo('my_products');
      }, 1400);
      return;
    }

    // 4. ORDERS & SHIPMENTS
    if (
      query.includes('order') || 
      query.includes('orders') || 
      query.includes('dispatch') || 
      query.includes('shipping') || 
      query.includes('courier') ||
      query.includes('ऑर्डर') || 
      query.includes('डिलीवरी') ||
      query.includes('ఆర్డర్') || 
      query.includes('డెలివరీ') ||
      query.includes('ஆர்டர்')
    ) {
      const resp: Record<string, string> = {
        te: 'మీ కస్టమర్ ఆర్డర్‌లను చూపిస్తున్నాము. 8 ఆర్డర్‌లు పూర్తయ్యాయి.',
        hi: 'आपके ग्राहक ऑर्डर खोल रहे हैं। 8 ऑर्डर सफलतापूर्वक पूरे हुए हैं।',
        en: 'Opening your Orders! You have completed 8 customer orders.'
      };
      const textToSpeak = resp[language] || resp.en;
      setAssistantText(textToSpeak);
      setActionExecutedBadge('Opening Orders...');
      playChime('success');
      speak(textToSpeak, currentLanguageOption.voiceLang);

      setTimeout(() => {
        setIsProcessing(false);
        setIsAssistantModalOpen(false);
        navigateTo('orders');
      }, 1400);
      return;
    }

    // 5. SALES & REVENUE
    if (
      query.includes('sale') || 
      query.includes('sales') || 
      query.includes('revenue') || 
      query.includes('income') || 
      query.includes('earning') || 
      query.includes('money') ||
      query.includes('कमाई') || 
      query.includes('बिक्री') || 
      query.includes('रुपये') ||
      query.includes('సేల్స్') || 
      query.includes('ఆదాయం') || 
      query.includes('డబ్బులు') ||
      query.includes('வருமானம்')
    ) {
      const resp: Record<string, string> = {
        te: 'మీ మొత్తం ఆదాయం ₹24,500. సేల్స్ అనలిటిక్స్ తెరుస్తున్నాము.',
        hi: 'आपकी कुल कमाई ₹24,500 है। बिक्री विश्लेषण खोल रहे हैं।',
        en: 'Your total revenue is ₹24,500 with a 32% increase this month. Opening Sales Dashboard.'
      };
      const textToSpeak = resp[language] || resp.en;
      setAssistantText(textToSpeak);
      setActionExecutedBadge('Opening Sales Analytics...');
      playChime('success');
      speak(textToSpeak, currentLanguageOption.voiceLang);

      setTimeout(() => {
        setIsProcessing(false);
        setIsAssistantModalOpen(false);
        navigateTo('sales_dashboard');
      }, 1400);
      return;
    }

    // 6. SIH JUDGE LIVE DEMO
    if (
      query.includes('demo') || 
      query.includes('judge') || 
      query.includes('sih') || 
      query.includes('presentation') ||
      query.includes('डेमो')
    ) {
      const textToSpeak = 'Launching the 8-Scene SIH Live Judge Demo Walkthrough!';
      setAssistantText(textToSpeak);
      setActionExecutedBadge('Launching SIH Judge Demo...');
      playChime('success');
      speak(textToSpeak, 'en-IN');

      setTimeout(() => {
        setIsProcessing(false);
        setIsAssistantModalOpen(false);
        setIsLiveDemoOpen(true);
      }, 1200);
      return;
    }

    // 7. CHANGE LANGUAGE COMMANDS
    if (query.includes('telugu') || query.includes('తెలుగు')) {
      setLanguage('te');
      const textToSpeak = 'భాష తెలుగుగా మార్చబడింది.';
      setAssistantText(textToSpeak);
      playChime('success');
      speak(textToSpeak, 'te-IN');
      setIsProcessing(false);
      return;
    }
    if (query.includes('hindi') || query.includes('हिन्दी') || query.includes('हिंदी')) {
      setLanguage('hi');
      const textToSpeak = 'भाषा हिंदी में बदल दी गई है।';
      setAssistantText(textToSpeak);
      playChime('success');
      speak(textToSpeak, 'hi-IN');
      setIsProcessing(false);
      return;
    }
    if (query.includes('english')) {
      setLanguage('en');
      const textToSpeak = 'Language changed to English.';
      setAssistantText(textToSpeak);
      playChime('success');
      speak(textToSpeak, 'en-IN');
      setIsProcessing(false);
      return;
    }

    // 8. PRICING ASSISTANCE / QUESTIONS
    if (
      query.includes('price') || 
      query.includes('cost') || 
      query.includes('rate') ||
      query.includes('दाम') || 
      query.includes('कीमत') ||
      query.includes('ధర') || 
      query.includes('ఖరీదు')
    ) {
      const resp: Record<string, string> = {
        te: 'AI న్యాయమైన ధరను గణిస్తుంది: ముడిసరుకు ₹350 + 2 రోజుల కూలీ ₹300 + ప్యాకేజింగ్ ₹50 = బేస్ ఖర్చు ₹800. సిఫార్సు చేసిన అమ్మకపు ధర ₹899 నుండి ₹999.',
        hi: 'AI सही दाम बताता है: कच्चा माल ₹350 + 2 दिन की मजदूरी ₹300 + पैकेजिंग ₹50 = मूल लागत ₹800। अनुशंसित विक्रय मूल्य ₹899 से ₹999 है।',
        en: 'AI calculates fair pricing: Raw material ₹350 + 2 days labour ₹300 + packaging ₹50 = Base cost ₹800. Suggested price range is ₹899 to ₹999.'
      };
      const textToSpeak = resp[language] || resp.en;
      setAssistantText(textToSpeak);
      playChime('success');
      speak(textToSpeak, currentLanguageOption.voiceLang);
      setIsProcessing(false);
      return;
    }

    // GENERAL FALLBACK WITH HELPFUL ACTIONS
    const fallbackResp: Record<string, string> = {
      te: 'మీరు 24 ఉత్పత్తులు మరియు ₹24,500 అమ్మకాలు కలిగి ఉన్నారు. నేను మీకు ఎలా సహాయపడగలను?',
      hi: 'आपके 24 उत्पाद और ₹24,500 की बिक्री है। आप क्या करना चाहते हैं?',
      en: 'You have 24 active products, 17 buyer leads, and ₹24,500 total revenue. How can I assist you?'
    };
    const textToSpeak = fallbackResp[language] || fallbackResp.en;
    setAssistantText(textToSpeak);
    speak(textToSpeak, currentLanguageOption.voiceLang);
    setIsProcessing(false);
  };

  const handleStartVoice = () => {
    startListening((resultText: string) => {
      executeAction(resultText);
    });
  };

  const sampleCommands = [
    { label: '📸 Add a new product', query: 'Add a new product' },
    { label: '🤝 Find wholesale buyers', query: 'Find bulk wholesale buyers' },
    { label: '💰 Check my revenue', query: 'Check my sales revenue' },
    { label: '🛍️ Show my customer orders', query: 'Show my orders' },
    { label: '🏷️ How does pricing AI work?', query: 'How does fair price work?' },
    { label: '🏆 Launch SIH Judge Demo', query: 'Start live demo' }
  ];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex flex-col justify-end p-2 sm:p-4 animate-in fade-in duration-200 select-none">
      <div className="bg-white w-full rounded-3xl p-5 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto border border-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-artisan-indigo via-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-base leading-tight">
                AI Business Assistant
              </h3>
              <p className="text-[11px] text-stone-500 font-medium">
                Speaks & Listens in Your Language
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAssistantModalOpen(false)}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action badge if triggered */}
        {actionExecutedBadge && (
          <div className="mt-2.5 p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black flex items-center space-x-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionExecutedBadge}</span>
          </div>
        )}

        {/* AI Message Bubble */}
        <div className="bg-gradient-to-br from-indigo-50/80 to-blue-50/40 border border-indigo-100/80 rounded-2xl p-4 my-3 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="w-7 h-7 rounded-lg bg-artisan-indigo text-white flex items-center justify-center shrink-0 mt-0.5">
              <Volume2 className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-artisan-indigo block">
                Assistant Response
              </span>
              <p className="text-sm font-bold text-stone-900 mt-1 leading-relaxed">
                {assistantText}
              </p>
            </div>
          </div>
        </div>

        {/* Live Listening Waves */}
        {isListening && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 my-2 flex items-center justify-center space-x-2 text-amber-800 animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
            <span className="text-xs font-black">Listening to your voice... Speak now!</span>
          </div>
        )}

        {/* Spoken transcript if any */}
        {transcript && (
          <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 italic mb-2">
            "{transcript}"
          </div>
        )}

        {/* Prominent Microphone Trigger */}
        <div className="my-2">
          <button
            onClick={isListening ? stopListening : handleStartVoice}
            disabled={isProcessing}
            className={`w-full py-4 rounded-2xl font-black text-sm shadow-elevated flex items-center justify-center space-x-2.5 transition-all transform active:scale-95 ${
              isListening
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-gradient-to-r from-artisan-terracotta via-orange-500 to-amber-500 text-white hover:shadow-xl'
            }`}
          >
            <Mic className={`w-5 h-5 ${isListening ? 'animate-spin' : ''}`} />
            <span>{isListening ? 'Tap to Finish Speaking' : '🎙️ Speak Command (Tap & Talk)'}</span>
          </button>
        </div>

        {/* Quick 1-Tap Voice Commands */}
        <div className="mt-3">
          <span className="text-[10px] font-black text-stone-600 uppercase tracking-wider block mb-2">
            Or tap any action to execute immediately:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sampleCommands.map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => executeAction(cmd.query)}
                className="text-left p-3 rounded-xl bg-stone-50 hover:bg-amber-50 text-stone-800 hover:text-amber-950 font-extrabold text-xs border border-stone-200 transition-colors flex items-center justify-between"
              >
                <span>{cmd.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
