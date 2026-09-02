import React from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useVoice } from '../../context/VoiceContext.js';
import { Home, Package, Plus, ShoppingBag, User, Heart, Compass, Sparkles, Users } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentScreen, navigateTo, orders, resetProductDraft, userRole, cart, wishlist } = useAppState();
  const { t } = useLanguage();
  const { playChime } = useVoice();

  // Onboarding screens do not display bottom nav
  const isExcluded = ['welcome', 'language_select', 'category_select', 'profile_setup'].includes(currentScreen);
  if (isExcluded) return null;

  const pendingOrdersCount = orders.filter(o => o.status === 'new').length;
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNav = (screen: any) => {
    playChime('tap');
    if (screen === 'add_product') {
      resetProductDraft();
    }
    navigateTo(screen);
  };

  // BUYER MODE NAVIGATION
  if (userRole === 'buyer') {
    return (
      <nav aria-label="Buyer Navigation" className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-stone-200/80 shadow-nav z-40 px-2 py-1.5 flex items-center justify-around select-none">
        {/* 1. Explore Marketplace */}
        <button
          onClick={() => handleNav('buyer_marketplace')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all ${
            currentScreen === 'buyer_marketplace'
              ? 'text-artisan-terracotta font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className={`p-1 rounded-lg ${currentScreen === 'buyer_marketplace' ? 'bg-artisan-terracottaLight' : ''}`}>
            <Compass className={`w-5 h-5 ${currentScreen === 'buyer_marketplace' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Market</span>
        </button>

        {/* 2. Wishlist */}
        <button
          onClick={() => handleNav('buyer_wishlist')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all relative ${
            currentScreen === 'buyer_wishlist'
              ? 'text-artisan-terracotta font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className="relative">
            <div className={`p-1 rounded-lg ${currentScreen === 'buyer_wishlist' ? 'bg-artisan-terracottaLight' : ''}`}>
              <Heart className={`w-5 h-5 ${currentScreen === 'buyer_wishlist' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            </div>
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-rose-600 text-white text-[8px] font-extrabold rounded-full flex items-center justify-center shadow">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Wishlist</span>
        </button>

        {/* 3. Central Cart Button */}
        <div className="flex-1 flex justify-center -mt-5">
          <button
            onClick={() => handleNav('buyer_cart')}
            className="group relative flex flex-col items-center justify-center"
            title="Shopping Cart"
          >
            <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-artisan-terracotta via-artisan-terracotta to-orange-500 text-white shadow-elevated flex items-center justify-center border-4 border-stone-50 transition-all transform active:scale-95 group-hover:shadow-xl relative p-3">
              <ShoppingBag className="w-6 h-6 stroke-[2.5]" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-stone-900 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow">
                  {cartItemsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold text-artisan-terracotta mt-0.5 tracking-tight">
              Cart
            </span>
          </button>
        </div>

        {/* 4. My Orders */}
        <button
          onClick={() => handleNav('buyer_orders')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all ${
            currentScreen === 'buyer_orders'
              ? 'text-artisan-terracotta font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className={`p-1 rounded-lg ${currentScreen === 'buyer_orders' ? 'bg-artisan-terracottaLight' : ''}`}>
            <Package className={`w-5 h-5 ${currentScreen === 'buyer_orders' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">My Orders</span>
        </button>

        {/* 5. Profile */}
        <button
          onClick={() => handleNav('profile')}
          className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all ${
            ['profile', 'edit_profile', 'help_tutorials'].includes(currentScreen)
              ? 'text-artisan-terracotta font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className={`p-1 rounded-lg ${['profile', 'edit_profile'].includes(currentScreen) ? 'bg-artisan-terracottaLight' : ''}`}>
            <User className={`w-5 h-5 ${['profile', 'edit_profile'].includes(currentScreen) ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">{t('nav_profile')}</span>
        </button>
      </nav>
    );
  }

  // SELLER / ARTISAN MODE NAVIGATION
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

      {/* 4. Find Buyers (B2B Direct) */}
      <button
        onClick={() => handleNav('find_buyers')}
        className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all relative ${
          currentScreen === 'find_buyers'
            ? 'text-artisan-indigo font-bold'
            : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <div className="relative">
          <div className={`p-1 rounded-lg ${currentScreen === 'find_buyers' ? 'bg-indigo-50 text-artisan-indigo' : ''}`}>
            <Users className={`w-5 h-5 ${currentScreen === 'find_buyers' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-emerald-600 text-white text-[8px] font-black rounded-full shadow">
            17
          </span>
        </div>
        <span className="text-[11px] mt-0.5 tracking-tight font-bold">Buyers</span>
      </button>

      {/* 5. Orders */}
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
    </nav>
  );
};
