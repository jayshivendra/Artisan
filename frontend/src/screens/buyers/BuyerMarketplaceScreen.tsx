import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useVoice } from '../../context/VoiceContext.js';
import { Header } from '../../components/layout/Header.js';
import { Product } from '../../types/index.js';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  MapPin, 
  Filter, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Star,
  Layers,
  X
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'All Crafts', icon: '✨' },
  { id: 'Handloom / Textiles', name: 'Handloom Silk', icon: '🧵' },
  { id: 'Pottery & Clay', name: 'Blue Pottery & Clay', icon: '🏺' },
  { id: 'Woodcraft', name: 'Carved Woodcraft', icon: '🪵' },
  { id: 'Metalwork', name: 'Dhokra & Brass', icon: '🪙' },
  { id: 'Folk Art & Paintings', name: 'Folk Paintings', icon: '🎨' },
  { id: 'Handcrafted Leather', name: 'Leather Mojaris', icon: '🥿' }
];

export const BuyerMarketplaceScreen: React.FC = () => {
  const { products, cart, wishlist, toggleWishlist, addToCart, navigateTo } = useAppState();
  const { playChime, speak } = useVoice();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.artisan_name && p.artisan_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.origin_region && p.origin_region.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddToCart = (p: Product) => {
    playChime('tap');
    addToCart(p, 1);
    speak(`Added ${p.name} to your craft cart.`);
  };

  return (
    <div className="flex flex-col min-h-full bg-stone-50 select-none pb-24">
      {/* Header with Search & Cart */}
      <div className="bg-white border-b border-stone-200 px-4 py-3 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-artisan-terracotta to-orange-500 text-white flex items-center justify-center font-black text-base shadow-sm">
              ✦
            </div>
            <div>
              <h1 className="font-extrabold text-stone-900 text-base leading-tight">Artisan Craft Marketplace</h1>
              <span className="text-[10px] text-artisan-terracotta font-bold">100% Certified Authentic & Handcrafted</span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Wishlist Button */}
            <button
              onClick={() => {
                playChime('tap');
                navigateTo('buyer_wishlist');
              }}
              className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 relative"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => {
                playChime('tap');
                navigateTo('buyer_cart');
              }}
              className="p-2 rounded-xl bg-artisan-terracottaLight text-artisan-terracotta hover:bg-artisan-terracotta hover:text-white transition-colors relative"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-artisan-terracotta text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Banarasi silk, Blue pottery, Dhokra, Woodcraft..."
            className="w-full text-xs pl-9 pr-8 py-2.5 bg-stone-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-artisan-terracotta/20 border border-transparent focus:border-artisan-terracotta text-stone-900"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-stone-400 text-xs">✕</button>
          )}
        </div>
      </div>

      {/* Hero Heritage Banner */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white rounded-3xl p-5 shadow-elevated relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider mb-2 border border-amber-500/30">
              <Sparkles className="w-3 h-3" />
              <span>Direct From Rural Masters</span>
            </span>
            <h2 className="text-xl font-extrabold leading-tight text-white mb-1">
              Treasures of Indian Craft Heritage
            </h2>
            <p className="text-xs text-stone-300 line-clamp-2 mb-3">
              Every creation preserves a centuries-old artisanal tradition and supports rural weaver families directly.
            </p>
            <div className="flex items-center space-x-3 text-[11px] text-amber-200 font-bold">
              <span>✓ GI Tagged Crafts</span>
              <span>•</span>
              <span>✓ Fair Trade Payouts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-4 mb-3">
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  playChime('tap');
                  setSelectedCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-artisan-terracotta text-white shadow-sm'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-700">
            {filteredProducts.length} authentic handcrafts available
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-3xl p-8 text-center">
            <span className="text-3xl block mb-2">🏺</span>
            <h3 className="font-extrabold text-stone-900 text-sm">No Crafts Found</h3>
            <p className="text-xs text-stone-500 mt-1">Try searching for other craft forms or clearing filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-2 bg-artisan-terracotta text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map(p => {
              const isWishlisted = wishlist.includes(p.id);
              return (
                <div
                  key={p.id}
                  className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-all"
                >
                  {/* Image Container */}
                  <div
                    className="relative aspect-square overflow-hidden bg-stone-100 cursor-pointer"
                    onClick={() => setSelectedProduct(p)}
                  >
                    <img
                      src={p.images[0] || p.original_image || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800'}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800';
                      }}
                    />
                    
                    {p.badge && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-stone-900/80 text-amber-200 text-[9px] font-extrabold backdrop-blur-sm">
                        {p.badge}
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playChime('tap');
                        toggleWishlist(p.id);
                      }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-xs shadow-sm hover:scale-110 transition-transform"
                    >
                      {isWishlisted ? '❤️' : '🤍'}
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-3 flex flex-col flex-1">
                    <div className="flex items-center space-x-1 text-[10px] text-stone-500 mb-1">
                      <MapPin className="w-3 h-3 text-artisan-terracotta" />
                      <span className="truncate">{p.origin_region || 'India'}</span>
                    </div>

                    <h3
                      onClick={() => setSelectedProduct(p)}
                      className="font-extrabold text-stone-900 text-xs line-clamp-2 leading-snug cursor-pointer group-hover:text-artisan-terracotta transition-colors mb-1.5"
                    >
                      {p.name}
                    </h3>

                    <div className="text-[10px] text-stone-600 font-semibold mb-2 truncate">
                      By {p.artisan_name || 'Master Artisan'}
                    </div>

                    <div className="mt-auto pt-2 border-t border-stone-100 flex items-center justify-between">
                      <span className="font-black text-stone-900 text-sm">
                        ₹{p.selling_price.toLocaleString('en-IN')}
                      </span>

                      <button
                        onClick={() => handleAddToCart(p)}
                        className="px-2.5 py-1.5 bg-artisan-terracottaLight text-artisan-terracotta font-extrabold text-[11px] rounded-lg hover:bg-artisan-terracotta hover:text-white transition-colors"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in select-none">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto border border-stone-100 relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center font-bold z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <img
              src={selectedProduct.images[0] || selectedProduct.original_image}
              alt={selectedProduct.name}
              className="w-full h-56 rounded-2xl object-cover mb-4"
            />

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[10px] font-extrabold border border-amber-200">
                  {selectedProduct.category}
                </span>
                {selectedProduct.origin_region && (
                  <span className="text-xs text-stone-500 font-bold flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-artisan-terracotta" />
                    <span>{selectedProduct.origin_region}</span>
                  </span>
                )}
              </div>

              <h2 className="text-base font-extrabold text-stone-900 leading-snug">
                {selectedProduct.name}
              </h2>

              <div className="flex items-baseline space-x-2">
                <span className="text-xl font-black text-stone-900">
                  ₹{selectedProduct.selling_price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-emerald-700 font-bold">Free Express Delivery</span>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-2xl border border-stone-100">
                {selectedProduct.description}
              </p>

              {/* Artisan Heritage Box */}
              <div className="bg-artisan-terracottaLight border border-artisan-terracotta/20 rounded-2xl p-3">
                <span className="text-[10px] font-black uppercase text-artisan-terracotta block tracking-wider">Meet the Maker</span>
                <span className="text-xs font-extrabold text-stone-900 block mt-0.5">{selectedProduct.artisan_name || 'Master Artisan'}</span>
                <span className="text-[11px] text-stone-600 block mt-0.5">Making Time: {selectedProduct.making_time_days} days of meticulous handcrafting</span>
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    setSelectedProduct(null);
                    navigateTo('buyer_cart');
                  }}
                  className="flex-1 py-3.5 bg-gradient-to-r from-artisan-terracotta to-orange-500 text-white font-extrabold text-sm rounded-2xl shadow-elevated flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>

                <button
                  onClick={() => {
                    toggleWishlist(selectedProduct.id);
                  }}
                  className="px-4 py-3.5 bg-stone-100 text-stone-800 rounded-2xl font-bold text-sm"
                >
                  {wishlist.includes(selectedProduct.id) ? '❤️' : '🤍'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
