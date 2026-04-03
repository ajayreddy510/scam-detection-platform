'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(formData.email, formData.name, formData.password);

      if (result.success) {
        setSuccess('Account created successfully! Redirecting to dashboard...');
        setTimeout(() => router.push('/dashboard'), 2000);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
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
            <span className="text-white">Join Thousands</span>
            <br />
            <span className="bg-gradient-to-r from-amber-500 via-red-600 to-amber-600 bg-clip-text text-transparent">
              Protected Seekers
            </span>
          </h1>
          <p className="text-gray-400 text-lg">Create Your SafeHire Account</p>
        </div>

        {/* Info Banner - Admin Registration Disabled */}
        <div className="mb-8 p-4 border-2 border-amber-700/50 bg-amber-900/20">
          <p className="text-xs text-amber-400 uppercase tracking-widest mb-1 font-bold">Admin Access</p>
          <p className="text-gray-300 text-sm">Admin accounts are not available for registration. Please contact support for admin access.</p>
        </div>

        {/* Register Form Card */}
        <div className="bg-black border-2 border-amber-700 p-8">
          {/* Role Info Banner */}
          <div className="mb-8 p-6 border-2 border-amber-700/50 bg-amber-900/20">
            <p className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-2">
              Job Seeker Registration
            </p>
            <p className="text-gray-300 text-sm">
              Create an account to get instant access to AI-powered fraud detection for job postings
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Full Name Input */}
            <div>
              <label className="block text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 text-white placeholder-gray-500 focus:border-amber-600 focus:outline-none transition-all uppercase"
                disabled={isLoading || authLoading}
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 text-white placeholder-gray-500 focus:border-amber-600 focus:outline-none transition-all"
                disabled={isLoading || authLoading}
              />
              <p className="text-xs text-gray-500 mt-2">
                Email used for your job seeker account
              </p>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 text-white placeholder-gray-500 focus:border-amber-600 focus:outline-none transition-all"
                disabled={isLoading || authLoading}
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 text-white placeholder-gray-500 focus:border-amber-600 focus:outline-none transition-all"
                disabled={isLoading || authLoading}
              />
            </div>

            {/* Important Notice */}
            <div className="bg-red-900/20 border-2 border-red-700/50 p-4 text-xs">
              <p className="font-bold text-red-400 mb-2">📋 Terms:</p>
              <p className="text-gray-300">
                These credentials are for personal use only. Do not share your account. You can analyze job postings and receive AI-powered fraud detection results.
              </p>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 py-4 border-t-2 border-b-2 border-gray-800">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 accent-amber-600 cursor-pointer"
                disabled={isLoading || authLoading}
              />
              <label htmlFor="terms" className="text-xs text-gray-400 cursor-pointer">
                I agree to SafeHire's Terms of Service and Privacy Policy. I understand this is a fraud detection platform for analyzing job postings safely.
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/30 border-2 border-red-700 text-red-400 px-4 py-3 text-sm font-bold">
                ⚠ {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-900/30 border-2 border-green-700 text-green-400 px-4 py-3 text-sm font-bold">
                ✓ {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || authLoading}
              className="w-full px-6 py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-black text-sm uppercase tracking-wider border-2 border-amber-600 transition-all"
            >
              {isLoading || authLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-8 border-t-2 border-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link 
                href="/auth/login"
                className="font-bold text-amber-500 hover:text-amber-400 transition-all"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Security & Info */}
        <div className="mt-8 grid md:grid-cols-2 gap-4 text-xs text-gray-500">
          <div className="border-l-2 border-amber-700 pl-3">
            <p className="font-bold text-amber-600 mb-1">Easy Registration</p>
            <p>Quick setup in seconds</p>
          </div>
          <div className="border-l-2 border-amber-700 pl-3">
            <p className="font-bold text-amber-600 mb-1">Secure</p>
            <p>Password-protected access</p>
          </div>
        </div>
      </div>
    </div>
  );
}
