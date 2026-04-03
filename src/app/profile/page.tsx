'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { getUserAnalyses, getAnalysisStats } from '@/lib/analysisHistory';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, lowRisk: 0, mediumRisk: 0, highRisk: 0, avgScore: '0', lastAnalysis: 'Never' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const loadUserAnalyses = (userId: string) => {
    const userAnalyses = getUserAnalyses(userId);
    setAnalyses(userAnalyses);
    setStats(getAnalysisStats(userAnalyses));
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (user) {
      setFormData({
        name: user.name || '',
        email: user.email,
      });
      loadUserAnalyses(user.id);
    }
  }, [user, loading, router]);

  // Refresh analyses when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        loadUserAnalyses(user.id);
      }
    };

    const handleFocus = () => {
      if (user) {
        loadUserAnalyses(user.id);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const downloadAnalysisJSON = () => {
    if (!user || analyses.length === 0) {
      alert('No analysis data to download');
      return;
    }

    const jsonData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        accountType: user.role === 'admin' ? 'Administrator' : 'Job Seeker',
      },
      exportDate: new Date().toISOString(),
      totalAnalyses: analyses.length,
      statistics: stats,
      analyses: analyses,
    };

    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(jsonData, null, 2)));
    element.setAttribute('download', `SafeHire_Analysis_${new Date().toISOString().split('T')[0]}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadAnalysisAsPDF = async () => {
    if (!user || analyses.length === 0) {
      alert('No analysis data to download');
      return;
    }

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;
      let yPosition = margin;
      const lineHeight = 7;
      const smallLineHeight = 5;

      // Helper function to add text with wrapping
      const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
        doc.setFontSize(fontSize);
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return y + lines.length * (fontSize === 10 ? lineHeight : smallLineHeight);
      };

      // Title
      doc.setFontSize(20);
      doc.setFont('', 'bold');
      doc.text('SAFEHIRE - ANALYSIS REPORT', margin, yPosition);
      yPosition += 15;

      // User Info
      doc.setFontSize(12);
      doc.setFont('', 'bold');
      doc.text('USER INFORMATION', margin, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setFont('', 'normal');
      doc.text(`Name: ${user.name || 'N/A'}`, margin + 5, yPosition);
      yPosition += lineHeight;
      doc.text(`Email: ${user.email || 'N/A'}`, margin + 5, yPosition);
      yPosition += lineHeight;
      doc.text(`Account Type: ${user.role === 'admin' ? 'Administrator' : 'Job Seeker'}`, margin + 5, yPosition);
      yPosition += 12;

      // Statistics
      doc.setFontSize(12);
      doc.setFont('', 'bold');
      doc.text('ANALYSIS STATISTICS', margin, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setFont('', 'normal');
      doc.text(`Total Analyses: ${stats.total}`, margin + 5, yPosition);
      yPosition += lineHeight;
      doc.text(`High Risk Jobs: ${stats.highRisk}`, margin + 5, yPosition);
      yPosition += lineHeight;
      doc.text(`Medium Risk Jobs: ${stats.mediumRisk}`, margin + 5, yPosition);
      yPosition += lineHeight;
      doc.text(`Low Risk Jobs: ${stats.lowRisk}`, margin + 5, yPosition);
      yPosition += lineHeight;
      doc.text(`Average Risk Score: ${stats.avgScore}%`, margin + 5, yPosition);
      yPosition += 12;

      // Analysis Details
      doc.setFontSize(12);
      doc.setFont('', 'bold');
      doc.text('DETAILED ANALYSIS HISTORY', margin, yPosition);
      yPosition += 10;

      // Table-like structure
      doc.setFontSize(9);
      doc.setFont('', 'bold');
      doc.text('Date', margin + 5, yPosition);
      doc.text('Company', margin + 35, yPosition);
      doc.text('Location', margin + 85, yPosition);
      doc.text('Risk', margin + 125, yPosition);
      doc.text('Score', margin + 150, yPosition);
      yPosition += 8;

      // Separator line
      doc.setDrawColor(100);
      doc.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2);

      doc.setFontSize(8);
      doc.setFont('', 'normal');

      analyses.forEach((analysis, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = margin;
        }

        const date = analysis.date || 'N/A';
        const company = analysis.companyName || 'Unknown';
        const location = analysis.location || 'N/A';
        const riskLevel = analysis.riskLevel || 'N/A';
        const score = analysis.riskScore || 'N/A';

        doc.text(date.substring(0, 10), margin + 5, yPosition);
        doc.text(company.substring(0, 15), margin + 35, yPosition);
        doc.text(location.substring(0, 15), margin + 85, yPosition);
        doc.text(riskLevel, margin + 125, yPosition);
        doc.text(`${score}%`, margin + 150, yPosition);

        yPosition += 6;

        // Add separator line every 5 entries or at the end
        if ((index + 1) % 5 === 0 || index === analyses.length - 1) {
          doc.setDrawColor(150);
          doc.line(margin, yPosition - 1, pageWidth - margin, yPosition - 1);
        }
      });

      // Footer
      yPosition = pageHeight - 15;
      doc.setFontSize(8);
      doc.setFont('', 'normal');
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, yPosition);
      doc.text(`Report ID: ${user.id}`, margin, yPosition + 5);
      doc.text(`© SafeHire ${new Date().getFullYear()}`, pageWidth - margin - 30, yPosition);

      // Save PDF
      doc.save(`SafeHire_Analysis_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black uppercase tracking-wider mb-2">
            <span className="bg-gradient-to-r from-amber-500 via-red-600 to-amber-600 bg-clip-text text-transparent">
              My Profile
            </span>
          </h1>
          <p className="text-gray-400">Manage your SafeHire account</p>
        </div>

        {/* Profile Card */}
        <div className="bg-black border-2 border-amber-700 p-8 mb-8">
          {/* User Info Section */}
          <div className="mb-8 pb-8 border-b-2 border-gray-800">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-4xl font-black text-white">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <p className="text-xs text-amber-400 uppercase tracking-widest font-bold mb-1">
                  {user.role === 'admin' ? 'ADMIN ACCOUNT' : 'JOB SEEKER'}
                </p>
                <h2 className="text-3xl font-black uppercase tracking-wider">{user.name}</h2>
                <p className="text-gray-400 text-sm mt-2">{user.email}</p>
              </div>
            </div>

            {/* Account Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-900 border-2 border-gray-800">
                <p className="text-xs text-amber-400 uppercase tracking-widest font-bold mb-2">
                  Account ID
                </p>
                <p className="text-lg font-bold">{user.id}</p>
              </div>
              <div className="p-4 bg-gray-900 border-2 border-gray-800">
                <p className="text-xs text-amber-400 uppercase tracking-widest font-bold mb-2">
                  Account Type
                </p>
                <p className="text-lg font-bold uppercase">
                  {user.role === 'admin' ? 'Administrator' : 'Job Seeker'}
                </p>
              </div>
              <div className="p-4 bg-gray-900 border-2 border-gray-800 md:col-span-2">
                <p className="text-xs text-amber-400 uppercase tracking-widest font-bold mb-2">
                  Email Address
                </p>
                <p className="text-lg font-bold break-all">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          {user.role === 'user' && (
            <div className="mb-8 pb-8 border-b-2 border-gray-800">
              <h3 className="text-xl font-black uppercase tracking-wider mb-6">Activity</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-amber-900/20 to-transparent border-2 border-amber-700/50">
                  <p className="text-xs text-amber-400 uppercase tracking-widest font-bold mb-2">
                    Jobs Analyzed
                  </p>
                  <p className="text-3xl font-black">{stats.total}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-red-900/20 to-transparent border-2 border-red-700/50">
                  <p className="text-xs text-red-400 uppercase tracking-widest font-bold mb-2">
                    High Risk Found
                  </p>
                  <p className="text-3xl font-black">{stats.highRisk}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-amber-900/20 to-transparent border-2 border-amber-700/50">
                  <p className="text-xs text-amber-400 uppercase tracking-widest font-bold mb-2">
                    Average Score
                  </p>
                  <p className="text-3xl font-black">{stats.avgScore}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Account Security */}
          <div className="mb-8">
            <h3 className="text-xl font-black uppercase tracking-wider mb-4">Security</h3>
            <div className="p-4 bg-gradient-to-r from-amber-900/20 to-red-900/20 border-2 border-amber-700/50 mb-4">
              <p className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-amber-400 font-bold mt-1">🔒</span>
                <span>Your account is secured with a password. Keep it safe and never share it with anyone.</span>
              </p>
            </div>
            <button className="w-full px-6 py-3 border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white font-bold uppercase tracking-wider transition-all">
              Change Password
            </button>
          </div>

          {/* Analysis History */}
          {user.role === 'user' && (
            <div className="mb-8 pb-8 border-t-2 border-gray-800 pt-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black uppercase tracking-wider">Analysis History</h3>
                <button
                  onClick={() => user && loadUserAnalyses(user.id)}
                  className="px-3 py-1 text-xs border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white font-bold uppercase transition-all"
                >
                  Refresh
                </button>
              </div>
              {analyses.length > 0 ? (
                <div className="space-y-4">
                  {analyses.slice(0, 5).map((analysis) => (
                    <div key={analysis.id} className="bg-gray-900/50 border-2 border-gray-800 p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold uppercase text-white">
                            {analysis.companyName || 'Unknown Company'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {analysis.date}
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
                        Location: {analysis.location || 'Not specified'} | Salary: {analysis.salaryRange || 'Not specified'}
                      </p>
                    </div>
                  ))}
                  {analyses.length > 5 && (
                    <p className="text-xs text-gray-500 text-center mt-4">
                      Showing 5 of {analyses.length} analyses
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-gray-900/50 border-2 border-gray-800 p-8 text-center">
                  <p className="text-gray-400">No analyses yet</p>
                  <p className="text-gray-500 text-sm mt-2">Start analyzing job postings to see history here</p>
                  <button
                    onClick={() => router.push('/analyze')}
                    className="mt-4 px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold uppercase text-sm border-2 border-amber-600 transition-all"
                  >
                    Analyze Job
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Additional Options */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="space-y-2">
            <button
              onClick={downloadAnalysisAsPDF}
              className="w-full px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-black uppercase tracking-wider border-2 border-amber-600 transition-all"
            >
              📄 Download Data (PDF)
            </button>
            <button
              onClick={downloadAnalysisJSON}
              className="w-full px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-black uppercase tracking-wider border-2 border-amber-600 transition-all"
            >
              📊 Download Data (JSON)
            </button>
          </div>
          <button className="px-6 py-3 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-black uppercase tracking-wider transition-all">
            Delete Account
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full px-6 py-3 bg-red-600/20 hover:bg-red-600 border-2 border-red-600 text-red-400 hover:text-white font-black uppercase tracking-wider transition-all"
        >
          Logout
        </button>

        {/* Footer Info */}
        <div className="mt-12 pt-8 border-t-2 border-gray-800 text-center text-gray-500 text-sm">
          <p>Account created and secured with SafeHire</p>
          <p className="mt-2">For support, contact: support@safehire.in</p>
        </div>
      </div>
    </div>
  );
}
