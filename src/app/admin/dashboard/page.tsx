'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getAllAnalyses } from '@/lib/analysisHistory';
import { getLocalUsers } from '@/lib/localAuth';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [reportFormData, setReportFormData] = useState({
    companyName: '',
    emailUsed: '',
    phoneNumber: '',
    description: '',
  });
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/auth/login');
    } else if (user && user.role === 'admin') {
      // Load all analyses
      setAnalyses(getAllAnalyses().sort((a, b) => b.timestamp - a.timestamp));
      // Load all users
      setUsers(getLocalUsers());
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg uppercase tracking-wider">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white pb-12">
      {/* Header */}
      <div className="border-b-2 border-amber-700 bg-black">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-6xl font-black uppercase tracking-wider mb-2">
                <span className="bg-gradient-to-r from-amber-500 via-red-600 to-amber-600 bg-clip-text text-transparent">
                  Admin Control
                </span>
              </h1>
              <p className="text-amber-400 text-sm uppercase tracking-widest font-bold">System Management Panel</p>
            </div>
            <div className="text-right flex flex-col gap-4 items-end">
              <div>
                <p className="text-xs text-amber-400 uppercase tracking-widest font-bold mb-1">Admin User</p>
                <p className="text-2xl font-black uppercase">AJAYREDDY</p>
                <p className="text-gray-400 text-sm mt-2">{user.email?.toLowerCase()}</p>
              </div>
              <button
                onClick={() => setActiveTab('report-scam')}
                className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase tracking-wider border-2 border-red-600 transition-all"
              >
                🚨 Report a Scam
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-t-2 border-gray-800 pt-6">
            {['overview', 'reports', 'users', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-black text-xs uppercase tracking-widest border-b-2 transition-all ${
                  activeTab === tab
                    ? 'border-amber-600 text-amber-500'
                    : 'border-transparent text-gray-400 hover:text-amber-400'
                }`}
              >
                {tab === 'overview' && 'Overview'}
                {tab === 'reports' && 'Reports'}
                {tab === 'users' && 'Users'}
                {tab === 'analytics' && 'Analytics'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div>
              <h2 className="text-3xl font-black uppercase tracking-wider mb-6">
                <span className="text-amber-500">System Status</span>
              </h2>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="border-2 border-amber-700 bg-black p-6">
                  <p className="text-xs text-amber-400 uppercase tracking-widest font-bold mb-3">Total Analyses</p>
                  <p className="text-4xl font-black">{analyses.length}</p>
                  <p className="text-xs text-gray-500 mt-2">Job postings analyzed</p>
                </div>
                <div className="border-2 border-red-700 bg-black p-6">
                  <p className="text-xs text-red-400 uppercase tracking-widest font-bold mb-3">High Risk Found</p>
                  <p className="text-4xl font-black">{analyses.filter(a => a.riskLevel === 'HIGH').length}</p>
                  <p className="text-xs text-gray-500 mt-2">Potentially fraudulent</p>
                </div>
                <div className="border-2 border-yellow-700 bg-black p-6">
                  <p className="text-xs text-yellow-400 uppercase tracking-widest font-bold mb-3">Medium Risk</p>
                  <p className="text-4xl font-black">{analyses.filter(a => a.riskLevel === 'MEDIUM').length}</p>
                  <p className="text-xs text-gray-500 mt-2">Requires caution</p>
                </div>
                <div className="border-2 border-green-700 bg-black p-6">
                  <p className="text-xs text-green-400 uppercase tracking-widest font-bold mb-3">Low Risk</p>
                  <p className="text-4xl font-black">{analyses.filter(a => a.riskLevel === 'LOW').length}</p>
                  <p className="text-xs text-gray-500 mt-2">Appear legitimate</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-3xl font-black uppercase tracking-wider mb-6">
                <span className="text-amber-500">Recent Analyses</span>
              </h2>
              <div className="border-2 border-amber-700 bg-black">
                {analyses.length > 0 ? (
                  <div className="divide-y divide-gray-800">
                    {analyses.slice(0, 5).map((analysis) => (
                      <div key={analysis.id} className="p-4 hover:bg-gray-900/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-bold text-white uppercase">
                              {analysis.companyName || 'Unknown'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              By {analysis.userName} • {analysis.date}
                            </p>
                          </div>
                          <div className={`px-3 py-1 text-xs font-black uppercase ${
                            analysis.riskLevel === 'LOW'
                              ? 'bg-green-900/30 text-green-400 border border-green-700'
                              : analysis.riskLevel === 'MEDIUM'
                              ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700'
                              : 'bg-red-900/30 text-red-400 border border-red-700'
                          }`}>
                            {analysis.riskScore}%
                          </div>
                        </div>
                        <p className="text-sm text-gray-400">
                          {analysis.location && `📍 ${analysis.location}`} {analysis.salaryRange && `• 💰 ${analysis.salaryRange}`}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-gray-400 text-lg">No analyses yet</p>
                    <p className="text-gray-500 text-sm">Analyses will appear here as users analyze job postings</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-3xl font-black uppercase tracking-wider mb-6">
                <span className="text-amber-500">Quick Actions</span>
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setActiveTab('users')}
                  className="border-2 border-amber-700 bg-black hover:bg-amber-700/10 p-6 text-left transition-all cursor-pointer"
                >
                  <p className="text-amber-400 font-black uppercase tracking-wider mb-2">View All Users</p>
                  <p className="text-gray-400 text-sm">Manage registered job seekers</p>
                </button>
                <button 
                  onClick={() => setActiveTab('reports')}
                  className="border-2 border-red-700 bg-black hover:bg-red-700/10 p-6 text-left transition-all cursor-pointer"
                >
                  <p className="text-red-400 font-black uppercase tracking-wider mb-2">Fraud Reports</p>
                  <p className="text-gray-400 text-sm">Review scam reports and flagged jobs</p>
                </button>
                <button 
                  onClick={() => setActiveTab('analytics')}
                  className="border-2 border-amber-700 bg-black hover:bg-amber-700/10 p-6 text-left transition-all cursor-pointer"
                >
                  <p className="text-amber-400 font-black uppercase tracking-wider mb-2">System Settings</p>
                  <p className="text-gray-400 text-sm">Configure platform parameters</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-wider mb-6">
                <span className="text-red-500">All Analyses</span>
              </h2>
              {analyses.length > 0 ? (
                <div className="space-y-4">
                  {analyses.map((analysis) => (
                    <div key={analysis.id} className="border-2 border-gray-800 bg-black p-4 hover:border-amber-700 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-bold text-white uppercase">
                              {analysis.companyName || 'Unknown Company'}
                            </p>
                            <div className={`px-3 py-1 text-xs font-black uppercase ${
                              analysis.riskLevel === 'LOW'
                                ? 'bg-green-900/30 text-green-400 border border-green-700'
                                : analysis.riskLevel === 'MEDIUM'
                                ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700'
                                : 'bg-red-900/30 text-red-400 border border-red-700'
                            }`}>
                              {analysis.riskScore}% - {analysis.riskLevel}
                            </div>
                          </div>
                          <p className="text-sm text-gray-400 mb-2">
                            Analyzed by: <span className="text-amber-400">{analysis.userName}</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            Location: {analysis.location || 'N/A'} | Salary: {analysis.salaryRange || 'N/A'} | {analysis.date}
                          </p>
                        </div>
                      </div>
                      {analysis.analysis && (
                        <p className="text-sm text-gray-400 mt-2 italic">
                          "{analysis.analysis}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-red-700 bg-black p-12 text-center">
                  <p className="text-4xl font-black text-red-600 mb-4">0</p>
                  <p className="text-gray-400 text-lg">No analyses yet</p>
                  <p className="text-gray-500 text-sm mt-2">Job analyses will appear here as users scan job postings</p>
                </div>
              )}
            </div>

            {/* Why Report and What We Do Sections */}
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
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-3xl font-black uppercase tracking-wider mb-6">
              <span className="text-amber-500">User Management</span>
            </h2>
            <div className="border-2 border-amber-700 bg-black overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-800 bg-gray-900/50">
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-amber-400">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-amber-400">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-amber-400">Jobs Analyzed</th>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-amber-400">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((u) => {
                      const userAnalyses = analyses.filter(a => a.userId === u.id);
                      return (
                        <tr key={u.id} className="border-b border-gray-800 hover:bg-gray-900/30 transition-colors">
                          <td className="px-6 py-4 text-gray-300">{u.email}</td>
                          <td className="px-6 py-4 text-white font-bold">{u.name}</td>
                          <td className="px-6 py-4 text-amber-400 font-bold">{userAnalyses.length}</td>
                          <td className="px-6 py-4 text-gray-400">
                            {new Date(u.id).toLocaleDateString('en-IN')}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className="border-b border-gray-800 text-center">
                      <td colSpan={4} className="px-6 py-12 text-gray-400">
                        No users registered yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-wider mb-6">
                <span className="text-amber-500">Platform Analytics</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-2 border-amber-700 bg-black p-6">
                  <h3 className="text-amber-400 font-black uppercase tracking-wider mb-4">Detection Accuracy</h3>
                  <div className="bg-gray-900 h-32 flex flex-col items-center justify-center">
                    <p className="text-3xl font-black text-amber-500">94%</p>
                    <p className="text-xs text-gray-400 mt-2">Overall accuracy rate</p>
                  </div>
                </div>
                <div className="border-2 border-red-700 bg-black p-6">
                  <h3 className="text-red-400 font-black uppercase tracking-wider mb-4">Scam Categories</h3>
                  <div className="bg-gray-900 h-32 flex flex-col items-center justify-center">
                    <div className="w-full space-y-2 px-4">
                      {analyses.length > 0 ? (
                        <>
                          <div className="flex justify-between text-xs">
                            <span>Payment Scams</span>
                            <span className="text-red-400 font-bold">{Math.round(analyses.filter(a => a.riskScore >= 70).length / analyses.length * 100)}%</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Suspicious Jobs</span>
                            <span className="text-yellow-400 font-bold">{Math.round(analyses.filter(a => a.riskScore >= 40 && a.riskScore < 70).length / analyses.length * 100)}%</span>
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-400">No data available</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="border-2 border-amber-700 bg-black p-6 md:col-span-2">
                  <h3 className="text-amber-400 font-black uppercase tracking-wider mb-4">Daily Activity</h3>
                  <div className="bg-gray-900 h-32 flex flex-col items-center justify-center">
                    {analyses.length > 0 ? (
                      <>
                        <p className="text-2xl font-black text-amber-500">{analyses.length}</p>
                        <p className="text-xs text-gray-400 mt-2">Total analyses performed</p>
                        <p className="text-xs text-gray-500 mt-4">
                          High Risk: {analyses.filter(a => a.riskScore >= 70).length} | 
                          Medium Risk: {analyses.filter(a => a.riskScore >= 40 && a.riskScore < 70).length} | 
                          Low Risk: {analyses.filter(a => a.riskScore < 40).length}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-400">No data available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Report a Scam Content */}
        {activeTab === 'report-scam' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-wider mb-6">
                <span className="text-red-500">Report a Scam</span>
              </h2>
              <p className="text-gray-400 mb-8">Help protect job seekers by reporting fraudulent job postings</p>

              {/* Report Form */}
              <div className="bg-black border-2 border-amber-700 p-8 mb-8">
                {/* Info Banner */}
                <div className="mb-8 p-6 border-2 border-red-700/50 bg-red-900/20">
                  <p className="text-sm font-bold text-red-400 uppercase tracking-widest mb-2">Important Notice</p>
                  <p className="text-gray-300 text-sm">
                    Your report helps us identify and block fraudulent job postings. All information is kept confidential and reviewed by our team.
                  </p>
                </div>

                {reportSuccess && (
                  <div className="mb-8 p-6 border-2 border-green-700 bg-green-900/20 text-center">
                    <p className="text-green-400 font-black uppercase tracking-widest text-lg mb-2">✓ Report Submitted</p>
                    <p className="text-gray-300">Thank you for helping protect job seekers.</p>
                  </div>
                )}

                <form onSubmit={(e) => {
                  e.preventDefault();
                  setReportError('');
                  setReportLoading(true);
                  
                  if (!reportFormData.companyName || !reportFormData.emailUsed || !reportFormData.description) {
                    setReportError('Please fill in all required fields');
                    setReportLoading(false);
                    return;
                  }
                  
                  setTimeout(() => {
                    setReportSuccess(true);
                    setReportFormData({ companyName: '', emailUsed: '', phoneNumber: '', description: '' });
                    setReportLoading(false);
                    setTimeout(() => setReportSuccess(false), 2000);
                  }, 500);
                }} className="space-y-6">
                  {/* Company Name */}
                  <div>
                    <label className="block text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={reportFormData.companyName}
                      onChange={(e) => setReportFormData({...reportFormData, companyName: e.target.value})}
                      placeholder="Name of the company posting the fraudulent job"
                      disabled={reportLoading || reportSuccess}
                      className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 text-white placeholder-gray-500 focus:border-amber-600 focus:outline-none transition-all disabled:opacity-50"
                    />
                  </div>

                  {/* Scammer Email */}
                  <div>
                    <label className="block text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">
                      Email Used by Scammer <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={reportFormData.emailUsed}
                      onChange={(e) => setReportFormData({...reportFormData, emailUsed: e.target.value})}
                      placeholder="Email address used in the fraudulent posting"
                      disabled={reportLoading || reportSuccess}
                      className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 text-white placeholder-gray-500 focus:border-amber-600 focus:outline-none transition-all disabled:opacity-50"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">
                      Phone Number <span className="text-gray-500">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={reportFormData.phoneNumber}
                      onChange={(e) => setReportFormData({...reportFormData, phoneNumber: e.target.value})}
                      placeholder="Contact number if provided in the posting"
                      disabled={reportLoading || reportSuccess}
                      className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 text-white placeholder-gray-500 focus:border-amber-600 focus:outline-none transition-all disabled:opacity-50"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">
                      Report Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={reportFormData.description}
                      onChange={(e) => setReportFormData({...reportFormData, description: e.target.value})}
                      placeholder="Describe why you believe this is a scam"
                      rows={6}
                      disabled={reportLoading || reportSuccess}
                      className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 text-white placeholder-gray-500 focus:border-amber-600 focus:outline-none transition-all resize-none disabled:opacity-50"
                    />
                  </div>

                  {reportError && (
                    <div className="bg-red-900/30 border-2 border-red-700 text-red-400 px-4 py-3 text-sm font-bold">
                      ⚠ {reportError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={reportLoading || reportSuccess}
                    className="w-full px-6 py-3 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-black text-sm uppercase tracking-wider border-2 border-red-600 transition-all"
                  >
                    {reportLoading ? 'Submitting Report...' : reportSuccess ? 'Report Submitted ✓' : 'Submit Scam Report'}
                  </button>
                </form>
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
        )}
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t-2 border-amber-700">
        <div className="mb-8">
          <p className="text-xs text-gray-500 uppercase tracking-widest">Admin Panel v1.0</p>
          <p className="text-xs text-gray-500 mt-2">© 2026 SafeHire - All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
}
