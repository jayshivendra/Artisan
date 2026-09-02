import React from 'react';
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
  const parameters: ReadinessParam[] = [
    { name: 'Product Image', status: hasPhoto ? 'complete' : 'missing', detail: hasPhoto ? 'High-res source uploaded' : 'Image required' },
    { name: 'Image Quality', status: isEnhanced ? 'complete' : 'warning', detail: isEnhanced ? '5500K balanced lighting' : 'Check exposure' },
    { name: 'Background', status: isEnhanced ? 'complete' : 'warning', detail: isEnhanced ? 'Clean studio isolated' : 'Cluttered background' },
    { name: 'Product Title', status: hasTitle ? 'complete' : 'missing', detail: hasTitle ? 'SEO optimized' : 'Title missing' },
    { name: 'Description (Bilingual)', status: hasDescription ? 'complete' : 'missing', detail: hasDescription ? 'English & Hindi generated' : 'Describe craft' },
    { name: 'Material & Craft Method', status: hasMaterial ? 'complete' : 'missing', detail: hasMaterial ? 'Authentic craft mapped' : 'Specify materials' },
    { name: 'Fair Price', status: hasPrice ? 'complete' : 'warning', detail: hasPrice ? 'Within recommended range' : 'Needs review' },
    { name: 'Dimensions', status: hasDimensions ? 'complete' : 'warning', detail: hasDimensions ? 'Specified (14" x 10")' : 'Recommended for B2B' },
    { name: 'Category', status: hasCategory ? 'complete' : 'missing', detail: hasCategory ? 'National craft taxonomy' : 'Select category' }
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
            <span>AI Product Readiness Score</span>
          </div>
          <p className="text-[11px] text-stone-500 font-medium">
            Pre-publishing e-commerce & B2B compliance audit
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
          <span>Catalog Audit: Ready for Buyers</span>
          <span className="text-emerald-700">{score >= 90 ? '⭐⭐⭐ Top Tier Listing' : 'Good Quality'}</span>
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

      {/* Dynamic Recommendation Box */}
      {!hasDimensions && (
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-xs font-bold text-amber-950">
              Add product dimensions to improve your listing to 100%
            </span>
          </div>
          {onAddDimensions && (
            <button
              onClick={onAddDimensions}
              className="text-[11px] font-black text-amber-900 underline hover:text-amber-700 shrink-0 ml-2"
            >
              Add (14" × 10")
            </button>
          )}
        </div>
      )}
    </div>
  );
};
