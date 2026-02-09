import React, { useState, useEffect } from 'react';
import { DollarSign, Package, ShoppingCart, Edit, Trash2, Plus, AlertTriangle, Store, Clock, Banknote, Heart, Users } from 'lucide-react';
import { Product, Vendor } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { useAuth } from '../hooks/useAuth';
import { fetchProductsByVendor, deleteProduct, fetchVendor } from '../api/api';
import { navigate } from '../router';
import { ActivityFeed } from '../components/ActivityFeed';

// TODO Backend: Replace MOCK_REVENUE with GET /api/sellers/:id/analytics
const MOCK_REVENUE_DATA = [
  { month: 'Jan', revenue: 1200 }, { month: 'Feb', revenue: 1900 },
  { month: 'Mar', revenue: 2500 }, { month: 'Apr', revenue: 2200 },
  { month: 'May', revenue: 3100 }, { month: 'Jun', revenue: 2800 },
];
// TODO Backend: Replace with GET /api/sellers/:id/orders
const MOCK_ORDERS = [
    { id: '#12845', customer: 'Alice Johnson', date: '2024-05-28', total: 'P 250.00', status: 'Shipped' },
    { id: '#12844', customer: 'David Smith', date: '2024-05-27', total: 'P 120.00', status: 'Delivered' },
    { id: '#12842', customer: 'Mary Williams', date: '2024-05-26', total: 'P 450.00', status: 'Processing' },
    { id: '#12841', customer: 'James Brown', date: '2024-05-25', total: 'P 180.00', status: 'Delivered' },
];

const IncompleteProfileBanner: React.FC = () => (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-4 flex-shrink-0" />
            <div>
                <h3 className="font-bold text-yellow-800">Complete Your Seller Profile</h3>
                <p className="text-sm text-yellow-700">You need to complete your onboarding before you can add products and start selling.</p>
            </div>
        </div>
        <button 
            onClick={() => navigate('/sell')}
            className="bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-yellow-600 transition whitespace-nowrap ml-4"
        >
            Complete Setup
        </button>
    </div>
);


export const SellerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const isProfileComplete = !!user?.vendorId;

  useEffect(() => {
    if (user?.vendorId) {
      setIsLoading(true);
      setError(null);
      Promise.all([
        fetchProductsByVendor(user.vendorId),
        fetchVendor(user.vendorId)
      ]).then(([prods, vndr]) => {
        setProducts(prods);
        setVendor(vndr);
      }).catch(err => {
            console.error("Failed to fetch dashboard data:", err);
            setError("Could not load your dashboard. Please refresh the page.");
      }).finally(() => setIsLoading(false));
    } else {
        // If profile is not complete, we don't need to fetch products.
        setIsLoading(false);
    }
  }, [user]);

  // Effect to clear delete error message after a few seconds
  useEffect(() => {
    if (deleteError) {
        const timer = setTimeout(() => setDeleteError(null), 5000);
        return () => clearTimeout(timer);
    }
  }, [deleteError]);

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      setDeleteError(null);
      try {
        await deleteProduct(productToDelete.id);
        setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      } catch (err) {
        console.error("Failed to delete product:", err);
        setDeleteError(`Could not delete "${productToDelete.title}". Please try again.`);
      } finally {
        setProductToDelete(null);
      }
    }
  };

  // Check if the seller has any listed products to determine if they are "established"
  const isEstablishedSeller = products.length > 0;
  
  // Conditionally set revenue data. New sellers see zero.
  const revenueData = isEstablishedSeller ? MOCK_REVENUE_DATA : [];
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  
  const totalLikes = products.reduce((sum, product) => sum + product.likeCount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Seller Dashboard</h1>
          <p className="text-neutral-500 mt-1">Welcome back, {user?.name || 'Seller'}!</p>
        </div>
        <div className="flex items-center gap-3">
             <button 
              onClick={() => navigate('/settings/storefront')}
              className="bg-white text-neutral-800 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-neutral-100 border border-neutral-200 flex items-center gap-2"
            >
              <Store className="w-4 h-4"/> Customize Store
            </button>
            <button 
              onClick={() => navigate('/products/new')}
              disabled={!isProfileComplete}
              title={!isProfileComplete ? "Complete your profile to add products" : "Add a new product"}
              className="bg-neutral-900 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-neutral-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4"/> New Product
            </button>
        </div>
      </div>
      
      {!isProfileComplete && <IncompleteProfileBanner />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={DollarSign} title="Total Revenue" value={`P ${totalRevenue.toFixed(2)}`} color="primary" />
        <StatCard icon={Heart} title="Total Likes" value={totalLikes.toString()} color="orange" />
        <StatCard icon={Users} title="Followers" value={vendor?.followerCount.toString() || '0'} color="blue" />
        <StatCard icon={Package} title="Products" value={products.length.toString()} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-neutral-200/80">
            <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left min-w-[640px]">
                    <thead className="text-xs text-neutral-500 uppercase bg-neutral-50 rounded-t-lg">
                        <tr>
                            <th className="px-4 py-3">Order ID</th>
                            <th className="px-4 py-3">Customer</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Total</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_ORDERS.map(order => (
                            <tr key={order.id} className="border-b last:border-b-0">
                                <td className="px-4 py-3 font-medium text-neutral-800">{order.id}</td>
                                <td className="px-4 py-3">{order.customer}</td>
                                <td className="px-4 py-3">{order.date}</td>
                                <td className="px-4 py-3">{order.total}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>{order.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200/80">
                <h2 className="text-xl font-bold mb-4">Revenue</h2>
                <div style={{ width: '100%', height: 250 }}>
                   {isEstablishedSeller ? (
                       <ResponsiveContainer>
                          <BarChart data={revenueData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ebe7e4" vertical={false} />
                            <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} stroke="#716b65" />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="#716b65" tickFormatter={(value) => `P${value/1000}k`} />
                            <Tooltip cursor={{fill: 'rgba(232, 93, 59, 0.1)'}} contentStyle={{backgroundColor: '#fff', border: '1px solid #ebe7e4', borderRadius: '0.75rem'}}/>
                            <Bar dataKey="revenue" fill="#e85d3b" radius={[4, 4, 0, 0]} />
                          </BarChart>
                       </ResponsiveContainer>
                   ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-neutral-500">
                            <Banknote className="w-10 h-10 mb-2 text-neutral-300" />
                            <p className="font-medium text-sm">No revenue data yet</p>
                            <p className="text-xs">Your sales will appear here once you make them.</p>
                        </div>
                   )}
                </div>
            </div>
            <ActivityFeed />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200/80 mt-8">
        <h2 className="text-xl font-bold mb-4">Your Listings</h2>
        {deleteError && (
            <div className="flex items-start gap-2 text-xs text-red-600 mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{deleteError}</span>
            </div>
        )}
        <div className="space-y-2">
          {isLoading ? (
            <p className="text-center py-8 text-neutral-500">Loading listings...</p>
          ) : error ? (
            <p className="text-center py-8 text-red-600">{error}</p>
          ) : !isProfileComplete ? (
            <p className="text-neutral-500 text-center py-8">Complete your seller profile to manage your listings.</p>
          ) : products.length > 0 ? (
            products.map(product => (
              <ProductRow 
                key={product.id} 
                product={product} 
                onEditClick={() => navigate(`/products/edit/${product.id}`)}
                onDeleteClick={() => setProductToDelete(product)}
              />
            ))
          ) : (
            <p className="text-neutral-500 text-center py-8">You have no active listings. Add your first product to get started!</p>
          )}
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
    orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
    green: { bg: 'bg-green-50', text: 'text-green-700' },
};

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  color: keyof typeof colorVariants;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, color, onClick }) => (
  <div 
    className={`bg-white p-6 rounded-2xl shadow-sm border border-neutral-200/80 flex items-center gap-4 ${onClick ? 'cursor-pointer hover:border-primary-300 hover:bg-primary-50' : ''}`}
    onClick={onClick}
  >
    <div className={`w-12 h-12 ${colorVariants[color]?.bg || 'bg-neutral-100'} rounded-xl flex items-center justify-center`}>
      <Icon className={`w-6 h-6 ${colorVariants[color]?.text || 'text-neutral-600'}`} />
    </div>
    <div>
      <p className="text-sm text-neutral-600">{title}</p>
      <p className="text-2xl font-bold text-neutral-900 truncate">{value}</p>
    </div>
  </div>
);

interface ProductRowProps {
  product: Product;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const StockStatus: React.FC<{ stock: number }> = ({ stock }) => {
    if (stock === 0) {
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800">Sold Out</span>;
    }
    if (stock <= 5) {
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-800">Low Stock ({stock})</span>;
    }
    return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">In Stock ({stock})</span>;
};

const ProductRow: React.FC<ProductRowProps> = ({ product, onEditClick, onDeleteClick }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 hover:bg-neutral-100 rounded-xl transition-colors">
    <img src={product.imageUrls[0]} alt={product.title} className="w-20 h-20 sm:w-16 sm:h-16 object-cover rounded-md bg-neutral-100 flex-shrink-0" />
    <div className="flex-1 flex flex-col sm:flex-row sm:items-center w-full gap-2">
      <div className="flex-1">
        <p className="font-semibold text-neutral-900 truncate">{product.title}</p>
        <p className="text-xs text-neutral-500">{product.category}</p>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
        <div className="sm:w-32 text-left">
          <StockStatus stock={product.stock} />
        </div>
        <p className="text-sm text-neutral-700 font-medium sm:w-24 text-left">P {product.price.toFixed(2)}</p>
        <div className="flex items-center justify-end gap-1 sm:w-20">
          <button onClick={onEditClick} className="p-2 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-5 h-5" /></button>
          <button onClick={onDeleteClick} className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  </div>
);