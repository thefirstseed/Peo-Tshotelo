import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { SellerDashboardPage } from './SellerDashboard';
import { VendorOnboardingPage } from './VendorOnboarding';

/**
 * This component acts as a controller for the `/sell` route.
 * It determines whether to show the seller dashboard or the onboarding
 * process based on the user's authentication status and profile completeness.
 * It's intended to be used within a ProtectedRoute to ensure a user is logged in.
 */
export const SellPage: React.FC = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    // The ProtectedRoute ensures the user is not null here.
    // We check if the user is a seller and has completed onboarding (has a vendorId).
    if (user && user.role === 'seller' && user.vendorId) {
        return <SellerDashboardPage />;
    }

    // Otherwise, for new sellers or buyers wanting to become sellers,
    // we show the onboarding page.
    return <VendorOnboardingPage />;
};
