import React from 'react';
import { QualityCheckAlert } from '../../types/index.js';
import { AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';

interface QualityCheckerCardProps {
  alerts: QualityCheckAlert[];
  isEnhanced: boolean;
  onAutoFix: () => void;
  isFixing?: boolean;
}

export const QualityCheckerCard: React.FC<QualityCheckerCardProps> = ({
  alerts,
  isEnhanced,
  onAutoFix,
  isFixing = false
}) => {
  return (
    <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
      isEnhanced 
        ? 'bg-emerald-50/80 border-emerald-200 shadow-sm' 
        : 'bg-amber-50/90 border-amber-200/90 shadow-sm'
    }`}>
      {/* Header Banner */}
      <div className={`px-3.5 py-2.5 flex items-center justify-between border-b ${
        isEnhanced ? 'border-emerald-100 bg-emerald-100/50' : 'border-amber-100 bg-amber-100/60'
      }`}>
        <div className="flex items-center space-x-2">
          {isEnhanced ? (
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          )}
          <div>
            <h4 className="text-xs font-black text-stone-900 tracking-tight">
              {isEnhanced ? 'AI Quality Audit Passed (Studio Grade)' : 'AI Catalog Quality Checker'}
            </h4>
            <p className="text-[10px] text-stone-600 font-medium">
              {isEnhanced 
                ? 'Ready for e-commerce marketplaces (Amazon, GeM, ONDC)' 
                : `${alerts.length} optimization suggestions detected`}
            </p>
          </div>
        </div>

        {!isEnhanced && (
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
            Action Needed
          </span>
        )}
      </div>

      {/* Checklist items */}
      <div className="p-3 space-y-2">
        {isEnhanced ? (
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center space-x-2 text-emerald-800 font-semibold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Background clutter completely removed (100% object isolation)</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-800 font-semibold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Studio lighting normalized (5500K neutral daylight)</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-800 font-semibold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Product auto-centered with 75% standard e-commerce fill</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-800 font-semibold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Soft grounded contact shadow added for realistic depth</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {alerts.map(a => (
              <div key={a.id} className="flex items-start space-x-2 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold text-stone-900 text-[11px] block leading-tight">
                    {a.title}
                  </span>
                  <span className="text-[10px] text-stone-600 leading-snug block">
                    {a.description}
                  </span>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={onAutoFix}
              disabled={isFixing}
              className="w-full mt-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-artisan-terracotta to-amber-600 text-white font-extrabold text-xs shadow-sm flex items-center justify-center space-x-1.5 active:scale-95 transition-all hover:shadow"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isFixing ? 'animate-spin' : ''}`} />
              <span>{isFixing ? 'Processing Image Enhancement...' : '⚡ Auto-Improve Image (Studio AI)'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
