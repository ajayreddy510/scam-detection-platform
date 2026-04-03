'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'user' | 'admin'>('user');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password, mode);

      if (result.success) {
        if (mode === 'admin') {
          setTimeout(() => router.push('/admin/dashboard'), 500);
        } else {
          setTimeout(() => router.push('/analyze'), 500);
        }
      } else {
        let errorMessage = result.error || 'Login failed';
        
        // Improve Firebase error messages
        if (errorMessage.includes('auth/configuration-not-found')) {
          errorMessage = 'Firebase service temporarily unavailable. Please try again.';
        } else if (errorMessage.includes('auth/user-not-found')) {
          errorMessage = 'No account found with this email. Please register first.';
        } else if (errorMessage.includes('auth/wrong-password')) {
          errorMessage = 'Incorrect password. Please try again.';
        } else if (errorMessage.includes('auth/invalid-email')) {
          errorMessage = 'Invalid email address.';
        }
        
        setError(errorMessage);
      }
    } catch (err: any) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.code === 'auth/configuration-not-found') {
        errorMessage = 'Firebase service temporarily unavailable.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
                placeholder={mode === 'admin' ? 'reddyajay510@gmail.com' : 'your@email.com'}
                className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 text-white placeholder-gray-500 focus:border-amber-600 focus:outline-none transition-all"
                disabled={isLoading || authLoading}
              />
              <p className="text-xs text-gray-500 mt-2">
                {mode === 'user' ? 'Register to create account here' : 'Use fixed admin credentials'}
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
                placeholder={mode === 'admin' ? 'Ajay#2004' : 'Enter your password'}
                className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 text-white placeholder-gray-500 focus:border-amber-600 focus:outline-none transition-all"
                disabled={isLoading || authLoading}
              />
              <p className="text-xs text-gray-500 mt-2">
                {mode === 'user' ? 'Enter your secure password' : 'Admin credentials are fixed'}
              </p>
            </div>

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
