import { Product, Vendor, User } from '../types';
import { MOCK_PRODUCTS, MOCK_VENDORS } from '../constants';

// --- API Simulation ---
// This simulates a database or a remote API endpoint.
let productsDB: Product[] = [...MOCK_PRODUCTS];
const vendorsDB: Vendor[] = [...MOCK_VENDORS];
let usersDB: User[] = [
  { id: 'user1', name: 'Thrifty Gabs', email: 'seller.gabs@example.com', role: 'seller', vendorId: 'v1' },
  { id: 'user2', name: 'Kagiso Dlamini', email: 'seller.kagiso@example.com', role: 'seller', vendorId: 'v2' },
  { id: 'user3', name: 'Boho Finds', email: 'seller.boho@example.com', role: 'seller', vendorId: 'v3' },
  { id: 'user4', name: 'Pula Buyer', email: 'buyer@kulture.com', role: 'buyer' },
];

const simulateDelay = (delay = 500) => new Promise(res => setTimeout(res, delay));

// --- Auth API ---
export const login = async (email: string, password: string): Promise<User> => {
  await simulateDelay();
  // In a real backend, you'd query a user database and check a hashed password.
  const user = usersDB.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    // We're not checking password for this mock API
    return user;
  }
  throw new Error('Invalid credentials');
};

export const register = async (name: string, email: string, password: string): Promise<User> => {
    await simulateDelay();
    const existingUser = usersDB.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        throw new Error('An account with this email already exists.');
    }
    const newUser: User = {
        id: `user${Date.now()}`,
        name,
        email,
        role: 'buyer'
    };
    usersDB.push(newUser);
    return newUser;
};

// --- User API ---
export const fetchUserByVendorId = async (vendorId: string): Promise<User | null> => {
    await simulateDelay(100);
    const user = usersDB.find(u => u.vendorId === vendorId);
    return user || null;
}


// --- Product API ---
export const fetchProducts = async (): Promise<Product[]> => {
  await simulateDelay();
  return [...productsDB];
};

export const fetchProduct = async (id: string): Promise<Product> => {
  await simulateDelay();
  const product = productsDB.find(p => p.id === id);
  if (product) {
    return { ...product };
  }
  throw new Error('Product not found');
};

export const fetchProductsByVendor = async (vendorId: string): Promise<Product[]> => {
  await simulateDelay();
  return productsDB.filter(p => p.vendorId === vendorId);
};

export const createOrUpdateProduct = async (
  productData: Omit<Product, 'id' | 'vendorId' | 'vendorName'>,
  newImages: File[], // In a real API, this would be part of a multipart/form-data
  existingId?: string
): Promise<Product> => {
  await simulateDelay(1000);
  // TODO Backend: Replace this hardcoded find with the user from the verified JWT.
  // The server-side auth middleware should attach the user object (containing vendorId) to the request.
  const loggedInVendor = vendorsDB.find(v => v.id === 'v1'); // Simulate logged in seller
  if (!loggedInVendor) throw new Error("Authentication error");

  // Simulate image upload by creating blob URLs
  const uploadedImageUrls = newImages.map(file => URL.createObjectURL(file));
  const allImageUrls = [...productData.imageUrls, ...uploadedImageUrls];

  if (existingId) {
    // Update
    const productIndex = productsDB.findIndex(p => p.id === existingId && p.vendorId === loggedInVendor.id);
    if (productIndex === -1) throw new Error("Product to update not found or permission denied");
    
    const updatedProduct: Product = { 
      ...productsDB[productIndex], 
      ...productData,
      imageUrls: allImageUrls
    };
    productsDB[productIndex] = updatedProduct;
    return updatedProduct;
  } else {
    // Create
    const newProduct: Product = {
      ...productData,
      id: `p${Date.now()}`,
      vendorId: loggedInVendor.id,
      vendorName: loggedInVendor.name,
      imageUrls: allImageUrls,
    };
    productsDB = [newProduct, ...productsDB];
    return newProduct;
  }
};

export const deleteProduct = async (productId: string): Promise<void> => {
    await simulateDelay(800);
    const initialLength = productsDB.length;
    productsDB = productsDB.filter(p => p.id !== productId);
    if (productsDB.length === initialLength) {
        throw new Error("Product not found for deletion.");
    }
    // In a real API, you'd return a 204 No Content status.
    return;
};


// --- Vendor API ---
export const fetchVendor = async (id: string): Promise<Vendor> => {
  await simulateDelay();
  const vendor = vendorsDB.find(v => v.id === id);
  if (vendor) {
    return { ...vendor };
  }
  throw new Error('Vendor not found');
};