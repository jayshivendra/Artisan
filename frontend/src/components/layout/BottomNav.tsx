import React from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useVoice } from '../../context/VoiceContext.js';
import { Home, Package, Plus, ShoppingBag, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentScreen, navigateTo, orders, resetProductDraft } = useAppState();
  const { t } = useLanguage();
  const { playChime } = useVoice();

  // Onboarding screens do not display bottom nav
  const isExcluded = ['welcome', 'language_select', 'category_select', 'profile_setup'].includes(currentScreen);
  if (isExcluded) return null;

  const pendingOrdersCount = orders.filter(o => o.status === 'new').length;

  const handleNav = (screen: any) => {
    playChime('tap');
    if (screen === 'add_product') {
      resetProductDraft();
    }
    navigateTo(screen);
  };

  return (
    <nav aria-label="Main Navigation" className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-stone-200/80 shadow-nav z-40 px-2 py-1.5 flex items-center justify-around select-none">
      {/* 1. Home */}
      <button
        onClick={() => handleNav('home')}
        className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all ${
          currentScreen === 'home'
            ? 'text-artisan-terracotta font-bold'
            : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <div className={`p-1 rounded-lg ${currentScreen === 'home' ? 'bg-artisan-terracottaLight' : ''}`}>
          <Home className={`w-5 h-5 ${currentScreen === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        </div>
        <span className="text-[11px] mt-0.5 tracking-tight">{t('nav_home')}</span>
      </button>

      {/* 2. My Products */}
      <button
        onClick={() => handleNav('my_products')}
        className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all ${
          ['my_products', 'product_detail'].includes(currentScreen)
            ? 'text-artisan-terracotta font-bold'
            : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <div className={`p-1 rounded-lg ${['my_products', 'product_detail'].includes(currentScreen) ? 'bg-artisan-terracottaLight' : ''}`}>
          <Package className={`w-5 h-5 ${['my_products', 'product_detail'].includes(currentScreen) ? 'stroke-[2.5]' : 'stroke-2'}`} />
        </div>
        <span className="text-[11px] mt-0.5 tracking-tight">{t('nav_products')}</span>
      </button>

      {/* 3. Add Product (Prominent Central Button) */}
      <div className="flex-1 flex justify-center -mt-6">
        <button
          onClick={() => handleNav('add_product')}
          className="group relative flex flex-col items-center justify-center"
          title="Add New Product"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-artisan-terracottaDark via-artisan-terracotta to-orange-500 text-white shadow-elevated flex items-center justify-center border-4 border-stone-50 transition-all transform active:scale-95 group-hover:shadow-xl">
            <Plus className="w-7 h-7 stroke-[3] transition-transform group-hover:rotate-90" />
          </div>
          <span className="text-[10px] font-bold text-artisan-terracotta mt-1 tracking-tight">
            {t('nav_add')}
          </span>
        </button>
      </div>

      {/* 4. Orders */}
      <button
        onClick={() => handleNav('orders')}
        className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all relative ${
          ['orders', 'order_detail'].includes(currentScreen)
            ? 'text-artisan-terracotta font-bold'
            : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <div className="relative">
          <div className={`p-1 rounded-lg ${['orders', 'order_detail'].includes(currentScreen) ? 'bg-artisan-terracottaLight' : ''}`}>
            <ShoppingBag className={`w-5 h-5 ${['orders', 'order_detail'].includes(currentScreen) ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          {pendingOrdersCount > 0 && (
            <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-red-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center animate-bounce shadow">
              {pendingOrdersCount}
            </span>
          )}
        </div>
        <span className="text-[11px] mt-0.5 tracking-tight">{t('nav_orders')}</span>
      </button>

      {/* 5. Profile */}
      <button
        onClick={() => handleNav('profile')}
        className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all ${
          ['profile', 'help_tutorials', 'notifications'].includes(currentScreen)
            ? 'text-artisan-terracotta font-bold'
            : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <div className={`p-1 rounded-lg ${['profile', 'help_tutorials', 'notifications'].includes(currentScreen) ? 'bg-artisan-terracottaLight' : ''}`}>
          <User className={`w-5 h-5 ${['profile', 'help_tutorials', 'notifications'].includes(currentScreen) ? 'stroke-[2.5]' : 'stroke-2'}`} />
        </div>
        <span className="text-[11px] mt-0.5 tracking-tight">{t('nav_profile')}</span>
      </button>
    </nav>
  );
};
