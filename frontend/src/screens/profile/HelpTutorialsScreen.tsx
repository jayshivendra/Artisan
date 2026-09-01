import React from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useVoice } from '../../context/VoiceContext.js';
import { Header } from '../../components/layout/Header.js';
import { AudioGuidancePlayer } from '../../components/common/AudioGuidancePlayer.js';
import { Camera, Mic, DollarSign, Package, Users, HelpCircle } from 'lucide-react';

export const HelpTutorialsScreen: React.FC = () => {
  const { navigateTo } = useAppState();
  const { language } = useLanguage();

  const tutorials = [
    {
      title: '1. How to take clear product photos',
      icon: <Camera className="w-5 h-5 text-artisan-terracotta" />,
      speechText:
        language === 'te'
          ? 'ఉదయం లేదా మధ్యాహ్నం సహజ వెలుతురులో వస్తువును ఉంచండి. వస్తువు చుట్టూ అదనపు సామాన్లు లేకుండా చూసుకోండి. కెమెరాలో వస్తువు సరిగ్గా మధ్యలో ఉండేలా ఫోటో తీయండి. AI స్వయంగా బ్యాక్‌గ్రౌండ్‌ను అందంగా మారుస్తుంది.'
          : language === 'hi'
          ? 'सुबह या दोपहर की प्राकृतिक रोशनी में उत्पाद की तस्वीर लें। उत्पाद को केंद्र में रखें। AI अपने आप बैकग्राउंड को स्टूडियो जैसा सुंदर बना देगा।'
          : 'Place your craft under natural window daylight. Keep the product centered. Avoid messy backgrounds. AI will automatically isolate the craft and enhance the studio lighting.'
    },
    {
      title: '2. Speaking to AI in your language',
      icon: <Mic className="w-5 h-5 text-artisan-indigo" />,
      speechText:
        language === 'te'
          ? 'మైక్ బటన్ నొక్కి మీ స్వంత భాషలో మాట్లాడండి. ఇది ఏమి వస్తువు, ఏ దారాలు లేదా ముడిసరుకుతో చేశారు, మరియు చేయడానికి ఎన్ని రోజులు పట్టిందో చెప్పండి. AI స్వయంగా ఇంగ్లీష్ మరియు హిందీ కేటలాగ్ రాస్తుంది.'
          : language === 'hi'
          ? 'माइक बटन दबाएं और अपनी भाषा में बोलें। बताएं कि यह क्या है, किस सामग्री से बना है और बनाने में कितने दिन लगे। AI अपने आप पूरा विवरण लिख देगा।'
          : 'Press the microphone and speak naturally. Mention what the product is, materials used, and days taken to weave or carve. The AI extracts all e-commerce attributes automatically.'
    },
    {
      title: '3. Understanding AI fair pricing',
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
      speechText:
        language === 'te'
          ? 'AI మీ ముడిసరుకు ఖర్చు మరియు చేతిపని సమయాన్ని లెక్కిస్తుంది. మార్కెట్లో ఇతరులు అమ్మే ధరలను పోల్చి సరైన లాభదాయకమైన ధరను సూచిస్తుంది. మీరు ఎప్పుడైనా ధరను మార్చుకోవచ్చు.'
          : language === 'hi'
          ? 'AI सामग्री लागत और कारीगरी के दिनों को जोड़ता है और बाजार के अनुसार सही कीमत बताता है ताकि आपको पूरा मुनाफा मिले।'
          : 'The dynamic pricing engine calculates your raw material costs plus fair daily artisan wages plus current festival demand to recommend a profitable price.'
    },
    {
      title: '4. Packing and shipping customer orders',
      icon: <Package className="w-5 h-5 text-amber-600" />,
      speechText:
        language === 'te'
          ? 'కొత్త ఆర్డర్ వచ్చినప్పుడు యాప్‌లో నోటిఫికేషన్ వస్తుంది. వస్తువును సురక్షితంగా ప్యాక్ చేసి, స్పీడ్ పోస్ట్ లేదా కొరియర్‌కు అప్పగించండి.'
          : language === 'hi'
          ? 'नया आर्डर आने पर ग्राहक का पता देखें, उत्पाद को अच्छी तरह पैक करें और स्पीड पोस्ट कूरियर को सौंपें।'
          : 'When an order arrives, check customer delivery address, pack the product securely with bubble wrap or eco-paper, and hand over to India Post or courier.'
    }
  ];

  return (
    <div className="flex flex-col min-h-full bg-stone-50 select-none pb-8">
      <Header
        title="Spoken Audio Tutorials"
        showBack={true}
        onBack={() => navigateTo('profile')}
        audioGuideText="Welcome to Audio Tutorials. Tap Listen on any card to hear step-by-step spoken guidance."
      />

      <div className="p-4 space-y-4">
        <div className="bg-gradient-to-tr from-stone-900 to-indigo-950 text-white rounded-3xl p-4 shadow-xl border border-stone-800">
          <div className="flex items-center space-x-1.5 text-amber-300 text-xs font-bold mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Voice Guided Learning</span>
          </div>
          <h3 className="font-extrabold text-base leading-tight">
            Learn at your own pace with Voice
          </h3>
          <p className="text-[11px] text-stone-300 font-medium mt-0.5">
            Designed for artisans of all backgrounds. No technical knowledge required.
          </p>
        </div>

        <div className="space-y-3">
          {tutorials.map((t, idx) => (
            <div key={idx} className="bg-white border border-stone-200 rounded-3xl p-4 shadow-sm space-y-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-stone-50 flex items-center justify-center shrink-0">
                  {t.icon}
                </div>
                <h4 className="font-extrabold text-stone-900 text-xs">{t.title}</h4>
              </div>

              <AudioGuidancePlayer
                title="Play Spoken Voice Guide"
                speechText={t.speechText}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
