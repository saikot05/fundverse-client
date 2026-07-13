import React from 'react';
import { ShieldCheck, Scale, AlertTriangle, FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="flex-1 bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Please read these terms carefully before launching campaigns or pledging credits on FundVerse.
          </p>
        </div>

        {/* Key Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="glass p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="text-indigo-400 p-2 bg-indigo-500/10 rounded-lg w-fit">
              <Scale className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold">Funding Agreements</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Backers understand that pledging digital credits is a voluntary contribution supporting innovative projects.
            </p>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="text-violet-400 p-2 bg-violet-500/10 rounded-lg w-fit">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold">Creator Payouts</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Creators are legally required to fulfill project goals and describe progress milestones transparently to backers.
            </p>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="text-cyan-400 p-2 bg-cyan-500/10 rounded-lg w-fit">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold">Flagging & Auditing</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Admins reserve the right to audit campaigns, withhold suspicious payouts, or restrict accounts violating policies.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="glass p-8 rounded-3xl border border-white/5 space-y-6">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-indigo-400" />
              <span>1. User Accounts & Wallet Credits</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              You must register a valid account to buy credits or launch campaigns. Wallet credits hold a 1-to-1 conversion rate value for platform activities and can be loaded via Stripe checkouts. All balances are stored securely in our MongoDB instances.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-violet-400" />
              <span>2. Campaign Hosting Rules</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Creators must represent campaign pitches, budget goals, and delivery schedules accurately. Launching misleading or fraudulent pitches is strictly prohibited. Pledges are released once a campaign finishes and creator withdrawal requests are audited.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-cyan-400" />
              <span>3. Limitation of Liability</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              FundVerse acts as an intermediary crowdfunding escrow platform. While we flag and audit suspicious campaigns, we do not guarantee project completion or the suitability of campaign rewards. Users agree to participate at their own discretion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
