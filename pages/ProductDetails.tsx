import React, { useState, useEffect } from 'react';
import { Product, Vendor } from '../types';
import { ArrowLeft, Star, ShieldCheck, Truck, MessageCircle } from 'lucide-react';
import { fetchProduct, fetchVendor } from '../api/api';
import { navigate, useParams } from '../router';
import { useCart } from '../hooks/useCart';

export const ProductDetailsPage: React.FC = () => {
  const { id: productId } = useParams();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    if (!productId) {
      setError("Product not found.");
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        const fetchedProduct = await fetchProduct(productId);
        setProduct(fetchedProduct);
        setActiveImage(fetchedProduct.imageUrls[0] || '');
        
        if (fetchedProduct.vendorId) {
          const fetchedVendor = await fetchVendor(fetchedProduct.vendorId);
          setVendor(fetchedVendor);
        }
        setError(null);
      } catch (err) {
        setError("Failed to load product details.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [productId]);

  if (isLoading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!product) return <div className="text-center py-20">Product could not be found.</div>;
  
  return (
    <div className="max-w-7xl mx-auto px-0 md:px-4 lg:px-8 bg-white md:bg-transparent min-h-screen">
      <div className="flex flex-col md:flex-row gap-0 md:gap-8 bg-white md:rounded-2xl overflow-hidden md:shadow-lg md:border border-neutral-200/50 md:mt-4 md:p-6">
        
        <div className="absolute top-4 left-4 z-10 md:hidden">
          <button 
            onClick={() => navigate('/')}
            className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:bg-white"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-800" />
          </button>
        </div>

        <div className="w-full md:w-1/2 lg:w-3/5">
          <div className="bg-neutral-100 aspect-square md:rounded-xl overflow-hidden mb-2">
            <img 
              src={activeImage} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
          </div>
          {product.imageUrls.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.imageUrls.map((url, index) => (
                <div 
                  key={index} 
                  onClick={() => setActiveImage(url)}
                  className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${activeImage === url ? 'border-primary-500' : 'border-transparent'} hover:border-primary-300`}
                >
                   <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 md:p-0 md:w-1/2 lg:w-2/5 flex flex-col">
          
          <div className="hidden md:block mb-4">
             <button onClick={() => navigate('/')} className="text-neutral-500 hover:text-neutral-900 flex items-center text-sm font-medium">
               <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to browse
             </button>
          </div>

          <div className="mb-2">
            <span className="text-primary-600 text-sm font-semibold tracking-wide uppercase">{product.category}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2 tracking-tight">{product.title}</h1>
          
          <div className="flex items-center gap-2 mb-6">
             <span className="text-3xl font-bold text-neutral-900">P {product.price.toFixed(2)}</span>
             {product.condition && (
               <span className="bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded text-xs font-medium border border-neutral-200">
                 {product.condition}
               </span>
             )}
          </div>

          <div className="grid grid-cols-5 gap-3 mb-8">
            <button 
              onClick={() => addToCart(product)}
              className="col-span-4 bg-primary-500 text-white py-3.5 px-6 rounded-full font-semibold hover:bg-primary-600 transition shadow-lg shadow-primary-200 active:scale-95"
            >
              Add to Bag
            </button>
            <button className="col-span-1 flex items-center justify-center bg-neutral-100 rounded-full hover:bg-neutral-200 transition">
               <MessageCircle className="w-6 h-6 text-neutral-700" />
            </button>
          </div>

          <div className="mb-8 border-t border-neutral-100 pt-6">
            <h3 className="font-semibold text-neutral-900 mb-2">Description</h3>
            <p className="text-neutral-600 leading-relaxed text-sm md:text-base">
              {product.description}
            </p>
            {product.sizes && (
              <div className="mt-4">
                <p className="text-sm font-medium text-neutral-900 mb-2">Available Sizes:</p>
                <div className="flex gap-2">
                  {product.sizes.map(size => (
                    <span key={size} className="px-3 py-1 border border-neutral-300 rounded-md text-sm text-neutral-600">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {vendor && (
            <div 
              onClick={() => navigate(`/sellers/${vendor.id}`)}
              className="mt-auto bg-neutral-100 p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-neutral-200 transition border border-neutral-200/80"
            >
              <img 
                src={vendor.imageUrl} 
                alt={vendor.name} 
                className="w-12 h-12 rounded-full object-cover border-2 border-white"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-semibold text-neutral-900">{vendor.name}</h4>
                  {vendor.verified && <ShieldCheck className="w-4 h-4 text-primary-500" />}
                </div>
                <div className="flex items-center text-sm text-neutral-600">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 mr-1" />
                  <span>{vendor.rating}</span>
                  <span className="mx-1.5">•</span>
                  <span>{vendor.location}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500">
            <Truck className="w-4 h-4" />
            <span>Motorcycle delivery available (1-2 hours within Gabs)</span>
          </div>
        </div>
      </div>
    </div>
  );
};