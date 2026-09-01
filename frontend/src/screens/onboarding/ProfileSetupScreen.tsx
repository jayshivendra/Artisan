import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useVoice } from '../../context/VoiceContext.js';
import { User, MapPin, Phone, Store, ArrowRight, Camera, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProfileSetupScreen: React.FC = () => {
  const { navigateTo, user, updateUser } = useAppState();
  const { t } = useLanguage();
  const { playChime, speak } = useVoice();

  const [name, setName] = useState<string>(user.name || 'Lakshmi Devi');
  const [businessName, setBusinessName] = useState<string>(user.business_name || 'Lakshmi Pochampally Handlooms');
  const [location, setLocation] = useState<string>(user.location || 'Pochampally, Telangana');
  const [phone, setPhone] = useState<string>(user.phone || '+91 98480 22334');
  const [avatar, setAvatar] = useState<string>(user.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80');

  const handleFinish = () => {
    playChime('success');
    updateUser({
      name,
      business_name: businessName,
      location,
      phone,
      avatar,
      is_onboarded: true
    });
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    speak(`Welcome ${name}! Your artisan business manager is ready.`);
    navigateTo('home');
  };

  const handleAvatarChange = () => {
    playChime('tap');
    const sampleAvatars = [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
    ];
    const nextIdx = (sampleAvatars.indexOf(avatar) + 1) % sampleAvatars.length;
    setAvatar(sampleAvatars[nextIdx]);
  };

  return (
    <div className="min-h-full flex flex-col justify-between p-6 bg-stone-50 select-none">
      {/* Header */}
      <div className="pt-2">
        <div className="flex items-center space-x-2 text-artisan-terracotta font-black text-xs uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Final Step</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
          {t('profile_title')}
        </h2>
        <p className="text-xs text-stone-700 font-medium mt-1">
          {t('profile_sub')}
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-3.5 my-4 overflow-y-auto max-h-[520px] pr-1 py-1">
        {/* Avatar Card */}
        <div className="flex items-center space-x-4 bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm">
          <div className="relative">
            <img
              src={avatar}
              alt="Artisan Profile"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-artisan-terracotta shadow"
            />
            <button
              type="button"
              onClick={handleAvatarChange}
              className="absolute -bottom-1 -right-1 bg-artisan-terracotta text-white p-1 rounded-full shadow"
              title="Change Photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <span className="text-xs font-bold text-stone-900 block">
              Artisan Profile Photo
            </span>
            <span className="text-[11px] text-stone-700 block mt-0.5">
              Builds authentic buyer trust
            </span>
          </div>
        </div>

        {/* Name */}
        <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-sm focus-within:border-artisan-terracotta">
          <label className="block text-[11px] font-extrabold text-stone-700 uppercase tracking-wider mb-1 flex items-center space-x-1">
            <User className="w-3.5 h-3.5 text-artisan-terracotta" />
            <span>{t('label_name')}</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Lakshmi Devi"
            className="w-full text-sm font-bold text-stone-900 focus:outline-none bg-transparent"
          />
        </div>

        {/* Business/Craft Name */}
        <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-sm focus-within:border-artisan-terracotta">
          <label className="block text-[11px] font-extrabold text-stone-700 uppercase tracking-wider mb-1 flex items-center space-x-1">
            <Store className="w-3.5 h-3.5 text-artisan-indigo" />
            <span>{t('label_craft_name')}</span>
          </label>
          <input
            type="text"
            value={businessName}
            onChange={e => setBusinessName(e.target.value)}
            placeholder="e.g. Lakshmi Handlooms"
            className="w-full text-sm font-bold text-stone-900 focus:outline-none bg-transparent"
          />
        </div>

        {/* Location */}
        <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-sm focus-within:border-artisan-terracotta">
          <label className="block text-[11px] font-extrabold text-stone-700 uppercase tracking-wider mb-1 flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('label_location')}</span>
          </label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="e.g. Pochampally, Telangana"
            className="w-full text-sm font-bold text-stone-900 focus:outline-none bg-transparent"
          />
        </div>

        {/* Phone */}
        <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-sm focus-within:border-artisan-terracotta">
          <label className="block text-[11px] font-extrabold text-stone-700 uppercase tracking-wider mb-1 flex items-center space-x-1">
            <Phone className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('label_phone')}</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="e.g. +91 98480 22334"
            className="w-full text-sm font-bold text-stone-900 focus:outline-none bg-transparent"
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <button
          onClick={handleFinish}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-artisan-terracotta to-orange-500 text-white font-black text-base shadow-elevated flex items-center justify-center space-x-2 transition-all transform active:scale-95 hover:shadow-2xl"
        >
          <span>{t('btn_finish_setup')}</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
