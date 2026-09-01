import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Product, Order, BuyerRequirement, AISuggestion, NotificationItem, ScreenType } from '../types/index.js';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_BUYERS, INITIAL_SUGGESTIONS, INITIAL_NOTIFICATIONS } from '../data/mockData.js';

interface AddProductDraft {
  step: number;
  photoUrl: string;
  enhancedPhotoUrl: string;
  selectedBgPreset: 'studio' | 'white' | 'light' | 'original';
  voiceText: string;
  name: string;
  category: string;
  material: string;
  craft_type: string;
  production_method: string;
  making_time_days: number;
  dimensions: string;
  colour: string;
  description_en: string;
  description_hi: string;
  description_reg: string;
  raw_material_cost: number;
  labour_cost: number;
  suggested_price: number;
  selling_price: number;
  price_range_min: number;
  price_range_max: number;
  artisan_profit: number;
  pricing_explanation: string;
  quantity: number;
  channels: {
    app_store: boolean;
    govt_marketplace: boolean;
    b2b_marketplace: boolean;
    ondc: boolean;
  };
}

const initialDraftState: AddProductDraft = {
  step: 1,
  photoUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
  enhancedPhotoUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
  selectedBgPreset: 'studio',
  voiceText: '',
  name: 'Handwoven Pochampally Ikat Silk Saree',
  category: 'Handloom / Textiles',
  material: 'Pure Mulberry Silk & Natural Zari',
  craft_type: 'Double-Ikat Handloom Weave',
  production_method: '100% Handmade',
  making_time_days: 6,
  dimensions: '5.5m Saree with 0.8m Blouse',
  colour: 'Royal Indigo Blue & Crimson',
  description_en: 'Authentic Handwoven Pochampally Ikat silk saree meticulously handcrafted by master rural artisans using pure mulberry silk and natural dyes.',
  description_hi: 'पारंपरिक ग्रामीण कारीगरों द्वारा शुद्ध रेशम और प्राकृतिक रंगों से निर्मित पोचमपल्ली इकत सिल्क साड़ी।',
  description_reg: 'పోచంపల్లి ఇక్కత్ స్వచ్ఛమైన పట్టు చీర. సహజ రంగులతో సాంప్రదాయ మగ్గంపై తయారు చేయబడింది.',
  raw_material_cost: 2800,
  labour_cost: 2400,
  suggested_price: 6999,
  selling_price: 6999,
  price_range_min: 6299,
  price_range_max: 7699,
  artisan_profit: 1799,
  pricing_explanation: 'Based on your material cost of ₹2,800, 6 days of skilled handmade labour, and current festive demand, ₹6,999 is a competitive and fair price.',
  quantity: 10,
  channels: {
    app_store: true,
    govt_marketplace: true,
    b2b_marketplace: true,
    ondc: true
  }
};

interface AppStateContextType {
  currentScreen: ScreenType;
  navigateTo: (screen: ScreenType) => void;
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  orders: Order[];
  advanceOrderStatus: (orderId: string) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  buyers: BuyerRequirement[];
  selectedBuyerId: string | null;
  setSelectedBuyerId: (id: string | null) => void;
  suggestions: AISuggestion[];
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  unreadNotifsCount: number;
  productDraft: AddProductDraft;
  updateProductDraft: (updates: Partial<AddProductDraft>) => void;
  resetProductDraft: () => void;
  isMobileDeviceView: boolean;
  setIsMobileDeviceView: (val: boolean) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    const onboarded = localStorage.getItem('karigar_onboarded');
    return onboarded === 'true' ? 'home' : 'welcome';
  });

  const [isMobileDeviceView, setIsMobileDeviceView] = useState<boolean>(true);

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('karigar_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      id: 'user_artisan_01',
      name: 'Lakshmi Devi',
      phone: '+91 98480 22334',
      preferred_language: 'te',
      craft_categories: ['Handloom / Textiles', 'Handicrafts'],
      location: 'Pochampally, Telangana, India',
      business_name: 'Lakshmi Pochampally Handlooms',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      is_onboarded: true
    };
  });

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const [buyers, setBuyers] = useState<BuyerRequirement[]>(INITIAL_BUYERS);
  const [selectedBuyerId, setSelectedBuyerId] = useState<string | null>(null);

  const [suggestions, setSuggestions] = useState<AISuggestion[]>(INITIAL_SUGGESTIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const [productDraft, setProductDraft] = useState<AddProductDraft>(initialDraftState);

  // Sync to Backend if running, fallback seamlessly
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data && json.data.length > 0) {
          setProducts(json.data);
        }
      })
      .catch(() => {});

    fetch('/api/orders')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data && json.data.length > 0) {
          setOrders(json.data);
        }
      })
      .catch(() => {});

    fetch('/api/buyers')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data && json.data.length > 0) {
          setBuyers(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const navigateTo = (screen: ScreenType) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem('karigar_user', JSON.stringify(next));
      if (next.is_onboarded) {
        localStorage.setItem('karigar_onboarded', 'true');
      }
      return next;
    });
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
    // Try POST to backend
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    }).catch(() => {});
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).catch(() => {});
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    fetch(`/api/products/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const duplicateProduct = (id: string) => {
    const orig = products.find(p => p.id === id);
    if (!orig) return;
    const duplicated: Product = {
      ...orig,
      id: `prod_${Date.now()}`,
      name: `${orig.name} (Copy)`,
      status: 'draft',
      created_at: new Date().toISOString()
    };
    setProducts(prev => [duplicated, ...prev]);
  };

  const advanceOrderStatus = (orderId: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== orderId) return ord;
        let nextStep = ord.status_step + 1;
        let nextStatus: Order['status'] = ord.status;
        if (nextStep === 2) nextStatus = 'processing';
        else if (nextStep === 3) nextStatus = 'shipped';
        else if (nextStep >= 4) {
          nextStep = 4;
          nextStatus = 'completed';
        }
        const updated = {
          ...ord,
          status_step: nextStep,
          status: nextStatus,
          courier_partner: nextStep >= 3 ? ord.courier_partner || 'India Post Speed Post' : undefined,
          tracking_id: nextStep >= 3 ? ord.tracking_id || `INP${Date.now().toString().slice(-8)}` : undefined
        };
        fetch(`/api/orders/${orderId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: nextStatus, step: nextStep })
        }).catch(() => {});
        return updated;
      })
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    fetch(`/api/auth/notifications/${id}/read`, { method: 'POST' }).catch(() => {});
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const updateProductDraft = (updates: Partial<AddProductDraft>) => {
    setProductDraft(prev => ({ ...prev, ...updates }));
  };

  const resetProductDraft = () => {
    setProductDraft({ ...initialDraftState, step: 1 });
  };

  return (
    <AppStateContext.Provider
      value={{
        currentScreen,
        navigateTo,
        user,
        updateUser,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        selectedProductId,
        setSelectedProductId,
        orders,
        advanceOrderStatus,
        selectedOrderId,
        setSelectedOrderId,
        buyers,
        selectedBuyerId,
        setSelectedBuyerId,
        suggestions,
        notifications,
        markNotificationRead,
        unreadNotifsCount,
        productDraft,
        updateProductDraft,
        resetProductDraft,
        isMobileDeviceView,
        setIsMobileDeviceView
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
