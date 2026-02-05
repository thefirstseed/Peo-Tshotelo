import React from 'react';
import { useWishlist } from '../hooks/useWishlist';
import { ProductCard } from '../components/ProductCard';
import { Heart, ArrowLeft } from 'lucide-react';
import { navigate } from '../router';

export const WishlistPage: React.FC = () => {
    const { wishlist } = useWishlist();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/profile')} className="p-2 hover:bg-neutral-100 rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold">My Wishlist</h1>
            </div>

            {wishlist.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {wishlist.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white rounded-xl border border-neutral-200/80">
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                        <Heart className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900 mb-2">Your Wishlist is Empty</h2>
                    <p className="text-neutral-500 mb-6 text-center">Tap the heart on any item to save it here.</p>
                    <button onClick={() => navigate('/')} className="bg-neutral-900 text-white px-6 py-3 rounded-full font-medium hover:bg-neutral-800">
                        Discover Items
                    </button>
                </div>
            )}
        </div>
    );
};