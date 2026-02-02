import { Product, Vendor, User } from '../types';
import { supabase } from '../src/lib/supabase';

// --- Auth API ---
// Login is now handled directly in AuthContext or via supabase.auth
export const login = async (email: string, password: string): Promise<User> => {
  // Legacy support or direct usage if needed, but AuthContext uses supabase.auth directly now.
  // For compatibility with existing components calling api.login, we can wrap it.
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error("No user returned");

  // We need to fetch the profile to return a User object, but ideally components should wait for AuthContext to update.
  // This function signature returns a Promise<User>, so we simulate it.
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();

  return {
    id: data.user.id,
    email: data.user.email!,
    name: profile?.full_name || data.user.email!.split('@')[0],
    role: profile?.role || 'buyer'
  };
};

// --- Product API ---
export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, vendors(name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn("Supabase fetch error:", error);
    return []; // Return empty array on error to prevent app crash
  }

  return (data || []).map((p: any) => ({
    ...p,
    vendorName: p.vendors?.name,
    imageUrls: p.image_urls || [],
    sizes: p.sizes || []
  }));
};

export const fetchProduct = async (id: string): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, vendors(name)')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);

  return {
    ...data,
    vendorName: data.vendors?.name,
    imageUrls: data.image_urls || [],
    sizes: data.sizes || []
  };
};

export const fetchProductsByVendor = async (vendorId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, vendors(name)')
    .eq('vendor_id', vendorId);

  if (error) throw new Error(error.message);

  return data.map((p: any) => ({
    ...p,
    vendorName: p.vendors?.name,
    imageUrls: p.image_urls || [],
    sizes: p.sizes || []
  }));
};

export const createOrUpdateProduct = async (
  productData: Omit<Product, 'id' | 'vendorId' | 'vendorName'>,
  existingId?: string
): Promise<Product> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Get vendor for this user
  const { data: vendor } = await supabase
    .from('vendors')
    .select('id, name')
    .eq('owner_id', user.id)
    .single();

  if (!vendor) throw new Error("No vendor profile found");

  const payload = {
    title: productData.title,
    description: productData.description,
    price: productData.price,
    category: productData.category,
    condition: productData.condition,
    sizes: productData.sizes,
    image_urls: productData.imageUrls,
    vendor_id: vendor.id
  };

  let result;
  if (existingId) {
    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', existingId)
      .select()
      .single();
    if (error) throw error;
    result = data;
  } else {
    const { data, error } = await supabase
      .from('products')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    result = data;
  }

  return {
    ...result,
    vendorName: vendor.name,
    imageUrls: result.image_urls,
    sizes: result.sizes
  };
};

export const deleteProduct = async (productId: string): Promise<void> => {
  const { error } = await supabase.from('products').delete().eq('id', productId);
  if (error) throw error;
};


// --- Vendor API ---
export const fetchVendor = async (id: string): Promise<Vendor> => {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);

  return {
    ...data,
    imageUrl: data.image_url,
    reviewCount: data.review_count,
    joinedDate: data.joined_date
  };
};
