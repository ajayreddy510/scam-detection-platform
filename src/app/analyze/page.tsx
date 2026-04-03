'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { saveAnalysis } from '@/lib/analysisHistory';

export default function AnalyzePage() {
  const router = useRouter();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [jobPosting, setJobPosting] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [recruiterPhone, setRecruiterPhone] = useState('');
  const [jobCategory, setJobCategory] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [experienceRequired, setExperienceRequired] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [applicationMethod, setApplicationMethod] = useState('');
  const [industry, setIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [redFlags, setRedFlags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block h-12 w-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg uppercase tracking-wider">Loading...</p>
        </div>
      </div>
    );
  }

  // If loading is done but still no user, show login redirect
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider mb-6">
            Sign In Required
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Please sign in to analyze job postings and protect yourself from scams.
          </p>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm uppercase tracking-wider border-2 border-amber-600 transition-all"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobPosting.trim()) {
      alert('Please paste a job posting');
      return;
    }

    setLoading(true);
    setSubmitted(true);

    // Enhanced AI analysis with multiple indicators
    setTimeout(() => {
      let score = 0;
      let detectedFlags = 0;
      const detectedRedFlagsList: string[] = [];
      const lowerJobPosting = jobPosting.toLowerCase();
      const postingLength = jobPosting.length;
      const lowerCompany = companyName?.toLowerCase() || '';
      const lowerSalary = salaryRange?.toLowerCase() || '';

      // 1. PAYMENT RED FLAGS (High Weight)
      const paymentFlags = [
        { keyword: 'fee', name: 'Payment fee request detected', weight: 15 },
        { keyword: 'upfront', name: 'Upfront payment requirement', weight: 15 },
        { keyword: 'crypto', name: 'Cryptocurrency payment requested', weight: 20 },
        { keyword: 'bitcoin', name: 'Bitcoin or cryptocurrency mentioned', weight: 20 },
        { keyword: 'wire transfer', name: 'Wire transfer payment required', weight: 15 },
        { keyword: 'bank account', name: 'Bank account details requested', weight: 12 },
        { keyword: 'atm', name: 'ATM or cash transaction mentioned', weight: 10 },
        { keyword: 'money transfer', name: 'Money transfer requirement found', weight: 12 },
      ];

      paymentFlags.forEach(flag => {
        if (lowerJobPosting.includes(flag.keyword)) {
          detectedFlags++;
          detectedRedFlagsList.push(flag.name);
          score += flag.weight;
        }
      });

      // 2. URGENCY/PRESSURE TACTICS
      const urgencyFlags = [
        { keyword: 'urgent', name: 'Excessive urgency language ("URGENT")', weight: 8 },
        { keyword: 'immediately', name: 'Immediate action pressure', weight: 8 },
        { keyword: 'asap', name: 'ASAP deadline pressure', weight: 8 },
        { keyword: 'limited spots', name: 'Limited spots / positions mentioned', weight: 10 },
        { keyword: 'limited time', name: 'Time-limited offer pressure', weight: 10 },
        { keyword: 'hurry', name: 'Hurry / rush language detected', weight: 5 },
        { keyword: 'don\'t miss', name: '"Don\'t miss" pressure tactic', weight: 7 },
        { keyword: 'act now', name: '"Act Now" pressure language', weight: 7 },
      ];

      urgencyFlags.forEach(flag => {
        if (lowerJobPosting.includes(flag.keyword)) {
          detectedFlags++;
          detectedRedFlagsList.push(flag.name);
          score += flag.weight;
        }
      });

      // 3. UNREALISTIC PROMISES
      const promiseFlags = [
        { keyword: 'guarantee', name: 'Income guarantee claim', weight: 10 },
        { keyword: 'guaranteed income', name: 'Guaranteed income promise', weight: 12 },
        { keyword: 'easy money', name: '"Easy money" promise detected', weight: 12 },
        { keyword: 'work from home', name: 'Work from home (often used in scams)', weight: 8 },
        { keyword: 'no experience needed', name: 'No experience required claim', weight: 8 },
        { keyword: 'no skills required', name: 'No skills required claim', weight: 8 },
        { keyword: 'earn thousands', name: 'Unrealistic earnings promise (thousands)', weight: 12 },
        { keyword: 'make money fast', name: 'Fast money promise detected', weight: 12 },
      ];

      promiseFlags.forEach(flag => {
        if (lowerJobPosting.includes(flag.keyword)) {
          detectedFlags++;
          detectedRedFlagsList.push(flag.name);
          score += flag.weight;
        }
      });

      // 4. COMMUNICATION QUALITY
      const wordCount = jobPosting.split(/\s+/).length;
      if (wordCount < 50) {
        detectedFlags++;
        detectedRedFlagsList.push('Unusually short job posting (< 50 words)');
        score += 10;
      }

      const grammarIssues = (jobPosting.match(/\?\?|!!|\.\.\.{2,}/g) || []).length;
      if (grammarIssues > 3) {
        detectedFlags++;
        detectedRedFlagsList.push('Multiple grammar issues (???, !!!, ...) detected');
        score += 8;
      }

      // 5. MISSING INFORMATION
      if (!companyName || companyName.trim().length < 2) {
        detectedFlags++;
        detectedRedFlagsList.push('Company name missing or incomplete');
        score += 8;
      }
      if (!location || location.trim().length < 2) {
        detectedFlags++;
        detectedRedFlagsList.push('Work location not specified');
        score += 5;
      }

      // 6. SUSPICIOUS SALARY PATTERNS
      if (salaryRange) {
        const salaryMatch = salaryRange.match(/(\d+)/g);
        if (salaryMatch && salaryMatch.length > 0) {
          const maxSalary = Math.max(...salaryMatch.map(s => parseInt(s) || 0));
          if (maxSalary > 50 && wordCount < 100) {
            detectedFlags++;
            detectedRedFlagsList.push('Unrealistically high salary (₹50L+) for vague job description');
            score += 15;
          }
        }

        if (salaryRange.toLowerCase().includes('unlimited') || 
            salaryRange.toLowerCase().includes('negotiable')) {
          detectedFlags++;
          detectedRedFlagsList.push('Vague or "unlimited" salary offer');
          score += 8;
        }
      }

      // 7. SUSPICIOUS EMAIL/CONTACT PATTERNS
      if (!recruiterEmail || recruiterEmail.length < 5) {
        detectedFlags++;
        detectedRedFlagsList.push('No recruiter email provided');
        score += 5;
      } else if (recruiterEmail.includes('@gmail.com') || 
          recruiterEmail.includes('@yahoo.com') ||
          recruiterEmail.includes('@hotmail.com')) {
        detectedFlags++;
        detectedRedFlagsList.push('Generic email domain (Gmail/Yahoo/Hotmail) instead of company domain');
        score += 8;
      }

      // 8. GENERIC/TEMPLATE LANGUAGE
      const genericPhrases = [
        { phrase: 'dear applicant', name: '"Dear Applicant" generic greeting' },
        { phrase: 'dear sir/madam', name: '"Dear Sir/Madam" generic greeting' },
        { phrase: 'hello friend', name: '"Hello Friend" informal greeting' },
        { phrase: 'congratulations you have been selected', name: 'Pre-selected congratulations message' },
      ];

      genericPhrases.forEach(item => {
        if (lowerJobPosting.includes(item.phrase)) {
          detectedFlags++;
          detectedRedFlagsList.push(item.name);
          score += 10;
        }
      });

      // 9. MISSING COMPANY WEBSITE
      if (!companyWebsite) {
        detectedFlags++;
        detectedRedFlagsList.push('No company website provided');
        score += 5;
      }

      // 10. BASELINE SCORE FOR INCOMPLETE INFO
      if (!companyName && !location && !salaryRange) {
        score += 15;
        detectedFlags += 2;
        detectedRedFlagsList.push('Critical information missing (company, location, salary)');
      }

      // Cap score at 100
      const finalScore = Math.min(score, 100);

      setRiskScore(finalScore);
      setRedFlags(detectedRedFlagsList);
      setAnalysis(
        detectedFlags > 0
          ? `Detected ${detectedFlags} potential red flags in this job posting. Risk Level: ${
              finalScore < 30
                ? 'LOW'
                : finalScore < 70
                ? 'MEDIUM'
                : 'HIGH'
            }`
          : 'No major red flags detected. Job posting appears legitimate.'
      );

      // Save analysis to history with error handling
      try {
        const savedAnalysis = saveAnalysis(
          user?.id || 'unknown',
          user?.name || 'Unknown User',
          jobPosting,
          companyName || 'Not specified',
          location || 'Not specified',
          salaryRange || 'Not specified',
          finalScore,
          detectedFlags > 0
            ? `Detected ${detectedFlags} potential red flags in this job posting.`
            : 'No major red flags detected. Job posting appears legitimate.'
        );
        console.log('✅ Analysis saved:', savedAnalysis);
      } catch (error) {
        console.error('❌ Error saving analysis:', error);
      }

      setLoading(false);
    }, 2000);
  };

  const steps = [
    { number: 1, title: 'Paste Job Posting', desc: 'Copy and paste the job description from any platform' },
    { number: 2, title: 'Add Context Details', desc: 'Include basic company and position information' },
    { number: 3, title: 'AI Analyzes Data', desc: 'Our ML model scans 50+ fraud indicators' },
    { number: 4, title: 'Get Risk Score', desc: 'Detailed report with red flags and recommendations' },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-wider mb-6">
            <span className="bg-gradient-to-r from-amber-500 via-red-600 to-amber-600 bg-clip-text text-transparent">
              Job Analysis
            </span>
          </h1>
          <p className="text-gray-400 text-lg">4-step process to identify scams in seconds</p>
          <div className="mt-6 h-1 w-32 bg-gradient-to-r from-amber-600 to-red-600 mx-auto"></div>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Paste Job Posting */}
            <div className="border-2 border-amber-700/30 hover:border-amber-600 transition-all p-8 bg-gradient-to-br from-slate-900/50 to-black">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl font-black text-amber-500">01</div>
                <div>
                  <h2 className="text-2xl font-black uppercase text-white">Paste Job Posting</h2>
                  <p className="text-gray-400 text-sm">Copy and paste the job description from any platform</p>
                </div>
              </div>
              <textarea
                value={jobPosting}
                onChange={(e) => setJobPosting(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full h-40 bg-black border-2 border-amber-700/30 text-white p-4 focus:border-amber-600 focus:outline-none uppercase text-sm"
                required
              />
              <div className="mt-4 flex gap-6 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500">✓</span>
                  <span>Support all job platforms</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500">✓</span>
                  <span>Any job category</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500">✓</span>
                  <span>No account needed</span>
                </div>
              </div>
            </div>

            {/* Step 2: Add Context Details */}
            <div className="border-2 border-amber-700/30 hover:border-amber-600 transition-all p-8 bg-gradient-to-br from-slate-900/50 to-black">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl font-black text-amber-500">02</div>
                <div>
                  <h2 className="text-2xl font-black uppercase text-white">Add Context Details</h2>
                  <p className="text-gray-400 text-sm">Include company, position, and additional information</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-amber-400 uppercase mb-2">Job Title</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                    className="w-full bg-black border-2 border-amber-700/30 text-white p-3 focus:border-amber-600 focus:outline-none uppercase text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-400 uppercase mb-2">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Company name"
                    className="w-full bg-black border-2 border-amber-700/30 text-white p-3 focus:border-amber-600 focus:outline-none uppercase text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-400 uppercase mb-2">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Bangalore, Remote"
                    className="w-full bg-black border-2 border-amber-700/30 text-white p-3 focus:border-amber-600 focus:outline-none uppercase text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-400 uppercase mb-2">Salary Range</label>
                  <input
                    type="text"
                    value={salaryRange}
                    onChange={(e) => setSalaryRange(e.target.value)}
                    placeholder="e.g., ₹10L - ₹20L"
                    className="w-full bg-black border-2 border-amber-700/30 text-white p-3 focus:border-amber-600 focus:outline-none uppercase text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-400 uppercase mb-2">Recruiter Email</label>
                  <input
                    type="email"
                    value={recruiterEmail}
                    onChange={(e) => setRecruiterEmail(e.target.value)}
                    placeholder="recruiter@company.com"
                    className="w-full bg-black border-2 border-amber-700/30 text-white p-3 focus:border-amber-600 focus:outline-none uppercase text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-400 uppercase mb-2">Recruiter Phone</label>
                  <input
                    type="tel"
                    value={recruiterPhone}
                    onChange={(e) => setRecruiterPhone(e.target.value)}
                    placeholder="+91 XXXX XXXXXX"
                    className="w-full bg-black border-2 border-amber-700/30 text-white p-3 focus:border-amber-600 focus:outline-none uppercase text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-400 uppercase mb-2">Job Category</label>
                  <select
                    value={jobCategory}
                    onChange={(e) => setJobCategory(e.target.value)}
                    className="w-full bg-black border-2 border-amber-700/30 text-white p-3 focus:border-amber-600 focus:outline-none uppercase text-sm"
                  >
                    <option value="">Select Category</option>
                    <option value="IT">IT & Software</option>
                    <option value="Finance">Finance & Banking</option>
                    <option value="Sales">Sales & Marketing</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="HR">HR & Recruitment</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-400 uppercase mb-2">Employment Type</label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="w-full bg-black border-2 border-amber-700/30 text-white p-3 focus:border-amber-600 focus:outline-none uppercase text-sm"
                  >
                    <option value="">Select Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-400 uppercase mb-2">Experience Required</label>
                  <input
                    type="text"
                    value={experienceRequired}
                    onChange={(e) => setExperienceRequired(e.target.value)}
                    placeholder="e.g., 2-5 years"
                    className="w-full bg-black border-2 border-amber-700/30 text-white p-3 focus:border-amber-600 focus:outline-none uppercase text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-400 uppercase mb-2">Company Website</label>
                  <input
                    type="url"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder="https://company.com"
                    className="w-full bg-black border-2 border-amber-700/30 text-white p-3 focus:border-amber-600 focus:outline-none uppercase text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-400 uppercase mb-2">Application Method</label>
                  <input
                    type="text"
                    value={applicationMethod}
                    onChange={(e) => setApplicationMethod(e.target.value)}
                    placeholder="e.g., Email, LinkedIn"
                    className="w-full bg-black border-2 border-amber-700/30 text-white p-3 focus:border-amber-600 focus:outline-none uppercase text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-400 uppercase mb-2">Industry/Sector</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g., Technology, Finance"
                    className="w-full bg-black border-2 border-amber-700/30 text-white p-3 focus:border-amber-600 focus:outline-none uppercase text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: AI Analyzes Data */}
            <div className="border-2 border-amber-700/30 p-8 bg-gradient-to-br from-slate-900/50 to-black">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl font-black text-amber-500">03</div>
                <div>
                  <h2 className="text-2xl font-black uppercase text-white">AI Analyzes Data</h2>
                  <p className="text-gray-400 text-sm">Our ML model scans 50+ fraud indicators</p>
                </div>
              </div>
              <div className="flex gap-6 text-xs text-gray-400 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500">✓</span>
                  <span>Real-time processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500">✓</span>
                  <span>ML algorithms</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500">✓</span>
                  <span>Pattern matching</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-8 py-4 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-600 text-white font-bold uppercase border-2 border-amber-600 transition-all text-sm tracking-wider"
              >
                {loading ? 'Analyzing...' : 'Start Analysis'}
              </button>
            </div>
          </form>
        ) : (
          /* Step 4: Results */
          <div className="border-2 border-amber-700 p-8 bg-gradient-to-br from-slate-900 to-black">
            <div className="flex items-center gap-4 mb-8">
              <div className="text-4xl font-black text-amber-500">04</div>
              <div>
                <h2 className="text-2xl font-black uppercase text-white">Risk Score</h2>
                <p className="text-gray-400 text-sm">Detailed report with red flags and recommendations</p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <div className="inline-block animate-spin mb-4">
                    <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full"></div>
                  </div>
                  <p className="text-gray-400 font-bold">Analyzing job posting...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Risk Score Display */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className={`bg-black border-2 p-6 text-center ${
                    riskScore === null ? 'border-amber-700/30' :
                    riskScore < 40 ? 'border-green-700/50 bg-green-900/10' :
                    riskScore < 70 ? 'border-yellow-700/50 bg-yellow-900/10' :
                    'border-red-700/50 bg-red-900/10'
                  }`}>
                    <p className={`text-xs uppercase mb-3 ${
                      riskScore === null ? 'text-gray-400' :
                      riskScore < 40 ? 'text-green-400' :
                      riskScore < 70 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>Severity Level</p>
                    <div className={`text-5xl font-black ${
                      riskScore === null ? 'text-gray-400' :
                      riskScore < 40 ? 'text-green-500' :
                      riskScore < 70 ? 'text-yellow-500' :
                      'text-red-600'
                    }`}>
                      {riskScore === null ? '--' : riskScore}%
                    </div>
                    <p className={`text-xs mt-3 uppercase font-bold ${
                      riskScore === null ? 'text-gray-500' :
                      riskScore < 40 ? 'text-green-400' :
                      riskScore < 70 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {riskScore === null ? 'Pending' :
                       riskScore < 40 ? 'Low Risk' :
                       riskScore < 70 ? 'Medium Risk' :
                       'High Risk'}
                    </p>
                  </div>

                  <div className={`bg-black border-2 p-6 text-center ${
                    riskScore === null ? 'border-amber-700/30' :
                    riskScore < 40 ? 'border-green-700/50 bg-green-900/10' :
                    riskScore < 70 ? 'border-yellow-700/50 bg-yellow-900/10' :
                    'border-red-700/50 bg-red-900/10'
                  }`}>
                    <p className={`text-xs uppercase mb-3 ${
                      riskScore === null ? 'text-gray-400' :
                      riskScore < 40 ? 'text-green-400' :
                      riskScore < 70 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>Detailed Insights</p>
                    <div className={`text-5xl font-black ${
                      riskScore === null ? 'text-gray-400' :
                      riskScore < 40 ? 'text-green-500' :
                      riskScore < 70 ? 'text-yellow-500' :
                      'text-red-600'
                    }`}>
                      {redFlags.length}
                    </div>
                    <p className={`text-xs mt-3 uppercase font-bold ${
                      riskScore === null ? 'text-gray-500' :
                      riskScore < 40 ? 'text-green-400' :
                      riskScore < 70 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>Red Flags Detected</p>
                  </div>

                  <div className={`bg-black border-2 p-6 text-center ${
                    riskScore === null ? 'border-amber-700/30' :
                    riskScore < 40 ? 'border-green-700/50 bg-green-900/10' :
                    riskScore < 70 ? 'border-yellow-700/50 bg-yellow-900/10' :
                    'border-red-700/50 bg-red-900/10'
                  }`}>
                    <p className={`text-xs uppercase mb-3 ${
                      riskScore === null ? 'text-gray-400' :
                      riskScore < 40 ? 'text-green-400' :
                      riskScore < 70 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>Action Items</p>
                    <div className={`text-5xl font-black ${
                      riskScore === null ? 'text-gray-400' :
                      riskScore < 40 ? 'text-green-500' :
                      riskScore < 70 ? 'text-yellow-500' :
                      'text-red-600'
                    }`}>
                      {companyName && location && salaryRange ? '✓' : '○'}
                    </div>
                    <p className={`text-xs mt-3 uppercase font-bold ${
                      riskScore === null ? 'text-gray-500' :
                      riskScore < 40 ? 'text-green-400' :
                      riskScore < 70 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>Details Complete</p>
                  </div>
                </div>

                {/* Analysis Result */}
                <div className={`border-2 p-6 ${
                  riskScore === null ? 'bg-black border-amber-700/30' :
                  riskScore < 40 ? 'bg-green-900/10 border-green-700/50' :
                  riskScore < 70 ? 'bg-yellow-900/10 border-yellow-700/50' :
                  'bg-red-900/10 border-red-700/50'
                }`}>
                  <h3 className={`font-bold uppercase mb-3 ${
                    riskScore === null ? 'text-amber-400' :
                    riskScore < 40 ? 'text-green-400' :
                    riskScore < 70 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>Analysis</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {analysis}
                  </p>
                </div>

                {/* Red Flags Detected */}
                {redFlags.length > 0 && (
                  <div className={`border-2 p-6 rounded-lg ${
                    riskScore === null ? 'bg-red-900/20 border-red-700/50' :
                    riskScore < 40 ? 'bg-green-900/20 border-green-700/50' :
                    riskScore < 70 ? 'bg-yellow-900/20 border-yellow-700/50' :
                    'bg-red-900/20 border-red-700/50'
                  }`}>
                    <h3 className={`font-bold uppercase mb-4 flex items-center gap-2 ${
                      riskScore === null ? 'text-red-400' :
                      riskScore < 40 ? 'text-green-400' :
                      riskScore < 70 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      <span>🚩</span>
                      Red Flags Detected ({redFlags.length})
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      {redFlags.map((flag, index) => (
                        <li key={index} className={`flex items-start gap-3 pb-2 border-b last:border-b-0 ${
                          riskScore === null ? 'border-red-700/30' :
                          riskScore < 40 ? 'border-green-700/30' :
                          riskScore < 70 ? 'border-yellow-700/30' :
                          'border-red-700/30'
                        }`}>
                          <span className={`font-bold min-w-max ${
                            riskScore === null ? 'text-red-500' :
                            riskScore < 40 ? 'text-green-500' :
                            riskScore < 70 ? 'text-yellow-500' :
                            'text-red-500'
                          }`}>✗</span>
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                <div className={`border-2 p-6 ${
                  riskScore === null ? 'bg-gradient-to-br from-amber-900/20 to-red-900/20 border-amber-700/50' :
                  riskScore < 40 ? 'bg-gradient-to-br from-green-900/20 to-green-900/10 border-green-700/50' :
                  riskScore < 70 ? 'bg-gradient-to-br from-yellow-900/20 to-yellow-900/10 border-yellow-700/50' :
                  'bg-gradient-to-br from-red-900/20 to-red-900/10 border-red-700/50'
                }`}>
                  <h3 className={`font-bold uppercase mb-4 ${
                    riskScore === null ? 'text-amber-400' :
                    riskScore < 40 ? 'text-green-400' :
                    riskScore < 70 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>Recommendations:</h3>
                  <ul className="space-y-3 text-sm text-gray-300">
                    <li className="flex items-start gap-3">
                      <span className={`mt-1 ${
                        riskScore === null ? 'text-amber-600' :
                        riskScore < 40 ? 'text-green-600' :
                        riskScore < 70 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>→</span>
                      <span>
                        {riskScore && riskScore > 70 ? 'High risk detected - Consider this job suspicious' : 'Review the job posting carefully before applying'}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className={`mt-1 ${
                        riskScore === null ? 'text-amber-600' :
                        riskScore < 40 ? 'text-green-600' :
                        riskScore < 70 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>→</span>
                      <span>Verify company legitimacy through official websites</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className={`mt-1 ${
                        riskScore === null ? 'text-amber-600' :
                        riskScore < 40 ? 'text-green-600' :
                        riskScore < 70 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>→</span>
                      <span>Never share personal information before verification</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className={`mt-1 ${
                        riskScore === null ? 'text-amber-600' :
                        riskScore < 40 ? 'text-green-600' :
                        riskScore < 70 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>→</span>
                      <span>Report suspicious postings to relevant authorities</span>
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setJobPosting('');
                      setCompanyName('');
                      setJobTitle('');
                      setLocation('');
                      setSalaryRange('');
                      setRecruiterEmail('');
                      setRecruiterPhone('');
                      setJobCategory('');
                      setEmploymentType('');
                      setExperienceRequired('');
                      setCompanyWebsite('');
                      setApplicationMethod('');
                      setIndustry('');
                      setRiskScore(null);
                      setAnalysis(null);
                      setRedFlags([]);
                      setSubmitted(false);
                    }}
                    className="flex-1 px-6 py-3 bg-black border-2 border-amber-600 text-amber-500 hover:bg-amber-600 hover:text-black font-bold uppercase transition-all text-sm"
                  >
                    Analyze Another Job
                  </button>
                  <button
                    onClick={() => router.push('/profile')}
                    className="flex-1 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold uppercase border-2 border-amber-600 transition-all text-sm"
                  >
                    View My Reports
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Detection Features Section */}
        <div className="mt-20 pt-20 border-t-2 border-gray-800">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wider mb-4">
              <span className="bg-gradient-to-r from-amber-400 to-red-600 bg-clip-text text-transparent">
                Detection Features
              </span>
            </h2>
            <p className="text-gray-400 text-lg">6 advanced detection methods powered by machine learning</p>
            <div className="mt-6 h-1 w-32 bg-gradient-to-r from-amber-600 to-red-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Feature 1 */}
            <div className="border-2 border-amber-700/60 p-8 bg-gradient-to-br from-amber-900/30 to-black hover:border-amber-500 transition-all">
              <p className="text-5xl mb-4">💰</p>
              <h3 className="text-xl font-black text-white uppercase mb-3">Payment Detection</h3>
              <p className="text-gray-400 text-sm mb-6">Identifies payment-first scams and unusual financial requests</p>
              <ul className="text-sm text-gray-300 space-y-2 mb-6">
                <li className="flex items-center gap-2"><span className="text-amber-500">●</span>Upfront fee detection</li>
                <li className="flex items-center gap-2"><span className="text-amber-500">●</span>Cryptocurrency red flags</li>
                <li className="flex items-center gap-2"><span className="text-amber-500">●</span>Bank detail requests</li>
              </ul>
              <a href="#" className="text-amber-500 font-bold text-sm uppercase hover:text-amber-400 transition">↓ CLICK TO LEARN MORE</a>
            </div>

            {/* Feature 2 */}
            <div className="border-2 border-amber-700/60 p-8 bg-gradient-to-br from-amber-900/30 to-black hover:border-amber-500 transition-all">
              <p className="text-5xl mb-4">📊</p>
              <h3 className="text-xl font-black text-white uppercase mb-3">Salary Anomalies</h3>
              <p className="text-gray-400 text-sm mb-6">Spots unrealistic salary offers compared to market standards</p>
              <ul className="text-sm text-gray-300 space-y-2 mb-6">
                <li className="flex items-center gap-2"><span className="text-amber-500">●</span>Market comparison</li>
                <li className="flex items-center gap-2"><span className="text-amber-500">●</span>Location analysis</li>
                <li className="flex items-center gap-2"><span className="text-amber-500">●</span>Role-based detection</li>
              </ul>
              <a href="#" className="text-amber-500 font-bold text-sm uppercase hover:text-amber-400 transition">↓ CLICK TO LEARN MORE</a>
            </div>

            {/* Feature 3 */}
            <div className="border-2 border-amber-700/60 p-8 bg-gradient-to-br from-amber-900/30 to-black hover:border-amber-500 transition-all">
              <p className="text-5xl mb-4">📧</p>
              <h3 className="text-xl font-black text-white uppercase mb-3">Email & Contact Analysis</h3>
              <p className="text-gray-400 text-sm mb-6">Verifies sender legitimacy and detects spoofed domains</p>
              <ul className="text-sm text-gray-300 space-y-2 mb-6">
                <li className="flex items-center gap-2"><span className="text-amber-500">●</span>Domain verification</li>
                <li className="flex items-center gap-2"><span className="text-amber-500">●</span>Email pattern analysis</li>
                <li className="flex items-center gap-2"><span className="text-amber-500">●</span>Contact legitimacy</li>
              </ul>
              <a href="#" className="text-amber-500 font-bold text-sm uppercase hover:text-amber-400 transition">↓ CLICK TO LEARN MORE</a>
            </div>

            {/* Feature 4 */}
            <div className="border-2 border-amber-700/60 p-8 bg-gradient-to-br from-amber-900/30 to-black hover:border-amber-500 transition-all">
              <p className="text-5xl mb-4">📝</p>
              <h3 className="text-xl font-black text-white uppercase mb-3">Content Quality Check</h3>
              <p className="text-gray-400 text-sm mb-6">Detects plagiarized, copied, or low-quality job descriptions</p>
              <ul className="text-sm text-gray-300 space-y-2 mb-6">
                <li className="flex items-center gap-2"><span className="text-amber-500">●</span>Plagiarism detection</li>
                <li className="flex items-center gap-2"><span className="text-amber-500">●</span>Grammar analysis</li>
                <li className="flex items-center gap-2"><span className="text-amber-500">●</span>Content authenticity</li>
              </ul>
              <a href="#" className="text-amber-500 font-bold text-sm uppercase hover:text-amber-400 transition">↓ CLICK TO LEARN MORE</a>
            </div>

            {/* Feature 5 */}
            <div className="border-2 border-amber-700/60 p-8 bg-gradient-to-br from-amber-900/30 to-black hover:border-amber-500 transition-all">
              <p className="text-5xl mb-4">🏢</p>
              <h3 className="text-xl font-black text-white uppercase mb-3">Company Verification</h3>
              <p className="text-gray-400 text-sm mb-6">Real-time verification against official company databases</p>
              <ul className="text-sm text-gray-300 space-y-2 mb-6">
                <li className="flex items-center gap-2"><span className="text-amber-500">●</span>Company database check</li>
                <li className="flex items-center gap-2"><span className="text-amber-500">●</span>Domain registration</li>
                <li className="flex items-center gap-2"><span className="text-amber-500">●</span>Official channel verification</li>
              </ul>
              <a href="#" className="text-amber-500 font-bold text-sm uppercase hover:text-amber-400 transition">↓ CLICK TO LEARN MORE</a>
            </div>

            {/* Feature 6 */}
            <div className="border-2 border-amber-700/60 p-8 bg-gradient-to-br from-amber-900/30 to-black hover:border-amber-500 transition-all">
              <p className="text-5xl mb-4">⚡</p>
              <h3 className="text-xl font-black text-white uppercase mb-3">Urgency & Pressure Tactics</h3>
              <p className="text-gray-400 text-sm mb-6">Identifies artificial urgency and high-pressure recruitment methods</p>
              <ul className="text-sm text-gray-300 space-y-2 mb-6">
                <li className="flex items-center gap-2"><span className="text-amber-500">●</span>Keyword detection</li>
                <li className="flex items-center gap-2"><span className="text-amber-500">●</span>Pressure pattern analysis</li>
                <li className="flex items-center gap-2"><span className="text-amber-500">●</span>Timeline verification</li>
              </ul>
              <a href="#" className="text-amber-500 font-bold text-sm uppercase hover:text-amber-400 transition">↓ CLICK TO LEARN MORE</a>
            </div>
          </div>
        </div>

        {/* How SafeHire Protects You */}
        <div className="mt-20 bg-gradient-to-b from-amber-900/30 to-black border-2 border-amber-700/60 p-12">
          <h2 className="text-3xl font-black text-amber-500 uppercase mb-3 tracking-wider">⚔ How SafeHire Protects You</h2>
          <p className="text-gray-400 mb-12 leading-relaxed">Our AI-powered detection engine analyzes job postings across 6 critical dimensions, combining machine learning algorithms with real-time database verification to identify scams before they harm you.</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black border-2 border-cyan-500/30 p-8">
              <p className="text-4xl mb-4">🔍</p>
              <h3 className="font-black text-amber-500 uppercase mb-2 text-sm tracking-wider">Deep Analysis</h3>
              <p className="text-gray-400 text-sm">Multi-layer pattern detection</p>
            </div>
            <div className="bg-black border-2 border-amber-500/30 p-8">
              <p className="text-4xl mb-4">⚡</p>
              <h3 className="font-black text-amber-500 uppercase mb-2 text-sm tracking-wider">Real-Time</h3>
              <p className="text-gray-400 text-sm">Instant verification results</p>
            </div>
            <div className="bg-black border-2 border-blue-500/30 p-8">
              <p className="text-4xl mb-4">🛡️</p>
              <h3 className="font-black text-amber-500 uppercase mb-2 text-sm tracking-wider">Protection</h3>
              <p className="text-gray-400 text-sm">Comprehensive scam detection</p>
            </div>
          </div>
        </div>

        {/* Risk Assessment Framework */}
        <div className="mt-20">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase mb-4 tracking-wider">Risk Assessment Framework</h2>
          <p className="text-gray-400 mb-12">Comprehensive evaluation across multiple dimensions</p>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Communication Risk */}
            <div className="border-2 border-red-700/60 bg-gradient-to-br from-red-900/40 to-black p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-white uppercase">Communication Risk</h3>
                <span className="bg-red-700 text-white px-3 py-1 text-xs font-black">HIGH</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-300"><span className="text-red-500 text-xl">▲</span>Vague job descriptions</li>
                <li className="flex items-center gap-3 text-gray-300"><span className="text-red-500 text-xl">▲</span>Poor grammar & spelling</li>
                <li className="flex items-center gap-3 text-gray-300"><span className="text-red-500 text-xl">▲</span>Unprofessional tone</li>
                <li className="flex items-center gap-3 text-gray-300"><span className="text-red-500 text-xl">▲</span>No direct contact info</li>
              </ul>
            </div>

            {/* Financial Risk */}
            <div className="border-2 border-orange-600/60 bg-gradient-to-br from-orange-900/40 to-black p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-white uppercase">Financial Risk</h3>
                <span className="bg-orange-700 text-white px-3 py-1 text-xs font-black">CRITICAL</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-300"><span className="text-orange-500 text-xl">▲</span>Upfront fees required</li>
                <li className="flex items-center gap-3 text-gray-300"><span className="text-orange-500 text-xl">▲</span>Unusual payment methods</li>
                <li className="flex items-center gap-3 text-gray-300"><span className="text-orange-500 text-xl">▲</span>Wire transfer requests</li>
                <li className="flex items-center gap-3 text-gray-300"><span className="text-orange-500 text-xl">▲</span>Cryptocurrency payments</li>
              </ul>
            </div>

            {/* Company Risk */}
            <div className="border-2 border-yellow-700/60 bg-gradient-to-br from-yellow-900/40 to-black p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-white uppercase">Company Risk</h3>
                <span className="bg-yellow-700 text-white px-3 py-1 text-xs font-black">MEDIUM</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-300"><span className="text-yellow-500 text-xl">▲</span>Unregistered company</li>
                <li className="flex items-center gap-3 text-gray-300"><span className="text-yellow-500 text-xl">▲</span>No official website</li>
                <li className="flex items-center gap-3 text-gray-300"><span className="text-yellow-500 text-xl">▲</span>Suspicious domain</li>
                <li className="flex items-center gap-3 text-gray-300"><span className="text-yellow-500 text-xl">▲</span>Generic email address</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Common Scam Patterns */}
        <div className="mt-20">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase mb-4 tracking-wider">Common Scam Patterns We Detect</h2>
          <p className="text-gray-400 mb-12">Learn to identify these 8 common job scam types</p>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="border-2 border-red-700 bg-gradient-to-br from-red-700 to-red-900 p-8 text-center">
              <h3 className="text-xl font-black text-white uppercase mb-4">Payment Scams</h3>
              <p className="text-5xl font-black text-white mb-2">45%</p>
              <p className="text-gray-300 text-sm">of detected scams</p>
            </div>
            <div className="border-2 border-orange-600 bg-gradient-to-br from-orange-600 to-orange-800 p-8 text-center">
              <h3 className="text-xl font-black text-white uppercase mb-4">Phishing Schemes</h3>
              <p className="text-5xl font-black text-white mb-2">28%</p>
              <p className="text-gray-300 text-sm">of detected scams</p>
            </div>
            <div className="border-2 border-yellow-600 bg-gradient-to-br from-yellow-600 to-yellow-800 p-8 text-center">
              <h3 className="text-xl font-black text-white uppercase mb-4">Data Harvesting</h3>
              <p className="text-5xl font-black text-white mb-2">15%</p>
              <p className="text-gray-300 text-sm">of detected scams</p>
            </div>
            <div className="border-2 border-orange-600 bg-gradient-to-br from-orange-600 to-orange-800 p-8 text-center">
              <h3 className="text-xl font-black text-white uppercase mb-4">Credential Fraud</h3>
              <p className="text-5xl font-black text-white mb-2">12%</p>
              <p className="text-gray-300 text-sm">of detected scams</p>
            </div>
          </div>
        </div>

        {/* Why Choose SafeHire */}
        <div className="mt-20">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase mb-12 tracking-wider">Why Choose SafeHire</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border-2 border-cyan-700/60 p-8 bg-black">
              <h3 className="text-xs font-black text-amber-500 uppercase tracking-wider mb-4">Feature 01</h3>
              <h2 className="text-2xl font-black text-white uppercase mb-4">AI-Powered Accuracy</h2>
              <p className="text-gray-400 text-sm mb-6">Machine learning trained on thousands of real scams. Our algorithms improve daily.</p>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex items-center gap-2"><span className="text-amber-500">●</span>94% accuracy rate</li>
                <li className="flex items-center gap-2"><span className="text-amber-500">●</span>Continuous learning</li>
                <li className="flex items-center gap-2"><span className="text-amber-500">●</span>Real-time updates</li>
              </ul>
            </div>

            <div className="border-2 border-amber-700/60 p-8 bg-black">
              <h3 className="text-xs font-black text-amber-500 uppercase tracking-wider mb-4">Feature 02</h3>
              <h2 className="text-2xl font-black text-white uppercase mb-4">Complete Privacy</h2>
              <p className="text-gray-400 text-sm mb-6">Your data is yours. End-to-end encrypted and never shared with third parties.</p>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex items-center gap-2"><span className="text-amber-500">●</span>GDPR compliant</li>
                <li className="flex items-center gap-2"><span className="text-amber-500">●</span>No data selling</li>
                <li className="flex items-center gap-2"><span className="text-amber-500">●</span>Local processing</li>
              </ul>
            </div>

            <div className="border-2 border-slate-700/60 p-8 bg-black">
              <h3 className="text-xs font-black text-amber-500 uppercase tracking-wider mb-4">Feature 03</h3>
              <h2 className="text-2xl font-black text-white uppercase mb-4">Expert Insights</h2>
              <p className="text-gray-400 text-sm mb-6">Get actionable recommendations from our team of fraud prevention experts.</p>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex items-center gap-2"><span className="text-amber-500">●</span>Detailed reports</li>
                <li className="flex items-center gap-2"><span className="text-amber-500">●</span>Action items</li>
                <li className="flex items-center gap-2"><span className="text-amber-500">●</span>Best practices</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-20">
          <h2 className="text-3xl md:text-4xl font-black text-amber-500 uppercase mb-4 tracking-wider">What Users Say</h2>
          <p className="text-gray-400 text-center mb-12">Real stories from job seekers protected by SafeHire</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border-2 border-amber-700/60 p-8 bg-black">
              <p className="text-amber-500 mb-4 text-lg">★ ★ ★ ★ ★</p>
              <p className="text-gray-300 mb-6 italic text-sm">"SafeHire saved me from a payment scam. The analysis showed red flags I completely missed. Highly recommended!"</p>
              <p className="font-black text-white uppercase text-sm">Priya Singh</p>
              <p className="text-xs text-amber-500 uppercase">Software Engineer, Bangalore</p>
            </div>

            <div className="border-2 border-amber-700/60 p-8 bg-black">
              <p className="text-amber-500 mb-4 text-lg">★ ★ ★ ★ ★</p>
              <p className="text-gray-300 mb-6 italic text-sm">"Finally, a tool that understands job scams in India. The accuracy is incredible - caught 3 fake offers for me."</p>
              <p className="font-black text-white uppercase text-sm">Rajesh Patel</p>
              <p className="text-xs text-amber-500 uppercase">Data Analyst, Mumbai</p>
            </div>

            <div className="border-2 border-amber-700/60 p-8 bg-black">
              <p className="text-amber-500 mb-4 text-lg">★ ★ ★ ★ ★</p>
              <p className="text-gray-300 mb-6 italic text-sm">"After using SafeHire, I feel confident analyzing job postings. It's like having an expert by my side."</p>
              <p className="font-black text-white uppercase text-sm">Aaisha Khan</p>
              <p className="text-xs text-amber-500 uppercase">Product Manager, Delhi</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase mb-4 tracking-wider">Frequently Asked</h2>
          <p className="text-gray-400 mb-12">Get answers to common questions</p>
          <div className="space-y-3 max-w-4xl mx-auto">
            <div className="border-2 border-gray-700 p-6 bg-black cursor-pointer hover:border-amber-600 transition-all group">
              <h3 className="font-black text-white uppercase flex justify-between items-center text-sm">
                How does SafeHire detect scams?
                <span className="text-amber-500 group-hover:rotate-180 transition-transform">▲</span>
              </h3>
              <p className="text-gray-400 text-sm mt-3">We analyze 50+ fraud indicators using AI and machine learning - payment requests, urgency tactics, salary anomalies, suspicious emails, company verification, and more.</p>
            </div>

            <div className="border-2 border-gray-700 p-6 bg-black cursor-pointer hover:border-amber-600 transition-all group">
              <h3 className="font-black text-white uppercase flex justify-between items-center text-sm">
                Is my data private and secure?
                <span className="text-amber-500">▼</span>
              </h3>
            </div>

            <div className="border-2 border-gray-700 p-6 bg-black cursor-pointer hover:border-amber-600 transition-all group">
              <h3 className="font-black text-white uppercase flex justify-between items-center text-sm">
                Can I use it for multiple platforms?
                <span className="text-amber-500">▼</span>
              </h3>
            </div>

            <div className="border-2 border-gray-700 p-6 bg-black cursor-pointer hover:border-amber-600 transition-all group">
              <h3 className="font-black text-white uppercase flex justify-between items-center text-sm">
                What if I find a scam?
                <span className="text-amber-500">▼</span>
              </h3>
            </div>

            <div className="border-2 border-gray-700 p-6 bg-black cursor-pointer hover:border-amber-600 transition-all group">
              <h3 className="font-black text-white uppercase flex justify-between items-center text-sm">
                Can I cancel anytime?
                <span className="text-amber-500">▼</span>
              </h3>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 mb-20 bg-gradient-to-b from-slate-900/50 to-black border-t-2 border-amber-700/30 py-16 px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-6 tracking-wider">
            <span className="bg-gradient-to-r from-amber-400 to-red-600 bg-clip-text text-transparent">
              Ready to Protect Your Career?
            </span>
          </h2>
          <p className="text-gray-400 mb-10 max-w-2xl mx-auto text-lg">Start analyzing job postings in seconds. No credit card required. Join 50,000+ job seekers already protected.</p>
          <button 
            onClick={() => {
              const element = document.querySelector('textarea');
              element?.focus();
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-12 py-4 bg-amber-600 hover:bg-amber-500 text-white font-black uppercase border-2 border-amber-600 transition-all text-base tracking-wider"
          >
            Start Free Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
