import React from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useVoice } from '../../context/VoiceContext.js';
import { Header } from '../../components/layout/Header.js';
import { Heart, ShoppingBag, MapPin, Trash2 } from 'lucide-react';

export const BuyerWishlistScreen: React.FC = () => {
  const { wishlist, toggleWishlist, products, addToCart, navigateTo } = useAppState();
  const { playChime, speak } = useVoice();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="flex flex-col min-h-full bg-stone-50 select-none pb-24">
      <Header
        title="Saved Wishlist"
        showBack
        onBack={() => navigateTo('buyer_marketplace')}
        audioGuideText="Here are your saved handcrafted favorites. You can add them directly to your cart."
      />

      <div className="p-4 space-y-4 max-w-lg mx-auto w-full">
        {wishlistedProducts.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-3xl p-8 text-center shadow-sm">
            <span className="text-4xl block mb-2">❤️</span>
            <h3 className="font-extrabold text-stone-900 text-base">Your Wishlist is Empty</h3>
            <p className="text-xs text-stone-500 mt-1">Click the heart icon on any craft to save it for later.</p>
            <button
              onClick={() => navigateTo('buyer_marketplace')}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-artisan-terracotta to-orange-500 text-white font-extrabold text-xs rounded-2xl shadow"
            >
              Explore Crafts →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {wishlistedProducts.map(p => (
              <div
                key={p.id}
                className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm flex flex-col group"
              >
                <div className="relative aspect-square overflow-hidden bg-stone-100">
                  <img
                    src={p.images[0] || p.original_image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => {
                      playChime('tap');
                      toggleWishlist(p.id);
                    }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-xs text-rose-600 shadow"
                  >
                    ❤️
                  </button>
                </div>

                <div className="p-3 flex flex-col flex-1">
                  <h3 className="font-extrabold text-stone-900 text-xs line-clamp-2 leading-snug mb-1">
                    {p.name}
                  </h3>
                  <span className="text-[10px] text-stone-500 mb-2 truncate">By {p.artisan_name || 'Master Artisan'}</span>

                  <div className="mt-auto pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="font-black text-stone-900 text-xs">
                      ₹{p.selling_price.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => {
                        playChime('tap');
                        addToCart(p, 1);
                        speak(`Added ${p.name} to cart.`);
                      }}
                      className="px-2.5 py-1.5 bg-artisan-terracotta text-white font-extrabold text-[10px] rounded-lg shadow-sm"
                    >
                      + Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
