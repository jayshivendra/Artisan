export interface User {
  id: string;
  name: string;
  phone: string;
  preferred_language: string;
  craft_categories: string[];
  location: string;
  business_name: string;
  avatar?: string;
  created_at: string;
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
  status_step: number; // 1: Order Received, 2: Packed, 3: Shipped, 4: Delivered
  created_at: string;
  shipping_address: string;
  courier_partner?: string;
  tracking_id?: string;
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

export interface PricingRecommendation {
  product_id?: string;
  recommended_price: number;
  minimum_price: number;
  maximum_price: number;
  material_cost: number;
  labour_cost: number;
  artisan_profit: number;
  market_benchmark_min: number;
  market_benchmark_max: number;
  confidence_score: number;
  explanation: string;
  explanation_hi?: string;
  explanation_te?: string;
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

// In-Memory Database store with seed initializers
class DatabaseStore {
  public users: User[] = [];
  public products: Product[] = [];
  public orders: Order[] = [];
  public buyers: BuyerRequirement[] = [];
  public notifications: NotificationItem[] = [];

  constructor() {
    // Initialized by seed
  }

  public findProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  public addProduct(product: Product): Product {
    this.products.unshift(product);
    return product;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.products[index] = { ...this.products[index], ...updates };
    return this.products[index];
  }

  public deleteProduct(id: string): boolean {
    const lenBefore = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    return this.products.length < lenBefore;
  }

  public updateOrderStatus(orderId: string, status: Order['status'], step: number): Order | null {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return null;
    order.status = status;
    order.status_step = step;
    return order;
  }
}

export const db = new DatabaseStore();
