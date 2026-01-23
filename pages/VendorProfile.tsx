import React, { useState, useEffect } from 'react';
import { Vendor, Product } from '../types';
import { ArrowLeft, Star, MapPin, BadgeCheck } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useParams, navigate } from '../router';
import { fetchVendor, fetchProductsByVendor } from '../api/api';

export const VendorProfilePage: React.FC = () => {
  const { id: vendorId } = useParams();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (isLoading) return <div className="text-center py-20">Loading profile...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!vendor) return <div className="text-center py-20">Vendor could not be found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="h-48 md:h-64 bg-gray-300 w-full relative">
        <img 
          src={`https://picsum.photos/seed/${vendor.id}cover/1200/400`} 
          alt="Cover" 
          className="w-full h-full object-cover"
        />
        <button 
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:bg-white transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <img 
              src={vendor.imageUrl} 
              alt={vendor.name} 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md object-cover"
            />
            {vendor.verified && (
              <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
                <BadgeCheck className="w-4 h-4" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{vendor.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center">
                 <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                 {vendor.location}
              </div>
              <div className="flex items-center">
                 <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
                 <span className="font-medium text-gray-900 mr-1">{vendor.rating}</span>
                 <span>({vendor.reviewCount} reviews)</span>
              </div>
            </div>
            <p className="text-gray-600 max-w-2xl">{vendor.description}</p>
          </div>

          <div className="w-full md:w-auto flex flex-col gap-2">
            <button className="w-full md:w-auto px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition">
              Follow Seller
            </button>
            <button className="w-full md:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
              Message
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Shop Items ({products.length})</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
              />
            ))}
          </div>
          {products.length === 0 && (
            <p className="text-gray-500 italic">No products currently listed.</p>
          )}
        </div>
      </div>
    </div>
  );
};