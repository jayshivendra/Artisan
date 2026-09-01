import { Router, Request, Response } from 'express';
import { ImageAiService } from '../services/imageAiService.js';
import { SpeechNlpService } from '../services/speechNlpService.js';
import { DynamicPricingService } from '../services/dynamicPricingService.js';
import { db } from '../db/database.js';

export const aiRouter = Router();

// POST AI Image Enhancement
aiRouter.post('/enhance-image', async (req: Request, res: Response) => {
  const { image_url, preset } = req.body;
  const url = image_url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80';
  const result = await ImageAiService.processAndEnhanceImage(url, preset);
  res.json({ success: true, data: result });
});

// POST AI Voice to Catalog & NLP attribute extraction
aiRouter.post('/voice-catalog', async (req: Request, res: Response) => {
  const { speech_text, language } = req.body;
  const result = await SpeechNlpService.processVoiceOrTextInput(speech_text || '', language || 'te');
  res.json({ success: true, data: result });
});

// POST Dynamic Pricing recommendation
aiRouter.post('/pricing', (req: Request, res: Response) => {
  const result = DynamicPricingService.calculateRecommendation(req.body);
  res.json({ success: true, data: result });
});

// POST AI Home Suggestions
aiRouter.get('/suggestions', (req: Request, res: Response) => {
  const suggestions = [
    {
      id: 'sug_1',
      icon: 'sparkles',
      category: 'photography',
      title: 'Lighting Improvement',
      title_hi: 'तस्वीर की रोशनी सुधारें',
      title_te: 'ఫోటో కాంతిని మెరుగుపరచండి',
      description: 'Your Pochampally Silk Saree will get 3x more views with Studio White lighting.',
      description_hi: 'आपकी पोचमपल्ली रेशम साड़ी को स्टूडियो व्हाइट बैकग्राउंड के साथ 3 गुना अधिक ग्राहक देखेंगे।',
      description_te: 'మీ పోచంపల్లి పట్టు చీరను స్టూడియో లైటింగ్‌లో ఉంచితే 3 రెట్లు ఎక్కువ మంది చూస్తారు.',
      action_type: 'enhance_photo',
      target_id: 'prod_001',
      badge: 'High Impact'
    },
    {
      id: 'sug_2',
      icon: 'trending-up',
      category: 'pricing',
      title: 'Festival Price Boost',
      title_hi: 'त्योहारी मूल्य सलाह',
      title_te: 'పండుగ ధరల సూచన',
      description: 'Similar handloom sarees are selling between ₹7,500 – ₹8,200 for upcoming Dussehra.',
      description_hi: 'दशहरा के लिए समान हथकरघा साड़ियां ₹7,500 – ₹8,200 के बीच बिक रही हैं।',
      description_te: 'దసరా పండుగ కోసం ఇలాంటి చేనేత చీరలు ₹7,500 నుండి ₹8,200 వరకు అమ్ముడవుతున్నాయి.',
      action_type: 'update_price',
      target_id: 'prod_001',
      badge: '+15% Profit'
    },
    {
      id: 'sug_3',
      icon: 'package-alert',
      category: 'inventory',
      title: 'Low Stock Reminder',
      title_hi: 'कम स्टॉक चेतावनी',
      title_te: 'తక్కువ స్టాక్ ఉంది',
      description: 'Terracotta Clay Jug has only 3 units left. 4 buyers are viewing this item.',
      description_hi: 'टेराकोटा मिट्टी के जग के केवल 3 पीस बचे हैं। कारीगरी जारी रखें।',
      description_te: 'మట్టి కూజాలు కేవలం 3 మాత్రమే మిగిలి ఉన్నాయి. కొత్తవి తయారు చేయండి.',
      action_type: 'add_stock',
      target_id: 'prod_003',
      badge: '3 left'
    },
    {
      id: 'sug_4',
      icon: 'calendar',
      category: 'demand',
      title: 'Festival Collection Opportunity',
      title_hi: 'दिवाली संग्रह जोड़ें',
      title_te: 'దీపావళి కలెక్షన్ చేర్చండి',
      description: 'Diwali is in 45 days. Add clay diyas & metallic brass crafts now for early corporate orders.',
      description_hi: 'दिवाली 45 दिनों में है। कॉर्पोरेट आर्डर पाने के लिए मिट्टी के दीये अभी जोड़ें।',
      description_te: 'దీపావళి రాబోతోంది. మట్టి దీపాలు మరియు ఇత్తడి వస్తువులను ఇప్పుడే జోడించండి.',
      action_type: 'create_product',
      badge: 'Seasonal Trend'
    }
  ];

  res.json({ success: true, data: suggestions });
});

// POST Natural Voice Assistant Commands
aiRouter.post('/assistant-command', (req: Request, res: Response) => {
  const query = (req.body.query || '').toLowerCase();
  const lang = req.body.language || 'en';

  let action = 'navigate';
  let targetScreen = 'Home';
  let responseText = "I'm here to help you manage your artisan business. What would you like to do?";
  let responseAudioText = "నేను మీ వ్యాపారానికి సహాయం చేయడానికి సిద్ధంగా ఉన్నాను.";

  if (query.includes('sales') || query.includes('revenue') || query.includes('సేల్స్') || query.includes('बिक्री') || query.includes('कमाई') || query.includes('డబ్బు')) {
    targetScreen = 'SalesDashboard';
    responseText = "Opening your Sales Dashboard. Total sales this month are ₹18,500 across 8 orders.";
    responseAudioText = "మీ సేల్స్ వివరాలు తెరుస్తున్నాను. ఈ నెల మొత్తం అమ్మకాలు ₹18,500.";
  } else if (query.includes('add product') || query.includes('new product') || query.includes('photo') || query.includes('క్రొత్త వస్తువు') || query.includes('नया उत्पाद') || query.includes('ఫోటో')) {
    targetScreen = 'AddProduct';
    responseText = "Let's add a new product! Take a clear photo of your craft.";
    responseAudioText = "కొత్త ఉత్పత్తిని జోడిద్దాం! మీ వస్తువు ఫోటో తీయండి.";
  } else if (query.includes('order') || query.includes('buyer') || query.includes('ఆర్డర్') || query.includes('आर्डर') || query.includes('కొనుగోలు')) {
    targetScreen = 'Orders';
    responseText = "You have 3 new orders waiting to be packed and shipped. Showing orders screen.";
    responseAudioText = "మీకు 3 కొత్త ఆర్డర్లు వచ్చాయి. ఆర్డర్ల వివరాలు చూపిస్తున్నాను.";
  } else if (query.includes('price') || query.includes('pricing') || query.includes('రేటు') || query.includes('ధర') || query.includes('दाम') || query.includes('कीमत')) {
    targetScreen = 'MyProducts';
    responseText = "AI dynamic pricing suggests keeping competitive margins of 35-45% based on your handwork days.";
    responseAudioText = "మీ చేతిపని సమయం ప్రకారం 35 నుండి 45 శాతం లాభం సరైనది.";
  } else if (query.includes('buyer') || query.includes('wholesale') || query.includes('b2b') || query.includes('హోల్‌సేల్') || query.includes('బయ్యర్') || query.includes('थोक')) {
    targetScreen = 'FindBuyers';
    responseText = "Found 4 verified bulk buyers looking for your craft category.";
    responseAudioText = "మీ ఉత్పత్తుల కోసం 4 హోల్‌సేల్ వ్యాపారులు వెతుకుతున్నారు.";
  }

  res.json({
    success: true,
    data: {
      action,
      targetScreen,
      responseText,
      responseAudioText
    }
  });
});
