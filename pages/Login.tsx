import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { navigate } from '../router';
import { LogIn } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();

  if (user) {
    navigate('/dashboard'); // Redirect if already logged in
    return null;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
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
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200/80">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">Welcome Back</h1>
            <p className="text-neutral-500 mt-2">Log in to continue to Kulture Kloze.</p>
        </div>

        {error && <p className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
              <input type="email" name="email" id="email" required value={email} onChange={e => setEmail(e.target.value)} className={inputStyles} />
            </div>
            <div>
              <label htmlFor="password"className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
              <input type="password" name="password" id="password" required value={password} onChange={e => setPassword(e.target.value)} className={inputStyles} />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-neutral-900 text-white py-3 rounded-lg font-semibold hover:bg-neutral-800 transition disabled:opacity-70"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
        </form>

        <div className="mt-6 text-center text-sm">
            <p className="text-neutral-500">For demo purposes:</p>
            <div className="flex justify-center gap-2 mt-2">
                <button onClick={() => demoLogin('seller')} className="text-primary-600 hover:underline font-medium">Login as Seller</button>
                <span>|</span>
                <button onClick={() => demoLogin('buyer')} className="text-primary-600 hover:underline font-medium">Login as Buyer</button>
            </div>
        </div>
      </div>
    </div>
  );
};