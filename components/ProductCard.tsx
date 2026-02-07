import React from 'react';
import { Product } from '../types';
import { MapPin, Heart } from 'lucide-react';
import { navigate } from '../router';
import { useLikes } from '../hooks/useLikes';
import { useAuth } from '../hooks/useAuth';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isLiked, addToLikes, removeFromLikes } = useLikes();
  const { user } = useAuth();
  const liked = isLiked(product.id);

  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking the heart
    if (!user) {
        navigate('/login');
        return;
    }
    if (liked) {
      removeFromLikes(product.id);
    } else {
      addToLikes(product);
    }
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
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${product.stock === 0 ? 'grayscale' : ''}`}
        />
        
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-neutral-800 text-xs font-bold px-3 py-1.5 rounded-sm uppercase tracking-wider">
              Sold Out
            </span>
          </div>
        )}

        <button 
          onClick={handleLikeToggle}
          className="absolute top-2.5 right-2.5 bg-white/70 backdrop-blur-sm p-2 rounded-full z-10 hover:bg-white transition-transform duration-200 active:scale-125"
          aria-label={liked ? "Remove from likes" : "Add to likes"}
        >
          <Heart 
            className={`w-5 h-5 transition-all ${liked ? 'text-red-500 fill-red-500' : 'text-neutral-600'}`} 
          />
        </button>

        {product.condition === 'New' && product.stock > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-neutral-900 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
            New
          </span>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-neutral-800 leading-snug pr-2">{product.title}</h3>
          <div className="flex items-center text-xs text-neutral-500">
             <Heart className="w-3.5 h-3.5 mr-1" />
             <span>{product.likeCount}</span>
          </div>
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