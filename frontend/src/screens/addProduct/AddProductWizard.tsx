import React, { useState, useRef } from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useVoice, AUDIO_GUIDANCE_BY_LANG } from '../../context/VoiceContext.js';
import { Header } from '../../components/layout/Header.js';
import { BeforeAfterSlider } from '../../components/common/BeforeAfterSlider.js';
import { VoiceButton } from '../../components/common/VoiceButton.js';
import { StatusBadge } from '../../components/common/StatusBadge.js';
import { AudioGuidancePlayer } from '../../components/common/AudioGuidancePlayer.js';
import { QualityCheckerCard } from '../../components/common/QualityCheckerCard.js';
import { PricingCalculatorCard } from '../../components/common/PricingCalculatorCard.js';
import { ProductReadinessMeter } from '../../components/common/ProductReadinessMeter.js';
import { processImageWithAiStudio } from '../../utils/aiImageStudio.js';
import { 
  SAMPLE_HANDICRAFT_PHOTOS, 
  BAMBOO_B2B_MATCHES, 
  INITIAL_QUALITY_ALERTS, 
  calculateDynamicPrice 
} from '../../data/mockData.js';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Mic, 
  CheckCircle2, 
  ShieldCheck, 
  Globe, 
  RefreshCw, 
  Share2, 
  Tag, 
  DollarSign, 
  Package, 
  Eye,
  Store,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AddProductWizard: React.FC = () => {
  const { productDraft, updateProductDraft, resetProductDraft, addProduct, navigateTo, goBack, user } = useAppState();
  const { t, language, currentLanguageOption } = useLanguage();
  const { speak, playChime, isListening, startListening, stopListening } = useVoice();

  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [isExtractingNLP, setIsExtractingNLP] = useState<boolean>(false);
  const [activeTabDesc, setActiveTabDesc] = useState<'en' | 'hi'>('en');
  const [detectedLangName, setDetectedLangName] = useState<string>('Hindi & English');

  const step = productDraft.step;

  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  const handleTriggerCamera = () => {
    playChime('tap');
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
      cameraInputRef.current.click();
    }
  };

  const handleTriggerGallery = () => {
    playChime('tap');
    if (galleryInputRef.current) {
      galleryInputRef.current.value = '';
      galleryInputRef.current.click();
    }
  };

  // Real AI Studio enhancement processing on any photo (uploaded, captured, or sample)
  const triggerEnhancement = async (
    rawUrl: string, 
    preset: 'studio' | 'white' | 'light' | 'original' = 'studio', 
    preEnhancedUrl?: string
  ) => {
    setIsEnhancing(true);
    updateProductDraft({ step: 2, photoUrl: rawUrl, selectedBgPreset: preset });

    const announcement = AUDIO_GUIDANCE_BY_LANG.step2?.[language] ||
      'AI Photo Studio is removing cluttered background, balancing studio lighting, and adding natural soft shadows.';
    speak(announcement, currentLanguageOption.voiceLang);

    if (preEnhancedUrl) {
      setTimeout(() => {
        setIsEnhancing(false);
        playChime('success');
        updateProductDraft({ enhancedPhotoUrl: preEnhancedUrl });
      }, 700);
      return;
    }

    try {
      const processed = await processImageWithAiStudio(rawUrl, { preset });
      setIsEnhancing(false);
      playChime('success');
      updateProductDraft({ enhancedPhotoUrl: processed });
    } catch (e) {
      console.warn('Canvas studio processing error:', e);
      setIsEnhancing(false);
      updateProductDraft({ enhancedPhotoUrl: rawUrl });
    }
  };

  // Step 1: Select demo handicraft
  const handleSelectSample = (sample: typeof SAMPLE_HANDICRAFT_PHOTOS[0]) => {
    playChime('tap');
    const dynamicPricing = calculateDynamicPrice(sample.raw_cost, sample.making_days, sample.category);

    updateProductDraft({
      photoUrl: sample.original,
      enhancedPhotoUrl: sample.enhanced,
      name: sample.name,
      category: sample.category,
      material: sample.material,
      making_time_days: sample.making_days,
      raw_material_cost: sample.raw_cost,
      labour_cost: sample.labour_cost,
      suggested_price: dynamicPricing.suggested_price,
      selling_price: dynamicPricing.suggested_price,
      price_range_min: dynamicPricing.recommended_min,
      price_range_max: dynamicPricing.recommended_max,
      estimated_base_cost: dynamicPricing.estimated_base_cost,
      market_ref_min: dynamicPricing.market_reference_min,
      market_ref_max: dynamicPricing.market_reference_max,
      pricing_explanation: dynamicPricing.explanation,
      voiceText: sample.speech_hi || sample.speech_en
    });

    triggerEnhancement(sample.original, 'studio', sample.enhanced);
  };

  // Step 1: Real photo upload from gallery or camera capture
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      playChime('tap');
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (event) => {
        const rawUrl = event.target?.result as string;
        updateProductDraft({ photoUrl: rawUrl });
        await triggerEnhancement(rawUrl, 'studio');
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 2: Switch studio preset and re-process image in real time
  const handleBgPresetChange = async (preset: 'studio' | 'white' | 'light' | 'original') => {
    playChime('tap');
    updateProductDraft({ selectedBgPreset: preset });
    setIsEnhancing(true);
    const enhanced = await processImageWithAiStudio(productDraft.photoUrl, { preset });
    setIsEnhancing(false);
    updateProductDraft({ enhancedPhotoUrl: enhanced });
  };

  // Step 3: Voice-to-Catalog Input
  const handleVoiceInput = () => {
    startListening((spokenText: string) => {
      processCatalogNLP(spokenText);
    });
  };

  const processCatalogNLP = (spokenText: string) => {
    setIsExtractingNLP(true);
    updateProductDraft({ voiceText: spokenText });

    const isHindi = /[\u0900-\u097F]/.test(spokenText) || spokenText.toLowerCase().includes('tokri') || spokenText.toLowerCase().includes('baans');
    setDetectedLangName(isHindi ? 'Hindi (हिन्दी)' : 'English');

    setTimeout(() => {
      setIsExtractingNLP(false);
      playChime('success');

      // Intelligent entity extraction simulation
      const isBamboo = spokenText.toLowerCase().includes('bamboo') || spokenText.includes('बांस') || spokenText.toLowerCase().includes('basket') || spokenText.includes('टोकरी');
      
      if (isBamboo) {
        const pricing = calculateDynamicPrice(350, 2, 'Home & Decor');
        updateProductDraft({
          name: 'Handcrafted Bamboo Storage Basket',
          category: 'Home & Decor',
          material: 'Natural Bamboo Strips & Cane Ribs',
          craft_type: '100% Traditional Handwoven',
          production_method: 'Handmade',
          making_time_days: 2,
          dimensions: '14" Diameter x 10" Height',
          usage: 'Storage / Laundry / Minimalist Home Decor',
          keywords: ['bamboo basket', 'handmade basket', 'eco-friendly storage', 'traditional handicraft', 'home decor'],
          description_en: 'A premium handcrafted storage basket woven from seasoned natural bamboo. Ideal for eco-friendly living, multi-purpose clothes storage, and minimalist home decor.',
          description_hi: 'प्राकृतिक बांस से निर्मित हस्तनिर्मित स्टोरेज टोकरी। कपड़े और घरेलू सामान सुरक्षित रखने के लिए सर्वोत्तम।',
          raw_material_cost: 350,
          labour_cost: 300,
          packaging_cost: 50,
          logistics_cost: 100,
          estimated_base_cost: 800,
          market_ref_min: 850,
          market_ref_max: 1100,
          suggested_price: 949,
          selling_price: 949,
          price_range_min: 899,
          price_range_max: 999,
          artisan_profit: 449,
          readiness_score: 91,
          step: 4
        });
        speak('AI extracted product details: Handcrafted Bamboo Storage Basket. Home and Decor storage.');
      } else {
        updateProductDraft({ step: 4 });
      }
    }, 1000);
  };

  const handleUpdatePrice = (price: number) => {
    const raw = productDraft.raw_material_cost || 350;
    const pkg = productDraft.packaging_cost || 50;
    const log = productDraft.logistics_cost || 100;
    updateProductDraft({
      selling_price: price,
      artisan_profit: Math.max(price - (raw + pkg + log), 150)
    });
  };

  const handlePublish = () => {
    playChime('success');
    const newProd = {
      id: `prod_${Date.now()}`,
      seller_id: user.id || 'user_artisan_01',
      name: productDraft.name || 'Handcrafted Artisan Creation',
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
      quantity: productDraft.quantity || 24,
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
    confetti({ particleCount: 130, spread: 85, origin: { y: 0.6 } });
    speak(`Congratulations! ${newProd.name} is now published and matched with 3 direct B2B buyers.`);
  };

  return (
    <div className="flex flex-col min-h-full bg-stone-50 select-none pb-8">
      {step !== 7 && (
        <Header
          title={`KarigarConnect AI (Step ${step} of 6)`}
          showBack={true}
          onBack={() => {
            if (step > 1) updateProductDraft({ step: step - 1 });
            else goBack();
          }}
          audioGuideText={`Step ${step}: ${
            step === 1 ? 'Take a photo of your craft. Cluttered backgrounds are fine, our AI will clean it.' :
            step === 2 ? 'AI is removing background and correcting lighting.' :
            step === 3 ? 'Press Speak and tell us about your product in your regional language.' :
            step === 4 ? 'Review the auto-generated bilingual catalog listing.' :
            step === 5 ? 'Review the transparent fair cost breakdown and recommended selling price.' :
            'Verify your AI product readiness score and matched B2B buyers before publishing.'
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
          <div className="flex justify-between items-center text-[10px] font-bold text-stone-600 mt-1">
            <span>1. Photo</span>
            <span>2. AI Studio</span>
            <span>3. Voice</span>
            <span>4. Catalog</span>
            <span>5. Pricing</span>
            <span>6. Readiness</span>
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
              Step 1: Take ONE Product Photo
            </h2>
            <p className="text-xs text-stone-600 font-medium mt-0.5">
              Ordinary phone photo with messy background? No problem. AI will clean and studio-enhance it.
            </p>
          </div>

          {/* Camera Viewfinder */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border-2 border-dashed border-stone-300 bg-stone-900 flex flex-col items-center justify-center text-white shadow-xl group">
            <img
              src={productDraft.photoUrl}
              alt="Raw Product"
              className="absolute inset-0 w-full h-full object-cover opacity-75"
            />
            <div className="relative z-10 flex flex-col items-center text-center p-4">
              <button
                type="button"
                onClick={handleTriggerCamera}
                className="w-16 h-16 rounded-full bg-white text-artisan-terracotta shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-transform mb-2"
                title="Capture Photo"
              >
                <Camera className="w-8 h-8 stroke-[2.5]" />
              </button>
              <span className="text-xs font-black drop-shadow bg-black/60 px-3 py-1 rounded-full">
                Tap to Open Camera
              </span>
            </div>

            {/* Viewfinder corner brackets */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white pointer-events-none"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white pointer-events-none"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white pointer-events-none"></div>
          </div>

          {/* AI Catalog Quality Checker Banner */}
          <QualityCheckerCard
            alerts={INITIAL_QUALITY_ALERTS}
            isEnhanced={false}
            onAutoFix={() => triggerEnhancement(productDraft.photoUrl, 'studio')}
            isFixing={isEnhancing}
          />

          {/* Dual Camera and Gallery Upload Actions with Direct Ref Triggers */}
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleTriggerCamera}
                className="py-3.5 px-3 rounded-2xl bg-gradient-to-r from-artisan-terracotta to-orange-500 text-white font-black text-xs shadow-elevated flex items-center justify-center space-x-1.5 active:scale-95 transition-all text-center"
              >
                <Camera className="w-4 h-4 stroke-[2.5]" />
                <span>📸 Open Camera</span>
              </button>

              <button
                type="button"
                onClick={handleTriggerGallery}
                className="py-3.5 px-3 rounded-2xl bg-stone-900 text-white font-black text-xs shadow-sm flex items-center justify-center space-x-1.5 active:scale-95 transition-all text-center"
              >
                <Upload className="w-4 h-4 stroke-[2.5]" />
                <span>🖼️ Phone Gallery</span>
              </button>
            </div>

            {/* Hidden native input elements */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileUpload}
            />
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

            {/* Quick Demo Craft Photos */}
            <div>
              <p className="text-[11px] font-extrabold text-stone-700 uppercase tracking-wider mb-2">
                Or select an authentic craft example to test:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SAMPLE_HANDICRAFT_PHOTOS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectSample(item)}
                    className="relative aspect-square rounded-2xl overflow-hidden border-2 border-stone-200 shadow-sm active:scale-95 transition-transform text-left group"
                  >
                    <img src={item.original} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2">
                      <span className="text-[10px] font-bold text-white leading-tight line-clamp-2">
                        {item.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: AI IMAGE STUDIO */}
      {/* ========================================================================= */}
      {step === 2 && (
        <div className="p-4 space-y-4 animate-in fade-in">
          <div>
            <div className="flex items-center space-x-1.5 text-artisan-terracotta text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Photo Studio</span>
            </div>
            <h2 className="text-xl font-black text-stone-900 leading-tight mt-0.5">
              Studio Background & Lighting Enhancement
            </h2>
            <p className="text-xs text-stone-600 font-medium">
              Drag the slider to compare the raw domestic photo vs clean isolated studio shot.
            </p>
          </div>

          {/* Interactive Split Slider */}
          <BeforeAfterSlider
            beforeImage={productDraft.photoUrl}
            afterImage={productDraft.enhancedPhotoUrl}
            beforeLabel="Ordinary Photo"
            afterLabel="AI Studio Enhanced"
          />

          {/* Studio Preset Backdrops */}
          <div>
            <label className="block text-xs font-extrabold text-stone-700 uppercase tracking-wider mb-1.5">
              Select Studio Backdrop
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'studio', label: 'Clean Studio', icon: '💡' },
                { id: 'white', label: 'Pure White (GeM/Amazon)', icon: '⚪' },
                { id: 'light', label: 'Warm Earth', icon: '🌾' },
                { id: 'original', label: 'Original', icon: '📸' }
              ].map(preset => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleBgPresetChange(preset.id as any)}
                  className={`py-2 px-1 rounded-xl border-2 text-center transition-all ${
                    productDraft.selectedBgPreset === preset.id
                      ? 'border-artisan-terracotta bg-amber-50 font-bold text-artisan-terracotta shadow-sm'
                      : 'border-stone-200 bg-white text-stone-700'
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

          {/* Quality Audit Passed Card */}
          <QualityCheckerCard
            alerts={[]}
            isEnhanced={true}
            onAutoFix={() => {}}
          />

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={() => updateProductDraft({ step: 1 })}
              className="py-3.5 px-4 rounded-2xl bg-stone-100 text-stone-700 font-bold text-xs border border-stone-200 hover:bg-stone-200 active:scale-95"
            >
              Try Another Photo
            </button>
            <button
              onClick={() => {
                playChime('success');
                updateProductDraft({ step: 3 });
                speak('Now tell us about your product. Tap Speak and talk in your regional language.');
              }}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-artisan-terracotta to-orange-500 text-white font-extrabold text-sm shadow-elevated flex items-center justify-center space-x-2 active:scale-95 hover:shadow-2xl"
            >
              <span>Use Photo & Speak</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: SPEAK INSTEAD OF TYPING (VOICE-TO-CATALOG) */}
      {/* ========================================================================= */}
      {step === 3 && (
        <div className="p-4 space-y-4 animate-in fade-in">
          <div>
            <div className="flex items-center space-x-1.5 text-artisan-indigo text-xs font-black uppercase tracking-wider">
              <Mic className="w-3.5 h-3.5" />
              <span>Speak Instead of Typing</span>
            </div>
            <h2 className="text-xl font-black text-stone-900 leading-tight mt-0.5">
              Describe Your Product in Your Regional Language
            </h2>
            <p className="text-xs text-stone-600 font-medium">
              No forms or complicated e-commerce jargon. Simply speak naturally.
            </p>
          </div>

          {/* Spoken Guidance Prompt */}
          <AudioGuidancePlayer
            title="What should you say?"
            speechText="Tell us what this product is, what raw materials it is made from, how many days it took to make, and what it can be used for."
          />

          {/* Large Voice Recording Button */}
          <VoiceButton
            isListening={isListening}
            onPress={isListening ? stopListening : handleVoiceInput}
            label={isListening ? 'Listening...' : '🎙️ Describe Product (Tap to Speak)'}
            subLabel="Speak in Hindi, English, Telugu, Tamil, etc."
          />

          {/* Language Detection Pill */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 font-bold">
            <div className="flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span>Language: {detectedLangName}</span>
            </div>
            <span className="text-[10px] text-indigo-600 font-semibold">Auto-Translates to English & Hindi</span>
          </div>

          {/* Transcription Display */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-2">
            <span className="text-[11px] font-extrabold text-stone-700 uppercase tracking-wider block">
              Spoken Voice Transcript
            </span>
            <textarea
              rows={3}
              value={productDraft.voiceText}
              onChange={e => updateProductDraft({ voiceText: e.target.value })}
              placeholder="Your voice transcription will appear here..."
              className="w-full text-xs font-semibold text-stone-800 bg-stone-50 rounded-xl p-2.5 border border-stone-200 focus:outline-none focus:border-artisan-terracotta"
            />
          </div>

          {/* One-tap Demo Regional Voice Prompts */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-stone-700 uppercase tracking-wider block">
              Or tap a sample voice description to test:
            </span>
            <button
              onClick={() => processCatalogNLP('यह टोकरी प्राकृतिक बांस से बनी है। यह पूरी तरह से हस्तनिर्मित है और इसे बनाने में दो दिन का समय लगता है। इसका उपयोग कपड़े और घरेलू सामान रखने के लिए किया जा सकता है।')}
              className="w-full text-left p-2.5 rounded-xl bg-stone-100 hover:bg-amber-50 text-stone-800 hover:text-amber-900 text-xs font-bold transition-colors border border-stone-200"
            >
              🗣️ Hindi: "यह टोकरी प्राकृतिक बांस से बनी है। दो दिन में बनी है..."
            </button>
            <button
              onClick={() => processCatalogNLP('This basket is made from natural bamboo. It is 100% handmade and takes two days to make. It can be used for storing clothes and household items.')}
              className="w-full text-left p-2.5 rounded-xl bg-stone-100 hover:bg-amber-50 text-stone-800 hover:text-amber-900 text-xs font-bold transition-colors border border-stone-200"
            >
              🗣️ English: "This basket is made from bamboo. Handmade and takes two days..."
            </button>
          </div>

          {/* Process Voice Button */}
          <button
            onClick={() => processCatalogNLP(productDraft.voiceText || 'Handcrafted Bamboo Storage Basket')}
            disabled={isExtractingNLP}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-artisan-terracotta to-orange-500 text-white font-black text-sm shadow-elevated flex items-center justify-center space-x-2 active:scale-95 hover:shadow-2xl"
          >
            {isExtractingNLP ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Generate AI Catalog Listing</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: AI PRODUCT CATALOG (ZERO-FORM AUTO-GENERATION) */}
      {/* ========================================================================= */}
      {step === 4 && (
        <div className="p-4 space-y-4 animate-in fade-in">
          <div>
            <div className="flex items-center space-x-1.5 text-artisan-terracotta text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Auto-Cataloger</span>
            </div>
            <h2 className="text-xl font-black text-stone-900 leading-tight mt-0.5">
              Auto-Generated Product Catalog
            </h2>
            <p className="text-xs text-stone-600 font-medium">
              AI extracted all attributes from your voice. You only verify: "Is this correct?"
            </p>
          </div>

          {/* Extracted Attributes Card */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div>
              <label className="block text-[10px] font-extrabold text-stone-600 uppercase tracking-wider mb-1">
                Product Title
              </label>
              <input
                type="text"
                value={productDraft.name}
                onChange={e => updateProductDraft({ name: e.target.value })}
                className="w-full text-sm font-black text-stone-900 p-2.5 bg-stone-50 rounded-xl border border-stone-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-extrabold text-stone-600 uppercase tracking-wider mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={productDraft.category}
                  onChange={e => updateProductDraft({ category: e.target.value })}
                  className="w-full text-xs font-bold text-stone-900 p-2 bg-stone-50 rounded-xl border border-stone-200"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-stone-600 uppercase tracking-wider mb-1">
                  Material
                </label>
                <input
                  type="text"
                  value={productDraft.material}
                  onChange={e => updateProductDraft({ material: e.target.value })}
                  className="w-full text-xs font-bold text-stone-900 p-2 bg-stone-50 rounded-xl border border-stone-200"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-stone-600 uppercase tracking-wider mb-1">
                  Manufacturing
                </label>
                <input
                  type="text"
                  value={productDraft.craft_type}
                  onChange={e => updateProductDraft({ craft_type: e.target.value })}
                  className="w-full text-xs font-bold text-stone-900 p-2 bg-stone-50 rounded-xl border border-stone-200"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-stone-600 uppercase tracking-wider mb-1">
                  Making Time
                </label>
                <input
                  type="text"
                  value={`${productDraft.making_time_days} Days`}
                  onChange={e => updateProductDraft({ making_time_days: Number(e.target.value.replace(/\D/g, '')) || 2 })}
                  className="w-full text-xs font-bold text-stone-900 p-2 bg-stone-50 rounded-xl border border-stone-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-stone-600 uppercase tracking-wider mb-1">
                Usage & Function
              </label>
              <input
                type="text"
                value={productDraft.usage || 'Storage / Laundry / Home decoration'}
                onChange={e => updateProductDraft({ usage: e.target.value })}
                className="w-full text-xs font-bold text-stone-900 p-2 bg-stone-50 rounded-xl border border-stone-200"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-stone-600 uppercase tracking-wider mb-1">
                Dimensions
              </label>
              <input
                type="text"
                value={productDraft.dimensions}
                onChange={e => updateProductDraft({ dimensions: e.target.value })}
                placeholder='e.g. 14" Diameter x 10" Height'
                className="w-full text-xs font-bold text-stone-900 p-2 bg-stone-50 rounded-xl border border-stone-200"
              />
            </div>

            {/* Generated Keywords */}
            <div>
              <label className="block text-[10px] font-extrabold text-stone-600 uppercase tracking-wider mb-1">
                SEO & Marketplace Search Keywords
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(productDraft.keywords || ['bamboo basket', 'handmade basket', 'eco-friendly storage', 'traditional handicraft', 'home decor']).map(k => (
                  <span key={k} className="text-[10px] bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-lg font-bold text-stone-700">
                    #{k}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bilingual Description Verification */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <span className="text-xs font-extrabold text-stone-900">
                Bilingual AI Description
              </span>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setActiveTabDesc('en')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTabDesc === 'en' ? 'bg-stone-900 text-white' : 'text-stone-600 bg-stone-100'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTabDesc('hi')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTabDesc === 'hi' ? 'bg-stone-900 text-white' : 'text-stone-600 bg-stone-100'
                  }`}
                >
                  हिन्दी (Hindi)
                </button>
              </div>
            </div>

            {activeTabDesc === 'en' ? (
              <textarea
                rows={3}
                value={productDraft.description_en}
                onChange={e => updateProductDraft({ description_en: e.target.value })}
                className="w-full text-xs text-stone-800 bg-stone-50 rounded-xl p-2.5 border border-stone-200 focus:outline-none"
              />
            ) : (
              <textarea
                rows={3}
                value={productDraft.description_hi}
                onChange={e => updateProductDraft({ description_hi: e.target.value })}
                className="w-full text-xs text-stone-800 bg-stone-50 rounded-xl p-2.5 border border-stone-200 focus:outline-none"
              />
            )}
          </div>

          {/* Confirmation Action */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={() => {
                playChime('success');
                updateProductDraft({ step: 5 });
                speak(`AI calculates a fair base cost of ${productDraft.estimated_base_cost || 800} rupees. Recommended selling price: 899 to 999 rupees.`);
              }}
              className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-artisan-terracotta to-orange-500 text-white font-black text-sm shadow-elevated flex items-center justify-center space-x-2 active:scale-95 hover:shadow-2xl"
            >
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>Correct! Calculate Fair Price ➔</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: DYNAMIC PRICING ASSISTANT */}
      {/* ========================================================================= */}
      {step === 5 && (
        <div className="p-4 space-y-4 animate-in fade-in">
          <div>
            <div className="flex items-center space-x-1.5 text-emerald-600 text-xs font-black uppercase tracking-wider">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Dynamic Pricing Assistant</span>
            </div>
            <h2 className="text-xl font-black text-stone-900 leading-tight mt-0.5">
              Cost-Plus & Market Calibration
            </h2>
            <p className="text-xs text-stone-600 font-medium">
              Fair compensation for artisan labour combined with live market reference data.
            </p>
          </div>

          {/* Pricing Calculator Card */}
          <PricingCalculatorCard
            pricing={{
              raw_material_cost: productDraft.raw_material_cost || 350,
              labour_days: productDraft.making_time_days || 2,
              labour_cost: productDraft.labour_cost || 300,
              packaging_cost: productDraft.packaging_cost || 50,
              logistics_cost: productDraft.logistics_cost || 100,
              estimated_base_cost: productDraft.estimated_base_cost || 800,
              market_reference_min: productDraft.market_ref_min || 850,
              market_reference_max: productDraft.market_ref_max || 1100,
              recommended_min: productDraft.price_range_min || 899,
              recommended_max: productDraft.price_range_max || 999,
              suggested_price: productDraft.suggested_price || 949,
              artisan_profit: productDraft.artisan_profit || 449,
              explanation: productDraft.pricing_explanation
            }}
            selectedPrice={productDraft.selling_price}
            onSelectPrice={handleUpdatePrice}
          />

          <button
            onClick={() => {
              playChime('success');
              updateProductDraft({ step: 6 });
              speak('Auditing listing readiness and discovering direct B2B bulk buyers.');
            }}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-artisan-terracotta to-orange-500 text-white font-black text-sm shadow-elevated flex items-center justify-center space-x-2 active:scale-95 hover:shadow-2xl"
          >
            <span>Review Readiness & B2B Matches</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 6: PRODUCT READINESS SCORE & B2B MARKET LINKAGE */}
      {/* ========================================================================= */}
      {step === 6 && (
        <div className="p-4 space-y-4 animate-in fade-in">
          <div>
            <div className="flex items-center space-x-1.5 text-artisan-terracotta text-xs font-black uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Listing Audit & Market Matching</span>
            </div>
            <h2 className="text-xl font-black text-stone-900 leading-tight mt-0.5">
              Product Readiness & Buyer Matches
            </h2>
            <p className="text-xs text-stone-600 font-medium">
              Verified 9-point catalog audit and direct B2B market demand linkage.
            </p>
          </div>

          {/* AI Product Readiness Meter */}
          <ProductReadinessMeter
            score={productDraft.dimensions ? 98 : 91}
            hasPhoto={true}
            isEnhanced={true}
            hasTitle={!!productDraft.name}
            hasDescription={!!productDraft.description_en}
            hasMaterial={!!productDraft.material}
            hasPrice={!!productDraft.selling_price}
            hasDimensions={!!productDraft.dimensions}
            hasCategory={!!productDraft.category}
            onAddDimensions={() => updateProductDraft({ dimensions: '14" Diameter x 10" Height' })}
          />

          {/* Direct B2B Market Matching Section */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-black text-stone-900">
                  Potential B2B Buyer Matches (3 Found)
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Direct Linkage
              </span>
            </div>

            <div className="space-y-2">
              {BAMBOO_B2B_MATCHES.map(b => (
                <div key={b.id} className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-black text-stone-900 block">{b.company_name}</span>
                    <span className="text-[10px] text-stone-500 font-medium">{b.buyer_type} • Min Order: {b.minimum_order_qty} units</span>
                  </div>
                  <span className={`text-xs font-black px-2 py-1 rounded-lg ${
                    b.match_score >= 90 ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {b.match_score}% Match
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Multi-Channel Distribution */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-2">
            <label className="block text-xs font-extrabold text-stone-900 uppercase tracking-wider mb-2">
              Where will your product sell?
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-stone-800">
              <div className="p-2 rounded-xl bg-stone-50 border border-stone-200 flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>📱 Artisan App</span>
              </div>
              <div className="p-2 rounded-xl bg-stone-50 border border-stone-200 flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>🏛️ GeM / IndiaHandmade</span>
              </div>
              <div className="p-2 rounded-xl bg-stone-50 border border-stone-200 flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>🤝 Wholesale B2B</span>
              </div>
              <div className="p-2 rounded-xl bg-stone-50 border border-stone-200 flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>🌐 ONDC Open Network</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={() => updateProductDraft({ step: 4 })}
              className="py-3.5 px-4 rounded-2xl bg-stone-100 text-stone-700 font-bold text-xs border border-stone-200 hover:bg-stone-200"
            >
              Edit Catalog
            </button>
            <button
              onClick={handlePublish}
              className="flex-1 py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm shadow-xl flex items-center justify-center space-x-2 active:scale-95 hover:shadow-2xl"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>Publish & Connect with Buyers</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 7: PUBLISH SUCCESS CELEBRATION */}
      {/* ========================================================================= */}
      {step === 7 && (
        <div className="p-6 my-auto flex flex-col items-center justify-center text-center space-y-5 animate-in zoom-in-95 duration-300">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-2xl animate-bounce">
              <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
            </div>
            <span className="absolute -top-1 -right-1 text-3xl">🎉</span>
          </div>

          <div>
            <h2 className="text-2xl font-black text-stone-900 leading-tight">
              Congratulations! Your Craft is Market-Ready!
            </h2>
            <p className="text-xs text-stone-600 font-medium mt-1 max-w-xs">
              "One Photo + One Voice → Complete Digital Business Listing"
            </p>
          </div>

          {/* Digital Catalog Card Preview */}
          <div className="bg-white border-2 border-emerald-200 rounded-3xl p-4 shadow-xl w-full max-w-xs text-left">
            <div className="flex items-center space-x-3">
              <img
                src={productDraft.enhancedPhotoUrl || productDraft.photoUrl}
                alt="Published"
                className="w-16 h-16 rounded-2xl object-cover border border-stone-200"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-emerald-600 uppercase">Live Digital Listing</span>
                <h4 className="font-extrabold text-stone-900 text-sm truncate">{productDraft.name}</h4>
                <span className="text-base font-black text-artisan-terracotta">₹{productDraft.selling_price.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-700">
              <span>Readiness: <strong>91/100</strong></span>
              <span className="text-emerald-700">🎯 3 B2B Buyers Matched</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="w-full space-y-2.5 pt-2">
            <button
              onClick={() => {
                playChime('tap');
                navigateTo('find_buyers');
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-stone-900 text-white font-extrabold text-xs shadow-md active:scale-95 flex items-center justify-center space-x-2"
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>View Matched B2B Buyers & Send Proposals</span>
            </button>

            <button
              onClick={() => {
                playChime('tap');
                navigateTo('my_products');
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-artisan-terracotta to-orange-500 text-white font-extrabold text-xs shadow-elevated active:scale-95"
            >
              View in My Products Catalog
            </button>

            <button
              onClick={() => {
                playChime('tap');
                resetProductDraft();
              }}
              className="w-full py-3 px-4 rounded-2xl bg-stone-100 text-stone-800 font-bold text-xs border border-stone-200 hover:bg-stone-200 active:scale-95"
            >
              + List Another Product
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
