import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES } from '../constants';
import { Search, ArrowRight } from 'lucide-react';
import { fetchProducts } from '../api/api';
import { navigate } from '../router';


export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
        setError(null);
      } catch (err: any) {
        console.error('Fetch error:', err);
        // Fallback to empty list if DB is unreachable or empty
        if (err.message && (err.message.includes('fetch') || err.message.includes('JSON'))) {
             setError('Connection error. Please check your network.');
        } else {
            // Supabase returns null data instead of throwing for empty queries usually, 
            // but if the table doesn't exist or RLS blocks it, we get an error.
            // For now, let's treat empty results gracefully.
            setProducts([]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="md:hidden my-6 relative">
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search items..." 
          className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-300 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        <Search className="absolute left-3 top-3.5 w-5 h-5 text-neutral-400" />
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 my-12 lg:my-20">
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="font-heading font-extrabold text-5xl md:text-7xl tracking-tighter text-neutral-900">
            HERITAGE
            <br />
            <span className="text-primary-500">REIMAGINED</span>
          </h1>
          <p className="max-w-md mx-auto lg:mx-0 mt-6 text-lg text-neutral-600">
            The premium destination for curated African vintage, reworked classics, and emerging designers.
          </p>
          <div className="mt-8 flex justify-center lg:justify-start items-center gap-4">
            <button className="bg-primary-500 text-white font-semibold px-8 py-3 rounded-full hover:bg-primary-600 transition-transform active:scale-95 shadow-lg shadow-primary-200">
              Explore Drops
            </button>
            <button className="flex items-center gap-1.5 font-semibold text-neutral-800 hover:text-primary-500 transition">
              <span>Our Story</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="lg:w-1/2 w-full">
          <img 
            src="https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=1200&auto=format&fit=crop"
            alt="Clothing on hangers"
            className="rounded-3xl object-cover w-full h-full aspect-[4/3] lg:aspect-square shadow-2xl shadow-neutral-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar mb-8 pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat 
                ? 'bg-neutral-900 text-white' 
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4 tracking-tight">Fresh Finds</h2>
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
              onClick={() => {setSelectedCategory('All'); setSearchQuery('');}}
              className="mt-4 text-primary-600 font-semibold hover:underline text-sm"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};