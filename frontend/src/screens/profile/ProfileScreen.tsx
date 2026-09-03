import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useVoice, AUDIO_GUIDANCE_BY_LANG } from '../../context/VoiceContext.js';
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
  VolumeX,
  WifiOff,
  Check,
  Edit3,
  ShoppingBag
} from 'lucide-react';
import { LanguageCode } from '../../types/index.js';

export const ProfileScreen: React.FC = () => {
  const { user, navigateTo, isMobileDeviceView, setIsMobileDeviceView } = useAppState();
  const { currentLanguageOption, supportedLanguages, setLanguage, language, t } = useLanguage();
  const { playChime, speak, isVoiceEnabled, toggleVoice } = useVoice();

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);

  const handleSelectLang = (code: LanguageCode) => {
    playChime('tap');
    setLanguage(code);
    setIsLanguageModalOpen(false);

    const targetOption = supportedLanguages.find(l => l.code === code) || currentLanguageOption;
    const nativeGreeting = AUDIO_GUIDANCE_BY_LANG.home?.[code] || targetOption.scriptSample;
    speak(nativeGreeting, targetOption.voiceLang, true);
  };

  return (
    <div className="flex flex-col min-h-full bg-stone-50 select-none pb-24">
      <Header
        title={t('nav_profile')}
        audioGuideText={`Welcome to your profile, ${user.name}. You can edit your profile details, change language, or switch between Buyer and Artisan Seller views.`}
      />

      <div className="p-4 space-y-4">
        {/* Artisan Profile Hero Card with Direct Edit Button */}
        <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200'}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-artisan-terracotta shadow shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1">
                <h3 className="font-extrabold text-stone-900 text-base leading-tight truncate">
                  {user.name}
                </h3>
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              </div>
              <span className="text-xs font-bold text-artisan-terracotta block mt-0.5 truncate">
                {user.business_name || 'Master Artisan Studio'}
              </span>
              <div className="flex items-center space-x-1 text-[11px] text-stone-700 font-medium mt-1">
                <MapPin className="w-3 h-3 text-stone-700 shrink-0" />
                <span className="truncate">{user.location}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
            <button
              onClick={() => {
                playChime('tap');
                navigateTo('edit_profile');
              }}
              className="flex-1 py-2.5 bg-artisan-terracottaLight text-artisan-terracotta rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 hover:bg-artisan-terracotta hover:text-white transition-all shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile & Studio Details</span>
            </button>
          </div>
        </div>

        {/* Switch Platform Mode (Buyer vs Artisan Seller) */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 block">Experience Mode</span>
            <h4 className="font-extrabold text-stone-900 text-xs mt-0.5">Explore Buyer Marketplace</h4>
            <p className="text-[11px] text-stone-600">Browse handicrafts, cart, and place buyer orders</p>
          </div>
          <button
            onClick={() => {
              playChime('tap');
              navigateTo('buyer_marketplace');
            }}
            className="px-3.5 py-2 bg-amber-600 text-white rounded-xl text-xs font-extrabold flex items-center space-x-1 shadow hover:bg-amber-700 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Open</span>
          </button>
        </div>

        {/* Action Menu List */}
        <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm divide-y divide-stone-100">
          
          {/* Edit Profile Menu Item */}
          <button
            onClick={() => {
              playChime('tap');
              navigateTo('edit_profile');
            }}
            className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-artisan-terracotta flex items-center justify-center font-bold">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-stone-900 text-xs">Edit Profile Information</h4>
                <span className="text-[11px] text-stone-700 font-semibold">Name, photo, workshop, bio & bank info</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-700" />
          </button>

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
            className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors text-left border-b border-stone-100"
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

          {/* Voice Instructor & Spoken Guidance Enable / Disable Switch */}
          <div className="w-full p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                isVoiceEnabled ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-500'
              }`}>
                {isVoiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="font-extrabold text-stone-900 text-xs">Voice Instructor & Spoken Audio</h4>
                <span className="text-[11px] text-stone-600 font-medium block">
                  {isVoiceEnabled ? '🔊 Spoken Guidance is Active' : '🔇 Muted / Silent Mode (Disabled)'}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                playChime('tap');
                toggleVoice();
              }}
              className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                isVoiceEnabled ? 'bg-emerald-600' : 'bg-stone-300'
              }`}
              title={isVoiceEnabled ? 'Disable Voice Instructor' : 'Enable Voice Instructor'}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  isVoiceEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Offline-friendly Status Notice */}
        <div className="bg-stone-100 border border-stone-200 rounded-3xl p-4 flex items-center space-x-3 text-xs text-stone-700">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            ✓
          </div>
          <div>
            <span className="font-extrabold text-stone-900 block">Offline Mode Ready</span>
            <span className="text-[11px] text-stone-700 font-medium">Your product drafts and profile updates save locally and sync automatically.</span>
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
