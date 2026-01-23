import React, { useState } from 'react';
import { Trash2, ArrowLeft, CreditCard, Lock, Smartphone } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { navigate } from '../router';

export const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateCartQuantity, clearCart } = useCart();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment'>('cart');
  const [processing, setProcessing] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 30 : 0; // Flat rate for MVP
  const total = subtotal + deliveryFee;

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      clearCart();
      alert('Payment Successful via Mobile Money! Your order has been sent to the seller.');
      navigate('/');
    }, 2000);
  };

  if (cartItems.length === 0 && checkoutStep === 'cart') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
          <Smartphone className="w-8 h-8 text-neutral-400" />
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => checkoutStep === 'cart' ? navigate('/') : setCheckoutStep('cart')} className="p-2 hover:bg-neutral-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">
          {checkoutStep === 'cart' ? 'Shopping Bag' : 'Secure Checkout'}
        </h1>
      </div>

      {checkoutStep === 'cart' ? (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item.product.id} className="flex gap-4 bg-white p-4 rounded-xl border border-neutral-200/80 shadow-sm">
                <img 
                  src={item.product.imageUrls[0]} 
                  alt={item.product.title} 
                  className="w-24 h-24 object-cover rounded-lg bg-neutral-50"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-neutral-900 line-clamp-1">{item.product.title}</h3>
                      <button onClick={() => removeFromCart(item.product.id)} className="text-neutral-400 hover:text-red-500 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-neutral-500">{item.product.vendorName}</p>
                    <p className="text-sm text-neutral-900 font-bold mt-1">P {item.product.price}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-neutral-100 w-max rounded-lg p-1 mt-2">
                    <button 
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:bg-white rounded"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:bg-white rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-sm sticky top-24">
              <h3 className="font-semibold text-neutral-900 mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>P {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery (Motorcycle)</span>
                  <span>P {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 mt-3 border-neutral-200 flex justify-between font-bold text-lg text-neutral-900">
                  <span>Total</span>
                  <span>P {total.toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={() => setCheckoutStep('payment')}
                className="w-full mt-6 bg-primary-600 text-white py-3 rounded-full font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-sm mb-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Select Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 border-2 border-primary-500 bg-primary-50 rounded-lg cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">Mobile Money</p>
                    <p className="text-xs text-neutral-500">Orange Money / MyZaka / Smega</p>
                  </div>
                </div>
                <input type="radio" name="payment" defaultChecked className="text-primary-600 focus:ring-primary-500" />
              </label>
              <label className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg cursor-pointer opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-neutral-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">Card Payment</p>
                    <p className="text-xs text-neutral-500">Visa / Mastercard (Coming Soon)</p>
                  </div>
                </div>
                <input type="radio" name="payment" disabled className="text-primary-600" />
              </label>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-sm mb-6">
             <h3 className="font-semibold text-neutral-900 mb-4">Delivery Location</h3>
             <div className="flex gap-2">
                <input type="text" placeholder="Plot Number / Landmark" className="flex-1 border p-3 rounded-lg text-sm bg-neutral-50 border-neutral-300 focus:ring-primary-500 focus:border-primary-500" />
                <button className="bg-neutral-800 text-white px-4 rounded-lg text-sm hover:bg-neutral-900">Use Map</button>
             </div>
          </div>
          <button 
            onClick={handlePayment}
            disabled={processing}
            className="w-full bg-neutral-900 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-neutral-800 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {processing ? 'Processing...' : `Pay P ${total.toFixed(2)}`}
            {!processing && <Lock className="w-4 h-4" />}
          </button>
          <p className="text-center text-xs text-neutral-500 mt-4 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3" /> Secure Payment
          </p>
        </div>
      )}
    </div>
  );
};