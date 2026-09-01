import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useVoice } from '../../context/VoiceContext.js';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

interface CraftCategoryCard {
  id: string;
  titleKey: string;
  image: string;
  icon: string;
}

const CATEGORIES: CraftCategoryCard[] = [
  {
    id: 'Handloom / Textiles',
    titleKey: 'cat_handloom',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80',
    icon: '🧵'
  },
  {
    id: 'Handicrafts',
    titleKey: 'cat_handicraft',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop&q=80',
    icon: '🎨'
  },
  {
    id: 'Pottery & Clay',
    titleKey: 'cat_pottery',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&auto=format&fit=crop&q=80',
    icon: '🏺'
  },
  {
    id: 'Jewellery',
    titleKey: 'cat_jewellery',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&auto=format&fit=crop&q=80',
    icon: '💍'
  },
  {
    id: 'Woodwork',
    titleKey: 'cat_woodwork',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=400&auto=format&fit=crop&q=80',
    icon: '🪵'
  },
  {
    id: 'Home Décor',
    titleKey: 'cat_homedecor',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=400&auto=format&fit=crop&q=80',
    icon: '🪔'
  },
  {
    id: 'Other Crafts',
    titleKey: 'cat_other',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    icon: '✨'
  }
];

export const CategorySelectScreen: React.FC = () => {
  const { navigateTo, user, updateUser } = useAppState();
  const { t } = useLanguage();
  const { playChime } = useVoice();

  const [selectedCats, setSelectedCats] = useState<string[]>(user.craft_categories || ['Handloom / Textiles']);

  const toggleCategory = (id: string) => {
    playChime('tap');
    if (selectedCats.includes(id)) {
      if (selectedCats.length > 1) {
        setSelectedCats(selectedCats.filter(c => c !== id));
      }
    } else {
      setSelectedCats([...selectedCats, id]);
    }
  };

  const handleContinue = () => {
    playChime('success');
    updateUser({ craft_categories: selectedCats });
    navigateTo('profile_setup');
  };

  return (
    <div className="min-h-full flex flex-col justify-between p-6 bg-stone-50 select-none">
      {/* Header */}
      <div className="pt-2">
        <div className="flex items-center space-x-2 text-artisan-terracotta font-black text-xs uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Step 2 of 3</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
          {t('what_do_you_make')}
        </h2>
        <p className="text-xs text-stone-700 font-medium mt-1">
          {t('select_categories_hint')}
        </p>
      </div>

      {/* Visual Category Cards Grid */}
      <div className="grid grid-cols-2 gap-3 my-4 overflow-y-auto max-h-[520px] pr-1 py-1">
        {CATEGORIES.map(cat => {
          const isSelected = selectedCats.includes(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className={`relative rounded-2xl overflow-hidden border-2 text-left transition-all transform active:scale-95 group shadow-sm flex flex-col justify-between h-36 ${
                isSelected
                  ? 'border-artisan-terracotta ring-2 ring-artisan-terracotta/30'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              {/* Background Image */}
              <img
                src={cat.image}
                alt={cat.id}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-900/40 to-transparent"></div>

              {/* Selection Checkbox Pill */}
              <div className="relative z-10 p-2.5 flex justify-between items-start">
                <span className="text-lg">{cat.icon}</span>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-artisan-terracotta text-white shadow-md'
                      : 'bg-white/70 backdrop-blur text-transparent border border-white'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Title */}
              <div className="relative z-10 p-2.5">
                <span className="text-xs font-black text-white leading-tight block drop-shadow">
                  {t(cat.titleKey)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Button */}
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
