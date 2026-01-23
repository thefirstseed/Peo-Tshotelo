import React, { useState, useEffect } from 'react';
import { ArrowLeft, DollarSign, Package, ShoppingCart, Edit, Trash2 } from 'lucide-react';
import { Product, Vendor } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { useAuth } from '../hooks/useAuth';
import { fetchProductsByVendor, deleteProduct } from '../api/api';
import { navigate } from '../router';

const salesData = [
  { month: 'Jan', Sales: 4000 }, { month: 'Feb', Sales: 3000 },
  { month: 'Mar', Sales: 5200 }, { month: 'Apr', Sales: 4800 },
  { month: 'May', Sales: 6100 }, { month: 'Jun', Sales: 5500 },
];

export const SellerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    if (user?.vendorId) {
      setIsLoading(true);
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
        <button onClick={() => navigate('/')} className="hidden md:flex items-center text-sm font-medium text-neutral-600 hover:text-neutral-900">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Shop
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={DollarSign} title="Total Revenue" value={`P ${totalRevenue.toFixed(2)}`} color="primary" />
        <StatCard icon={Package} title="Active Listings" value={products.length.toString()} color="blue" />
        <StatCard icon={ShoppingCart} title="New Orders" value={"5"} color="orange" />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200/80 mb-8">
        <h2 className="text-xl font-bold mb-4">Monthly Sales Performance</h2>
        <div style={{ width: '100%', height: 300 }}>
           <ResponsiveContainer>
              <BarChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" vertical={false} />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} stroke="#868e96" />
                <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="#868e96" tickFormatter={(value) => `P${value/1000}k`} />
                <Tooltip cursor={{fill: 'rgba(252, 227, 218, 0.5)'}} contentStyle={{backgroundColor: '#fff', border: '1px solid #ebe7e4', borderRadius: '0.5rem'}}/>
                <Legend iconSize={10} />
                <Bar dataKey="Sales" fill="#e85d3b" radius={[4, 4, 0, 0]} />
              </BarChart>
           </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-neutral-200/80">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Listings</h2>
            <button 
              onClick={() => navigate('/products/new')}
              className="bg-neutral-900 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-neutral-800"
            >
              Add New Product
            </button>
          </div>
          <div className="space-y-4">
            {isLoading ? <p>Loading listings...</p> : products.length > 0 ? products.map(product => (
              <ProductRow 
                key={product.id} 
                product={product} 
                onEditClick={() => navigate(`/products/edit/${product.id}`)}
                onDeleteClick={() => setProductToDelete(product)}
              />
            )) : <p className="text-neutral-500 text-center py-8">You have no active listings.</p>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200/80">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="space-y-4">
            <OrderRow customer="Onalenna" items={1} status="New" />
            <OrderRow customer="Thato" items={2} status="Shipped" />
            <OrderRow customer="Lerato" items={1} status="New" />
            <OrderRow customer="Amara" items={3} status="Completed" />
          </div>
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

const StatCard = ({ icon: Icon, title, value, color }) => (
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

const ProductRow = ({ product, onEditClick, onDeleteClick }: { product: Product; onEditClick: () => void; onDeleteClick: () => void }) => (
  <div className="flex items-center gap-4 p-3 hover:bg-neutral-100 rounded-lg transition-colors">
    <img src={product.imageUrls[0]} alt={product.title} className="w-16 h-16 object-cover rounded-md bg-neutral-100" />
    <div className="flex-1">
      <p className="font-semibold text-neutral-900">{product.title}</p>
      <p className="text-sm text-neutral-600">Price: P {product.price.toFixed(2)}</p>
    </div>
    <div className="flex items-center gap-4 text-sm">
      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium text-xs">Active</span>
      <div className="flex gap-2">
        <button onClick={onEditClick} className="text-neutral-500 hover:text-blue-600"><Edit className="w-5 h-5" /></button>
        <button onClick={onDeleteClick} className="text-neutral-500 hover:text-red-600"><Trash2 className="w-5 h-5" /></button>
      </div>
    </div>
  </div>
);

const OrderRow = ({ customer, items, status }) => {
    const statusStyles = {
        New: 'bg-orange-100 text-orange-800',
        Shipped: 'bg-blue-100 text-blue-800',
        Completed: 'bg-neutral-200 text-neutral-800'
    };
    return (
        <div className="flex items-center justify-between p-3 hover:bg-neutral-100 rounded-lg">
            <div>
                <p className="font-semibold">{customer}</p>
                <p className="text-sm text-neutral-500">{items} item(s)</p>
            </div>
            <span className={`px-2 py-1 rounded-full font-medium text-xs ${statusStyles[status]}`}>{status}</span>
        </div>
    )
};