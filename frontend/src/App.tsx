import React from 'react';
import { useAppState } from './context/AppStateContext.js';
import { MobileFrame } from './components/layout/MobileFrame.js';
import { BottomNav } from './components/layout/BottomNav.js';
import { VoiceAssistantFloatingBtn } from './components/layout/VoiceAssistantFloatingBtn.js';
import { VoiceAssistantModal } from './components/modals/VoiceAssistantModal.js';
import { LiveDemoModal } from './components/modals/LiveDemoModal.js';

// Screens
import { WelcomeScreen } from './screens/onboarding/WelcomeScreen.js';
import { LanguageSelectScreen } from './screens/onboarding/LanguageSelectScreen.js';
import { CategorySelectScreen } from './screens/onboarding/CategorySelectScreen.js';
import { ProfileSetupScreen } from './screens/onboarding/ProfileSetupScreen.js';
import { HomeDashboard } from './screens/dashboard/HomeDashboard.js';
import { AddProductWizard } from './screens/addProduct/AddProductWizard.js';
import { ProductListScreen } from './screens/products/ProductListScreen.js';
import { ProductDetailScreen } from './screens/products/ProductDetailScreen.js';
import { OrderListScreen } from './screens/orders/OrderListScreen.js';
import { OrderDetailScreen } from './screens/orders/OrderDetailScreen.js';
import { FindBuyersScreen } from './screens/buyers/FindBuyersScreen.js';
import { SalesDashboard } from './screens/dashboard/SalesDashboard.js';
import { GovMarketplaceHub } from './screens/govMarketplace/GovMarketplaceHub.js';
import { NotificationsScreen } from './screens/profile/NotificationsScreen.js';
import { ProfileScreen } from './screens/profile/ProfileScreen.js';
import { EditProfileScreen } from './screens/profile/EditProfileScreen.js';
import { HelpTutorialsScreen } from './screens/profile/HelpTutorialsScreen.js';

// Buyer Platform Screens
import { BuyerMarketplaceScreen } from './screens/buyers/BuyerMarketplaceScreen.js';
import { BuyerCartScreen } from './screens/buyers/BuyerCartScreen.js';
import { BuyerOrdersScreen } from './screens/buyers/BuyerOrdersScreen.js';
import { BuyerWishlistScreen } from './screens/buyers/BuyerWishlistScreen.js';

export const App: React.FC = () => {
  const { currentScreen } = useAppState();

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'language_select':
        return <LanguageSelectScreen />;
      case 'category_select':
        return <CategorySelectScreen />;
      case 'profile_setup':
        return <ProfileSetupScreen />;
      case 'home':
        return <HomeDashboard />;
      case 'add_product':
        return <AddProductWizard />;
      case 'my_products':
        return <ProductListScreen />;
      case 'product_detail':
        return <ProductDetailScreen />;
      case 'orders':
        return <OrderListScreen />;
      case 'order_detail':
        return <OrderDetailScreen />;
      case 'find_buyers':
        return <FindBuyersScreen />;
      case 'sales_dashboard':
        return <SalesDashboard />;
      case 'gov_marketplace':
        return <GovMarketplaceHub />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'edit_profile':
        return <EditProfileScreen />;
      case 'buyer_marketplace':
        return <BuyerMarketplaceScreen />;
      case 'buyer_cart':
        return <BuyerCartScreen />;
      case 'buyer_orders':
        return <BuyerOrdersScreen />;
      case 'buyer_wishlist':
        return <BuyerWishlistScreen />;
      case 'help_tutorials':
        return <HelpTutorialsScreen />;
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <MobileFrame
      bottomNav={<BottomNav />}
      floatingAction={<VoiceAssistantFloatingBtn />}
      modals={
        <>
          <VoiceAssistantModal />
          <LiveDemoModal />
        </>
      }
    >
      {renderActiveScreen()}
    </MobileFrame>
  );
};
