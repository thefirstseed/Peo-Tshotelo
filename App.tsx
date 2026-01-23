import React, { useState } from 'react';
import { Product, Vendor, CartItem, ViewState } from './types';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/Home';
import { ProductDetailsPage } from './pages/ProductDetails';
import { CartPage } from './pages/Cart';
import { VendorProfilePage } from './pages/VendorProfile';
import { VendorOnboardingPage } from './pages/VendorOnboarding';
import { SellerDashboardPage } from './pages/SellerDashboard';
import { ProductEditPage } from './pages/ProductEdit';
import { MOCK_PRODUCTS, MOCK_VENDORS } from './constants';

export default function App() {
  const [viewState, setViewState] = useState<ViewState>({ type: 'HOME' });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>(MOCK_PRODUCTS);
  
  // --- Authentication & Role Simulation ---
  // In a real app, this would come from a context provider after login.
  // We are simulating that 'Thrifty Gabs' (vendorId: 'v1') is logged in.
  const [userRole, setUserRole] = useState<'buyer' | 'seller'>('seller'); 
  const loggedInVendorId = 'v1';
  const loggedInVendor = MOCK_VENDORS.find(v => v.id === loggedInVendorId);

  // Navigation Handlers
  const navigateHome = () => setViewState({ type: 'HOME' });
  const navigateToProduct = (product: Product) => setViewState({ type: 'PRODUCT_DETAILS', data: product });
  const navigateToVendor = (vendor: Vendor) => setViewState({ type: 'VENDOR_PROFILE', data: vendor });
  const navigateToCart = () => setViewState({ type: 'CART' });
  const navigateToDashboard = () => setViewState({ type: 'SELLER_DASHBOARD' });
  const navigateToAddProduct = () => setViewState({ type: 'PRODUCT_EDIT' });
  const navigateToEditProduct = (product: Product) => setViewState({ type: 'PRODUCT_EDIT', data: product });
  
  const handleSellOrDashboardClick = () => {
    // UI logic based on role. A backend must always verify this action.
    if (userRole === 'seller') {
      navigateToDashboard();
    } else {
      setViewState({ type: 'VENDOR_ONBOARDING' });
    }
  };

  // Cart Handlers
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const clearCart = () => setCart([]);
  
  // Product Management Handler
  const handleSaveProduct = (productData: Omit<Product, 'id' | 'vendorId' | 'vendorName'>, existingId?: string) => {
    if (existingId) {
      // Update existing product
      setAllProducts(prev => prev.map(p => p.id === existingId ? { ...p, ...productData } : p));
    } else {
      // Add new product
      const newProduct: Product = {
        ...productData,
        id: `p${Date.now()}`, // Simple unique ID for mock
        vendorId: loggedInVendorId,
        vendorName: loggedInVendor?.name || 'Unknown Seller'
      };
      setAllProducts(prev => [newProduct, ...prev]);
    }
    navigateToDashboard(); // Go back to dashboard after saving
  };


  // Render current view
  const renderContent = () => {
    switch (viewState.type) {
      case 'HOME':
        return (
          <HomePage 
            products={allProducts}
            onProductClick={navigateToProduct}
            onVendorClick={navigateToVendor}
          />
        );
      case 'PRODUCT_DETAILS':
        return (
          <ProductDetailsPage 
            product={viewState.data as Product}
            onBack={navigateHome}
            onAddToCart={addToCart}
            onVendorClick={navigateToVendor}
          />
        );
      case 'VENDOR_PROFILE':
        return (
          <VendorProfilePage 
            vendor={viewState.data as Vendor}
            onBack={navigateHome}
            onProductClick={navigateToProduct}
            products={allProducts.filter(p => p.vendorId === viewState.data.id)}
          />
        );
      case 'CART':
        return (
          <CartPage 
            cartItems={cart}
            onRemove={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onCheckout={clearCart}
            onBack={navigateHome}
          />
        );
      case 'VENDOR_ONBOARDING':
        return (
          <VendorOnboardingPage 
            onBack={navigateHome}
          />
        );
      case 'SELLER_DASHBOARD':
        if (userRole !== 'seller') {
          navigateHome();
          return null;
        }
        return (
          <SellerDashboardPage 
            onBack={navigateHome}
            sellerProducts={allProducts.filter(p => p.vendorId === loggedInVendorId)}
            sellerInfo={loggedInVendor}
            onAddProduct={navigateToAddProduct}
            onEditProduct={navigateToEditProduct}
          />
        );
      case 'PRODUCT_EDIT':
        if (userRole !== 'seller') {
          navigateHome();
          return null;
        }
        return (
          <ProductEditPage 
            product={viewState.data}
            onSave={handleSaveProduct}
            onBack={navigateToDashboard}
          />
        );
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans text-neutral-800">
      <Navbar 
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        userRole={userRole}
        onCartClick={navigateToCart}
        onLogoClick={navigateHome}
        onSellOrDashboardClick={handleSellOrDashboardClick}
      />
      <main className="flex-grow pt-16 pb-20 md:pb-8">
        {renderContent()}
      </main>
      
      {/* Mobile Bottom Nav Spacer is handled by padding-bottom */}
    </div>
  );
}