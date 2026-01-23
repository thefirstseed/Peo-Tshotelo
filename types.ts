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

// Simple routing types
export type ViewState = 
  | { type: 'HOME' }
  | { type: 'PRODUCT_DETAILS'; data: Product }
  | { type: 'VENDOR_PROFILE'; data: Vendor }
  | { type: 'CART' }
  | { type: 'VENDOR_ONBOARDING' }
  | { type: 'SELLER_DASHBOARD' }
  | { type: 'PRODUCT_EDIT'; data?: Product }; // data is optional for new products