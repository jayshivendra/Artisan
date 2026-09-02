export type LanguageCode = 'en' | 'hi' | 'te' | 'ta' | 'bn' | 'mr' | 'gu' | 'kn' | 'ml' | 'pa';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  scriptSample: string;
  voiceLang: string;
}

export type ScreenType = 
  | 'welcome'
  | 'language_select'
  | 'category_select'
  | 'profile_setup'
  | 'home'
  | 'add_product'
  | 'my_products'
  | 'product_detail'
  | 'orders'
  | 'order_detail'
  | 'find_buyers'
  | 'buyer_detail'
  | 'sales_dashboard'
  | 'gov_marketplace'
  | 'notifications'
  | 'profile'
  | 'edit_profile'
  | 'buyer_marketplace'
  | 'buyer_cart'
  | 'buyer_orders'
  | 'buyer_wishlist'
  | 'help_tutorials';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  preferred_language: LanguageCode;
  craft_categories: string[];
  location: string;
  business_name: string;
  avatar?: string;
  bio?: string;
  upi_id?: string;
  bank_name?: string;
  bank_account?: string;
  role?: 'seller' | 'buyer';
  is_onboarded: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Product {
  id: string;
  seller_id: string;
  name: string;
  images: string[];
  original_image?: string;
  enhanced_image?: string;
  description: string;
  description_hi: string;
  description_regional?: string;
  language: string;
  category: string;
  material: string;
  dimensions: string;
  colour: string;
  production_method: string;
  making_time_days: number;
  quantity: number;
  raw_material_cost: number;
  labour_cost: number;
  suggested_price: number;
  selling_price: number;
  status: 'active' | 'low_stock' | 'draft' | 'archived';
  artisan_name?: string;
  origin_region?: string;
  badge?: string;
  channels: {
    app_store: boolean;
    govt_marketplace: boolean;
    b2b_marketplace: boolean;
    ondc: boolean;
  };
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  buyer_id: string;
  buyer_name: string;
  buyer_phone: string;
  buyer_location: string;
  seller_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  status: 'new' | 'processing' | 'shipped' | 'completed';
  status_step: number; // 1: Received, 2: Packed, 3: Shipped, 4: Delivered
  created_at: string;
  shipping_address: string;
  courier_partner?: string;
  tracking_id?: string;
  payment_method?: string;
}

export interface BuyerRequirement {
  id: string;
  business_name: string;
  buyer_type: 'Retailer' | 'Wholesaler' | 'Hotel' | 'Interior Designer' | 'Exporter' | 'Corporate' | 'Govt';
  location: string;
  verified: boolean;
  title: string;
  category: string;
  quantity_needed: string;
  budget_per_unit: string;
  delivery_timeline: string;
  details: string;
  posted_date: string;
}

export interface AISuggestion {
  id: string;
  icon: string;
  category: string;
  title: string;
  title_hi?: string;
  title_te?: string;
  description: string;
  description_hi?: string;
  description_te?: string;
  action_type: string;
  target_id?: string;
  badge: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'price' | 'festival' | 'b2b' | 'system';
  read: boolean;
  audio_text: string;
}
