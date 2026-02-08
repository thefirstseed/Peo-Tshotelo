import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product, Vendor } from '../types';
import { ProductCard } from '../components/ProductCard';
import { VendorCard } from '../components/VendorCard';
import { CATEGORIES, MOCK_VENDORS } from '../constants';
import { ArrowRight } from 'lucide-react';
import { fetchProducts } from '../api/api';
import { navigate, useQuery } from '../router';
import { useAuth } from '../hooks/useAuth';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const { user } = useAuth();
  const query = useQuery();
  const searchQuery = query.get('q') || '';
  const productsGridRef = useRef<HTMLDivElement>(null);
  
  const HOME_CATEGORIES = user ? ['All', 'Following', ...CATEGORIES.slice(1)] : CATEGORIES;


  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
        setVendors(MOCK_VENDORS);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || selectedCategory === 'Following' || product.category === selectedCategory;
      
      const matchesFollowing = selectedCategory === 'Following' 
        ? user?.following.includes(product.vendorId) 
        : true;
      
      const matchesSearch = searchQuery 
        ? product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          product.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
        
      return matchesCategory && matchesSearch && matchesFollowing;
    });
  }, [products, selectedCategory, searchQuery, user]);

  const handleExploreClick = () => {
    productsGridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 my-16 lg:my-24">
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="font-heading font-black text-5xl md:text-7xl tracking-tighter text-neutral-900">
            HERITAGE
            <br />
            <span className="text-primary-500">REIMAGINED</span>
          </h1>
          <p className="max-w-md mx-auto lg:mx-0 mt-6 text-lg text-neutral-600">
            The premium destination for curated African vintage, reworked classics, and emerging designers.
          </p>
          <div className="mt-8 flex justify-center lg:justify-start items-center gap-4">
            <button 
              onClick={handleExploreClick}
              className="bg-primary-500 text-white font-semibold px-8 py-3 rounded-full hover:bg-primary-600 transition-transform active:scale-95 shadow-lg shadow-primary-200">
              Explore Drops
            </button>
            <button 
              onClick={() => navigate('/our-story')}
              className="flex items-center gap-1.5 font-semibold text-neutral-800 hover:text-primary-500 transition"
            >
              <span>Our Story</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="lg:w-1/2 w-full">
          <img 
            src="https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=1200&auto=format&fit=crop"
            alt="Clothing on hangers"
            className="rounded-3xl object-cover w-full h-full aspect-[4/3] lg:aspect-square shadow-2xl shadow-neutral-300"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar mb-8 pb-2">
        {HOME_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat 
                ? 'bg-neutral-900 text-white shadow-md' 
                : 'bg-white border border-neutral-200/80 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div ref={productsGridRef} className="my-16">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6 tracking-tight">Fresh Finds</h2>
        {isLoading ? (
           <div className="text-center py-20">Loading products...</div>
        ) : error ? (
           <div className="text-center py-20 text-red-500">{error}</div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-neutral-600 bg-white rounded-xl">
            <p className="font-medium">No products found matching your criteria.</p>
            <button 
              onClick={() => {
                setSelectedCategory('All'); 
                navigate('/');
              }}
              className="mt-4 text-primary-600 font-semibold hover:underline text-sm"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <div className="my-16">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6 tracking-tight">Featured Shops</h2>
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
          {vendors.map(vendor => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      </div>
    </div>
  );
};