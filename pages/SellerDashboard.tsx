import React, { useState, useEffect } from 'react';
import { ArrowLeft, DollarSign, Package, ShoppingCart, Edit, Trash2, Plus } from 'lucide-react';
import { Product } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { useAuth } from '../hooks/useAuth';
import { fetchProductsByVendor, deleteProduct } from '../api/api';
import { navigate } from '../router';

// TODO Backend: Replace MOCK_REVENUE with GET /api/sellers/:id/analytics
const MOCK_REVENUE_DATA = [
  { month: 'Jan', revenue: 1200 }, { month: 'Feb', revenue: 1900 },
  { month: 'Mar', revenue: 2500 }, { month: 'Apr', revenue: 2200 },
  { month: 'May', revenue: 3100 }, { month: 'Jun', revenue: 2800 },
];

export const SellerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    if (user?.vendorId) {
      setIsLoading(true);
      // TODO Backend: Filter products by logged-in seller's vendorId
      fetchProductsByVendor(user.vendorId)
        .then(setProducts)
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete.id);
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      setProductToDelete(null);
    }
  };

  const totalRevenue = products.reduce((sum, product) => sum + product.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Seller Dashboard</h1>
          <p className="text-neutral-500 mt-1">Welcome back, {user?.name || 'Seller'}!</p>
        </div>
        <button 
          onClick={() => navigate('/products/new')}
          className="bg-neutral-900 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-neutral-800 flex items-center gap-2"
        >
          <Plus className="w-4 h-4"/> New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={DollarSign} title="Total Revenue" value={`P ${totalRevenue.toFixed(2)}`} color="primary" />
        <StatCard icon={Package} title="Active Listings" value={products.length.toString()} color="blue" />
        <StatCard icon={ShoppingCart} title="Sales (Month)" value={"12"} color="orange" />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200/80 mb-8">
        <h2 className="text-xl font-bold mb-4">Monthly Revenue</h2>
        <div style={{ width: '100%', height: 300 }}>
           <ResponsiveContainer>
              <BarChart data={MOCK_REVENUE_DATA} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ebe7e4" vertical={false} />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} stroke="#716b65" />
                <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="#716b65" tickFormatter={(value) => `P${value/1000}k`} />
                <Tooltip cursor={{fill: 'rgba(232, 93, 59, 0.1)'}} contentStyle={{backgroundColor: '#fff', border: '1px solid #ebe7e4', borderRadius: '0.75rem'}}/>
                <Bar dataKey="revenue" fill="#e85d3b" radius={[4, 4, 0, 0]} />
              </BarChart>
           </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200/80">
        <h2 className="text-xl font-bold mb-4">Your Listings</h2>
        <div className="space-y-2">
          {isLoading ? <p>Loading listings...</p> : products.length > 0 ? products.map(product => (
            <ProductRow 
              key={product.id} 
              product={product} 
              onEditClick={() => navigate(`/products/edit/${product.id}`)}
              onDeleteClick={() => setProductToDelete(product)}
            />
          )) : <p className="text-neutral-500 text-center py-8">You have no active listings. Add your first product to get started!</p>}
        </div>
      </div>

      {productToDelete && (
        <ConfirmationDialog
          isOpen={!!productToDelete}
          onClose={() => setProductToDelete(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Product"
        >
          Are you sure you want to delete the product "{productToDelete.title}"? This action cannot be undone.
        </ConfirmationDialog>
      )}
    </div>
  );
};

// Sub-components
const colorVariants = {
    primary: { bg: 'bg-primary-50', text: 'text-primary-700' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600' }
};

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  color: keyof typeof colorVariants;
}

const StatCard = ({ icon: Icon, title, value, color }: StatCardProps) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200/80 flex items-center gap-4">
    <div className={`w-12 h-12 ${colorVariants[color]?.bg || 'bg-neutral-100'} rounded-xl flex items-center justify-center`}>
      <Icon className={`w-6 h-6 ${colorVariants[color]?.text || 'text-neutral-600'}`} />
    </div>
    <div>
      <p className="text-sm text-neutral-600">{title}</p>
      <p className="text-2xl font-bold text-neutral-900">{value}</p>
    </div>
  </div>
);

interface ProductRowProps {
  product: Product;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const ProductRow = ({ product, onEditClick, onDeleteClick }: ProductRowProps) => (
  <div className="flex items-center gap-4 p-3 hover:bg-neutral-100 rounded-xl transition-colors">
    <img src={product.imageUrls[0]} alt={product.title} className="w-16 h-16 object-cover rounded-md bg-neutral-100 flex-shrink-0" />
    <div className="flex-1 grid grid-cols-4 gap-4 items-center">
        <div className="col-span-2">
            <p className="font-semibold text-neutral-900 truncate">{product.title}</p>
            <p className="text-sm text-neutral-500">{product.category} &middot; {product.condition}</p>
        </div>
        <p className="text-sm text-neutral-700 font-medium">P {product.price.toFixed(2)}</p>
        <div className="flex items-center justify-end gap-2">
            <button onClick={onEditClick} className="p-2 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-5 h-5" /></button>
            <button onClick={onDeleteClick} className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
        </div>
    </div>
  </div>
);
