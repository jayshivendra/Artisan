import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useVoice } from '../../context/VoiceContext.js';
import { Header } from '../../components/layout/Header.js';
import { StatusBadge } from '../../components/common/StatusBadge.js';
import { Plus, Copy, Share2, Trash2, Edit3, Sparkles, Filter, Search } from 'lucide-react';

export const ProductListScreen: React.FC = () => {
  const { products, setSelectedProductId, navigateTo, duplicateProduct, deleteProduct, resetProductDraft } = useAppState();
  const { t } = useLanguage();
  const { playChime, speak } = useVoice();

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'low_stock' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProducts = products.filter(p => {
    if (activeTab !== 'all' && p.status !== activeTab) return false;
    if (searchQuery) {
      return (
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const handleProductClick = (id: string) => {
    playChime('tap');
    setSelectedProductId(id);
    navigateTo('product_detail');
  };

  const handleDuplicate = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    playChime('tap');
    duplicateProduct(id);
    speak('Product duplicated as draft.');
  };

  const handleShare = (e: React.MouseEvent, p: typeof products[0]) => {
    e.stopPropagation();
    playChime('tap');
    const shareText = `Check out our authentic handcrafted ${p.name} at ₹${p.selling_price}! Direct from artisan workshop.`;
    if (navigator.share) {
      navigator.share({ title: p.name, text: shareText, url: window.location.href }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    playChime('tap');
    if (window.confirm('Are you sure you want to remove this craft listing?')) {
      deleteProduct(id);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-stone-50 select-none pb-8">
      <Header
        title={t('nav_products')}
        audioGuideText={`You have ${products.length} products listed. Tap on any card to edit price, stock or view details.`}
      />

      <div className="p-4 space-y-3">
        {/* Top Controls: Search and Add Button */}
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search crafts..."
              className="w-full text-xs font-bold text-stone-900 bg-white rounded-xl py-2.5 pl-8 pr-3 border border-stone-200 shadow-sm focus:outline-none focus:border-artisan-terracotta"
            />
            <Search className="w-3.5 h-3.5 text-stone-700 absolute left-2.5 top-3" />
          </div>

          <button
            onClick={() => {
              playChime('tap');
              resetProductDraft();
              navigateTo('add_product');
            }}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-artisan-terracotta to-orange-500 text-white font-extrabold text-xs shadow flex items-center space-x-1 shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: `All (${products.length})` },
            { id: 'active', label: `🟢 Active (${products.filter(p => p.status === 'active').length})` },
            { id: 'low_stock', label: `🟠 Low Stock (${products.filter(p => p.status === 'low_stock').length})` },
            { id: 'draft', label: `⚪ Draft (${products.filter(p => p.status === 'draft').length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                playChime('tap');
                setActiveTab(tab.id as any);
              }}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-stone-900 text-white shadow'
                  : 'bg-white text-stone-600 border border-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Cards List */}
        <div className="space-y-3 pt-1">
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-3xl p-8 text-center my-4">
              <span className="text-3xl block mb-2">🧵</span>
              <h4 className="font-extrabold text-stone-900 text-sm">No products found</h4>
              <p className="text-xs text-stone-700 mt-1">Tap + Add Product to start selling.</p>
            </div>
          ) : (
            filteredProducts.map(p => (
              <div
                key={p.id}
                onClick={() => handleProductClick(p.id)}
                className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden flex flex-col cursor-pointer hover:border-artisan-terracotta transition-all active:scale-98 group"
              >
                <div className="flex p-3 space-x-3">
                  {/* Thumbnail */}
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-stone-100">
                    <img
                      src={p.images[0] || p.enhanced_image || p.original_image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-artisan-terracotta uppercase tracking-wider">
                          {p.category}
                        </span>
                        <StatusBadge status={p.status} />
                      </div>
                      <h4 className="font-extrabold text-stone-900 text-xs leading-snug line-clamp-2 mt-0.5">
                        {p.name}
                      </h4>
                    </div>

                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-base font-black text-stone-900">
                        ₹{p.selling_price.toLocaleString()}
                      </span>
                      <span className="text-[11px] font-semibold text-stone-700">
                        Stock: <span className="font-bold text-stone-900">{p.quantity} pcs</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Card Action Buttons Bar */}
                <div className="bg-stone-50/80 border-t border-stone-100 px-3 py-2 flex items-center justify-between text-xs font-bold text-stone-600">
                  <button
                    onClick={e => handleShare(e, p)}
                    className="flex items-center space-x-1 hover:text-emerald-600 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={e => handleDuplicate(e, p.id)}
                    className="flex items-center space-x-1 hover:text-artisan-indigo transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Duplicate</span>
                  </button>

                  <button
                    onClick={e => handleDelete(e, p.id)}
                    className="flex items-center space-x-1 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
