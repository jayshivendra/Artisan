import React, { useState, useEffect } from 'react';
import { useVoice } from '../../context/VoiceContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useAppState } from '../../context/AppStateContext.js';
import { Mic, X, Sparkles, ArrowRight, Volume2, VolumeX, CheckCircle2, ShoppingCart, ShoppingBag, Camera, Users, TrendingUp, Package, Tag, Award, Heart, Truck, Store } from 'lucide-react';
import { LanguageCode } from '../../types/index.js';

export const VoiceAssistantModal: React.FC = () => {
  const {
    isAssistantModalOpen,
    setIsAssistantModalOpen,
    isListening,
    startListening,
    stopListening,
    transcript,
    speak,
    playChime,
    isVoiceEnabled,
    setIsVoiceEnabled,
    toggleVoice
  } = useVoice();
  const { language, setLanguage, currentLanguageOption } = useLanguage();
  const { 
    navigateTo, 
    resetProductDraft, 
    setIsLiveDemoOpen, 
    userRole, 
    setUserRole, 
    cart, 
    orders, 
    wishlist 
  } = useAppState();

  const [assistantText, setAssistantText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [actionExecutedBadge, setActionExecutedBadge] = useState<string | null>(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState<'buyer' | 'artisan'>('buyer');

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (isAssistantModalOpen) {
      setActionExecutedBadge(null);
      const greetings: Record<string, string> = {
        te: 'నమస్కారం! నేను మీ AI అసిస్టెంట్‌ని. మీరు ఏమి చేయాలనుకుంటున్నారు? "వస్తువులు కొనాలి", "కార్ట్ చూడాలి", "అమ్మడానికి ఫోటో తీయి", లేదా "హోల్‌సేల్ కొనుగోలుదారులు" అని నాతో చెప్పండి.',
        hi: 'नमस्ते! मैं आपका AI सहायक हूँ। आप मुझसे कुछ भी कह सकते हैं: "सामान खरीदना है", "कार्ट विकल्प देखना है", "बेचने के लिए फोटो खींचें", या "थोक खरीदार खोजें"।',
        ta: 'வணக்கம்! நான் உங்கள் AI உதவியாளர். "பொருட்களை வாங்க", "கார்ட் விருப்பங்களை பார்க்க", "விற்பனைக்கு படம் எடுக்க" அல்லது "மொத்த வாங்குவோர்" என்று சொல்லுங்கள்.',
        kn: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ಸಹಾಯಕ. "ವಸ್ತುಗಳನ್ನು ಖರೀದಿಸಲು", "ಕಾರ್ಟ್ ಆಯ್ಕೆಗಳನ್ನು ವೀಕ್ಷಿಸಲು", "ಮಾರಾಟ ಮಾಡಲು ಫೋಟೋ ತೆಗೆಯಿರಿ" ಎಂದು ಹೇಳಿ.',
        bn: 'নমস্কার! আমি আপনার AI সহকারী। "পণ্য কিনতে চাই", "কার্ট বিকল্প দেখতে চাই", বা "বিক্রির জন্য ছবি তুলুন" বলুন।',
        mr: 'नमस्कार! मी आपला AI सहाय्यक आहे. "वस्तू खरेदी करायच्या आहेत", "कार्ट पर्याय पाहायचे आहेत", किंवा "विक्रीसाठी फोटो काढा" बोला.',
        gu: 'નમસ્તે! હું તમારો AI સહાયક છું. "પ્રોડક્ટ ખરીદવી છે", "કાર્ટ વિકલ્પો જોવા છે", અથવા "વેચવા માટે ફોટો લો" કહો.',
        ml: 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ AI സഹായിയാണ്. "ഉൽപ്പന്നങ്ങൾ വാങ്ങണം", "കാർട്ട് കാണണം", അല്ലെങ്കിൽ "വിൽക്കാൻ ഫോട്ടോ എടുക്കൂ" എന്ന് പറയുക.',
        pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ AI ਸਹਾਇਕ ਹਾਂ। "ਉਤਪਾਦ ਖਰੀਦਣਾ ਹੈ", "ਕਾਰਟ ਵੇਖਣਾ ਹੈ", ਜਾਂ "ਵੇਚਣ ਲਈ ਫੋਟੋ ਲਓ" ਬੋਲੋ।',
        en: "Namaste! I'm your universal AI Assistant. Say: 'Want to buy a product', 'To see the cart options', 'Take photo to sell', or 'Find wholesale buyers'."
      };
      setAssistantText(greetings[language] || greetings.en);
    }
  }, [isAssistantModalOpen, language]);

  if (!isAssistantModalOpen) return null;

  const executeAction = (queryRaw: string) => {
    setIsProcessing(true);
    const query = queryRaw.toLowerCase().trim();

    // =========================================================================
    // 1. BUYER INTENT: VIEW CART / CART OPTIONS / CHECKOUT
    // =========================================================================
    if (
      query.includes('cart') || 
      query.includes('basket') || 
      query.includes('checkout') || 
      query.includes('bag') ||
      query.includes('कार्ट') || 
      query.includes('टोकरी') ||
      query.includes('కార్ట్') || 
      query.includes('బుట్ట') ||
      query.includes('கார்ட்') ||
      query.includes('வண்டி') ||
      query.includes('ಕಾರ್ಟ್')
    ) {
      const resp: Record<string, string> = {
        te: `మీ షాపింగ్ కార్ట్‌ను చూపిస్తున్నాను! మీ వద్ద ${cartCount} వస్తువులు ఉన్నాయి. మీరు ఇక్కడి నుండి చెక్అవుట్ చేయవచ్చు.`,
        hi: `आपकी शॉपिंग कार्ट खोल रहे हैं! आपके कार्ट में ${cartCount} हस्तशिल्प उत्पाद हैं। आप यहाँ से चेकआउट कर सकते हैं।`,
        ta: `உங்கள் ஷாப்பிங் கார்ட் திறக்கப்படுகிறது! உங்களிடம் ${cartCount} பொருட்கள் உள்ளன.`,
        en: `Opening your Shopping Cart options! You have ${cartCount} handcrafted items ready for review and checkout.`
      };
      const textToSpeak = resp[language] || resp.en;
      setAssistantText(textToSpeak);
      setActionExecutedBadge('Opening Shopping Cart Options...');
      playChime('success');
      speak(textToSpeak, currentLanguageOption.voiceLang);

      setTimeout(() => {
        setIsProcessing(false);
        setIsAssistantModalOpen(false);
        setUserRole('buyer');
        navigateTo('buyer_cart');
      }, 1400);
      return;
    }

    // =========================================================================
    // 2. BUYER INTENT: WANT TO BUY A PRODUCT / SHOP / MARKETPLACE / SEARCH
    // =========================================================================
    if (
      query.includes('buy') || 
      query.includes('purchase') || 
      query.includes('shop') || 
      query.includes('shopping') || 
      query.includes('marketplace') || 
      query.includes('store') ||
      query.includes('browse') || 
      query.includes('customer') ||
      query.includes('खरीद') || 
      query.includes('खरीदना') || 
      query.includes('షాపింగ్') || 
      query.includes('కొనాలి') || 
      query.includes('కొనుగోలు చేయాలి') ||
      query.includes('வாங்கு') ||
      query.includes('ಖರೀದಿ')
    ) {
      const resp: Record<string, string> = {
        te: 'హస్తకళల మార్కెట్‌ప్లేస్‌ను తెరుస్తున్నాము! పట్టు చీరలు, మట్టి పాత్రలు, చెక్క శిల్పాలు మరియు కళాఖండాలను కళాకారుల నుండి నేరుగా కొనండి.',
        hi: 'हस्तशिल्प मार्केटप्लेस खोल रहे हैं! भारत भर के कुशल कारीगरों से सीधे प्रामाणिक सिल्क साड़ियां, मिट्टी के बर्तन और नक्काशीदार उत्पाद खरीदें।',
        ta: 'கைவினைப் பொருட்கள் அங்காடி திறக்கப்படுகிறது! உண்மையான கைவினைப் பொருட்களை நேரடியாக வாங்குங்கள்.',
        en: 'Opening Artisan Marketplace! Browse authentic handloom sarees, terracotta pottery, carved woodwork, and tribal brass crafts directly from master makers.'
      };
      const textToSpeak = resp[language] || resp.en;
      setAssistantText(textToSpeak);
      setActionExecutedBadge('Opening Artisan Marketplace to Buy...');
      playChime('success');
      speak(textToSpeak, currentLanguageOption.voiceLang);

      setTimeout(() => {
        setIsProcessing(false);
        setIsAssistantModalOpen(false);
        setUserRole('buyer');
        navigateTo('buyer_marketplace');
      }, 1400);
      return;
    }

    // =========================================================================
    // 3. BUYER INTENT: WISHLIST / SAVED ITEMS / FAVORITES
    // =========================================================================
    if (
      query.includes('wishlist') || 
      query.includes('favorite') || 
      query.includes('saved') || 
      query.includes('पसंद') || 
      query.includes('इच्छा सूची') || 
      query.includes('విష్‌లిస్ట్') ||
      query.includes('விருப்பப்பட்டியல்')
    ) {
      const textToSpeak = 'Opening your Saved Wishlist! Here are the handicrafts you liked.';
      setAssistantText(textToSpeak);
      setActionExecutedBadge('Opening Saved Wishlist...');
      playChime('success');
      speak(textToSpeak, currentLanguageOption.voiceLang);

      setTimeout(() => {
        setIsProcessing(false);
        setIsAssistantModalOpen(false);
        setUserRole('buyer');
        navigateTo('buyer_wishlist');
      }, 1400);
      return;
    }

    // =========================================================================
    // 4. BUYER INTENT: MY PURCHASES / TRACK SHIPMENT
    // =========================================================================
    if (
      query.includes('my purchase') || 
      query.includes('bought') || 
      query.includes('track') || 
      query.includes('buyer order') ||
      query.includes('खरीदे गए') || 
      query.includes('నా కొనుగోళ్లు')
    ) {
      const textToSpeak = 'Opening your Purchases! Track delivery and view invoice details.';
      setAssistantText(textToSpeak);
      setActionExecutedBadge('Tracking Your Purchases...');
      playChime('success');
      speak(textToSpeak, currentLanguageOption.voiceLang);

      setTimeout(() => {
        setIsProcessing(false);
        setIsAssistantModalOpen(false);
        setUserRole('buyer');
        navigateTo('buyer_orders');
      }, 1400);
      return;
    }

    // =========================================================================
    // 5. ARTISAN INTENT: SELL / ADD PRODUCT / TAKE PHOTO / CAMERA
    // =========================================================================
    if (
      query.includes('sell') || 
      query.includes('add product') || 
      query.includes('new product') || 
      query.includes('camera') || 
      query.includes('photo') || 
      query.includes('picture') || 
      query.includes('snap') || 
      query.includes('shoot') ||
      query.includes('upload') ||
      query.includes('बेच') || 
      query.includes('बेचना') || 
      query.includes('नया उत्पाद') || 
      query.includes('फोटो खींचो') ||
      query.includes('ఫోటో తీయి') || 
      query.includes('అమ్మాలి') || 
      query.includes('కొత్త వస్తువు') ||
      query.includes('விற்பனைக்கு படம்')
    ) {
      const resp: Record<string, string> = {
        te: 'ఉత్పత్తిని జోడించడానికి కెమెరా తెరుస్తున్నాము! మీ చేతికళ ఫోటో తీయండి. AI స్వయంగా బ్యాక్‌గ్రౌండ్ తీసివేస్తుంది.',
        hi: 'नया उत्पाद जोड़ने के लिए कैमरा खोल रहे हैं! अपने हस्तशिल्प की एक फोटो खींचें। AI बैकग्राउंड साफ करके कैटलॉग बना देगा।',
        ta: 'கேமரா திறக்கப்படுகிறது! தயாரிப்பின் புகைப்படம் எடுக்கவும்.',
        en: 'Opening camera to add product! Take ONE photo of your craft. AI will studio-enhance it and generate your bilingual catalog.'
      };
      const textToSpeak = resp[language] || resp.en;
      setAssistantText(textToSpeak);
      setActionExecutedBadge('Opening Add Product Camera...');
      playChime('success');
      speak(textToSpeak, currentLanguageOption.voiceLang);

      setTimeout(() => {
        setIsProcessing(false);
        setIsAssistantModalOpen(false);
        setUserRole('seller');
        resetProductDraft();
        navigateTo('add_product');
      }, 1400);
      return;
    }

    // =========================================================================
    // 6. ARTISAN INTENT: FIND WHOLESALE BUYERS / B2B BULK MATCHING
    // =========================================================================
    if (
      query.includes('buyer') || 
      query.includes('wholesale') || 
      query.includes('b2b') || 
      query.includes('bulk') || 
      query.includes('retailer') ||
      query.includes('hotel') ||
      query.includes('खरीदार') || 
      query.includes('थोक') || 
      query.includes('होलसेल') ||
      query.includes('కొనుగోలు') || 
      query.includes('హోల్‌సేల్') || 
      query.includes('బయ్యర్స్') ||
      query.includes('வாங்குவோர்') ||
      query.includes('ಖರೀದಿದಾರ')
    ) {
      const resp: Record<string, string> = {
        te: 'హోల్‌సేల్ కొనుగోలుదారుల పేజీకి తీసుకెళ్తున్నాము. 17 మంది పెద్ద కొనుగోలుదారులు సిద్ధంగా ఉన్నారు!',
        hi: 'थोक खरीदारों का पेज खोल रहे हैं। 17 सत्यापित बल्क खरीदार तैयार हैं!',
        ta: 'மொத்த வாங்குவோர் பக்கம் திறக்கப்படுகிறது. 17 வாங்குவோர் தயாராக உள்ளனர்!',
        en: 'Opening Wholesale Buyers page! 17 verified bulk buyers ready to order.'
      };
      const textToSpeak = resp[language] || resp.en;
      setAssistantText(textToSpeak);
      setActionExecutedBadge('Navigating to B2B Buyers...');
      playChime('success');
      speak(textToSpeak, currentLanguageOption.voiceLang);

      setTimeout(() => {
        setIsProcessing(false);
        setIsAssistantModalOpen(false);
        setUserRole('seller');
        navigateTo('find_buyers');
      }, 1400);
      return;
    }

    // =========================================================================
    // 7. ARTISAN INTENT: MY PRODUCTS / CATALOG / INVENTORY
    // =========================================================================
    if (
      query.includes('my product') || 
      query.includes('catalog') || 
      query.includes('inventory') || 
      query.includes('stock') ||
      query.includes('मेरे उत्पाद') || 
      query.includes('कैटलॉग') ||
      query.includes('నా వస్తువులు') || 
      query.includes('నా ఉత్పత్తులు') ||
      query.includes('தயாரிப்புகள்')
    ) {
      const resp: Record<string, string> = {
        te: 'మీ ఉత్పత్తుల జాబితాను చూపిస్తున్నాము. మీ వద్ద 24 ఉత్పత్తులు లైవ్ ఉన్నాయి.',
        hi: 'आपके सभी उत्पादों की सूची दिखा रहे हैं। आपके 24 उत्पाद लाइव हैं।',
        en: 'Showing your product catalog! You have 24 live products across your stores.'
      };
      const textToSpeak = resp[language] || resp.en;
      setAssistantText(textToSpeak);
      setActionExecutedBadge('Opening My Products Catalog...');
      playChime('success');
      speak(textToSpeak, currentLanguageOption.voiceLang);

      setTimeout(() => {
        setIsProcessing(false);
        setIsAssistantModalOpen(false);
        setUserRole('seller');
        navigateTo('my_products');
      }, 1400);
      return;
    }

    // =========================================================================
    // 8. ARTISAN INTENT: ORDERS & DISPATCH
    // =========================================================================
    if (
      query.includes('order') || 
      query.includes('dispatch') || 
      query.includes('shipping') || 
      query.includes('courier') ||
      query.includes('ऑर्डर') || 
      query.includes('डिलीवरी') ||
      query.includes('ఆర్డర్') || 
      query.includes('డెలివరీ') ||
      query.includes('ஆர்டர்')
    ) {
      const resp: Record<string, string> = {
        te: 'మీ కస్టమర్ ఆర్డర్‌లను చూపిస్తున్నాము. 8 ఆర్డర్‌లు పూర్తయ్యాయి.',
        hi: 'आपके ग्राहक ऑर्डर खोल रहे हैं। 8 ऑर्डर सफलतापूर्वक पूरे हुए हैं।',
        en: 'Opening your Orders! You have completed 8 customer orders.'
      };
      const textToSpeak = resp[language] || resp.en;
      setAssistantText(textToSpeak);
      setActionExecutedBadge('Opening Customer Orders...');
      playChime('success');
      speak(textToSpeak, currentLanguageOption.voiceLang);

      setTimeout(() => {
        setIsProcessing(false);
        setIsAssistantModalOpen(false);
        setUserRole('seller');
        navigateTo('orders');
      }, 1400);
      return;
    }

    // =========================================================================
    // 9. ARTISAN INTENT: SALES & REVENUE & EARNINGS
    // =========================================================================
    if (
      query.includes('sale') || 
      query.includes('sales') || 
      query.includes('revenue') || 
      query.includes('income') || 
      query.includes('earning') || 
      query.includes('profit') ||
      query.includes('money') ||
      query.includes('कमाई') || 
      query.includes('बिक्री') || 
      query.includes('रुपये') ||
      query.includes('సేల్స్') || 
      query.includes('ఆదాయం') || 
      query.includes('డబ్బులు')
    ) {
      const resp: Record<string, string> = {
        te: 'మీ మొత్తం ఆదాయం ₹24,500. సేల్స్ అనలిటిక్స్ తెరుస్తున్నాము.',
        hi: 'आपकी कुल कमाई ₹24,500 है। बिक्री विश्लेषण खोल रहे हैं।',
        en: 'Your total revenue is ₹24,500 with a 32% increase this month. Opening Sales Dashboard.'
      };
      const textToSpeak = resp[language] || resp.en;
      setAssistantText(textToSpeak);
      setActionExecutedBadge('Opening Sales Analytics...');
      playChime('success');
      speak(textToSpeak, currentLanguageOption.voiceLang);

      setTimeout(() => {
        setIsProcessing(false);
        setIsAssistantModalOpen(false);
        setUserRole('seller');
        navigateTo('sales_dashboard');
      }, 1400);
      return;
    }

    // =========================================================================
    // 10. GOVERNMENT GeM / ONDC MARKETPLACE
    // =========================================================================
    if (
      query.includes('gem') || 
      query.includes('ondc') || 
      query.includes('government') || 
      query.includes('portal') ||
      query.includes('सरकारी') || 
      query.includes('ప్రభుత్వ')
    ) {
      const textToSpeak = 'Opening Government GeM and ONDC Marketplace Hub!';
      setAssistantText(textToSpeak);
      setActionExecutedBadge('Opening Government GeM / ONDC Hub...');
      playChime('success');
      speak(textToSpeak, 'en-IN');

      setTimeout(() => {
        setIsProcessing(false);
        setIsAssistantModalOpen(false);
        setUserRole('seller');
        navigateTo('gov_marketplace');
      }, 1400);
      return;
    }

    // =========================================================================
    // 11. PROFILE / STORE SETTINGS / BANK DETAILS
    // =========================================================================
    if (
      query.includes('profile') || 
      query.includes('setting') || 
      query.includes('bank') || 
      query.includes('account') ||
      query.includes('प्रोफाइल') || 
      query.includes('खाता') || 
      query.includes('ప్రొఫైల్') || 
      query.includes('బ్యాంక్')
    ) {
      const textToSpeak = 'Opening your Profile and Store Settings.';
      setAssistantText(textToSpeak);
      setActionExecutedBadge('Opening Profile Settings...');
      playChime('success');
      speak(textToSpeak, currentLanguageOption.voiceLang);

      setTimeout(() => {
        setIsProcessing(false);
        setIsAssistantModalOpen(false);
        navigateTo('edit_profile');
      }, 1400);
      return;
    }

    // =========================================================================
    // 12. HELP / TUTORIALS / VIDEO GUIDES
    // =========================================================================
    if (
      query.includes('help') || 
      query.includes('tutorial') || 
      query.includes('guide') || 
      query.includes('how to use') ||
      query.includes('मदद') || 
      query.includes('सहायता') || 
      query.includes('సహాయం')
    ) {
      const textToSpeak = 'Opening Step-by-Step Video Tutorials and Help Guides.';
      setAssistantText(textToSpeak);
      setActionExecutedBadge('Opening Help & Tutorials...');
      playChime('success');
      speak(textToSpeak, currentLanguageOption.voiceLang);

      setTimeout(() => {
        setIsProcessing(false);
        setIsAssistantModalOpen(false);
        navigateTo('help_tutorials');
      }, 1400);
      return;
    }

    // =========================================================================
    // 13. SIH JUDGE LIVE DEMO
    // =========================================================================
    if (
      query.includes('demo') || 
      query.includes('judge') || 
      query.includes('sih') || 
      query.includes('presentation') ||
      query.includes('डेमो')
    ) {
      const textToSpeak = 'Launching the 8-Scene SIH Live Judge Demo Walkthrough!';
      setAssistantText(textToSpeak);
      setActionExecutedBadge('Launching SIH Judge Demo...');
      playChime('success');
      speak(textToSpeak, 'en-IN');

      setTimeout(() => {
        setIsProcessing(false);
        setIsAssistantModalOpen(false);
        setIsLiveDemoOpen(true);
      }, 1200);
      return;
    }

    // =========================================================================
    // 14. CHANGE LANGUAGE COMMANDS
    // =========================================================================
    if (query.includes('telugu') || query.includes('తెలుగు')) {
      setLanguage('te');
      const textToSpeak = 'భాష తెలుగుగా మార్చబడింది. నేను మీకు ఎలా సహాయపడగలను?';
      setAssistantText(textToSpeak);
      playChime('success');
      speak(textToSpeak, 'te-IN');
      setIsProcessing(false);
      return;
    }
    if (query.includes('hindi') || query.includes('हिन्दी') || query.includes('हिंदी')) {
      setLanguage('hi');
      const textToSpeak = 'भाषा हिंदी में बदल दी गई है। मैं आपकी क्या मदद कर सकता हूँ?';
      setAssistantText(textToSpeak);
      playChime('success');
      speak(textToSpeak, 'hi-IN');
      setIsProcessing(false);
      return;
    }
    if (query.includes('tamil') || query.includes('தமிழ்')) {
      setLanguage('ta');
      const textToSpeak = 'மொழி தமிழில் மாற்றப்பட்டது. நான் உங்களுக்கு எப்படி உதவ முடியும்?';
      setAssistantText(textToSpeak);
      playChime('success');
      speak(textToSpeak, 'ta-IN');
      setIsProcessing(false);
      return;
    }
    if (query.includes('english')) {
      setLanguage('en');
      const textToSpeak = 'Language changed to English. How can I assist you?';
      setAssistantText(textToSpeak);
      playChime('success');
      speak(textToSpeak, 'en-IN');
      setIsProcessing(false);
      return;
    }

    // =========================================================================
    // 15. PRICING ASSISTANCE / QUESTIONS
    // =========================================================================
    if (
      query.includes('price') || 
      query.includes('cost') || 
      query.includes('rate') ||
      query.includes('दाम') || 
      query.includes('कीमत') ||
      query.includes('ధర') || 
      query.includes('ఖరీదు')
    ) {
      const resp: Record<string, string> = {
        te: 'AI న్యాయమైన ధరను గణిస్తుంది: ముడిసరుకు ₹350 + 2 రోజుల శ్రమ కూలీ ₹300 + ప్యాకేజింగ్ ₹50 = బేస్ ఖర్చు ₹800. సిఫార్సు చేసిన అమ్మకపు ధర ₹899 నుండి ₹999.',
        hi: 'AI पारदर्शी उचित मूल्य तय करता है: कच्चा माल ₹350 + 2 दिन की कारीगरी मजदूरी ₹300 + पैकेजिंग ₹50 = मूल लागत ₹800। अनुशंसित विक्रय मूल्य ₹899 से ₹999 है।',
        en: 'AI calculates transparent fair pricing: Raw material cost + artisan days of labour + packaging = Base cost. Suggested selling price ensures artisans keep 100% of their margin.'
      };
      const textToSpeak = resp[language] || resp.en;
      setAssistantText(textToSpeak);
      playChime('success');
      speak(textToSpeak, currentLanguageOption.voiceLang);
      setIsProcessing(false);
      return;
    }

    // =========================================================================
    // 16. VOICE INSTRUCTOR ENABLE / DISABLE
    // =========================================================================
    if (
      query.includes('disable voice') || 
      query.includes('turn off voice') || 
      query.includes('mute voice') || 
      query.includes('stop voice') || 
      query.includes('silent') ||
      query.includes('आवाज़ बंद') || 
      query.includes('वॉयस बंद') ||
      query.includes('వాయిస్ ఆపు') ||
      query.includes('వాయిస్ ఆఫ్')
    ) {
      setIsVoiceEnabled(false);
      const textToSpeak = 'Voice instructor and audio guidance have been disabled (Silent Mode).';
      setAssistantText(textToSpeak);
      setActionExecutedBadge('Voice Guide Disabled 🔇');
      setIsProcessing(false);
      return;
    }

    if (
      query.includes('enable voice') || 
      query.includes('turn on voice') || 
      query.includes('start voice') || 
      query.includes('unmute') ||
      query.includes('आवाज़ चालू') || 
      query.includes('वॉयस चालू') ||
      query.includes('వాయిస్ ఆన్')
    ) {
      setIsVoiceEnabled(true);
      const textToSpeak = 'Voice instructor and audio guidance are now enabled!';
      setAssistantText(textToSpeak);
      setActionExecutedBadge('Voice Guide Enabled 🔊');
      playChime('success');
      speak(textToSpeak, currentLanguageOption.voiceLang, true);
      setIsProcessing(false);
      return;
    }

    // =========================================================================
    // 17. GENERAL CONVERSATIONAL AI INTELLIGENCE
    // =========================================================================
    const fallbackResp: Record<string, string> = {
      te: 'నేను మీ కార్ట్ చూపించగలను, వస్తువులు కొనడానికి మార్కెట్‌ప్లేస్ తెరవగలను, లేదా ఫోటో తీసి అమ్మడానికి సహాయం చేయగలను. మీరు ఏమి చేయాలనుకుంటున్నారు?',
      hi: 'मैं आपकी शॉपिंग कार्ट दिखा सकता हूँ, उत्पाद खरीदने के लिए बाज़ार खोल सकता हूँ, या बेचने के लिए फोटो खींच सकता हूँ। आप क्या करना चाहते हैं?',
      ta: 'நான் உங்கள் கார்ட்டைக் காட்டலாம், பொருட்களை வாங்கலாம், அல்லது விற்பனைக்கு படம் எடுக்கலாம். உங்களுக்கு என்ன வேண்டும்?',
      en: "I can open your Cart options, take you to the Marketplace to buy crafts, open the Camera to sell products, or find wholesale buyers. What would you like to do?"
    };
    const textToSpeak = fallbackResp[language] || fallbackResp.en;
    setAssistantText(textToSpeak);
    speak(textToSpeak, currentLanguageOption.voiceLang);
    setIsProcessing(false);
  };

  const handleStartVoice = () => {
    startListening((resultText: string) => {
      executeAction(resultText);
    });
  };

  // Curated 1-Tap commands for both Buyer & Artisan roles
  const buyerCommands = [
    { label: '🛒 View my cart options', query: 'to see the cart options', icon: ShoppingCart },
    { label: '🛍️ Want to buy a product', query: 'want to buy a product', icon: ShoppingBag },
    { label: '❤️ View saved wishlist', query: 'view my wishlist', icon: Heart },
    { label: '📦 Track my purchases', query: 'track my purchases', icon: Truck },
    { 
      label: isVoiceEnabled ? '🔇 Turn Voice Guide Off' : '🔊 Turn Voice Guide On', 
      query: isVoiceEnabled ? 'disable voice' : 'enable voice', 
      icon: isVoiceEnabled ? VolumeX : Volume2 
    },
  ];

  const artisanCommands = [
    { label: '📸 Take photo to sell product', query: 'take photo to sell a product', icon: Camera },
    { label: '🤝 Find bulk wholesale buyers', query: 'find bulk wholesale buyers', icon: Users },
    { label: '💰 Check my sales & revenue', query: 'check my sales revenue', icon: TrendingUp },
    { label: '📦 Show my product catalog', query: 'show my products', icon: Package },
    { label: '🏷️ How does pricing AI work?', query: 'how does fair price work?', icon: Tag },
    { label: '🏆 Launch SIH Judge Demo', query: 'start live demo', icon: Award },
    { 
      label: isVoiceEnabled ? '🔇 Turn Voice Guide Off' : '🔊 Turn Voice Guide On', 
      query: isVoiceEnabled ? 'disable voice' : 'enable voice', 
      icon: isVoiceEnabled ? VolumeX : Volume2 
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col justify-end p-2 sm:p-4 animate-in fade-in duration-200 select-none">
      <div className="bg-white w-full rounded-3xl p-5 shadow-2xl flex flex-col max-h-[88vh] overflow-y-auto border border-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-artisan-indigo via-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-stone-900 text-base leading-tight">
                AI Voice & Action Assistant
              </h3>
              <p className="text-[11px] text-stone-500 font-bold">
                Speaks, Listens & Executes Anything in App
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Direct Voice Instructor Enable / Disable Toggle in Modal */}
            <button
              onClick={() => {
                playChime('tap');
                toggleVoice();
              }}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-black transition-all active:scale-95 shadow-sm ${
                isVoiceEnabled
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-stone-100 text-stone-600 border border-stone-300'
              }`}
              title={isVoiceEnabled ? 'Voice Instructor: ON (Tap to Disable / Mute)' : 'Voice Instructor: OFF (Tap to Enable Voice)'}
            >
              {isVoiceEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Voice ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-stone-500" />
                  <span>Voice OFF</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsAssistantModalOpen(false)}
              className="p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action badge if triggered */}
        {actionExecutedBadge && (
          <div className="mt-2.5 p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black flex items-center space-x-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionExecutedBadge}</span>
          </div>
        )}

        {/* AI Message Bubble */}
        <div className="bg-gradient-to-br from-indigo-50/90 to-blue-50/50 border border-indigo-100 rounded-2xl p-4 my-3 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="w-7 h-7 rounded-lg bg-artisan-indigo text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <Volume2 className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-artisan-indigo block">
                Assistant Response
              </span>
              <p className="text-sm font-black text-stone-900 mt-1 leading-relaxed">
                {assistantText}
              </p>
            </div>
          </div>
        </div>

        {/* Live Listening Waves */}
        {isListening && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 my-2 flex items-center justify-center space-x-2 text-amber-800 animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
            <span className="text-xs font-black">Listening to your voice... Speak now!</span>
          </div>
        )}

        {/* Spoken transcript if any */}
        {transcript && (
          <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 italic mb-2">
            "{transcript}"
          </div>
        )}

        {/* Prominent Microphone Trigger */}
        <div className="my-2">
          <button
            onClick={isListening ? stopListening : handleStartVoice}
            disabled={isProcessing}
            className={`w-full py-4 rounded-2xl font-black text-sm shadow-elevated flex items-center justify-center space-x-2.5 transition-all transform active:scale-95 ${
              isListening
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-gradient-to-r from-artisan-terracotta via-orange-500 to-amber-500 text-white hover:shadow-xl'
            }`}
          >
            <Mic className={`w-5 h-5 ${isListening ? 'animate-spin' : ''}`} />
            <span>{isListening ? 'Tap to Finish Speaking' : '🎙️ Speak Any Command (Tap & Talk)'}</span>
          </button>
        </div>

        {/* Role Category Tabs */}
        <div className="mt-3">
          <div className="flex items-center space-x-2 bg-stone-100 p-1 rounded-xl mb-2.5">
            <button
              onClick={() => setActiveCategoryTab('buyer')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
                activeCategoryTab === 'buyer'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>🛒 Buyer Commands</span>
            </button>
            <button
              onClick={() => setActiveCategoryTab('artisan')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
                activeCategoryTab === 'artisan'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>🎨 Artisan Commands</span>
            </button>
          </div>

          {/* 1-Tap Command Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(activeCategoryTab === 'buyer' ? buyerCommands : artisanCommands).map((cmd, idx) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={idx}
                  onClick={() => executeAction(cmd.query)}
                  className="text-left p-3 rounded-2xl bg-stone-50 hover:bg-amber-50/80 text-stone-800 hover:text-amber-950 font-black text-xs border border-stone-200 transition-colors flex items-center justify-between group active:scale-95"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-lg bg-stone-200/70 group-hover:bg-amber-200/80 flex items-center justify-center text-stone-700 group-hover:text-amber-900">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span>{cmd.label}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-700" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
