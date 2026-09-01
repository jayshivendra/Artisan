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
  Clock, 
  AlertCircle, 
  Flame,
  Volume2
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const { user, products, orders, suggestions, navigateTo, resetProductDraft, setSelectedProductId } = useAppState();
  const { t, language } = useLanguage();
  const { setIsAssistantModalOpen, playChime, speak } = useVoice();

  // Metrics
  const activeProductsCount = products.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'new').length;
  const totalSalesAmount = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const totalOrdersCount = orders.length;

  const handleTalkToAi = () => {
    playChime('tap');
    setIsAssistantModalOpen(true);
  };

  const handleAddProduct = () => {
    playChime('tap');
    resetProductDraft();
    navigateTo('add_product');
  };

  const handleSuggestionClick = (sug: typeof suggestions[0]) => {
    playChime('tap');
    if (sug.action_type === 'create_product') {
      resetProductDraft();
      navigateTo('add_product');
    } else if (sug.action_type === 'update_price' || sug.action_type === 'enhance_photo') {
      if (sug.target_id) {
        setSelectedProductId(sug.target_id);
        navigateTo('product_detail');
      } else {
        navigateTo('my_products');
      }
    } else if (sug.action_type === 'add_stock') {
      navigateTo('my_products');
    }
  };

  const getTimeGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return t('greeting_morning');
    if (hours < 17) return t('greeting_afternoon');
    return t('greeting_evening');
  };

  return (
    <div className="flex flex-col min-h-full bg-stone-50 select-none">
      <Header
        audioGuideText={`${getTimeGreeting()}, ${user.name || 'Artisan'}. You have ${pendingOrdersCount} pending orders and total sales of ₹${totalSalesAmount.toLocaleString()}. Tap Talk to AI to add products or ask any question.`}
      />

      <div className="p-4 space-y-4">
        {/* Friendly Greeting */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-artisan-terracotta uppercase tracking-wider">
              {user.business_name || 'Artisan Studio'}
            </span>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight flex items-center space-x-1.5">
              <span>{getTimeGreeting()}, {user.name?.split(' ')[0] || 'Lakshmi'} 👋</span>
            </h2>
          </div>
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'}
            alt="Profile"
            className="w-11 h-11 rounded-full object-cover border-2 border-artisan-terracotta shadow"
          />
        </div>

        {/* AI Virtual Assistant Card (Hero) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-stone-950 via-slate-900 to-indigo-950 text-white p-5 shadow-xl border border-stone-800">
          <div className="relative z-10">
            <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold mb-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>AI Business Manager</span>
            </div>

            <h3 className="text-xl font-extrabold text-white leading-tight">
              {t('ai_assistant_card_title')}
            </h3>

            <p className="text-xs text-stone-300 font-medium mt-1 mb-4 leading-relaxed">
              Tap the microphone to speak in {language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'your language'} to add products, check sales, or find bulk buyers.
            </p>

            {/* Prominent Talk to AI Button */}
            <button
              onClick={handleTalkToAi}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-artisan-terracotta via-orange-500 to-amber-500 text-white font-black text-sm shadow-elevated flex items-center justify-center space-x-2 active:scale-95 transition-transform hover:shadow-2xl"
            >
              <Mic className="w-5 h-5 stroke-[2.5] animate-pulse" />
              <span>{t('btn_talk_to_ai')}</span>
            </button>
          </div>

          {/* Subtle Decorative Pattern */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* Big Number Business Summary Cards */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-stone-700 uppercase tracking-wider">
              Business Overview
            </span>
            <button
              onClick={() => navigateTo('sales_dashboard')}
              className="text-xs font-bold text-artisan-indigo flex items-center space-x-0.5 hover:underline"
            >
              <span>View Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Products Count */}
            <div
              onClick={() => navigateTo('my_products')}
              className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-sm cursor-pointer active:scale-95 transition-transform"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700">{t('stat_products')}</span>
                <div className="p-1.5 rounded-lg bg-blue-50 text-artisan-indigo">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-stone-900 mt-1">{activeProductsCount}</p>
              <span className="text-[10px] font-bold text-emerald-600">🟢 Live in Catalog</span>
            </div>

            {/* Orders Count */}
            <div
              onClick={() => navigateTo('orders')}
              className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-sm cursor-pointer active:scale-95 transition-transform"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700">{t('stat_orders')}</span>
                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-stone-900 mt-1">{totalOrdersCount}</p>
              <span className="text-[10px] font-bold text-stone-700">8 Completed</span>
            </div>

            {/* Total Sales */}
            <div
              onClick={() => navigateTo('sales_dashboard')}
              className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-sm cursor-pointer active:scale-95 transition-transform"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700">{t('stat_sales')}</span>
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-stone-900 mt-1">₹{totalSalesAmount.toLocaleString()}</p>
              <span className="text-[10px] font-bold text-emerald-600">↑ 28% this month</span>
            </div>

            {/* Pending Orders */}
            <div
              onClick={() => navigateTo('orders')}
              className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-sm cursor-pointer active:scale-95 transition-transform"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700">{t('stat_pending')}</span>
                <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-red-600 mt-1">{pendingOrdersCount}</p>
              <span className="text-[10px] font-bold text-red-500 animate-pulse">Needs Packing</span>
            </div>
          </div>
        </div>

        {/* Quick Actions (4 Large Cards) */}
        <div>
          <span className="text-xs font-extrabold text-stone-700 uppercase tracking-wider block mb-2">
            Quick Actions
          </span>
          <div className="grid grid-cols-2 gap-3">
            {/* 1. Add Product */}
            <button
              onClick={handleAddProduct}
              className="bg-gradient-to-br from-artisan-terracotta to-orange-600 text-white p-4 rounded-2xl shadow-elevated text-left flex flex-col justify-between h-28 active:scale-95 transition-transform"
            >
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">1-Tap AI</span>
                <h4 className="text-base font-black leading-tight">{t('quick_add_product')}</h4>
              </div>
            </button>

            {/* 2. My Products */}
            <button
              onClick={() => navigateTo('my_products')}
              className="bg-white border border-stone-200 p-4 rounded-2xl shadow-sm text-left flex flex-col justify-between h-28 active:scale-95 transition-transform hover:border-stone-300"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-artisan-indigo flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-700 uppercase">{activeProductsCount} Items</span>
                <h4 className="text-base font-black text-stone-900 leading-tight">{t('quick_my_products')}</h4>
              </div>
            </button>

            {/* 3. Orders */}
            <button
              onClick={() => navigateTo('orders')}
              className="bg-white border border-stone-200 p-4 rounded-2xl shadow-sm text-left flex flex-col justify-between h-28 active:scale-95 transition-transform hover:border-stone-300"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase">{pendingOrdersCount} New</span>
                <h4 className="text-base font-black text-stone-900 leading-tight">{t('quick_orders')}</h4>
              </div>
            </button>

            {/* 4. Find Bulk Buyers */}
            <button
              onClick={() => navigateTo('find_buyers')}
              className="bg-white border border-stone-200 p-4 rounded-2xl shadow-sm text-left flex flex-col justify-between h-28 active:scale-95 transition-transform hover:border-stone-300"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase">Hotels & Retail</span>
                <h4 className="text-base font-black text-stone-900 leading-tight">{t('quick_find_buyers')}</h4>
              </div>
            </button>
          </div>
        </div>

        {/* AI Suggestions for You */}
        <div>
          <div className="flex items-center space-x-1.5 mb-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-extrabold text-stone-700 uppercase tracking-wider">
              {t('ai_suggestions_title')}
            </span>
          </div>

          <div className="space-y-2.5">
            {suggestions.map((sug, idx) => (
              <div
                key={sug.id || idx}
                onClick={() => handleSuggestionClick(sug)}
                className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm flex items-start space-x-3 cursor-pointer hover:border-artisan-terracotta transition-all active:scale-98"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  {idx === 0 ? '✨' : idx === 1 ? '📈' : idx === 2 ? '⚠️' : '🪔'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-artisan-terracotta bg-artisan-terracottaLight px-2 py-0.5 rounded-md">
                      {sug.badge}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-700" />
                  </div>
                  <h5 className="font-extrabold text-stone-900 text-xs mt-1 leading-snug">
                    {language === 'te' && sug.title_te ? sug.title_te : language === 'hi' && sug.title_hi ? sug.title_hi : sug.title}
                  </h5>
                  <p className="text-[11px] text-stone-700 font-medium mt-0.5">
                    {sug.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
