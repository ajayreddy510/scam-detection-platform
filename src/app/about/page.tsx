'use client';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 via-black to-black pt-20 pb-20">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600 rounded-full mix-blend-screen filter blur-3xl"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600 rounded-full mix-blend-screen filter blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-7xl md:text-8xl font-black mb-8 leading-tight uppercase tracking-wider">
            <span className="text-white">Our Mission:</span>
            <br />
            <span className="bg-gradient-to-r from-amber-500 via-red-600 to-amber-600 bg-clip-text text-transparent">
              Protect Job Seekers
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light">
            SafeHire was created to combate job scams targeting Indian job seekers. We believe everyone deserves a safe, fraud-free job search experience.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4 bg-black border-b-2 border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-wider mb-12 text-center">
            Our Story
          </h2>

          <div className="space-y-8 text-lg text-gray-300 leading-relaxed">
            <p>
              SafeHire was founded in 2024 by a team of security researchers and tech professionals who witnessed firsthand the rise of job scams targeting job seekers in India. What started as a personal frustration evolved into a mission to protect thousands of people.
            </p>

            <p>
              During research on cybercrime trends, our founders discovered that over 50,000 fraudulent job postings were circulating on major job portals every month. Victims lost ₹2.5+ crores annually to these scams. Yet, most job seekers had no way to protect themselves.
            </p>

            <p>
              We knew we had to build something. Using advanced AI and machine learning, we created SafeHire - a platform that analyzes job postings in seconds and identifies fraud indicators that would take hours to spot manually.
            </p>

            <p>
              Today, SafeHire protects 50,000+ job seekers across India with 94% accuracy in fraud detection. Our mission remains simple: make job searching safe, secure, and fraud-free for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 bg-gradient-to-b from-black via-slate-900/20 to-black border-b-2 border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-wider mb-16 text-center">
            Our Values
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: '🛡️',
                title: 'Security First',
                desc: 'Your data is protected with encryption and never shared with third parties.',
              },
              {
                icon: '🤝',
                title: 'Trust & Transparency',
                desc: 'We explain exactly why a job is flagged as risky. No black box algorithms.',
              },
              {
                icon: '🚀',
                title: 'Innovation',
                desc: 'Continuously improving our AI to catch new scam patterns and fraud tactics.',
              },
              {
                icon: '💙',
                title: 'Mission-Driven',
                desc: 'We exist to protect job seekers, not to maximize profits. Your safety comes first.',
              },
            ].map((value, idx) => (
              <div key={idx} className="bg-black border-2 border-amber-700/30 p-8 hover:border-amber-600 transition-all text-center">
                <div className="text-6xl mb-4">{value.icon}</div>
                <h3 className="text-2xl font-black uppercase text-white mb-3">{value.title}</h3>
                <p className="text-gray-300">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Stats */}
      <section className="py-20 px-4 bg-black border-b-2 border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-wider mb-16 text-center">
            By The Numbers
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { number: '2024', label: 'Founded' },
              { number: '15+', label: 'Team Members' },
              { number: '50K+', label: 'Users Protected' },
              { number: '₹2.5Cr+', label: 'Fraud Prevented' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-gradient-to-br from-amber-900/20 to-red-900/20 border-2 border-amber-700/50 p-8 text-center">
                <div className="text-5xl font-black text-amber-500 mb-2">{stat.number}</div>
                <div className="text-gray-400 font-bold uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-slate-900/30 border-b-2 border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-wider mb-16 text-center">
            Why Choose SafeHire?
          </h2>

          <div className="space-y-6">
            {[
              {
                title: '🎯 Accuracy You Can Trust',
                desc: '94% detection rate with zero false positives. We are constantly learning and improving.',
              },
              {
                title: '⚡ Instant Analysis',
                desc: 'Get risk assessment in under 2 seconds. No waiting. No complications.',
              },
              {
                title: '🔒 Privacy Guaranteed',
                desc: '100% encrypted. Your job search preferences and analysis history stay private.',
              },
              {
                title: '🌟 Made For India',
                desc: 'Built specifically for Indian job platforms and fraud patterns. Not a generic solution.',
              },
              {
                title: '💰 Always Free Option',
                desc: 'Start protecting yourself with our free tier. No credit card required ever.',
              },
              {
                title: '🤝 Community Driven',
                desc: 'Help other job seekers by reporting scams. Our database grows with every report.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-black border-2 border-gray-800 hover:border-amber-600 p-8 transition-all flex gap-6">
                <div className="flex-shrink-0 text-4xl">{item.title.split(' ')[0]}</div>
                <div>
                  <h3 className="text-xl font-black uppercase text-white mb-2">{item.title.substring(2)}</h3>
                  <p className="text-gray-300">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl md:text-7xl font-black uppercase tracking-wider mb-8">
            <span className="bg-gradient-to-r from-amber-500 via-red-600 to-amber-600 bg-clip-text text-transparent">
              Join Our Mission
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Help us protect job seekers across India. Start your free analysis today.
          </p>
          <button
            onClick={() => window.location.href = '/auth/register'}
            className="px-12 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold text-lg uppercase tracking-wider border-2 border-amber-600 transition-all"
          >
            Start Free Analysis
          </button>
        </div>
      </section>
    </div>
  );
}
