import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useVoice } from '../../context/VoiceContext.js';
import { Header } from '../../components/layout/Header.js';
import { BeforeAfterSlider } from '../../components/common/BeforeAfterSlider.js';
import { VoiceButton } from '../../components/common/VoiceButton.js';
import { StatusBadge } from '../../components/common/StatusBadge.js';
import { AudioGuidancePlayer } from '../../components/common/AudioGuidancePlayer.js';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Mic, 
  Sliders, 
  CheckCircle2, 
  ShieldCheck, 
  Globe, 
  RefreshCw, 
  Share2,
  Tag,
  DollarSign,
  Package,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_HANDICRAFT_PHOTOS = [
  {
    name: 'Handwoven Ikat Silk Saree',
    original: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    enhanced: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Terracotta Water Jug',
    original: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
    enhanced: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Bidriware Silver Box',
    original: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
    enhanced: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80'
  }
];

export const AddProductWizard: React.FC = () => {
  const { productDraft, updateProductDraft, resetProductDraft, addProduct, navigateTo, user } = useAppState();
  const { t, language } = useLanguage();
  const { speak, playChime, isListening, startListening, stopListening } = useVoice();

  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [isExtractingNLP, setIsExtractingNLP] = useState<boolean>(false);
  const [activeTabDesc, setActiveTabDesc] = useState<'en' | 'hi' | 'reg'>('en');
  const [customPriceActive, setCustomPriceActive] = useState<boolean>(false);

  const step = productDraft.step;

  // Step 1: Handle Photo Selection
  const handleSelectSample = (sample: typeof SAMPLE_HANDICRAFT_PHOTOS[0]) => {
    playChime('tap');
    updateProductDraft({
      photoUrl: sample.original,
      enhancedPhotoUrl: sample.enhanced,
      name: sample.name
    });
    triggerEnhancement(sample.original);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      playChime('tap');
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        updateProductDraft({ photoUrl: url, enhancedPhotoUrl: url });
        triggerEnhancement(url);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerEnhancement = (url: string) => {
    setIsEnhancing(true);
    updateProductDraft({ step: 2 });
    speak('AI is preparing your photo: removing background, adjusting studio lighting and adding soft shadows.');

    fetch('/api/ai/enhance-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: url, preset: 'studio' })
    })
      .then(res => res.json())
      .then(json => {
        setIsEnhancing(false);
        playChime('success');
      })
      .catch(() => {
        setIsEnhancing(false);
      });
  };

  // Step 2: Select Studio Background Preset
  const handleBgPresetChange = (preset: 'studio' | 'white' | 'light' | 'original') => {
    playChime('tap');
    updateProductDraft({ selectedBgPreset: preset });
  };

  // Step 3: Trigger Voice-to-Catalog NLP Extraction
  const handleVoiceInput = () => {
    startListening((spokenText: string) => {
      processCatalogNLP(spokenText);
    });
  };

  const processCatalogNLP = (spokenText: string) => {
    setIsExtractingNLP(true);
    updateProductDraft({ voiceText: spokenText });

    fetch('/api/ai/voice-catalog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ speech_text: spokenText, language })
    })
      .then(res => res.json())
      .then(json => {
        setIsExtractingNLP(false);
        if (json.success && json.data) {
          const d = json.data;
          updateProductDraft({
            name: d.name,
            category: d.category,
            material: d.material,
            craft_type: d.craft_type,
            making_time_days: d.making_time_days,
            colour: d.colour,
            dimensions: d.dimensions,
            description_en: d.story_english,
            description_hi: d.story_hindi,
            description_reg: d.story_regional
          });
          // Recalculate dynamic pricing
          fetchPricing(d.category, productDraft.raw_material_cost, d.making_time_days);
          playChime('success');
          speak(`AI extracted details: ${d.name}, made with ${d.material}.`);
          updateProductDraft({ step: 4 });
        }
      })
      .catch(() => {
        setIsExtractingNLP(false);
        updateProductDraft({ step: 4 });
      });
  };

  const fetchPricing = (category: string, cost: number, days: number) => {
    fetch('/api/ai/pricing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category,
        material_cost: cost || 1200,
        labour_days: days || 4
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          const p = json.data;
          updateProductDraft({
            suggested_price: p.recommended_price,
            selling_price: p.recommended_price,
            price_range_min: p.minimum_price,
            price_range_max: p.maximum_price,
            raw_material_cost: p.material_cost,
            labour_cost: p.labour_cost,
            artisan_profit: p.artisan_profit,
            pricing_explanation: p.explanation
          });
        }
      })
      .catch(() => {});
  };

  // Step 6 -> 7: Final Publish
  const handlePublish = () => {
    playChime('success');
    const newProd = {
      id: `prod_${Date.now()}`,
      seller_id: user.id || 'user_artisan_01',
      name: productDraft.name || 'Handmade Masterpiece',
      images: [productDraft.enhancedPhotoUrl || productDraft.photoUrl],
      original_image: productDraft.photoUrl,
      enhanced_image: productDraft.enhancedPhotoUrl,
      description: productDraft.description_en,
      description_hi: productDraft.description_hi,
      description_regional: productDraft.description_reg,
      language: language,
      category: productDraft.category,
      material: productDraft.material,
      dimensions: productDraft.dimensions,
      colour: productDraft.colour,
      production_method: productDraft.production_method,
      making_time_days: productDraft.making_time_days,
      quantity: productDraft.quantity || 10,
      raw_material_cost: productDraft.raw_material_cost,
      labour_cost: productDraft.labour_cost,
      suggested_price: productDraft.suggested_price,
      selling_price: productDraft.selling_price,
      status: 'active' as const,
      channels: productDraft.channels,
      created_at: new Date().toISOString()
    };

    addProduct(newProd);
    updateProductDraft({ step: 7 });
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    speak(`Congratulations! ${newProd.name} is now published and visible to buyers worldwide.`);
  };

  return (
    <div className="flex flex-col min-h-full bg-stone-50 select-none pb-8">
      {step !== 7 && (
        <Header
          title={`Add Product (Step ${step} of 6)`}
          showBack={true}
          onBack={() => {
            if (step > 1) updateProductDraft({ step: step - 1 });
            else navigateTo('home');
          }}
          audioGuideText={`Step ${step}: ${
            step === 1 ? 'Take a clear photo of your craft.' :
            step === 2 ? 'AI is enhancing your photo.' :
            step === 3 ? 'Tell us about your product using voice.' :
            step === 4 ? 'Review the AI generated product catalog details.' :
            step === 5 ? "Review AI's recommended fair price." :
            'Review and publish your listing.'
          }`}
        />
      )}

      {/* Wizard Step Progress Indicator */}
      {step !== 7 && (
        <div className="px-4 pt-2">
          <div className="flex items-center space-x-1.5">
            {[1, 2, 3, 4, 5, 6].map(s => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  s < step
                    ? 'bg-emerald-500'
                    : s === step
                    ? 'bg-artisan-terracotta'
                    : 'bg-stone-200'
                }`}
              ></div>
            ))}
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-stone-700 mt-1">
            <span>Photo</span>
            <span>AI Studio</span>
            <span>Voice</span>
            <span>Catalog</span>
            <span>Pricing</span>
            <span>Publish</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 1: TAKE PRODUCT PHOTO */}
      {/* ========================================================================= */}
      {step === 1 && (
        <div className="p-4 space-y-4 animate-in fade-in">
          <div>
            <h2 className="text-xl font-black text-stone-900 leading-tight">
              {t('step1_title')}
            </h2>
            <p className="text-xs text-stone-700 font-medium mt-0.5">
              {t('step1_sub')}
            </p>
          </div>

          {/* Photography Tips Card */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 flex items-center justify-around text-xs font-extrabold text-amber-900 shadow-sm">
            <span className="flex items-center space-x-1">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              <span>{t('tip_lighting')}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              <span>{t('tip_centered')}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              <span>{t('tip_clean')}</span>
            </span>
          </div>

          {/* Camera Viewfinder Mock / Capture Trigger */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border-2 border-dashed border-stone-300 bg-stone-900 flex flex-col items-center justify-center text-white shadow-xl group">
            <img
              src={productDraft.photoUrl}
              alt="Viewfinder"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="relative z-10 flex flex-col items-center text-center p-4">
              <button
                onClick={() => triggerEnhancement(productDraft.photoUrl)}
                className="w-16 h-16 rounded-full bg-white text-artisan-terracotta shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-transform mb-2"
                title="Capture Photo"
              >
                <Camera className="w-8 h-8 stroke-[2.5]" />
              </button>
              <span className="text-xs font-black drop-shadow">Tap Camera to Snap</span>
            </div>

            {/* Corner Framing guides */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white pointer-events-none"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white pointer-events-none"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white pointer-events-none"></div>
          </div>

          {/* Action Buttons: Camera, Gallery & Sample items */}
          <div className="space-y-2 pt-1">
            <label className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-artisan-terracotta to-orange-500 text-white font-extrabold text-sm shadow-elevated flex items-center justify-center space-x-2 cursor-pointer active:scale-95 transition-all text-center">
              <Upload className="w-4 h-4" />
              <span>{t('btn_gallery')}</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            {/* Quick Demo Sample Handicrafts */}
            <div className="pt-2">
              <p className="text-[11px] font-extrabold text-stone-700 uppercase tracking-wider mb-2">
                Or select an authentic craft demo photo:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_HANDICRAFT_PHOTOS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSample(item)}
                    className="relative aspect-square rounded-2xl overflow-hidden border-2 border-stone-200 shadow-sm active:scale-95 transition-transform group"
                  >
                    <img src={item.original} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-1.5">
                      <span className="text-[10px] font-bold text-white leading-tight line-clamp-1">
                        {item.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: AI IMAGE ENHANCER & STUDIO */}
      {/* ========================================================================= */}
      {step === 2 && (
        <div className="p-4 space-y-4 animate-in fade-in">
          <div>
            <div className="flex items-center space-x-1.5 text-artisan-terracotta text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Photo Studio</span>
            </div>
            <h2 className="text-xl font-black text-stone-900 leading-tight mt-0.5">
              {t('step2_title')}
            </h2>
            <p className="text-xs text-stone-700 font-medium">
              {t('step2_sub')}
            </p>
          </div>

          {/* Interactive Before / After Split Slider */}
          <BeforeAfterSlider
            beforeImage={productDraft.photoUrl}
            afterImage={productDraft.enhancedPhotoUrl}
            beforeLabel={t('lbl_before')}
            afterLabel={t('lbl_after')}
          />

          {/* Simple Studio Background Selector */}
          <div>
            <label className="block text-xs font-extrabold text-stone-700 uppercase tracking-wider mb-1.5">
              Select Background Style
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'studio', label: t('bg_studio'), icon: '💡' },
                { id: 'white', label: t('bg_white'), icon: '⚪' },
                { id: 'light', label: t('bg_light'), icon: '🌾' },
                { id: 'original', label: t('bg_original'), icon: '📸' }
              ].map(preset => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleBgPresetChange(preset.id as any)}
                  className={`py-2 px-1 rounded-xl border-2 text-center transition-all ${
                    productDraft.selectedBgPreset === preset.id
                      ? 'border-artisan-terracotta bg-artisan-terracottaLight font-bold text-artisan-terracotta shadow-sm'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <span className="text-base block">{preset.icon}</span>
                  <span className="text-[10px] font-bold block leading-tight mt-0.5">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quality Improvements Checklist */}
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 text-xs space-y-1 font-semibold text-emerald-900">
            <div className="flex items-center space-x-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              <span>Background isolated & clutter cleaned</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              <span>Lighting & contrast balanced for e-commerce</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              <span>Realistic natural soft shadow added</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={() => updateProductDraft({ step: 1 })}
              className="py-3.5 px-4 rounded-2xl bg-stone-100 text-stone-700 font-bold text-xs border border-stone-200 hover:bg-stone-200 active:scale-95"
            >
              {t('btn_try_again')}
            </button>
            <button
              onClick={() => {
                playChime('success');
                updateProductDraft({ step: 3 });
                speak('Now tell us about your product. Tap Speak and talk in your own language.');
              }}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-artisan-terracotta to-orange-500 text-white font-extrabold text-sm shadow-elevated flex items-center justify-center space-x-2 active:scale-95 hover:shadow-2xl"
            >
              <span>{t('btn_use_photo')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: VOICE-TO-CATALOG MULTILINGUAL INPUT */}
      {/* ========================================================================= */}
      {step === 3 && (
        <div className="p-4 space-y-4 animate-in fade-in">
          <div>
            <div className="flex items-center space-x-1.5 text-artisan-indigo text-xs font-black uppercase tracking-wider">
              <Mic className="w-3.5 h-3.5" />
              <span>Multilingual Voice Cataloger</span>
            </div>
            <h2 className="text-xl font-black text-stone-900 leading-tight mt-0.5">
              {t('step3_title')}
            </h2>
            <p className="text-xs text-stone-700 font-medium">
              {t('step3_sub')}
            </p>
          </div>

          {/* Spoken Guidance Prompt */}
          <AudioGuidancePlayer
            title="How to speak about your product"
            speechText={
              language === 'te'
                ? 'ఇది ఏమి వస్తువు? ఏ ముడిపదార్థంతో తయారు చేశారు? చేయడానికి ఎన్ని రోజులు పట్టింది? మైక్ నొక్కి చెప్పండి.'
                : language === 'hi'
                ? 'यह क्या उत्पाद है? किस सामग्री से बना है? और बनाने में कितने दिन लगे? माइक दबाकर बताएं।'
                : 'Say what product it is, what material is used, and how many days it took to make. Tap Speak to begin.'
            }
          />

          {/* Large Voice Recording Button */}
          <VoiceButton
            isListening={isListening}
            onPress={isListening ? stopListening : handleVoiceInput}
            label={t('btn_speak')}
            subLabel="Speak in Telugu, Hindi, Tamil, English etc."
          />

          {/* Simulated Speech Transcription Box */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] font-extrabold text-stone-700 uppercase tracking-wider block mb-1">
              Speech Transcript
            </span>
            <textarea
              rows={3}
              value={productDraft.voiceText || (language === 'te' ? 'ఇది స్వచ్ఛమైన చేనేత పోచంపల్లి పట్టు చీర. 6 రోజులు పట్టింది. సహజ రంగులు ఉపయోగించాము.' : 'Handwoven pure silk Pochampally Ikat saree with natural dyes. Took 6 days on pit loom.')}
              onChange={e => updateProductDraft({ voiceText: e.target.value })}
              placeholder="Or type product details here..."
              className="w-full text-xs font-semibold text-stone-800 bg-stone-50 rounded-xl p-2.5 border border-stone-200 focus:outline-none focus:border-artisan-terracotta"
            />
          </div>

          {/* One-tap Demo Voice Prompts */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-stone-700 uppercase tracking-wider block">
              Or tap a sample voice description:
            </span>
            <button
              onClick={() => processCatalogNLP('ఇది స్వచ్ఛమైన చేనేత పోచంపల్లి పట్టు చీర. తయారీకి 6 రోజులు పట్టింది.')}
              className="w-full text-left p-2.5 rounded-xl bg-stone-100 hover:bg-artisan-terracottaLight text-stone-800 hover:text-artisan-terracotta text-xs font-bold transition-colors border border-stone-200"
            >
              🗣️ Telugu: "ఇది స్వచ్ఛమైన చేనేత పోచంపల్లి పట్టు చీర..."
            </button>
            <button
              onClick={() => processCatalogNLP('यह शुद्ध शहतूत रेशम की पोचमपल्ली इकत साड़ी है जिसे बनाने में 6 दिन लगे हैं।')}
              className="w-full text-left p-2.5 rounded-xl bg-stone-100 hover:bg-artisan-terracottaLight text-stone-800 hover:text-artisan-terracotta text-xs font-bold transition-colors border border-stone-200"
            >
              🗣️ Hindi: "यह शुद्ध रेशम की पोचमपल्ली साड़ी है..."
            </button>
          </div>

          {/* Submit / Continue Button */}
          <button
            onClick={() => processCatalogNLP(productDraft.voiceText || 'Handwoven Pochampally Ikat Silk Saree')}
            disabled={isExtractingNLP}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-artisan-terracotta to-orange-500 text-white font-black text-sm shadow-elevated flex items-center justify-center space-x-2 active:scale-95 hover:shadow-2xl"
          >
            {isExtractingNLP ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>{t('btn_continue')}</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: AI PRODUCT CATALOG & DUAL DESCRIPTIONS */}
      {/* ========================================================================= */}
      {step === 4 && (
        <div className="p-4 space-y-4 animate-in fade-in">
          <div>
            <div className="flex items-center space-x-1.5 text-artisan-terracotta text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Auto-Cataloger</span>
            </div>
            <h2 className="text-xl font-black text-stone-900 leading-tight mt-0.5">
              {t('step4_title')}
            </h2>
            <p className="text-xs text-stone-700 font-medium">
              {t('step4_sub')}
            </p>
          </div>

          {/* Extracted Product Attributes Grid */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-3">
            {/* Product Name */}
            <div>
              <label className="block text-[10px] font-extrabold text-stone-700 uppercase tracking-wider mb-1">
                {t('lbl_product_name')}
              </label>
              <input
                type="text"
                value={productDraft.name}
                onChange={e => updateProductDraft({ name: e.target.value })}
                className="w-full text-sm font-black text-stone-900 p-2 bg-stone-50 rounded-xl border border-stone-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-extrabold text-stone-700 uppercase tracking-wider mb-1">
                  {t('lbl_category')}
                </label>
                <input
                  type="text"
                  value={productDraft.category}
                  onChange={e => updateProductDraft({ category: e.target.value })}
                  className="w-full text-xs font-bold text-stone-900 p-2 bg-stone-50 rounded-xl border border-stone-200"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-stone-700 uppercase tracking-wider mb-1">
                  {t('lbl_material')}
                </label>
                <input
                  type="text"
                  value={productDraft.material}
                  onChange={e => updateProductDraft({ material: e.target.value })}
                  className="w-full text-xs font-bold text-stone-900 p-2 bg-stone-50 rounded-xl border border-stone-200"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-stone-700 uppercase tracking-wider mb-1">
                  {t('lbl_craft_type')}
                </label>
                <input
                  type="text"
                  value={productDraft.craft_type}
                  onChange={e => updateProductDraft({ craft_type: e.target.value })}
                  className="w-full text-xs font-bold text-stone-900 p-2 bg-stone-50 rounded-xl border border-stone-200"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-stone-700 uppercase tracking-wider mb-1">
                  {t('lbl_making_time')}
                </label>
                <input
                  type="number"
                  value={productDraft.making_time_days}
                  onChange={e => updateProductDraft({ making_time_days: Number(e.target.value) })}
                  className="w-full text-xs font-bold text-stone-900 p-2 bg-stone-50 rounded-xl border border-stone-200"
                />
              </div>
            </div>
          </div>

          {/* Multilingual Description Switcher */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2 mb-2">
              <span className="text-xs font-extrabold text-stone-900">
                AI Story & Description
              </span>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setActiveTabDesc('en')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                    activeTabDesc === 'en' ? 'bg-artisan-indigo text-white' : 'text-stone-600 bg-stone-100'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTabDesc('hi')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                    activeTabDesc === 'hi' ? 'bg-artisan-indigo text-white' : 'text-stone-600 bg-stone-100'
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTabDesc('reg')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                    activeTabDesc === 'reg' ? 'bg-artisan-indigo text-white' : 'text-stone-600 bg-stone-100'
                  }`}
                >
                  తెలుగు
                </button>
              </div>
            </div>

            {activeTabDesc === 'en' && (
              <textarea
                rows={4}
                value={productDraft.description_en}
                onChange={e => updateProductDraft({ description_en: e.target.value })}
                className="w-full text-xs text-stone-800 bg-stone-50 rounded-xl p-2.5 border border-stone-200 focus:outline-none"
              />
            )}
            {activeTabDesc === 'hi' && (
              <textarea
                rows={4}
                value={productDraft.description_hi}
                onChange={e => updateProductDraft({ description_hi: e.target.value })}
                className="w-full text-xs text-stone-800 bg-stone-50 rounded-xl p-2.5 border border-stone-200 focus:outline-none"
              />
            )}
            {activeTabDesc === 'reg' && (
              <textarea
                rows={4}
                value={productDraft.description_reg}
                onChange={e => updateProductDraft({ description_reg: e.target.value })}
                className="w-full text-xs text-stone-800 bg-stone-50 rounded-xl p-2.5 border border-stone-200 focus:outline-none"
              />
            )}
          </div>

          <button
            onClick={() => {
              playChime('success');
              updateProductDraft({ step: 5 });
              speak(`Let's find the fair price. AI calculates ${productDraft.suggested_price} rupees based on your craftsmanship.`);
            }}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-artisan-terracotta to-orange-500 text-white font-black text-sm shadow-elevated flex items-center justify-center space-x-2 active:scale-95 hover:shadow-2xl"
          >
            <span>{t('btn_next_pricing')}</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: AI DYNAMIC PRICING ASSISTANT */}
      {/* ========================================================================= */}
      {step === 5 && (
        <div className="p-4 space-y-4 animate-in fade-in">
          <div>
            <div className="flex items-center space-x-1.5 text-emerald-600 text-xs font-black uppercase tracking-wider">
              <DollarSign className="w-3.5 h-3.5" />
              <span>AI Dynamic Pricing</span>
            </div>
            <h2 className="text-xl font-black text-stone-900 leading-tight mt-0.5">
              {t('step5_title')}
            </h2>
            <p className="text-xs text-stone-700 font-medium">
              {t('step5_sub')}
            </p>
          </div>

          {/* Large Price Recommendation Card */}
          <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-indigo-950 text-white rounded-3xl p-5 shadow-2xl border border-stone-700 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                  {t('lbl_recommended_price')}
                </span>
                <h3 className="text-3xl font-black text-white mt-0.5">
                  ₹{productDraft.selling_price.toLocaleString()}
                </h3>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full">
                94% AI Confidence
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-stone-300">
              <span>{t('lbl_suggested_range')}</span>
              <span className="font-bold text-white">
                ₹{productDraft.price_range_min.toLocaleString()} — ₹{productDraft.price_range_max.toLocaleString()}
              </span>
            </div>

            {/* AI Explanation Quote */}
            <blockquote className="mt-3 bg-white/5 rounded-xl p-2.5 text-[11px] text-stone-300 italic border-l-2 border-amber-400">
              "{productDraft.pricing_explanation}"
            </blockquote>
          </div>

          {/* Profit Breakdown Visualization Slider */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-3">
            <span className="text-xs font-extrabold text-stone-700 uppercase tracking-wider block">
              Transparent Profit Breakdown
            </span>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-stone-700">{t('lbl_raw_material')}</span>
                <span className="text-stone-900">₹{productDraft.raw_material_cost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-stone-700">{t('lbl_fair_labour')} ({productDraft.making_time_days} days)</span>
                <span className="text-stone-900">₹{productDraft.labour_cost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-black text-emerald-600 pt-2 border-t border-stone-100">
                <span>{t('lbl_artisan_profit')}</span>
                <span>+₹{productDraft.artisan_profit.toLocaleString()}</span>
              </div>
            </div>

            {/* Custom Price Adjustment Range */}
            <div className="pt-2">
              <div className="flex justify-between items-center text-xs font-bold text-stone-700 mb-1">
                <span>Adjust Selling Price:</span>
                <span className="font-black text-artisan-terracotta text-sm">₹{productDraft.selling_price}</span>
              </div>
              <input
                type="range"
                min={productDraft.price_range_min - 500}
                max={productDraft.price_range_max + 1000}
                step="50"
                value={productDraft.selling_price}
                onChange={e => {
                  const newPrice = Number(e.target.value);
                  const totalCost = productDraft.raw_material_cost + productDraft.labour_cost;
                  updateProductDraft({
                    selling_price: newPrice,
                    artisan_profit: Math.max(newPrice - totalCost, 100)
                  });
                }}
                className="w-full accent-artisan-terracotta cursor-pointer"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={() => {
                playChime('success');
                updateProductDraft({ step: 6 });
                speak('Here is how your product will look to buyers online.');
              }}
              className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-artisan-terracotta to-orange-500 text-white font-black text-sm shadow-elevated flex items-center justify-center space-x-2 active:scale-95 hover:shadow-2xl"
            >
              <span>{t('btn_next_preview')}</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 6: WYSIWYG PRODUCT LISTING PREVIEW */}
      {/* ========================================================================= */}
      {step === 6 && (
        <div className="p-4 space-y-4 animate-in fade-in">
          <div>
            <div className="flex items-center space-x-1.5 text-artisan-terracotta text-xs font-black uppercase tracking-wider">
              <Eye className="w-3.5 h-3.5" />
              <span>Buyer Preview</span>
            </div>
            <h2 className="text-xl font-black text-stone-900 leading-tight mt-0.5">
              {t('step6_title')}
            </h2>
            <p className="text-xs text-stone-700 font-medium">
              {t('step6_sub')}
            </p>
          </div>

          {/* WYSIWYG Buyer Card Mockup */}
          <div className="bg-white border-2 border-stone-200 rounded-3xl overflow-hidden shadow-xl">
            <div className="relative aspect-[4/3]">
              <img
                src={productDraft.enhancedPhotoUrl || productDraft.photoUrl}
                alt={productDraft.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <StatusBadge status="active" />
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-extrabold text-artisan-terracotta uppercase tracking-wider">
                    {productDraft.category}
                  </span>
                  <h3 className="font-extrabold text-stone-900 text-base leading-snug">
                    {productDraft.name}
                  </h3>
                </div>
                <span className="text-xl font-black text-stone-900">
                  ₹{productDraft.selling_price.toLocaleString()}
                </span>
              </div>

              <p className="text-xs text-stone-700 font-medium line-clamp-3">
                {productDraft.description_en}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-[11px] font-semibold text-stone-700">
                <div>Material: <span className="font-bold text-stone-900">{productDraft.material}</span></div>
                <div>Making Time: <span className="font-bold text-stone-900">{productDraft.making_time_days} Days</span></div>
                <div>Location: <span className="font-bold text-stone-900">{user.location}</span></div>
                <div>In Stock: <span className="font-bold text-stone-900">{productDraft.quantity} units</span></div>
              </div>
            </div>
          </div>

          {/* Multichannel Publishing Selector */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-2">
            <label className="block text-xs font-extrabold text-stone-900 uppercase tracking-wider mb-2">
              {t('lbl_where_to_sell')}
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
              <div className="flex items-center space-x-2 text-xs font-bold text-stone-800">
                <span>📱 {t('channel_app')}</span>
              </div>
              <input
                type="checkbox"
                checked={productDraft.channels.app_store}
                onChange={e => updateProductDraft({ channels: { ...productDraft.channels, app_store: e.target.checked } })}
                className="w-4 h-4 accent-artisan-terracotta"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
              <div className="flex items-center space-x-2 text-xs font-bold text-stone-800">
                <span>🏛️ {t('channel_govt')}</span>
              </div>
              <input
                type="checkbox"
                checked={productDraft.channels.govt_marketplace}
                onChange={e => updateProductDraft({ channels: { ...productDraft.channels, govt_marketplace: e.target.checked } })}
                className="w-4 h-4 accent-artisan-terracotta"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
              <div className="flex items-center space-x-2 text-xs font-bold text-stone-800">
                <span>🤝 {t('channel_b2b')}</span>
              </div>
              <input
                type="checkbox"
                checked={productDraft.channels.b2b_marketplace}
                onChange={e => updateProductDraft({ channels: { ...productDraft.channels, b2b_marketplace: e.target.checked } })}
                className="w-4 h-4 accent-artisan-terracotta"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
              <div className="flex items-center space-x-2 text-xs font-bold text-stone-800">
                <span>🌐 {t('channel_ondc')}</span>
              </div>
              <input
                type="checkbox"
                checked={productDraft.channels.ondc}
                onChange={e => updateProductDraft({ channels: { ...productDraft.channels, ondc: e.target.checked } })}
                className="w-4 h-4 accent-artisan-terracotta"
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={() => updateProductDraft({ step: 4 })}
              className="py-3.5 px-4 rounded-2xl bg-stone-100 text-stone-700 font-bold text-xs border border-stone-200 hover:bg-stone-200"
            >
              {t('btn_edit_details')}
            </button>
            <button
              onClick={handlePublish}
              className="flex-1 py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm shadow-xl flex items-center justify-center space-x-2 active:scale-95 hover:shadow-2xl"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>{t('btn_publish_now')}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 7: PUBLISH SUCCESS CELEBRATION */}
      {/* ========================================================================= */}
      {step === 7 && (
        <div className="p-6 my-auto flex flex-col items-center justify-center text-center space-y-5 animate-in zoom-in-95 duration-300">
          {/* Confetti celebration icon */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-2xl animate-bounce">
              <CheckCircle2 className="w-14 h-14 stroke-[2.5]" />
            </div>
            <span className="absolute -top-1 -right-1 text-3xl">🎉</span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
              {t('step7_celebration_title')}
            </h2>
            <p className="text-xs text-stone-700 font-medium mt-1.5 max-w-xs">
              {t('step7_celebration_sub')}
            </p>
          </div>

          {/* Published Card Snapshot */}
          <div className="bg-white border-2 border-emerald-200 rounded-3xl p-4 shadow-xl w-full max-w-xs text-left">
            <div className="flex items-center space-x-3">
              <img
                src={productDraft.enhancedPhotoUrl || productDraft.photoUrl}
                alt="Published"
                className="w-16 h-16 rounded-2xl object-cover border border-stone-200"
              />
              <div className="flex-1">
                <span className="text-[10px] font-bold text-emerald-600 uppercase">Product Published</span>
                <h4 className="font-extrabold text-stone-900 text-sm line-clamp-1">{productDraft.name}</h4>
                <span className="text-base font-black text-artisan-terracotta">₹{productDraft.selling_price.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-stone-100 text-center text-xs font-bold text-stone-700">
              👥 <span className="text-emerald-700 font-black">24 buyers</span> can now discover your creation.
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="w-full space-y-2.5 pt-2">
            <button
              onClick={() => {
                playChime('tap');
                navigateTo('my_products');
              }}
              className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-artisan-terracotta to-orange-500 text-white font-extrabold text-sm shadow-elevated active:scale-95"
            >
              {t('btn_view_product')}
            </button>

            <button
              onClick={() => {
                playChime('tap');
                resetProductDraft();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-stone-100 text-stone-800 font-bold text-xs border border-stone-200 hover:bg-stone-200 active:scale-95"
            >
              {t('btn_add_another')}
            </button>

            <button
              onClick={() => {
                playChime('tap');
                navigateTo('home');
              }}
              className="w-full py-2.5 text-xs font-extrabold text-stone-700 hover:text-stone-900"
            >
              {t('btn_go_home')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
