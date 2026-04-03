'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JobAnalyzerForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [useMl, setUseMl] = useState(true);
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    jobDescription: '',
    recruiterEmail: '',
    recruiterPhone: '',
    salary: '',
    postingUrl: '',
    location: '',
    jobCategory: '',
    employmentType: '',
    experienceRequired: '',
    companyWebsite: '',
    applicationMethod: '',
    industry: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use ML service if available, otherwise fallback to rule-based
      const endpoint = useMl ? '/api/jobs/analyze-ml' : '/api/jobs/analyze';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Store analysis result and redirect
        sessionStorage.setItem('lastAnalysis', JSON.stringify(result.data));
        router.push(`/dashboard?analysisId=${result.data.id}`);
      } else {
        alert('Analysis failed: ' + result.error);
      }
    } catch (error) {
      console.error(error);
      alert('Error analyzing job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={useMl}
            onChange={(e) => setUseMl(e.target.checked)}
            className="w-5 h-5 text-indigo-600 rounded"
          />
          <span className="text-sm font-medium text-slate-700">
            🤖 Use Advanced ML Analysis (Recommended)
          </span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Job Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          placeholder="e.g., Senior Software Engineer"
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="e.g., Microsoft India Pvt Ltd"
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Job Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="jobDescription"
          value={formData.jobDescription}
          onChange={handleChange}
          placeholder="Paste the complete job description here..."
          rows={6}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
          required
        />
        <p className="text-xs text-slate-500 mt-1">
          {formData.jobDescription.length} characters
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Recruiter Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="recruiterEmail"
            value={formData.recruiterEmail}
            onChange={handleChange}
            placeholder="recruiter@company.com"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            name="recruiterPhone"
            value={formData.recruiterPhone}
            onChange={handleChange}
            placeholder="+91 XXXX XXXXXX"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Salary (Optional)
          </label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="₹50,000/month or $2,000/month"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Location (Optional)
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Bangalore, Mumbai, Remote"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Job Category (Optional)
          </label>
          <select
            name="jobCategory"
            value={formData.jobCategory}
            onChange={(e) => setFormData({...formData, jobCategory: e.target.value})}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
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
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Employment Type (Optional)
          </label>
          <select
            name="employmentType"
            value={formData.employmentType}
            onChange={(e) => setFormData({...formData, employmentType: e.target.value})}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          >
            <option value="">Select Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Years of Experience Required (Optional)
          </label>
          <input
            type="text"
            name="experienceRequired"
            value={formData.experienceRequired}
            onChange={handleChange}
            placeholder="e.g., 2-5 years"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Company Website (Optional)
          </label>
          <input
            type="url"
            name="companyWebsite"
            value={formData.companyWebsite}
            onChange={handleChange}
            placeholder="https://company.com"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Posting URL (Optional)
          </label>
          <input
            type="url"
            name="postingUrl"
            value={formData.postingUrl}
            onChange={handleChange}
            placeholder="https://linkedin.com/jobs/..."
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Application Method (Optional)
          </label>
          <input
            type="text"
            name="applicationMethod"
            value={formData.applicationMethod}
            onChange={handleChange}
            placeholder="e.g., Email, LinkedIn, Company Website"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Industry/Sector (Optional)
        </label>
        <input
          type="text"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          placeholder="e.g., Technology, Finance, Retail, Healthcare"
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 active:scale-95 shadow-lg"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⚙️</span>
            {useMl ? 'ML Analysis in Progress...' : 'Analyzing...'}
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            🔍 Analyze Job Posting
          </span>
        )}
      </button>

      {/* Info box */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-sm text-indigo-900">
        <p className="font-semibold mb-2">💡 Pro Tips:</p>
        <ul className="space-y-1 text-xs">
          <li>✓ Include full job description for accurate analysis</li>
          <li>✓ ML analysis provides higher accuracy (87%+)</li>
          <li>✓ Check recruiter email domain matches company</li>
          <li>✓ Never share personal info before verification</li>
        </ul>
      </div>
    </form>
  );
}
