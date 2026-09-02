import { Product, Order, BuyerRequirement, AISuggestion, NotificationItem } from '../types/index.js';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_001',
    seller_id: 'user_artisan_01',
    name: 'Royal Jaipur Blue Pottery Floral Motif Vase',
    images: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&auto=format&fit=crop&q=80'
    ],
    original_image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
    enhanced_image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
    description: 'A striking turquoise blue vase adorned with traditional Mughal floral arabesques. Made from Egyptian paste using quartz stone powder, Multani mitti, and natural mineral oxides, fired only once for a lustrous ceramic finish.',
    description_hi: 'पारंपरिक मुग़ल पुष्प डिजाइनों से सजी राजस्थानी ब्लू पॉटरी फूलदान। क्वार्ट्ज पत्थर और प्राकृतिक खनिजों से निर्मित।',
    description_regional: 'జైపూర్ బ్లూ పాటర్ సాంప్రదాయ పూల కుండీ. సహజ ఖనిజ రంగులతో రూపొందించబడింది.',
    language: 'hi',
    category: 'Pottery & Clay',
    material: 'Quartz Powder, Glass & Natural Oxides',
    dimensions: '12" Height x 5" Diameter',
    colour: 'Royal Turquoise & Cobalt Blue',
    production_method: 'Single-fire Egyptian Ceramic Paste',
    making_time_days: 4,
    quantity: 14,
    raw_material_cost: 600,
    labour_cost: 750,
    suggested_price: 1850,
    selling_price: 1850,
    status: 'active',
    artisan_name: 'Pandit Ramswaroop Sharma',
    origin_region: 'Jaipur, Rajasthan',
    badge: 'GI Tagged Heritage Craft',
    channels: {
      app_store: true,
      govt_marketplace: true,
      b2b_marketplace: true,
      ondc: true
    },
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'prod_002',
    seller_id: 'user_artisan_01',
    name: 'Authentic Banarasi Handloom Katan Silk Saree',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80'
    ],
    original_image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    enhanced_image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    description: 'Handwoven on heirloom wooden pit looms over 18 days of rigorous craftsmanship. Features an elaborate Kadwa weave floral jaal with rich golden zari pallu, perfect for weddings, festivities, and heirlooms.',
    description_hi: '18 दिनों की कड़ी मेहनत से करघे पर बुनी गई प्रामाणिक बनारसी कतान सिल्क साड़ी। शुद्ध सोने-चांदी के ज़री का काम।',
    description_regional: 'వారణాసి చేనేత స్వచ్ఛమైన పట్టు చీర. బంగారు జరీ డిజైన్లతో అద్భుతంగా రూపొందించబడింది.',
    language: 'hi',
    category: 'Handloom / Textiles',
    material: 'Pure Mulberry Katan Silk & Gold Zari',
    dimensions: '5.5m Saree + 0.8m Blouse',
    colour: 'Royal Crimson & Gold',
    production_method: 'Handloom Pit-Loom Weaving',
    making_time_days: 18,
    quantity: 6,
    raw_material_cost: 5500,
    labour_cost: 4500,
    suggested_price: 12400,
    selling_price: 12400,
    status: 'active',
    artisan_name: 'Savitri Devi & Weavers Collective',
    origin_region: 'Varanasi, Uttar Pradesh',
    badge: '100% Pure Silk Certified',
    channels: {
      app_store: true,
      govt_marketplace: true,
      b2b_marketplace: true,
      ondc: true
    },
    created_at: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: 'prod_003',
    seller_id: 'user_artisan_01',
    name: 'Kashmiri Hand-Carved Walnut Wood Trinket Box',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Carved out of single seasoned walnut logs naturally aged for 3 years. Intricate deep-relief carving depicts traditional Chinar leaves and almond blossom motifs, finished with natural beeswax buffing.',
    description_hi: 'कश्मीरी अखरोट की लकड़ी से हाथ से नक्काशीदार आभूषण बॉक्स। चिनार के पत्तों की पारंपरिक कला।',
    description_regional: 'కాశ్మీరీ అక్రోట్ చెక్క ఆభరణాల పెట్టె. చేతితో చెక్కబడిన సాంప్రదాయ నమూనాలు.',
    language: 'hi',
    category: 'Woodcraft',
    material: 'Seasoned Kashmiri Walnut Wood & Velvet',
    dimensions: '8" L x 5" W x 3.5" H',
    colour: 'Natural Warm Walnut Brown',
    production_method: 'Hand Chisel Wood Carving',
    making_time_days: 5,
    quantity: 18,
    raw_material_cost: 1100,
    labour_cost: 1200,
    suggested_price: 3200,
    selling_price: 3200,
    status: 'active',
    artisan_name: 'Ghulam Rasool Mir',
    origin_region: 'Srinagar, Jammu & Kashmir',
    badge: 'Seasoned Walnut Wood',
    channels: {
      app_store: true,
      govt_marketplace: true,
      b2b_marketplace: true,
      ondc: true
    },
    created_at: new Date(Date.now() - 8 * 86400000).toISOString()
  },
  {
    id: 'prod_004',
    seller_id: 'user_artisan_01',
    name: 'Dhokra Lost-Wax Cast Brass Tribal Musician Figurine',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'An evocative antique-patina brass sculpture celebrating indigenous tribal folk music. Created via the non-repetitive lost-wax casting technique where every individual sculpture has its own destroyed clay mold, making every piece 100% unique.',
    description_hi: '4000 साल पुरानी ढोकरा ढलाई तकनीक से बनी पीतल की आदिवासी संगीतकार प्रतिमा।',
    description_regional: 'ధోక్రా మెటల్ క్రాఫ్ట్ ఇత్తడి శిల్పం. పురాతన పద్ధతిలో చేతితో తయారు చేయబడింది.',
    language: 'hi',
    category: 'Metalwork',
    material: 'Bell Metal Brass Alloy',
    dimensions: '9.5" Height x 4" Width',
    colour: 'Antique Brass Gold',
    production_method: 'Ancient Lost-Wax Metal Casting',
    making_time_days: 7,
    quantity: 12,
    raw_material_cost: 950,
    labour_cost: 1100,
    suggested_price: 2650,
    selling_price: 2650,
    status: 'active',
    artisan_name: 'Ganga Devi Murmu',
    origin_region: 'Bastar, Chhattisgarh',
    badge: 'Ancient 4,000-Yr Craft',
    channels: {
      app_store: true,
      govt_marketplace: true,
      b2b_marketplace: true,
      ondc: true
    },
    created_at: new Date(Date.now() - 12 * 86400000).toISOString()
  },
  {
    id: 'prod_005',
    seller_id: 'user_artisan_01',
    name: 'Handpainted Madhubani "Tree of Life" Folk Artwork',
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Detailed Mithila painting using fine double-line borders, geometric patterns, and nature motifs representing harmony, fertility, and cosmic order. Painted entirely with bamboo nibs and natural organic pigments on handmade cotton rag paper.',
    description_hi: 'प्राकृतिक रंगों और बांस की कलम से हस्तनिर्मित पारंपरिक मधुबनी "ट्री ऑफ लाइफ" पेंटिंग।',
    description_regional: 'మధుబని సాంప్రదాయ చిత్రలేఖనం. సహజ రంగులతో చేతితో గీసిన అద్భుత కళ.',
    language: 'hi',
    category: 'Folk Art & Paintings',
    material: 'Handmade Cotton Rag Paper & Organic Dyes',
    dimensions: '18" x 24" (Unframed)',
    colour: 'Earthy Ochre, Crimson & Forest Green',
    production_method: 'Bamboo Nib Hand Painting',
    making_time_days: 8,
    quantity: 8,
    raw_material_cost: 1200,
    labour_cost: 2100,
    suggested_price: 4500,
    selling_price: 4500,
    status: 'active',
    artisan_name: 'Mithila Karigari Collective',
    origin_region: 'Mithila, Bihar',
    badge: 'Natural Organic Pigments',
    channels: {
      app_store: true,
      govt_marketplace: true,
      b2b_marketplace: true,
      ondc: true
    },
    created_at: new Date(Date.now() - 14 * 86400000).toISOString()
  },
  {
    id: 'prod_006',
    seller_id: 'user_artisan_01',
    name: 'Eco-Friendly Channapatna Hand-Turned Wooden Toy Train',
    images: [
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Heritage wooden toy handcrafted on traditional lathes using soft ivory wood (Aale Mara). Polished to a high sheen using natural lac and plant-based non-toxic vegetable dyes. Safe for kids and a delightful decorative keepsake.',
    description_hi: 'प्राकृतिक रंगों और लाख से पॉलिश किया गया चन्नापटना लकड़ी का खिलौना ट्रेन। बच्चों के लिए 100% सुरक्षित।',
    description_regional: 'చెన్నపట్టణ సాంప్రదాయ చెక్క బొమ్మల రైలు. సహజ రంగులతో సురక్షితంగా తయారు చేయబడింది.',
    language: 'kn',
    category: 'Woodcraft',
    material: 'Ivory Wood (Wrightia Tinctoria) & Natural Lac',
    dimensions: '14" Length (3 Detachable Carriages)',
    colour: 'Vibrant Multi-Colour (Red, Yellow, Green)',
    production_method: 'Traditional Lathe Turning & Lacquering',
    making_time_days: 2,
    quantity: 25,
    raw_material_cost: 250,
    labour_cost: 380,
    suggested_price: 950,
    selling_price: 950,
    status: 'active',
    artisan_name: 'Master Venkatesh Gowda',
    origin_region: 'Channapatna, Karnataka',
    badge: '100% Non-Toxic & Child-Safe',
    channels: {
      app_store: true,
      govt_marketplace: true,
      b2b_marketplace: true,
      ondc: true
    },
    created_at: new Date(Date.now() - 16 * 86400000).toISOString()
  },
  {
    id: 'prod_007',
    seller_id: 'user_artisan_01',
    name: 'Handcrafted Rajasthani Embroidered Leather Mojari',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Traditional pointed-toe Jodhpur juttis hand-stitched with durable cotton cord and embroidered with intricate golden thread motifs. Features vegetable-tanned soft leather that molds gracefully to your feet over time.',
    description_hi: 'जोधपुरी कशीदाकारी वाली शुद्ध चमड़े की मोजड़ी / जूती। आरामदायक और पारंपरिक।',
    description_regional: 'రాజస్థానీ ఎంబ్రాయిడరీ లెదర్ మోజారి. సాంప్రదాయ రీతిలో చేతితో కుట్టబడినది.',
    language: 'hi',
    category: 'Handcrafted Leather',
    material: 'Vegetable Tanned Camel Leather & Resham Silk Thread',
    dimensions: 'Available in Sizes 7 to 11',
    colour: 'Tan Brown & Golden Zari',
    production_method: 'Hand Stitched & Embroidered',
    making_time_days: 3,
    quantity: 15,
    raw_material_cost: 480,
    labour_cost: 550,
    suggested_price: 1499,
    selling_price: 1499,
    status: 'active',
    artisan_name: 'Bhanwar Lal & Sons',
    origin_region: 'Jodhpur, Rajasthan',
    badge: 'Vegetable Tanned Leather',
    channels: {
      app_store: true,
      govt_marketplace: false,
      b2b_marketplace: true,
      ondc: true
    },
    created_at: new Date(Date.now() - 18 * 86400000).toISOString()
  },
  {
    id: 'prod_008',
    seller_id: 'user_artisan_01',
    name: 'Tanjore 22K Gold Foil Handpainted Goddess Lakshmi',
    images: [
      'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'A classic sacred Tanjore masterpiece with raised 3D relief ornamentation (gesso work) overlaid with certified 22-karat pure gold leaf and sparkling semi-precious gems. Preserves its radiant glow for generations.',
    description_hi: '22 कैरेट शुद्ध सोने की पन्नी और कीमती पत्थरों से सुसज्जित तंजौर देवी लक्ष्मी पेंटिंग।',
    description_regional: 'తంజావూరు 22K బంగారు రేకు దేవతా చిత్రలేఖనం. సాంప్రదాయ పద్ధతిలో తయారు చేయబడింది.',
    language: 'ta',
    category: 'Folk Art & Paintings',
    material: 'Teakwood Plank, Gesso Chalk Paste & 22K Gold Leaf',
    dimensions: '16" x 20" (In Carved Teak Frame)',
    colour: '22K Brilliant Gold & Royal Scarlet',
    production_method: 'Gesso Relief Work & Gold Foil Gilding',
    making_time_days: 21,
    quantity: 4,
    raw_material_cost: 7200,
    labour_cost: 6500,
    suggested_price: 18500,
    selling_price: 18500,
    status: 'active',
    artisan_name: 'Thanjavur Art Heritage Trust',
    origin_region: 'Thanjavur, Tamil Nadu',
    badge: 'Authentic 22K Gold Foil',
    channels: {
      app_store: true,
      govt_marketplace: true,
      b2b_marketplace: true,
      ondc: true
    },
    created_at: new Date(Date.now() - 20 * 86400000).toISOString()
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_101',
    order_number: 'ORD-89214',
    buyer_id: 'buyer_001',
    buyer_name: 'Dr. Shivendra Jay',
    buyer_phone: '+91 98765 43210',
    buyer_location: 'Bengaluru, Karnataka',
    seller_id: 'user_artisan_01',
    product_id: 'prod_001',
    product_name: 'Royal Jaipur Blue Pottery Floral Motif Vase',
    product_image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
    quantity: 1,
    unit_price: 1850,
    total_amount: 1850,
    status: 'processing',
    status_step: 2,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    shipping_address: '42, Heritage Enclave, Indiranagar, Bengaluru - 560038',
    courier_partner: 'BlueDart Express',
    tracking_id: 'BLUEDART-84920491',
    payment_method: 'UPI (Instant QR)'
  },
  {
    id: 'ord_102',
    order_number: 'ORD-88102',
    buyer_id: 'buyer_002',
    buyer_name: 'Anita Sharma',
    buyer_phone: '+91 98112 33445',
    buyer_location: 'New Delhi, Delhi',
    seller_id: 'user_artisan_01',
    product_id: 'prod_006',
    product_name: 'Eco-Friendly Channapatna Wooden Toy Train',
    product_image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop&q=80',
    quantity: 2,
    unit_price: 950,
    total_amount: 1900,
    status: 'completed',
    status_step: 4,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    shipping_address: 'B-12, Vasant Vihar, New Delhi - 110057',
    courier_partner: 'India Post Speed Post',
    tracking_id: 'INPOST-55910248',
    payment_method: 'Credit Card (Visa)'
  }
];

export const INITIAL_BUYERS: BuyerRequirement[] = [
  {
    id: 'req_01',
    business_name: 'FabIndia Heritage Boutique',
    buyer_type: 'Retailer',
    location: 'Mumbai, Maharashtra',
    verified: true,
    title: 'Urgent Requirement for 50 Blue Pottery Planters & Vases',
    category: 'Pottery & Clay',
    quantity_needed: '50 units',
    budget_per_unit: '₹1,600 - ₹2,000 / pc',
    delivery_timeline: 'Within 25 Days',
    details: 'Looking for verified GI-certified Jaipur blue pottery floral vases and indoor planters for our upcoming Diwali showcase.',
    posted_date: '2 days ago'
  },
  {
    id: 'req_02',
    business_name: 'Taj Palace & Resorts Group',
    buyer_type: 'Hotel',
    location: 'Udaipur, Rajasthan',
    verified: true,
    title: 'Bespoke Madhubani & Tanjore Wall Murals',
    category: 'Folk Art & Paintings',
    quantity_needed: '12 Framed Murals',
    budget_per_unit: '₹15,000 - ₹22,000 / pc',
    delivery_timeline: 'Within 45 Days',
    details: 'Direct commission for luxury heritage suites. Need authentic 22K gold leaf Tanjore art and Mithila tree of life paintings.',
    posted_date: '5 days ago'
  }
];

export const INITIAL_SUGGESTIONS: AISuggestion[] = [
  {
    id: 'sug_01',
    icon: 'Sparkles',
    category: 'Demand Forecast',
    title: 'Festival Handloom Demand Surge',
    title_hi: 'त्योहारी सीजन में हथकरघा सिल्क की भारी मांग',
    title_te: 'పండుగల సమయంలో చేనేత పట్టుకు భారీ గిరాకీ',
    description: 'Upcoming Diwali & wedding season is driving a 42% spike in silk saree & brass craft searches. We recommend listing 5 more items.',
    description_hi: 'आगामी त्योहारों के कारण सिल्क साड़ियों की खोज में 42% की वृद्धि।',
    description_te: 'రాబోయే పండుగల దృష్ట్యా పట్టు చీరల అన్వేషణలు 42% పెరిగాయి.',
    action_type: 'add_product',
    badge: 'High Impact'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_01',
    title: 'New Order Received! 🛍️',
    message: 'Dr. Shivendra Jay placed an order for Royal Jaipur Blue Pottery Vase.',
    time: '2 hours ago',
    type: 'order',
    read: false,
    audio_text: 'You have received a new order for Jaipur Blue Pottery Vase from Dr. Shivendra Jay.'
  }
];
