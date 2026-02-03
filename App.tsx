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
import { RegisterPage } from './pages/Register';
import { ProtectedRoute } from './components/ProtectedRoute';
import { OurStoryPage } from './pages/OurStory';
import { ProfileSettingsPage } from './pages/ProfileSettings';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col font-sans text-neutral-800">
      <Navbar />
      <main className="flex-grow pt-16 pb-20 md:pb-8">
        <Router>
          <Route path="/" component={HomePage} />
          
          {/* CRITICAL FIX: Specific routes must come before parameterized routes */}
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
          <Route path="/products/:id" component={ProductDetailsPage} />

          <Route path="/sellers/:id" component={VendorProfilePage} />
          <Route path="/cart" component={CartPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/our-story" component={OurStoryPage} />
          <Route path="/sell" component={user?.role === 'seller' ? SellerDashboardPage : VendorOnboardingPage} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" component={() => (
            <ProtectedRoute roles={['seller']}>
              <SellerDashboardPage />
            </ProtectedRoute>
          )} />
           <Route path="/profile" component={() => (
            <ProtectedRoute roles={['seller', 'buyer']}>
              <ProfileSettingsPage />
            </ProtectedRoute>
          )} />
          <Route path="/settings" component={() => (
            <ProtectedRoute roles={['seller', 'buyer']}>
              <SettingsPage />
            </ProtectedRoute>
          )} />
          
          {/* Fallback for unknown routes */}
          <Route default component={() => <div className="text-center py-10">404 - Page Not Found</div>} />
        </Router>
      </main>
    </div>
  );
}