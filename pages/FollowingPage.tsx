import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Vendor } from '../types';
import { fetchVendorsByIds } from '../api/api';
import { VendorCard } from '../components/VendorCard';
import { Users, ArrowLeft } from 'lucide-react';
import { navigate } from '../router';

export const FollowingPage: React.FC = () => {
    const { user } = useAuth();
    const [followedVendors, setFollowedVendors] = useState<Vendor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user && user.following.length > 0) {
            setIsLoading(true);
            fetchVendorsByIds(user.following)
                .then(setFollowedVendors)
                .catch(() => setError("Could not load the shops you follow."))
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, [user]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/profile')} className="p-2 hover:bg-neutral-100 rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold">Following</h1>
                    <p className="text-neutral-500 mt-1">Shops you've followed to keep up with their latest items.</p>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-20">Loading...</div>
            ) : error ? (
                <div className="text-center py-20 text-red-500">{error}</div>
            ) : followedVendors.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {followedVendors.map(vendor => (
                        <VendorCard key={vendor.id} vendor={vendor} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white rounded-xl border border-neutral-200/80">
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900 mb-2">You're Not Following Any Shops</h2>
                    <p className="text-neutral-500 mb-6 text-center">Follow shops to see their items in your feed.</p>
                    <button onClick={() => navigate('/')} className="bg-neutral-900 text-white px-6 py-3 rounded-full font-medium hover:bg-neutral-800">
                        Discover Shops
                    </button>
                </div>
            )}
        </div>
    );
};