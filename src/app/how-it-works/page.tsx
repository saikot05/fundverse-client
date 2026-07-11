import React from 'react';
import {
  Coins,
  Megaphone,
  UserCheck,
  ShieldCheck,
  TrendingUp,
  Banknote,
} from 'lucide-react';
import Link from 'next/link';

export default function HowItWorksPage() {
  const steps = [
    {
      icon: <UserCheck className="h-6 w-6 text-indigo-400" />,
      title: '1. Register & Pick a Role',
      desc: 'Sign up as either a Supporter or a Creator. Administrators verify account details and help route dashboards.',
    },
    {
      icon: <Coins className="h-6 w-6 text-indigo-400" />,
      title: '2. Acquire Wallet Credits',
      desc: 'Supporters can purchase digital wallet credits using Stripe cards. Credits maintain a 1-to-1 ratio with USD.',
    },
    {
      icon: <Megaphone className="h-6 w-6 text-indigo-400" />,
      title: '3. Pitch or Support Campaigns',
      desc: 'Creators outline funding targets and launch campaigns. Supporters explore active listings and pledge credits.',
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-indigo-400" />,
      title: '4. Progress & Goal Verification',
      desc: 'Campaign indicators track real-time funding status. Notifications broadcast goals achieved and user alerts.',
    },
    {
      icon: <Banknote className="h-6 w-6 text-indigo-400" />,
      title: '5. Withdrawals Approval',
      desc: 'Creators request payout withdrawals. Administrators evaluate bank details and transfer funds securely.',
    },
  ];

  return (
    <div className="flex-1 bg-slate-950 p-6 sm:p-10 text-white max-w-5xl mx-auto w-full">
      <div className="text-center py-10 max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">
          How FundVerse Works
        </h1>
        <p className="text-sm text-slate-400">
          A step-by-step guide to our secure and transparent crowdfunding mechanics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
        {steps.map((step, idx) => (
          <div key={idx} className="glass p-6 rounded-2xl flex gap-4 items-start">
            <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl shrink-0">
              {step.icon}
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">{step.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass p-8 rounded-3xl text-center space-y-6 max-w-3xl mx-auto">
        <h3 className="text-xl font-bold text-white flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-5 w-5 text-indigo-400" />
          <span>Security-First Infrastructure</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Every payment intent is processed using Stripe's encrypted API. Wallet balance balances are locked securely and payout clearance requires manual administrative verification to prevent fraudulent operations.
        </p>
        <div className="pt-2">
          <Link
            href="/register"
            className="inline-flex items-center gap-1 bg-indigo-500 hover:bg-indigo-600 px-6 py-2.5 rounded-xl text-xs font-semibold"
          >
            <span>Register Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
