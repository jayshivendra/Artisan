import React from 'react';
import { useLanguage } from '../../context/LanguageContext.js';

interface StatusBadgeProps {
  status: 'active' | 'low_stock' | 'draft' | 'archived' | 'new' | 'processing' | 'shipped' | 'completed';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { t } = useLanguage();

  switch (status) {
    case 'active':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>{t('status_active')}</span>
        </span>
      );
    case 'low_stock':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          <span>{t('status_low_stock')}</span>
        </span>
      );
    case 'draft':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-600 border border-stone-200">
          <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
          <span>{t('status_draft')}</span>
        </span>
      );
    case 'new':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
          <span>New Order</span>
        </span>
      );
    case 'processing':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <span>📦 Packing</span>
        </span>
      );
    case 'shipped':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <span>🚚 In Transit</span>
        </span>
      );
    case 'completed':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <span>✓ Delivered</span>
        </span>
      );
    default:
      return null;
  }
};
