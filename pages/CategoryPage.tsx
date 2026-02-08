import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { fetchProducts } from '../api/api';
import { useParams, useQuery, navigate } from '../router';
import { format } from 'path';

// Helper to format slugs and brands for display
const formatTitle = (text: string) => {
    return text
        .replace(/-/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
};

export const CategoryPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { slug } = useParams();
    const query = useQuery();
    const brandQuery = query.get('brand');
    const searchQuery = query.get('q'); // For future use if we add search to this page

    useEffect(() => {
        const loadData = async () => {
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
        loadData();
    }, []);

    const filteredProducts = useMemo(() => {
        if (!slug) return [];

        return products.filter(product => {
            // Filter by brand from query parameter
            const matchesBrand = brandQuery ? product.brand.toLowerCase() === brandQuery.toLowerCase() : true;

            // Filter by department and category from URL slug
            const slugParts = slug.split('-');
            const department = slugParts[0];
            const categorySearchString = slugParts.slice(1).join(' ');

            const matchesDepartment = product.department === department;
            
            let matchesCategory = true;
            if (categorySearchString) {
                // This allows for partial matches, e.g., 'pants' slug matches 'Pants & Jeans' category
                matchesCategory = product.category.toLowerCase().includes(categorySearchString);
            }

            return matchesBrand && matchesDepartment && matchesCategory;
        });
    }, [products, slug, brandQuery]);
    
    // Generate a dynamic title for the page
    const pageTitle = useMemo(() => {
        if (!slug) return "Products";
        let title = formatTitle(slug);
        if (brandQuery) {
            title = `${formatTitle(brandQuery)} for ${formatTitle(slug.split('-')[0])}`;
        }
        return title;
    }, [slug, brandQuery]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-6 tracking-tight">{pageTitle}</h1>
            
            {/* TODO: Add advanced filtering controls here (size, price, condition, etc.) */}

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
                    <p className="font-medium">No products found for this category.</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="mt-4 text-primary-600 font-semibold hover:underline text-sm"
                    >
                        Browse all items
                    </button>
                </div>
            )}
        </div>
    );
};
