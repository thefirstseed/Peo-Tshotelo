import React, { useState, useEffect, useMemo } from 'react';
import { Trash2, ArrowLeft, ShoppingBag, CheckCircle, AlertTriangle, CreditCard, Smartphone, User, Calendar, Lock } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { navigate } from '../router';
import { processPayment } from '../api/api';


export const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateCartQuantity, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment' | 'success'>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    country: '',
  });

  // --- Payment Form State ---
  type PaymentMethod = 'card' | 'mobile';
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvc: '' });
  const [mobileDetails, setMobileDetails] = useState({ provider: '', number: '' });


  // Pre-fill address from user profile when component loads or user changes
  useEffect(() => {
    if (user && user.role === 'buyer' && user.address) {
        setDeliveryAddress({
            street: user.address.street || '',
            city: user.address.city || '',
            country: user.address.country || '',
        });
    }
  }, [user]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDeliveryAddress(prev => ({ ...prev, [name]: value }));
  };

  const subtotal = totalPrice;
  const shippingFee = 0; // As per spec, shipping is free.
  const total = subtotal + shippingFee;
  const isAddressComplete = user?.role === 'buyer' && deliveryAddress.street.trim() && deliveryAddress.city.trim() && deliveryAddress.country.trim();

  // --- Payment Form Logic ---
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    if (name === 'number') {
        value = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
    }
    if (name === 'expiry') {
        value = value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1 / $2').trim().slice(0, 7);
    }
    if (name === 'cvc') {
        value = value.replace(/\D/g, '').slice(0, 4);
    }
    setCardDetails(prev => ({...prev, [name]: value}));
  };
  
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMobileDetails(prev => ({ ...prev, [name]: value }));
  };

  const isCardFormValid = useMemo(() => {
    return cardDetails.number.replace(/\s/g, '').length >= 16 &&
           cardDetails.name.trim().length > 2 &&
           /^\d{2}\s\/\s\d{2}$/.test(cardDetails.expiry) &&
           cardDetails.cvc.length >= 3;
  }, [cardDetails]);
  
  const isMobileFormValid = useMemo(() => {
    return mobileDetails.provider && mobileDetails.number.trim().length > 5;
  }, [mobileDetails]);

  const canSubmit = paymentMethod === 'card' ? isCardFormValid : isMobileFormValid;
  
  const handlePaymentSubmit = async (paymentDetails: any) => {
    setPaymentError(null);
    setIsProcessing(true);
    try {
        if (!user) throw new Error("User not logged in");
        await processPayment(total, { ...paymentDetails, address: deliveryAddress }, cartItems, user.id);
        clearCart();
        setCheckoutStep('success');
    } catch (err) {
        setPaymentError(err.message || "An unexpected error occurred. Please try again.");
        console.error("Payment failed:", err);
    } finally {
        setIsProcessing(false);
    }
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isProcessing) return;
    const details = paymentMethod === 'card' ? { type: 'card', ...cardDetails } : { type: 'mobile', ...mobileDetails };
    handlePaymentSubmit(details);
  };


  if (checkoutStep === 'success') {
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

  const inputStyles = "w-full border border-neutral-300 rounded-lg p-3 pl-10 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none transition";
  const buttonBase = "flex-1 text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors border";
  const buttonActive = "bg-primary-500 text-white border-primary-500";
  const buttonInactive = "bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200";

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
            <div key={item.id} className="flex gap-4 bg-white p-4 rounded-xl border border-neutral-200/80 shadow-sm">
              <img 
                src={item.product.imageUrls[0]} 
                alt={item.product.title} 
                className="w-24 h-24 object-cover rounded-lg bg-neutral-50"
              />
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-neutral-900 line-clamp-2 pr-2">{item.product.title}</h3>
                  <button onClick={() => removeFromCart(item.id)} className="text-neutral-400 hover:text-red-500 p-1 flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-neutral-500">{item.product.vendorName}</p>
                {item.size && (
                    <p className="text-xs text-neutral-600 mt-1 bg-neutral-100 px-2 py-0.5 rounded w-max font-medium">Size: {item.size}</p>
                )}
                <div className="mt-auto flex items-end justify-between">
                    <div className="flex items-center gap-3 bg-neutral-100 w-max rounded-lg p-1 mt-2">
                      <button 
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:bg-white rounded font-bold"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
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

          {user?.role === 'buyer' && (
            <div className="bg-white p-6 rounded-xl border border-neutral-200/80 shadow-sm mt-2">
              <h3 className="font-semibold text-neutral-900 mb-4 text-lg">Delivery Address</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-neutral-700 mb-1">Street Address</label>
                  <textarea
                    id="street"
                    name="street"
                    value={deliveryAddress.street}
                    onChange={handleAddressChange}
                    required
                    className="w-full border border-neutral-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none transition resize-none"
                    rows={2}
                    placeholder="e.g. Plot 123, Main Mall"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={deliveryAddress.city}
                      onChange={handleAddressChange}
                      required
                      className="w-full border border-neutral-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
                      placeholder="e.g. Gaborone"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-1">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={deliveryAddress.country}
                      onChange={handleAddressChange}
                      required
                      className="w-full border border-neutral-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
                      placeholder="e.g. Botswana"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
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
             {!isAddressComplete && user?.role === 'buyer' && (
              <div className="flex items-start gap-2 text-xs text-orange-600 mt-4 p-2 bg-orange-50 rounded-md border border-orange-200">
                 <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                 <span>Please complete your delivery address to proceed to payment.</span>
              </div>
            )}
            
            {/* Payment form appears after address is complete */}
            {isAddressComplete && user?.role === 'buyer' ? (
                <div className="mt-6 border-t pt-6">
                    <form onSubmit={handleFormSubmit}>
                      <h3 className="font-semibold text-neutral-900 mb-4 text-lg">Payment Details</h3>
                      <div className="flex gap-2 mb-4">
                        <button type="button" onClick={() => setPaymentMethod('card')} className={`${buttonBase} ${paymentMethod === 'card' ? buttonActive : buttonInactive}`}>Credit Card</button>
                        <button type="button" onClick={() => setPaymentMethod('mobile')} className={`${buttonBase} ${paymentMethod === 'mobile' ? buttonActive : buttonInactive}`}>Mobile Money</button>
                      </div>

                      {paymentMethod === 'card' ? (
                        <div className="space-y-3">
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                            <input type="text" name="number" placeholder="Card Number" value={cardDetails.number} onChange={handleCardChange} maxLength={19} required className={inputStyles} autoComplete="cc-number" />
                          </div>
                           <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                            <input type="text" name="name" placeholder="Cardholder Name" value={cardDetails.name} onChange={handleCardChange} required className={inputStyles} autoComplete="cc-name" />
                          </div>
                          <div className="flex gap-3">
                            <div className="relative w-1/2">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                              <input type="text" name="expiry" placeholder="MM / YY" value={cardDetails.expiry} onChange={handleCardChange} required className={inputStyles} autoComplete="cc-exp" />
                            </div>
                            <div className="relative w-1/2">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                              <input type="text" name="cvc" placeholder="CVC" value={cardDetails.cvc} onChange={handleCardChange} maxLength={4} required className={inputStyles} autoComplete="cc-csc" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                {['Orange Money', 'MyZaka'].map(p => (
                                    <button 
                                        key={p} 
                                        type="button" 
                                        onClick={() => setMobileDetails(prev => ({...prev, provider: p}))}
                                        className={`flex-1 text-xs py-2 rounded-md border ${mobileDetails.provider === p ? 'bg-orange-500 text-white border-orange-500' : 'bg-white border-neutral-300'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                            <div className="relative">
                                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <input type="tel" name="number" placeholder="Phone Number" value={mobileDetails.number} onChange={handleMobileChange} required className={inputStyles} />
                            </div>
                        </div>
                      )}

                       {paymentError && (
                            <div className="flex items-start gap-2 text-xs text-red-600 mt-4 p-2 bg-red-50 rounded-md border border-red-200">
                                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>{paymentError}</span>
                            </div>
                        )}

                      <button
                        type="submit"
                        disabled={!canSubmit || isProcessing}
                        className="w-full mt-6 bg-primary-500 text-white py-3 rounded-full font-semibold hover:bg-primary-600 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? 'Processing...' : `Pay P ${total.toFixed(2)}`}
                      </button>
                      <p className="text-xs text-neutral-400 text-center mt-2 flex items-center justify-center gap-1"><Lock className="w-3 h-3"/> Payments are secure and encrypted.</p>
                    </form>
                </div>
            ) : !user ? (
                 <button 
                    onClick={() => navigate('/login')}
                    className="w-full mt-6 bg-primary-500 text-white py-3 rounded-full font-semibold hover:bg-primary-600 transition"
                >
                    Login to Checkout
                </button>
            ): null}
          </div>
        </div>
      </div>
    </div>
  );
};