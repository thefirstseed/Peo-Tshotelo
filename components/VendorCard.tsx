import React from 'react';
import { Vendor } from '../types';
import { navigate } from '../router';
import { Star, BadgeCheck } from 'lucide-react';

interface VendorCardProps {
  vendor: Vendor;
}

export const VendorCard: React.FC<VendorCardProps> = ({ vendor }) => {
  const handleClick = () => {
    navigate(`/sellers/${vendor.id}`);
  };

  return (
    <div 
      onClick={handleClick} 
      className="flex-shrink-0 w-64 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer overflow-hidden group hover:-translate-y-1"
    >
      <div className="h-24 bg-neutral-200 relative">
        <img 
          src={`https://picsum.photos/seed/${vendor.id}cover/400/200`} 
          alt={`${vendor.name} cover`} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-white bg-neutral-100 overflow-hidden shadow-md">
           <img src={vendor.imageUrl} alt={vendor.name} className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="pt-12 pb-4 px-4 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <h3 className="font-bold text-lg text-neutral-900 truncate">{vendor.name}</h3>
          {vendor.verified && <BadgeCheck className="w-5 h-5 text-primary-500 flex-shrink-0" />}
        </div>
        <div className="flex items-center justify-center text-sm text-neutral-500 mt-1">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 mr-1" />
          <span className="font-medium text-neutral-700">{vendor.rating}</span>
          <span className="text-neutral-400 ml-1">({vendor.reviewCount})</span>
        </div>
      </div>
    </div>
  );
};
