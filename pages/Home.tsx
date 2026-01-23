import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES } from '../constants';
import { Filter, Search } from 'lucide-react';
import { fetchProducts } from '../api/api';

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
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error(err);
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
      
      <div className="md:hidden mb-6 relative">
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search items..." 
          className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-300 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        <Search className="absolute left-3 top-3.5 w-5 h-5 text-neutral-400" />
      </div>

      <div className="mb-8 rounded-2xl bg-primary-800 p-8 md:p-12 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tighter">Find Your Next Favourite Thing</h1>
          <p className="text-primary-200 mb-6 text-lg">Buy, sell, and discover unique secondhand items from sellers across Botswana.</p>
          <button className="bg-white text-primary-800 font-semibold px-6 py-2.5 rounded-full hover:bg-neutral-100 transition-transform active:scale-95">
            Explore Feed
          </button>
        </div>
        <div className="absolute -right-16 -bottom-20 h-48 w-48 text-primary-700 opacity-50">
           <svg fill="currentColor" viewBox="0 0 200 200"><path d="M 50, 150 C 10, 130 10, 30 50, 10 S 90, -10 130, 10 S 190, 30 190, 50 S 170, 90 190, 130 S 150, 190 130, 190 S 90, 210 50, 190 S -10, 170 10, 150 S 50, 150 50, 150 Z"></path></svg>
        </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar mb-8 pb-2">
        <button className="p-2.5 rounded-full bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-700">
          <Filter className="w-5 h-5" />
        </button>
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