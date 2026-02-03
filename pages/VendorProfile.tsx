import React, { useState, useEffect } from 'react';
import { Vendor, Product } from '../types';
import { ArrowLeft, Star, MapPin, BadgeCheck, CalendarDays, Check } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useParams, navigate } from '../router';
import { fetchVendor, fetchProductsByVendor } from '../api/api';

export const VendorProfilePage: React.FC = () => {
  const { id: vendorId } = useParams();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!vendorId) {
      setError("Vendor not found.");
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        const [vendorData, productsData] = await Promise.all([
          fetchVendor(vendorId),
          fetchProductsByVendor(vendorId)
        ]);
        setVendor(vendorData);
        setProducts(productsData);
        setError(null);
      } catch (err) {
        setError("Failed to load vendor profile.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [vendorId]);

  const handleFollowToggle = () => {
    // TODO Backend: POST /api/sellers/:id/follow
    setIsFollowing(prev => !prev);
  }

  const formattedJoinedDate = vendor 
    ? new Date(vendor.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '';

  if (isLoading) return <div className="text-center py-20">Loading profile...</div>;
  if (error) return (
    <div className="text-center py-20 flex flex-col items-center gap-4">
        <p className="text-red-500">{error}</p>
        <button onClick={() => navigate('/')} className="flex items-center text-sm font-medium bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-lg">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to browse
        </button>
    </div>
  );
  if (!vendor) return <div className="text-center py-20">Vendor could not be found.</div>;

  return (
    <div className="min-h-screen bg-neutral-50 pb-12">
      <div className="h-48 md:h-64 bg-neutral-300 w-full relative">
        <img 
          src={vendor.imageUrl.replace('/800/400', '/1200/400')}
          alt={`${vendor.name}'s cover photo`}
          className="w-full h-full object-cover"
        />
        <button 
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:bg-white transition"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-800" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-20 relative z-10">
        
        {/* Vendor Header Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-200/50 p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative flex-shrink-0">
            <img 
              src={vendor.imageUrl.replace('/800/400', '/400/400')} 
              alt={vendor.name} 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md object-cover bg-neutral-100"
            />
            {vendor.verified && (
              <div className="absolute bottom-1 right-1 bg-primary-500 text-white p-1.5 rounded-full border-2 border-white" title="Verified Seller">
                <BadgeCheck className="w-4 h-4" />
                <span className="sr-only">Verified Seller</span>
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">{vendor.name}</h1>
            <p className="text-neutral-600 mt-2 max-w-2xl">{vendor.description}</p>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-600 mt-4 border-t border-neutral-100 pt-4">
              <div className="flex items-center">
                 <MapPin className="w-4 h-4 mr-1.5 text-neutral-400" />
                 {vendor.location}
              </div>
              <div className="flex items-center">
                 <Star className="w-4 h-4 mr-1.5 text-yellow-400 fill-yellow-400" />
                 <span className="font-medium text-neutral-800 mr-1">{vendor.rating}</span>
                 <span>({vendor.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center">
                 <CalendarDays className="w-4 h-4 mr-1.5 text-neutral-400" />
                 Joined {formattedJoinedDate}
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col md:items-end gap-2 self-start md:self-center">
            <button 
              onClick={handleFollowToggle}
              className={`w-full md:w-auto px-6 py-2 rounded-full font-semibold transition text-sm flex items-center justify-center gap-1.5
                ${isFollowing 
                  ? 'bg-neutral-200 text-neutral-800' 
                  : 'bg-neutral-900 text-white hover:bg-neutral-800'}`
                }
            >
              {isFollowing && <Check className="w-4 h-4" />}
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6 tracking-tight">Shop Items ({products.length})</h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-neutral-200/80">
                <p className="text-neutral-600">This seller has no products listed yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};