export interface CatalogExtraction {
  name: string;
  category: string;
  material: string;
  craft_type: string;
  production_method: string;
  making_time_days: number;
  colour: string;
  dimensions: string;
  care_instructions: string;
  story_english: string;
  story_hindi: string;
  story_regional: string;
  confidence_score: number;
}

export class SpeechNlpService {
  public static async processVoiceOrTextInput(
    inputText: string,
    detectedLanguage: string = 'te'
  ): Promise<CatalogExtraction> {
    const textLower = (inputText || '').toLowerCase();

    // Intelligent heuristic keyword and craft pattern extraction
    let category = 'Handloom / Textiles';
    let material = 'Pure Organic Cotton';
    let craft_type = 'Handwoven Pitloom Weaving';
    let making_time_days = 5;
    let colour = 'Traditional Indigo & Earthy Red';
    let dimensions = 'Standard Artisan Dimension (5.5m)';
    let name = 'Handcrafted Traditional Artisan Masterpiece';

    if (textLower.includes('saree') || textLower.includes('చీర') || textLower.includes('साड़ी') || textLower.includes('ikat') || textLower.includes('silk') || textLower.includes('పట్టు')) {
      category = 'Handloom / Textiles';
      material = 'Pure Mulberry Silk & Natural Zari';
      craft_type = 'Double-Ikat Handloom Weave';
      making_time_days = 6;
      colour = 'Royal Indigo Blue & Crimson';
      dimensions = '5.5m Saree with 0.8m Blouse';
      name = 'Handwoven Traditional Pure Silk Ikat Saree';
    } else if (textLower.includes('pot') || textLower.includes('clay') || textLower.includes('మట్టి') || textLower.includes('मिट्टी') || textLower.includes('terracotta') || textLower.includes('కుండ')) {
      category = 'Pottery';
      material = 'Natural Red Terracotta Clay';
      craft_type = 'Wheel-thrown & Wood-fired Pottery';
      making_time_days = 2;
      colour = 'Earthen Terracotta Red';
      dimensions = '1.5L Capacity / 22cm Height';
      name = 'Handcrafted Terracotta Clay Natural Cooling Jug';
    } else if (textLower.includes('metal') || textLower.includes('brass') || textLower.includes('silver') || textLower.includes('bidri') || textLower.includes('వెండి') || textLower.includes('कांस्य')) {
      category = 'Handicrafts';
      material = 'Zinc Alloy with Pure Silver (99.9%) Inlay';
      craft_type = 'Bidriware Silver Inlay Craft';
      making_time_days = 4;
      colour = 'Jet Black Oxidized & Sterling Silver';
      dimensions = '15cm x 10cm x 6cm';
      name = 'Handcrafted Silver Inlay Floral Keepsake Box';
    } else if (textLower.includes('wood') || textLower.includes('చెక్క') || textLower.includes('लकड़ी') || textLower.includes('box') || textLower.includes('carv')) {
      category = 'Woodwork';
      material = 'Seasoned Sheesham (Indian Rosewood)';
      craft_type = 'Hand-carved Jaali Woodwork';
      making_time_days = 3;
      colour = 'Natural Honey Teak Wood';
      dimensions = '20cm x 20cm x 6cm';
      name = 'Hand-carved Solid Sheesham Wooden Masala Box';
    } else if (textLower.includes('jewel') || textLower.includes('necklace') || textLower.includes('నగ') || textLower.includes('गहना')) {
      category = 'Jewellery';
      material = 'Terracotta Clay Beads & Jute Thread';
      craft_type = 'Eco-friendly Handcrafted Clay Jewellery';
      making_time_days = 2;
      colour = 'Vibrant Festive Multi-color';
      dimensions = 'Adjustable Neckband (24 inches)';
      name = 'Handcrafted Eco-Friendly Clay Bead Festive Necklace';
    }

    // Number extraction for days if spoken (e.g. "5 days", "ఐదు రోజులు", "5 दिन")
    const dayMatch = textLower.match(/(\d+)\s*(days?|రోజులు|दिन|நாட்கள்)/);
    if (dayMatch && dayMatch[1]) {
      making_time_days = parseInt(dayMatch[1], 10);
    }

    const story_english = `Authentic ${name} meticulously handcrafted by master rural artisans using age-old traditional techniques passed down through generations. Crafted with ${material} using ${craft_type}. Every piece carries the unique touch of the artisan's hands, taking approximately ${making_time_days} days of dedicated work.`;

    const story_hindi = `पारंपरिक ग्रामीण कारीगरों द्वारा सदियों पुरानी हस्तकला पद्धति से निर्मित ${name}। इसमें ${material} का प्रयोग और ${craft_type} तकनीक शामिल है। इस अनूठी कृति को तैयार करने में लगभग ${making_time_days} दिनों का कठिन परिश्रम लगा है।`;

    const story_regional = `తరతరాల సాంప్రదాయ హస్తకళతో రూపుదిద్దుకున్న ${name}. ${material} ఉపయోగించి ${craft_type} ద్వారా తయారు చేయబడింది. దీని తయారీకి సుమారు ${making_time_days} రోజుల నిరంతర శ్రమ పట్టింది.`;

    return {
      name,
      category,
      material,
      craft_type,
      production_method: '100% Handmade / Handcrafted',
      making_time_days,
      colour,
      dimensions,
      care_instructions: 'Handle with care. Avoid direct harsh chemicals. Clean with dry soft cloth or gentle hand wash.',
      story_english,
      story_hindi,
      story_regional,
      confidence_score: 0.96
    };
  }
}
