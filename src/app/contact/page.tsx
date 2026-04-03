'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 via-black to-black pt-20 pb-20">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600 rounded-full mix-blend-screen filter blur-3xl"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600 rounded-full mix-blend-screen filter blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-7xl md:text-8xl font-black mb-8 leading-tight uppercase tracking-wider">
            <span className="bg-gradient-to-r from-amber-500 via-red-600 to-amber-600 bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light">
            Have questions, feedback, or want to report a scam? We're here to help.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 px-4 bg-black border-b-2 border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-20">
            {/* Contact Info */}
            <div className="md:col-span-1">
              <h2 className="text-3xl font-black uppercase tracking-wider mb-8 text-amber-500">
                Contact Info
              </h2>

              <div className="space-y-8">
                {[
                  {
                    icon: '📧',
                    title: 'Email',
                    info: 'support@safehire.io',
                    action: 'Send Email',
                  },
                  {
                    icon: '📱',
                    title: 'Phone',
                    info: '+91 9876 543 210',
                    action: 'Call Us',
                  },
                  {
                    icon: '📍',
                    title: 'Address',
                    info: 'Bangalore, India',
                    action: 'View Map',
                  },
                  {
                    icon: '⏰',
                    title: 'Hours',
                    info: 'Mon - Fri: 9 AM - 6 PM IST',
                    action: '',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="border-b-2 border-gray-800 pb-8">
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <h3 className="text-lg font-black uppercase tracking-wider mb-2 text-white">{item.title}</h3>
                    <p className="text-gray-300 mb-3">{item.info}</p>
                    {item.action && (
                      <button className="text-amber-500 font-bold uppercase tracking-wider hover:text-amber-400 transition">
                        {item.action} →
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t-2 border-gray-800">
                <h3 className="text-lg font-black uppercase tracking-wider mb-4 text-white">Follow Us</h3>
                <div className="flex gap-4">
                  {['Twitter', 'LinkedIn', 'Instagram', 'Facebook'].map((social, idx) => (
                    <a
                      key={idx}
                      href="#"
                      className="px-4 py-2 border-2 border-gray-800 hover:border-amber-600 hover:text-amber-500 font-bold uppercase tracking-wider text-sm transition"
                    >
                      {social.charAt(0)}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <h2 className="text-3xl font-black uppercase tracking-wider mb-8 text-white">
                Send Us A Message
              </h2>

              {submitted ? (
                <div className="bg-gradient-to-br from-amber-900/30 to-green-900/30 border-2 border-amber-600 p-12 text-center">
                  <div className="text-6xl mb-4">✓</div>
                  <h3 className="text-2xl font-black uppercase tracking-wider text-amber-500 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-300">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-amber-500 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-3 bg-gray-900 border-2 border-gray-800 hover:border-amber-600 focus:border-amber-600 outline-none text-white font-bold uppercase tracking-wider transition"
                      placeholder="Full Name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-amber-500 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-3 bg-gray-900 border-2 border-gray-800 hover:border-amber-600 focus:border-amber-600 outline-none text-white font-bold uppercase tracking-wider transition"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-amber-500 mb-2">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-3 bg-gray-900 border-2 border-gray-800 hover:border-amber-600 focus:border-amber-600 outline-none text-white font-bold uppercase tracking-wider transition"
                    >
                      <option value="">Select a subject</option>
                      <option value="support">Support Request</option>
                      <option value="feedback">Feedback</option>
                      <option value="scam-report">Report a Scam</option>
                      <option value="partnership">Partnership Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-amber-500 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-6 py-3 bg-gray-900 border-2 border-gray-800 hover:border-amber-600 focus:border-amber-600 outline-none text-white font-bold uppercase tracking-wider transition resize-none"
                      placeholder="Your message here..."
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold uppercase tracking-wider border-2 border-amber-600 transition-all"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="border-t-2 border-gray-800 pt-20">
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-wider mb-16 text-center text-white">
              Frequently Asked
            </h2>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  q: 'How quickly will you respond?',
                  a: 'We aim to respond to all inquiries within 24 hours. For urgent issues, contact our support team directly.',
                },
                {
                  q: 'How do I report a scam?',
                  a: 'Use the "Report a Scam" option in the contact form, or email support@safehire.io with details and screenshots.',
                },
                {
                  q: 'Can I schedule a demo?',
                  a: 'Yes! Select "Other" in the subject line and mention you want a demo. Our sales team will contact you.',
                },
                {
                  q: 'Do you offer partnerships?',
                  a: 'We\'re open to partnerships with educational institutions and NGOs. Email partnerships@safehire.io to discuss.',
                },
              ].map((faq, idx) => (
                <div key={idx} className="bg-gray-900/50 border-2 border-gray-800 p-6 hover:border-amber-600 transition-all">
                  <h3 className="text-lg font-black uppercase tracking-wider text-white mb-3">{faq.q}</h3>
                  <p className="text-gray-300">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl md:text-7xl font-black uppercase tracking-wider mb-8">
            <span className="bg-gradient-to-r from-amber-500 via-red-600 to-amber-600 bg-clip-text text-transparent">
              Need Help?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Our support team is ready to assist you 24/7. Get in touch with us today.
          </p>
          <button
            onClick={() => (document.querySelector('input[name="name"]') as HTMLInputElement)?.focus()}
            className="px-12 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold text-lg uppercase tracking-wider border-2 border-amber-600 transition-all"
          >
            Write to Us
          </button>
        </div>
      </section>
    </div>
  );
}
