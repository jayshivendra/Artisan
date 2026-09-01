import React, { useState, useEffect } from 'react';
import { useVoice } from '../../context/VoiceContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useAppState } from '../../context/AppStateContext.js';
import { Mic, X, Sparkles, ArrowRight, Volume2 } from 'lucide-react';

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
  const { language, t } = useLanguage();
  const { navigateTo, resetProductDraft } = useAppState();

  const [assistantText, setAssistantText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (isAssistantModalOpen) {
      setAssistantText(
        language === 'te'
          ? 'నమస్కారం! నేను మీ వ్యాపార సహాయకుడిని. ఈరోజు మీరు ఏమి చేయాలనుకుంటున్నారు?'
          : language === 'hi'
          ? 'नमस्ते! मैं आपका डिजिटल व्यापार सहायक हूँ। आज आप क्या करना चाहेंगे?'
          : "Namaste! I'm your Virtual Business Manager. How can I help your craft today?"
      );
    }
  }, [isAssistantModalOpen, language]);

  if (!isAssistantModalOpen) return null;

  const handleCommand = (spokenQuery: string) => {
    setIsProcessing(true);
    const query = spokenQuery.toLowerCase();

    // Call backend API or local intelligent routing
    fetch('/api/ai/assistant-command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: spokenQuery, language })
    })
      .then(res => res.json())
      .then(json => {
        setIsProcessing(false);
        if (json.success && json.data) {
          const { targetScreen, responseText, responseAudioText } = json.data;
          setAssistantText(responseText);
          playChime('success');
          speak(responseAudioText || responseText);

          setTimeout(() => {
            setIsAssistantModalOpen(false);
            if (targetScreen === 'AddProduct') {
              resetProductDraft();
              navigateTo('add_product');
            } else if (targetScreen === 'SalesDashboard') {
              navigateTo('sales_dashboard');
            } else if (targetScreen === 'Orders') {
              navigateTo('orders');
            } else if (targetScreen === 'FindBuyers') {
              navigateTo('find_buyers');
            } else if (targetScreen === 'MyProducts') {
              navigateTo('my_products');
            }
          }, 1600);
        }
      })
      .catch(() => {
        // Direct offline routing fallback
        setIsProcessing(false);
        if (query.includes('product') || query.includes('వస్తువు') || query.includes('उत्पाद')) {
          setAssistantText('Opening camera to add a new product!');
          speak('Opening camera to add a new product.');
          setTimeout(() => {
            setIsAssistantModalOpen(false);
            resetProductDraft();
            navigateTo('add_product');
          }, 1200);
        } else if (query.includes('order') || query.includes('ఆర్డర్') || query.includes('ऑर्डर')) {
          setAssistantText('Showing your customer orders.');
          speak('Showing your customer orders.');
          setTimeout(() => {
            setIsAssistantModalOpen(false);
            navigateTo('orders');
          }, 1200);
        } else if (query.includes('sale') || query.includes('సేల్స్') || query.includes('कमाई')) {
          setAssistantText('Opening your Sales Dashboard.');
          speak('Opening your sales dashboard.');
          setTimeout(() => {
            setIsAssistantModalOpen(false);
            navigateTo('sales_dashboard');
          }, 1200);
        } else {
          setAssistantText('You have 8 orders and ₹18,500 in sales this month.');
          speak('You have 8 orders and 18,500 rupees in sales this month.');
        }
      });
  };

  const handleStartVoice = () => {
    startListening((resultText: string) => {
      handleCommand(resultText);
    });
  };

  const sampleCommands = [
    { label: '📷 Add a new product', query: 'Add a new product' },
    { label: '🛒 Show my orders', query: 'Show my orders' },
    { label: '💰 Check my sales', query: 'Check my sales' },
    { label: '🏷️ What price should I keep?', query: 'What price should I keep for handloom saree?' },
    { label: '🤝 Find bulk buyers', query: 'Find bulk wholesale buyers' }
  ];

  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-50 flex flex-col justify-end p-0 sm:p-4 animate-in fade-in duration-200 select-none">
      <div className="bg-white w-full rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl flex flex-col max-h-[85%] overflow-y-auto border border-stone-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-artisan-indigo to-blue-500 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-base leading-tight">
                AI Voice Assistant
              </h3>
              <p className="text-[10px] text-stone-700 font-semibold">
                Natural Indian Language Manager
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAssistantModalOpen(false)}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-700 active:scale-95 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Message Bubble */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50/50 border border-indigo-100 rounded-2xl p-4 my-4 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="w-7 h-7 rounded-lg bg-artisan-indigo text-white flex items-center justify-center shrink-0 mt-0.5">
              <Volume2 className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-stone-900 font-bold text-sm leading-relaxed">
                {assistantText}
              </p>
              {transcript && (
                <div className="mt-2 pt-2 border-t border-indigo-200/60 text-xs font-semibold text-artisan-indigo flex items-center space-x-1">
                  <span>You said:</span>
                  <span className="italic font-bold">"{transcript}"</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Large Central Microphone Button */}
        <div className="flex flex-col items-center justify-center my-2">
          <button
            onClick={isListening ? stopListening : handleStartVoice}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all transform active:scale-95 shadow-2xl relative ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-gradient-to-tr from-artisan-indigo via-blue-600 to-indigo-500 text-white'
            }`}
          >
            {isListening && (
              <span className="absolute -inset-3 rounded-full bg-red-400/40 animate-ping"></span>
            )}
            <Mic className="w-9 h-9 stroke-[2.5]" />
          </button>
          <span className="text-xs font-bold text-stone-700 mt-2">
            {isListening ? 'Listening now... Speak freely' : 'Tap & Speak in your language'}
          </span>
        </div>

        {/* Example Quick Commands */}
        <div className="mt-4">
          <p className="text-[11px] font-extrabold text-stone-700 uppercase tracking-wider mb-2">
            Or tap an example command:
          </p>
          <div className="flex flex-wrap gap-2">
            {sampleCommands.map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => handleCommand(cmd.query)}
                className="bg-stone-100 hover:bg-artisan-terracottaLight hover:text-artisan-terracotta text-stone-700 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 border border-stone-200/80 flex items-center space-x-1"
              >
                <span>{cmd.label}</span>
                <ArrowRight className="w-3 h-3 ml-1 opacity-60" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
