import React from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useVoice } from '../../context/VoiceContext.js';
import { Header } from '../../components/layout/Header.js';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ArrowRight,
  Printer,
  ShoppingBag
} from 'lucide-react';

export const BuyerOrdersScreen: React.FC = () => {
  const { orders, navigateTo } = useAppState();
  const { playChime } = useVoice();

  return (
    <div className="flex flex-col min-h-full bg-stone-50 select-none pb-24">
      <Header
        title="My Craft Orders"
        showBack
        onBack={() => navigateTo('buyer_marketplace')}
        audioGuideText="Track your placed handicraft orders, carrier tracking numbers, and live crafting status."
      />

      <div className="p-4 space-y-4 max-w-lg mx-auto w-full">
        {orders.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-3xl p-8 text-center shadow-sm">
            <span className="text-4xl block mb-2">📦</span>
            <h3 className="font-extrabold text-stone-900 text-base">No Orders Placed Yet</h3>
            <p className="text-xs text-stone-500 mt-1">When you order from master artisans, live tracking will appear here.</p>
            <button
              onClick={() => navigateTo('buyer_marketplace')}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-artisan-terracotta to-orange-500 text-white font-extrabold text-xs rounded-2xl shadow"
            >
              Start Exploring Crafts →
            </button>
          </div>
        ) : (
          orders.map(order => {
            const step = order.status_step || (order.status === 'completed' ? 4 : (order.status === 'shipped' ? 3 : (order.status === 'processing' ? 2 : 1)));
            return (
              <div key={order.id} className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div>
                    <span className="font-mono text-xs font-black text-stone-900">{order.order_number}</span>
                    <span className="text-[10px] text-stone-400 block">{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold capitalize ${
                    order.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {order.status === 'completed' ? 'Delivered' : (order.status === 'shipped' ? 'Dispatched' : 'Artisan Crafting')}
                  </span>
                </div>

                {/* 4-Step Visual Tracker */}
                <div className="py-2">
                  <div className="flex items-center justify-between relative">
                    <div className="absolute left-4 right-4 top-3.5 h-1 bg-stone-100 -z-0">
                      <div
                        className="h-full bg-artisan-terracotta transition-all duration-500"
                        style={{ width: `${((step - 1) / 3) * 100}%` }}
                      />
                    </div>

                    {[
                      { num: 1, label: 'Placed' },
                      { num: 2, label: 'Crafting' },
                      { num: 3, label: 'Shipped' },
                      { num: 4, label: 'Delivered' }
                    ].map(st => (
                      <div key={st.num} className="flex flex-col items-center z-10">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all ${
                          step >= st.num
                            ? 'bg-artisan-terracotta border-artisan-terracotta text-white shadow'
                            : 'bg-white border-stone-200 text-stone-400'
                        }`}>
                          {step > st.num ? '✓' : st.num}
                        </div>
                        <span className="text-[9px] font-bold text-stone-600 mt-1">{st.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Item Summary */}
                <div className="flex items-center space-x-3 bg-stone-50 p-3 rounded-2xl border border-stone-100">
                  <img
                    src={order.product_image}
                    alt={order.product_name}
                    className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-stone-900 text-xs truncate">{order.product_name}</h4>
                    <span className="text-[10px] text-stone-500">Qty: {order.quantity} • Total: ₹{order.total_amount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Tracking & Carrier Info */}
                {order.tracking_id && (
                  <div className="text-[11px] text-stone-600 bg-amber-50/60 border border-amber-200/60 p-2.5 rounded-xl flex justify-between items-center">
                    <div>
                      <strong>Carrier:</strong> {order.courier_partner || 'India Post'}
                      <div className="font-mono text-[10px] text-stone-500">{order.tracking_id}</div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-800">Track Parcel</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
