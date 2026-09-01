import { Product, Order, BuyerRequirement, AISuggestion, NotificationItem } from '../types/index.js';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_001',
    seller_id: 'user_artisan_01',
    name: 'Handwoven Pochampally Ikat Pure Silk Saree (Deep Indigo)',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80'
    ],
    original_image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    enhanced_image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    description: 'Exquisite GI-tagged Pochampally Ikat silk saree handwoven using pure natural mulberry silk and organic dyes. Features intricate geometric double-ikat motifs with an ornate zari border. Takes 7 days of master craftsmanship on a traditional pit loom.',
    description_hi: 'प्राकृतिक शहतूत रेशम और जैविक रंगों से बनी पोचमपल्ली इकत शुद्ध रेशम साड़ी। इसमें जटिल ज्यामितीय डिजाइन और ज़री बॉर्डर है। इसे पारंपरिक करघे पर 7 दिनों में तैयार किया गया है।',
    description_regional: 'పోచంపల్లి ఇక్కత్ స్వచ్ఛమైన పట్టు చీర. సాంప్రదాయ మగ్గంపై 7 రోజుల పాటు సహజ రంగులు మరియు జరీ అంచుతో నేయబడింది.',
    language: 'te',
    category: 'Handloom / Textiles',
    material: 'Pure Mulberry Silk & Zari',
    dimensions: '5.5m Saree + 0.8m Blouse Piece',
    colour: 'Deep Indigo Blue & Crimson Gold',
    production_method: 'Handloom Double-Ikat Weaving',
    making_time_days: 7,
    quantity: 12,
    raw_material_cost: 3200,
    labour_cost: 2500,
    suggested_price: 7499,
    selling_price: 7499,
    status: 'active',
    channels: {
      app_store: true,
      govt_marketplace: true,
      b2b_marketplace: true,
      ondc: true
    },
    created_at: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 'prod_002',
    seller_id: 'user_artisan_01',
    name: 'Organic Cotton Block Print Dupatta (Kalamkari Motifs)',
    images: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Hand-block printed pure organic cotton dupatta adorned with ancient mythological Kalamkari tree-of-life art. Naturally washed in river waters using vegetable madder root and indigo colors.',
    description_hi: 'हस्तनिर्मित कलमकारी ब्लॉक प्रिंटेड शुद्ध कॉटन दुपट्टा। प्राकृतिक वनस्पति रंगों से रंगा हुआ।',
    description_regional: 'స్వచ్ఛమైన కాటన్ కలంకారీ దుపట్టా. చెట్ల రంగులతో అద్దిన సాంప్రదాయ డిజైన్.',
    language: 'te',
    category: 'Handloom / Textiles',
    material: '100% Organic Handspun Cotton',
    dimensions: '2.5m x 1m',
    colour: 'Earthy Rust & Indigo Navy',
    production_method: 'Hand Block Printing',
    making_time_days: 3,
    quantity: 24,
    raw_material_cost: 450,
    labour_cost: 400,
    suggested_price: 1299,
    selling_price: 1299,
    status: 'active',
    channels: {
      app_store: true,
      govt_marketplace: false,
      b2b_marketplace: true,
      ondc: true
    },
    created_at: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    id: 'prod_003',
    seller_id: 'user_artisan_01',
    name: 'Handcrafted Terracotta Clay Water Jug (Cooling Pitcher)',
    images: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Eco-friendly natural red terracotta water pitcher crafted on a potter wheel and wood-fired. Keeps drinking water naturally cool with alkaline mineralization.',
    description_hi: 'पारंपरिक मिट्टी का मटका/जग। पानी को प्राकृतिक रूप से ठंडा और शुद्ध रखता है।',
    description_regional: 'సహజసిద్ధమైన మట్టి కూజా. నీటిని సహజంగా చల్లబరిచే సాంప్రదాయ పాత్ర.',
    language: 'te',
    category: 'Pottery & Clay',
    material: 'Natural Red Clay',
    dimensions: '1.5 Litre Capacity (Height: 22cm)',
    colour: 'Natural Terracotta Earthen',
    production_method: 'Hand-thrown on Pottery Wheel',
    making_time_days: 2,
    quantity: 3,
    raw_material_cost: 120,
    labour_cost: 200,
    suggested_price: 599,
    selling_price: 599,
    status: 'low_stock',
    channels: {
      app_store: true,
      govt_marketplace: true,
      b2b_marketplace: false,
      ondc: true
    },
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: 'prod_004',
    seller_id: 'user_artisan_01',
    name: 'Bidriware Handcrafted Silver Inlay Brass Keepsake Box',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Century-old GI metal handicraft from Deccan artisans. Cast in zinc-copper alloy oxidized to jet black with pure sterling silver wire inlaid in floral jaali patterns.',
    description_hi: 'बिदरीवेयर हस्तशिल्प शुद्ध चांदी की नक्काशीदार धातु का डिब्बा।',
    description_regional: 'బిద్రి కళాఖండం. స్వచ్ఛమైన వెండి తీగలతో చేసిన అపురూపమైన మెటల్ బాక్స్.',
    language: 'te',
    category: 'Handicrafts',
    material: 'Zinc Alloy with Pure Silver Inlay (99.9%)',
    dimensions: '12cm x 8cm x 5cm',
    colour: 'Matte Black & Bright Silver',
    production_method: 'Bidriware Silver Inlay Art',
    making_time_days: 4,
    quantity: 8,
    raw_material_cost: 1100,
    labour_cost: 950,
    suggested_price: 2850,
    selling_price: 2850,
    status: 'active',
    channels: {
      app_store: true,
      govt_marketplace: true,
      b2b_marketplace: true,
      ondc: true
    },
    created_at: new Date(Date.now() - 14 * 86400000).toISOString()
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_101',
    order_number: 'ORD-2026-8841',
    buyer_id: 'b_01',
    buyer_name: 'Ananya Sharma',
    buyer_phone: '+91 98112 33445',
    buyer_location: 'Indiranagar, Bengaluru, Karnataka',
    seller_id: 'user_artisan_01',
    product_id: 'prod_001',
    product_name: 'Handwoven Pochampally Ikat Pure Silk Saree',
    product_image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80',
    quantity: 1,
    unit_price: 7499,
    total_amount: 7499,
    status: 'new',
    status_step: 1,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    shipping_address: 'Flat 402, Lotus Palms, 12th Main, Indiranagar, Bengaluru - 560038'
  },
  {
    id: 'ord_102',
    order_number: 'ORD-2026-8839',
    buyer_id: 'b_02',
    buyer_name: 'Priya Narayanan',
    buyer_phone: '+91 97401 55667',
    buyer_location: 'Mylapore, Chennai, Tamil Nadu',
    seller_id: 'user_artisan_01',
    product_id: 'prod_002',
    product_name: 'Organic Cotton Block Print Dupatta (2 units)',
    product_image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=400&auto=format&fit=crop&q=80',
    quantity: 2,
    unit_price: 1299,
    total_amount: 2598,
    status: 'processing',
    status_step: 2,
    created_at: new Date(Date.now() - 14 * 3600000).toISOString(),
    shipping_address: 'No. 18, North Mada Street, Mylapore, Chennai - 600004'
  },
  {
    id: 'ord_103',
    order_number: 'ORD-2026-8820',
    buyer_id: 'b_03',
    buyer_name: 'Rohit Kulkarni',
    buyer_phone: '+91 98220 99881',
    buyer_location: 'Kothrud, Pune, Maharashtra',
    seller_id: 'user_artisan_01',
    product_id: 'prod_004',
    product_name: 'Bidriware Handcrafted Silver Inlay Brass Box',
    product_image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop&q=80',
    quantity: 1,
    unit_price: 2850,
    total_amount: 2850,
    status: 'shipped',
    status_step: 3,
    created_at: new Date(Date.now() - 28 * 3600000).toISOString(),
    shipping_address: 'B-12, Mayur Heights, Paud Road, Kothrud, Pune - 411038',
    courier_partner: 'India Post Speed Post',
    tracking_id: 'EP948271048IN'
  },
  {
    id: 'ord_104',
    order_number: 'ORD-2026-8790',
    buyer_id: 'b_04',
    buyer_name: 'Meera Sengupta',
    buyer_phone: '+91 98300 44112',
    buyer_location: 'Salt Lake, Kolkata, West Bengal',
    seller_id: 'user_artisan_01',
    product_id: 'prod_001',
    product_name: 'Handwoven Pochampally Ikat Silk Saree',
    product_image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80',
    quantity: 1,
    unit_price: 7499,
    total_amount: 7499,
    status: 'completed',
    status_step: 4,
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    shipping_address: 'Sector 3, Block FD 140, Salt Lake, Kolkata - 700091',
    courier_partner: 'Blue Dart Express',
    tracking_id: 'BD77481920'
  }
];

export const INITIAL_BUYERS: BuyerRequirement[] = [
  {
    id: 'req_001',
    business_name: 'The Grand Heritage Palace & Resorts',
    buyer_type: 'Hotel',
    location: 'Hyderabad & Jaipur',
    verified: true,
    title: 'Looking for 150 Handwoven Ikat Cushion Covers & Runners',
    category: 'Handloom / Textiles',
    quantity_needed: '100 – 250 units',
    budget_per_unit: '₹650 – ₹900 / unit',
    delivery_timeline: 'Within 30 Days',
    details: 'We require authentic handloom Ikat textile runners and matching cushion covers in terracotta and indigo shades for our luxury heritage suites.',
    posted_date: '2 days ago'
  },
  {
    id: 'req_002',
    business_name: 'Viraat Craft Retail & Boutiques',
    buyer_type: 'Retailer',
    location: 'Mumbai & Delhi NCR',
    verified: true,
    title: 'Procuring 50 Pure Silk Pochampally & Kalamkari Sarees',
    category: 'Handloom / Textiles',
    quantity_needed: '30 – 60 units',
    budget_per_unit: '₹5,500 – ₹8,000 / saree',
    delivery_timeline: 'Diwali Festival Collection (Next 45 Days)',
    details: 'Seeking master weavers for certified GI handloom sarees with authentic artisan stories and certificates for our high-end boutique display.',
    posted_date: 'Yesterday'
  },
  {
    id: 'req_003',
    business_name: 'Studio Vistara Interior Architecture',
    buyer_type: 'Interior Designer',
    location: 'Bengaluru, Karnataka',
    verified: true,
    title: 'Need 40 Bidriware Metal Artifacts & Wall Panels',
    category: 'Handicrafts',
    quantity_needed: '20 – 50 units',
    budget_per_unit: '₹2,200 – ₹3,500 / piece',
    delivery_timeline: 'Immediate (15 Days)',
    details: 'Curating bespoke artisanal artifacts for a flagship corporate lobby and executive villas. Silver inlay craftsmanship required.',
    posted_date: '3 days ago'
  },
  {
    id: 'req_004',
    business_name: 'Tribal & Artisan Affairs Procurement (GeM)',
    buyer_type: 'Govt',
    location: 'New Delhi (Central Procurement)',
    verified: true,
    title: 'Government Corporate Gifting: 200 Handcrafted Woodwork Gift Sets',
    category: 'Woodwork',
    quantity_needed: '200 – 500 sets',
    budget_per_unit: '₹1,200 – ₹1,800 / set',
    delivery_timeline: '60 Days',
    details: 'Official government procurement order for international dignitaries and VIP state gifts. GI-tagged authentic artisans given priority.',
    posted_date: 'Just now'
  }
];

export const INITIAL_SUGGESTIONS: AISuggestion[] = [
  {
    id: 'sug_1',
    icon: 'Sparkles',
    category: 'photography',
    title: 'Your blue silk saree may sell 3x better with studio lighting.',
    title_hi: 'आपकी रेशम साड़ी स्टूडियो व्हाइट बैकग्राउंड के साथ 3 गुना ज्यादा बिकेगी।',
    title_te: 'మీ పోచంపల్లి పట్టు చీరను స్టూడియో లైటింగ్‌తో ఉంచితే 3 రెట్లు వేగంగా అమ్ముడవుతుంది.',
    description: 'AI detected warm natural shadows. 1-tap enhance to studio white backdrop.',
    action_type: 'enhance_photo',
    target_id: 'prod_001',
    badge: 'High Impact'
  },
  {
    id: 'sug_2',
    icon: 'TrendingUp',
    category: 'pricing',
    title: 'Similar handloom sarees selling around ₹7,800 – ₹8,400.',
    title_hi: 'समान हथकरघा साड़ियां ₹7,800 – ₹8,400 में बिक रही हैं।',
    title_te: 'ఇలాంటి చేనేత పట్టు చీరలు మార్కెట్లో ₹7,800 నుండి ₹8,400 కి అమ్ముడవుతున్నాయి.',
    description: 'Festival demand for wedding handloom weaves is peaking.',
    action_type: 'update_price',
    target_id: 'prod_001',
    badge: '+15% Demand'
  },
  {
    id: 'sug_3',
    icon: 'AlertTriangle',
    category: 'inventory',
    title: 'You have only 3 units left of Terracotta Water Jugs.',
    title_hi: 'टेराकोटा मिट्टी के जग के केवल 3 पीस बचे हैं।',
    title_te: 'మట్టి కూజాలు కేవలం 3 మాత్రమే మిగిలి ఉన్నాయి.',
    description: '4 wholesale hotel buyers are browsing this product.',
    action_type: 'add_stock',
    target_id: 'prod_003',
    badge: 'Low Stock'
  },
  {
    id: 'sug_4',
    icon: 'Calendar',
    category: 'demand',
    title: 'Festival season is approaching. Consider adding your Diwali collection.',
    title_hi: 'त्योहारों का मौसम आ रहा है। नया कलेक्शन अभी जोड़ें।',
    title_te: 'పండుగల సీజన్ రాబోతోంది. కొత్త కలెక్షన్‌ను ఇప్పుడే జోడించండి.',
    description: 'Diya sets and brass items receive peak search traffic starting this week.',
    action_type: 'create_product',
    badge: 'Festive Season'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'New Order Received! 🛍️',
    message: 'Ananya Sharma placed an order for Pochampally Silk Saree (₹7,499). Click to pack.',
    time: '2 hours ago',
    type: 'order',
    read: false,
    audio_text: 'కొత్త ఆర్డర్ వచ్చింది! అనన్య శర్మ నుండి ₹7,499 విలువైన పోచంపల్లి చీర ఆర్డర్ చేయబడింది.'
  },
  {
    id: 'notif_2',
    title: 'Festival Demand Alert! ✨',
    message: 'Dussehra & Diwali festival search volume for Handloom Sarees increased by 240%.',
    time: '5 hours ago',
    type: 'festival',
    read: false,
    audio_text: 'పండుగ సీజన్ డిమాండ్ పెరిగింది. మీ కొత్త కలెక్షన్ ను జోడించండి.'
  },
  {
    id: 'notif_3',
    title: 'B2B Match Found! 🤝',
    message: 'The Grand Heritage Palace hotel is looking for 150 Ikat textiles matching your craft.',
    time: '1 day ago',
    type: 'b2b',
    read: true,
    audio_text: 'మీ చేతివృత్తులకు సరిపోయే పెద్ద ఆర్డర్ వచ్చింది. వివరాలు చూడండి.'
  }
];
