'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role !== 'admin') {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-amber-400 mb-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black uppercase tracking-wider mb-2">
            <span className="bg-gradient-to-r from-amber-500 via-red-600 to-amber-600 bg-clip-text text-transparent">
              Admin Profile
            </span>
          </h1>
          <p className="text-gray-400">Manage your administrator account</p>
        </div>

        {/* Profile Card */}
        <div className="bg-black border-2 border-amber-700 p-8 mb-8">
          {/* User Info Section */}
          <div className="mb-8 pb-8 border-b-2 border-gray-800">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-4xl font-black text-white">
                  A
                </span>
              </div>
              <div>
                <p className="text-xs text-amber-400 uppercase tracking-widest font-bold mb-1">
                  ADMIN ACCOUNT
                </p>
                <h2 className="text-3xl font-black uppercase tracking-wider">AJAYREDDY</h2>
                <p className="text-gray-400 text-sm mt-2">{user?.email?.toLowerCase()}</p>
              </div>
            </div>

            {/* Account Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-900 border-2 border-gray-800">
                <p className="text-xs text-amber-400 uppercase tracking-widest font-bold mb-2">
                  Admin ID
                </p>
                <p className="text-lg font-bold">{user?.id}</p>
              </div>
              <div className="p-4 bg-gray-900 border-2 border-gray-800">
                <p className="text-xs text-amber-400 uppercase tracking-widest font-bold mb-2">
                  Account Type
                </p>
                <p className="text-lg font-bold">ADMINISTRATOR</p>
              </div>
              <div className="p-4 bg-gray-900 border-2 border-gray-800">
                <p className="text-xs text-amber-400 uppercase tracking-widest font-bold mb-2">
                  Email Address
                </p>
                <p className="text-lg font-bold break-all">{user?.email?.toLowerCase()}</p>
              </div>
              <div className="p-4 bg-gray-900 border-2 border-gray-800">
                <p className="text-xs text-amber-400 uppercase tracking-widest font-bold mb-2">
                  Account Status
                </p>
                <p className="text-lg font-bold text-green-400">ACTIVE</p>
              </div>
            </div>
          </div>

          {/* Permissions Section */}
          <div className="mb-8">
            <h3 className="text-xl font-black uppercase tracking-wider mb-6 text-amber-400">
              Admin Permissions
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-900 border-2 border-gray-800 flex items-start gap-3">
                <div className="text-amber-500 text-xl">✓</div>
                <div>
                  <p className="font-bold uppercase text-sm">VIEW REPORTS</p>
                  <p className="text-gray-400 text-xs">Access all user scam reports</p>
                </div>
              </div>
              <div className="p-4 bg-gray-900 border-2 border-gray-800 flex items-start gap-3">
                <div className="text-amber-500 text-xl">✓</div>
                <div>
                  <p className="font-bold uppercase text-sm">MANAGE USERS</p>
                  <p className="text-gray-400 text-xs">Control user accounts and access</p>
                </div>
              </div>
              <div className="p-4 bg-gray-900 border-2 border-gray-800 flex items-start gap-3">
                <div className="text-amber-500 text-xl">✓</div>
                <div>
                  <p className="font-bold uppercase text-sm">VIEW ANALYTICS</p>
                  <p className="text-gray-400 text-xs">Monitor platform statistics</p>
                </div>
              </div>
              <div className="p-4 bg-gray-900 border-2 border-gray-800 flex items-start gap-3">
                <div className="text-amber-500 text-xl">✓</div>
                <div>
                  <p className="font-bold uppercase text-sm">SYSTEM ACCESS</p>
                  <p className="text-gray-400 text-xs">Full platform administration</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="p-6 bg-gradient-to-r from-red-900/20 to-amber-900/20 border-2 border-red-700">
            <h3 className="text-lg font-black uppercase tracking-wider mb-3 text-red-400">
              ⚠ Security Notice
            </h3>
            <p className="text-sm text-gray-300 mb-3">
              This is a protected administrator account. All actions are logged and monitored. Unauthorized access attempts will be recorded.
            </p>
            <p className="text-xs text-gray-400">
              Last login: Now | Status: Active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
