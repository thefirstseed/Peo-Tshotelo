import React from 'react';
import { Navbar } from './components/Navbar';
import { Router, Route } from './router';
import { useAuth } from './hooks/useAuth';

// Import Pages
import { HomePage } from './pages/Home';
import { ProductDetailsPage } from './pages/ProductDetails';
import { CartPage } from './pages/Cart';
import { VendorProfilePage } from './pages/VendorProfile';
import { VendorOnboardingPage } from './pages/VendorOnboarding';
import { SellerDashboardPage } from './pages/SellerDashboard';
import { ProductEditPage } from './pages/ProductEdit';
import { LoginPage } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans text-neutral-800">
      <Navbar />
      <main className="flex-grow pt-16 pb-20 md:pb-8">
        <Router>
          <Route path="/" component={HomePage} />
          <Route path="/products/:id" component={ProductDetailsPage} />
          <Route path="/sellers/:id" component={VendorProfilePage} />
          <Route path="/cart" component={CartPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/sell" component={user?.role === 'seller' ? SellerDashboardPage : VendorOnboardingPage} />
          
          {/* Protected Seller Routes */}
          <Route path="/dashboard" component={() => (
            <ProtectedRoute roles={['seller']}>
              <SellerDashboardPage />
            </ProtectedRoute>
          )} />
          <Route path="/products/new" component={() => (
            <ProtectedRoute roles={['seller']}>
              <ProductEditPage />
            </ProtectedRoute>
          )} />
          <Route path="/products/edit/:id" component={() => (
            <ProtectedRoute roles={['seller']}>
              <ProductEditPage />
            </ProtectedRoute>
          )} />
          
          {/* Fallback for unknown routes */}
          <Route default component={() => <div className="text-center py-10">404 - Page Not Found</div>} />
        </Router>
      </main>
    </div>
  );
}