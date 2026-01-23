import { Product, Vendor, User } from '../types';
import { MOCK_PRODUCTS, MOCK_VENDORS } from '../constants';

// --- API Simulation ---
// This simulates a database or a remote API endpoint.
let productsDB: Product[] = [...MOCK_PRODUCTS];
const vendorsDB: Vendor[] = [...MOCK_VENDORS];

const simulateDelay = (delay = 500) => new Promise(res => setTimeout(res, delay));

// --- Auth API ---
export const login = async (email: string, password: string): Promise<User> => {
  await simulateDelay();
  // In a real backend, you'd query a user database and check a hashed password.
  if (email === 'seller@kulture.com' && password === 'password') {
    return {
      id: 'user1',
      name: 'Thrifty Gabs',
      email: 'seller@kulture.com',
      role: 'seller',
      vendorId: 'v1'
    };
  }
  if (email === 'buyer@kulture.com' && password === 'password') {
    return {
      id: 'user2',
      name: 'Pula Buyer',
      email: 'buyer@kulture.com',
      role: 'buyer'
    };
  }
  throw new Error('Invalid credentials');
};

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
  existingId?: string
): Promise<Product> => {
  await simulateDelay(1000);
  const loggedInVendor = vendorsDB.find(v => v.id === 'v1'); // Simulate logged in seller
  if (!loggedInVendor) throw new Error("Authentication error");

  if (existingId) {
    // Update
    const productIndex = productsDB.findIndex(p => p.id === existingId);
    if (productIndex === -1) throw new Error("Product to update not found");
    const updatedProduct = { ...productsDB[productIndex], ...productData };
    productsDB[productIndex] = updatedProduct;
    return updatedProduct;
  } else {
    // Create
    const newProduct: Product = {
      ...productData,
      id: `p${Date.now()}`,
      vendorId: loggedInVendor.id,
      vendorName: loggedInVendor.name
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