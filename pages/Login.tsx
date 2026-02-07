import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { navigate } from '../router';
import { LogIn } from 'lucide-react';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30 * 1000; // 30 seconds

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);


  useEffect(() => {
    let timer: number;
    if (isLockedOut) {
      setLockoutTimeLeft(LOCKOUT_DURATION_MS / 1000);
      timer = window.setInterval(() => {
        setLockoutTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsLockedOut(false);
            setLoginAttempts(0); // Reset attempts after lockout
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLockedOut]);

  if (user) {
    navigate('/dashboard'); // Redirect if already logged in
    return null;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;

    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      setLoginAttempts(0); // Reset on success
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (err) {
      const newAttemptCount = loginAttempts + 1;
      setLoginAttempts(newAttemptCount);
      setError(err.message || 'Invalid credentials'); // Ensure generic message
      if (newAttemptCount >= MAX_LOGIN_ATTEMPTS) {
        setIsLockedOut(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = (role: 'seller' | 'buyer') => {
    setEmail(role === 'seller' ? 'seller@kulture.com' : 'buyer@kulture.com');
    setPassword('password');
  }

  const inputStyles = "w-full border border-neutral-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition";

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-neutral-200/60">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">Welcome Back</h1>
            <p className="text-neutral-500 mt-2">Log in to continue to Kulture Kloze.</p>
        </div>

        {error && <p className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</p>}
        {isLockedOut && (
          <p className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm mb-4 text-center">
            Too many failed login attempts. Please try again in {lockoutTimeLeft} seconds.
          </p>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
              <input type="email" name="email" id="email" required value={email} onChange={e => setEmail(e.target.value)} className={inputStyles} autoComplete="email" />
            </div>
            <div>
              <label htmlFor="password"className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
              <input type="password" name="password" id="password" required value={password} onChange={e => setPassword(e.target.value)} className={inputStyles} autoComplete="current-password" />
            </div>
            
            {/* Invisible CAPTCHA Placeholder */}
            <div className="hidden">
              <label>
                <input type="checkbox" name="captcha-placeholder" tabIndex={-1} disabled />
                This field is for bot protection.
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading || isLockedOut}
              className="w-full bg-neutral-900 text-white py-3 rounded-lg font-semibold hover:bg-neutral-800 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : isLockedOut ? `Try again in ${lockoutTimeLeft}s` : 'Log In'}
            </button>
        </form>

        <div className="mt-6 text-center text-sm">
            <p className="text-neutral-500">Don't have an account? <button onClick={() => navigate('/register')} className="font-semibold text-primary-600 hover:underline">Sign up</button></p>
            <div className="flex justify-center gap-2 mt-4 pt-4 border-t">
                <button onClick={() => demoLogin('seller')} className="text-neutral-600 hover:underline text-xs font-medium">Demo as Seller</button>
                <span className="text-neutral-300">|</span>
                <button onClick={() => demoLogin('buyer')} className="text-neutral-600 hover:underline text-xs font-medium">Demo as Buyer</button>
            </div>
        </div>
      </div>
    </div>
  );
};