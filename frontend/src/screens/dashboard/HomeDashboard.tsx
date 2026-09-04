import React from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useVoice, AUDIO_GUIDANCE_BY_LANG } from '../../context/VoiceContext.js';
import { Header } from '../../components/layout/Header.js';
import { StepGuidanceBanner } from '../../components/common/StepGuidanceBanner.js';
import { 
  Camera, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Mic, 
  Sparkles, 
  ArrowRight, 
  Users, 
  Eye, 
  CheckCircle2, 
  Flame,
  Volume2
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const { 
    user, 
    products, 
    orders, 
    suggestions, 
    navigateTo, 
    resetProductDraft, 
    updateProductDraft,
    setSelectedProductId
  } = useAppState();
  const { t, language } = useLanguage();
  const { setIsAssistantModalOpen, playChime, speak } = useVoice();

  // Metrics
  const productsCount = 24;
  const viewsCount = 1284;
  const buyerLeadsCount = 17;
  const ordersCount = 8;
  const totalRevenue = 24500;

  const handleCreatePhoto = () => {
    playChime('tap');
    resetProductDraft();
    updateProductDraft({ step: 1 });
    navigateTo('add_product');
  };

  const handleCreateVoice = () => {
    playChime('tap');
    resetProductDraft();
    updateProductDraft({ step: 3 });
    navigateTo('add_product');
  };

  const handleFindBuyers = () => {
    playChime('tap');
    navigateTo('find_buyers');
  };

  const getTimeGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return t('greeting_morning');
    if (hours < 17) return t('greeting_afternoon');
    return t('greeting_evening');
  };

  // Localized audio guide spoken in the artisan's active language
  const currentAudioGuide = AUDIO_GUIDANCE_BY_LANG.home?.[language] ||
    `${getTimeGreeting()}, ${user.name || 'Artisan'}. ${t('app_subtitle')}.`;

  return (
    <div className="flex flex-col min-h-full bg-stone-50 select-none pb-6">
      <Header audioGuideText={currentAudioGuide} />

      <div className="p-4 space-y-4">
        {/* Friendly Greeting */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-black text-artisan-terracotta uppercase tracking-wider">
              KARIGARCONNECT AI
            </span>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight flex items-center space-x-1.5">
              <span>👋 {t('hello')}, {user.name?.split(' ')[0] || 'Artisan'}</span>
            </h2>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              {t('app_subtitle')}
            </p>
          </div>
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-artisan-terracotta shadow"
          />
        </div>

        {/* Step-by-Step Voice Guidance Card with 1-Tap Toggle */}
        <StepGuidanceBanner
          title={t('business_overview')}
          guidanceText={AUDIO_GUIDANCE_BY_LANG.home?.[language]}
          autoSpeak={false}
        />

        {/* Minimalist 5-Stat Summary Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <span className="text-xs font-black uppercase tracking-wider text-stone-700">
              {t('business_overview')}
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              🟢 {t('active_store')}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Products */}
            <div
              onClick={() => navigateTo('my_products')}
              className="p-3 rounded-2xl bg-stone-50 border border-stone-100 cursor-pointer active:scale-95 transition-all hover:border-artisan-terracotta/40"
            >
              <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
                <span>{t('stat_products')}</span>
                <Package className="w-3.5 h-3.5 text-artisan-terracotta" />
              </div>
              <p className="text-2xl font-black text-stone-900 mt-1">{productsCount}</p>
            </div>

            {/* Views */}
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
              <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
                <span>{t('stat_views')}</span>
                <Eye className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <p className="text-2xl font-black text-stone-900 mt-1">{viewsCount.toLocaleString()}</p>
            </div>

            {/* Buyer Leads */}
            <div
              onClick={() => navigateTo('find_buyers')}
              className="p-3 rounded-2xl bg-stone-50 border border-stone-100 cursor-pointer active:scale-95 transition-all hover:border-indigo-300"
            >
              <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
                <span>{t('stat_buyer_leads')}</span>
                <Users className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <p className="text-2xl font-black text-indigo-700 mt-1">{buyerLeadsCount}</p>
            </div>

            {/* Orders */}
            <div
              onClick={() => navigateTo('orders')}
              className="p-3 rounded-2xl bg-stone-50 border border-stone-100 cursor-pointer active:scale-95 transition-all hover:border-amber-300"
            >
              <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
                <span>{t('stat_orders')}</span>
                <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <p className="text-2xl font-black text-stone-900 mt-1">{ordersCount}</p>
            </div>
          </div>

          {/* Revenue Pill */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-stone-900 to-indigo-950 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-base">
                ₹
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider block">
                  {t('stat_total_revenue')}
                </span>
                <p className="text-xl font-black text-white">
                  ₹{totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
            <span className="text-xs font-black text-emerald-400">
              {t('stat_growth')}
            </span>
          </div>
        </div>

        {/* The 3 Core 1-Tap Action Cards */}
        <div className="space-y-2.5">
          <span className="text-xs font-black uppercase tracking-wider text-stone-700 block">
            {t('core_actions')}
          </span>

          {/* 1. Create using Photo */}
          <button
            onClick={handleCreatePhoto}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-artisan-terracotta to-orange-500 text-white shadow-elevated flex items-center justify-between active:scale-95 transition-transform"
          >
            <div className="flex items-center space-x-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Camera className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-base font-black leading-tight">{t('action_create_photo_title')}</h4>
                <p className="text-xs text-orange-100 font-medium">
                  {t('action_create_photo_sub')}
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* 2. Create using Voice */}
          <button
            onClick={handleCreateVoice}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-stone-900 text-white border border-stone-800 shadow-elevated flex items-center justify-between active:scale-95 transition-transform"
          >
            <div className="flex items-center space-x-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-amber-300 flex items-center justify-center">
                <Mic className="w-6 h-6 stroke-[2.5] animate-pulse" />
              </div>
              <div>
                <h4 className="text-base font-black leading-tight">{t('action_create_voice_title')}</h4>
                <p className="text-xs text-stone-300 font-medium">
                  {t('action_create_voice_sub')}
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* 3. Find Buyers */}
          <button
            onClick={handleFindBuyers}
            className="w-full p-4 rounded-2xl bg-white border-2 border-stone-200 text-stone-900 shadow-sm flex items-center justify-between active:scale-95 transition-transform hover:border-artisan-terracotta"
          >
            <div className="flex items-center space-x-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Users className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-base font-black leading-tight">{t('action_find_buyers_title')}</h4>
                <p className="text-xs text-stone-500 font-medium">
                  {t('action_find_buyers_sub')}
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 stroke-[2.5] text-stone-400" />
          </button>
        </div>

        {/* Live Market Linkage Ticker */}
        <div className="p-3 rounded-2xl bg-emerald-50/90 border border-emerald-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-bold text-emerald-900">
              {t('demand_ticker_text')}
            </span>
          </div>
          <button
            onClick={handleFindBuyers}
            className="text-[11px] font-black text-emerald-800 underline hover:text-emerald-950"
          >
            {t('btn_quote_now')}
          </button>
        </div>
      </div>
    </div>
  );
};
