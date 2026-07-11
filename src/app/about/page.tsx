import React from 'react';
import { Target, Users, ShieldCheck, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex-1 bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            About FunVerse
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Empowering creators, innovators, and changemakers to fuel their dreams through transparent, credit-backed community support.
          </p>
        </div>

        {/* Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          <div className="glass p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="text-indigo-400 p-2 bg-indigo-500/10 rounded-lg w-fit">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Our Mission</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              We bridge the gap between creative ideation and financial execution. By leveraging credits, we provide a friction-free ecosystem for supporters to back projects they care about.
            </p>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="text-violet-400 p-2 bg-violet-500/10 rounded-lg w-fit">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">The Community</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Whether you are a developer, an artist, or a supporter backing the next generation of solar-powered grids, your interactions shape the future.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="glass p-8 rounded-2xl border border-white/5 text-center grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <h4 className="text-3xl font-extrabold text-indigo-400">$2.4M+</h4>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Total Pledged</p>
          </div>
          <div>
            <h4 className="text-3xl font-extrabold text-violet-400">12k+</h4>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Backers</p>
          </div>
          <div>
            <h4 className="text-3xl font-extrabold text-pink-400">98%</h4>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Success Rate</p>
          </div>
          <div>
            <h4 className="text-3xl font-extrabold text-cyan-400">450+</h4>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Campaigns</p>
          </div>
        </div>
      </div>
    </div>
  );
}
