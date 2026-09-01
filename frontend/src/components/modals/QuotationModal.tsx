import React, { useState } from 'react';
import { BuyerRequirement } from '../../types/index.js';
import { useAppState } from '../../context/AppStateContext.js';
import { useVoice } from '../../context/VoiceContext.js';
import { X, Send, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuotationModalProps {
  buyer: BuyerRequirement;
  onClose: () => void;
}

export const QuotationModal: React.FC<QuotationModalProps> = ({ buyer, onClose }) => {
  const { products, markNotificationRead } = useAppState();
  const { playChime, speak } = useVoice();

  const [unitPrice, setUnitPrice] = useState<number>(750);
  const [quantity, setQuantity] = useState<number>(100);
  const [leadDays, setLeadDays] = useState<number>(25);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const totalValue = unitPrice * quantity;

  const handleSubmit = () => {
    setIsSubmitting(true);
    playChime('tap');

    fetch(`/api/buyers/${buyer.id}/send-quotation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        buyer_id: buyer.id,
        total_value: totalValue,
        unit_price: unitPrice,
        quantity,
        leadDays
      })
    })
      .then(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        playChime('success');
        speak(`Quotation of ₹${totalValue.toLocaleString()} successfully sent to ${buyer.business_name}.`);
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
        setTimeout(() => {
          onClose();
        }, 2200);
      })
      .catch(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        playChime('success');
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
        setTimeout(() => {
          onClose();
        }, 2200);
      });
  };

  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-50 flex flex-col justify-end p-0 sm:p-4 animate-in fade-in select-none">
      <div className="bg-white w-full rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl flex flex-col max-h-[90%] overflow-y-auto border border-stone-100">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-base">
                Send Wholesale Quotation
              </h3>
              <p className="text-[10px] text-stone-700 font-semibold">
                AI Match for {buyer.buyer_type}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-700 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-extrabold text-stone-900 text-lg">
              Quotation Submitted! 🎉
            </h4>
            <p className="text-xs text-stone-700 mt-1 max-w-xs">
              {buyer.business_name} will contact you directly regarding sample dispatch.
            </p>
          </div>
        ) : (
          <>
            {/* Requirement Summary */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 my-3">
              <div className="flex items-center justify-between text-xs font-bold text-stone-900">
                <span>{buyer.business_name}</span>
                <span className="text-emerald-700 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Buyer</span>
                </span>
              </div>
              <p className="text-xs text-stone-700 font-medium mt-1">
                {buyer.title}
              </p>
              <div className="flex items-center space-x-2 mt-2 text-[11px] font-bold text-artisan-terracotta bg-artisan-terracottaLight px-2.5 py-1 rounded-lg w-fit">
                <span>Target Budget: {buyer.budget_per_unit}</span>
              </div>
            </div>

            {/* Interactive Quotation Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-extrabold text-stone-700 uppercase mb-1">
                  Your Wholesale Price per Unit (₹)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="300"
                    max="2000"
                    step="25"
                    value={unitPrice}
                    onChange={e => setUnitPrice(Number(e.target.value))}
                    className="flex-1 accent-artisan-terracotta cursor-pointer"
                  />
                  <span className="font-black text-stone-900 text-base min-w-[70px] text-right">
                    ₹{unitPrice}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-stone-700 uppercase mb-1">
                  Quantity You Can Supply
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="20"
                    max="500"
                    step="10"
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    className="flex-1 accent-artisan-indigo cursor-pointer"
                  />
                  <span className="font-black text-stone-900 text-base min-w-[70px] text-right">
                    {quantity} pcs
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-stone-700 uppercase mb-1">
                  Production & Delivery Timeline
                </label>
                <div className="flex items-center space-x-2">
                  {[15, 25, 35, 45].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setLeadDays(d)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        leadDays === d
                          ? 'bg-stone-900 text-white border-stone-900 shadow'
                          : 'bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      {d} Days
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Quotation Value Card */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 text-center my-2">
                <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
                  Total Order Value
                </span>
                <h3 className="text-2xl font-black text-emerald-900 mt-0.5">
                  ₹{totalValue.toLocaleString()}
                </h3>
                <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                  Direct payment via verified bank escrow upon milestone delivery.
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-sm shadow-xl flex items-center justify-center space-x-2 active:scale-95 transition-all hover:shadow-2xl"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending Proposal...' : 'Send Quotation Now'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
