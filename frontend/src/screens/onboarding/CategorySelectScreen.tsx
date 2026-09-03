import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useVoice } from '../../context/VoiceContext.js';
import { Check, ArrowRight, Sparkles, Volume2 } from 'lucide-react';

interface CraftCategoryCard {
  id: string;
  titleKey: string;
  nameEn: string;
  image: string;
  icon: string;
  accent: string;
}

const CATEGORIES: CraftCategoryCard[] = [
  {
    id: 'Handloom / Textiles',
    titleKey: 'cat_handloom',
    nameEn: 'Handloom / Textiles',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    icon: '🧵',
    accent: 'from-amber-600 to-orange-700'
  },
  {
    id: 'Handicrafts',
    titleKey: 'cat_handicraft',
    nameEn: 'Handicrafts',
    image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=600&auto=format&fit=crop&q=80',
    icon: '🎨',
    accent: 'from-rose-600 to-pink-700'
  },
  {
    id: 'Pottery & Clay',
    titleKey: 'cat_pottery',
    nameEn: 'Pottery & Clay',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&auto=format&fit=crop&q=80',
    icon: '🏺',
    accent: 'from-orange-700 to-amber-800'
  },
  {
    id: 'Jewellery',
    titleKey: 'cat_jewellery',
    nameEn: 'Jewellery',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80',
    icon: '💍',
    accent: 'from-yellow-600 to-amber-700'
  },
  {
    id: 'Woodwork',
    titleKey: 'cat_woodwork',
    nameEn: 'Woodwork / Carving',
    image: 'https://images.unsplash.com/photo-1546484475-7f7bd55792da?w=600&auto=format&fit=crop&q=80',
    icon: '🪵',
    accent: 'from-amber-900 to-stone-900'
  },
  {
    id: 'Home Décor',
    titleKey: 'cat_homedecor',
    nameEn: 'Home Décor & Basketry',
    image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=600&auto=format&fit=crop&q=80',
    icon: '🪔',
    accent: 'from-emerald-700 to-teal-800'
  },
  {
    id: 'Other Crafts',
    titleKey: 'cat_other',
    nameEn: 'Other Traditional Crafts',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=600&auto=format&fit=crop&q=80',
    icon: '✨',
    accent: 'from-indigo-700 to-blue-800'
  }
];

export const CategorySelectScreen: React.FC = () => {
  const { navigateTo, user, updateUser } = useAppState();
  const { t, language } = useLanguage();
  const { playChime, speak } = useVoice();

  const [selectedCats, setSelectedCats] = useState<string[]>(user.craft_categories || ['Handloom / Textiles']);

  const toggleCategory = (cat: CraftCategoryCard) => {
    playChime('tap');
    const isSelected = selectedCats.includes(cat.id);
    let updated: string[];

    if (isSelected) {
      if (selectedCats.length > 1) {
        updated = selectedCats.filter(c => c !== cat.id);
      } else {
        updated = selectedCats;
      }
    } else {
      updated = [...selectedCats, cat.id];
    }

    setSelectedCats(updated);
    // Speak craft name in selected language
    const localizedName = t(cat.titleKey);
    speak(localizedName);
  };

  const handleContinue = () => {
    playChime('success');
    updateUser({ craft_categories: selectedCats });
    navigateTo('profile_setup');
  };

  return (
    <div className="min-h-full flex flex-col justify-between p-4 sm:p-6 bg-stone-50 select-none pb-8">
      {/* Header */}
      <div className="pt-2">
        <div className="flex items-center space-x-2 text-artisan-terracotta font-black text-xs uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Step 2 of 3</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
          {t('what_do_you_make')}
        </h2>
        <p className="text-xs text-stone-600 font-medium mt-1">
          {t('select_categories_hint')}
        </p>
      </div>

      {/* High-Contrast Category Cards Grid */}
      <div className="grid grid-cols-2 gap-3 my-4 overflow-y-auto max-h-[60vh] pr-1 py-1">
        {CATEGORIES.map(cat => {
          const isSelected = selectedCats.includes(cat.id);
          const localizedName = t(cat.titleKey);

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={`relative rounded-3xl overflow-hidden border-2 text-left transition-all transform active:scale-95 group shadow-sm flex flex-col justify-between bg-white ${
                isSelected
                  ? 'border-artisan-terracotta ring-3 ring-artisan-terracotta/30 shadow-md'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              {/* Photo Area with Icon & Checkbox Badge */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                <img
                  src={cat.image}
                  alt={cat.nameEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Top Overlay Badges */}
                <div className="absolute top-2 left-2 w-7 h-7 rounded-xl bg-black/60 backdrop-blur-md flex items-center justify-center text-sm shadow">
                  {cat.icon}
                </div>

                <div
                  className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-artisan-terracotta text-white shadow-md'
                      : 'bg-white/80 backdrop-blur text-transparent border border-stone-300'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Clear, High-Contrast Text Box Below Image */}
              <div className="p-3 bg-white flex flex-col justify-between flex-1">
                <div>
                  <h4 className="font-black text-stone-900 text-xs sm:text-sm leading-tight">
                    {localizedName}
                  </h4>
                  <span className="text-[10px] text-stone-500 font-bold block mt-0.5">
                    {cat.nameEn}
                  </span>
                </div>

                <div className="mt-2 pt-1.5 border-t border-stone-100 flex items-center justify-between text-[9px] text-stone-400 font-bold">
                  <span>Tap to listen</span>
                  <Volume2 className="w-3 h-3 text-artisan-terracotta" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Continue Action */}
      <div className="pt-2">
        <button
          onClick={handleContinue}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-artisan-terracotta to-orange-500 text-white font-black text-base shadow-elevated flex items-center justify-center space-x-2 transition-all transform active:scale-95 hover:shadow-2xl"
        >
          <span>{t('btn_continue')}</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
