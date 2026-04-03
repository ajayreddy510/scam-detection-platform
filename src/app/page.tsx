'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [activeFAQ, setActiveFAQ] = useState<number | null>(0);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 via-black to-black pt-20 pb-10">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600 rounded-full mix-blend-screen filter blur-3xl"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600 rounded-full mix-blend-screen filter blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-8 leading-tight uppercase tracking-wider">
            <span className="text-white">Protect Your Career from</span>
            <br />
            <span className="bg-gradient-to-r from-amber-500 via-red-600 to-amber-600 bg-clip-text text-transparent">
              Job Scams
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Advanced AI-powered fraud detection system protecting over 50,000 Indian job seekers. Analyze job postings in seconds and avoid costly scams with 94% accuracy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => router.push('/auth/register')}
                  className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm uppercase tracking-wider transition-all border-2 border-amber-600"
                >
                  Start Free Analysis
                </button>
                <button
                  onClick={() => router.push('/auth/login')}
                  className="px-8 py-3 border-2 border-amber-600 text-amber-500 hover:bg-amber-600 hover:text-white font-bold text-sm uppercase tracking-wider transition-all"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm uppercase tracking-wider transition-all border-2 border-amber-600"
                >
                  Go To Dashboard
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* How It Works - Interactive Process */}
      <section className="py-8 px-4 bg-black border-b-2 border-gray-800" id="how-it-works">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider mb-4 text-center">
            How SafeHire Works
          </h2>
          <p className="text-center text-gray-400 text-sm mb-12">4-step process to identify scams in seconds</p>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { 
                step: '01',
                title: 'Paste Job Posting',
                desc: 'Copy and paste the job description from any platform',
                details: ['Support all job platforms', 'Any job category', 'No account needed']
              },
              { 
                step: '02',
                title: 'Add Context Details',
                desc: 'Include basic company and position information',
                details: ['Company name', 'Location', 'Salary range']
              },
              {
                step: '03',
                title: 'AI Analyzes Data',
                desc: 'Our ML model scans 50+ fraud indicators',
                details: ['Real-time processing', 'ML algorithms', 'Pattern matching']
              },
              {
                step: '04',
                title: 'Get Risk Score',
                desc: 'Detailed report with red flags and recommendations',
                details: ['Severity levels', 'Detailed insights', 'Action items']
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-black border-2 border-amber-700/30 p-6 hover:border-amber-600 transition-all h-full flex flex-col">
                  <div className="flex-1">
                    <div className="text-3xl font-black text-amber-500 mb-3">{item.step}</div>
                    <h3 className="text-lg font-black uppercase mb-2 text-white">{item.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{item.desc}</p>
                    <ul className="space-y-1 text-xs text-gray-500">
                      {item.details.map((detail, didx) => (
                        <li key={didx} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => router.push(isAuthenticated ? '/analyze' : '/auth/login')}
                    className="mt-6 w-full px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider border-2 border-amber-600 transition-all"
                  >
                    {isAuthenticated ? 'Start Here' : 'Sign In'}
                  </button>
                </div>
                {idx < 3 && (
                  <div className="hidden md:flex absolute -right-3 top-1/3 text-xl font-black text-amber-600">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => router.push(isAuthenticated ? '/analyze' : '/auth/register')}
              className="px-10 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm uppercase tracking-wider border-2 border-amber-600 transition-all"
            >
              {isAuthenticated ? 'Analyze a Job Now' : 'Create Account & Analyze'}
            </button>
          </div>
        </div>
      </section>

      {/* Advanced Detection Features */}
      <section className="py-24 px-4 bg-black border-b-2 border-amber-700" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-wider mb-6">
              <span className="bg-gradient-to-r from-amber-500 via-red-600 to-amber-600 bg-clip-text text-transparent">
                Detection Features
              </span>
            </h2>
            <p className="text-gray-400 text-lg">6 advanced detection methods powered by machine learning</p>
            <div className="mt-6 h-1 w-32 bg-gradient-to-r from-amber-600 to-red-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: 'Payment Detection',
                icon: '💰',
                desc: 'Identifies payment-first scams and unusual financial requests',
                methods: ['Upfront fee detection', 'Cryptocurrency red flags', 'Bank detail requests'],
                color: 'from-red-900/20 to-amber-900/20',
                borderColor: 'border-red-700/50',
                details: 'This detection method specifically looks for red flags related to financial requests before or during the hiring process. Legitimate companies never ask for upfront fees, cryptocurrency payments, or bank details.'
              },
              { 
                title: 'Salary Anomalies',
                icon: '📊',
                desc: 'Spots unrealistic salary offers compared to market standards',
                methods: ['Market comparison', 'Location analysis', 'Role-based detection'],
                color: 'from-amber-900/20 to-yellow-900/20',
                borderColor: 'border-amber-700/50',
                details: 'Compare offered salaries against industry benchmarks for your location and job role. Unusually high offers for simple work are often scam indicators.'
              },
              { 
                title: 'Email & Contact Analysis',
                icon: '📧',
                desc: 'Verifies sender legitimacy and detects spoofed domains',
                methods: ['Domain verification', 'Email pattern analysis', 'Contact legitimacy'],
                color: 'from-orange-900/20 to-red-900/20',
                borderColor: 'border-orange-700/50',
                details: 'Validates email addresses against official company domains and checks for common phishing tactics like slight misspellings or free email services.'
              },
              { 
                title: 'Content Quality Check',
                icon: '📝',
                desc: 'Detects plagiarized, copied, or low-quality job descriptions',
                methods: ['Plagiarism detection', 'Grammar analysis', 'Content authenticity'],
                color: 'from-yellow-900/20 to-amber-900/20',
                borderColor: 'border-yellow-700/50',
                details: 'Analyzes job descriptions for copied content, poor English, generic templates, and lack of specific details about the role and responsibilities.'
              },
              { 
                title: 'Company Verification',
                icon: '🏢',
                desc: 'Real-time verification against official company databases',
                methods: ['Company database check', 'Domain registration', 'Official channel verification'],
                color: 'from-amber-900/20 to-orange-900/20',
                borderColor: 'border-amber-700/50',
                details: 'Cross-references company information against official business registries, domain registration databases, and verified company contacts.'
              },
              { 
                title: 'Urgency & Pressure Tactics',
                icon: '⚡',
                desc: 'Identifies artificial urgency and high-pressure recruitment methods',
                methods: ['Keyword detection', 'Pressure pattern analysis', 'Timeline verification'],
                color: 'from-red-900/20 to-amber-900/20',
                borderColor: 'border-red-700/50',
                details: 'Detects manipulative language patterns like "Limited spots available", "Immediate response needed", or artificial deadlines designed to rush job seekers.'
              },
            ].map((feature, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedFeature(idx)}
                className={`bg-gradient-to-br ${feature.color} backdrop-blur-sm border-2 ${feature.borderColor} hover:border-amber-600 p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-600/20 group cursor-pointer transform hover:scale-105 text-left`}
              >
                {/* Icon */}
                <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">{feature.icon}</div>
                
                {/* Title */}
                <h3 className="text-xl font-black uppercase text-white mb-3 tracking-wider group-hover:text-amber-400 transition-colors">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">{feature.desc}</p>
                
                {/* Methods */}
                <div className="space-y-2">
                  {feature.methods.map((method, midx) => (
                    <div 
                      key={midx} 
                      className="flex items-center gap-3 text-gray-300 text-xs group-hover:text-amber-200 transition-colors"
                    >
                      <span className="w-2 h-2 bg-amber-600 group-hover:bg-amber-400 transition-colors rounded-full"></span>
                      <span className="uppercase tracking-wide">{method}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom accent line */}
                <div className="mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r from-amber-600 to-red-600 transition-all duration-300"></div>
                
                {/* Click indicator */}
                <div className="mt-4 text-xs text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  ↓ CLICK TO LEARN MORE
                </div>
              </button>
            ))}
          </div>

          {/* Features Summary */}
          <div className="mt-20 p-8 bg-gradient-to-r from-amber-900/30 to-red-900/30 border-2 border-amber-700/50">
            <h3 className="text-2xl font-black uppercase text-amber-400 mb-4 tracking-wider">
              ⚔ How SafeHire Protects You
            </h3>
            <p className="text-gray-300 mb-6">
              Our AI-powered detection engine analyzes job postings across 6 critical dimensions, combining machine learning algorithms with real-time database verification to identify scams before they harm you.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔍</span>
                <div>
                  <p className="font-bold text-amber-400 uppercase text-sm">Deep Analysis</p>
                  <p className="text-xs text-gray-400">Multi-layer pattern detection</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">⚡</span>
                <div>
                  <p className="font-bold text-amber-400 uppercase text-sm">Real-Time</p>
                  <p className="text-xs text-gray-400">Instant verification results</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">🛡️</span>
                <div>
                  <p className="font-bold text-amber-400 uppercase text-sm">Protection</p>
                  <p className="text-xs text-gray-400">Comprehensive scam detection</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Modal */}
        {selectedFeature !== null && (() => {
          const features = [
            { 
              title: 'Payment Detection',
              icon: '💰',
              desc: 'Identifies payment-first scams and unusual financial requests',
              methods: ['Upfront fee detection', 'Cryptocurrency red flags', 'Bank detail requests'],
              details: 'This detection method specifically looks for red flags related to financial requests before or during the hiring process. Legitimate companies never ask for upfront fees, cryptocurrency payments, or bank details.'
            },
            { 
              title: 'Salary Anomalies',
              icon: '📊',
              desc: 'Spots unrealistic salary offers compared to market standards',
              methods: ['Market comparison', 'Location analysis', 'Role-based detection'],
              details: 'Compare offered salaries against industry benchmarks for your location and job role. Unusually high offers for simple work are often scam indicators.'
            },
            { 
              title: 'Email & Contact Analysis',
              icon: '📧',
              desc: 'Verifies sender legitimacy and detects spoofed domains',
              methods: ['Domain verification', 'Email pattern analysis', 'Contact legitimacy'],
              details: 'Validates email addresses against official company domains and checks for common phishing tactics like slight misspellings or free email services.'
            },
            { 
              title: 'Content Quality Check',
              icon: '📝',
              desc: 'Detects plagiarized, copied, or low-quality job descriptions',
              methods: ['Plagiarism detection', 'Grammar analysis', 'Content authenticity'],
              details: 'Analyzes job descriptions for copied content, poor English, generic templates, and lack of specific details about the role and responsibilities.'
            },
            { 
              title: 'Company Verification',
              icon: '🏢',
              desc: 'Real-time verification against official company databases',
              methods: ['Company database check', 'Domain registration', 'Official channel verification'],
              details: 'Cross-references company information against official business registries, domain registration databases, and verified company contacts.'
            },
            { 
              title: 'Urgency & Pressure Tactics',
              icon: '⚡',
              desc: 'Identifies artificial urgency and high-pressure recruitment methods',
              methods: ['Keyword detection', 'Pressure pattern analysis', 'Timeline verification'],
              details: 'Detects manipulative language patterns like "Limited spots available", "Immediate response needed", or artificial deadlines designed to rush job seekers.'
            },
          ];
          const feature = features[selectedFeature];

          return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedFeature(null)}>
              <div 
                className="bg-gradient-to-br from-slate-900 to-black border-2 border-amber-700 p-8 max-w-2xl w-full max-h-96 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{feature.icon}</span>
                    <h3 className="text-3xl font-black uppercase text-amber-400 tracking-wider">{feature.title}</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedFeature(null)}
                    className="text-3xl text-amber-400 hover:text-red-600 transition-colors flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed">{feature.details}</p>
                
                <h4 className="text-lg font-bold text-amber-400 mb-3 uppercase">Detection Methods:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {feature.methods.map((method, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-gray-300">
                      <span className="text-amber-600">✓</span>
                      <span>{method}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* Risk Analysis Framework */}
      <section className="py-16 px-4 bg-black border-b-2 border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider mb-4 text-center">
            Risk Assessment Framework
          </h2>
          <p className="text-center text-gray-400 text-sm mb-12">Comprehensive evaluation across multiple dimensions</p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                category: 'Communication Risk',
                level: 'HIGH',
                indicators: ['Vague job descriptions', 'Poor grammar & spelling', 'Unprofessional tone', 'No direct contact info'],
                color: 'from-red-900 to-red-800'
              },
              {
                category: 'Financial Risk',
                level: 'CRITICAL',
                indicators: ['Upfront fees required', 'Unusual payment methods', 'Wire transfer requests', 'Cryptocurrency payments'],
                color: 'from-amber-900 to-amber-800'
              },
              {
                category: 'Company Risk',
                level: 'MEDIUM',
                indicators: ['Unregistered company', 'No official website', 'Suspicious domain', 'Generic email address'],
                color: 'from-yellow-900 to-yellow-800'
              },
            ].map((risk, idx) => (
              <div key={idx} className={`bg-gradient-to-br ${risk.color} border-2 border-gray-700 p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black uppercase text-white">{risk.category}</h3>
                  <span className="text-xs font-bold text-white px-3 py-1 bg-red-900/50 border border-red-600 rounded">
                    {risk.level}
                  </span>
                </div>
                <ul className="space-y-2">
                  {risk.indicators.map((indicator, iidx) => (
                    <li key={iidx} className="text-gray-200 text-sm flex items-start">
                      <span className="text-red-400 mr-3 font-bold">⚠</span>
                      <span>{indicator}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scam Categories & Protection */}
      <section className="py-16 px-4 bg-gradient-to-b from-black via-slate-900/10 to-black border-b-2 border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider mb-4 text-center">
            Common Scam Patterns We Detect
          </h2>
          <p className="text-center text-gray-400 text-sm mb-12">Learn to identify these 8 common job scam types</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Payment Scams', victims: '45%', color: 'from-red-600 to-red-700' },
              { name: 'Phishing Schemes', victims: '28%', color: 'from-orange-600 to-orange-700' },
              { name: 'Data Harvesting', victims: '15%', color: 'from-yellow-600 to-yellow-700' },
              { name: 'Credential Fraud', victims: '12%', color: 'from-amber-600 to-amber-700' },
            ].map((scam, idx) => (
              <div key={idx} className={`bg-gradient-to-br ${scam.color} border-2 border-gray-700 p-5 text-center hover:border-gray-500 transition-all`}>
                <h3 className="text-sm font-black uppercase text-white mb-2">{scam.name}</h3>
                <p className="text-2xl font-black text-white">{scam.victims}</p>
                <p className="text-xs text-gray-200 mt-2">of detected scams</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step Into Protection Feature Cards */}
      <section className="py-16 px-4 bg-black border-b-2 border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider mb-12 text-center">
            Why Choose SafeHire
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                number: '01',
                title: 'AI-Powered Accuracy',
                desc: 'Machine learning trained on thousands of real scams. Our algorithms improve daily.',
                features: ['94% accuracy rate', 'Continuous learning', 'Real-time updates']
              },
              {
                number: '02',
                title: 'Complete Privacy',
                desc: 'Your data is yours. End-to-end encrypted and never shared with third parties.',
                features: ['GDPR compliant', 'No data selling', 'Local processing']
              },
              {
                number: '03',
                title: 'Expert Insights',
                desc: 'Get actionable recommendations from our team of fraud prevention experts.',
                features: ['Detailed reports', 'Action items', 'Best practices']
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-900/50 border-2 border-gray-800 hover:border-amber-600 transition-all p-8">
                <div className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-2">
                  FEATURE {item.number}
                </div>
                <h3 className="text-lg font-black uppercase mb-3 text-white">{item.title}</h3>
                <p className="text-gray-300 text-sm mb-5">{item.desc}</p>
                <ul className="space-y-2">
                  {item.features.map((feature, fidx) => (
                    <li key={fidx} className="text-gray-400 text-xs flex items-center">
                      <span className="w-1 h-1 bg-amber-500 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-black to-slate-900/30 border-b-2 border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider mb-4 text-center">
            <span className="bg-gradient-to-r from-amber-500 via-red-600 to-amber-600 bg-clip-text text-transparent">
              What Users Say
            </span>
          </h2>
          <p className="text-center text-gray-400 text-sm mb-12">Real stories from job seekers protected by SafeHire</p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Priya Singh',
                role: 'Software Engineer, Bangalore',
                quote: 'SafeHire saved me from a payment scam. The analysis showed red flags I completely missed. Highly recommended!',
                rating: 5,
              },
              {
                name: 'Rajesh Patel',
                role: 'Data Analyst, Mumbai',
                quote: 'Finally, a tool that understands job scams in India. The accuracy is incredible - caught 3 fake offers for me.',
                rating: 5,
              },
              {
                name: 'Aaisha Khan',
                role: 'Product Manager, Delhi',
                quote: 'After using SafeHire, I feel confident analyzing job postings. It\'s like having an expert by my side.',
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-black border-2 border-amber-700/50 p-6 hover:border-amber-600 transition-all">
                <div className="flex items-center gap-1 mb-4">
                  {Array(testimonial.rating).fill('⭐').join('')}
                </div>
                <p className="text-gray-300 mb-6 italic text-sm">"{testimonial.quote}"</p>
                <div>
                  <p className="text-white font-bold uppercase tracking-wider text-sm">{testimonial.name}</p>
                  <p className="text-amber-500 text-xs font-bold uppercase tracking-wider">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-black border-b-2 border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider mb-4 text-center">
            Frequently Asked
          </h2>
          <p className="text-center text-gray-400 text-sm mb-12">Get answers to common questions</p>

          <div className="space-y-3">
            {[
              {
                q: 'How does SafeHire detect scams?',
                a: 'We analyze 50+ fraud indicators using AI and machine learning - payment requests, urgency tactics, salary anomalies, suspicious emails, company verification, and more.',
              },
              {
                q: 'Is my data private and secure?',
                a: '100% private and encrypted. We never share your data with third parties. You control what gets stored in your account. GDPR compliant.',
              },
              {
                q: 'Can I use it for multiple platforms?',
                a: 'Yes! Works with LinkedIn, Indeed, Naukri, Glassdoor, or any platform. Just paste the job description.',
              },
              {
                q: 'What if I find a scam?',
                a: 'Report it through our platform. We add verified scams to our database to protect other users and improve our detection algorithms.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. No contracts. Cancel your subscription anytime with one click. No questions asked.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="border-2 border-gray-800 bg-black hover:border-amber-600 transition-all">
                <button
                  onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
                  className="w-full px-5 py-4 text-left font-bold text-white uppercase tracking-wider flex items-center justify-between text-sm"
                >
                  <span>{faq.q}</span>
                  <span className={`transition-transform ${activeFAQ === idx ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {activeFAQ === idx && (
                  <div className="px-5 py-4 bg-gray-900/50 border-t-2 border-gray-800 text-gray-300 text-sm">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black border-b-2 border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-wider mb-6">
            <span className="bg-gradient-to-r from-amber-500 via-red-600 to-amber-600 bg-clip-text text-transparent">
              Ready to Protect Your Career?
            </span>
          </h2>
          <p className="text-lg text-gray-300 mb-10">
            Start analyzing job postings in seconds. No credit card required. Join 50,000+ job seekers already protected.
          </p>
          <button
            onClick={() => router.push(isAuthenticated ? '/dashboard' : '/auth/register')}
            className="px-10 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm uppercase tracking-wider border-2 border-amber-600 transition-all"
          >
            {isAuthenticated ? 'Open Dashboard' : 'Start Free Analysis'}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t-2 border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-black uppercase tracking-wider text-sm mb-4">Platform</h3>
            <ul className="space-y-2 text-gray-400 text-xs">
              <li><a href="#how-it-works" className="hover:text-amber-500 transition">How It Works</a></li>
              <li><a href="#features" className="hover:text-amber-500 transition">Features</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-black uppercase tracking-wider text-sm mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400 text-xs">
              <li><a href="/about" className="hover:text-amber-500 transition">About Us</a></li>
              <li><a href="/contact" className="hover:text-amber-500 transition">Contact</a></li>
              <li><a href="#" className="hover:text-amber-500 transition">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-black uppercase tracking-wider text-sm mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400 text-xs">
              <li><a href="#" className="hover:text-amber-500 transition">Help Center</a></li>
              <li><a href="#" className="hover:text-amber-500 transition">Safety Tips</a></li>
              <li><a href="#" className="hover:text-amber-500 transition">Scam Report</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-black uppercase tracking-wider text-sm mb-4">Follow</h3>
            <ul className="space-y-2 text-gray-400 text-xs">
              <li><a href="#" className="hover:text-amber-500 transition">Twitter</a></li>
              <li><a href="#" className="hover:text-amber-500 transition">LinkedIn</a></li>
              <li><a href="#" className="hover:text-amber-500 transition">Instagram</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t-2 border-gray-800 pt-6 text-center text-gray-500 text-xs">
          <p className="mb-2">© 2026 SafeHire. All Rights Reserved.</p>
          <p>
            <a href="#" className="hover:text-amber-500 transition">Terms & Conditions</a>
            <span className="mx-2">•</span>
            <a href="#" className="hover:text-amber-500 transition">Privacy Policy</a>
            <span className="mx-2">•</span>
            <a href="#" className="hover:text-amber-500 transition">Cookie Settings</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
