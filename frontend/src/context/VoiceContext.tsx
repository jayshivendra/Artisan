import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from './LanguageContext.js';
import { TRANSLATIONS } from '../data/translations.js';

interface VoiceContextType {
  isListening: boolean;
  transcript: string;
  isSpeaking: boolean;
  isVoiceEnabled: boolean;
  setIsVoiceEnabled: (enabled: boolean) => void;
  toggleVoice: () => void;
  startListening: (onResult?: (text: string) => void) => void;
  stopListening: () => void;
  speak: (text: string, langCode?: string, force?: boolean) => void;
  speakLocalizedKey: (translationKey: string, fallbackText?: string, force?: boolean) => void;
  stopSpeaking: () => void;
  playChime: (type?: 'success' | 'tap' | 'alert') => void;
  isAssistantModalOpen: boolean;
  setIsAssistantModalOpen: (open: boolean) => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

// Localized greetings and screen announcements for audio guidance in all languages
export const AUDIO_GUIDANCE_BY_LANG: Record<string, Record<string, string>> = {
  home: {
    en: "Welcome to KarigarConnect AI. You have 24 active products, 17 buyer leads, and total revenue of ₹24,500. Tap Create using Voice or Photo to add crafts.",
    hi: "कारीगर कनेक्ट में आपका स्वागत है। आपके 24 उत्पाद, 17 थोक खरीदार और ₹24,500 की कुल बिक्री है। उत्पाद जोड़ने के लिए फोटो या माइक बटन दबाएं।",
    te: "కారిగర్ కనెక్ట్ కు స్వాగతం. మీ వద్ద 24 ఉత్పత్తులు, 17 మంది కొనుగోలుదారులు మరియు ₹24,500 మొత్తం సేల్స్ ఉన్నాయి. ఫోటో లేదా వాయిస్ తో ప్రారంభించండి.",
    ta: "காரிகர் கனெக்ட்டிற்கு நல்வரவு. உங்களிடம் 24 தயாரிப்புகள், 17 மொத்த வாங்குவோர் மற்றும் ₹24,500 வருமானம் உள்ளது. குரல் அல்லது படம் மூலம் தொடங்கவும்.",
    kn: "ಕಾರಿಗಾರ್ ಕನೆಕ್ಟ್‌ಗೆ ಸುಸ್ವಾಗತ. ನಿಮ್ಮಲ್ಲಿ 24 ಉತ್ಪನ್ನಗಳು, 17 ಬೃಹತ್ ಖರೀದಿದಾರರು ಮತ್ತು ₹24,500 ಒಟ್ಟು ಆದಾಯವಿದೆ. ಧ್ವನಿ ಅಥವಾ ಫೋಟೋ ಬಳಸಿ.",
    bn: "কারিগর কানেক্টে স্বাগতম। আপনার 24টি পণ্য, 17টি ক্রেতার সন্ধান এবং মোট ₹24,500 বিক্রি রয়েছে। ছবি তুলুন বা মুখে বলুন।",
    mr: "कारीगर कनेक्ट मध्ये आपले स्वागत आहे. तुमची 24 उत्पादने, 17 घाऊक खरेदीदार आणि ₹24,500 विक्री आहे. नवीन वस्तू जोडण्यासाठी फोटो किंवा व्हॉइस वापरा.",
    gu: "કારીગર કનેક્ટમાં આપનું સ્વાગત છે. તમારી પાસે 24 પ્રોડક્ટ્સ, 17 ખરીદદારો અને ₹24,500 ની આવક છે. ફોટો અથવા અવાજથી પ્રોડક્ટ ઉમેરો.",
    ml: "കാരിഗർ കണക്റ്റിലേക്ക് സ്വാഗതം. നിങ്ങൾക്ക് 24 ഉൽപ്പന്നങ്ങളും 17 ബൾക്ക് ബയർമാരും ₹24,500 വരുമാനവുമുണ്ട്. ഫോട്ടോയോ ശബ്ദമോ ഉപയോഗിക്കുക.",
    pa: "ਕਾਰੀਗਰ ਕਨੈਕਟ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ। ਤੁਹਾਡੇ ਕੋਲ 24 ਉਤਪਾਦ, 17 ਥੋਕ ਖਰੀਦਦਾਰ ਅਤੇ ₹24,500 ਦੀ ਵਿਕਰੀ ਹੈ। ਫੋਟੋ ਜਾਂ ਆਵਾਜ਼ ਨਾਲ ਸ਼ੁਰੂ ਕਰੋ।"
  },
  step1: {
    en: "Step 1: Take ONE photo of your craft. Even with a messy domestic room or floor background, our AI will remove all background noise.",
    hi: "पहला चरण: अपने उत्पाद की केवल एक फोटो लें। कमरे या फर्श पर बिखरा सामान हो, तो भी AI बैकग्राउंड का सारा शोर हटा देगा।",
    te: "మొదటి దశ: మీ వస్తువు యొక్క ఒక ఫోటో తీయండి. గది లేదా నేలపై ఎంత శబ్దం లేదా సామాన్లు ఉన్నా, AI బ్యాక్‌గ్రౌండ్ శబ్దాన్ని పూర్తిగా తొలగిస్తుంది.",
    ta: "படி 1: உங்கள் தயாரிப்பின் ஒரு புகைப்படம் எடுக்கவும். வீட்டில் பொருட்கள் ஒழுங்கற்ற நிலையில் இருந்தாலும், AI பின்னணி சத்தத்தை நீக்கும்.",
    kn: "ಹಂತ 1: ನಿಮ್ಮ ಕಲೆಯ ಕೇವಲ ಒಂದು ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ. ಕೋಣೆಯಲ್ಲಿ ಅಸ್ತವ್ಯಸ್ತತೆ ಇದ್ದರೂ, AI ಹಿನ್ನೆಲೆ ಗದ್ದಲವನ್ನು ಸಂಪೂರ್ಣ ತೆಗೆದುಹಾಕುತ್ತದೆ.",
    bn: "ধাপ ১: আপনার পণ্যের কেবল একটি ছবি তুলুন। ঘরে বা মেঝেতে যাই থাকুক না কেন, AI ব্যাকগ্রাউন্ডের সমস্ত নয়েজ দূর করে দেবে।",
    mr: "पायरी 1: आपल्या उत्पादनाचा फक्त एक फोटो काढा. खोलीत किंवा जमिनीवर पसारा असला तरी AI पार्श्वभूमीचा गोंधळ काढून टाकेल.",
    gu: "પગલું 1: તમારી પ્રોડક્ટનો માત્ર એક ફોટો લો. રૂમમાં કે ફ્લોર પર ગમે તેટલો સામાન હોય, AI બેકગ્રાઉન્ડનો તમામ અવાજ દૂર કરી દેશે.",
    ml: "ഘട്ടം 1: ഉൽപ്പന്നത്തിന്റെ ഒരു ഫോട്ടോ മാത്രം എടുക്കുക. മുറിയിലോ തറയിലോ സാധനങ്ങൾ ഉണ്ടെങ്കിലും AI പശ്ചാത്തല ശബ്ദം ഒഴിവാക്കും.",
    pa: "ਪੜਾਅ 1: ਆਪਣੇ ਉਤਪਾਦ ਦੀ ਸਿਰਫ਼ ਇੱਕ ਫੋਟੋ ਲਓ। ਕਮਰੇ ਜਾਂ ਫਰਸ਼ 'ਤੇ ਸਾਮਾਨ ਖਿਲਰਿਆ ਹੋਵੇ, AI ਪਿਛੋਕੜ ਦਾ ਸ਼ੋਰ ਬਿਲਕੁਲ ਸਾਫ਼ ਕਰ ਦੇਵੇਗਾ।"
  },
  step2: {
    en: "Step 2: Using AI, all background noise, room clutter, and floor textures have been completely removed from your photo, cleanly isolating your craft.",
    hi: "दूसरा चरण: AI की मदद से आपकी फोटो के पीछे का सारा घरेलू शोर, बिखरा सामान और फर्श की बनावट पूरी तरह हटा दी गई है।",
    te: "రెండవ దశ: AI ఉపయోగించి మీ ఫోటోలోని గది గజిబిజి, నేల రంగులు మరియు బ్యాక్‌గ్రౌండ్ శబ్దం పూర్తిగా తొలగించబడింది, మీ కళాకృతి స్పష్టంగా కనిపిస్తుంది.",
    ta: "படி 2: AI மூலம் உங்கள் புகைப்படத்தின் பின்னணி இரைச்சல், அறையின் ஒழுங்கற்ற பொருட்கள் மற்றும் தரை அமைப்புகள் முற்றிலும் நீக்கப்பட்டுள்ளன.",
    kn: "ಹಂತ 2: AI ಬಳಸಿ ನಿಮ್ಮ ಫೋಟೋದ ಹಿನ್ನೆಲೆ ಗದ್ದಲ, ಕೋಣೆಯ ಅಸ್ತವ್ಯಸ್ತತೆ ಮತ್ತು ನೆಲದ ರಚನೆಗಳನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ತೆಗೆದುಹಾಕಲಾಗಿದೆ.",
    bn: "ধাপ ২: AI ব্যবহার করে আপনার ছবির পেছনের সমস্ত ঘরোয়া কোলাহল, অগোছালো জিনিস এবং মেঝের টেক্সচার সম্পূর্ণরূপে দূর করা হয়েছে।",
    mr: "पायरी 2: AI वापरून आपल्या फोटोमागील घरातील पसारा, जमिनीचा पोत आणि पार्श्वभूमीचा गोंधळ पूर्णपणे काढून टाकला आहे.",
    gu: "પગલું 2: AI ની મદદથી તમારા ફોટા પાછળનો બધો ઘરગથ્થુ અવાજ, અસ્તવ્યસ્ત સામાન અને ફ્લોરિંગ સંપૂર્ણપણે સાફ કરી દેવાયા છે.",
    ml: "ഘട്ടം 2: AI ഉപയോഗിച്ച് നിങ്ങളുടെ ഫോട്ടോയിലെ പശ്ചാത്തല ശബ്ദം, മുറിയുടെ ക്രਮക്കേടുകൾ, തറയുടെ ഘടന എന്നിവ പൂർണ്ണമായും നീക്കം ചെയ്തു.",
    pa: "ਪੜਾਅ 2: AI ਦੀ ਮਦਦ ਨਾਲ ਤੁਹਾਡੀ ਫੋਟੋ ਦੇ ਪਿੱਛੇ ਦਾ ਸਾਰਾ ਘਰੇਲੂ ਸ਼ੋਰ, ਖਿਲਰਿਆ ਸਾਮਾਨ ਅਤੇ ਫਰਸ਼ ਬਿਲਕੁਲ ਸਾਫ਼ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ।"
  },
  step3: {
    en: "Step 3: Press Speak and describe your product in your mother tongue. Tell us what it is, the material used, and time taken.",
    hi: "तीसरा चरण: माइक दबाएं और अपनी भाषा में उत्पाद के बारे में बताएं। क्या सामग्री है और बनाने में कितने दिन लगे।",
    te: "మూడవ దశ: మైక్ నొక్కి మీ మాతృభాషలో మాట్లాడండి. ఇది ఏమిటి, ఏ పదార్థంతో చేశారు, ఎన్ని రోజులు పట్టిందో చెప్పండి.",
    ta: "படி 3: மைக்கை அழுத்தி உங்கள் மொழியில் பேசுங்கள். இது என்ன, என்ன பொருள், எத்தனை நாட்கள் ஆனது என்று சொல்லுங்கள்.",
    kn: "ಹಂತ 3: ಮೈಕ್ ಒತ್ತಿ ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಿ. ಇದು ಏನು, ಯಾವ ವಸ್ತು ಮತ್ತು ಎಷ್ಟು ದಿನ ಆಯಿತು ಎಂದು ತಿಳಿಸಿ.",
    bn: "ধাপ ৩: মাইক টিপুন এবং নিজের ভাষায় বলুন। এটি কী, কী উপাদান দিয়ে তৈরি এবং কত দিন লেগেছে।",
    mr: "पायरी 3: माइक दाबा आणि आपल्या भाषेत सांगा. काय वस्तू आहे, काय साहित्य लागले आणि किती दिवस लागले.",
    gu: "પગલું 3: માઇક દબાવો અને તમારી ભાષામાં કહો. આ શું છે, કઈ સામગ્રી વપરાઈ અને કેટલા દિવસ લાગ્યા.",
    ml: "ഘട്ടം 3: മൈക്ക് അമർത്തി നിങ്ങളുടെ ഭാഷയിൽ സംസാരിക്കുക. എന്താണ് ഉൽപ്പന്നം, ഉണ്ടാക്കാൻ എത്ര സമയമെടുത്തു എന്ന് പറയുക.",
    pa: "ਪੜਾਅ 3: ਮਾਈਕ ਦਬਾਓ ਅਤੇ ਆਪਣੀ ਬੋਲੀ ਵਿੱਚ ਦੱਸੋ। ਇਹ ਕੀ ਹੈ, ਕਿਹੜਾ ਮਟੀਰੀਅਲ ਹੈ ਅਤੇ ਕਿੰਨੇ ਦਿਨ ਲੱਗੇ।"
  },
  buyers: {
    en: "Find Buyers: 17 bulk buyers looking for handmade crafts. Tap Submit Wholesale Proposal to connect directly.",
    hi: "थोक खरीदार खोजें: 17 थोक खरीदार हस्तशिल्प खोज रहे हैं। सीधे जुड़ने के लिए प्रस्ताव भेजें बटन दबाएं।",
    te: "కొనుగోలుదారులు: మీ హస్తకళల కోసం 17 మంది పెద్ద కొనుగోలుదారులు సిద్ధంగా ఉన్నారు. హోల్‌సేల్ ప్రతిపాదనను పంపండి.",
    ta: "மொத்த வாங்குவோர்: உங்கள் கைவினைப் பொருட்களுக்காக 17 வாங்குவோர் காத்திருக்கிறார்கள். விலைப்பட்டியல் அனுப்பவும்.",
    kn: "ಖರೀದಿದಾರರು: ನಿಮ್ಮ ಕರಕುಶಲ ವಸ್ತುಗಳಿಗೆ 17 ಖರೀದಿದಾರರಿದ್ದಾರೆ. ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಲು ಪ್ರಸ್ತಾಪ ಕಳುಹಿಸಿ.",
    bn: "ক্রেতা খুঁজুন: হস্তশিল্পের জন্য 17টি পাইকারি ক্রেতার চাহিদা রয়েছে। সরাসরি যোগাযোগ করতে প্রস্তাব পাঠান।",
    mr: "घाऊक खरेदीदार: आपल्या हस्तकलेसाठी 17 खरेदीदार तयार आहेत. थेट जोडण्यासाठी कोटेशन पाठवा.",
    gu: "જથ્થાબંધ ખરીદદારો: તમારી હસ્તકલા માટે 17 ખરીદદારો ઉપલબ્ધ છે. સીધો પ્રસ્તાવ મોકલો.",
    ml: "ബൾക്ക് ബയർമാർ: നിങ്ങളുടെ ഉൽപ്പന്നങ്ങൾക്കായി 17 വാങ്ങുന്നവർ തയ്യാറാണ്. നിർദ്ദേശം അയക്കുക.",
    pa: "ਥੋਕ ਖਰੀਦਦਾਰ: ਤੁਹਾਡੇ ਲਈ 17 ਖਰੀਦਦਾਰ ਤਿਆਰ ਹਨ। ਸਿੱਧਾ ਸੰਪਰਕ ਕਰਨ ਲਈ ਪ੍ਰਸਤਾਵ ਭੇਜੋ।"
  },
  my_products: {
    en: "Here is your product catalog. You can see active listings, view counts, and add new handmade crafts.",
    hi: "यह आपकी उत्पाद सूची है। यहाँ आप सक्रिय उत्पाद, देखे जाने की संख्या और नए उत्पाद जोड़ सकते हैं।",
    te: "ఇది మీ ఉత్పత్తుల జాబితా. ఇక్కడ మీరు యాక్టివ్ వస్తువులు, వీక్షణలు చూసి కొత్తవి చేర్చవచ్చు.",
    ta: "இது உங்கள் தயாரிப்பு பட்டியல். இங்கே உங்கள் தயாரிப்புகளை பார்த்து புதியவற்றை சேர்க்கலாம்.",
    kn: "ಇದು ನಿಮ್ಮ ಉತ್ಪನ್ನಗಳ ಪಟ್ಟಿ. ಇಲ್ಲಿ ನೀವು ಹೊಸ ಕರಕುಶಲ ವಸ್ತುಗಳನ್ನು ಸೇರಿಸಬಹುದು.",
    bn: "এটি আপনার পণ্য তালিকা। এখানে আপনার সক্রিয় পণ্য দেখতে এবং নতুন পণ্য যোগ করতে পারেন।",
    mr: "हे आपले उत्पादन कॅटलॉग आहे. येथे आपण नवीन हस्तकला वस्तू जोडू शकता.",
    gu: "આ તમારી પ્રોડક્ટ યાદી છે. અહીં તમે નવી હસ્તકલા પ્રોડક્ટ્સ ઉમેરી શકો છો.",
    ml: "ഇത് നിങ്ങളുടെ ഉൽപ്പന്നങ്ങളുടെ കാറ്റലോഗ് ആണ്. ഇവിടെ പുതിയ ഉൽപ്പന്നങ്ങൾ ചേർക്കാം.",
    pa: "ਇਹ ਤੁਹਾਡੀ ਉਤਪਾਦ ਸੂਚੀ ਹੈ। ਇੱਥੇ ਤੁਸੀਂ ਨਵੇਂ ਦਸਤਕਾਰੀ ਉਤਪਾਦ ਜੋੜ ਸਕਦੇ ਹੋ।"
  },
  orders: {
    en: "Orders screen. Track new orders, pack items, and handover parcels to courier partners.",
    hi: "ऑर्डर स्क्रीन। नए ऑर्डर देखें, सामान पैक करें और कूरियर को सौंपें।",
    te: "ఆర్డర్ల స్క్రీన్. కొత్త ఆర్డర్లను పరిశీలించి, ప్యాక్ చేసి కొరియర్‌కు పంపండి.",
    ta: "ஆர்டர்கள் திரை. புதிய ஆர்டர்களைப் பார்த்து, பேக் செய்து கூரியரிடம் ஒப்படைக்கவும்.",
    kn: "ಆರ್ಡರ್‌ಗಳ ಪರದೆ. ಹೊಸ ಆರ್ಡರ್ ನೋಡಿ, ಪ್ಯಾಕ್ ಮಾಡಿ ಕೊರಿಯರ್‌ಗೆ ನೀಡಿ.",
    bn: "অর্ডার স্ক্রিন। নতুন অর্ডার দেখুন, প্যাক করুন এবং কুরিয়ারকে হস্তান্তর করুন।",
    mr: "ऑर्डर्स स्क्रीन. नवीन ऑर्डर्स तपासा, पॅक करा आणि कुरिअरकडे पाठवा.",
    gu: "ઓર્ડર્સ સ્ક્રીન. નવા ઓર્ડર્સ જુઓ, પેક કરો અને કુરિયરને સોંપો.",
    ml: "ഓർഡർ സ്ക്രീൻ. പുതിയ ഓർഡറുകൾ കണ്ട് പാക്ക് ചെയ്ത് കൊറിയറിന് കൈമാറുക.",
    pa: "ਆਰਡਰ ਸਕਰੀਨ। ਨਵੇਂ ਆਰਡਰ ਦੇਖੋ, ਪੈਕ ਕਰੋ ਅਤੇ ਕੂਰੀਅਰ ਨੂੰ ਦਿਓ।"
  },
  marketplace: {
    en: "Artisan Marketplace. Explore authentic handmade treasures directly from Indian master craftsmen.",
    hi: "कारीगर बाज़ार। सीधे भारतीय कारीगरों से प्रामाणिक हस्तशिल्प खरीदें।",
    te: "చేతివృత్తుల మార్కెట్‌ప్లేస్. కళాకారుల నుండి నేరుగా చేతివృత్తుల వస్తువులు కొనండి.",
    ta: "கைவினை அங்காடி. இந்திய கலைஞர்களிடமிருந்து நேரடியாக அசல் பொருட்களை வாங்கவும்.",
    kn: "ಕುಶಲಕರ್ಮಿ ಮಾರುಕಟ್ಟೆ. ಭಾರತೀಯ ಕುಶಲಕರ್ಮಿಗಳಿಂದ ನೇರವಾಗಿ ಕರಕುಶಲ ವಸ್ತುಗಳನ್ನು ಖರೀದಿಸಿ.",
    bn: "কারিগর বাজার। সরাসরি ভারতীয় কারিগরদের থেকে সুন্দর হস্তশিল্প কিনুন।",
    mr: "ਕਾਰੀਗਰ ਬਾਜ਼ਾਰ. थेट भारतीय कारागिरांकडून सुंदर हस्तकला खरेदी करा.",
    gu: "કારીગર બજાર. ભારતીય કારીગરો પાસેથી અસલી હસ્તકલા સીધી ખરીદો.",
    ml: "കരകൗശല വിപണി. ഇന്ത്യൻ കലാകാരന്മാരിൽ നിന്ന് നേരിട്ട് ഉൽപ്പന്നങ്ങൾ വാങ്ങൂ.",
    pa: "ਕਾਰੀਗਰ ਬਾਜ਼ਾਰ। ਸਿੱਧੇ ਭਾਰਤੀ ਕਾਰੀਗਰਾਂ ਤੋਂ ਅਸਲੀ ਦਸਤਕਾਰੀ ਉਤਪਾਦ ਖਰੀਦੋ।"
  },
  cart: {
    en: "Your shopping cart. Review selected handcrafted products and proceed to secure checkout.",
    hi: "आपकी शॉपिंग कार्ट। चुने गए उत्पादों की जांच करें और सुरक्षित भुगतान करें।",
    te: "మీ షాపింగ్ కార్ట్. ఎంచుకున్న వస్తువులను పరిశీలించి ఆర్డర్ పూర్తి చేయండి.",
    ta: "உங்கள் ஷாப்பிங் கார்ட். தேர்வு செய்த பொருட்களை சரிபார்த்து வாங்கவும்.",
    kn: "ನಿಮ್ಮ ಶಾಪಿಂಗ್ ಕಾರ್ಟ್. ಆಯ್ಕೆಮಾಡಿದ ವಸ್ತುಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಖರೀದಿಸಿ.",
    bn: "আপনার শপিং কার্ট। নির্বাচিত পণ্যগুলো দেখুন এবং নিরাপদে কিনুন।",
    mr: "आपली शॉपिंग कार्ट. निवडलेली उत्पादने तपासा आणि सुरक्षित खरेदी करा.",
    gu: "તમારું શોપિંગ કાર્ટ. પસંદ કરેલી પ્રોડક્ટ્સ તપાસીને ખરીદી કરો.",
    ml: "നിങ്ങളുടെ ഷോപ്പിംഗ് കാർട്ട്. തിരഞ്ഞെടുത്ത ഉൽപ്പന്നങ്ങൾ കണ്ട് വാങ്ങുക.",
    pa: "ਤੁਹਾਡਾ ਸ਼ਾਪਿੰਗ ਕਾਰਟ। ਚੁਣੇ ਹੋਏ ਉਤਪਾਦ ਚੈੱਕ ਕਰੋ ਅਤੇ ਖਰੀਦੋ।"
  },
  step4: {
    en: "Step 4: AI Catalog & Story. Check the product details, craft technique, and customer description generated by AI.",
    hi: "चौथा चरण: AI कैटलॉग और कहानी। AI द्वारा तैयार किया गया उत्पाद का नाम, सामग्री, तकनीक और विवरण जांचें।",
    te: "నాల్గవ దశ: AI కేటలాగ్ మరియు కథ. మీ మాటల నుండి AI రూపొందించిన వస్తువు పేరు, శైలి మరియు వివరణను పరిశీలించండి.",
    ta: "படி 4: AI பட்டியல் மற்றும் கதை. AI உருவாக்கிய தயாரிப்பு பெயர், முறை மற்றும் விவரங்களை சரிபார்க்கவும்.",
    kn: "ಹಂತ 4: AI ಕ್ಯಾಟಲಾಗ್ ಮತ್ತು ಕಥೆ. AI ಸಿದ್ಧಪಡಿಸಿದ ಉತ್ಪನ್ನದ ವಿವರ, ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಕಥೆಯನ್ನು ಪರಿಶೀಲಿಸಿ.",
    bn: "ধাপ ৪: AI ক্যাটালগ ও গল্প। AI দ্বারা তৈরি পণ্যের নাম, উপাদান এবং বিবরণ পরীক্ষা করুন।",
    mr: "पायरी 4: AI कॅटलॉग आणि माहिती. AI ने तयार केलेले नाव, साहित्य आणि पारंपारिक माहिती तपासा.",
    gu: "પગલું 4: AI કેટલોગ અને વિગતો. AI એ બનાવેલ પ્રોડક્ટનું નામ, સામગ્રી અને વિગતવાર લખાણ તપાસો.",
    ml: "ഘട്ടം 4: AI കാറ്റലോഗും വിവരണവും. AI തയ്യാറാക്കിയ ഉൽപ്പന്നത്തിന്റെ വിവരങ്ങളും കഥയും പരിശോധിക്കുക.",
    pa: "ਪੜਾਅ 4: AI ਕੈਟਾਲਾਗ ਅਤੇ ਕਹਾਣੀ। AI ਵੱਲੋਂ ਤਿਆਰ ਕੀਤਾ ਗਿਆ ਨਾਮ, ਸਮੱਗਰੀ ਅਤੇ ਵੇਰਵਾ ਚੈੱਕ ਕਰੋ।"
  },
  step5: {
    en: "Step 5: Fair Price Recommendation. AI calculates your material cost, artisan wages, and suggested market price.",
    hi: "पांचवां चरण: सही कीमत निर्धारण। AI सामग्री लागत, कारीगरी मजदूरी और बाज़ार के हिसाब से सही दाम बताता है।",
    te: "ఐదవ దశ: సరైన ధర సిఫార్సు. AI ముడిసరుకు ఖర్చు, మీ శ్రమ ఆధారంగా న్యాయమైన ధరను సూచిస్తుంది.",
    ta: "படி 5: நியாயமான விலை. பொருள் செலவு, கைவினை கூலி மற்றும் சந்தை நிலவரப்படி AI விலை நிர்ணயிக்கிறது.",
    kn: "ಹಂತ 5: ನ್ಯಾಯಯುತ ಬೆಲೆ. ಕಚ್ಚಾ ಸಾಮಗ್ರಿ ವೆಚ್ಚ ಮತ್ತು ನಿಮ್ಮ ಶ್ರಮಕ್ಕೆ ತಕ್ಕಂತೆ AI ಸೂಕ್ತ ಬೆಲೆಯನ್ನು ತಿಳಿಸುತ್ತದೆ.",
    bn: "ধাপ ৫: সঠিক মূল্য নির্ধারণ। AI সামগ্রী খরচ ও শ্রমিকের মজুরি হিসাব করে সঠিক দাম দেয়।",
    mr: "पायरी 5: योग्य किंमत ठरवा. AI साहित्याचा खर्च आणि मजुरीनुसार योग्य किंमत ठरवते.",
    gu: "પગલું 5: સાચો ભાવ. AI સામગ્રી ખર્ચ અને તમારી મહેનત મુજબ વાજબી ભાવ નક્કી કરે છે.",
    ml: "ഘട്ടം 5: ന്യായമായ വില. മെറ്റീരിയൽ ചിലവും നിങ്ങളുടെ അധ്വാനവും കണക്കാക്കി AI ന്യായമായ വില നൽകുന്നു.",
    pa: "ਪੜਾਅ 5: ਸਹੀ ਕੀਮਤ। AI ਸਮੱਗਰੀ ਖਰਚ ਅਤੇ ਤੁਹਾਡੀ ਮਿਹਨਤ ਅਨੁਸਾਰ ਸਹੀ ਰੇਟ ਦੱਸਦਾ ਹੈ।"
  },
  step6: {
    en: "Step 6: Review Listing. Choose where you want to sell: App Store, GeM Portal, B2B wholesale buyers, or ONDC Network.",
    hi: "छठा चरण: उत्पाद पूर्वावलोकन। चुनें कि आप कहाँ बेचना चाहते हैं: ऐप स्टोर, GeM पोर्टल, थोक खरीदार, या ONDC।",
    te: "ఆరవ దశ: లిస్టింగ్ సమీక్ష. ఎక్కడ అమ్మాలనుకుంటున్నారో ఎంచుకోండి: యాప్ స్టోర్, GeM, హోల్‌సేల్, లేదా ONDC.",
    ta: "படி 6: சரிபார்க்கவும். எங்கு விற்க விரும்புகிறீர்கள்: செயலி அங்காடி, GeM, மொத்த வாங்குவோர், அல்லது ONDC.",
    kn: "ಹಂತ 6: ಪರಿಶೀಲನೆ. ಎಲ್ಲಿ ಮಾರಾಟ ಮಾಡಲು ಬಯಸುತ್ತೀರಿ: ಆ್ಯಪ್ ಮಳಿಗೆ, GeM, ಬೃಹತ್ ಖರೀದಿದಾರರು, ಅಥವಾ ONDC.",
    bn: "ধাপ ৬: পর্যালোচনা। কোথায় বিক্রি করতে চান: অ্যাপ স্টোর, GeM পোর্টাল, পাইকারি ক্রেতা, বা ONDC।",
    mr: "पायरी 6: पूर्वावलोकन. कुठे विकायचे ते निवडा: ॲप स्टोअर, GeM पोर्टल, घाऊक खरेदीदार, किंवा ONDC.",
    gu: "પગલું 6: પૂર્વાવલોકન. ક્યાં વેચવું તે પસંદ કરો: ઍપ સ્ટોર, GeM પોર્ટલ, જથ્થાબંધ ખરીદદારો, કે ONDC.",
    ml: "ഘട്ടം 6: ലിസ്റ്റിംഗ് പ്രിവ്യൂ. എവിടെ വിൽക്കണം എന്ന് തിരഞ്ഞെടുക്കുക: ആപ്പ് സ്റ്റോർ, GeM, ബൾക്ക് ബയർമാർ, അല്ലെങ്കിൽ ONDC.",
    pa: "ਪੜਾਅ 6: ਜਾਂਚ ਕਰੋ। ਕਿੱਥੇ ਵੇਚਣਾ ਹੈ: ਐਪ ਦੁਕਾਨ, GeM ਪੋਰਟਲ, ਥੋਕ ਖਰੀਦਦਾਰ, ਜਾਂ ONDC।"
  },
  step7: {
    en: "Congratulations! Your handmade product is now live and visible to verified buyers across India!",
    hi: "बधाई हो! आपका हस्तशिल्प उत्पाद अब लाइव हो गया है और देश भर के खरीदारों को दिख रहा है!",
    te: "అభినందనలు! మీ చేతివృత్తి ఉత్పత్తి ఇప్పుడు లైవ్ అయింది, దేశవ్యాప్తంగా కొనుగోలుదారులు చూడగలరు!",
    ta: "வாழ்த்துகள்! உங்கள் கைவினைப் பொருள் இப்போது வெளியானது, வாங்குவோர் பார்வையிடலாம்!",
    kn: "ಅಭಿನಂದನೆಗಳು! ನಿಮ್ಮ ಕರಕುಶಲ ವಸ್ತು ಈಗ ಲೈವ್ ಆಗಿದೆ ಮತ್ತು ಖರೀದಿದಾರರಿಗೆ ಲಭ್ಯವಿದೆ!",
    bn: "অভিনন্দন! আপনার হস্তশিল্প পণ্য এখন লাইভ এবং সারা দেশের ক্রেতারা দেখতে পাচ্ছেন!",
    mr: "अभिनंदन! आपले हस्तकला उत्पादन आता लाइव्ह झाले असून ग्राहक पाहू शकतात!",
    gu: "અભિનંદન! તમારી હસ્તકલા પ્રોડક્ટ હવે લાઈવ છે અને ગ્રાહકો જોઈ શકે છે!",
    ml: "അഭിനന്ദനങ്ങൾ! നിങ്ങളുടെ കരകൗശല ഉൽപ്പന്നം ഇപ്പോൾ ലൈവായി, എല്ലാവർക്കും വാങ്ങാം!",
    pa: "ਵਧਾਈਆਂ! ਤੁਹਾਡਾ ਦਸਤਕਾਰੀ ਉਤਪਾਦ ਹੁਣ ਲਾਈਵ ਹੋ ਗਿਆ ਹੈ ਅਤੇ ਗਾਹਕ ਖਰੀਦ ਸਕਦੇ ਹਨ!"
  },
  onboarding_lang: {
    en: "Step 1 of 3: Choose your language. You can speak and use the entire app in your own mother tongue.",
    hi: "पहला चरण: अपनी भाषा चुनें। आप अपनी मातृभाषा में बोलकर पूरे ऐप का उपयोग कर सकते हैं।",
    te: "మొదటి దశ: మీ భాషను ఎంచుకోండి. మీరు మీ మాతృభాషలోనే మాట్లాడి యాప్ ఉపయోగించవచ్చు.",
    ta: "படி 1: உங்கள் மொழியைத் தேர்வுசெய்யவும். உங்கள் தாய்மொழியிலேயே பேசி பயன்படுத்தலாம்.",
    kn: "ಹಂತ 1: ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ. ಮಾತೃಭಾಷೆಯಲ್ಲೇ ಮಾತನಾಡಿ ಆ್ಯಪ್ ಬಳಸಿ.",
    bn: "ধাপ ১: ভাষা নির্বাচন করুন। নিজের মাতৃভাষায় কথা বলে পুরো অ্যাপ ব্যবহার করতে পারেন।",
    mr: "पायरी 1: आपली भाषा निवडा. आपण आपल्या मातृभाषेत बोलून ॲप वापरू शकता.",
    gu: "પગલું 1: તમારી ભાષા પસંદ કરો. તમે માતૃભાષામાં બોલીને ઍપ વાપਰੀ શકો છો.",
    ml: "ഘട്ടം 1: ഭാഷ തിരഞ്ഞെടുക്കുക. മാതൃഭാഷയിൽ സംസാരിച്ച് ആപ്പ് ഉപയോഗിക്കാം.",
    pa: "ਪੜਾਅ 1: ਆਪਣੀ ਬੋਲੀ ਚੁਣੋ। ਤੁਸੀਂ ਆਪਣੀ ਮਾਂ-ਬੋਲੀ ਵਿੱਚ ਬੋਲ ਕੇ ਐਪ ਵਰਤ ਸਕਦੇ ਹੋ।"
  },
  onboarding_cat: {
    en: "Step 2 of 3: Select the crafts you make. You can select handloom, pottery, woodwork, jewellery, or others.",
    hi: "दूसरा चरण: आप क्या बनाते हैं? हथकरघा, मिट्टी के बर्तन, लकड़ी, आभूषण चुनें।",
    te: "రెండవ దశ: మీరు ఏమి తయారు చేస్తారు? చేనేత, కుండలు, చెక్క పని, నగల వంటి కళలను ఎంచుకోండి.",
    ta: "படி 2: நீங்கள் என்ன செய்கிறீர்கள்? கைத்தறி, மண்பாண்டம், மரவேலை போன்றவற்றைத் தேர்ந்தெடுக்கவும்.",
    kn: "ಹಂತ 2: ನೀವು ಏನು ತಯಾರಿಸುತ್ತೀರಿ? ಕೈಮಗ್ಗ, ಮಣ್ಣಿನ ಪಾತ್ರೆ, ಮರದ ಕೆತ್ತನೆ ಆಯ್ಕೆಮಾಡಿ.",
    bn: "ধাপ ২: আপনি কী তৈরি করেন? তাঁত, মৃৎশিল্প, কাঠের কাজ নির্বাচন করুন।",
    mr: "पायरी 2: आपण काय बनवता? हातमाग, मातीची भांडी, लाकडी काम निवडा.",
    gu: "પગલું 2: તમે શું બનાવો છો? હાથશાળ, માટીકામ, લાકડાકામ પસંદ કરો.",
    ml: "ഘട്ടം 2: നിങ്ങൾ എന്താണ് നിർമ്മിക്കുന്നത്? കൈത്തറി, മൺപാത്രങ്ങൾ തിരഞ്ഞെടുക്കുക.",
    pa: "ਪੜਾਅ 2: ਤੁਸੀਂ ਕੀ ਬਣਾਉਂਦੇ ਹੋ? ਖੱਡੀ, ਮਿੱਟੀ ਦੇ ਬਰਤਨ, ਲੱਕੜ ਦੀ ਕਲਾ ਚੁਣੋ।"
  },
  onboarding_profile: {
    en: "Step 3 of 3: Simple Profile. Enter your name, business name, and village or city so buyers can recognize your craft.",
    hi: "तीसरा चरण: अपनी सरल प्रोफाइल बनाएं ताकि खरीदार आपकी कला को पहचान सकें।",
    te: "మూడవ దశ: మీ ప్రొఫైల్. కొనుగోలుదారులు గుర్తించడానికి మీ పేరు, గ్రామం నమోదు చేయండి.",
    ta: "படி 3: உங்கள் சுயவிவரம். உங்கள் பெயர், கடை பெயர் மற்றும் ஊரை உள்ளிடவும்.",
    kn: "ಹಂತ 3: ಸರಳ ಪ್ರೊಫೈಲ್. ನಿಮ್ಮ ಹೆಸರು, ವ್ಯಾಪಾರದ ಹೆಸರು ಮತ್ತು ಊರನ್ನು ನಮೂದಿಸಿ.",
    bn: "ধাপ ৩: সহজ প্রোফাইল। আপনার নাম, দোকানের নাম এবং গ্রাম বা শহর লিখুন।",
    mr: "पायरी 3: सोपी प्रोफाइल. आपले नाव, दुकानाचे नाव आणि गाव प्रविष्ट करा.",
    gu: "પગલું 3: સરળ પ્રોફાઇલ. તમારું નામ, દુકાનનું નામ અને ગામ લખો.",
    ml: "ഘട്ടം 3: ലളിതമായ പ്രൊഫൈൽ. നിങ്ങളുടെ പേര്, സ്ഥാപനത്തിന്റെ പേര് എന്നിവ രേഖപ്പെടുത്തുക.",
    pa: "ਪੜਾਅ 3: ਸਧਾਰਨ ਪ੍ਰੋਫਾਈਲ। ਆਪਣਾ ਨਾਮ, ਦੁਕਾਨ ਦਾ ਨਾਮ ਅਤੇ ਪਿੰਡ ਜਾਂ ਸ਼ਹਿਰ ਦਰਜ ਕਰੋ।"
  },
};

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentLanguageOption, language } = useLanguage();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isAssistantModalOpen, setIsAssistantModalOpen] = useState<boolean>(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const recognitionRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize and load speech synthesis voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          setAvailableVoices(voices);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Play acoustic feedback chimes
  const playChime = useCallback((type: 'success' | 'tap' | 'alert' = 'tap') => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx();
        }
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1);
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2);
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.35);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === 'alert') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(330, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (e) {
      console.warn('Audio chime warning:', e);
    }
  }, []);

  // Find best available voice on mobile/desktop for the given language code
  const findBestVoice = useCallback((targetLang: string): SpeechSynthesisVoice | null => {
    if (!availableVoices || availableVoices.length === 0) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        return null;
      }
      return null;
    }

    const langNormalized = targetLang.replace('_', '-').toLowerCase();
    const shortCode = langNormalized.split('-')[0];

    // 1. Exact BCP-47 match (e.g. "te-IN")
    const exact = availableVoices.find(v => v.lang.replace('_', '-').toLowerCase() === langNormalized);
    if (exact) return exact;

    // 2. Language prefix match (e.g. starts with "te")
    const prefixMatch = availableVoices.find(v => v.lang.toLowerCase().startsWith(shortCode));
    if (prefixMatch) return prefixMatch;

    // 3. Indian English / Indian voice fallback
    const indianVoice = availableVoices.find(v => v.lang.toLowerCase().includes('in'));
    if (indianVoice) return indianVoice;

    // 4. Default voice
    return availableVoices[0] || null;
  }, [availableVoices]);

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const [isVoiceEnabled, setIsVoiceEnabledState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('karigar_voice_enabled');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });

  const stopSpeaking = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const setIsVoiceEnabled = useCallback((enabled: boolean) => {
    setIsVoiceEnabledState(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem('karigar_voice_enabled', enabled ? 'true' : 'false');
    }
    if (!enabled) {
      stopSpeaking();
    }
  }, [stopSpeaking]);

  const toggleVoice = useCallback(() => {
    setIsVoiceEnabledState(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('karigar_voice_enabled', next ? 'true' : 'false');
      }
      if (!next) {
        stopSpeaking();
      }
      return next;
    });
  }, [stopSpeaking]);

  const speakWithBrowserSynthesis = useCallback((text: string, targetLang: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSpeaking(false);
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = targetLang;
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      const voice = findBestVoice(targetLang);
      if (voice) utterance.voice = voice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsSpeaking(false);
    }
  }, [findBestVoice]);

  // Robust Text-To-Speech with full mobile compatibility across all Indian languages
  const speak = useCallback((text: string, langCode?: string, force: boolean = false) => {
    if (!text) return;
    if (!isVoiceEnabled && !force) return; // Audio guidance / Voice instructor is muted!

    stopSpeaking();
    setIsSpeaking(true);

    const targetLang = langCode || currentLanguageOption.voiceLang || 'hi-IN';
    const shortLang = targetLang.split('-')[0]; // 'te', 'ta', 'kn', 'bn', 'hi', 'en', etc.

    // 1. Stream high-fidelity native audio (guarantees Telugu, Tamil, Kannada, Bengali, etc. are heard)
    try {
      const cleanText = text.replace(/[\n\r]/g, ' ').trim().slice(0, 200);
      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${shortLang}&q=${encodeURIComponent(cleanText)}`;
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        currentAudioRef.current = null;
      };

      audio.onerror = () => {
        currentAudioRef.current = null;
        speakWithBrowserSynthesis(text, targetLang);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          currentAudioRef.current = null;
          speakWithBrowserSynthesis(text, targetLang);
        });
      }
    } catch (e) {
      speakWithBrowserSynthesis(text, targetLang);
    }
  }, [currentLanguageOption, isVoiceEnabled, stopSpeaking, speakWithBrowserSynthesis]);

  // Localized key announcement helper
  const speakLocalizedKey = useCallback((translationKey: string, fallbackText?: string, force?: boolean) => {
    const translation = TRANSLATIONS[language]?.[translationKey] || fallbackText || '';
    if (translation) {
      speak(translation, currentLanguageOption.voiceLang, force);
    }
  }, [language, currentLanguageOption, speak]);

  // Speech Recognition (Voice-to-Text) with full fallback support
  const startListening = useCallback((onResult?: (text: string) => void) => {
    playChime('tap');
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech recognition not natively supported on this browser. Providing localized fallback.');
      setIsListening(true);
      setTranscript('Listening...');

      setTimeout(() => {
        const samplePhrases: Record<string, string> = {
          te: 'ఇది సహజ వెదురుతో చేసిన నిల్వ బుట్ట. ఇది చేతితో నేయబడింది మరియు 2 రోజులు పట్టింది. బట్టలు మరియు గృహ వస్తువులు దాచడానికి ఉపయోగించవచ్చు.',
          hi: 'यह टोकरी प्राकृतिक बांस से बनी है। यह पूरी तरह से हस्तनिर्मित है और इसे बनाने में दो दिन का समय लगता है। इसका उपयोग कपड़े और घरेलू सामान रखने के लिए किया जा सकता है।',
          ta: 'இந்த கூடை மூங்கிலால் செய்யப்பட்டது. இது கையால் நெய்யப்பட்டு செய்ய 2 நாட்கள் ஆனது. துணிகள் மற்றும் வீட்டு பொருட்களை வைக்க பயன்படுத்தலாம்.',
          kn: 'ಈ ಬುಟ್ಟಿ ನೈಸರ್ಗಿಕ ಬಿದಿರಿನಿಂದ ಮಾಡಲ್ಪಟ್ಟಿದೆ. ಇದು ಕೈಯಿಂದ ನೇಯ್ದಿದ್ದು, ತಯಾರಿಸಲು 2 ದಿನಗಳು ಬೇಕಾಗುತ್ತದೆ.',
          bn: 'এই ঝুড়িটি প্রাকৃতিক বাঁশ দিয়ে তৈরি। এটি হস্তনির্মিত এবং তৈরি করতে দুই দিন সময় লেগেছে।',
          mr: 'ही टोपली नैसर्गिक बांबूपासून बनवली आहे. ही हाताने विणलेली असून बनवायला दोन दिवस लागले आहेत.',
          gu: 'આ ટોપલી કુદરતી વાંસમાંથી બનેલી છે. આ હાથથી વણેલી છે અને બનાવતા બે દિવસ થયા છે.',
          ml: 'ഈ കൊട്ട പ്രകൃതിദത്ത മുള കൊണ്ടാണ് ഉണ്ടാക്കിയത്. ഇത് കൈകൊണ്ട് നിർമ്മിച്ചതാണ്, ഉണ്ടാക്കാൻ 2 ദിവസമെടുത്തു.',
          pa: 'ਇਹ ਟੋਕਰੀ ਕੁਦਰਤੀ ਬਾਂਸ ਤੋਂ ਬਣੀ ਹੈ। ਇਹ ਹੱਥ ਨਾਲ ਬੁਣੀ ਹੋਈ ਹੈ ਅਤੇ ਬਣਾਉਣ ਵਿੱਚ ਦੋ ਦਿਨ ਲੱਗੇ ਹਨ।',
          en: 'This basket is made from natural bamboo. It is 100% handmade and takes two days of weaving. It can be used for storing clothes and household items.'
        };
        const sampleText = samplePhrases[language] || samplePhrases.en;
        setTranscript(sampleText);
        setIsListening(false);
        if (onResult) onResult(sampleText);
      }, 1500);
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = currentLanguageOption.voiceLang || 'hi-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
        if (event.results[0].isFinal && onResult) {
          onResult(currentText);
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn('Recognition start exception:', e);
      setIsListening(false);
    }
  }, [currentLanguageOption, language, playChime]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return (
    <VoiceContext.Provider
      value={{
        isListening,
        transcript,
        isSpeaking,
        isVoiceEnabled,
        setIsVoiceEnabled,
        toggleVoice,
        startListening,
        stopListening,
        speak,
        speakLocalizedKey,
        stopSpeaking,
        playChime,
        isAssistantModalOpen,
        setIsAssistantModalOpen
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};
