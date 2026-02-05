import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
  className?: string;
  isInteractive?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  size = 20,
  className = '',
  isInteractive = false,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index: number) => {
    if (isInteractive) setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (isInteractive) setHoverRating(0);
  };

  const handleClick = (index: number) => {
    if (isInteractive && onRatingChange) {
      onRatingChange(index);
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className} ${isInteractive ? 'cursor-pointer' : ''}`} onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((index) => {
        const fillValue = hoverRating >= index ? 'fill-yellow-400' : rating >= index ? 'fill-yellow-400' : 'fill-neutral-300';
        return (
          <Star
            key={index}
            size={size}
            className={`text-yellow-400 transition-colors ${fillValue}`}
            onMouseEnter={() => handleMouseEnter(index)}
            onClick={() => handleClick(index)}
          />
        );
      })}
    </div>
  );
};