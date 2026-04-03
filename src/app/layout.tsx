'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import ClientNavbar from '@/components/ClientNavbar';

const inter = Inter({ subsets: ['latin'] });

// Metadata cannot be used in client components, moved to a separate file if needed
// export const metadata: Metadata = {
//   title: 'SafeHire - AI Fraud Detection for Job Seekers',
//   description: 'Advanced AI-powered fraud detection platform protecting Indian job seekers from scams',
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>SafeHire - AI Fraud Detection for Job Seekers</title>
        <meta name="description" content="Advanced AI-powered fraud detection platform protecting Indian job seekers from scams" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-black">
            <ClientNavbar />
            <main className="flex-1">
              {children}
            </main>

            <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-8 border-t border-slate-700">
              <div className="max-w-7xl mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8 mb-6">
                  <div>
                    <h3 className="font-bold text-lg mb-3">About SafeHire</h3>
                    <p className="text-slate-400 text-sm">Protecting Indian job seekers from recruitment fraud since 2026</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-3">Quick Links</h3>
                    <ul className="text-slate-400 text-sm space-y-1">
                      <li><a href="#" className="hover:text-white">About Us</a></li>
                      <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                      <li><a href="#" className="hover:text-white">Contact</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-3">Contact</h3>
                    <p className="text-slate-400 text-sm">support@safehire.in</p>
                    <p className="text-slate-400 text-sm">+91 XXXX XXX XXX</p>
                  </div>
                </div>
                <div className="border-t border-slate-700 pt-4 text-center text-slate-400 text-sm">
                  <p>&copy; 2026 SafeHire. Protecting Careers, Building Trust. 🇮🇳</p>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
