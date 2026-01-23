import React from 'react';
import { Product } from '../types';
import { MapPin } from 'lucide-react';
import { navigate } from '../router';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer flex flex-col h-full hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <img 
          src={product.imageUrls[0] || 'https://picsum.photos/seed/placeholder/600/600'} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.condition === 'New' && (
          <span className="absolute top-2.5 left-2.5 bg-neutral-900 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
            New
          </span>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-neutral-800 leading-snug pr-2">{product.title}</h3>
        </div>
        
        <p className="text-sm text-neutral-600 mb-2 truncate">{product.vendorName}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="font-bold text-lg text-neutral-900">P {product.price.toFixed(2)}</span>
          <div className="flex items-center text-xs text-neutral-500">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            <span>Gabs</span>
          </div>
        </div>
      </div>
    </div>
  );
};