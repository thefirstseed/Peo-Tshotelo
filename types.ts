export interface Vendor {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  description: string;
  joinedDate: string;
  verified: boolean;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  vendorId: string;
  vendorName: string; // Denormalized for simpler display
  description: string;
  imageUrls: string[];
  category: 'Clothing' | 'Accessories' | 'Home' | 'Art' | 'Services';
  sizes?: string[];
  condition?: 'New' | 'Like New' | 'Good' | 'Fair';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// Represents the currently logged-in user
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller';
  vendorId?: string; // Only if role is 'seller'
}

// ViewState is no longer needed for routing, but might be useful for other UI states.
// For now, it's removed to reflect the new routing architecture.
// export type ViewState = ...