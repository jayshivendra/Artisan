import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Product, Order, BuyerRequirement, AISuggestion, NotificationItem, ScreenType, CartItem } from '../types/index.js';
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
  userRole: 'seller' | 'buyer';
  setUserRole: (role: 'seller' | 'buyer') => void;
  toggleUserRole: () => void;
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
  
  // Buyer Platform Specifics
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  createBuyerOrder: (items: CartItem[], address: string, paymentMethod: string) => Order;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    const onboarded = localStorage.getItem('karigar_onboarded');
    return onboarded === 'true' ? 'home' : 'welcome';
  });

  const [isMobileDeviceView, setIsMobileDeviceView] = useState<boolean>(true);

  const [userRole, setUserRoleState] = useState<'seller' | 'buyer'>(() => {
    return (localStorage.getItem('karigar_role') as 'seller' | 'buyer') || 'seller';
  });

  const setUserRole = (role: 'seller' | 'buyer') => {
    setUserRoleState(role);
    localStorage.setItem('karigar_role', role);
    if (role === 'buyer') {
      navigateTo('buyer_marketplace');
    } else {
      navigateTo('home');
    }
  };

  const toggleUserRole = () => {
    setUserRole(userRole === 'seller' ? 'buyer' : 'seller');
  };

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('karigar_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      id: 'user_artisan_01',
      name: 'Pandit Ramswaroop Sharma',
      phone: '+91 98480 22334',
      preferred_language: 'hi',
      craft_categories: ['Pottery & Clay', 'Handicrafts'],
      location: 'Jaipur, Rajasthan, India',
      business_name: 'Royal Heritage Blue Pottery & Crafts',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      bio: 'Preserving the 500-year-old royal Jaipur blue pottery tradition using quartz stone and mineral pigments.',
      upi_id: 'ramswaroop.crafts@upi',
      bank_name: 'State Bank of India',
      bank_account: '•••• •••• •••• 4529',
      role: 'seller',
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

  // Buyer State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('karigar_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('karigar_wishlist');
    return saved ? JSON.parse(saved) : ['prod_001', 'prod_002'];
  });

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

  // Buyer Cart Operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id);
      let updated: CartItem[];
      if (idx > -1) {
        updated = [...prev];
        updated[idx].quantity += quantity;
      } else {
        updated = [...prev, { product, quantity }];
      }
      localStorage.setItem('karigar_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const updated = prev.filter(item => item.product.id !== productId);
      localStorage.setItem('karigar_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === productId);
      if (idx === -1) return prev;
      const updated = [...prev];
      updated[idx].quantity += delta;
      if (updated[idx].quantity <= 0) {
        return prev.filter(item => item.product.id !== productId);
      }
      localStorage.setItem('karigar_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('karigar_cart');
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const updated = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('karigar_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const createBuyerOrder = (items: CartItem[], address: string, paymentMethod: string): Order => {
    const firstItem = items[0];
    const totalAmount = items.reduce((sum, i) => sum + (i.product.selling_price * i.quantity), 0);
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      order_number: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      buyer_id: user.id || 'buyer_user',
      buyer_name: user.name || 'Patron',
      buyer_phone: user.phone || '+91 98765 43210',
      buyer_location: user.location || 'India',
      seller_id: firstItem?.product.seller_id || 'user_artisan_01',
      product_id: firstItem?.product.id || 'prod_001',
      product_name: items.length > 1 ? `${firstItem?.product.name} (+${items.length - 1} items)` : firstItem?.product.name,
      product_image: firstItem?.product.images[0] || firstItem?.product.original_image || '',
      quantity: items.reduce((s, i) => s + i.quantity, 0),
      unit_price: firstItem?.product.selling_price || totalAmount,
      total_amount: totalAmount,
      status: 'processing',
      status_step: 2,
      created_at: new Date().toISOString(),
      shipping_address: address,
      courier_partner: 'India Post Speed Post',
      tracking_id: `INP${Math.floor(10000000 + Math.random() * 90000000)}`,
      payment_method: paymentMethod
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  return (
    <AppStateContext.Provider
      value={{
        currentScreen,
        navigateTo,
        user,
        updateUser,
        userRole,
        setUserRole,
        toggleUserRole,
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
        setIsMobileDeviceView,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        createBuyerOrder
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
