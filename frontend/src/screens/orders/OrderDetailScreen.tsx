import React from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useVoice } from '../../context/VoiceContext.js';
import { Header } from '../../components/layout/Header.js';
import { StatusBadge } from '../../components/common/StatusBadge.js';
import { Phone, MapPin, Package, Truck, CheckCircle2, Printer, ArrowLeft } from 'lucide-react';

export const OrderDetailScreen: React.FC = () => {
  const { orders, selectedOrderId, advanceOrderStatus, navigateTo } = useAppState();
  const { t } = useLanguage();
  const { playChime, speak } = useVoice();

  const order = orders.find(o => o.id === selectedOrderId) || orders[0];

  if (!order) {
    return (
      <div className="p-6 text-center">
        <p>Order not found.</p>
        <button onClick={() => navigateTo('orders')} className="mt-4 text-xs font-bold text-artisan-terracotta">
          Back to Orders
        </button>
      </div>
    );
  }

  const handleAdvance = () => {
    playChime('success');
    advanceOrderStatus(order.id);
    speak(`Order status updated to step ${order.status_step + 1}.`);
  };

  const handleCall = () => {
    playChime('tap');
    window.open(`tel:${order.buyer_phone}`, '_self');
  };

  return (
    <div className="flex flex-col min-h-full bg-stone-50 select-none pb-8">
      <Header
        title={`Order ${order.order_number}`}
        showBack={true}
        onBack={() => navigateTo('orders')}
        audioGuideText={`Order details for ${order.buyer_name}. Total amount ₹${order.total_amount}.`}
      />

      <div className="p-4 space-y-4">
        {/* Order Status Header Card */}
        <div className="bg-white border border-stone-200 rounded-3xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-stone-700 uppercase tracking-wider block">
              Order Status
            </span>
            <span className="text-base font-black text-stone-900 capitalize mt-0.5 block">
              {order.status === 'new' ? '1. Order Received' : order.status === 'processing' ? '2. Packed & Ready' : order.status === 'shipped' ? '3. Handed to Courier' : '4. Delivered'}
            </span>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Product Details */}
        <div className="bg-white border border-stone-200 rounded-3xl p-4 shadow-sm space-y-3">
          <div className="flex items-center space-x-3">
            <img
              src={order.product_image}
              alt={order.product_name}
              className="w-20 h-20 rounded-2xl object-cover border border-stone-200"
            />
            <div className="flex-1">
              <h3 className="font-extrabold text-stone-900 text-sm leading-snug">
                {order.product_name}
              </h3>
              <p className="text-xs text-stone-700 font-semibold mt-1">
                Quantity: <span className="font-bold text-stone-900">{order.quantity} units</span>
              </p>
              <p className="text-sm font-black text-artisan-terracotta mt-0.5">
                ₹{order.total_amount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Information */}
        <div className="bg-white border border-stone-200 rounded-3xl p-4 shadow-sm space-y-3">
          <span className="text-xs font-extrabold text-stone-700 uppercase tracking-wider block">
            Customer Delivery Details
          </span>

          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div>
              <span className="font-extrabold text-stone-900 text-sm block">
                {order.buyer_name}
              </span>
              <span className="text-xs text-stone-700 font-medium">
                {order.buyer_phone}
              </span>
            </div>
            <button
              onClick={handleCall}
              className="p-2.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 active:scale-95 transition-transform"
              title="Call Buyer"
            >
              <Phone className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <div className="flex items-start space-x-2 text-xs text-stone-700">
            <MapPin className="w-4 h-4 text-artisan-terracotta shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{order.shipping_address}</span>
          </div>

          {order.courier_partner && (
            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-xs space-y-1">
              <span className="font-bold text-artisan-indigo block">
                Courier Partner: {order.courier_partner}
              </span>
              <span className="text-[11px] text-stone-700 font-semibold block">
                Tracking ID: <span className="font-mono font-bold text-stone-900">{order.tracking_id}</span>
              </span>
            </div>
          )}
        </div>

        {/* Advance Progression Action */}
        {order.status_step < 4 && (
          <button
            onClick={handleAdvance}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-artisan-terracotta to-orange-500 text-white font-black text-sm shadow-elevated flex items-center justify-center space-x-2 active:scale-95 transition-all"
          >
            {order.status_step === 1 ? (
              <>
                <Package className="w-4 h-4" />
                <span>Mark as Packed & Print Label</span>
              </>
            ) : order.status_step === 2 ? (
              <>
                <Truck className="w-4 h-4" />
                <span>Handover to Speed Post Courier</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Delivery Completed</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
