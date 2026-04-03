'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'user' | 'admin'>('user');
  const [pageLoading, setPageLoading] = useState(true);

  // Load saved email and redirect if already logged in
  useEffect(() => {
    // Load remembered email on client side
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('safehire_remembered_email');
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    }
    
    if (!authLoading) {
      if (user) {
        // User is already logged in, redirect to appropriate dashboard
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/analyze');
        }
      }
      setPageLoading(false);
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Save or clear remembered email
      if (rememberMe) {
        localStorage.setItem('safehire_remembered_email', email);
      } else {
        localStorage.removeItem('safehire_remembered_email');
      }

      const result = await login(email, password, mode);

      if (result.success) {
        // Longer delay to ensure localStorage is synced across tabs/contexts
        setTimeout(() => {
          if (mode === 'admin') {
            window.location.href = '/admin/dashboard';
          } else {
            window.location.href = '/analyze';
          }
        }, 1000);
      } else {
        let errorMessage = result.error || 'Login failed';
        
        // Improve error messages
        if (errorMessage.includes('Invalid')) {
          if (mode === 'admin') {
            errorMessage = 'Invalid admin credentials. Use the demo credentials shown above.';
          } else {
            errorMessage = 'Invalid email or password. Please check and try again.';
          }
        }
        
        setError(errorMessage);
      }
    } catch (err: any) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (pageLoading || authLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600 rounded-full mix-blend-screen filter blur-3xl"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600 rounded-full mix-blend-screen filter blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight uppercase tracking-wider">
            <span className="text-white">Welcome To</span>
            <br />
            <span className="bg-gradient-to-r from-amber-500 via-red-600 to-amber-600 bg-clip-text text-transparent">
              SafeHire
            </span>
          </h1>
          <p className="text-gray-400 text-lg">Protect Your Career from Job Scams</p>
        </div>

        {/* Mode Switcher */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => {
              setMode('user');
              setError('');
            }}
            className={`flex-1 py-3 px-4 font-black text-sm uppercase tracking-wider transition-all border-2 ${
              mode === 'user'
                ? 'border-amber-600 bg-amber-600/10 text-amber-500'
                : 'border-gray-700 bg-black text-gray-400 hover:border-amber-600/50'
            }`}
          >
            Job Seeker
          </button>
          <button
            onClick={() => {
              setMode('admin');
              setError('');
            }}
            className={`flex-1 py-3 px-4 font-black text-sm uppercase tracking-wider transition-all border-2 ${
              mode === 'admin'
                ? 'border-amber-600 bg-amber-600/10 text-amber-500'
                : 'border-gray-700 bg-black text-gray-400 hover:border-amber-600/50'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Login Form Card */}
        <div className="bg-black border-2 border-amber-700 p-8">
          {/* Mode Info */}
          <div className="mb-8 p-6 border-2 border-amber-700/50 bg-amber-900/20">
            <p className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-2">
              {mode === 'admin' ? 'Admin Portal' : 'Job Seeker Login'}
            </p>
            <p className="text-gray-300 text-sm">
              {mode === 'admin' 
                ? 'Restricted admin access with fixed credentials' 
                : 'Sign in to analyze job postings and protect yourself from scams'}
            </p>
          </div>

          {/* Job Seeker Registration Info */}
          {mode === 'user' && (
            <div className="mb-8 p-4 border-2 border-blue-700/50 bg-blue-900/20">
              <p className="text-xs text-blue-400 uppercase tracking-widest font-bold mb-2">ℹ New User?</p>
              <p className="text-gray-300 text-sm">
                Don't have an account yet?{' '}
                <Link href="/auth/register" className="text-amber-400 hover:text-amber-300 font-bold">
                  Create one here
                </Link>
                {' '}to get started.
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 text-white placeholder-gray-500 focus:border-amber-600 focus:outline-none transition-all"
                disabled={isLoading || authLoading}
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                {mode === 'user' ? 'Use your registered email' : 'Admin email for management access'}
              </p>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 text-white placeholder-gray-500 focus:border-amber-600 focus:outline-none transition-all"
                disabled={isLoading || authLoading}
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                {mode === 'user' ? 'At least 6 characters' : 'Use provided admin password'}
              </p>
            </div>

            {/* Remember Me Checkbox */}
            {mode === 'user' && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 bg-gray-900 border-2 border-gray-700 rounded cursor-pointer accent-amber-600"
                  disabled={isLoading || authLoading}
                />
                <label htmlFor="rememberMe" className="ml-2 text-xs text-gray-400 cursor-pointer hover:text-gray-300">
                  Remember my email for next time
                </label>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/30 border-2 border-red-700 text-red-400 px-4 py-3 text-sm font-bold">
                ⚠ {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || authLoading}
              className="w-full px-6 py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-black text-sm uppercase tracking-wider border-2 border-amber-600 transition-all"
            >
              {isLoading || authLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-8 border-t-2 border-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link 
                href="/auth/register"
                className="font-bold text-amber-500 hover:text-amber-400 transition-all"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Version Info */}
        <div className="text-center mt-8 text-gray-500 text-xs">
          <p>SafeHire v1.0 - Fraud Detection Platform</p>
        </div>
      </div>
    </div>
  );
}
