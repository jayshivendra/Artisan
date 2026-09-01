import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useVoice } from '../../context/VoiceContext.js';
import { Header } from '../../components/layout/Header.js';
import { StatusBadge } from '../../components/common/StatusBadge.js';
import { 
  Share2, 
  Copy, 
  Trash2, 
  Sparkles, 
  Check, 
  Globe, 
  Save, 
  Eye, 
  DollarSign, 
  Package, 
  ArrowLeft 
} from 'lucide-react';

export const ProductDetailScreen: React.FC = () => {
  const { products, selectedProductId, updateProduct, deleteProduct, navigateTo, duplicateProduct } = useAppState();
  const { t, language } = useLanguage();
  const { playChime, speak } = useVoice();

  const product = products.find(p => p.id === selectedProductId) || products[0];

  const [price, setPrice] = useState<number>(product?.selling_price || 1999);
  const [stock, setStock] = useState<number>(product?.quantity || 10);
  const [status, setStatus] = useState<typeof product.status>(product?.status || 'active');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  if (!product) {
    return (
      <div className="p-6 text-center">
        <p>Product not found.</p>
        <button onClick={() => navigateTo('my_products')} className="mt-4 text-xs font-bold text-artisan-terracotta">
          Back to products
        </button>
      </div>
    );
  }

  const handleSave = () => {
    playChime('success');
    updateProduct(product.id, {
      selling_price: price,
      quantity: stock,
      status: status
    });
    setIsSaved(true);
    speak('Product changes saved successfully.');
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-full bg-stone-50 select-none pb-8">
      <Header
        title="Product Details"
        showBack={true}
        onBack={() => navigateTo('my_products')}
        audioGuideText={`Viewing ${product.name}. Current price is ₹${product.selling_price}. You can change price or stock here.`}
      />

      <div className="p-4 space-y-4">
        {/* Product Image Carousel / Hero */}
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-stone-200 bg-stone-900">
          <img
            src={product.images[0] || product.enhanced_image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3">
            <StatusBadge status={status} />
          </div>
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            {product.category}
          </div>
        </div>

        {/* Product Title & Basic Info */}
        <div className="bg-white border border-stone-200 rounded-3xl p-4 shadow-sm space-y-3">
          <h2 className="text-lg font-black text-stone-900 leading-tight">
            {product.name}
          </h2>

          <p className="text-xs text-stone-700 font-medium leading-relaxed">
            {language === 'hi' && product.description_hi
              ? product.description_hi
              : language === 'te' && product.description_regional
              ? product.description_regional
              : product.description}
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs font-semibold text-stone-700">
            <div>Material: <span className="font-bold text-stone-900">{product.material}</span></div>
            <div>Craft: <span className="font-bold text-stone-900">{product.production_method}</span></div>
            <div>Time: <span className="font-bold text-stone-900">{product.making_time_days} Days</span></div>
            <div>Dimensions: <span className="font-bold text-stone-900">{product.dimensions}</span></div>
          </div>
        </div>

        {/* Quick Edit Price & Stock Card */}
        <div className="bg-white border border-stone-200 rounded-3xl p-4 shadow-sm space-y-3">
          <span className="text-xs font-extrabold text-stone-700 uppercase tracking-wider block">
            Quick Pricing & Stock Controls
          </span>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-extrabold text-stone-700 mb-1">
                Selling Price (₹)
              </label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full text-base font-black text-stone-900 p-2.5 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-artisan-terracotta"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-stone-700 mb-1">
                Units in Stock
              </label>
              <input
                type="number"
                value={stock}
                onChange={e => setStock(Number(e.target.value))}
                className="w-full text-base font-black text-stone-900 p-2.5 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-artisan-terracotta"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-stone-700 mb-1">
              Listing Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'active', label: 'Active' },
                { id: 'low_stock', label: 'Low Stock' },
                { id: 'draft', label: 'Draft' }
              ].map(st => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStatus(st.id as any)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                    status === st.id
                      ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-artisan-terracotta to-orange-500 text-white font-extrabold text-xs shadow-elevated flex items-center justify-center space-x-1.5 active:scale-95 transition-all"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>

        {/* Multi-channel Sales Hub status */}
        <div className="bg-white border border-stone-200 rounded-3xl p-4 shadow-sm space-y-2">
          <span className="text-xs font-extrabold text-stone-900 uppercase tracking-wider block">
            Connected Marketplaces
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold text-stone-700">
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center space-x-2">
              <span>📱 App Store:</span>
              <span className="text-emerald-600 font-extrabold">Active</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center space-x-2">
              <span>🏛️ GeM Portal:</span>
              <span className="text-emerald-600 font-extrabold">Synced</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center space-x-2">
              <span>🤝 B2B Wholesale:</span>
              <span className="text-emerald-600 font-extrabold">Active</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center space-x-2">
              <span>🌐 ONDC Hub:</span>
              <span className="text-emerald-600 font-extrabold">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
