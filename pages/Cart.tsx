import React, { useState } from 'react';
import { Trash2, ArrowLeft, ShoppingBag, CheckCircle } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { navigate } from '../router';

export const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateCartQuantity, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = totalPrice;
  const shippingFee = 0; // As per spec, shipping is free.
  const total = subtotal + shippingFee;

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsProcessing(true);
    // TODO Backend: Replace mock with POST /api/orders + real payment integration (Stripe/PayFast)
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Order Placed! 🎉</h2>
        <p className="text-neutral-600 mb-8 max-w-sm">This is a mock checkout. Your order has been "sent" to the seller and your cart has been cleared.</p>
        <button onClick={() => navigate('/')} className="bg-neutral-900 text-white px-6 py-3 rounded-full font-medium hover:bg-neutral-800">
          Back to Browse
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8 text-neutral-400" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900 mb-2">Your Bag is Empty</h2>
        <p className="text-neutral-500 mb-6 text-center">Looks like you haven't found any treasures yet.</p>
        <button onClick={() => navigate('/')} className="bg-neutral-900 text-white px-6 py-3 rounded-full font-medium hover:bg-neutral-800">
          Start Exploring
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-neutral-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Shopping Bag</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div key={item.product.id} className="flex gap-4 bg-white p-4 rounded-xl border border-neutral-200/80 shadow-sm">
              <img 
                src={item.product.imageUrls[0]} 
                alt={item.product.title} 
                className="w-24 h-24 object-cover rounded-lg bg-neutral-50"
              />
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-neutral-900 line-clamp-2 pr-2">{item.product.title}</h3>
                  <button onClick={() => removeFromCart(item.product.id)} className="text-neutral-400 hover:text-red-500 p-1 flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-neutral-500">{item.product.vendorName}</p>
                
                <div className="mt-auto flex items-end justify-between">
                    <div className="flex items-center gap-3 bg-neutral-100 w-max rounded-lg p-1 mt-2">
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:bg-white rounded font-bold"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:bg-white rounded font-bold"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-lg text-neutral-900 font-bold">P {item.product.price.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-sm sticky top-24">
            <h3 className="font-semibold text-neutral-900 mb-4 text-lg">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>P {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="border-t pt-3 mt-3 border-neutral-200 flex justify-between font-bold text-lg text-neutral-900">
                <span>Total</span>
                <span>P {total.toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full mt-6 bg-primary-500 text-white py-3 rounded-full font-semibold hover:bg-primary-600 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
            >
              {isProcessing ? 'Processing...' : (user ? 'Confirm & Checkout' : 'Login to Checkout')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
