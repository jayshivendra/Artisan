import React from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useVoice } from '../../context/VoiceContext.js';
import { Header } from '../../components/layout/Header.js';
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
  Play, 
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
    setSelectedProductId,
    setIsLiveDemoOpen
  } = useAppState();
  const { t, language } = useLanguage();
  const { setIsAssistantModalOpen, playChime, speak } = useVoice();

  // Metrics specified by the user
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

  const handleOpenLiveDemo = () => {
    playChime('success');
    speak('Welcome to the KarigarConnect AI Live Demo. Demonstrating the complete 8-scene workflow for judges.');
    setIsLiveDemoOpen(true);
  };

  const getTimeGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="flex flex-col min-h-full bg-stone-50 select-none pb-6">
      <Header
        audioGuideText={`${getTimeGreeting()}, ${user.name || 'Artisan'}. Welcome to KarigarConnect AI. You have 24 active products, 17 buyer leads, and total revenue of ₹24,500. Tap Create using Voice or Photo to add new crafts.`}
      />

      <div className="p-4 space-y-4">
        {/* SIH Hackathon Killer Demo Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-artisan-terracotta p-3.5 text-white shadow-lg flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-black">
              🏆
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-100 block">
                Hackathon Presentation Mode
              </span>
              <h4 className="text-sm font-black leading-tight">
                3-Minute SIH Live Judge Demo
              </h4>
            </div>
          </div>
          <button
            onClick={handleOpenLiveDemo}
            className="py-2 px-3 bg-stone-950 hover:bg-stone-900 text-amber-300 rounded-xl text-xs font-black shadow flex items-center space-x-1 active:scale-95 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-amber-300" />
            <span>Launch</span>
          </button>
        </div>

        {/* Friendly Greeting */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-artisan-terracotta uppercase tracking-wider">
              KARIGARCONNECT AI
            </span>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight flex items-center space-x-1.5">
              <span>👋 Hello, {user.name?.split(' ')[0] || 'Artisan'}</span>
            </h2>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Your AI Business Manager for Handmade Products
            </p>
          </div>
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-artisan-terracotta shadow"
          />
        </div>

        {/* Minimalist 5-Stat Summary Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <span className="text-xs font-black uppercase tracking-wider text-stone-700">
              Business Overview
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              🟢 Active Store
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Products */}
            <div
              onClick={() => navigateTo('my_products')}
              className="p-3 rounded-2xl bg-stone-50 border border-stone-100 cursor-pointer active:scale-95 transition-all"
            >
              <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
                <span>Products</span>
                <Package className="w-3.5 h-3.5 text-artisan-terracotta" />
              </div>
              <p className="text-2xl font-black text-stone-900 mt-1">{productsCount}</p>
            </div>

            {/* Views */}
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
              <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
                <span>Views</span>
                <Eye className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <p className="text-2xl font-black text-stone-900 mt-1">{viewsCount.toLocaleString()}</p>
            </div>

            {/* Buyer Leads */}
            <div
              onClick={() => navigateTo('find_buyers')}
              className="p-3 rounded-2xl bg-stone-50 border border-stone-100 cursor-pointer active:scale-95 transition-all"
            >
              <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
                <span>Buyer Leads</span>
                <Users className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <p className="text-2xl font-black text-indigo-700 mt-1">{buyerLeadsCount}</p>
            </div>

            {/* Orders */}
            <div
              onClick={() => navigateTo('orders')}
              className="p-3 rounded-2xl bg-stone-50 border border-stone-100 cursor-pointer active:scale-95 transition-all"
            >
              <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
                <span>Orders</span>
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
                  Total Revenue
                </span>
                <p className="text-xl font-black text-white">
                  ₹{totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
            <span className="text-xs font-black text-emerald-400">
              ↑ 32% this month
            </span>
          </div>
        </div>

        {/* The 3 Core 1-Tap Action Cards from Specification */}
        <div className="space-y-2.5">
          <span className="text-xs font-black uppercase tracking-wider text-stone-700 block">
            Core Actions
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
                <h4 className="text-base font-black leading-tight">📸 Create using Photo</h4>
                <p className="text-xs text-orange-100 font-medium">
                  Snap ONE photo → AI cleans background & enhances
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
                <h4 className="text-base font-black leading-tight">🎤 Create using Voice</h4>
                <p className="text-xs text-stone-300 font-medium">
                  Speak in Hindi or regional tongue → AI writes catalog
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
                <h4 className="text-base font-black leading-tight">🤝 Find Buyers (Direct B2B)</h4>
                <p className="text-xs text-stone-500 font-medium">
                  17 verified bulk orders & wholesale demands live
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
              New Wholesale Demand: <strong>50 Bamboo Baskets</strong> in Mumbai
            </span>
          </div>
          <button
            onClick={handleFindBuyers}
            className="text-[11px] font-black text-emerald-800 underline hover:text-emerald-950"
          >
            Quote Now
          </button>
        </div>
      </div>
    </div>
  );
};
