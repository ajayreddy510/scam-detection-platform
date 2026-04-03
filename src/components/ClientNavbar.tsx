'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ClientNavbar() {
  const { user, isLoading, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
    setShowDropdown(false);
  };

  return (
    <nav className="bg-black border-b-2 border-gray-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group hover:opacity-80 transition">
          <div className="text-3xl group-hover:scale-110 transition-transform">🛡️</div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 via-red-600 to-amber-600 bg-clip-text text-transparent">
              SafeHire
            </h1>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Fraud Detection AI</p>
          </div>
        </Link>

        <div className="flex gap-8 items-center">
          {/* Navigation Links */}
          {!isAuthenticated && (
            <>
              <a href="/#features" className="hover:text-amber-500 transition font-bold text-sm uppercase tracking-wider">
                Features
              </a>
              <a href="/#how-it-works" className="hover:text-amber-500 transition font-bold text-sm uppercase tracking-wider">
                How It Works
              </a>
            </>
          )}

          {user && (
            <>
              <Link href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="hover:text-amber-500 transition font-bold text-sm uppercase tracking-wider">
                {user.role === 'admin' ? '🔐 Admin Panel' : '📊 Dashboard'}
              </Link>
              {user.role !== 'admin' && (
                <Link href="/report" className="hover:text-amber-500 transition font-bold text-sm uppercase tracking-wider">
                  🚨 Reports
                </Link>
              )}
            </>
          )}

          {/* Auth Section */}
          {!isAuthenticated && !isLoading && (
            <div className="flex gap-3">
              <Link
                href="/auth/login"
                className="px-4 py-2 font-bold uppercase tracking-wider transition-all hover:text-amber-500 border-2 border-gray-700 hover:border-amber-600 bg-black hover:bg-gray-900"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="bg-amber-600 hover:bg-amber-500 px-6 py-2 font-bold uppercase tracking-wider transition-all border-2 border-amber-600 text-white"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* User Dropdown */}
          {isAuthenticated && user && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-2 border-2 border-amber-600 hover:bg-amber-900/20 transition"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-red-600 text-white flex items-center justify-center font-bold text-sm">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-bold uppercase tracking-wider">
                  {user.name?.split(' ')[0] || user.email}
                </span>
                <span className={`text-xs transition-transform ${showDropdown ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-black border-2 border-gray-800 rounded-none shadow-xl overflow-hidden z-10">
                  <div className="px-4 py-3 border-b-2 border-gray-800">
                    <p className="text-sm font-bold uppercase tracking-wider text-white">{user.name || user.email}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">
                      {user.role === 'admin' ? '🔐 Admin Account' : '👤 User Account'}
                    </p>
                  </div>

                  <Link
                    href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                    className="block px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-amber-900/20 hover:text-amber-500 transition border-b border-gray-800"
                    onClick={() => setShowDropdown(false)}
                  >
                    {user.role === 'admin' ? '🔐 Admin Dashboard' : '📊 My Dashboard'}
                  </Link>

                  <Link
                    href={user.role === 'admin' ? '/admin/profile' : '/profile'}
                    className="block px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-amber-900/20 hover:text-amber-500 transition border-b border-gray-800"
                    onClick={() => setShowDropdown(false)}
                  >
                    👤 Profile
                  </Link>

                  <div className="border-t-2 border-gray-800"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm font-bold uppercase tracking-wider text-amber-600 hover:bg-red-900/30 hover:text-red-500 transition"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {isLoading && (
            <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse border-2 border-amber-600"></div>
          )}
        </div>
      </div>
    </nav>
  );
}
