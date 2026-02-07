import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { navigate } from '../router';
import { UserPlus, ShoppingBag, Store } from 'lucide-react';
import { PasswordStrengthIndicator } from '../components/PasswordStrengthIndicator';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [error, setError] = useState<string | null>(null);
  const { isLoading, register, user } = useAuth();

  if (user) {
    navigate('/'); // Redirect if already logged in
    return null;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (name.trim().split(' ').length < 2) {
        setError("Please enter your full name, including your first and last name.");
        return;
    }

    // Enforce stricter password policy
    const passwordPolicy = {
        length: password.length >= 15,
        hasLowercase: /[a-z]/.test(password),
        hasUppercase: /[A-Z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSymbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    };

    if (!Object.values(passwordPolicy).every(Boolean)) {
        setError("Password must be at least 15 characters and include uppercase, lowercase, a number, and a special symbol.");
        return;
    }

    try {
      await register(name, email, password, role);
      // Redirect based on role
      if (role === 'seller') {
        navigate('/sell');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
    }
  };

  const inputStyles = "w-full border border-neutral-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition";
  const roleButtonBaseStyles = "w-full flex items-center justify-center gap-2 p-3 rounded-lg font-semibold border-2 transition";
  const roleButtonActiveStyles = "bg-primary-500 border-primary-500 text-white shadow-md";
  const roleButtonInactiveStyles = "bg-white border-neutral-300 text-neutral-600 hover:bg-neutral-100 hover:border-neutral-400";

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-neutral-200/60">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">Create an Account</h1>
            <p className="text-neutral-500 mt-2">Join the Kulture Kloze community.</p>
        </div>

        {error && <p className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
              <input type="text" name="name" id="name" required value={name} onChange={e => setName(e.target.value)} className={inputStyles} autoComplete="name"/>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
              <input type="email" name="email" id="email" required value={email} onChange={e => setEmail(e.target.value)} className={inputStyles} autoComplete="email"/>
            </div>
            <div>
              <label htmlFor="password"className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
              <input type="password" name="password" id="password" required value={password} onChange={e => setPassword(e.target.value)} className={inputStyles} autoComplete="new-password"/>
              <PasswordStrengthIndicator password={password} />
            </div>
            
             {/* Invisible CAPTCHA Placeholder */}
            <div className="hidden">
              <label>
                <input type="checkbox" name="captcha-placeholder" tabIndex={-1} disabled />
                This field is for bot protection.
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">I want to...</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button" 
                  onClick={() => setRole('buyer')}
                  className={`${roleButtonBaseStyles} ${role === 'buyer' ? roleButtonActiveStyles : roleButtonInactiveStyles}`}
                >
                  <ShoppingBag className="w-5 h-5" /> Buy
                </button>
                <button 
                  type="button" 
                  onClick={() => setRole('seller')}
                  className={`${roleButtonBaseStyles} ${role === 'seller' ? roleButtonActiveStyles : roleButtonInactiveStyles}`}
                >
                  <Store className="w-5 h-5" /> Sell
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-neutral-900 text-white py-3 rounded-lg font-semibold hover:bg-neutral-800 transition disabled:opacity-70 disabled:cursor-wait"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
        </form>

        <div className="mt-6 text-center text-sm">
            <p className="text-neutral-500">Already have an account? <button onClick={() => navigate('/login')} className="font-semibold text-primary-600 hover:underline">Log in</button></p>
        </div>
      </div>
    </div>
  );
};