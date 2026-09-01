import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useVoice } from '../../context/VoiceContext.js';
import { Header } from '../../components/layout/Header.js';
import { 
  User, 
  Globe, 
  Building2, 
  TrendingUp, 
  HelpCircle, 
  Phone, 
  MapPin, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Volume2,
  WifiOff,
  Check
} from 'lucide-react';
import { LanguageCode } from '../../types/index.js';

export const ProfileScreen: React.FC = () => {
  const { user, navigateTo } = useAppState();
  const { currentLanguageOption, supportedLanguages, setLanguage, language, t } = useLanguage();
  const { playChime, speak } = useVoice();

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);

  const handleSelectLang = (code: LanguageCode) => {
    playChime('tap');
    setLanguage(code);
    setIsLanguageModalOpen(false);
    speak(`Language changed to ${code}`);
  };

  return (
    <div className="flex flex-col min-h-full bg-stone-50 select-none pb-8">
      <Header
        title={t('nav_profile')}
        audioGuideText={`Welcome to your profile, ${user.name}. You can change language, view government marketplaces, or listen to tutorials.`}
      />

      <div className="p-4 space-y-4">
        {/* Artisan Profile Hero Card */}
        <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm flex items-center space-x-4">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200'}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-artisan-terracotta shadow"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-1">
              <h3 className="font-extrabold text-stone-900 text-base leading-tight">
                {user.name}
              </h3>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-xs font-bold text-artisan-terracotta block mt-0.5">
              {user.business_name}
            </span>
            <div className="flex items-center space-x-1 text-[11px] text-stone-700 font-medium mt-1">
              <MapPin className="w-3 h-3 text-stone-700" />
              <span>{user.location}</span>
            </div>
          </div>
        </div>

        {/* Action Menu List */}
        <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm divide-y divide-stone-100">
          {/* Language Switcher */}
          <button
            onClick={() => {
              playChime('tap');
              setIsLanguageModalOpen(true);
            }}
            className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-artisan-indigo flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-stone-900 text-xs">{t('choose_language')}</h4>
                <span className="text-[11px] text-stone-700 font-semibold">{currentLanguageOption.nativeName} ({currentLanguageOption.name})</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-700" />
          </button>

          {/* Government Marketplace (GeM / ONDC) */}
          <button
            onClick={() => {
              playChime('tap');
              navigateTo('gov_marketplace');
            }}
            className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-stone-900 text-xs">{t('gem_ondc_title')}</h4>
                <span className="text-[11px] text-stone-700 font-semibold">GeM Portal & ONDC Sync Hub</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-700" />
          </button>

          {/* Sales & Analytics */}
          <button
            onClick={() => {
              playChime('tap');
              navigateTo('sales_dashboard');
            }}
            className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-stone-900 text-xs">Sales & Earnings Report</h4>
                <span className="text-[11px] text-stone-700 font-semibold">Revenue, top crafts & festival trends</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-700" />
          </button>

          {/* Spoken Tutorials & Audio Help */}
          <button
            onClick={() => {
              playChime('tap');
              navigateTo('help_tutorials');
            }}
            className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-stone-900 text-xs">Spoken Audio Tutorials</h4>
                <span className="text-[11px] text-stone-700 font-semibold">Voice guides on taking photos & selling</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-700" />
          </button>
        </div>

        {/* Offline-friendly Status Notice */}
        <div className="bg-stone-100 border border-stone-200 rounded-3xl p-4 flex items-center space-x-3 text-xs text-stone-700">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            ✓
          </div>
          <div>
            <span className="font-extrabold text-stone-900 block">Offline Mode Ready</span>
            <span className="text-[11px] text-stone-700 font-medium">Your product drafts save locally and sync automatically when internet connects.</span>
          </div>
        </div>
      </div>

      {/* Language Switcher Modal */}
      {isLanguageModalOpen && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-50 flex flex-col justify-end p-0 sm:p-4 animate-in fade-in select-none">
          <div className="bg-white w-full rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl flex flex-col max-h-[85%] overflow-y-auto border border-stone-100">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-extrabold text-stone-900 text-base">
                {t('choose_language')}
              </h3>
              <button
                onClick={() => setIsLanguageModalOpen(false)}
                className="text-xs font-bold text-stone-700 hover:text-stone-900"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 my-4">
              {supportedLanguages.map(lang => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLang(lang.code)}
                    className={`p-3 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-artisan-terracottaLight border-artisan-terracotta font-bold text-artisan-terracotta shadow-sm'
                        : 'bg-stone-50 border-stone-200 text-stone-800 hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <span className="text-base font-black block">{lang.nativeName}</span>
                      <span className="text-[10px] text-stone-700 font-semibold">{lang.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-artisan-terracotta stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
