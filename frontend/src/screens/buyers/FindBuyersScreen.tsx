import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useVoice } from '../../context/VoiceContext.js';
import { Header } from '../../components/layout/Header.js';
import { QuotationModal } from '../../components/modals/QuotationModal.js';
import { BuyerRequirement } from '../../types/index.js';
import { 
  Building2, 
  Hotel, 
  Store, 
  Palette, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  Filter, 
  Clock, 
  MapPin, 
  Briefcase 
} from 'lucide-react';

export const FindBuyersScreen: React.FC = () => {
  const { buyers, navigateTo } = useAppState();
  const { t } = useLanguage();
  const { playChime, speak } = useVoice();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedBuyerForQuote, setSelectedBuyerForQuote] = useState<BuyerRequirement | null>(null);

  const filteredBuyers = buyers.filter(b => {
    if (activeCategory === 'all') return true;
    return b.buyer_type.toLowerCase() === activeCategory.toLowerCase();
  });

  const handleOpenQuotation = (buyer: BuyerRequirement) => {
    playChime('tap');
    setSelectedBuyerForQuote(buyer);
    speak(`Opening proposal for ${buyer.business_name}. Target budget is ${buyer.budget_per_unit}.`);
  };

  const getBuyerIcon = (type: string) => {
    switch (type) {
      case 'Hotel':
        return <Hotel className="w-5 h-5 text-artisan-indigo" />;
      case 'Retailer':
      case 'Wholesaler':
        return <Store className="w-5 h-5 text-artisan-terracotta" />;
      case 'Interior Designer':
        return <Palette className="w-5 h-5 text-purple-600" />;
      case 'Govt':
        return <Building2 className="w-5 h-5 text-emerald-600" />;
      default:
        return <Briefcase className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-stone-50 select-none pb-8">
      <Header
        title={t('b2b_title')}
        audioGuideText="Here are bulk buyers and hotels looking for authentic artisan creations. Tap Send My Products to submit wholesale prices."
      />

      <div className="p-4 space-y-3">
        {/* Intro Card */}
        <div className="bg-gradient-to-tr from-stone-900 to-indigo-950 text-white rounded-3xl p-4 shadow-xl border border-stone-800 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-amber-300 text-xs font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Wholesale B2B</span>
            </div>
            <h3 className="font-extrabold text-base leading-tight">
              Verified Bulk Buyer Demands
            </h3>
            <p className="text-[11px] text-stone-300 font-medium mt-0.5 max-w-xs">
              Direct procurement orders from luxury hotels, designers, and boutiques.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All Buyers' },
            { id: 'hotel', label: '🏨 Hotels' },
            { id: 'retailer', label: '🏬 Retailers' },
            { id: 'interior designer', label: '🎨 Designers' },
            { id: 'govt', label: '🏛️ Govt (GeM)' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => {
                playChime('tap');
                setActiveCategory(f.id);
              }}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === f.id
                  ? 'bg-stone-900 text-white shadow'
                  : 'bg-white text-stone-600 border border-stone-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Requirements Feed */}
        <div className="space-y-3 pt-1">
          {filteredBuyers.map(req => (
            <div
              key={req.id}
              className="bg-white rounded-3xl border border-stone-200/90 p-4 shadow-sm space-y-3 hover:border-artisan-indigo transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center shrink-0">
                    {getBuyerIcon(req.buyer_type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="font-black text-stone-900 text-xs">{req.business_name}</span>
                      {req.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <span className="text-[10px] font-bold text-stone-700 block">
                      {req.buyer_type} • {req.location}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-stone-700 flex items-center space-x-0.5">
                  <Clock className="w-3 h-3" />
                  <span>{req.posted_date}</span>
                </span>
              </div>

              {/* Title & Details */}
              <div>
                <h4 className="font-black text-stone-900 text-sm leading-snug">
                  {req.title}
                </h4>
                <p className="text-xs text-stone-700 font-medium mt-1 leading-relaxed">
                  {req.details}
                </p>
              </div>

              {/* Requirement Metrics Chips */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-stone-700">
                <div className="bg-stone-50 p-2 rounded-xl border border-stone-100">
                  Qty: <span className="font-extrabold text-stone-900">{req.quantity_needed}</span>
                </div>
                <div className="bg-amber-50 text-amber-900 p-2 rounded-xl border border-amber-200/70">
                  Budget: <span className="font-black">{req.budget_per_unit}</span>
                </div>
              </div>

              {/* 1-Tap Action Button */}
              <button
                onClick={() => handleOpenQuotation(req)}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-artisan-indigo via-blue-700 to-indigo-600 text-white font-extrabold text-xs shadow-md flex items-center justify-center space-x-2 active:scale-95 transition-all hover:shadow-lg"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t('btn_send_proposal')}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Quotation Proposal */}
      {selectedBuyerForQuote && (
        <QuotationModal
          buyer={selectedBuyerForQuote}
          onClose={() => setSelectedBuyerForQuote(null)}
        />
      )}
    </div>
  );
};
