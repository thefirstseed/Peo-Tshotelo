import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { navigate } from '../router';
import { LogIn } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup, user } = useAuth();

  if (user) {
    navigate('/dashboard'); // Redirect if already logged in
    return null;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        navigate('/dashboard'); // Redirect to dashboard after successful login
      } else {
        const result = await signup(email, password, fullName, role);
        if (result && !result.session) {
             // For development/demo, we might want to auto-login if Supabase is set to not require confirmation,
             // but if it DOES require it, we can't bypass it without admin API.
             // However, user requested to "skip confirmation".
             // If Supabase sends back a user but no session, confirmation IS required.
             
             setMessage("Account created! Please check your email (including spam folder) to confirm your registration.");
             setIsLogin(true); 
             setPassword('');
        } else {
             // Session exists immediately (Confirmation disabled in Supabase)
             navigate('/dashboard'); 
        }
      }
    } catch (err: any) {
      setError(err.message || `Failed to ${isLogin ? 'login' : 'sign up'}. Please check your credentials.`);
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = (role: 'seller' | 'buyer') => {
    setEmail(role === 'seller' ? 'seller@kulture.com' : 'buyer@kulture.com');
    setPassword('password');
    setIsLogin(true);
  }

  const inputStyles = "w-full border border-neutral-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition";

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200/80">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
            <p className="text-neutral-500 mt-2">
              {isLogin ? 'Log in to continue to Kulture Kloze.' : 'Join the marketplace for secondhand treasures.'}
            </p>
        </div>

        {error && <p className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</p>}
        {message && <p className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-4">{message}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                  <input type="text" name="fullName" id="fullName" required value={fullName} onChange={e => setFullName(e.target.value)} className={inputStyles} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">I want to</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="role" 
                        value="buyer" 
                        checked={role === 'buyer'} 
                        onChange={() => setRole('buyer')}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span>Buy Items</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="role" 
                        value="seller" 
                        checked={role === 'seller'} 
                        onChange={() => setRole('seller')}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span>Sell Items</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
              <input type="email" name="email" id="email" required value={email} onChange={e => setEmail(e.target.value)} className={inputStyles} />
            </div>
            <div>
              <label htmlFor="password"className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
              <input type="password" name="password" id="password" required value={password} onChange={e => setPassword(e.target.value)} className={inputStyles} minLength={6} />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-neutral-900 text-white py-3 rounded-lg font-semibold hover:bg-neutral-800 transition disabled:opacity-70"
            >
              {isLoading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Log In' : 'Sign Up')}
            </button>
        </form>

        <div className="mt-6 text-center">
            <p className="text-neutral-600 text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="text-primary-600 font-semibold hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
        </div>

        {isLogin && (
          <div className="mt-6 text-center text-sm border-t border-neutral-100 pt-6">
              <p className="text-neutral-500">For demo purposes:</p>
              <div className="flex justify-center gap-2 mt-2">
                  <button onClick={() => demoLogin('seller')} className="text-primary-600 hover:underline font-medium">Login as Seller</button>
                  <span>|</span>
                  <button onClick={() => demoLogin('buyer')} className="text-primary-600 hover:underline font-medium">Login as Buyer</button>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};