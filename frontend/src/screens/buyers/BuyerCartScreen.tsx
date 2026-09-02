import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useVoice } from '../../context/VoiceContext.js';
import { Header } from '../../components/layout/Header.js';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  ShieldCheck, 
  Check, 
  CreditCard, 
  QrCode, 
  Truck, 
  Tag 
} from 'lucide-react';

export const BuyerCartScreen: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, clearCart, createBuyerOrder, navigateTo, user } = useAppState();
  const { playChime, speak } = useVoice();

  const [couponCode, setCouponCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<string>('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<string>('UPI (Instant QR)');
  const [shippingAddress, setShippingAddress] = useState<string>(
    user.location ? `42, Heritage Enclave, ${user.location}` : '42, Heritage Enclave, Indiranagar, Bengaluru - 560038'
  );

  const subtotal = cart.reduce((sum, item) => sum + (item.product.selling_price * item.quantity), 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'ARTISAN10') {
      setDiscountPercent(10);
      setCouponMessage('✓ 10% Handcraft Patron Discount applied!');
      playChime('success');
    } else if (code === 'HANDMADE15') {
      setDiscountPercent(15);
      setCouponMessage('✓ 15% Master Weaver Discount applied!');
      playChime('success');
    } else {
      setDiscountPercent(0);
      setCouponMessage('✕ Invalid coupon. Try ARTISAN10 or HANDMADE15');
      playChime('tap');
    }
  };

  const handleConfirmOrder = () => {
    playChime('success');
    createBuyerOrder(cart, shippingAddress, selectedPayment);
    speak('Order placed successfully! Rural artisans are preparing your authentic craft.');
    setIsCheckoutOpen(false);
    navigateTo('buyer_orders');
  };

  return (
    <div className="flex flex-col min-h-full bg-stone-50 select-none pb-24">
      <Header
        title="My Craft Cart"
        showBack
        onBack={() => navigateTo('buyer_marketplace')}
        audioGuideText="Review the handcrafted items in your cart, apply discount coupons, and complete your order."
      />

      <div className="p-4 space-y-4 max-w-lg mx-auto w-full">
        {cart.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-3xl p-8 text-center shadow-sm">
            <span className="text-4xl block mb-2">🛍️</span>
            <h3 className="font-extrabold text-stone-900 text-base">Your Cart is Empty</h3>
            <p className="text-xs text-stone-500 mt-1">Explore authentic creations and support rural weavers & sculptors.</p>
            <button
              onClick={() => navigateTo('buyer_marketplace')}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-artisan-terracotta to-orange-500 text-white font-extrabold text-xs rounded-2xl shadow"
            >
              Explore Marketplace →
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="bg-white border border-stone-200 rounded-3xl p-4 shadow-sm divide-y divide-stone-100">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center space-x-3">
                  <img
                    src={product.images[0] || product.original_image}
                    alt={product.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-stone-900 text-xs truncate">{product.name}</h4>
                    <span className="text-[10px] text-stone-500 block truncate">By {product.artisan_name || 'Master Artisan'}</span>
                    <span className="font-black text-stone-900 text-xs block mt-1">
                      ₹{product.selling_price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center bg-stone-100 rounded-xl p-1 border border-stone-200">
                      <button
                        onClick={() => updateCartQuantity(product.id, -1)}
                        className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-stone-700 shadow-sm font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-black text-stone-900">{quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(product.id, 1)}
                        className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-stone-700 shadow-sm font-bold text-xs"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Coupon Box */}
            <div className="bg-white border border-stone-200 rounded-3xl p-4 shadow-sm">
              <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon code (e.g. ARTISAN10)"
                  className="flex-1 text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl uppercase font-bold text-stone-900 focus:outline-none focus:border-artisan-terracotta"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-artisan-terracotta text-white font-extrabold text-xs rounded-xl shadow-sm hover:bg-artisan-terracottaDark transition-colors"
                >
                  Apply
                </button>
              </form>
              {couponMessage && (
                <span className={`text-[11px] font-bold block mt-2 ${discountPercent > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {couponMessage}
                </span>
              )}
            </div>

            {/* Order Price Breakdown */}
            <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm space-y-2.5">
              <div className="flex justify-between text-xs text-stone-600 font-semibold">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-xs text-emerald-700 font-bold">
                  <span>Artisan Patron Discount</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-xs text-stone-600 font-semibold">
                <span>Artisan Insured Delivery</span>
                <span className="text-emerald-700 font-bold">FREE</span>
              </div>

              <div className="pt-2 border-t border-stone-100 flex justify-between text-base font-black text-stone-900">
                <span>Total Amount</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-4 bg-gradient-to-r from-artisan-terracotta to-orange-500 text-white font-extrabold text-sm rounded-2xl shadow-elevated flex items-center justify-center space-x-2 mt-2"
              >
                <span>Proceed to Checkout (₹{total.toLocaleString('en-IN')}) →</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in select-none">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 border border-stone-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-extrabold text-stone-900 text-base">Complete Order</h3>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="text-xs font-bold text-stone-500"
              >
                Cancel
              </button>
            </div>

            {/* Shipping Address */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Delivery Address</label>
              <textarea
                rows={2}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-2xl focus:border-artisan-terracotta focus:outline-none font-medium"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Select Payment Method</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {[
                  { id: 'UPI (Instant QR)', label: '📱 Instant UPI / QR' },
                  { id: 'Credit/Debit Card', label: '💳 Cards (Visa/MC)' },
                  { id: 'Net Banking', label: '🏛️ Net Banking' },
                  { id: 'Cash on Delivery', label: '💵 Cash on Delivery' }
                ].map(opt => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setSelectedPayment(opt.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                      selectedPayment === opt.id
                        ? 'border-artisan-terracotta bg-artisan-terracottaLight text-artisan-terracotta'
                        : 'border-stone-200 bg-stone-50 text-stone-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary Line */}
            <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100 flex justify-between items-center text-xs font-bold">
              <span>Total Payable Amount</span>
              <span className="text-sm font-black text-stone-900">₹{total.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={handleConfirmOrder}
              className="w-full py-3.5 bg-gradient-to-r from-artisan-terracotta to-orange-500 text-white font-extrabold text-sm rounded-2xl shadow-elevated"
            >
              Confirm Order & Pay →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
