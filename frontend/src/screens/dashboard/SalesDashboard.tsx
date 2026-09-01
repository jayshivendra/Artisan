import React from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useVoice } from '../../context/VoiceContext.js';
import { Header } from '../../components/layout/Header.js';
import { TrendingUp, DollarSign, Package, Calendar, Award, ArrowUpRight, Sparkles, Download } from 'lucide-react';

export const SalesDashboard: React.FC = () => {
  const { orders, products, navigateTo } = useAppState();
  const { t } = useLanguage();
  const { speak } = useVoice();

  const totalSales = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const totalUnits = orders.reduce((sum, o) => sum + o.quantity, 0);
  const avgOrderVal = Math.round(totalSales / (orders.length || 1));
  const estimatedProfit = Math.round(totalSales * 0.38);

  const monthlyData = [
    { month: 'Apr', amount: 9200, height: '40%' },
    { month: 'May', amount: 12400, height: '55%' },
    { month: 'Jun', amount: 11000, height: '50%' },
    { month: 'Jul', amount: 14800, height: '65%' },
    { month: 'Aug', amount: 18500, height: '85%' },
    { month: 'Sep', amount: 22000, height: '100%' }
  ];

  return (
    <div className="flex flex-col min-h-full bg-stone-50 select-none pb-8">
      <Header
        title="Sales & Business Analytics"
        showBack={true}
        onBack={() => navigateTo('home')}
        audioGuideText={`Your total earnings are ₹${totalSales.toLocaleString()} with ₹${estimatedProfit.toLocaleString()} in net profit.`}
      />

      <div className="p-4 space-y-4">
        {/* Main Revenue Card */}
        <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-emerald-950 text-white rounded-3xl p-5 shadow-xl border border-stone-700">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                Total Revenue
              </span>
              <h2 className="text-3xl font-black text-white mt-1">
                ₹{totalSales.toLocaleString()}
              </h2>
            </div>
            <div className="flex items-center space-x-1 bg-emerald-500/20 text-emerald-300 text-xs font-black px-2.5 py-1 rounded-full border border-emerald-500/30">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+28.4%</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-center">
            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Units Sold</span>
              <span className="text-sm font-black text-white">{totalUnits} pcs</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Avg Order</span>
              <span className="text-sm font-black text-white">₹{avgOrderVal.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase block">Net Profit</span>
              <span className="text-sm font-black text-emerald-300">₹{estimatedProfit.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Visual Monthly Sales Bar Chart */}
        <div className="bg-white border border-stone-200 rounded-3xl p-4 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-extrabold text-stone-700 uppercase tracking-wider">
              Monthly Growth Trend
            </span>
            <span className="text-xs font-bold text-emerald-600">Peak Festival Season Ahead</span>
          </div>

          <div className="flex items-end justify-between h-40 pt-4 px-2">
            {monthlyData.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-1.5 flex-1">
                <span className="text-[9px] font-extrabold text-stone-700">₹{(item.amount / 1000).toFixed(0)}k</span>
                <div className="w-7 bg-stone-100 rounded-t-xl overflow-hidden h-28 flex items-end justify-center">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-500 ${
                      idx === monthlyData.length - 1
                        ? 'bg-gradient-to-t from-artisan-terracotta to-orange-500'
                        : 'bg-artisan-indigo/80'
                    }`}
                    style={{ height: item.height }}
                  ></div>
                </div>
                <span className="text-[10px] font-bold text-stone-700">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Crafts */}
        <div className="bg-white border border-stone-200 rounded-3xl p-4 shadow-sm space-y-3">
          <div className="flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-extrabold text-stone-700 uppercase tracking-wider">
              Top Selling Handcrafts
            </span>
          </div>

          <div className="space-y-2">
            {products.slice(0, 3).map((p, idx) => (
              <div key={p.id} className="flex items-center justify-between p-2 rounded-2xl bg-stone-50 border border-stone-100">
                <div className="flex items-center space-x-2.5">
                  <span className="font-black text-sm text-stone-400">#{idx + 1}</span>
                  <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h5 className="font-extrabold text-stone-900 text-xs line-clamp-1">{p.name}</h5>
                    <span className="text-[10px] text-stone-700 font-semibold">{p.category}</span>
                  </div>
                </div>
                <span className="font-black text-xs text-artisan-terracotta">₹{p.selling_price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Seasonal Festival Demand Insights */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-4 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-amber-900">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span className="font-extrabold text-xs uppercase tracking-wider">Upcoming Festival Demand</span>
          </div>
          <p className="text-xs text-amber-950 font-medium leading-relaxed">
            Dussehra and Diwali generate <span className="font-black text-artisan-terracotta">65% of annual handloom & handicraft sales</span>. Prepare inventory of gift boxes and festive sarees 30 days in advance.
          </p>
        </div>
      </div>
    </div>
  );
};
