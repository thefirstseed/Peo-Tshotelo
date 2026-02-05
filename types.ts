export interface Vendor {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  bannerUrl: string;
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
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// Represents a product review
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: string; // ISO 8601 format
}

// Represents the currently logged-in user
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  role: 'buyer' | 'seller';
  vendorId?: string; // Only if role is 'seller'
  address?: {
    street: string;
    city: string;
    country: string;
  },
  phone?: {
    number: string;
    verified: boolean;
  },
  identity?: {
    nationality: string;
    dateOfBirth: string;
    idType: string;
    idNumber: string;
  }
  bankDetails?: {
    bankName: string;
    accountHolder: string;
    accountNumber: string;
    branchCode: string;
  },
  mobileMoneyDetails?: {
    provider: string;
    name: string;
    number: string;
  }
}

// ViewState is no longer needed for routing, but might be useful for other UI states.
// For now, it's removed to reflect the new routing architecture.
// export type ViewState = ...