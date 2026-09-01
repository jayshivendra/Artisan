import { db, BuyerRequirement, Product } from '../db/database.js';

export interface B2BProposal {
  buyer_id: string;
  artisan_id: string;
  selected_product_ids: string[];
  proposed_unit_price: number;
  quantity: number;
  total_value: number;
  delivery_time_days: number;
  message_english: string;
  message_regional: string;
  sample_availability: boolean;
  gi_certified: boolean;
}

export class B2BBuyerService {
  public static generateQuotationProposal(buyerReqId: string, productId?: string): B2BProposal | null {
    const buyer = db.buyers.find(b => b.id === buyerReqId);
    if (!buyer) return null;

    const matchedProduct = productId 
      ? db.findProductById(productId)
      : db.products.find(p => p.category.toLowerCase() === buyer.category.toLowerCase()) || db.products[0];

    const unitPrice = matchedProduct ? Math.round(matchedProduct.selling_price * 0.8) : 650; // 20% wholesale discount
    const defaultQty = 100;
    const totalVal = unitPrice * defaultQty;

    const message_english = `Namaste ${buyer.business_name}. We are master rural artisans specializing in authentic ${matchedProduct?.category || 'handicrafts'}. We would be delighted to supply ${defaultQty} units of our GI-certified ${matchedProduct?.name || 'artisan creations'} at ₹${unitPrice}/unit within 25 days. Quality assurance & sample pieces available.`;

    const message_regional = `నమస్కారం ${buyer.business_name}. మేము సాంప్రదాయ చేతివృత్తుల నిపుణులం. మీ ఆర్డర్ కోసం ₹${unitPrice}/పీస్ చొప్పున ${defaultQty} యూనిట్లు అందించడానికి సిద్ధంగా ఉన్నాము.`;

    return {
      buyer_id: buyer.id,
      artisan_id: 'user_artisan_01',
      selected_product_ids: matchedProduct ? [matchedProduct.id] : [],
      proposed_unit_price: unitPrice,
      quantity: defaultQty,
      total_value: totalVal,
      delivery_time_days: 25,
      message_english,
      message_regional,
      sample_availability: true,
      gi_certified: true
    };
  }
}
