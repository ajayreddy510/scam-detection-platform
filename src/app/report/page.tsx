'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getAllAnalyses } from '@/lib/analysisHistory';

export default function ReportPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    emailUsed: '',
    phoneNumber: '',
    description: '',
  });

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    // Get only current user's analyses
    const allAnalyses = getAllAnalyses();
    const userAnalyses = allAnalyses.filter(a => a.userId === user.id);
    setAnalyses(userAnalyses);
    setFilteredAnalyses(userAnalyses);
  }, [user, authLoading]);

  useEffect(() => {
    let filtered = analyses;

    // Filter by risk
    if (riskFilter === 'high') {
      filtered = filtered.filter(a => a.riskScore >= 70);
    } else if (riskFilter === 'medium') {
      filtered = filtered.filter(a => a.riskScore >= 40 && a.riskScore < 70);
    } else if (riskFilter === 'low') {
      filtered = filtered.filter(a => a.riskScore < 40);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        a =>
          a.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAnalyses(filtered);
  }, [searchTerm, riskFilter, analyses]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.companyName || !formData.emailUsed || !formData.description) {
        setError('Please fill in all required fields (Company Name, Email, Description)');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/reports/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setFormData({
          companyName: '',
          emailUsed: '',
          phoneNumber: '',
          description: '',
        });

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setError(result.error || 'Failed to submit report');
      }
    } catch (err) {
      setError('Error submitting report. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg uppercase tracking-wider">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600 rounded-full mix-blend-screen filter blur-3xl"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-600 rounded-full mix-blend-screen filter blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 mb-12 font-black uppercase tracking-wider transition-all"
        >
          <span>←</span>
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-wider mb-4">
            <span className="bg-gradient-to-r from-red-500 via-amber-600 to-red-600 bg-clip-text text-transparent">
              My Reports
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Review all your analyzed job postings and detected fraud indicators
          </p>
        </div>

        {/* Filter Section */}
        <div className="mb-8 border-2 border-amber-700 bg-black p-6">
          <h2 className="text-amber-400 font-black uppercase tracking-wider mb-4">Filters</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="Search by company or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 text-white placeholder-gray-500 focus:border-amber-600 focus:outline-none transition-all"
              />
            </div>

            {/* Risk Filter */}
            <div className="flex gap-2">
              {['all', 'high', 'medium', 'low'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setRiskFilter(filter)}
                  className={`flex-1 px-4 py-3 font-black text-xs uppercase tracking-wider border-2 transition-all ${
                    riskFilter === filter
                      ? 'border-amber-600 bg-amber-600/10 text-amber-500'
                      : 'border-gray-700 bg-black text-gray-400 hover:border-amber-600/50'
                  }`}
                >
                  {filter === 'all' && `All (${analyses.length})`}
                  {filter === 'high' && `High Risk (${analyses.filter(a => a.riskScore >= 70).length})`}
                  {filter === 'medium' && `Medium (${analyses.filter(a => a.riskScore >= 40 && a.riskScore < 70).length})`}
                  {filter === 'low' && `Low Risk (${analyses.filter(a => a.riskScore < 40).length})`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="border-2 border-amber-700 bg-black overflow-hidden mb-8">
          {filteredAnalyses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-800 bg-gray-900/50">
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-amber-400">Company</th>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-amber-400">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-amber-400">Risk Level</th>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-amber-400">Risk Score</th>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-amber-400">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAnalyses.map((analysis, idx) => (
                    <tr key={idx} className="border-b border-gray-800 hover:bg-gray-900/30 transition-colors">
                      <td className="px-6 py-4 text-white font-bold">{analysis.companyName}</td>
                      <td className="px-6 py-4 text-gray-400">{analysis.location}</td>
                      <td className="px-6 py-4">
                        {analysis.riskScore >= 70 && (
                          <span className="px-3 py-1 bg-red-900/30 text-red-400 font-bold text-xs uppercase border border-red-700">High Risk</span>
                        )}
                        {analysis.riskScore >= 40 && analysis.riskScore < 70 && (
                          <span className="px-3 py-1 bg-yellow-900/30 text-yellow-400 font-bold text-xs uppercase border border-yellow-700">Medium</span>
                        )}
                        {analysis.riskScore < 40 && (
                          <span className="px-3 py-1 bg-green-900/30 text-green-400 font-bold text-xs uppercase border border-green-700">Low Risk</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-amber-400 font-bold">{analysis.riskScore}%</td>
                      <td className="px-6 py-4 text-gray-400">{new Date(analysis.timestamp).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No fraud reports found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Additional Info Section */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border-2 border-amber-700 bg-black p-6">
            <h3 className="text-amber-400 font-black uppercase tracking-wider mb-3">Why Report?</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>✓ Help prevent others from falling victim</li>
              <li>✓ Improve our scam detection algorithm</li>
              <li>✓ Help law enforcement identify fraud networks</li>
            </ul>
          </div>
          <div className="border-2 border-red-700 bg-black p-6">
            <h3 className="text-red-400 font-black uppercase tracking-wider mb-3">What We Do</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>✓ Review all reports thoroughly</li>
              <li>✓ Block fraudulent companies</li>
              <li>✓ Share intel with authorities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
