import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useVoice } from '../../context/VoiceContext.js';
import { BeforeAfterSlider } from '../common/BeforeAfterSlider.js';
import { QualityCheckerCard } from '../common/QualityCheckerCard.js';
import { PricingCalculatorCard } from '../common/PricingCalculatorCard.js';
import { ProductReadinessMeter } from '../common/ProductReadinessMeter.js';
import { calculateDynamicPrice, BAMBOO_B2B_MATCHES, INITIAL_QUALITY_ALERTS } from '../../data/mockData.js';
import { 
  X, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Camera, 
  Mic, 
  Tag, 
  DollarSign, 
  CheckCircle2, 
  Users, 
  Share2, 
  Volume2, 
  Play, 
  Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LiveDemoModal: React.FC = () => {
  const { isLiveDemoOpen, setIsLiveDemoOpen, updateProductDraft, navigateTo } = useAppState();
  const { speak, playChime } = useVoice();
  const [currentScene, setCurrentScene] = useState<number>(1);

  if (!isLiveDemoOpen) return null;

  const messyPhoto = 'https://images.unsplash.com/photo-1595079672139-62294316750c?w=800&auto=format&fit=crop&q=80';
  const studioPhoto = 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&auto=format&fit=crop&q=80';
  const pricingData = calculateDynamicPrice(350, 2, 'Home & Decor');

  const SCENES = [
    {
      number: 1,
      title: 'Scene 1: The Artisan Reality',
      presenterSays: '"This is how an artisan starts: a phone photo of a handmade bamboo basket with messy background, clothes, walls, and poor lighting. They lack copywriting, pricing, and digital listing skills."',
      icon: Camera
    },
    {
      number: 2,
      title: 'Scene 2: 1-Tap Photo Capture',
      presenterSays: '"The artisan opens KarigarConnect AI and snaps ONE photo. They do not need professional photography equipment or skills."',
      icon: Camera
    },
    {
      number: 3,
      title: 'Scene 3: AI Image Studio & Quality Audit',
      presenterSays: '"Our AI vision model performs background detection, object segmentation, removes domestic clutter, corrects lighting to 5500K daylight, and adds natural soft shadows."',
      icon: Sparkles
    },
    {
      number: 4,
      title: 'Scene 4: Speak in Regional Language',
      presenterSays: '"No 15-field forms to type. The artisan simply speaks in Hindi or their mother tongue. Our NLP converts voice into a professional bilingual catalog with material, usage, and SEO keywords."',
      icon: Mic
    },
    {
      number: 5,
      title: 'Scene 5: AI Dynamic Pricing Engine',
      presenterSays: '"Instead of arbitrary guessing, our ML pricing model calculates fair wages: raw materials (₹350) + 2 days labour (₹300) + packaging (₹50) + logistics (₹100) = Base cost ₹800. Suggested range: ₹899–₹999."',
      icon: DollarSign
    },
    {
      number: 6,
      title: 'Scene 6: AI Product Readiness Score',
      presenterSays: '"Before publishing, our quality engine audits all 9 parameters. Here it scores 91/100 and tells the artisan: Add dimensions to reach 100%."',
      icon: CheckCircle2
    },
    {
      number: 7,
      title: 'Scene 7: Direct B2B Market Matching',
      presenterSays: '"We bypass middlemen and match directly with bulk buyers. Buyer A is looking for 50 bamboo baskets (92% match). With one click, the artisan submits a wholesale proposal."',
      icon: Users
    },
    {
      number: 8,
      title: 'Scene 8: Instant Digital Catalog & Share',
      presenterSays: '"In under 3 minutes, One Photo + One Voice generated a complete, market-ready digital business listing live on e-commerce, GeM, and ONDC!"',
      icon: Share2
    }
  ];

  const currentSceneData = SCENES[currentScene - 1];

  const handleNext = () => {
    playChime('tap');
    if (currentScene < 8) {
      setCurrentScene(currentScene + 1);
    } else {
      confetti({ particleCount: 150, spread: 90 });
      setIsLiveDemoOpen(false);
      navigateTo('home');
    }
  };

  const handlePrev = () => {
    playChime('tap');
    if (currentScene > 1) {
      setCurrentScene(currentScene - 1);
    }
  };

  const loadIntoWizard = () => {
    playChime('success');
    updateProductDraft({
      step: currentScene === 1 || currentScene === 2 ? 1 :
            currentScene === 3 ? 2 :
            currentScene === 4 ? 4 :
            currentScene === 5 ? 5 : 6,
      photoUrl: messyPhoto,
      enhancedPhotoUrl: studioPhoto,
      name: 'Handcrafted Bamboo Storage Basket',
      category: 'Home & Decor',
      material: 'Natural Bamboo & Cane',
      making_time_days: 2,
      raw_material_cost: 350,
      labour_cost: 300,
      suggested_price: 949,
      selling_price: 949,
      dimensions: '14" Diameter x 10" Height',
      readiness_score: 91
    });
    setIsLiveDemoOpen(false);
    navigateTo('add_product');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-lg text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-stone-950 via-stone-900 to-indigo-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-black text-sm tracking-tight flex items-center space-x-1.5">
                <span>SIH Live Demo Walkthrough</span>
                <span className="text-[10px] bg-artisan-terracotta text-white px-2 py-0.5 rounded-full font-extrabold">
                  Scene {currentScene} / 8
                </span>
              </h3>
              <p className="text-[11px] text-stone-400 font-medium">
                "One Photo + One Voice → Complete Digital Business Listing"
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLiveDemoOpen(false)}
            className="p-1.5 rounded-full bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scene Navigation Bar */}
        <div className="flex items-center space-x-1 px-3 py-2 bg-stone-950 border-b border-stone-800 overflow-x-auto">
          {SCENES.map(s => (
            <button
              key={s.number}
              onClick={() => setCurrentScene(s.number)}
              className={`px-2.5 py-1 rounded-lg text-xs font-black shrink-0 transition-all ${
                currentScene === s.number
                  ? 'bg-amber-500 text-stone-950 shadow-md scale-105'
                  : currentScene > s.number
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                  : 'bg-stone-800/80 text-stone-400 hover:text-white'
              }`}
            >
              {s.number}. {s.title.split(':')[1] || s.title}
            </button>
          ))}
        </div>

        {/* Presenter Speech Script Prompt Box */}
        <div className="p-3 bg-amber-500/10 border-b border-amber-500/20 text-amber-200 text-xs flex items-start space-x-2.5">
          <Volume2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="flex-1">
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">
              What to say to Judges:
            </span>
            <p className="italic font-medium text-[11px] leading-relaxed mt-0.5">
              {currentSceneData.presenterSays}
            </p>
          </div>
          <button
            onClick={() => speak(currentSceneData.presenterSays.replace(/"/g, ''))}
            className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 rounded-lg text-[10px] font-bold shrink-0 border border-amber-500/30"
            title="Listen aloud"
          >
            Audio 🔊
          </button>
        </div>

        {/* Interactive Visual Canvas for the Current Scene */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 bg-stone-900 text-stone-900">
          {/* Scene 1: Ordinary Photo */}
          {currentScene === 1 && (
            <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-red-600 uppercase tracking-wider flex items-center space-x-1">
                  <span>📱 Raw Phone Photo (The Problem)</span>
                </span>
                <span className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-bold border border-red-200">
                  Unprocessed
                </span>
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-stone-300">
                <img src={messyPhoto} alt="Cluttered" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                  <span className="text-xs font-bold">⚠️ Domestic Room Background</span>
                  <span className="text-[10px] text-stone-300">Cluttered walls, clothing, shadows & poor contrast</span>
                </div>
              </div>
              <QualityCheckerCard
                alerts={INITIAL_QUALITY_ALERTS}
                isEnhanced={false}
                onAutoFix={() => setCurrentScene(3)}
              />
            </div>
          )}

          {/* Scene 2: 1-Tap Photo Capture */}
          {currentScene === 2 && (
            <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-md space-y-3 text-center">
              <div className="w-14 h-14 rounded-full bg-artisan-terracotta text-white mx-auto flex items-center justify-center shadow-lg animate-bounce">
                <Camera className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h4 className="font-black text-stone-900 text-base">Step 1: Snap One Photo</h4>
              <p className="text-xs text-stone-600 font-medium max-w-xs mx-auto">
                The artisan opens the camera or selects a photo. AI instantly handles segmentation, background extraction, and lighting balance.
              </p>
              <button
                onClick={() => setCurrentScene(3)}
                className="w-full py-3 rounded-2xl bg-artisan-terracotta text-white font-black text-xs shadow-md"
              >
                Send to AI Studio ➔
              </button>
            </div>
          )}

          {/* Scene 3: AI Image Studio */}
          {currentScene === 3 && (
            <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-700 uppercase tracking-wider flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Studio Before & After Comparison</span>
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                  Segmented & Balanced
                </span>
              </div>
              <BeforeAfterSlider
                beforeImage={messyPhoto}
                afterImage={studioPhoto}
                beforeLabel="Ordinary Photo"
                afterLabel="AI Studio Shot"
              />
              <QualityCheckerCard
                alerts={[]}
                isEnhanced={true}
                onAutoFix={() => {}}
              />
            </div>
          )}

          {/* Scene 4: Regional Voice Input */}
          {currentScene === 4 && (
            <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-indigo-700 uppercase tracking-wider flex items-center space-x-1">
                  <Mic className="w-3.5 h-3.5" />
                  <span>Voice-to-Catalog Multilingual NLP</span>
                </span>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold border border-indigo-200">
                  Hindi & English
                </span>
              </div>

              {/* Spoken Voice Bubble */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <span className="text-[10px] font-black uppercase text-stone-500">
                  Artisan Spoke in Hindi:
                </span>
                <p className="text-xs font-bold text-stone-900 italic">
                  "यह टोकरी प्राकृतिक बांस से बनी है। यह पूरी तरह से हस्तनिर्मित है और इसे बनाने में दो दिन का समय लगता है। इसका उपयोग कपड़े और घरेलू सामान रखने के लिए किया जा सकता है।"
                </p>
              </div>

              {/* Structured Output Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100">
                  <span className="text-[9px] font-extrabold uppercase text-indigo-700 block">Product Name</span>
                  <span className="font-black text-stone-900 text-xs">Handcrafted Bamboo Storage Basket</span>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100">
                  <span className="text-[9px] font-extrabold uppercase text-indigo-700 block">Category</span>
                  <span className="font-black text-stone-900 text-xs">Home & Decor → Storage</span>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100">
                  <span className="text-[9px] font-extrabold uppercase text-indigo-700 block">Material</span>
                  <span className="font-black text-stone-900 text-xs">Natural Seasoned Bamboo & Cane</span>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100">
                  <span className="text-[9px] font-extrabold uppercase text-indigo-700 block">Manufacturing</span>
                  <span className="font-black text-stone-900 text-xs">100% Traditional Handwoven</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                <span className="text-[9px] font-extrabold uppercase text-stone-500 block">Generated Keywords</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {['bamboo basket', 'handmade basket', 'eco-friendly storage', 'traditional handicraft', 'home decor'].map(k => (
                    <span key={k} className="text-[10px] bg-white border border-stone-200 px-2 py-0.5 rounded-md font-bold text-stone-700">
                      #{k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Scene 5: Pricing AI */}
          {currentScene === 5 && (
            <div className="space-y-3">
              <PricingCalculatorCard
                pricing={pricingData}
                selectedPrice={949}
                onSelectPrice={() => {}}
              />
            </div>
          )}

          {/* Scene 6: Product Readiness */}
          {currentScene === 6 && (
            <div className="space-y-3">
              <ProductReadinessMeter
                score={91}
                hasPhoto={true}
                isEnhanced={true}
                hasTitle={true}
                hasDescription={true}
                hasMaterial={true}
                hasPrice={true}
                hasDimensions={false}
                hasCategory={true}
                onAddDimensions={() => {}}
              />
            </div>
          )}

          {/* Scene 7: Direct B2B Market Matching */}
          {currentScene === 7 && (
            <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-stone-900 uppercase tracking-wider block">
                    B2B Direct Market Linkage
                  </span>
                  <p className="text-[11px] text-stone-500 font-medium">
                    3 verified buyers matched for Handcrafted Bamboo Basket
                  </p>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-black px-2.5 py-1 rounded-full">
                  Zero Middlemen
                </span>
              </div>

              <div className="space-y-2.5">
                {BAMBOO_B2B_MATCHES.map(m => (
                  <div key={m.id} className="p-3 rounded-2xl border border-stone-200 bg-stone-50 space-y-1.5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-extrabold text-stone-900 text-xs">{m.company_name}</h5>
                        <span className="text-[10px] text-stone-500 font-medium">{m.buyer_type} • {m.location}</span>
                      </div>
                      <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                        m.match_score >= 90 ? 'bg-emerald-100 text-emerald-900 font-extrabold' : 'bg-amber-100 text-amber-900 font-extrabold'
                      }`}>
                        {m.match_score}% Match
                      </span>
                    </div>

                    <div className="text-[11px] text-stone-700 font-medium">
                      🎯 Minimum Order: <strong className="text-stone-900">{m.minimum_order_qty} units</strong> • Target Price: <strong className="text-stone-900">₹{m.target_price_per_unit} / pc</strong>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={() => {
                          playChime('success');
                          speak(`Wholesale proposal sent to ${m.company_name}.`);
                        }}
                        className="w-full py-1.5 px-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-[10px] font-black"
                      >
                        Submit Wholesale Proposal (₹949/unit)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scene 8: Complete Digital Catalog */}
          {currentScene === 8 && (
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-md space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <div>
                <h4 className="font-black text-stone-900 text-lg leading-tight">
                  Digital Listing Complete & Market-Ready!
                </h4>
                <p className="text-xs text-stone-600 font-medium mt-1">
                  "One Photo + One Voice → Complete Digital Business Listing"
                </p>
              </div>

              {/* Product Digital Card */}
              <div className="border border-stone-200 rounded-2xl p-3 bg-stone-50 text-left flex items-center space-x-3">
                <img src={studioPhoto} alt="Product" className="w-20 h-20 rounded-xl object-cover border border-stone-200" />
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-extrabold uppercase text-emerald-700">Live on ONDC & GeM</span>
                  <h5 className="font-black text-xs text-stone-900 truncate">Handcrafted Bamboo Storage Basket</h5>
                  <span className="text-sm font-black text-artisan-terracotta block mt-0.5">₹949</span>
                  <span className="text-[10px] text-stone-500">Readiness: 91/100 • 3 B2B Leads</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    confetti({ particleCount: 100, spread: 70 });
                    playChime('success');
                  }}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-sm flex items-center justify-center space-x-1"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp Catalog</span>
                </button>

                <button
                  onClick={loadIntoWizard}
                  className="py-2.5 px-3 rounded-xl bg-artisan-terracotta text-white font-extrabold text-xs shadow-sm flex items-center justify-center space-x-1"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Open in App Wizard</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-3.5 bg-stone-950 border-t border-stone-800 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentScene === 1}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center space-x-1 ${
              currentScene === 1 ? 'text-stone-600 cursor-not-allowed' : 'text-stone-300 hover:text-white bg-stone-800'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev Scene</span>
          </button>

          <button
            onClick={loadIntoWizard}
            className="text-[11px] font-bold text-amber-400 hover:underline"
          >
            Open in App Wizard
          </button>

          <button
            onClick={handleNext}
            className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center space-x-1 shadow-md active:scale-95 transition-transform"
          >
            <span>{currentScene === 8 ? 'Finish Demo 🎉' : 'Next Scene'}</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
