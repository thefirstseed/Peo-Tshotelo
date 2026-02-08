import React from 'react';
import { Navbar } from './components/Navbar';
import { Router, Route } from './router';

// Import Pages
import { HomePage } from './pages/Home';
import { ProductDetailsPage } from './pages/ProductDetails';
import { CartPage } from './pages/Cart';
import { VendorProfilePage } from './pages/VendorProfile';
import { SellerDashboardPage } from './pages/SellerDashboard';
import { ProductEditPage } from './pages/ProductEdit';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { ProtectedRoute } from './components/ProtectedRoute';
import { OurStoryPage } from './pages/OurStory';
import { ProfileSettingsPage } from './pages/ProfileSettings';
import { LikesPage } from './pages/LikesPage';
import { StorefrontSettingsPage } from './pages/StorefrontSettings';
import { PayoutSettingsPage } from './pages/PayoutSettings';
import { SellPage } from './pages/Sell';
import { EditProfilePage } from './pages/EditProfilePage';
import { AddressesPage } from './pages/AddressesPage';
import { SignInAndSecurityPage } from './pages/SignInAndSecurityPage';
import { BuyerPaymentsPage } from './pages/BuyerPaymentsPage';
import { PurchaseHistoryPage } from './pages/PurchaseHistoryPage';
import { InboxPage } from './pages/InboxPage';
import { ConversationPage } from './pages/ConversationPage';
import { NotificationsSettingsPage } from './pages/NotificationsSettingsPage';
import { FollowingPage } from './pages/FollowingPage';
import { CategoryPage } from './pages/CategoryPage';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-neutral-800">
      <Navbar />
      <main className="flex-grow pt-16 pb-20 md:pb-8">
        <Router>
          <Route path="/" component={HomePage} />
          <Route path="/category/:slug" component={CategoryPage} />
          
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
          
          {/* The /sell route is now protected and uses a controller to determine the correct page */}
          <Route path="/sell" component={() => (
            <ProtectedRoute roles={['buyer', 'seller']}>
              <SellPage />
            </ProtectedRoute>
          )} />
          
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
          <Route path="/inbox" component={() => (
            <ProtectedRoute roles={['seller', 'buyer']}>
              <InboxPage />
            </ProtectedRoute>
          )} />
          <Route path="/conversations/:id" component={() => (
            <ProtectedRoute roles={['seller', 'buyer']}>
              <ConversationPage />
            </ProtectedRoute>
          )} />
           <Route path="/settings/personal-info" component={() => (
            <ProtectedRoute roles={['seller', 'buyer']}>
              <EditProfilePage />
            </ProtectedRoute>
          )} />
           <Route path="/settings/addresses" component={() => (
            <ProtectedRoute roles={['seller', 'buyer']}>
              <AddressesPage />
            </ProtectedRoute>
          )} />
           <Route path="/settings/security" component={() => (
            <ProtectedRoute roles={['seller', 'buyer']}>
              <SignInAndSecurityPage />
            </ProtectedRoute>
          )} />
           <Route path="/settings/notifications" component={() => (
            <ProtectedRoute roles={['seller', 'buyer']}>
              <NotificationsSettingsPage />
            </ProtectedRoute>
          )} />
           <Route path="/settings/payments" component={() => (
            <ProtectedRoute roles={['buyer']}>
              <BuyerPaymentsPage />
            </ProtectedRoute>
          )} />
           <Route path="/settings/history" component={() => (
            <ProtectedRoute roles={['buyer']}>
              <PurchaseHistoryPage />
            </ProtectedRoute>
          )} />
          <Route path="/likes" component={() => (
            <ProtectedRoute roles={['seller', 'buyer']}>
              <LikesPage />
            </ProtectedRoute>
          )} />
           <Route path="/following" component={() => (
            <ProtectedRoute roles={['buyer', 'seller']}>
              <FollowingPage />
            </ProtectedRoute>
          )} />
           <Route path="/settings/storefront" component={() => (
            <ProtectedRoute roles={['seller']}>
              <StorefrontSettingsPage />
            </ProtectedRoute>
          )} />
           <Route path="/settings/payouts" component={() => (
            <ProtectedRoute roles={['seller']}>
              <PayoutSettingsPage />
            </ProtectedRoute>
          )} />
          
          {/* Fallback for unknown routes */}
          <Route default component={() => <div className="text-center py-10">404 - Page Not Found</div>} />
        </Router>
      </main>
    </div>
  );
}