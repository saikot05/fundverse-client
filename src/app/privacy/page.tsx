import React from 'react';
import { Shield, Eye, Lock, FileText } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="flex-1 bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Learn how FundVerse secures and respects your account credentials, transactions, and data.
          </p>
        </div>

        {/* Key Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="glass p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="text-indigo-400 p-2 bg-indigo-500/10 rounded-lg w-fit">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold">Secure Transactions</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              All payment information is processed through Stripe using standard end-to-end tokenized encryption.
            </p>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="text-violet-400 p-2 bg-violet-500/10 rounded-lg w-fit">
              <Eye className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold">Data Privacy</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              We never sell or distribute your private account details, project pitches, or pledge history.
            </p>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="text-cyan-400 p-2 bg-cyan-500/10 rounded-lg w-fit">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold">Account Integrity</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              JWT security and Better Auth sessions ensure that only authorized actions can modify your wallet balance.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="glass p-8 rounded-3xl border border-white/5 space-y-6">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-indigo-400" />
              <span>1. Information We Collect</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We collect your name, email address, password hash, and profile image URL when you register an account. We also keep a record of your digital wallet credit balances, campaign funding pledges, and Stripe checkout logs.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-violet-400" />
              <span>2. How We Use Your Data</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We use your data strictly to manage account access, process secure credit transfers, send in-platform notifications, track milestone payouts, and ensure compliance with our platform guidelines.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-cyan-400" />
              <span>3. Contact Privacy Inquiries</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              If you have any questions or want to request a copy or deletion of your personal account information, please contact us directly at <span className="text-indigo-400 font-semibold">privacy@fundverse.io</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
