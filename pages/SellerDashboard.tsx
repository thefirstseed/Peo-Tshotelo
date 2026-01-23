import React, { useState } from 'react';
import { ArrowLeft, DollarSign, Package, ShoppingCart, Edit, Trash2 } from 'lucide-react';
import { Product, Vendor } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ConfirmationDialog } from '../components/ConfirmationDialog';

interface SellerDashboardPageProps {
  onBack: () => void;
  sellerProducts: Product[];
  sellerInfo?: Vendor;
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
}

// Mock data for the sales chart
const salesData = [
  { month: 'Jan', Sales: 4000 },
  { month: 'Feb', Sales: 3000 },
  { month: 'Mar', Sales: 5200 },
  { month: 'Apr', Sales: 4800 },
  { month: 'May', Sales: 6100 },
  { month: 'Jun', Sales: 5500 },
];

export const SellerDashboardPage: React.FC<SellerDashboardPageProps> = ({ onBack, sellerProducts, sellerInfo, onAddProduct, onEditProduct }) => {
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const totalRevenue = sellerProducts.reduce((sum, product) => sum + product.price, 0); // Simplified calculation
  const activeListings = sellerProducts.length;
  const newOrders = 5; // Mock data

  const handleConfirmDelete = () => {
    if (productToDelete) {
      console.log(`Confirmed deletion of product: ${productToDelete.title}`);
      // In a real application, you would make an API call here to delete the product.
      // After a successful API call, you would update the state to remove the product from the list.
      setProductToDelete(null); // Close the dialog
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Seller Dashboard</h1>
          <p className="text-neutral-500 mt-1">Welcome back, {sellerInfo?.name || 'Seller'}!</p>
        </div>
        <button onClick={onBack} className="hidden md:flex items-center text-sm font-medium text-neutral-600 hover:text-neutral-900">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Shop
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={DollarSign} title="Total Revenue" value={`P ${totalRevenue.toFixed(2)}`} color="primary" />
        <StatCard icon={Package} title="Active Listings" value={activeListings.toString()} color="blue" />
        <StatCard icon={ShoppingCart} title="New Orders" value={newOrders.toString()} color="orange" />
      </div>

      {/* Sales Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200/80 mb-8">
        <h2 className="text-xl font-bold mb-4">Monthly Sales Performance</h2>
        <div style={{ width: '100%', height: 300 }}>
           <ResponsiveContainer>
              <BarChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" vertical={false} />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} stroke="#868e96" />
                <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="#868e96" tickFormatter={(value) => `P${value/1000}k`} />
                <Tooltip cursor={{fill: 'rgba(241, 243, 245, 0.5)'}} />
                <Legend iconSize={10} />
                <Bar dataKey="Sales" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Listings */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-neutral-200/80">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Listings</h2>
            <button 
              onClick={onAddProduct}
              className="bg-neutral-900 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-neutral-800"
            >
              Add New Product
            </button>
          </div>
          <div className="space-y-4">
            {sellerProducts.length > 0 ? sellerProducts.map(product => (
              <ProductRow 
                key={product.id} 
                product={product} 
                onEditClick={() => onEditProduct(product)}
                onDeleteClick={() => setProductToDelete(product)}
              />
            )) : <p className="text-neutral-500 text-center py-8">You have no active listings.</p>}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200/80">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {/* Mock Orders */}
            <OrderRow customer="Onalenna" items={1} status="New" />
            <OrderRow customer="Thato" items={2} status="Shipped" />
            <OrderRow customer="Lerato" items={1} status="New" />
            <OrderRow customer="Amara" items={3} status="Completed" />
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
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

// --- Sub-components for the Dashboard ---
const colorVariants = {
    primary: { bg: 'bg-primary-50', text: 'text-primary-600' },
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
  <div className="flex items-center gap-4 p-3 hover:bg-neutral-50 rounded-lg transition-colors">
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
        Completed: 'bg-neutral-100 text-neutral-800'
    };
    return (
        <div className="flex items-center justify-between p-3 hover:bg-neutral-50 rounded-lg">
            <div>
                <p className="font-semibold">{customer}</p>
                <p className="text-sm text-neutral-500">{items} item(s)</p>
            </div>
            <span className={`px-2 py-1 rounded-full font-medium text-xs ${statusStyles[status]}`}>{status}</span>
        </div>
    )
};