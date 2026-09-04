import React from 'react';
import { useLanguage } from '../../context/LanguageContext.js';
import { PricingBreakdown } from '../../types/index.js';
import { DollarSign, ShieldCheck, TrendingUp, Info, Sliders, Check } from 'lucide-react';

interface PricingCalculatorCardProps {
  pricing: PricingBreakdown;
  onUpdateCost?: (rawCost: number, labourDays: number) => void;
  selectedPrice: number;
  onSelectPrice: (price: number) => void;
}

export const PricingCalculatorCard: React.FC<PricingCalculatorCardProps> = ({
  pricing,
  onUpdateCost,
  selectedPrice,
  onSelectPrice
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            ₹
          </div>
          <div>
            <h3 className="text-sm font-black text-stone-900 leading-tight">
              {t('pricing_title') || 'Dynamic Pricing Assistant'}
            </h3>
            <p className="text-[11px] text-stone-500 font-medium">
              {t('pricing_sub') || 'Transparent cost-plus model with market demand calibration'}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
          {t('pricing_fair_wage') || 'Fair Wage Model'}
        </span>
      </div>

      {/* Waterfall Breakdown Card */}
      <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/70 space-y-2 text-xs">
        <div className="flex justify-between items-center text-stone-700 font-semibold">
          <span>{t('pricing_raw_material') || 'Raw Material Cost'}</span>
          <span className="font-bold text-stone-900">₹{pricing.raw_material_cost}</span>
        </div>
        <div className="flex justify-between items-center text-stone-700 font-semibold">
          <span>{t('pricing_labour_estimate') || 'Artisan Wages & Labour'} ({pricing.labour_days} days)</span>
          <span className="font-bold text-stone-900">₹{pricing.labour_cost}</span>
        </div>
        <div className="flex justify-between items-center text-stone-700 font-semibold">
          <span>{t('pricing_packaging') || 'Eco-Friendly Packaging'}</span>
          <span className="font-bold text-stone-900">₹{pricing.packaging_cost}</span>
        </div>
        <div className="flex justify-between items-center text-stone-700 font-semibold">
          <span>{t('pricing_logistics') || 'Platform & Logistics Buffer'}</span>
          <span className="font-bold text-stone-900">₹{pricing.logistics_cost}</span>
        </div>

        <div className="border-t border-dashed border-stone-300 pt-2 flex justify-between items-center font-black text-stone-900">
          <span className="uppercase text-[11px] text-stone-600">{t('pricing_base_cost') || 'Estimated Base Cost'}</span>
          <span className="text-sm text-stone-900">₹{pricing.estimated_base_cost}</span>
        </div>
      </div>

      {/* Market Reference & Recommended Range */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-800 block">
            {t('pricing_market_benchmark') || 'Market Benchmark'}
          </span>
          <p className="text-base font-black text-indigo-950 mt-0.5">
            ₹{pricing.market_reference_min} – ₹{pricing.market_reference_max}
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-3 text-center shadow-sm">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 block">
            {t('pricing_recommended') || 'Recommended Selling Price'}
          </span>
          <p className="text-base font-black text-amber-950 mt-0.5">
            ₹{pricing.recommended_min} – ₹{pricing.recommended_max}
          </p>
        </div>
      </div>

      {/* Interactive Price Selector */}
      <div className="space-y-2 pt-1">
        <div className="flex justify-between items-center">
          <label className="text-xs font-black text-stone-800">
            {t('pricing_recommended') || 'Set Final Selling Price'}
          </label>
          <span className="text-base font-black text-artisan-terracotta">
            ₹{selectedPrice}
          </span>
        </div>

        <input
          type="range"
          min={Math.round(pricing.estimated_base_cost * 0.95)}
          max={Math.round(pricing.market_reference_max * 1.15)}
          step={25}
          value={selectedPrice}
          onChange={(e) => onSelectPrice(Number(e.target.value))}
          className="w-full accent-artisan-terracotta cursor-pointer"
        />

        <div className="flex justify-between text-[10px] text-stone-500 font-bold">
          <span>Min: ₹{pricing.recommended_min}</span>
          <span className="text-emerald-700 font-extrabold">
            {t('pricing_profit_margin') || 'Est. Profit'}: +₹{selectedPrice - (pricing.raw_material_cost + pricing.packaging_cost + pricing.logistics_cost)}
          </span>
          <span>Max: ₹{pricing.recommended_max}</span>
        </div>
      </div>
    </div>
  );
};
