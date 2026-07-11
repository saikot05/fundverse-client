import React from 'react';
import Link from 'next/link';
import { Megaphone, Mail, ShieldAlert, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-separator text-muted py-12 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-foreground tracking-wider">
              <Megaphone className="h-5 w-5 text-accent" />
              <span>FundVerse</span>
            </Link>
            <p className="text-xs leading-relaxed">
              FundVerse is a modern, secure crowdfunding network enabling creators to showcase projects
              and backers to fund next-gen ideas through transparent credit exchanges.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/campaigns" className="hover:text-link transition-colors">All Campaigns</Link></li>
              <li><Link href="/about" className="hover:text-link transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-link transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Creators */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Creators</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/register?role=creator" className="hover:text-link transition-colors">Start a Campaign</Link></li>
              <li><Link href="/how-it-works" className="hover:text-link transition-colors">Funding Guidelines</Link></li>
              <li><Link href="/how-it-works#payouts" className="hover:text-link transition-colors">Withdrawal Process</Link></li>
            </ul>
          </div>

          {/* Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Security & Support</h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-success" />
                <span>Stripe Encrypted Payouts</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-accent" />
                <span>Verifiable Goal Milestones</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                <span>support@fundverse.io</span>
              </p>
            </div>
          </div>
        </div>

        <hr className="my-8 border-separator" />

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs">
          <p>© {new Date().getFullYear()} FundVerse. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
