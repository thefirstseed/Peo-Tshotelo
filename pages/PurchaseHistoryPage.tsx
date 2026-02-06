import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { fetchOrdersByUser } from '../api/api';
import { Order } from '../types';
import { ArrowLeft, ShoppingBag, Loader } from 'lucide-react';
import { navigate } from '../router';

const OrderStatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
    const baseClasses = "px-2.5 py-1 text-xs font-medium rounded-full inline-block";
    const statusClasses = {
        Processing: 'bg-yellow-100 text-yellow-800',
        Shipped: 'bg-blue-100 text-blue-800',
        Delivered: 'bg-green-100 text-green-800',
        Cancelled: 'bg-red-100 text-red-800',
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const OrderCard: React.FC<{ order: Order }> = ({ order }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200/80">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 mb-4 border-b border-neutral-100">
            <div>
                <p className="text-sm text-neutral-500">Order ID</p>
                <p className="font-mono text-sm font-medium text-neutral-800">{order.id}</p>
            </div>
            <div className="mt-2 sm:mt-0 sm:text-right">
                <p className="text-sm text-neutral-500">Date Placed</p>
                <p className="font-medium text-sm text-neutral-800">{new Date(order.date).toLocaleDateString()}</p>
            </div>
        </div>
        <div className="space-y-3 mb-4">
            {order.items.map(item => (
                <div key={item.product.id} className="flex items-center gap-4">
                    <img src={item.product.imageUrls[0]} alt={item.product.title} className="w-16 h-16 object-cover rounded-lg bg-neutral-100" />
                    <div className="flex-1">
                        <p className="font-semibold text-neutral-900 text-sm">{item.product.title}</p>
                        <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold">P {(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
            ))}
        </div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center pt-4 mt-4 border-t border-neutral-100">
            <div>
                 <OrderStatusBadge status={order.status} />
            </div>
            <div className="mt-2 sm:mt-0 sm:text-right">
                <p className="text-sm text-neutral-500">Order Total</p>
                <p className="font-bold text-lg text-neutral-900">P {order.totalAmount.toFixed(2)}</p>
            </div>
        </div>
    </div>
);


export const PurchaseHistoryPage: React.FC = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            fetchOrdersByUser(user.id)
                .then(setOrders)
                .catch(err => {
                    console.error("Failed to fetch orders:", err);
                    setError("Could not load your purchase history.");
                })
                .finally(() => setIsLoading(false));
        }
    }, [user]);

    const renderContent = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center h-64"><Loader className="w-8 h-8 animate-spin text-primary-500" /></div>;
        }
        if (error) {
            return <div className="text-center py-10 text-red-500">{error}</div>;
        }
        if (orders.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white rounded-xl border border-neutral-200/80">
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                        <ShoppingBag className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900 mb-2">No Orders Yet</h2>
                    <p className="text-neutral-500 mb-6 text-center">Your past orders will appear here.</p>
                    <button onClick={() => navigate('/')} className="bg-neutral-900 text-white px-6 py-3 rounded-full font-medium hover:bg-neutral-800">
                        Start Shopping
                    </button>
                </div>
            );
        }
        return (
            <div className="space-y-6">
                {orders.map(order => <OrderCard key={order.id} order={order} />)}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/profile')} className="p-2 hover:bg-neutral-100 rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Purchase History</h1>
                    <p className="text-neutral-500 mt-1">Review your past orders and track their status.</p>
                </div>
            </div>
            {renderContent()}
        </div>
    );
};