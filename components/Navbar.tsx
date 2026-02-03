import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, User as UserIcon, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { navigate } from '../router';

const UserMenu: React.FC = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    const handleMenuClick = (path: string) => {
        navigate(path);
        setIsOpen(false);
    }
    
    return (
        <div className="relative" ref={menuRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-sm font-medium hover:bg-neutral-100 p-2 rounded-full transition"
            >
                <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
                    {user.name.charAt(0)}
                </div>
                <span>Hi, {user.name.split(' ')[0]}</span>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-200/80 py-2 z-50">
                    <button onClick={() => handleMenuClick('/profile')} className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 flex items-center gap-2"><Settings className="w-4 h-4"/> Profile Settings</button>
                    {user.role === 'seller' && <button onClick={() => handleMenuClick('/dashboard')} className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 flex items-center gap-2"><LayoutDashboard className="w-4 h-4" /> Seller Dashboard</button>}
                    <div className="border-t my-1 border-neutral-100"></div>
                    <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><LogOut className="w-4 h-4" /> Logout</button>
                </div>
            )}
        </div>
    );
};


export const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  // FIX: Destructured `logout` from `useAuth` to make it available for the mobile menu's logout button.
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSellOrDashboardClick = () => {
    if (user?.role === 'seller') {
      navigate('/dashboard');
    } else {
      navigate('/sell');
    }
    setIsMenuOpen(false); // Close menu on navigation
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
    setIsMenuOpen(false);
    setSearchQuery('');
  };

  const handleNavLinkClick = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };
  
  const NavLink: React.FC<{children: React.ReactNode; onClick: () => void; className?: string}> = ({ children, onClick, className = '' }) => (
    <button
      onClick={onClick}
      className={`text-neutral-600 hover:text-primary-600 transition-colors ${className}`}
    >
      {children}
    </button>
  );

  return (
    <>
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200 z-50 h-16">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          
          {/* Logo and Brand Name */}
          <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => handleNavLinkClick('/')}>
            <div className="w-8 h-8 bg-[#E85D3B] rounded-md flex items-center justify-center text-white font-bold text-lg font-heading">K</div>
            <span className="text-xl font-bold tracking-tight text-neutral-900">Kulture Kloze</span>
          </div>

          {/* Centered Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center justify-center flex-1 gap-6 text-sm font-medium">
            <NavLink onClick={() => handleNavLinkClick('/')}>Browse</NavLink>
            <NavLink onClick={handleSellOrDashboardClick}>{user?.role === 'seller' ? 'Dashboard' : 'Sell'}</NavLink>
          </div>

          {/* Right Side Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <UserMenu />
            ) : (
              <div className="flex items-center gap-2 text-sm font-medium">
                <NavLink onClick={() => handleNavLinkClick('/login')}>Login</NavLink>
                <button onClick={() => handleNavLinkClick('/register')} className="bg-neutral-900 text-white px-4 py-2 rounded-full hover:bg-neutral-800 transition-colors">
                    Sign Up
                </button>
              </div>
            )}

            <div className="w-px h-6 bg-neutral-200" />
            
            <button 
              onClick={() => handleNavLinkClick('/cart')} 
              className="relative p-2 hover:bg-neutral-100 rounded-full transition"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="w-6 h-6 text-neutral-800" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button & Cart*/}
          <div className="md:hidden flex items-center gap-2">
             <button 
                onClick={() => handleNavLinkClick('/cart')} 
                className="relative p-2 hover:bg-neutral-100 rounded-full transition"
                aria-label="Shopping cart"
              >
                <ShoppingBag className="w-6 h-6 text-neutral-800" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 hover:bg-neutral-100 rounded-full transition" aria-label="Open menu">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed top-16 left-0 w-full bg-white z-40 shadow-lg border-t border-neutral-200"
        >
            <div className="p-4 space-y-4">
                <form onSubmit={handleSearchSubmit} className="relative">
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search heritage..." 
                        className="w-full pl-4 pr-10 py-3 bg-neutral-100 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <Search className="w-5 h-5 text-neutral-400" />
                    </button>
                </form>

                <nav className="flex flex-col items-start space-y-3 font-medium text-lg">
                    <NavLink onClick={() => handleNavLinkClick('/')}>Browse</NavLink>
                    <NavLink onClick={handleSellOrDashboardClick}>{user?.role === 'seller' ? 'Dashboard' : 'Sell'}</NavLink>
                    {user && <NavLink onClick={() => handleNavLinkClick('/profile')}>Profile Settings</NavLink>}
                </nav>

                <div className="border-t border-neutral-200 pt-4 space-y-3">
                    {user ? (
                        <>
                            <p className="px-1 text-sm font-medium">Hi, {user.name}</p>
                            <button onClick={() => {logout(); setIsMenuOpen(false);}} className="w-full text-left font-medium p-2 rounded-md hover:bg-neutral-100 text-neutral-700">Logout</button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <button onClick={() => handleNavLinkClick('/login')} className="w-full text-left p-2 rounded-md font-medium hover:bg-neutral-100 text-neutral-700">Login</button>
                            <button onClick={() => handleNavLinkClick('/register')} className="w-full bg-neutral-900 text-white py-2 rounded-lg font-semibold hover:bg-neutral-800">Sign Up</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </>
  );
};