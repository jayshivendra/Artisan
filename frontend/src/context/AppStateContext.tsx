import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Product, Order, BuyerRequirement, AISuggestion, NotificationItem, ScreenType, CartItem, QualityCheckAlert, B2BMatch } from '../types/index.js';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_BUYERS, INITIAL_SUGGESTIONS, INITIAL_NOTIFICATIONS, BAMBOO_B2B_MATCHES, INITIAL_QUALITY_ALERTS } from '../data/mockData.js';

export interface AddProductDraft {
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
  usage: string;
  keywords: string[];
  description_en: string;
  description_hi: string;
  description_reg: string;
  raw_material_cost: number;
  labour_cost: number;
  packaging_cost: number;
  logistics_cost: number;
  estimated_base_cost: number;
  market_ref_min: number;
  market_ref_max: number;
  suggested_price: number;
  selling_price: number;
  price_range_min: number;
  price_range_max: number;
  artisan_profit: number;
  pricing_explanation: string;
  quantity: number;
  readiness_score: number;
  quality_alerts: QualityCheckAlert[];
  b2b_matches: B2BMatch[];
  channels: {
    app_store: boolean;
    govt_marketplace: boolean;
    b2b_marketplace: boolean;
    ondc: boolean;
  };
}

const initialDraftState: AddProductDraft = {
  step: 1,
  photoUrl: 'https://images.unsplash.com/photo-1595079672139-62294316750c?w=800&auto=format&fit=crop&q=80',
  enhancedPhotoUrl: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&auto=format&fit=crop&q=80',
  selectedBgPreset: 'studio',
  voiceText: 'This basket is made from bamboo. It is handmade and takes two days to make. It can be used for storing clothes and household items.',
  name: 'Handcrafted Bamboo Storage Basket',
  category: 'Home & Decor',
  material: 'Natural Bamboo & Cane Strips',
  craft_type: '100% Traditional Handwoven',
  production_method: 'Handmade',
  making_time_days: 2,
  dimensions: '14" Diameter x 10" Height',
  colour: 'Natural Golden Honey Bamboo',
  usage: 'Storage / Laundry / Home decoration',
  keywords: ['bamboo basket', 'handmade basket', 'eco-friendly storage', 'traditional handicraft', 'home decor'],
  description_en: 'A premium handcrafted storage basket woven from seasoned natural bamboo. Ideal for eco-friendly living, multi-purpose clothes storage, and minimalist home decor.',
  description_hi: 'प्राकृतिक बांस से निर्मित हस्तनिर्मित स्टोरेज टोकरी। कपड़े और घरेलू सामान सुरक्षित रखने के लिए सर्वोत्तम।',
  description_reg: 'సహజ వెదురుతో చేతితో అల్లిన అందమైన నిల్వ బుట్ట.',
  raw_material_cost: 350,
  labour_cost: 300,
  packaging_cost: 50,
  logistics_cost: 100,
  estimated_base_cost: 800,
  market_ref_min: 850,
  market_ref_max: 1100,
  suggested_price: 949,
  selling_price: 949,
  price_range_min: 899,
  price_range_max: 999,
  artisan_profit: 449,
  pricing_explanation: 'AI-assisted price recommendation based on available product, cost and market-reference data: Raw material ₹350 + Labour estimate ₹300 (2 days) + Packaging ₹50 + Platform/Logistics ₹100 = Base cost ₹800. Market reference ₹850–₹1,100.',
  quantity: 24,
  readiness_score: 91,
  quality_alerts: INITIAL_QUALITY_ALERTS,
  b2b_matches: BAMBOO_B2B_MATCHES,
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

  // Hackathon Live Demo Walkthrough
  isLiveDemoOpen: boolean;
  setIsLiveDemoOpen: (val: boolean) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    const onboarded = localStorage.getItem('karigar_onboarded');
    return onboarded === 'true' ? 'home' : 'welcome';
  });

  const [isMobileDeviceView, setIsMobileDeviceView] = useState<boolean>(true);
  const [isLiveDemoOpen, setIsLiveDemoOpen] = useState<boolean>(false);


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
        createBuyerOrder,
        isLiveDemoOpen,
        setIsLiveDemoOpen
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
