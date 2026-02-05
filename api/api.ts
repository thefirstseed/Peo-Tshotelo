import { Product, Vendor, User, Review } from '../types';
import { MOCK_PRODUCTS, MOCK_VENDORS, MOCK_REVIEWS } from '../constants';

// --- API Simulation ---
// This simulates a database or a remote API endpoint.
let productsDB: Product[] = [...MOCK_PRODUCTS];
let vendorsDB: Vendor[] = [...MOCK_VENDORS];
let reviewsDB: Review[] = [...MOCK_REVIEWS]; // Make reviews mutable
// NOTE: This usersDB is for API lookups (e.g., finding a seller's email).
// The user authentication source of truth is in AuthContext for this mock setup.
let usersDB: User[] = [
  { id: 'user1', name: 'Thrifty Gabs', email: 'seller.gabs@example.com', role: 'seller', vendorId: 'v1' },
  { id: 'user2', name: 'Kagiso Dlamini', email: 'seller.kagiso@example.com', role: 'seller', vendorId: 'v2' },
  { id: 'user3', name: 'Boho Finds', email: 'seller.boho@example.com', role: 'seller', vendorId: 'v3' },
  { id: 'u1', name: 'Thabo Moeng', email: 'thabo@email.com', role: 'buyer', address: { street: '123 Main Road', city: 'Gaborone', country: 'Botswana' } },
  { id: 'u-test', name: 'Pula Buyer', email: 'buyer@kulture.com', role: 'buyer' },
];

const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Product Functions ---

export const fetchProducts = async (): Promise<Product[]> => {
  await simulateDelay(500);
  // Return a copy to prevent direct mutation from outside
  return [...productsDB];
};

export const fetchProduct = async (productId: string): Promise<Product> => {
  await simulateDelay(300);
  const product = productsDB.find(p => p.id === productId);
  if (product) {
    return { ...product }; // Return a copy
  }
  throw new Error('Product not found');
};

export const fetchProductsByVendor = async (vendorId: string): Promise<Product[]> => {
  await simulateDelay(400);
  return productsDB.filter(p => p.vendorId === vendorId);
};

export const deleteProduct = async (productId: string): Promise<void> => {
  await simulateDelay(500);
  const initialLength = productsDB.length;
  productsDB = productsDB.filter(p => p.id !== productId);
  if (productsDB.length === initialLength) {
    // This case isn't strictly necessary for the mock, but good practice
    console.warn(`Product with id ${productId} not found for deletion.`);
  }
  return;
};

export const createOrUpdateProduct = async (
  productData: Omit<Product, 'id' | 'vendorId' | 'vendorName'>,
  newImageFiles: File[],
  vendorId: string,
  productId?: string
): Promise<Product> => {
  await simulateDelay(1000);
  
  // Simulate image "uploads" - in reality, this would be a multipart form request to a backend
  // that would upload to a cloud storage and return URLs.
  console.log(`"Uploading" ${newImageFiles.length} new images...`);
  const newImageUrls = newImageFiles.map(file => `https://picsum.photos/seed/${Date.now()}-${file.name}/600/600`);

  if (productId) {
    // --- Update existing product ---
    const productIndex = productsDB.findIndex(p => p.id === productId);
    if (productIndex === -1) {
      throw new Error("Product to update not found");
    }
    // Security check: ensure the vendorId of the product being edited matches the user's vendorId
    if (productsDB[productIndex].vendorId !== vendorId) {
      throw new Error("User does not have permission to edit this product.");
    }
    const updatedProduct = {
      ...productsDB[productIndex],
      ...productData,
      imageUrls: [...productData.imageUrls, ...newImageUrls], // Combine existing and new
    };
    productsDB[productIndex] = updatedProduct;
    return updatedProduct;
  } else {
    // --- Create new product ---
    const vendor = vendorsDB.find(v => v.id === vendorId);
    if (!vendor) throw new Error("Seller not found for product creation.");

    const newProduct: Product = {
      id: `p${Date.now()}`,
      vendorId: vendor.id,
      vendorName: vendor.name,
      ...productData,
      imageUrls: [...productData.imageUrls, ...newImageUrls],
    };
    productsDB.unshift(newProduct); // Add to the top of the list for immediate visibility
    return newProduct;
  }
};


// --- Vendor Functions ---

export const fetchVendor = async (vendorId: string): Promise<Vendor> => {
  await simulateDelay(300);
  const vendor = vendorsDB.find(v => v.id === vendorId);
  if (!vendor) {
    throw new Error('Vendor not found');
  }
  
  // Dynamic rating calculation
  const vendorProducts = productsDB.filter(p => p.vendorId === vendorId);
  const vendorProductIds = vendorProducts.map(p => p.id);
  const vendorReviews = reviewsDB.filter(r => vendorProductIds.includes(r.productId));
  
  const totalRating = vendorReviews.reduce((sum, review) => sum + review.rating, 0);
  const reviewCount = vendorReviews.length;
  const averageRating = reviewCount > 0 ? parseFloat((totalRating / reviewCount).toFixed(1)) : vendor.rating; // fallback to mock rating if no reviews

  return { 
      ...vendor,
      rating: averageRating,
      reviewCount: reviewCount
  }; // Return a copy with dynamic data
};

export const updateVendorProfile = async (vendorId: string, updates: Partial<Vendor>): Promise<Vendor> => {
  await simulateDelay(800);
  const vendorIndex = vendorsDB.findIndex(v => v.id === vendorId);
  if (vendorIndex === -1) {
    throw new Error("Vendor not found for update.");
  }
  
  // Simulate image "uploads" if new files are provided
  if (updates.imageUrl && updates.imageUrl.startsWith('blob:')) {
    updates.imageUrl = `https://picsum.photos/seed/${Date.now()}-profile/400/400`;
  }
  if (updates.bannerUrl && updates.bannerUrl.startsWith('blob:')) {
    updates.bannerUrl = `https://picsum.photos/seed/${Date.now()}-banner/1200/400`;
  }
  
  vendorsDB[vendorIndex] = { ...vendorsDB[vendorIndex], ...updates };
  return { ...vendorsDB[vendorIndex] };
};

// --- User Functions ---

export const fetchUserByVendorId = async (vendorId: string): Promise<User> => {
  await simulateDelay(200);
  const user = usersDB.find(u => u.vendorId === vendorId);
  if (user) {
    // Return a safe version without sensitive info if this were a real app
    return { ...user };
  }
  throw new Error('User for vendor not found');
};

// --- Review Functions ---

export const fetchReviewsByProduct = async (productId: string): Promise<Review[]> => {
    await simulateDelay(250);
    return [...reviewsDB]
        .filter(r => r.productId === productId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const submitReview = async (productId: string, userId: string, userName: string, rating: number, comment: string): Promise<Review> => {
    await simulateDelay(600);
    const newReview: Review = {
        id: `r${Date.now()}`,
        productId,
        userId,
        userName,
        rating,
        comment,
        date: new Date().toISOString(),
    };
    reviewsDB.unshift(newReview); // add to top of the list
    return newReview;
};

// --- Payment Functions ---
export const processPayment = async (amount: number, paymentDetails: any): Promise<{success: boolean; transactionId: string}> => {
    console.log(`Processing payment of P ${amount.toFixed(2)} with details:`, paymentDetails);
    await simulateDelay(1500);

    // Simulate a random failure (e.g., 20% chance of failure)
    if (Math.random() < 0.2) {
        console.error("Mock Payment Failed: Insufficient funds.");
        throw new Error("Your payment could not be processed due to insufficient funds. Please try another card.");
    }

    console.log("Mock Payment Successful!");
    return {
        success: true,
        transactionId: `txn_${Date.now()}`
    };
};