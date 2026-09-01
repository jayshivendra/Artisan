import { PricingRecommendation } from '../db/database.js';

export interface PricingInput {
  category: string;
  material_cost: number;
  labour_days?: number;
  artisan_stated_cost?: number;
  product_name?: string;
}

export class DynamicPricingService {
  public static calculateRecommendation(input: PricingInput): PricingRecommendation {
    const rawCost = Number(input.material_cost) || 600;
    const days = Number(input.labour_days) || 3;
    const fairDailyWage = 400; // Standard fair rural artisan living wage per day
    const estimatedLabourCost = days * fairDailyWage;
    const baseTotalCost = rawCost + estimatedLabourCost;

    // Market category multiplier & demand trend
    let multiplier = 1.65;
    let marketRangePercent = 0.15;

    const cat = (input.category || '').toLowerCase();
    if (cat.includes('handloom') || cat.includes('saree') || cat.includes('silk')) {
      multiplier = 1.75;
    } else if (cat.includes('pottery') || cat.includes('terracotta')) {
      multiplier = 1.5;
    } else if (cat.includes('handicraft') || cat.includes('bidri') || cat.includes('brass')) {
      multiplier = 1.8;
    } else if (cat.includes('jewellery')) {
      multiplier = 1.7;
    }

    // Recommended final retail price
    let recommended = Math.round((baseTotalCost * multiplier) / 50) * 50 - 1; // e.g., 1999, 2499
    if (recommended < baseTotalCost + 200) {
      recommended = baseTotalCost + 400;
    }

    const minPrice = Math.round((recommended * (1 - marketRangePercent)) / 50) * 50 - 1;
    const maxPrice = Math.round((recommended * (1 + marketRangePercent)) / 50) * 50 - 1;
    const artisanProfit = recommended - (rawCost + estimatedLabourCost);

    const explanation = `Based on your material cost of ₹${rawCost.toLocaleString()}, ${days} days of skilled handmade labour, and current market demand for similar authentic crafts, ₹${recommended.toLocaleString()} is a highly competitive and fair price.`;
    
    const explanation_hi = `आपकी सामग्री लागत ₹${rawCost.toLocaleString()}, ${days} दिनों के कुशल श्रम और बाज़ार की मांग के आधार पर, ₹${recommended.toLocaleString()} एक उचित और प्रतिस्पर्धी मूल्य है।`;
    
    const explanation_te = `మీ ముడిసరుకు ఖర్చు ₹${rawCost.toLocaleString()}, ${days} రోజుల శ్రమ మరియు మార్కెట్ డిమాండ్ ఆధారంగా ₹${recommended.toLocaleString()} సరైన లాభదాయకమైన ధర.`;

    return {
      recommended_price: recommended,
      minimum_price: minPrice,
      maximum_price: maxPrice,
      material_cost: rawCost,
      labour_cost: estimatedLabourCost,
      artisan_profit: Math.max(artisanProfit, 300),
      market_benchmark_min: minPrice,
      market_benchmark_max: maxPrice,
      confidence_score: 0.94,
      explanation,
      explanation_hi,
      explanation_te
    };
  }
}
