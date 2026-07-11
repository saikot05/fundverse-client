import React from 'react';
import Link from 'next/link';
import { Megaphone, Mail, ShieldAlert, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 border-t border-white/10 text-slate-400 py-12 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white tracking-wider">
              <Megaphone className="h-5 w-5 text-indigo-400" />
              <span>FundVerse</span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-500">
              FundVerse is a modern, secure crowdfunding network enabling creators to showcase projects and backers to fund next-gen ideas through transparent credit exchanges.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/campaigns" className="hover:text-indigo-400 transition-colors">
                  All Campaigns
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-indigo-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-400 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Creators */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Creators</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/register?role=creator" className="hover:text-indigo-400 transition-colors">
                  Start a Campaign
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-indigo-400 transition-colors">
                  Funding Guidelines
                </Link>
              </li>
              <li>
                <Link href="/how-it-works#payouts" className="hover:text-indigo-400 transition-colors">
                  Withdrawal Process
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Security & Support</h4>
            <div className="space-y-2 text-xs text-slate-500">
              <p className="flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-emerald-500" />
                <span>Stripe Encrypted Payouts</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-indigo-400" />
                <span>Verifiable Goal Milestones</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>support@fundverse.io</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FundVerse. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link href="/privacy" className="hover:text-slate-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
