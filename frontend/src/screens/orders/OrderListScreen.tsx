import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useVoice } from '../../context/VoiceContext.js';
import { Header } from '../../components/layout/Header.js';
import { StatusBadge } from '../../components/common/StatusBadge.js';
import { ShoppingBag, ArrowRight, Package, Truck, CheckCircle2, Phone, MapPin } from 'lucide-react';

export const OrderListScreen: React.FC = () => {
  const { orders, setSelectedOrderId, navigateTo, advanceOrderStatus } = useAppState();
  const { t } = useLanguage();
  const { playChime, speak } = useVoice();

  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'processing' | 'shipped' | 'completed'>('all');

  const filteredOrders = orders.filter(o => (activeTab === 'all' ? true : o.status === activeTab));

  const handleOrderClick = (id: string) => {
    playChime('tap');
    setSelectedOrderId(id);
    navigateTo('order_detail');
  };

  const handleQuickAdvance = (e: React.MouseEvent, ord: typeof orders[0]) => {
    e.stopPropagation();
    playChime('success');
    advanceOrderStatus(ord.id);
    if (ord.status_step === 1) speak(`Order ${ord.order_number} marked as Packed.`);
    else if (ord.status_step === 2) speak(`Order ${ord.order_number} marked as Shipped with India Post tracking.`);
    else if (ord.status_step === 3) speak(`Order ${ord.order_number} marked as Delivered.`);
  };

  return (
    <div className="flex flex-col min-h-full bg-stone-50 select-none pb-8">
      <Header
        title={t('nav_orders')}
        audioGuideText={`You have ${orders.filter(o => o.status === 'new').length} new orders. Tap on any order to view customer delivery details.`}
      />

      <div className="p-4 space-y-3">
        {/* Status Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: `All (${orders.length})` },
            { id: 'new', label: `${t('tab_new')} (${orders.filter(o => o.status === 'new').length})` },
            { id: 'processing', label: `${t('tab_processing')} (${orders.filter(o => o.status === 'processing').length})` },
            { id: 'shipped', label: `${t('tab_shipped')} (${orders.filter(o => o.status === 'shipped').length})` },
            { id: 'completed', label: `${t('tab_completed')} (${orders.filter(o => o.status === 'completed').length})` }
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

        {/* Order Cards List */}
        <div className="space-y-3 pt-1">
          {filteredOrders.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-3xl p-8 text-center my-4">
              <span className="text-3xl block mb-2">📦</span>
              <h4 className="font-extrabold text-stone-900 text-sm">No orders in this tab</h4>
              <p className="text-xs text-stone-700 mt-1">Your new orders will show up here automatically.</p>
            </div>
          ) : (
            filteredOrders.map(ord => (
              <div
                key={ord.id}
                onClick={() => handleOrderClick(ord.id)}
                className="bg-white rounded-3xl border border-stone-200 shadow-sm p-4 cursor-pointer hover:border-artisan-terracotta transition-all active:scale-98 group"
              >
                {/* Top Row: Order # & Status Badge */}
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-extrabold text-stone-900">{ord.order_number}</span>
                    <span className="text-[10px] text-stone-700 font-semibold">• {ord.buyer_location.split(',')[0]}</span>
                  </div>
                  <StatusBadge status={ord.status} />
                </div>

                {/* Product & Buyer Details */}
                <div className="flex items-center space-x-3 my-3">
                  <img
                    src={ord.product_image}
                    alt={ord.product_name}
                    className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="font-extrabold text-stone-900 text-xs leading-snug line-clamp-1">
                      {ord.product_name}
                    </h4>
                    <p className="text-[11px] text-stone-700 font-semibold mt-0.5">
                      Buyer: <span className="font-bold text-stone-800">{ord.buyer_name}</span> ({ord.quantity} pcs)
                    </p>
                    <span className="text-sm font-black text-artisan-terracotta mt-0.5 block">
                      ₹{ord.total_amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* 4-Step Progress Indicator */}
                <div className="my-2 bg-stone-50 p-2.5 rounded-2xl border border-stone-100">
                  <div className="flex items-center justify-between text-[10px] font-extrabold">
                    <span className={ord.status_step >= 1 ? 'text-emerald-700 font-black' : 'text-stone-700'}>
                      1. {t('step_received')}
                    </span>
                    <span className={ord.status_step >= 2 ? 'text-emerald-700 font-black' : 'text-stone-700'}>
                      2. {t('step_packed')}
                    </span>
                    <span className={ord.status_step >= 3 ? 'text-emerald-700 font-black' : 'text-stone-700'}>
                      3. {t('step_shipped_label')}
                    </span>
                    <span className={ord.status_step >= 4 ? 'text-emerald-700 font-black' : 'text-stone-700'}>
                      4. {t('step_delivered')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 mt-1.5">
                    {[1, 2, 3, 4].map(s => (
                      <div
                        key={s}
                        className={`h-1.5 flex-1 rounded-full ${
                          s <= ord.status_step ? 'bg-emerald-500' : 'bg-stone-200'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Bottom Quick Action */}
                {ord.status_step < 4 && (
                  <button
                    onClick={e => handleQuickAdvance(e, ord)}
                    className="w-full mt-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-artisan-terracotta to-orange-500 text-white font-extrabold text-xs shadow-sm flex items-center justify-center space-x-1.5 active:scale-95 transition-all"
                  >
                    {ord.status_step === 1 ? (
                      <>
                        <Package className="w-3.5 h-3.5" />
                        <span>{t('btn_mark_packed')}</span>
                      </>
                    ) : ord.status_step === 2 ? (
                      <>
                        <Truck className="w-3.5 h-3.5" />
                        <span>{t('btn_mark_shipped')}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Delivered</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
