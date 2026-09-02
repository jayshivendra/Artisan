import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useVoice } from '../../context/VoiceContext.js';
import { Header } from '../../components/layout/Header.js';
import { 
  User, 
  Building2, 
  Phone, 
  MapPin, 
  Camera, 
  Check, 
  ArrowLeft, 
  CreditCard, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';

const CRAFT_OPTIONS = [
  'Handloom / Textiles',
  'Pottery & Clay',
  'Woodcraft & Carvings',
  'Metalwork & Dhokra',
  'Folk Art & Paintings',
  'Handcrafted Leather',
  'Heritage Jewelry',
  'Stone Craft'
];

export const EditProfileScreen: React.FC = () => {
  const { user, updateUser, navigateTo } = useAppState();
  const { t } = useLanguage();
  const { playChime, speak } = useVoice();

  const [name, setName] = useState<string>(user.name || '');
  const [businessName, setBusinessName] = useState<string>(user.business_name || '');
  const [phone, setPhone] = useState<string>(user.phone || '');
  const [location, setLocation] = useState<string>(user.location || '');
  const [avatar, setAvatar] = useState<string>(user.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400');
  const [bio, setBio] = useState<string>(user.bio || 'Preserving traditional Indian craft heritage through generations of authentic artisanal skill.');
  const [upiId, setUpiId] = useState<string>(user.upi_id || 'artisan.crafts@upi');
  const [bankName, setBankName] = useState<string>(user.bank_name || 'State Bank of India');
  const [bankAccount, setBankAccount] = useState<string>(user.bank_account || '•••• •••• •••• 4529');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(user.craft_categories || ['Handloom / Textiles']);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const toggleCategory = (cat: string) => {
    playChime('tap');
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(prev => prev.filter(c => c !== cat));
    } else {
      setSelectedCategories(prev => [...prev, cat]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    playChime('success');
    
    updateUser({
      name,
      business_name: businessName,
      phone,
      location,
      avatar,
      bio,
      upi_id: upiId,
      bank_name: bankName,
      bank_account: bankAccount,
      craft_categories: selectedCategories
    });

    setSavedSuccess(true);
    speak('Profile and workshop details updated successfully.');
    setTimeout(() => {
      setSavedSuccess(false);
      navigateTo('profile');
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-full bg-stone-50 select-none pb-24">
      <Header
        title="Edit Profile & Studio"
        showBack
        onBack={() => navigateTo('profile')}
        audioGuideText="Here you can edit your name, workshop details, craft categories, and bank payout information."
      />

      <form onSubmit={handleSave} className="p-4 space-y-4 max-w-lg mx-auto w-full">
        {/* Avatar Upload Preview */}
        <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm flex flex-col items-center text-center">
          <div className="relative mb-3">
            <img
              src={avatar}
              alt={name}
              className="w-24 h-24 rounded-full object-cover border-4 border-artisan-terracotta shadow-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400';
              }}
            />
            <div className="absolute bottom-0 right-0 bg-artisan-terracotta text-white p-2 rounded-full shadow border-2 border-white">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          
          <label className="text-xs font-bold text-stone-700 block mb-1">Avatar Image URL</label>
          <input
            type="url"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-artisan-terracotta focus:outline-none"
          />
        </div>

        {/* Basic Personal Details */}
        <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm space-y-3.5">
          <div className="flex items-center space-x-2 pb-2 border-b border-stone-100">
            <User className="w-4 h-4 text-artisan-terracotta" />
            <h3 className="font-extrabold text-stone-900 text-sm">Personal & Artisan Info</h3>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pandit Ramswaroop Sharma"
              className="w-full text-sm p-3 bg-stone-50 border border-stone-200 rounded-2xl focus:border-artisan-terracotta focus:outline-none font-semibold text-stone-900"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Workshop / Studio Name</label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Royal Heritage Crafts Studio"
              className="w-full text-sm p-3 bg-stone-50 border border-stone-200 rounded-2xl focus:border-artisan-terracotta focus:outline-none font-semibold text-stone-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-2xl focus:border-artisan-terracotta focus:outline-none text-stone-900"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Location / State</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Jaipur, Rajasthan"
                className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-2xl focus:border-artisan-terracotta focus:outline-none text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Artisan Bio / Heritage Story</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell buyers about your craft heritage, master weaving lineage, or workshop..."
              className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-2xl focus:border-artisan-terracotta focus:outline-none text-stone-900"
            />
          </div>
        </div>

        {/* Craft Specializations */}
        <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-stone-100">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h3 className="font-extrabold text-stone-900 text-sm">Craft Specializations</h3>
          </div>
          <p className="text-[11px] text-stone-700 font-medium">Select all traditional craft forms your workshop creates:</p>

          <div className="flex flex-wrap gap-2 pt-1">
            {CRAFT_OPTIONS.map(cat => {
              const isSelected = selectedCategories.includes(cat);
              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-artisan-terracotta text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Payout Bank & UPI Details */}
        <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm space-y-3.5">
          <div className="flex items-center space-x-2 pb-2 border-b border-stone-100">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <h3 className="font-extrabold text-stone-900 text-sm">Payout & Bank Credentials</h3>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Instant Payout UPI ID</label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. yourname@upi"
              className="w-full text-sm p-3 bg-stone-50 border border-stone-200 rounded-2xl focus:border-artisan-terracotta focus:outline-none text-stone-900 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="State Bank of India"
                className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-2xl focus:border-artisan-terracotta focus:outline-none text-stone-900"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Account Number</label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                placeholder="•••• •••• 4529"
                className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-2xl focus:border-artisan-terracotta focus:outline-none text-stone-900 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-artisan-terracotta to-orange-500 text-white font-extrabold text-base rounded-2xl shadow-elevated hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            {savedSuccess ? (
              <>
                <Check className="w-5 h-5 stroke-[3]" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
