'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUserAnalyses, type Analysis } from '@/lib/analysisHistory';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<Analysis[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [filterRisk, setFilterRisk] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'low-to-high' | 'high-to-low'>('high-to-low');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (user) {
      const userAnalyses = getUserAnalyses(user.id);
      console.log('🔎 Dashboard loaded for user:', user.id);
      console.log('📊 User analyses count:', userAnalyses.length);
      console.log('📋 User analyses:', userAnalyses);
      setAnalyses(userAnalyses);
      applyFiltersAndSort(userAnalyses, 'all', 'high-to-low', '');
      setPageLoading(false);
    }
  }, [user, loading, router]);

  const applyFiltersAndSort = (data: Analysis[], risk: string, sort: string, search: string) => {
    let filtered = data;

    // Filter by risk level
    if (risk !== 'all') {
      filtered = filtered.filter(a => {
        const score = a.riskScore || 0;
        if (risk === 'high') return score >= 70;
        if (risk === 'medium') return score >= 40 && score < 70;
        if (risk === 'low') return score < 40;
        return true;
      });
    }

    // Filter by search term
    if (search.trim()) {
      filtered = filtered.filter(a =>
        a.companyName?.toLowerCase().includes(search.toLowerCase()) ||
        a.location?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort
    if (sort === 'high-to-low') {
      filtered.sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0));
    } else if (sort === 'low-to-high') {
      filtered.sort((a, b) => (a.riskScore || 0) - (b.riskScore || 0));
    }

    setFilteredAnalyses(filtered);
  };

  const handleFilterChange = (risk: 'all' | 'high' | 'medium' | 'low') => {
    setFilterRisk(risk);
    applyFiltersAndSort(analyses, risk, sortBy, searchTerm);
  };

  const handleSortChange = (sort: 'low-to-high' | 'high-to-low') => {
    setSortBy(sort);
    applyFiltersAndSort(analyses, filterRisk, sort, searchTerm);
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    applyFiltersAndSort(analyses, filterRisk, sortBy, search);
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'from-red-600 to-red-800';
    if (score >= 40) return 'from-orange-600 to-orange-800';
    return 'from-green-600 to-green-800';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 70) return 'HIGH RISK';
    if (score >= 40) return 'MEDIUM RISK';
    return 'LOW RISK';
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg">Loading analyses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="text-amber-500 font-bold uppercase tracking-wider hover:text-amber-400 transition mb-6 inline-block"
          >
            ← Back Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-wider mb-4">
            <span className="bg-gradient-to-r from-amber-500 via-red-600 to-amber-600 bg-clip-text text-transparent">
              Analysis Dashboard
            </span>
          </h1>
          <p className="text-gray-400 text-lg">View all your job posting analyses</p>
          <div className="mt-6 h-1 w-32 bg-gradient-to-r from-amber-600 to-red-600"></div>
        </div>

        {analyses.length === 0 ? (
          <div className="bg-gray-900/50 border-2 border-gray-800 p-12 text-center rounded-lg">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold mb-2">No Analyses Yet</h2>
            <p className="text-gray-400 mb-6">You haven't analyzed any job postings yet.</p>
            <Link
              href="/analyze"
              className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold uppercase tracking-wider border-2 border-amber-600 transition-all inline-block"
            >
              Start Analyzing →
            </Link>
          </div>
        ) : (
          <>
            {/* Statistics */}
            <div className="grid md:grid-cols-4 gap-4 mb-12">
              <div className="bg-gradient-to-br from-amber-900/30 to-transparent border-2 border-amber-700/50 p-6 rounded-lg">
                <p className="text-xs text-amber-400 uppercase tracking-widest font-bold mb-2">Total Analyzed</p>
                <p className="text-4xl font-black text-amber-500">{analyses.length}</p>
              </div>
              <div className="bg-gradient-to-br from-red-900/30 to-transparent border-2 border-red-700/50 p-6 rounded-lg">
                <p className="text-xs text-red-400 uppercase tracking-widest font-bold mb-2">High Risk</p>
                <p className="text-4xl font-black text-red-500">
                  {analyses.filter(a => (a.riskScore || 0) >= 70).length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-900/30 to-transparent border-2 border-orange-700/50 p-6 rounded-lg">
                <p className="text-xs text-orange-400 uppercase tracking-widest font-bold mb-2">Medium Risk</p>
                <p className="text-4xl font-black text-orange-500">
                  {analyses.filter(a => (a.riskScore || 0) >= 40 && (a.riskScore || 0) < 70).length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-900/30 to-transparent border-2 border-green-700/50 p-6 rounded-lg">
                <p className="text-xs text-green-400 uppercase tracking-widest font-bold mb-2">Low Risk</p>
                <p className="text-4xl font-black text-green-500">
                  {analyses.filter(a => (a.riskScore || 0) < 40).length}
                </p>
              </div>
            </div>
            {/* Search & Filter */}
            <div className="mb-8 space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Search by company name, job title, or location..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full px-6 py-3 bg-gray-900 border-2 border-gray-800 text-white placeholder-gray-500 focus:border-amber-600 focus:outline-none uppercase text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleFilterChange('all')}
                  className={`px-6 py-2 uppercase font-bold text-sm tracking-wider transition-all border-2 ${
                    filterRisk === 'all'
                      ? 'bg-amber-600 border-amber-600 text-white'
                      : 'border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white'
                  }`}
                >
                  All Risks
                </button>
                <button
                  onClick={() => handleFilterChange('high')}
                  className={`px-6 py-2 uppercase font-bold text-sm tracking-wider transition-all border-2 ${
                    filterRisk === 'high'
                      ? 'bg-red-600 border-red-600 text-white'
                      : 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
                  }`}
                >
                  High Risk
                </button>
                <button
                  onClick={() => handleFilterChange('medium')}
                  className={`px-6 py-2 uppercase font-bold text-sm tracking-wider transition-all border-2 ${
                    filterRisk === 'medium'
                      ? 'bg-orange-600 border-orange-600 text-white'
                      : 'border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white'
                  }`}
                >
                  Medium Risk
                </button>
                <button
                  onClick={() => handleFilterChange('low')}
                  className={`px-6 py-2 uppercase font-bold text-sm tracking-wider transition-all border-2 ${
                    filterRisk === 'low'
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
                  }`}
                >
                  Low Risk
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="font-bold text-amber-400 uppercase tracking-wider text-sm flex items-center">Sort by Risk Score:</div>
                <button
                  onClick={() => handleSortChange('high-to-low')}
                  className={`px-6 py-2 uppercase font-bold text-sm tracking-wider transition-all border-2 ${
                    sortBy === 'high-to-low'
                      ? 'bg-amber-600 border-amber-600 text-white'
                      : 'border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white'
                  }`}
                >
                  High to Low
                </button>
                <button
                  onClick={() => handleSortChange('low-to-high')}
                  className={`px-6 py-2 uppercase font-bold text-sm tracking-wider transition-all border-2 ${
                    sortBy === 'low-to-high'
                      ? 'bg-amber-600 border-amber-600 text-white'
                      : 'border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white'
                  }`}
                >
                  Low to High
                </button>
              </div>
            </div>

            {/* Analysis List */}
            {filteredAnalyses.length === 0 ? (
              <div className="text-center py-12 bg-gray-900/50 border-2 border-gray-800 p-8 rounded-lg">
                <div className="text-6xl mb-4">🔎</div>
                <p className="text-2xl font-bold text-gray-400">No analyses found</p>
                <p className="text-gray-500 mt-2">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAnalyses.map((job, index) => (
                  <div
                    key={job.id}
                    className="border-2 border-gray-800 hover:border-amber-600 transition-all p-6 bg-gradient-to-r from-slate-900/50 to-black rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-2xl font-bold text-white">{job.companyName || 'Unknown Company'}</p>
                      </div>
                      <div className={`bg-gradient-to-br ${getRiskColor(job.riskScore || 0)} px-6 py-3 rounded text-white font-black text-right`}>
                        <div className="text-3xl">{job.riskScore || 0}%</div>
                        <div className="text-xs uppercase tracking-wider">{getRiskLabel(job.riskScore || 0)}</div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm text-gray-300">
                      <div>
                        <p className="text-xs text-amber-400 uppercase font-bold mb-1">Location</p>
                        <p>{job.location || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-amber-400 uppercase font-bold mb-1">Salary</p>
                        <p>{job.salaryRange || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-amber-400 uppercase font-bold mb-1">Analyzed By</p>
                        <p className="text-xs">{job.userName || 'Unknown User'}</p>
                      </div>
                    </div>

                    <div className="bg-black/50 border-l-4 border-amber-600 p-4 mb-4 rounded">
                      <p className="text-sm text-gray-300">{job.analysis}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Analyzed: {job.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
