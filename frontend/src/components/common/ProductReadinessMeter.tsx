import React from 'react';
import { useLanguage } from '../../context/LanguageContext.js';
import { CheckCircle2, AlertTriangle, XCircle, Sparkles } from 'lucide-react';

interface ReadinessParam {
  name: string;
  status: 'complete' | 'warning' | 'missing';
  detail: string;
}

interface ProductReadinessMeterProps {
  score: number;
  hasPhoto: boolean;
  isEnhanced: boolean;
  hasTitle: boolean;
  hasDescription: boolean;
  hasMaterial: boolean;
  hasPrice: boolean;
  hasDimensions: boolean;
  hasCategory: boolean;
  onAddDimensions?: () => void;
}

export const ProductReadinessMeter: React.FC<ProductReadinessMeterProps> = ({
  score = 91,
  hasPhoto = true,
  isEnhanced = true,
  hasTitle = true,
  hasDescription = true,
  hasMaterial = true,
  hasPrice = true,
  hasDimensions = false,
  hasCategory = true,
  onAddDimensions
}) => {
  const { t } = useLanguage();

  const parameters: ReadinessParam[] = [
    { name: t('param_product_image') || 'Product Image', status: hasPhoto ? 'complete' : 'missing', detail: hasPhoto ? '✓' : '...' },
    { name: t('param_image_quality') || 'Image Quality', status: isEnhanced ? 'complete' : 'warning', detail: isEnhanced ? '5500K ✓' : '...' },
    { name: t('param_background') || 'Background Noise', status: isEnhanced ? 'complete' : 'warning', detail: isEnhanced ? (t('param_background_detail_clean') || 'Noise Removed') : (t('param_background_detail_noisy') || 'Noise Detected') },
    { name: t('param_title') || 'Product Title', status: hasTitle ? 'complete' : 'missing', detail: hasTitle ? '✓' : '...' },
    { name: t('param_description') || 'Description (Bilingual)', status: hasDescription ? 'complete' : 'missing', detail: hasDescription ? '✓' : '...' },
    { name: t('param_materials') || 'Material & Craft Method', status: hasMaterial ? 'complete' : 'missing', detail: hasMaterial ? '✓' : '...' },
    { name: t('param_price') || 'Fair Price', status: hasPrice ? 'complete' : 'warning', detail: hasPrice ? '✓' : '...' },
    { name: t('param_dimensions') || 'Dimensions', status: hasDimensions ? 'complete' : 'warning', detail: hasDimensions ? '14" x 10"' : '...' },
    { name: t('param_category') || 'Category', status: hasCategory ? 'complete' : 'missing', detail: hasCategory ? '✓' : '...' }
  ];

  const getStatusIcon = (status: ReadinessParam['status']) => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 stroke-[2.5]" />;
      case 'missing':
        return <XCircle className="w-4 h-4 text-red-500 stroke-[2.5]" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-4 space-y-4">
      {/* Score Header */}
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div>
          <div className="flex items-center space-x-1.5 text-artisan-terracotta text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('step6_badge') || 'Listing Audit & Readiness Score'}</span>
          </div>
          <p className="text-[11px] text-stone-500 font-medium">
            {t('step6_sub') || 'Pre-publishing e-commerce & B2B compliance audit'}
          </p>
        </div>

        {/* Circular / Badge Score */}
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1.5 rounded-2xl font-black text-sm border flex items-center space-x-1 ${
            score >= 90 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : score >= 75 
              ? 'bg-amber-50 text-amber-800 border-amber-200' 
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            <span>{score}</span>
            <span className="text-[10px] text-stone-500">/ 100</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${score}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-[10px] font-bold text-stone-600">
          <span>{t('step6_badge') || 'Catalog Audit'}: {t('step7_live_badge') || 'Ready'}</span>
          <span className="text-emerald-700">{score >= 90 ? '⭐⭐⭐' : 'Good'}</span>
        </div>
      </div>

      {/* Parameter Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {parameters.map(p => (
          <div
            key={p.name}
            className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-100"
          >
            <div className="flex items-center space-x-2">
              {getStatusIcon(p.status)}
              <span className="font-bold text-stone-800 text-[11px]">{p.name}</span>
            </div>
            <span className="text-[10px] font-medium text-stone-600">
              {p.detail}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
