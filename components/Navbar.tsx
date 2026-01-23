import React from 'react';
import { ShoppingBag, Search, PlusCircle, LayoutDashboard, LogIn, LogOut } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { navigate } from '../router';

export const Navbar: React.FC = () => {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSellOrDashboardClick = () => {
    if (user?.role === 'seller') {
      navigate('/dashboard');
    } else {
      navigate('/sell');
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200 z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-primary-900 rounded-full flex items-center justify-center text-white font-bold text-sm">KK</div>
          <span className="text-xl font-bold tracking-tight text-neutral-900">Kulture Kloze</span>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <input 
            type="text" 
            placeholder="Search for items, sellers..." 
            className="w-full pl-10 pr-4 py-2 bg-neutral-100 border border-transparent rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-neutral-500" />
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === 'seller' ? (
                <button 
                  onClick={handleSellOrDashboardClick}
                  className="hidden md:flex items-center gap-1.5 text-sm font-medium text-neutral-700 hover:text-primary-600 transition"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </button>
              ) : (
                <button 
                  onClick={handleSellOrDashboardClick}
                  className="hidden md:flex items-center gap-1.5 text-sm font-medium text-neutral-700 hover:text-primary-600 transition"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Sell</span>
                </button>
              )}
               <button 
                  onClick={logout}
                  className="hidden md:flex items-center gap-1.5 text-sm font-medium text-neutral-700 hover:text-primary-600 transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
            </>
          ) : (
             <button 
                onClick={() => navigate('/login')}
                className="hidden md:flex items-center gap-1.5 text-sm font-medium text-neutral-700 hover:text-primary-600 transition"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </button>
          )}

          <button 
            onClick={() => navigate('/cart')} 
            className="relative p-2 hover:bg-neutral-100 rounded-full transition"
          >
            <ShoppingBag className="w-6 h-6 text-neutral-800" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};